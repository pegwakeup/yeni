import { Users, Zap, Star, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

function WhyUnilancer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="w-full py-16 relative overflow-hidden">
      {/* Gradient Orbs */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -left-40 -top-40 w-80 h-80 bg-gradient-to-r from-primary/20 to-primary-light/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1.2, 1, 1.2]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -right-40 -bottom-40 w-80 h-80 bg-gradient-to-l from-primary-light/20 to-primary/10 rounded-full blur-3xl"
      />

      <motion.div 
        className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex flex-col gap-8">
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <h2 className="text-[30px] font-bold mb-4 text-slate-900 dark:text-white">
              Neden Unilancer?
            </h2>
            <p className="text-lg text-slate-700 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Modern çözümler ve profesyonel ekibimizle işletmenizi geleceğe taşıyoruz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team Power - Large Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-dark-light/80 backdrop-blur-sm rounded-xl lg:col-span-2 relative overflow-hidden group border border-slate-200 dark:border-white/10 hover:border-primary/20 transition-all duration-500 scale-80"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
                  alt="Team" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="relative p-6 h-full flex flex-col justify-between aspect-square lg:aspect-auto bg-gradient-to-t from-dark/95 via-dark/90 to-transparent transition-opacity duration-500">
                <div className="w-10 h-10 bg-primary/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="transform group-hover:translate-y-[-8px] transition-transform duration-500">
                  <h3 className="text-lg font-bold mb-2 text-white/90 group-hover:text-white">Ekip Gücü</h3>
                  <p className="text-slate-100 dark:text-gray-300 text-sm leading-relaxed">
                    Farklı yeteneklere sahip profesyonelleri tek ekipte buluşturuyoruz. Freelancerlarımız sadece kendi uzmanlık alanlarına odaklanarak verimli çalışabiliyor.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Time and Cost - Square Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-dark-light/80 backdrop-blur-sm rounded-xl relative overflow-hidden group border border-slate-200 dark:border-white/10 hover:border-primary/20 transition-all duration-500 scale-80"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80" 
                  alt="Cost Efficiency" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="relative p-6 h-full flex flex-col justify-between aspect-square bg-gradient-to-t from-dark/95 via-dark/90 to-transparent transition-opacity duration-500">
                <div className="w-10 h-10 bg-primary/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="transform group-hover:translate-y-[-8px] transition-transform duration-500">
                  <h3 className="text-lg font-bold mb-2 text-white/90 group-hover:text-white">Zaman ve Maliyet Avantajı</h3>
                  <p className="text-slate-100 dark:text-gray-300 text-sm leading-relaxed">
                    Proje bazlı çalışma imkanı sunarak geleneksel giderlerden ve uzun işe alım süreçlerinden sizi kurtarıyoruz.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Latest Technology - Square Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-dark-light/80 backdrop-blur-sm rounded-xl relative overflow-hidden group border border-slate-200 dark:border-white/10 hover:border-primary/20 transition-all duration-500 scale-80"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" 
                  alt="Technology" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="relative p-6 h-full flex flex-col justify-between aspect-square bg-gradient-to-t from-dark/95 via-dark/90 to-transparent transition-opacity duration-500">
                <div className="w-10 h-10 bg-primary/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div className="transform group-hover:translate-y-[-8px] transition-transform duration-500">
                  <h3 className="text-lg font-bold mb-2 text-white/90 group-hover:text-white">En Yeni Teknoloji</h3>
                  <p className="text-slate-100 dark:text-gray-300 text-sm leading-relaxed">
                    Güncel teknoloji araçlarıyla müşterilerimize dijital rekabet avantajı sunuyoruz.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Project Management - Large Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-dark-light/80 backdrop-blur-sm rounded-xl lg:col-span-2 relative overflow-hidden group border border-slate-200 dark:border-white/10 hover:border-primary/20 transition-all duration-500 scale-80"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2000&q=80" 
                  alt="Project Management" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="relative p-6 h-full flex flex-col justify-between aspect-square lg:aspect-auto bg-gradient-to-t from-dark/95 via-dark/90 to-transparent transition-opacity duration-500">
                <div className="w-10 h-10 bg-primary/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div className="transform group-hover:translate-y-[-8px] transition-transform duration-500">
                  <h3 className="text-lg font-bold mb-2 text-white/90 group-hover:text-white">Profesyonel Proje Yönetimi ve İletişim</h3>
                  <p className="text-slate-100 dark:text-gray-300 text-sm leading-relaxed">
                    Profesyonel proje yönetimi araçları ve düzenli geri bildirimlerle projenizi şeffaf bir şekilde yönetiyoruz.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export { WhyUnilancer };