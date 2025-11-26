import { FaqSection } from "./faq";

const DEMO_FAQS = [
  {
    question: "Proje Süreci Nasıl İşliyor?",
    answer: "Proje sürecimiz 4 ana aşamadan oluşur: 1) Analiz ve Planlama: İhtiyaçlarınızı detaylı olarak analiz eder, proje kapsamını ve hedeflerini belirleriz. 2) Tasarım ve Prototip: Modern ve kullanıcı dostu arayüz tasarımı oluşturur, onayınıza sunarız. 3) Geliştirme: En son teknolojileri kullanarak projenizi hayata geçiririz. 4) Test ve Optimizasyon: Kapsamlı testler ve performans optimizasyonları yaparak projenizi yayına hazır hale getiririz.",
  },
  {
    question: "Fiyatlandırma Modelimiz Nedir?",
    answer: "Fiyatlandırmamız projenin kapsamına, kullanılacak teknolojilere ve süresine göre değişiklik gösteriyor. Her proje için özel bir teklif hazırlıyor ve detaylı bir maliyet analizi sunuyoruz. Bütçenize uygun çözümler üretmek için esneklik sağlıyoruz. Ayrıca, düzenli hizmetler için aylık paketler ve uzun vadeli işbirlikleri için özel fiyatlandırma seçenekleri sunuyoruz.",
  },
  {
    question: "Hangi Sektörlerle Çalışıyoruz?",
    answer: "E-ticaret, finans, eğitim, sağlık, üretim ve hizmet sektörleri başta olmak üzere tüm sektörlere özel dijital çözümler sunuyoruz. Her sektörün kendine özgü ihtiyaçlarını anlıyor ve bu doğrultuda özelleştirilmiş çözümler geliştiriyoruz. Startup'lardan kurumsal şirketlere kadar farklı ölçekteki işletmelerle çalışıyoruz.",
  },
  {
    question: "Freelancer nedir ve Unilancer bu sistemi nasıl uyguluyor?",
    answer: "Freelancer, bağımsız çalışan profesyonelleri ifade eder. Unilancer olarak, deneyimli freelancerları özenle seçiyor ve projeleriniz için en uygun ekibi oluşturuyoruz. Her freelancer'ın uzmanlık alanına göre projelere dahil edildiği, proje yöneticilerimizin süreçleri yakından takip ettiği profesyonel bir sistem uyguluyoruz. Bu sayede hem freelancer'lar kendi uzmanlık alanlarına odaklanabiliyor, hem de müşterilerimiz kaliteli hizmet alıyor.",
  },
  {
    question: "Bu çalışma sisteminin faydaları nelerdir/ neden unilancer?",
    answer: "Unilancer'ı tercih etmenin birçok avantajı var: 1) Maliyet Avantajı: Geleneksel ajans maliyetlerinden tasarruf edersiniz. 2) Uzman Ekip: Her projede konusunda uzman freelancerlarla çalışırsınız. 3) Esneklik: Proje ihtiyaçlarınıza göre ekip ölçeklendirilebilir. 4) Hız: Çevik metodolojiler sayesinde projeler daha hızlı tamamlanır. 5) Kalite: Her freelancer kendi uzmanlık alanında en iyi işi çıkarmaya odaklanır. 6) Şeffaflık: Proje sürecini adım adım takip edebilirsiniz.",
  }
];

export function FaqSectionDemo() {
  return (
    <FaqSection
      title="Sık Sorulan Sorular"
      description="Size nasıl yardımcı olabiliriz?"
      items={DEMO_FAQS}
      className="py-12"
    />
  );
}