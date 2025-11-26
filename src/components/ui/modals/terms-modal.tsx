import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-dark-light/95 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white dark:bg-dark-light/95 backdrop-blur-sm z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white">Kullanım Koşulları</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-76px)] space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">1. Hizmet Şartları</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Unilancer platformunu kullanarak, bu kullanım koşullarını kabul etmiş olursunuz. 
                Platformumuz üzerinden sunulan hizmetler, belirtilen şartlar ve koşullar 
                çerçevesinde sağlanmaktadır.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">2. Hizmet Kullanımı</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Platformumuz üzerinden talep ettiğiniz hizmetler, profesyonel standartlara uygun 
                olarak sunulmaktadır. Hizmetlerimizi kullanırken, tüm yasal düzenlemelere ve 
                platform kurallarına uymayı kabul etmiş olursunuz.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">3. Fikri Mülkiyet Hakları</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Proje sürecinde üretilen tüm içerikler, tasarımlar ve kodlar, aksi belirtilmedikçe 
                müşteriye aittir. Unilancer, projelerde kullanılan açık kaynak yazılımların lisans 
                haklarına saygı gösterir.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">4. Ödeme ve İade Koşulları</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Proje ödemeleri, belirlenen iş planı ve aşamalara göre yapılır. İptal ve iade 
                koşulları, her projenin özel şartlarına göre sözleşmede belirtilir. Ödemeler, 
                güvenli ödeme sistemleri üzerinden gerçekleştirilir.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">5. Gizlilik ve Güvenlik</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Proje sürecinde paylaşılan tüm bilgiler gizlilik ilkelerimiz kapsamında korunur. 
                Müşteri bilgileri ve proje detayları, yasal zorunluluklar dışında üçüncü taraflarla 
                paylaşılmaz.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">6. Sorumluluk Sınırları</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Unilancer, sunduğu hizmetlerin kalitesini garanti eder ancak müşteri tarafından 
                sağlanan içerik, bilgi ve materyallerin doğruluğundan sorumlu tutulamaz. Mücbir 
                sebeplerden kaynaklanan gecikmeler için sorumluluk kabul edilmez.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">7. Sözleşme Feshi</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Taraflar, belirtilen şartlara uymadığı takdirde sözleşmeyi feshetme hakkına sahiptir. 
                Fesih durumunda, o ana kadar tamamlanan işler için ödeme yapılır ve tüm materyaller 
                teslim edilir.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">8. Güncellemeler</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Unilancer, bu kullanım koşullarını önceden haber vermeksizin güncelleme hakkını 
                saklı tutar. Güncellemeler, web sitemizde yayınlandığı tarihten itibaren geçerli 
                olur.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">9. İletişim</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Kullanım koşullarımız hakkında sorularınız için bize ulaşın: 
                <a href="mailto:info@unilancerlabs.com" className="text-primary hover:text-primary-light ml-1">
                  info@unilancerlabs.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};