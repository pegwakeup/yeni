import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  GraduationCap,
  Zap,
  Check,
  ArrowRight
} from 'lucide-react';

interface TabItem {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

const Universities = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabItems: TabItem[] = [
    {
      id: 1,
      title: 'Freelancer',
      description: 'Gerçek müşteri projelerinde yer alarak portfolyonu ve cüzdanını büyüt.',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-600'
    },
    {
      id: 2,
      title: 'Topluluk',
      description: 'Kampüsündeki kulüplerde çalış, sosyalleş ve network kur.',
      icon: Users,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      borderColor: 'border-cyan-600'
    },
    {
      id: 3,
      title: 'Kariyer',
      description: 'Partner şirketlerimizde staj yapma ve kariyerine 1-0 önde başlama şansı.',
      icon: GraduationCap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-600'
    }
  ];

  const activeItem = tabItems[activeTab];

  return (
    <div className="min-h-screen bg-[#5BC0DE] flex items-center relative overflow-hidden font-sans">
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between min-h-screen py-12 lg:py-0">
          
          {/* Left Content */}
          <div className="flex-1 relative z-20 pt-10 lg:pt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border-2 border-slate-900 text-slate-900 mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
            >
              <Check className="w-4 h-4 mr-2 text-green-600 stroke-[4]" />
              <span className="font-black tracking-wide text-xs">ÇOK YAKINDA</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
            >
              Üniversiteli <br />
              <span className="text-white drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                Freelancer
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-800 mb-8 max-w-md leading-relaxed font-medium"
            >
              Kariyer yolculuğunda seni destekleyen dev bir kampüs inşa ediyoruz. Yerini şimdiden ayırt!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                to="/tr/basvuru"
                className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1"
              >
                <Zap className="w-5 h-5 mr-2 fill-current" />
                Erken Erişim
              </Link>
            </motion.div>

            {/* Characters Illustration */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-12 lg:absolute lg:-bottom-20 lg:left-0 w-full max-w-[500px]"
            >
               <svg viewBox="0 0 450 240" className="w-full h-auto drop-shadow-2xl">
                {/* Character 1 - Guy with Laptop (Green) */}
                <g transform="translate(10, 30) scale(0.85)">
                  <rect x="30" y="100" width="80" height="120" rx="10" fill="#166534" stroke="#0f172a" strokeWidth="3"/>
                  <rect x="45" y="110" width="10" height="100" fill="#15803d"/>
                  <rect x="65" y="110" width="10" height="100" fill="#15803d"/>
                  <rect x="85" y="110" width="10" height="100" fill="#15803d"/>
                  <circle cx="70" cy="60" r="45" fill="#fcd9bd" stroke="#0f172a" strokeWidth="3"/>
                  <path d="M30 45 Q70 10 110 45 Q110 25 70 20 Q30 25 30 45" fill="#92400e" stroke="#0f172a" strokeWidth="2"/>
                  <circle cx="55" cy="55" r="4" fill="#0f172a"/>
                  <circle cx="85" cy="55" r="4" fill="#0f172a"/>
                  <path d="M55 75 Q70 90 85 75" stroke="#0f172a" strokeWidth="3" fill="none"/>
                  <rect x="-20" y="130" width="60" height="40" rx="3" fill="#334155" stroke="#0f172a" strokeWidth="2"/>
                  <rect x="-40" y="168" width="100" height="8" rx="2" fill="#475569" stroke="#0f172a" strokeWidth="2"/>
                  <path d="M30 120 Q0 140 10 160" stroke="#fcd9bd" strokeWidth="20" strokeLinecap="round" fill="none"/>
                </g>

                {/* Character 2 - Girl with Tablet (Yellow) */}
                <g transform="translate(130, 10) scale(0.85)">
                  <rect x="30" y="110" width="90" height="130" rx="10" fill="#eab308" stroke="#0f172a" strokeWidth="3"/>
                  <circle cx="75" cy="60" r="50" fill="#fcd9bd" stroke="#0f172a" strokeWidth="3"/>
                  <path d="M25 60 Q25 -10 75 0 Q125 -10 125 60 Q130 100 110 120 Q100 90 75 95 Q50 90 40 120 Q20 100 25 60" fill="#451a03" stroke="#0f172a" strokeWidth="2"/>
                  <circle cx="58" cy="55" r="5" fill="#0f172a"/>
                  <circle cx="92" cy="55" r="5" fill="#0f172a"/>
                  <path d="M58 80 Q75 95 92 80" stroke="#0f172a" strokeWidth="3" fill="none"/>
                  <rect x="95" y="140" width="45" height="60" rx="5" fill="#334155" stroke="#0f172a" strokeWidth="2"/>
                  <rect x="100" y="145" width="35" height="45" rx="2" fill="#60a5fa"/>
                  <path d="M110 130 Q130 140 115 165" stroke="#fcd9bd" strokeWidth="18" strokeLinecap="round" fill="none"/>
                </g>

                {/* Character 3 - Guy with Notebook (Blue) */}
                <g transform="translate(260, 20) scale(0.85)">
                  <rect x="30" y="100" width="85" height="125" rx="10" fill="#1e293b" stroke="#0f172a" strokeWidth="3"/>
                  <line x1="55" y1="105" x2="55" y2="130" stroke="#64748b" strokeWidth="2"/>
                  <line x1="85" y1="105" x2="85" y2="130" stroke="#64748b" strokeWidth="2"/>
                  <circle cx="72" cy="55" r="45" fill="#d4a574" stroke="#0f172a" strokeWidth="3"/>
                  <path d="M35 40 Q72 5 109 40 Q109 20 72 15 Q35 20 35 40" fill="#1c1917" stroke="#0f172a" strokeWidth="2"/>
                  <circle cx="57" cy="50" r="4" fill="#0f172a"/>
                  <circle cx="87" cy="50" r="4" fill="#0f172a"/>
                  <path d="M57 70 Q72 82 87 70" stroke="#0f172a" strokeWidth="3" fill="none"/>
                  <rect x="100" y="125" width="35" height="50" rx="3" fill="#fef3c7" stroke="#0f172a" strokeWidth="2"/>
                  <line x1="105" y1="135" x2="130" y2="135" stroke="#0f172a" strokeWidth="1"/>
                  <line x1="105" y1="145" x2="130" y2="145" stroke="#0f172a" strokeWidth="1"/>
                  <line x1="105" y1="155" x2="125" y2="155" stroke="#0f172a" strokeWidth="1"/>
                  <path d="M100 120 Q120 130 115 150" stroke="#d4a574" strokeWidth="16" strokeLinecap="round" fill="none"/>
                </g>
              </svg>
            </motion.div>
          </div>

          {/* Right Content - Tablet */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full flex justify-center lg:justify-end relative z-10"
          >
            <div className="relative w-[400px] h-[540px] bg-white rounded-[40px] border-[6px] border-slate-900 shadow-[20px_20px_0px_0px_rgba(15,23,42,1)] p-4 flex flex-col">
              
              {/* Screen Area */}
              <div className="flex-1 bg-slate-50 rounded-[28px] border-2 border-slate-200 relative overflow-hidden flex flex-col">
                
                {/* Center Icons */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="flex items-center gap-6 mb-12">
                    {tabItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = index === activeTab;
                      
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => setActiveTab(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`
                            w-20 h-20 rounded-2xl flex items-center justify-center border-4 transition-all duration-300
                            ${isActive 
                              ? `${item.bgColor} ${item.borderColor} shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -translate-y-2` 
                              : 'bg-white border-slate-200 hover:border-slate-300'}
                          `}
                        >
                          <Icon 
                            className={`w-8 h-8 ${isActive ? item.color : 'text-slate-400'}`} 
                            strokeWidth={2.5}
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Active Content Preview */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center max-w-xs"
                    >
                      <h3 className="text-2xl font-black text-slate-900 mb-3">
                        {activeItem.title}
                      </h3>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {activeItem.description}
                      </p>
                      
                      <div className="mt-6">
                        <Link to="/tr/basvuru" className="text-slate-900 font-bold text-sm hover:underline inline-flex items-center">
                          Detayları İncele <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* Bottom Dots */}
              <div className="h-12 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 border border-slate-900"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-slate-900"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 border border-slate-900"></div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Universities;
