import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('trigger-analysis: Starting...')
    
    // Use service role key for server-side operations (bypasses RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let requestBody;
    try {
      requestBody = await req.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      throw new Error('Invalid JSON in request body')
    }
    
    const { report_id } = requestBody
    console.log('trigger-analysis: report_id =', report_id)

    if (!report_id) {
      throw new Error('report_id is required')
    }

    // Fetch the report details
    console.log('trigger-analysis: Fetching report from database...')
    const { data: report, error: reportError } = await supabaseClient
      .from('digital_analysis_reports')
      .select('*')
      .eq('id', report_id)
      .single()

    if (reportError) {
      console.error('Database error:', reportError)
      throw new Error(`Database error: ${reportError.message}`)
    }
    
    if (!report) {
      throw new Error(`Report not found: ${report_id}`)
    }
    
    console.log('trigger-analysis: Report found:', report.company_name)

    // Update status to processing
    await supabaseClient
      .from('digital_analysis_reports')
      .update({ 
        status: 'processing',
        webhook_triggered_at: new Date().toISOString()
      })
      .eq('id', report_id)

    // Get n8n webhook URL and credentials from environment variables
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    const n8nApiKey = Deno.env.get('N8N_API_KEY') // Optional: if webhook requires auth
    
    console.log('trigger-analysis: N8N_WEBHOOK_URL =', n8nWebhookUrl ? 'SET' : 'NOT SET')

    if (!n8nWebhookUrl) {
      throw new Error('N8N_WEBHOOK_URL environment variable is not set. Please add it in Supabase Dashboard > Edge Functions > Secrets')
    }

    // Prepare payload for n8n webhook
    const webhookPayload = {
      report_id: report.id,
      company_name: report.company_name,
      website_url: report.website_url,
      linkedin_url: report.linkedin_url,
      priority: report.priority,
      created_at: report.created_at,
      // Callback URL for n8n to send results back
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/receive-analysis-results`
    }

    // Call n8n webhook
    const webhookHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add API key if configured
    if (n8nApiKey) {
      webhookHeaders['Authorization'] = `Bearer ${n8nApiKey}`
    }

    console.log('trigger-analysis: Calling n8n webhook (fire-and-forget)...')
    
    // 🔥 FIRE AND FORGET - Don't await, don't wait for n8n response
    // n8n workflow takes 5+ minutes, we can't wait for it
    // n8n will call back to receive-analysis-results when done
    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: webhookHeaders,
      body: JSON.stringify(webhookPayload),
    }).then(response => {
      console.log('trigger-analysis: n8n responded with status:', response.status)
    }).catch(err => {
      console.error('trigger-analysis: Background webhook error:', err.message)
    })

    // Return immediately without waiting for n8n
    const webhookResult = { status: 'triggered', mode: 'fire-and-forget' }
    console.log('trigger-analysis: Webhook triggered, returning immediately')
    
    console.log('trigger-analysis: Success!')

    // Store webhook request ID if provided
    if (webhookResult.execution_id || webhookResult.workflow_id) {
      await supabaseClient
        .from('digital_analysis_reports')
        .update({ 
          webhook_request_id: webhookResult.execution_id || webhookResult.workflow_id
        })
        .eq('id', report_id)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Analysis webhook triggered successfully',
        webhook_result: webhookResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in trigger-analysis function:', error)
    console.error('Error details:', JSON.stringify({
      message: error.message,
      stack: error.stack,
      name: error.name
    }))

    // Try to update report status to failed
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      // Get report_id from the request if possible
      const errorMessage = error.message || 'Unknown error'
      
      // Log environment variables status (not values)
      console.error('Environment check:', {
        SUPABASE_URL: Deno.env.get('SUPABASE_URL') ? 'SET' : 'NOT SET',
        SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY') ? 'SET' : 'NOT SET',
        SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'SET' : 'NOT SET',
        N8N_WEBHOOK_URL: Deno.env.get('N8N_WEBHOOK_URL') ? 'SET' : 'NOT SET',
      })
      
    } catch (updateError) {
      console.error('Error in error handler:', updateError)
    }

    const errorMessage = error.message || 'Unknown error'
    const isConfigError = errorMessage.includes('N8N_WEBHOOK_URL') || errorMessage.includes('environment variable')
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: {
          type: error.name,
          hint: isConfigError
            ? 'Please set N8N_WEBHOOK_URL in Supabase Dashboard > Project Settings > Edge Functions > Secrets'
            : 'Check Supabase Edge Function logs for details'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: isConfigError ? 503 : 400 
      }
    )
  }
})
