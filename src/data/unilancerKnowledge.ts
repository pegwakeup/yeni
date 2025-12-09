// Unilancer Labs Knowledge Base for DigiBot
// Bu dosya DigiBot'un Unilancer Labs hakkında bilgi sahibi olmasını sağlar

export const unilancerKnowledge = {
  company: {
    legalName: "UNILANCER LABS BİLİŞİM HİZMETLERİ ANONİM ŞİRKETİ",
    brandName: "Unilancer Labs",
    founded: 2025,
    origins: 2021,
    phone: "+90 (506) 152 32 55",
    workingHours: "Hafta içi 09:00–18:00 (UTC+3)",
    emails: {
      sales: "sales@unilancerlabs.com",
      general: "info@unilancerlabs.com"
    },
    offices: [
      { name: "Cube Beyoğlu", location: "Beyoğlu / İstanbul" },
      { name: "Teknopark İstanbul", location: "Pendik / İstanbul" }
    ]
  },

  team: [
    { name: "Emrah Er", title: "CEO", email: "emrah@unilancerlabs.com" },
    { name: "Taha Karahüseyinoğlu", title: "COO", email: "taha@unilancerlabs.com" },
    { name: "Koray Andırınlı", title: "Program Manager", email: "koray@unilancerlabs.com" },
    { name: "Selvinaz Deniz Koca", title: "Sales & Marketing Director", email: "deniz@unilancerlabs.com" }
  ],

  about: {
    description: "Unilancer Labs, üniversite tabanlı yönetilen freelance ekosistemi kuran ve işletmelere tek muhataplı proje teslimi sağlayan bir teknoloji ve hizmet şirketidir.",
    vision: "Beyin Göçü yerine Hizmet İhracatı odağıyla genç yetenekleri Türkiye'de tutup global pazarlara hizmet ihraç etmek.",
    mission: "Üniversite öğrencileri ve genç freelancer'ları proje-bazlı üretim ve mentorlukla profesyonel hayata hazırlamak; işletmelere ajans standartlarında, sözleşmeli ve garantili dijital hizmet sunmak.",
    model: "Ajans disiplinini freelance esnekliğiyle birleştiren hibrit yapı (Freelance + PM + Standart süreçler).",
    uniqueValue: "Tüm müşteri iletişimi ve proje koordinasyonu tek muhatap Proje Yöneticisi (PM) üzerinden yürütülür."
  },

  services: [
    { name: "Yapay Zeka ChatBot", description: "İşletmelere özel yapay zeka destekli chatbot çözümleri. Brief toplama, ön analiz ve iletişim otomasyonu." },
    { name: "Web Tasarım", description: "Kurumsal web, e-ticaret ve özel paneller için modern çözümler." },
    { name: "Mobil Uygulama Geliştirme", description: "iOS ve Android için performanslı ve ölçeklenebilir uygulamalar." },
    { name: "Grafik Tasarım", description: "Logo, kurumsal kimlik, sosyal medya kreatifleri ve kampanya görselleri." },
    { name: "Sosyal Medya Yönetimi", description: "İçerik stratejisi, üretim, planlama ve analiz." },
    { name: "Reklam ve Pazarlama", description: "Google, Meta, LinkedIn gibi platformlarda performans odaklı reklam yönetimi." },
    { name: "E-ticaret Danışmanlığı", description: "Altyapı kurulumu, SEO, ürün yönetimi ve satış artırıcı stratejiler." },
    { name: "3D - AR - VR Projeleri", description: "Sanal tur, 3D ürün görselleştirme ve artırılmış gerçeklik uygulamaları." }
  ],

  pricing: {
    note: "Tutarlar kapsam, altyapı, içerik yoğunluğu ve modül sayısına göre değişir. Aralıklar KDV hariç örnektir.",
    packages: [
      { name: "Kurumsal Tanıtım Sitesi", minTRY: 20000, maxTRY: 60000 },
      { name: "Fonksiyonel Web Sitesi / Web Uygulaması", minTRY: 50000, maxTRY: 1000000 },
      { name: "E-Ticaret Sitesi", minTRY: 30000, maxTRY: 200000, period: "yıllık lisans + kurulum" },
      { name: "Sosyal Medya Yönetimi", minTRY: 10000, maxTRY: 80000, period: "aylık" },
      { name: "SEO & Analitik", minTRY: 15000, maxTRY: 80000, period: "aylık" },
      { name: "CRM & Otomasyon", minTRY: 25000, maxTRY: 200000 },
      { name: "İçerik & Görsel-Video", minTRY: 5000, maxTRY: 100000 },
      { name: "3D/AR Entegrasyonları", minTRY: 40000, maxTRY: 300000 }
    ]
  },

  process: [
    { step: "Brief", description: "Kısa görüşme + Brief Sihirbazı ile ihtiyaçların toplanması." },
    { step: "Yedekleme & Kaynak Çıkarma", description: "Var olan yapılar yedeklenir, kaynak/env/envanter çıkarılır." },
    { step: "Milestone Planı", description: "Çıktılar ve süre zarfları tanımlanır; kabul kriterleri yazılır." },
    { step: "Demo", description: "Prototip/demo çıkarılır ve müşteriyle istişare edilir." },
    { step: "Revizyon", description: "Geri bildirimler uygulanır, iyileştirmeler yapılır." },
    { step: "Yayın", description: "Onay sonrası canlıya alma; ölçümleme araçları açılır." }
  ],

  policies: {
    sla: { standardResponse: 24, urgentResponse: 4 },
    revisions: { standardRounds: 2, note: "Kapsam dışı talepler yeni iş kalemi olarak fiyatlanır." },
    payments: { model: "Milestone bazlı/aylık", invoicing: "E-fatura" }
  },

  faqs: [
    { q: "Pazar yeri misiniz, ajans mısınız?", a: "Pazar yeri değiliz; tam zamanlı ajans da değiliz. PM liderliğinde freelance ekiplerle yönetilen bir yapıyız." },
    { q: "Teslimat garanti ediyor musunuz?", a: "Evet, sözleşmede tanımlı kapsam ve milestone'lar için teslim garantisi ve yedek kaynak planı uygularız." },
    { q: "Fiyatlandırma nasıl belirleniyor?", a: "DigitAll paketleri ve kapsamınıza göre süre/efor tahminiyle aralık sunuyoruz; net teklif sözleşmede detaylanır." },
    { q: "Revizyon hakkı nedir?", a: "Standart projelerde 2 tur; kapsam dışı talepler yeni iş kalemi olur." },
    { q: "10 freelancer varsa hepsiyle görüşmek zorunda mıyım?", a: "Hayır. Tek muhatabınız PM'dir; ekip seçimi ve koordinasyon Unilancer tarafından yürütülür." }
  ],

  intents: [
    { intent: "fiyat", keywords: ["fiyat", "ücret", "kaça", "maliyet", "bütçe", "para"], response: "Fiyatlandırmamız projenin kapsamına göre değişir. Kurumsal web sitesi 20.000-60.000₺, e-ticaret 30.000-200.000₺, sosyal medya yönetimi aylık 10.000-80.000₺ aralığındadır. Size özel teklif için brief görüşmesi yapabiliriz." },
    { intent: "süre", keywords: ["süre", "ne kadar", "zaman", "teslim", "deadline"], response: "Proje türüne göre değişir. Kurumsal web sitesi tipik 10-14 günde, e-ticaret 3-6 haftada tamamlanır. Milestone bazlı planlamayla her adımı takip edebilirsiniz." },
    { intent: "iletişim", keywords: ["iletişim", "telefon", "mail", "ulaş", "görüş"], response: "Bize ulaşmak için:\n📞 +90 (506) 152 32 55\n📧 info@unilancerlabs.com\n\nHafta içi 09:00-18:00 saatleri arasında hizmetinizdeyiz." },
    { intent: "hizmetler", keywords: ["hizmet", "ne yapıyor", "sunuyor", "yapabilir"], response: "Sunduğumuz hizmetler:\n• Web Tasarım & Geliştirme\n• Mobil Uygulama\n• E-ticaret Çözümleri\n• Sosyal Medya Yönetimi\n• Grafik Tasarım\n• AI ChatBot\n• 3D/AR/VR Projeleri\n• SEO & Dijital Pazarlama" },
    { intent: "süreç", keywords: ["süreç", "nasıl çalışıyor", "adım", "aşama"], response: "Çalışma sürecimiz:\n1️⃣ Brief - İhtiyaçlarınızı dinliyoruz\n2️⃣ Planlama - Milestone ve kabul kriterleri\n3️⃣ Demo - Prototip gösterimi\n4️⃣ Revizyon - Geri bildirim uygulaması\n5️⃣ Yayın - Canlıya alma\n\nTek muhatap PM ile tüm süreci yönetiyoruz." },
    { intent: "garanti", keywords: ["garanti", "güvence", "risk", "sorun"], response: "Sözleşmede tanımlı kapsam için teslim garantisi veriyoruz. Yedek kaynak planımız ve kalite kontrol süreçlerimizle riskleri minimize ediyoruz." },
    { intent: "revizyon", keywords: ["revizyon", "değişiklik", "düzeltme"], response: "Standart projelerde 2 revizyon turu dahildir. Kapsam dışı istekler ayrı fiyatlandırılır." },
    { intent: "ekip", keywords: ["ekip", "kim", "kadro", "takım"], response: "Unilancer Labs ekibinde CEO Emrah Er, COO Taha Karahüseyinoğlu ve seçkin proje yöneticileri bulunuyor. Her projede deneyimli bir PM tek muhatabınız olarak atanır." }
  ],

  greetings: {
    welcome: "Merhaba! 👋 Ben DigiBot, Unilancer Labs'ın dijital asistanıyım. Size dijital analiz raporunuz hakkında bilgi verebilir, Unilancer Labs hizmetleri konusunda yardımcı olabilirim. Nasıl yardımcı olabilirim?",
    reportContext: "Dijital analiz raporunuz hakkında sorularınız varsa çekinmeden sorun. Ayrıca Unilancer Labs'ın size nasıl yardımcı olabileceği konusunda da bilgi verebilirim.",
    closing: "Başka bir sorunuz olursa her zaman buradayım. Detaylı görüşme için info@unilancerlabs.com adresinden veya +90 (506) 152 32 55 numarasından bize ulaşabilirsiniz. 🚀"
  }
};

// DigiBot response generator
export function generateDigiBotResponse(
  question: string, 
  reportData?: any
): string {
  const q = question.toLowerCase().trim();
  const kb = unilancerKnowledge;

  // Selamlaşma
  if (q.match(/^(merhaba|selam|hey|hi|hello|günaydın|iyi günler)/)) {
    return kb.greetings.welcome;
  }

  // Teşekkür
  if (q.match(/(teşekkür|sağol|thanks|eyvallah)/)) {
    return `Rica ederim! 😊 ${kb.greetings.closing}`;
  }

  // Vedalaşma
  if (q.match(/(görüşürüz|hoşça kal|bye|iyi günler$)/)) {
    return `Size de iyi günler! ${kb.greetings.closing}`;
  }

  // Intent-based responses
  for (const intent of kb.intents) {
    if (intent.keywords.some(kw => q.includes(kw))) {
      return intent.response;
    }
  }

  // Rapor bazlı sorular (eğer rapor verisi varsa)
  if (reportData) {
    // Genel skor
    if (q.match(/(skor|puan|değerlendirme|sonuç|genel)/)) {
      return `📊 **${reportData.company_name}** için dijital varlık analizi tamamlandı.\n\n**Genel Dijital Skor: ${reportData.digital_score}/100**\n\nBu skor web siteniz, sosyal medya varlığınız, marka kimliğiniz ve dijital pazarlama faaliyetlerinizin genel değerlendirmesidir.\n\n${reportData.digital_score < 60 ? '⚠️ Dijital varlığınızı güçlendirmek için önerilerimizi incelemenizi tavsiye ederiz.' : '✅ Temel dijital varlığınız iyi durumda, ancak her zaman geliştirme alanları var.'}\n\nDetaylı bilgi için "öneriler", "güçlü yönler" veya "zayıf yönler" sorabilirsiniz.`;
    }

    // Öneriler
    if (q.match(/(öneri|tavsiye|ne yapmalı|iyileştir|geliştir)/)) {
      const recs = reportData.recommendations?.slice(0, 5) || [];
      return `💡 **${reportData.company_name} için Öncelikli Önerilerimiz:**\n\n${recs.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}\n\n🎯 Bu önerileri uygulamak için profesyonel destek almak ister misiniz? Unilancer Labs olarak size yardımcı olabiliriz.`;
    }

    // Güçlü yönler
    if (q.match(/(güçlü|artı|iyi|pozitif|strength)/)) {
      const strengths = reportData.strengths || [];
      return `✨ **Güçlü Yönleriniz:**\n\n${strengths.map((s: string) => `✅ ${s}`).join('\n')}\n\nBu güçlü yönlerinizi pazarlama stratejinizde öne çıkarmanızı öneririz!`;
    }

    // Zayıf yönler
    if (q.match(/(zayıf|eksi|kötü|negatif|weakness|eksik)/)) {
      const weaknesses = reportData.weaknesses || [];
      return `⚠️ **Geliştirilmesi Gereken Alanlar:**\n\n${weaknesses.map((w: string) => `• ${w}`).join('\n')}\n\nBu alanlarda iyileştirme yapmak dijital skorunuzu önemli ölçüde artırabilir. Size nasıl yardımcı olabileceğimizi konuşmak ister misiniz?`;
    }
  }

  // Unilancer hakkında
  if (q.match(/(unilancer|siz kim|şirket|hakkında|nedir)/)) {
    return `🏢 **Unilancer Labs Hakkında**\n\n${kb.about.description}\n\n**Vizyonumuz:** ${kb.about.vision}\n\n**Farkımız:** ${kb.about.uniqueValue}\n\nDaha fazla bilgi için web sitemizi ziyaret edebilir veya bizimle iletişime geçebilirsiniz.`;
  }

  // Freelancer soruları
  if (q.match(/(freelancer|staj|katıl|çalış)/)) {
    return `👥 **Freelancer Olmak İster misiniz?**\n\nUnilancer Labs, üniversite öğrencileri ve genç yeteneklere proje-bazlı çalışma fırsatı sunar.\n\n**Avantajlar:**\n• Gerçek müşteri projelerinde deneyim\n• PM rehberliğinde profesyonel gelişim\n• Esnek çalışma modeli\n• Performans bazlı kazanç\n\nKatılım için web sitemizdeki "Bize Katıl" bölümünden başvurabilirsiniz.`;
  }

  // Varsayılan cevap
  if (reportData) {
    return `${reportData.company_name} için hazırlanan raporunuz hakkında veya Unilancer Labs hizmetleri konusunda size yardımcı olabilirim.\n\n**Sorabilecekleriniz:**\n• 📊 "Dijital skorum ne anlama geliyor?"\n• 💡 "Bana öneriler ver"\n• ✨ "Güçlü yönlerim neler?"\n• 💰 "Fiyatlarınız nedir?"\n• 📞 "Sizinle nasıl iletişime geçebilirim?"\n\nNasıl yardımcı olabilirim?`;
  }

  return `Size nasıl yardımcı olabilirim?\n\n**Unilancer Labs Hizmetleri:**\n• Web & Mobil Geliştirme\n• E-ticaret Çözümleri\n• Dijital Pazarlama\n• Sosyal Medya Yönetimi\n• AI & ChatBot Çözümleri\n\n**Sorabilecekleriniz:**\n• "Hizmetleriniz neler?"\n• "Fiyatlandırma nasıl?"\n• "Çalışma süreciniz nasıl?"\n• "İletişim bilgileriniz nedir?"`;
}
