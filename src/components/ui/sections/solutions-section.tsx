import React from 'react';
import { motion } from 'framer-motion';
import { Users, Code2, Award, Globe, Zap, Target, ArrowUpRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.2 }
};

const solutions = [
  {
    icon: Users,
    title: "Tek Seferlik Projeler",
    description: "Alanında uzman freelancerlarımızla kısa vadeli projelerde çalışıyoruz. Kampanya, ürün tasarımı, web geliştirme gibi çeşitli alanlardaki projelerinizde beklentilerinizi anlıyor, doğru kaynakları bir araya getirerek profesyonel süreç yönetimiyle projelerinizi başarıyla tamamlıyoruz.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: Code2,
    title: "Ek Freelancer Desteği",
    description: "Teknik, tasarım veya dijital pazarlama gibi ekstra uzmanlık gerektiren durumlarda, profesyonel freelancerlarımızı projenize dahil edebiliyoruz. Bu yaklaşım sayesinde mevcut ekibinizin proje kapasitesini ihtiyaçlarınız doğrultusunda destekleyerek projenin tüm aşamalarında yanınızda oluyoruz.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: Award,
    title: "Aylık ve Yıllık Düzenli İşlerin Yönetimi",
    description: "Sürekli destek gerektiren operasyonel süreçlerinizde yanınızdayız. Web ve mobil güncellemeleri, SEO, içerik üretimi ile sosyal medya yönetimi gibi düzenli işlerinizin planlanması ve yürütülmesini sağlayarak, iş süreçlerinizin sorunsuz ilerlemesine katkıda bulunuyoruz.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2000&q=80"
  }
];

const SolutionsSection = () => {
  return (
    <div className="py-4">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-2">Çözümlerimiz</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            İhtiyaçlarınıza özel, esnek ve ölçeklenebilir çözümler sunuyoruz
          </p>
        </motion.div>

        <div className="space-y-16">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={fadeInUp.viewport}
                className="relative group"
              >
                <div className={`flex flex-col gap-8 lg:gap-12 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center`}>
                  {/* Image */}
                  <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden">
                    <img 
                      src={solution.image}
                      alt={solution.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-2 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">{solution.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">{solution.description}</p>
                    <motion.a
                      href="/contact"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center text-primary hover:text-primary-light transition-colors group/link mt-4"
                    >
                      <span className="mr-2">Detaylı Bilgi</span>
                      <ArrowUpRight className="w-4 h-4 group-hover/link:rotate-45 transition-transform" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SolutionsSection;