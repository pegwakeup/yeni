import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface Feature197Props {
  features: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  {
    id: 1,
    title: "Freelancer ekibiniz nasıl çalışıyor?",
    description:
      "Deneyimli freelancer ekibimiz, modern teknolojiler ve çevik metodolojiler kullanarak projelerinizi hayata geçiriyor. Her proje için özel bir ekip oluşturuyor ve proje yöneticilerimiz süreç boyunca sizinle yakın iletişimde kalıyor.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Proje süreçleriniz nasıl işliyor?",
    description:
      "Proje sürecimiz analiz, tasarım, geliştirme ve test aşamalarından oluşuyor. Her aşamada sizinle düzenli toplantılar yapıyor ve geri bildirimlerinizi alıyoruz. Çevik metodolojiler sayesinde hızlı ve esnek bir şekilde ilerleyebiliyoruz.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Fiyatlandırma politikanız nedir?",
    description:
      "Fiyatlandırmamız projenin kapsamına, kullanılacak teknolojilere ve süresine göre değişiklik gösteriyor. Her proje için özel bir teklif hazırlıyor ve detaylı bir maliyet analizi sunuyoruz. Bütçenize uygun çözümler üretmek için esneklik sağlıyoruz.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Proje teslim süreleri ne kadar?",
    description:
      "Proje teslim süreleri, projenin büyüklüğüne ve karmaşıklığına göre değişmektedir. Ancak çevik metodolojiler ve deneyimli ekibimiz sayesinde, projeleri minimum sürede ve maksimum kalitede teslim ediyoruz. Her proje için detaylı bir zaman planı sunuyoruz.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Hangi teknolojileri kullanıyorsunuz?",
    description:
      "Modern web teknolojileri (React, Node.js, TypeScript), mobil uygulama geliştirme (React Native, Flutter), UI/UX tasarım araçları ve yapay zeka teknolojileri başta olmak üzere, projenize en uygun güncel teknolojileri kullanıyoruz.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
  }
];

const FAQ = ({ features = defaultFeatures }: Feature197Props) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(1);

  return (
    <section className="py-20 bg-white dark:bg-dark-light/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
      
      {/* Gradient Orbs */}
      <div className="absolute -left-40 -top-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-20" />
      <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-20" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary-light/20 text-primary mb-4">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span>Sık Sorulan Sorular</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Size Nasıl Yardımcı Olabiliriz?</h2>
        </motion.div>

        {/* FAQ Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-8 items-start"
        >
          {/* FAQ Questions */}
          <div className="bg-white dark:bg-dark-light/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <Accordion 
              type="single" 
              className="w-full" 
              defaultValue="item-1"
              onValueChange={(value) => {
                const id = parseInt(value.split('-')[1]);
                setActiveTabId(id);
              }}
            >
              {features.map((tab) => (
                <AccordionItem key={tab.id} value={`item-${tab.id}`}>
                  <AccordionTrigger
                    className="cursor-pointer px-6 py-4 !no-underline transition group"
                  >
                    <h6
                      className={`text-base font-medium ${tab.id === activeTabId ? "text-primary" : "text-gray-600 dark:text-gray-400 group-hover:text-white"}`}
                    >
                      {tab.title}
                    </h6>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                      {tab.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Image Section */}
          <div className="relative aspect-video rounded-xl overflow-hidden lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {activeTabId && (
                <motion.div
                  key={activeTabId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                  <img
                    src={features.find(f => f.id === activeTabId)?.image}
                    alt={features.find(f => f.id === activeTabId)?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/50 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { FAQ };