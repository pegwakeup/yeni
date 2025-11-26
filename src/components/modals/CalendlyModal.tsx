import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Clock, Video, CheckCircle2, Sparkles } from 'lucide-react';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, string>;
        utm?: Record<string, string>;
      }) => void;
    };
  }
}

export const CalendlyModal: React.FC<CalendlyModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && window.Calendly) {
      // Reset loading state
      setIsLoading(true);
      
      const calendlyContainer = document.getElementById('calendly-inline-widget');
      if (calendlyContainer) {
        calendlyContainer.innerHTML = '';

        // Small delay to ensure DOM is ready and animation started
        const timer = setTimeout(() => {
          try {
            window.Calendly.initInlineWidget({
              url: 'https://calendly.com/taha-unilancerlabs/30min?hide_landing_page_details=1&hide_gdpr_banner=1',
              parentElement: calendlyContainer,
            });
            
            // Calendly iframe takes a bit to actually render content
            setTimeout(() => setIsLoading(false), 1000);
          } catch (e) {
            console.error("Calendly init error:", e);
            setIsLoading(false);
          }
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-[9999]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl h-[90vh] max-h-[800px] bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Sidebar - Info */}
              <div className="w-full lg:w-[35%] bg-slate-50 dark:bg-[#202023] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-zinc-800 overflow-y-auto">
                <div className="h-full flex flex-col">
                  <div className="mb-8">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-6">
                      <Sparkles className="w-3 h-3 mr-2" />
                      Ücretsiz Danışmanlık
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                      Dijital Dönüşüm Yolculuğunuzu Planlayalım
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      30 dakikalık bu görüşmede işletmenizin dijital ihtiyaçlarını analiz edip, size özel çözüm önerileri sunacağız.
                    </p>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Süre</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">30 Dakika</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Konum</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Google Meet (Online)</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Neler Konuşacağız?</h4>
                    <ul className="space-y-3">
                      {[
                        "Mevcut dijital varlığınızın analizi",
                        "Sektörünüze özel büyüme fırsatları",
                        "Teknik altyapı ve modernizasyon önerileri",
                        "Size özel yol haritası ve bütçelendirme"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Side - Widget */}
              <div className="w-full lg:w-[65%] relative bg-white dark:bg-[#18181b] h-[500px] lg:h-auto">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#18181b] z-20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Takvim yükleniyor...</p>
                  </div>
                )}
                <div
                  id="calendly-inline-widget"
                  className={`w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  style={{ minWidth: '320px', height: '100%' }}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CalendlyModal;
