import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFICATION_EMAIL = 'info@unilancerlabs.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface EmailPayload {
  type: string
  record: Record<string, any>
}

// Email içeriği oluştur
function createEmailContent(type: string, record: Record<string, any>): { subject: string; html: string } {
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })
  
  switch (type) {
    case 'contact_submissions':
      return {
        subject: `📬 Yeni İletişim Mesajı - ${record.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📬 Yeni İletişim Mesajı</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Ad Soyad:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${record.email}">${record.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Konu:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Mesaj:</td>
                  <td style="padding: 10px 0;">${record.message}</td>
                </tr>
              </table>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Gönderim: ${timestamp}</p>
            </div>
          </div>
        `
      }

    case 'newsletter_subscriptions':
      return {
        subject: `📰 Yeni Bülten Abonesi`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📰 Yeni Bülten Abonesi</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <p style="font-size: 16px;"><strong>Email:</strong> <a href="mailto:${record.email}">${record.email}</a></p>
              <p style="font-size: 14px; color: #666;">Kaynak: ${record.source || 'footer'}</p>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Kayıt: ${timestamp}</p>
            </div>
          </div>
        `
      }

    case 'project_requests':
      return {
        subject: `🚀 Yeni Proje Talebi - ${record.company_name || record.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🚀 Yeni Proje Talebi</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Firma:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.company_name || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">İsim:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${record.email}">${record.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.phone || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Bütçe:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.budget || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Detay:</td>
                  <td style="padding: 10px 0;">${record.description || record.message || '-'}</td>
                </tr>
              </table>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Gönderim: ${timestamp}</p>
            </div>
          </div>
        `
      }

    case 'freelancer_applications':
      return {
        subject: `👨‍💻 Yeni Freelancer Başvurusu - ${record.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">👨‍💻 Yeni Freelancer Başvurusu</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Ad Soyad:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${record.email}">${record.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.phone || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Üniversite:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.university || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Bölüm:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.department || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Beceriler:</td>
                  <td style="padding: 10px 0;">${Array.isArray(record.skills) ? record.skills.join(', ') : (record.skills || '-')}</td>
                </tr>
              </table>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Başvuru: ${timestamp}</p>
            </div>
          </div>
        `
      }

    default:
      return {
        subject: `🔔 Yeni Bildirim - ${type}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Yeni Bildirim</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <p><strong>Tür:</strong> ${type}</p>
              <pre style="background: #fff; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(record, null, 2)}</pre>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Zaman: ${timestamp}</p>
            </div>
          </div>
        `
      }
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: EmailPayload = await req.json()
    const { type, record } = payload

    console.log('Received notification request:', { type, record })

    if (!type || !record) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing type or record' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { subject, html } = createEmailContent(type, record)

    // Resend API ile email gönder
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Unilancer <onboarding@resend.dev>',
        to: [NOTIFICATION_EMAIL],
        subject: subject,
        html: html,
      }),
    })

    const emailResult = await emailResponse.json()
    console.log('Resend API response:', emailResult)

    if (!emailResponse.ok) {
      console.error('Resend API error:', emailResult)
      return new Response(
        JSON.stringify({ success: false, error: emailResult.message || 'Email send failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Email notification error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
