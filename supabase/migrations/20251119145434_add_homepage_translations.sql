/*
  # Add Homepage Translation Seeds

  1. Content
    - Adds Turkish translations for homepage content
    - Includes hero section, services, for whom, why us, and FAQ content
    - Uses content_key system for easy reference
  
  2. Structure
    - All content keys follow pattern: page.section.item.field
    - Example: home.services.website.title
    - Turkish language (tr) set as source content
  
  3. Security
    - No RLS changes needed (already configured)
*/

-- Insert hero section translations
INSERT INTO translations (content_key, language, translated_text, content_hash) VALUES
('home.hero.subtitle', 'tr', 'Dijital Dünyada Yerinizi Alın', '1a2b3c'),
('home.hero.title', 'tr', 'Projelerinizi Hayata Geçirin', '2b3c4d'),
('home.hero.description', 'tr', 'Seçkin freelancer ekipleriyle projelerinizi gerçeğe dönüştürün. Kaliteli hizmet, uygun fiyat.', '3c4d5e'),
('home.hero.cta.primary', 'tr', 'Proje Başlat', '4d5e6f'),
('home.hero.cta.secondary', 'tr', 'Ekibe Katıl', '5e6f7g')
ON CONFLICT (content_key, language) DO NOTHING;

-- Insert service translations
INSERT INTO translations (content_key, language, translated_text, content_hash) VALUES
('home.services.website.title', 'tr', 'Web Sitesi Geliştirme', '6f7g8h'),
('home.services.website.description', 'tr', 'Modern ve responsive web siteleri', '7g8h9i'),
('home.services.ecommerce.title', 'tr', 'E-Ticaret Çözümleri', '8h9i0j'),
('home.services.ecommerce.description', 'tr', 'Güçlü ve ölçeklenebilir online mağazalar', '9i0j1k'),
('home.services.graphics.title', 'tr', 'Grafik Tasarım', '0j1k2l'),
('home.services.graphics.description', 'tr', 'Markanızı yansıtan özgün tasarımlar', '1k2l3m'),
('home.services.mobile.title', 'tr', 'Mobil Uygulama', '2l3m4n'),
('home.services.mobile.description', 'tr', 'iOS ve Android uygulama geliştirme', '3m4n5o'),
('home.services.marketing.title', 'tr', 'Dijital Pazarlama', '4n5o6p'),
('home.services.marketing.description', 'tr', 'SEO, sosyal medya ve içerik pazarlama', '5o6p7q'),
('home.services.3dar.title', 'tr', '3D & AR/VR', '6p7q8r'),
('home.services.3dar.description', 'tr', 'Sanal tur ve 3D modelleme hizmetleri', '7q8r9s'),
('home.services.ai.title', 'tr', 'Yapay Zeka Entegrasyonları', '8r9s0t'),
('home.services.ai.description', 'tr', 'AI destekli akıllı çözümler', '9s0t1u')
ON CONFLICT (content_key, language) DO NOTHING;

-- Insert "For Whom" section translations
INSERT INTO translations (content_key, language, translated_text, content_hash) VALUES
('home.forWhom.sme.title', 'tr', 'KOBİ ve İşletmeler', '0t1u2v'),
('home.forWhom.sme.description', 'tr', 'Küçük ve orta ölçekli işletmeler için uygun maliyetli dijital çözümler', '1u2v3w'),
('home.forWhom.sme.tag', 'tr', 'İşletme Sahibi', '2v3w4x'),
('home.forWhom.agencies.title', 'tr', 'Ajanslar ve Girişimler', '3w4x5y'),
('home.forWhom.agencies.description', 'tr', 'Yaratıcı ajanslar ve yeni girişimler için esnek proje desteği', '4x5y6z'),
('home.forWhom.agencies.tag', 'tr', 'Ajans & Girişim', '5y6z7a'),
('home.forWhom.freelancers.title', 'tr', 'Bireysel Projeler', '6z7a8b'),
('home.forWhom.freelancers.description', 'tr', 'Kişisel projeler ve portfolyo çalışmaları için profesyonel destek', '7a8b9c'),
('home.forWhom.freelancers.tag', 'tr', 'Bireysel', '8b9c0d')
ON CONFLICT (content_key, language) DO NOTHING;

-- Insert "Why Us" section translations
INSERT INTO translations (content_key, language, translated_text, content_hash) VALUES
('home.why.selectedTeams.title', 'tr', 'Seçkin Ekipler', '9c0d1e'),
('home.why.selectedTeams.description', 'tr', 'Her projede deneyimli ve uzman freelancer ekipleriyle çalışın', '0d1e2f'),
('home.why.projectManagement.title', 'tr', 'Kolay Proje Yönetimi', '1e2f3g'),
('home.why.projectManagement.description', 'tr', 'Projelerinizi tek platformdan takip edin ve yönetin', '2f3g4h'),
('home.why.pricing.title', 'tr', 'Şeffaf Fiyatlandırma', '3g4h5i'),
('home.why.pricing.description', 'tr', 'Net ve anlaşılır fiyatlandırma, gizli maliyet yok', '4h5i6j'),
('home.why.digitalize.title', 'tr', 'Dijitalleşin', '5i6j7k'),
('home.why.digitalize.description', 'tr', 'İşletmenizi dijital dünyaya taşıyın, rekabette öne çıkın', '6j7k8l')
ON CONFLICT (content_key, language) DO NOTHING;

-- Insert FAQ translations for employers
INSERT INTO translations (content_key, language, translated_text, content_hash) VALUES
('home.faq.employer.q1', 'tr', 'Proje teslim süresi ne kadar?', '7k8l9m'),
('home.faq.employer.a1', 'tr', 'Proje büyüklüğüne göre değişir. Genellikle 2-8 hafta arası sürer.', '8l9m0n'),
('home.faq.employer.q2', 'tr', 'Ödeme nasıl yapılır?', '9m0n1o'),
('home.faq.employer.a2', 'tr', 'Güvenli ödeme sistemi ile kredi kartı veya havale yapabilirsiniz.', '0n1o2p'),
('home.faq.employer.q3', 'tr', 'Revizyon hakkım var mı?', '1o2p3q'),
('home.faq.employer.a3', 'tr', 'Evet, projenizde belirlenen revizyon sayısı kadar değişiklik yapabilirsiniz.', '2p3q4r'),
('home.faq.employer.q4', 'tr', 'Proje sonrası destek var mı?', '3q4r5s'),
('home.faq.employer.a4', 'tr', 'Tüm projelerimizde 30 gün ücretsiz teknik destek sunuyoruz.', '4r5s6t'),
('home.faq.employer.q5', 'tr', 'Hangi sektörlerde hizmet veriyorsunuz?', '5s6t7u'),
('home.faq.employer.a5', 'tr', 'E-ticaret, kurumsal, eğitim, sağlık gibi tüm sektörlerde çalışıyoruz.', '6t7u8v')
ON CONFLICT (content_key, language) DO NOTHING;

-- Insert FAQ translations for freelancers
INSERT INTO translations (content_key, language, translated_text, content_hash) VALUES
('home.faq.freelancer.q1', 'tr', 'Nasıl başvuru yapabilirim?', '7u8v9w'),
('home.faq.freelancer.a1', 'tr', 'Katıl butonuna tıklayarak başvuru formunu doldurabilirsiniz.', '8v9w0x'),
('home.faq.freelancer.q2', 'tr', 'Kazancım nasıl belirlenir?', '9w0x1y'),
('home.faq.freelancer.a2', 'tr', 'Uzmanlık alanınız ve deneyiminize göre proje başına kazanç elde edersiniz.', '0x1y2z'),
('home.faq.freelancer.q3', 'tr', 'Ödeme ne zaman yapılır?', '1y2z3a'),
('home.faq.freelancer.a3', 'tr', 'Proje tamamlandıktan sonra 3-5 iş günü içinde ödeme yapılır.', '2z3a4b'),
('home.faq.freelancer.q4', 'tr', 'Hangi alanlarda freelancer arıyorsunuz?', '3a4b5c'),
('home.faq.freelancer.a4', 'tr', 'Yazılım, tasarım, pazarlama, içerik üretimi gibi pek çok alanda.', '4b5c6d'),
('home.faq.freelancer.q5', 'tr', 'Uzaktan mı çalışacağım?', '5c6d7e'),
('home.faq.freelancer.a5', 'tr', 'Evet, tamamen uzaktan ve esnek çalışma imkanı sunuyoruz.', '6d7e8f')
ON CONFLICT (content_key, language) DO NOTHING;

-- Insert section headers
INSERT INTO translations (content_key, language, translated_text, content_hash) VALUES
('home.services.title', 'tr', 'Hizmetlerimiz', '7e8f9g'),
('home.services.subtitle', 'tr', 'Size özel çözümler sunuyoruz', '8f9g0h'),
('home.forWhom.title', 'tr', 'Kimler İçin?', '9g0h1i'),
('home.forWhom.subtitle', 'tr', 'Farklı ihtiyaçlara uygun çözümler', '0h1i2j'),
('home.why.title', 'tr', 'Neden Unilancer?', '1i2j3k'),
('home.why.subtitle', 'tr', 'Başarınız için en iyi ortağınız', '2j3k4l'),
('home.faq.title', 'tr', 'Sıkça Sorulan Sorular', '3k4l5m'),
('home.faq.employer.tab', 'tr', 'İşveren', '4l5m6n'),
('home.faq.freelancer.tab', 'tr', 'Freelancer', '5m6n7o')
ON CONFLICT (content_key, language) DO NOTHING;