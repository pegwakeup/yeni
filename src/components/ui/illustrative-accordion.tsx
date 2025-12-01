import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AccordionItemProps {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  badge?: string | null;
}

interface IllustrativeAccordionProps {
  items: AccordionItemProps[];
}

export const IllustrativeAccordion = ({ items }: IllustrativeAccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="flex flex-row gap-4 h-full w-full">
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const Icon = item.icon;
        
        return (
          <motion.div
            key={item.id}
            onClick={() => setActiveIndex(index)}
            onMouseEnter={() => setActiveIndex(index)}
            animate={{
              flex: isActive ? 4 : 1,
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="relative rounded-2xl border-4 border-slate-900 cursor-pointer overflow-hidden bg-slate-800 min-h-[400px]"
            style={{
              boxShadow: isActive 
                ? '8px 8px 0px 0px rgba(15,23,42,1)' 
                : '4px 4px 0px 0px rgba(15,23,42,1)'
            }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? 'bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30' : 'bg-slate-900/70'
              }`} />
            </div>

            {/* Badge */}
            {item.badge && (
              <div className="absolute top-4 right-4 z-30">
                <span className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  {item.badge}
                </span>
              </div>
            )}

            {/* Active Content */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="absolute inset-0 p-6 flex flex-col justify-end z-20"
                >
                  <div className="w-14 h-14 rounded-xl border-3 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={2.5} />
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-base text-slate-200 leading-relaxed max-w-sm">
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inactive Content - Vertical Text */}
            <AnimatePresence>
              {!isActive && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  <h3 
                    className="text-white font-bold text-lg tracking-widest uppercase drop-shadow-lg"
                    style={{ 
                      writingMode: 'vertical-rl', 
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      letterSpacing: '0.15em'
                    }}
                  >
                    {item.title}
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
