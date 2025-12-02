import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function WhyUsSection() {
  useTranslation(); // Keep for potential future translations

  return (
    <section id="neden-unilancer" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
            neden{" "}
            <span className="relative inline-block text-[#5FC8DA]">
              unilancer
              <svg className="absolute -bottom-4 left-0 w-full h-6" viewBox="0 0 200 20" fill="none">
                <path 
                  d="M5 12C30 5 50 18 80 10C110 2 130 16 160 8C175 4 190 14 195 10" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className="text-[#5FC8DA] animate-pulse"
                />
              </svg>
            </span>
            ?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Kurumsal hizmeti freelancer esnekliği ile birleştiriyoruz.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
          
          {/* 1. 360° Çözümler (Tall Vertical - Left Column) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-1 md:row-span-2 rounded-[48px] bg-[#F0F4FF] dark:bg-zinc-900 p-8 flex flex-col relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 border border-indigo-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-20 mb-8">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">360° Kreatif Stüdyo</h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Web, mobil, branding ve pazarlama. Hepsi tek bir çatı altında, birbirini besleyen bir ekosistemde.
              </p>
            </div>
            
            {/* Creative Image Composition */}
            <div className="flex-1 relative w-full min-h-[300px]">
               <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent z-10 mix-blend-overlay rounded-[32px]" />
               <img 
                 src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" 
                 className="object-cover w-full h-full rounded-[32px] shadow-lg rotate-2 group-hover:rotate-0 transition-all duration-700" 
                 alt="Abstract 3D Art"
               />
               {/* Floating Elements */}
               <div className="absolute top-4 right-4 w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center animate-bounce delay-100 z-20">
                  <span className="text-2xl">🚀</span>
               </div>
            </div>
          </motion.div>

          {/* 2. Süper Yönetim (Wide Horizontal - Top Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 rounded-[48px] bg-[#FFF0F5] dark:bg-zinc-900 flex flex-col md:flex-row relative overflow-hidden group hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 border border-pink-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20 flex-1 p-8 md:pl-8 md:pr-8 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Tüm Dijital İhtiyaçlar İçin Tek Kaynak</h3>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
                Dijital ihtiyaçlarınız değiştikçe yeni hizmet sağlayıcı aramazsınız; sürdürülebilir ve uzun vadeli bir strateji oluşturuyoruz
              </p>
            </div>
            
            <div className="relative w-full md:w-1/3 h-64 md:h-auto md:mr-8">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/bandgrade.webp" 
                 className="absolute inset-0 object-cover w-full h-full hover:scale-110 transition-transform duration-700" 
                 alt="Project Management"
               />
            </div>
          </motion.div>

          {/* 3. Akıllı Bütçe (Standard - Middle Right Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 rounded-[48px] bg-[#F0FFF4] dark:bg-zinc-900 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 border border-green-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Akıllı Bütçe</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Maksimum etki, optimize maliyet.</p>
            </div>
            <div className="absolute -bottom-2 -right-2 w-40 h-40">
               <div className="absolute inset-0 bg-green-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
               <img 
                 src="https://images.unsplash.com/photo-1620714223084-87bd6c26944c?q=80&w=800&auto=format&fit=crop" 
                 className="relative object-cover w-full h-full rounded-tl-[40px] shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500" 
                 alt="3D Coins"
               />
            </div>
          </motion.div>

          {/* 4. Tek Kontak (Standard - Middle Right Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 rounded-[48px] bg-[#FFFBEB] dark:bg-zinc-900 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 border border-yellow-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tek Kontak</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Bin tane mail yok, tek bir muhatap var.</p>
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40">
               <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
               <img 
                 src="https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=800&auto=format&fit=crop" 
                 className="relative object-cover w-full h-full rounded-tl-[40px] shadow-xl group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal" 
                 alt="Retro Phone"
               />
            </div>
          </motion.div>

          {/* 5. Sınırları Kaldırıyoruz (Wide - Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 rounded-[48px] bg-[#FFF4ED] dark:bg-zinc-900 flex flex-col md:flex-row relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 border border-orange-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="w-full md:w-1/4 h-64 md:h-full order-2 md:order-1 md:rounded-l-[48px] overflow-hidden">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/genclerduvaradiki.webp" 
                 className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 md:object-left" 
                 alt="Global Connection Left"
               />
            </div>

            <div className="relative z-20 flex-1 p-8 md:px-8 md:py-10 flex flex-col justify-center order-1 md:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                Beyin Göçü Yerine Hizmet İhracatı
              </h3>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Gençlerimizi yurtdışına kaptırmak yerine, onların bilgisini dünyaya ihraç ediyoruz. Her proje, gerçek tecrübe ve yüksek katma değer demek.
              </p>
            </div>

            <div className="w-full md:w-1/4 h-64 md:h-full order-3 md:rounded-r-[48px] overflow-hidden">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/genclerduvarad.webp" 
                 className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 md:object-right" 
                 alt="Global Connection Right"
               />
            </div>
          </motion.div>

          {/* 6. Rota Belli (Standard - Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-1 rounded-[48px] bg-[#EBF8FF] dark:bg-zinc-900 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 border border-sky-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Rota Belli</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Size özel stratejik planlama.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-40 h-40">
               <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
               <img 
                 src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=800&auto=format&fit=crop" 
                 className="relative object-cover w-full h-full rounded-tl-[40px] shadow-xl group-hover:rotate-3 group-hover:scale-105 transition-transform duration-500" 
                 alt="Strategy Chess"
               />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
