// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  reportId: string;
  recipientEmail: string;
  recipientName?: string;
  subject?: string;
  includeReportLink?: boolean;
  includePdfAttachment?: boolean;
  customMessage?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const APP_URL = Deno.env.get('APP_URL') || 'https://unilancerlabs.com';

    if (!RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const {
      reportId,
      recipientEmail,
      recipientName,
      subject,
      includeReportLink = true,
      customMessage,
    }: EmailRequest = await req.json();

    if (!reportId || !recipientEmail) {
      throw new Error('Missing required fields: reportId, recipientEmail');
    }

    // Fetch report details
    const { data: report, error: reportError } = await supabase
      .from('digital_analysis_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      throw new Error('Report not found');
    }

    // Generate report link
    const reportLink = `${APP_URL}/report/${report.public_id}`;

    // Email template
    const emailSubject = subject || `${report.company_name} - Dijital Analiz Raporunuz Hazır`;
    
    const emailHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dijital Analiz Raporu</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
              <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/digibot-logo-02%20(1).webp" alt="DigiBot" width="80" style="margin-bottom: 16px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Dijital Analiz Raporu</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Unilancer Labs</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Merhaba${recipientName ? ` ${recipientName}` : ''},
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                <strong>${report.company_name}</strong> için hazırladığımız dijital analiz raporu tamamlandı! 🎉
              </p>
              
              ${customMessage ? `
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 0 0 24px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                  ${customMessage}
                </p>
              </div>
              ` : ''}
              
              ${report.digital_score ? `
              <div style="text-align: center; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 24px; border-radius: 12px; margin: 0 0 24px 0;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Dijital Skor</p>
                <p style="color: #10b981; font-size: 48px; font-weight: 700; margin: 0;">${report.digital_score}<span style="font-size: 24px; color: #6b7280;">/100</span></p>
              </div>
              ` : ''}
              
              ${includeReportLink ? `
              <div style="text-align: center; margin: 32px 0;">
                <a href="${reportLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                  📊 Raporu Görüntüle
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0 0 24px 0;">
                veya bu linki tarayıcınıza yapıştırın:<br>
                <a href="${reportLink}" style="color: #10b981;">${reportLink}</a>
              </p>
              ` : ''}
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 24px 0 0 0;">
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                  <strong>💡 DigiBot ile sohbet edin!</strong>
                </p>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                  Raporunuzu incelerken sorularınızı DigiBot'a sorabilirsiniz. Yapay zeka asistanımız size anında yardımcı olacak.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                Unilancer Labs ile dijital dönüşümünüzü hızlandırın
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Unilancer Labs. Tüm hakları saklıdır.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DigiBot <digibot@unilancerlabs.com>',
        to: [recipientEmail],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error(`Email sending failed: ${resendResponse.status}`);
    }

    const resendData = await resendResponse.json();

    // Update report with email sent timestamp
    await supabase
      .from('digital_analysis_reports')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('id', reportId);

    // Log analytics event
    await supabase.from('report_analytics').insert({
      report_id: reportId,
      event_type: 'email_sent',
      event_data: {
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        resend_id: resendData.id,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: resendData.id,
        message: 'Email sent successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-report-email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
