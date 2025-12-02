import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function WhyUsSection() {
  useTranslation(); // Keep for potential future translations

  return (
    <section id="neden-unilancer" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            neden{" "}
            <span className="relative inline-block">
              unilancer
              <svg className="absolute -bottom-3 left-0 w-full h-4" viewBox="0 0 200 20" fill="none">
                <path 
                  d="M5 12C30 5 50 18 80 10C110 2 130 16 160 8C175 4 190 14 195 10" 
                  stroke="#5FC8DA" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <circle cx="15" cy="10" r="3" fill="#5FC8DA" className="animate-bounce" style={{ animationDelay: '0.1s' }} />
                <circle cx="100" cy="8" r="2.5" fill="#5FC8DA" className="animate-bounce" style={{ animationDelay: '0.3s' }} />
                <circle cx="180" cy="12" r="3" fill="#5FC8DA" className="animate-bounce" style={{ animationDelay: '0.5s' }} />
              </svg>
            </span>
            ?
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(280px,auto)]">
          
          {/* 1. 360° Çözümler (Large Square - Top Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 rounded-[40px] bg-[#E8DFF5] dark:bg-purple-900/20 p-10 flex flex-col relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-purple-500/10 duration-500"
          >
            <div className="relative z-10 max-w-[70%]">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">360° Dijital Çözümler</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">Web, mobil, tasarım ve pazarlama tek çatı altında. Farklı ajanslarla uğraşmayın.</p>
            </div>
            <div className="absolute bottom-0 right-0 w-[60%] h-[60%] translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500">
               <div className="w-full h-full bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-tl-[40px] p-4 flex items-center justify-center border-t border-l border-white/50 dark:border-white/10">
                 <img 
                   src="/images/why-us/2.png" 
                   className="object-contain w-full h-full drop-shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" 
                   alt="360 Çözümler"
                   onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
                 />
               </div>
            </div>
          </motion.div>

          {/* 2. Uçtan Uca Yönetim (Tall - Top Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 md:row-span-2 rounded-[40px] bg-[#FCE1E4] dark:bg-pink-900/20 p-8 flex flex-col relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-pink-500/10 duration-500"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Uçtan Uca Yönetim</h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">Profesyonel yöneticilerle fikirden teslimata kusursuz işleyiş.</p>
            </div>
            <div className="mt-auto relative w-full aspect-square flex items-center justify-center">
               <div className="absolute inset-0 bg-white/30 dark:bg-white/5 rounded-full blur-2xl transform group-hover:scale-125 transition-transform duration-700" />
               <img 
                 src="/images/why-us/4.png" 
                 className="relative z-10 object-contain w-full h-full drop-shadow-2xl group-hover:-translate-y-2 transition-transform duration-500" 
                 alt="Yönetim"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

          {/* 3. Rekabetçi Fiyat (Standard - Top Far Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 rounded-[40px] bg-[#DAF5E0] dark:bg-green-900/20 p-8 relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-green-500/10 duration-500"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Rekabetçi Fiyat</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Öğrenci dinamizmi, erişilebilir bütçe.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 group-hover:scale-110 transition-transform duration-500">
               <img 
                 src="/images/why-us/5.png" 
                 className="object-contain w-full h-full drop-shadow-xl" 
                 alt="Fiyat"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

          {/* 4. Tek Muhatap (Standard - Middle Far Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 rounded-[40px] bg-[#FFF4CC] dark:bg-yellow-900/20 p-8 relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-yellow-500/10 duration-500"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tek Muhatap</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Freelancer karmaşıklığına son.</p>
            </div>
            <div className="absolute bottom-2 right-2 w-28 h-28 group-hover:rotate-12 transition-transform duration-500">
               <img 
                 src="/images/why-us/1.png" 
                 className="object-contain w-full h-full drop-shadow-xl" 
                 alt="Tek Muhatap"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

          {/* 5. Hizmet İhracatı (Wide - Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-3 rounded-[40px] bg-[#FFE4D6] dark:bg-orange-900/20 p-8 md:p-10 flex flex-col md:flex-row items-center relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-orange-500/10 duration-500"
          >
            <div className="relative z-10 flex-1 pr-0 md:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                <span className="line-through opacity-40 decoration-2">Beyin Göçü</span> <span className="text-orange-600 dark:text-orange-400">Yerine</span> Hizmet İhracatı
              </h3>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">Projenizle sadece işinizi büyütmeyin; genç yeteneklerin dünyaya açılmasına destek olun.</p>
            </div>
            <div className="relative w-full md:w-64 h-48 flex items-center justify-center mt-6 md:mt-0">
               <div className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-700" />
               <img 
                 src="/images/why-us/globe.png" 
                 className="relative z-10 object-contain max-h-full drop-shadow-2xl group-hover:rotate-12 transition-transform duration-500" 
                 alt="Hizmet İhracatı"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

          {/* 6. Yol Haritası (Standard - Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-1 rounded-[40px] bg-[#D6E4FF] dark:bg-blue-900/20 p-8 relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-blue-500/10 duration-500"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Özel Yol Haritası</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Hazır paket değil, hedefe özel strateji.</p>
            </div>
            <div className="absolute bottom-0 right-0 w-36 h-36 translate-x-6 translate-y-6 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500">
               <img 
                 src="/images/why-us/3.png" 
                 className="object-contain w-full h-full drop-shadow-xl" 
                 alt="Yol Haritası"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
