import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  GraduationCap,
  Zap,
  ArrowRight,
  Tag,
  Clock,
  ChevronRight,
  LayoutGrid,
  Search,
  Bell,
  Menu
} from 'lucide-react';
import AuroraBackground from '../components/ui/effects/aurora-background';

interface TabItem {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  status: 'active' | 'coming-soon';
  image: string;
}

const Universities = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabItems: TabItem[] = [
    {
      id: 1,
      title: 'İş & Gelir',
      description: 'Gerçek müşteri projelerinde yer alarak profesyonel deneyim kazan ve gelir elde etmeye hemen başla.',
      icon: Briefcase,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      title: 'Kulüpler',
      description: 'Kampüsündeki Freelancer Merkezleri ve kulüplerde sosyalleş, takım arkadaşları bul.',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      status: 'coming-soon',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      title: 'Ayrıcalıklar',
      description: 'En sevdiğin markalarda ve teknoloji ürünlerinde üniversitelilere özel indirimler.',
      icon: Tag,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      status: 'coming-soon',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 4,
      title: 'Kariyer',
      description: 'Sektör liderlerinden eğitimler al ve partner şirketlerimizde staj yap.',
      icon: GraduationCap,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      status: 'coming-soon',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80'
    }
  ];

  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0" style={{ contain: 'strict' }}>
        <AuroraBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/20 to-blue-100/20 dark:from-dark dark:via-dark-light dark:to-dark" />
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: 'linear-gradient(to right, #5FC8DA10 1px, transparent 1px), linear-gradient(to bottom, #5FC8DA10 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse at center, transparent 10%, black 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 10%, black 80%)',
          }}
        />
      </div>
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center justify-between min-h-screen py-20 lg:py-0">
          
          {/* Left Content */}
          <div className="flex-1 relative z-20 pt-10 lg:pt-0 max-w-xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mb-6 shadow-sm"
            >
              <Zap className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
              <span className="font-bold tracking-wide text-xs">YENİ NESİL EKOSİSTEM</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Üniversiteli <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                  Ekosistemi
                </span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md leading-relaxed font-medium"
            >
              Sadece bir çalışma platformu değil; deneyim kazandığın, sosyalleştiğin ve kariyerini inşa ettiğin dev bir kampüs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                to="/tr/basvuru"
                className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
              >
                <Zap className="w-5 h-5 mr-2 fill-current" />
                Aramıza Katıl
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Desktop Interface */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full flex justify-center lg:justify-end relative z-10"
          >
            {/* Desktop Window Frame */}
            <div className="relative w-full max-w-3xl aspect-[16/10] bg-slate-900 rounded-xl shadow-2xl border border-slate-800 ring-1 ring-white/10 overflow-hidden flex flex-col transform hover:scale-[1.02] transition-transform duration-500">
              
              {/* Browser Header */}
              <div className="h-10 bg-slate-800/50 backdrop-blur-md flex items-center px-4 gap-2 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"/>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"/>
                </div>
                <div className="ml-4 flex-1 max-w-md h-6 bg-slate-950/50 rounded-md flex items-center justify-center px-3 text-[10px] text-slate-500 font-mono border border-white/5">
                  <span className="opacity-50">https://</span>unilancer.com/student-hub
                </div>
              </div>

              {/* App Layout */}
              <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-slate-950">
                
                {/* Sidebar */}
                <div className="w-64 bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-white/5 flex flex-col">
                  <div className="p-4 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <span>Dashboard</span>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-1">
                    {tabItems.map((item, index) => {
                      const isActive = activeTab === index;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(index)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                            ${isActive 
                              ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' 
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}
                          `}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? item.color : 'opacity-70'}`} />
                          {item.title}
                          {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-auto p-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Öğrenci Hesabı</div>
                        <div className="text-[10px] text-slate-500 truncate">student@uni.edu</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                  {/* Top Bar */}
                  <div className="h-14 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Fırsatları ara..." 
                        className="h-8 pl-9 pr-4 rounded-full bg-slate-100 dark:bg-white/5 border-none text-xs w-48 focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col"
                      >
                        {/* Hero Image Card */}
                        <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-6 group shadow-lg">
                          <img 
                            src={tabItems[activeTab].image} 
                            alt={tabItems[activeTab].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex items-center justify-between mb-2">
                              {tabItems[activeTab].status === 'active' ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-300 backdrop-blur-md border border-green-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"/>
                                  Aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/20">
                                  <Clock className="w-3 h-3 mr-1.5"/>
                                  Çok Yakında
                                </span>
                              )}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{tabItems[activeTab].title}</h2>
                            <p className="text-white/80 text-sm line-clamp-1">{tabItems[activeTab].description}</p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Durum</div>
                            <div className="font-semibold text-slate-900 dark:text-white text-sm">
                              {tabItems[activeTab].status === 'active' ? 'Başvurular Açık' : 'Hazırlanıyor'}
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Erişim</div>
                            <div className="font-semibold text-slate-900 dark:text-white text-sm">
                              Üniversite E-postası
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto pt-6">
                          <Link 
                            to="/tr/basvuru"
                            className="w-full flex items-center justify-center px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
                          >
                            {tabItems[activeTab].status === 'active' ? 'Hemen Başla' : 'Haberdar Ol'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </div>

                      </motion.div>
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Universities;
