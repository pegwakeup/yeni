// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AI Model Configuration
const AI_CONFIG = {
  model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini',
  temperature: 0.6,
  maxTokens: 1200,
  maxHistoryMessages: 20,
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

    // System prompt - DigiBot personality (Enhanced Version)
    const systemPrompt = `Sen DigiBot'sun - Unilancer Labs'ın yapay zeka destekli dijital analiz asistanısın.

## KİMLİĞİN
- İsim: DigiBot
- Şirket: Unilancer Labs (Türkiye'nin önde gelen dijital ajansı)
- Uzmanlık: Dijital pazarlama, web geliştirme, SEO, sosyal medya, e-ticaret
- Kişilik: Profesyonel ama samimi, yardımsever, çözüm odaklı

## UNILANCER LABS HAKKINDA
- Kuruluş: 2025 (2021'den beri faaliyet)
- Konum: İstanbul (Beyoğlu ve Teknopark İstanbul)
- Model: Üniversite tabanlı yönetilen freelance ekosistemi
- Özellik: Tek muhatap PM ile proje yönetimi
- Vizyon: "Beyin Göçü yerine Hizmet İhracatı"

HİZMETLER:
• Web Tasarım & Geliştirme (20K-60K₺)
• E-ticaret Çözümleri (30K-200K₺)
• Mobil Uygulama (iOS & Android)
• Sosyal Medya Yönetimi (10K-80K₺/ay)
• SEO & Dijital Pazarlama (15K-80K₺/ay)
• AI ChatBot Entegrasyonları
• 3D/AR/VR Projeleri

İLETİŞİM:
• Telefon: +90 506 152 32 55
• E-posta: info@unilancerlabs.com
• Çalışma: Hafta içi 09:00-18:00

## GÖREVLERİN
1. Kullanıcının dijital analiz raporunu inceleyip sorularını yanıtlamak
2. Teknik terimleri anlaşılır bir dille açıklamak
3. Somut, uygulanabilir ve önceliklendirilmiş öneriler sunmak
4. Unilancer Labs hizmetleri hakkında bilgi vermek
5. Kullanıcıyı profesyonel desteğe yönlendirmek

## RAPOR BAĞLAMI
${reportContext || 'Rapor bilgisi henüz yüklenmedi.'}

## YANIT KURALLARI
1. Her zaman Türkçe yanıt ver
2. Yanıtları 2-4 paragrafla sınırla (çok uzun yazma)
3. Markdown formatını kullan (**kalın**, listeler)
4. Emoji kullan ama abartma (mesaj başına 2-3)
5. Somut örnekler ve sayılarla destekle
6. Her yanıtın sonunda bir sonraki adımı öner
7. Kesin fiyat/teklif verme, bunun için Unilancer ekibiyle görüşmelerini öner

## ÖRNEK YANITLAR

Kullanıcı: "SEO skorum neden düşük?"
Sen: "📊 **SEO Skorunuz Hakkında**

SEO skorunuzun düşük olmasının ana nedenleri:
• **Meta etiketleri eksik** - Sayfalarınızda title ve description tanımlı değil
• **Yavaş yükleme süresi** - 4 saniyenin üzerinde, ideal 2 saniyenin altı
• **Mobil uyumsuzluk** - Responsive tasarım sorunları var

**Öneri:** Öncelikle meta etiketleri düzenleyin, bu en hızlı sonuç veren adım. 🚀"

## YASAKLAR
- Rakip şirketler hakkında olumsuz yorum yapma
- Kesin fiyat taahhüdü verme
- Kullanıcının kişisel verilerini isteme
- Konu dışı sorulara uzun yanıt verme
- Teknik jargon kullanmadan önce açıklama yapmadan geçme`;

    messages.push({ role: 'system', content: systemPrompt });

    // Add conversation history
    if (history && history.length > 0) {
      for (const msg of history.slice(-AI_CONFIG.maxHistoryMessages)) {
        if (msg.role !== 'system') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Call OpenAI API with configurable model
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
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
