import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record, type } = await req.json()

    // E-posta şablonları
    const emailTemplates = {
      freelancer_applications: {
        subject: 'Yeni Freelancer Başvurusu',
        body: `
          <h2>Yeni Freelancer Başvurusu Alındı</h2>
          <p><strong>İsim:</strong> ${record.full_name}</p>
          <p><strong>E-posta:</strong> ${record.email}</p>
          <p><strong>Telefon:</strong> ${record.phone || 'Belirtilmedi'}</p>
          <p><strong>Konum:</strong> ${record.location}</p>
          <p><strong>Çalışma Tercihi:</strong> ${record.work_preference}</p>
          <p><strong>Ana Uzmanlık Alanları:</strong> ${record.main_expertise.join(', ')}</p>
          <p><strong>Alt Uzmanlık Alanları:</strong> ${record.sub_expertise.join(', ')}</p>
          <p><strong>Eğitim Durumu:</strong> ${record.education_status}</p>
          <p><strong>Çalışma Durumu:</strong> ${record.work_status}</p>
          <hr>
          <h3>Hakkında</h3>
          <p>${record.about_text}</p>
          ${record.cv_url ? `<p><a href="${record.cv_url}">CV'yi Görüntüle</a></p>` : ''}
          ${record.portfolio_url ? `<p><a href="${record.portfolio_url}">Portfolyoyu Görüntüle</a></p>` : ''}
        `
      },
      project_requests: {
        subject: 'Yeni Proje Talebi',
        body: `
          <h2>Yeni Proje Talebi Alındı</h2>
          <p><strong>Firma:</strong> ${record.company_name}</p>
          <p><strong>İletişim Kişisi:</strong> ${record.contact_name}</p>
          <p><strong>E-posta:</strong> ${record.email}</p>
          <p><strong>Telefon:</strong> ${record.phone || 'Belirtilmedi'}</p>
          <p><strong>Hizmet Kategorileri:</strong> ${record.service_categories.join(', ')}</p>
          <p><strong>Bütçe Aralığı:</strong> ${record.budget_range || 'Belirtilmedi'}</p>
          <p><strong>İstenen Teslim Süresi:</strong> ${record.timeline || 'Belirtilmedi'}</p>
          <hr>
          <h3>Proje Açıklaması</h3>
          <p>${record.project_description}</p>
          ${record.brief_url ? `<p><a href="${record.brief_url}">Brief'i Görüntüle</a></p>` : ''}
        `
      }
    }

    const template = emailTemplates[type]
    if (template) {
      const client = new SmtpClient();

      await client.connectTLS({
        hostname: Deno.env.get('SMTP_HOSTNAME')!,
        port: parseInt(Deno.env.get('SMTP_PORT')!),
        username: Deno.env.get('SMTP_USERNAME')!,
        password: Deno.env.get('SMTP_PASSWORD')!,
      });

      await client.send({
        from: Deno.env.get('SMTP_FROM')!,
        to: Deno.env.get('NOTIFICATION_EMAIL')!,
        subject: template.subject,
        content: template.body,
        html: template.body,
      });

      await client.close();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Notification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})