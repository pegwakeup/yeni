// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  reportId: string;
  sessionId: string;
  message: string;
  reportContext?: string;
  viewerId?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { reportId, sessionId, message, reportContext, viewerId }: ChatRequest = await req.json();

    if (!reportId || !sessionId || !message) {
      throw new Error('Missing required fields: reportId, sessionId, message');
    }

    // Get conversation history for this session
    const { data: history, error: historyError } = await supabase
      .from('report_chat_conversations')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(20);

    if (historyError) {
      console.error('Error fetching history:', historyError);
    }

    // Build messages array
    const messages: ChatMessage[] = [];

    // System prompt - DigiBot personality
    const systemPrompt = `Sen DigiBot'sun - Unilancer'ın dijital analiz asistanı. Şirketlerin dijital varlıklarını analiz edip iyileştirme önerileri sunuyorsun.

Görevin:
- Kullanıcının dijital analiz raporunu incelemek ve sorularını yanıtlamak
- Teknik terimleri anlaşılır şekilde açıklamak
- Somut ve uygulanabilir öneriler sunmak
- Dostane ve profesyonel bir ton kullanmak

Rapor Bağlamı:
${reportContext || 'Rapor bilgisi yükleniyor...'}

Kurallar:
1. Sadece bu rapora ve dijital pazarlama konularına odaklan
2. Yanıtları kısa ve öz tut (max 3-4 paragraf)
3. Türkçe yanıt ver
4. Emoji kullanabilirsin ama abartma
5. Fiyat veya teklif verme, bunun için ekiple iletişime geçmelerini öner`;

    messages.push({ role: 'system', content: systemPrompt });

    // Add conversation history
    if (history && history.length > 0) {
      for (const msg of history) {
        if (msg.role !== 'system') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const assistantMessage = openaiData.choices[0]?.message?.content || 'Üzgünüm, bir hata oluştu.';
    const tokensUsed = openaiData.usage?.total_tokens || 0;

    // Save user message to database
    await supabase.from('report_chat_conversations').insert({
      report_id: reportId,
      session_id: sessionId,
      viewer_id: viewerId || null,
      role: 'user',
      content: message,
      tokens_used: 0,
    });

    // Save assistant response to database
    await supabase.from('report_chat_conversations').insert({
      report_id: reportId,
      session_id: sessionId,
      viewer_id: viewerId || null,
      role: 'assistant',
      content: assistantMessage,
      tokens_used: tokensUsed,
    });

    // Log analytics event
    await supabase.from('report_analytics').insert({
      report_id: reportId,
      viewer_id: viewerId || null,
      event_type: 'chat',
      event_data: {
        session_id: sessionId,
        message_length: message.length,
        response_length: assistantMessage.length,
        tokens_used: tokensUsed,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: assistantMessage,
        tokensUsed,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in report-chat:', error);
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
