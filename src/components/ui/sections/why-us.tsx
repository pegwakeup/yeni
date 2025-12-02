import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function WhyUsSection() {
  useTranslation(); // Keep for potential future translations

  return (
    <section id="neden-unilancer" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          
          {/* 1. 360° Çözümler (Purple - Tall Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:row-span-2 rounded-[40px] bg-[#E8DFF5] dark:bg-purple-900/20 p-8 flex flex-col relative overflow-hidden group transition-transform hover:-translate-y-1 duration-300"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">360° Dijital Çözümler</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">Web, mobil, tasarım ve pazarlama tek çatı altında. Farklı ajanslarla uğraşmayın.</p>
            </div>
            <div className="mt-auto relative h-64 w-full flex items-end justify-center translate-y-8 group-hover:translate-y-4 transition-transform duration-500">
               <img 
                 src="/images/why-us/2.png" 
                 className="object-contain max-h-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                 alt="360 Çözümler"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

          {/* 2. Uçtan Uca Yönetim (Pink - Wide Top) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 rounded-[40px] bg-[#FCE1E4] dark:bg-pink-900/20 p-8 flex flex-col md:flex-row items-center relative overflow-hidden group transition-transform hover:-translate-y-1 duration-300"
          >
            <div className="relative z-10 flex-1">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Uçtan Uca Yönetim</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">Profesyonel yöneticilerle fikirden teslimata kusursuz işleyiş.</p>
            </div>
            <div className="relative w-full md:w-1/2 h-48 flex items-center justify-center mt-6 md:mt-0">
               <img 
                 src="/images/why-us/4.png" 
                 className="object-contain max-h-full drop-shadow-2xl group-hover:rotate-3 transition-transform duration-500" 
                 alt="Yönetim"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

          {/* 3. Rekabetçi Fiyat (Green - Small) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[40px] bg-[#DAF5E0] dark:bg-green-900/20 p-8 relative overflow-hidden group min-h-[280px] transition-transform hover:-translate-y-1 duration-300"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Rekabetçi Fiyat</h3>
              <p className="text-slate-600 dark:text-slate-300">Öğrenci dinamizmi, erişilebilir bütçe.</p>
            </div>
            <div className="absolute bottom-4 right-4 w-32 h-32">
               <img 
                 src="/images/why-us/5.png" 
                 className="object-contain w-full h-full drop-shadow-xl group-hover:scale-110 transition-transform duration-500" 
                 alt="Fiyat"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

          {/* 4. Tek Muhatap (Yellow - Small) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-[40px] bg-[#FFF4CC] dark:bg-yellow-900/20 p-8 relative overflow-hidden group min-h-[280px] transition-transform hover:-translate-y-1 duration-300"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tek Muhatap</h3>
              <p className="text-slate-600 dark:text-slate-300">Freelancer karmaşıklığına son.</p>
            </div>
            <div className="absolute bottom-4 right-4 w-32 h-32">
               <img 
                 src="/images/why-us/1.png" 
                 className="object-contain w-full h-full drop-shadow-xl group-hover:-rotate-6 transition-transform duration-500" 
                 alt="Tek Muhatap"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

          {/* 5. Hizmet İhracatı (Orange - Wide Bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 rounded-[40px] bg-[#FFE4D6] dark:bg-orange-900/20 p-8 flex flex-col md:flex-row items-center relative overflow-hidden group transition-transform hover:-translate-y-1 duration-300"
          >
            <div className="relative z-10 flex-1">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                <span className="line-through opacity-40 decoration-2">Beyin Göçü</span> <span className="text-orange-600 dark:text-orange-400">Yerine</span> Hizmet İhracatı
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">Projenizle sadece işinizi büyütmeyin; genç yeteneklerin dünyaya açılmasına destek olun.</p>
            </div>
            <div className="relative w-full md:w-1/3 h-48 flex items-center justify-center mt-6 md:mt-0">
               <img 
                 src="/images/why-us/globe.png" 
                 className="object-contain max-h-full drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" 
                 alt="Hizmet İhracatı"
                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
               />
            </div>
          </motion.div>

          {/* 6. Yol Haritası (Blue - Small Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="rounded-[40px] bg-[#D6E4FF] dark:bg-blue-900/20 p-8 relative overflow-hidden group min-h-[280px] transition-transform hover:-translate-y-1 duration-300"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Özel Yol Haritası</h3>
              <p className="text-slate-600 dark:text-slate-300">Hazır paket değil, hedefe özel strateji.</p>
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-40 translate-x-4 translate-y-4">
               <img 
                 src="/images/why-us/3.png" 
                 className="object-contain w-full h-full drop-shadow-xl group-hover:-translate-y-2 transition-transform duration-500" 
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
