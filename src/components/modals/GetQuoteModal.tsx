import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, Video, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCalendly: () => void;
}

export const GetQuoteModal: React.FC<GetQuoteModalProps> = ({
  isOpen,
  onClose,
  onOpenCalendly,
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleFormClick = () => {
    onClose();
    const path = language === 'tr' ? '/tr/proje-talebi' : '/en/project-request';
    navigate(path);
  };

  const handleCalendlyClick = () => {
    onClose();
    onOpenCalendly();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white pr-8">
                  {language === 'tr' ? 'Nasıl devam etmek istersiniz?' : 'How would you like to proceed?'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {language === 'tr' 
                    ? 'Size en uygun seçeneği belirleyin' 
                    : 'Choose the option that works best for you'}
                </p>
              </div>

              {/* Options */}
              <div className="px-6 pb-6 space-y-3">
                {/* Option 1: Video Call / Calendly */}
                <button
                  onClick={handleCalendlyClick}
                  className="w-full group relative overflow-hidden rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 p-5 text-left transition-all hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {language === 'tr' ? 'Ücretsiz Görüşme' : 'Free Consultation'}
                        <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full font-medium">
                          {language === 'tr' ? 'Önerilen' : 'Recommended'}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {language === 'tr' 
                          ? '30 dakikalık video görüşme ile projenizi detaylı konuşalım' 
                          : 'Discuss your project in detail with a 30-minute video call'}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          30 {language === 'tr' ? 'dakika' : 'minutes'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {language === 'tr' ? 'Hemen randevu al' : 'Book now'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                  </div>
                </button>

                {/* Option 2: Fill Form */}
                <button
                  onClick={handleFormClick}
                  className="w-full group relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-card p-5 text-left transition-all hover:bg-gray-100 dark:hover:bg-dark-card-hover hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {language === 'tr' ? 'Form Doldur' : 'Fill Out Form'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {language === 'tr' 
                          ? 'Proje detaylarınızı yazılı olarak iletin, size dönüş yapalım' 
                          : 'Submit your project details in writing, we\'ll get back to you'}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          ~3 {language === 'tr' ? 'dakika' : 'minutes'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GetQuoteModal;
