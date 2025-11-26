import React from 'react';
import { motion } from 'framer-motion';

const StepCard = ({ 
  title, 
  description, 
  image, 
  index 
}: { 
  step: string, 
  title: string, 
  description: string, 
  image: string, 
  index: number 
}) => {
  // Border logic for 2x2 grid on desktop
  // Mobile: All have bottom border except last
  // Desktop: 
  // 0: Right & Bottom
  // 1: Bottom
  // 2: Right
  // 3: None
  const borderClasses = `
    border-slate-100 dark:border-white/5
    ${index === 0 ? 'md:border-r md:border-b border-b' : ''}
    ${index === 1 ? 'md:border-b border-b' : ''}
    ${index === 2 ? 'md:border-r border-b md:border-b-0' : ''}
    ${index === 3 ? '' : ''}
  `;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-10 md:p-12 flex flex-col sm:flex-row items-center gap-8 group transition-all duration-300 hover:bg-white dark:hover:bg-slate-900 ${borderClasses}`}
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Large Watermark Number */}
      <div className="absolute top-6 right-8 text-8xl font-black text-slate-50 dark:text-white/5 -z-10 select-none leading-none transition-colors duration-300 group-hover:text-primary/5">
        {index + 1}
      </div>

      {/* Text Content */}
      <div className="flex-1 text-center sm:text-left relative z-10 pt-4">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base md:text-lg font-medium">
          {description}
        </p>
      </div>

      {/* Visual/Image */}
      <div className="w-full sm:w-40 flex-shrink-0 flex justify-center sm:justify-end relative z-10">
        <div className="relative w-32 h-32 md:w-40 md:h-40 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:-translate-y-2">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src={image} 
              alt={title} 
              className="relative w-full h-full object-contain drop-shadow-2xl"
            />
        </div>
      </div>
    </motion.div>
  );
};

export const HowItWorks = () => {
  const steps = [
    {
      step: "ADIM 1",
      title: "Analiz ve Yol Haritası",
      description: "Müşteriyle görüşüyor, Digibot yapay zeka araçlarımızla dijital analiz raporu çıkartıyoruz. Beraber bir yol haritası belirliyoruz.",
      image: "https://cdn3d.iconscout.com/3d/premium/thumb/data-analysis-5363264-4490026.png"
    },
    {
      step: "ADIM 2",
      title: "Süreç Yönetimi",
      description: "Ardından detaylı brief alınıyor. Sözleşme ve faturalama gibi tüm resmi süreçler Unilancer tarafından yürütülüyor.",
      image: "https://cdn3d.iconscout.com/3d/premium/thumb/contract-signing-5496278-4578068.png"
    },
    {
      step: "ADIM 3",
      title: "Üretim ve Raporlama",
      description: "Proje yöneticimiz projenin ihtiyaç duyduğu ekibi kuruyor ve liderliğinde süreç başlıyor. Şeffaf iletişim ve düzenli raporlarla her aşamadan haberdar oluyorsunuz.",
      image: "https://cdn3d.iconscout.com/3d/premium/thumb/team-work-5363258-4490020.png"
    },
    {
      step: "ADIM 4",
      title: "Teslimat",
      description: "Kalite kontrol süreçlerinden geçen projeniz zamanında teslim edilir.",
      image: "https://cdn3d.iconscout.com/3d/premium/thumb/quality-check-5363262-4490024.png"
    }
  ];

  return (
    <section id="nasil-calisir" className="py-8 md:py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-dark-light/20 -z-10" />
      
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
            <span className="text-primary">unilancer</span> ile dijitalleşmek <br className="hidden md:block" />
            çok kolay
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="relative mt-32 md:mt-72 isolate">
          {/* Process Image - Behind and Shifted Up */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none -translate-y-48 md:-translate-y-80">
            <img 
              src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/projesureci.webp" 
              alt="" 
              className="w-[115%] h-[115%] object-contain max-w-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-slate-200 dark:bg-white/10 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
            {steps.map((step, index) => (
              <StepCard 
                key={index}
                index={index}
                {...step}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};