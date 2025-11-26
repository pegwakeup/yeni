import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl?: string;
  currentColor?: string;
  colorName?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string;
        exposure?: string;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

const ARViewer: React.FC<ARViewerProps> = ({
  isOpen,
  onClose,
  modelUrl,
  currentColor = '#1a1a1a',
  colorName = 'Siyah'
}) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'other'>('other');
  const modelViewerRef = useRef<any>(null);
  const hasActivatedAR = useRef(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    setIsMobile(isMobileDevice);

    if (isIOS) {
      setDeviceType('ios');
    } else if (isAndroid) {
      setDeviceType('android');
    } else {
      setDeviceType('other');
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setShowQRCode(false);
      hasActivatedAR.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isMobile && modelUrl && (deviceType === 'ios' || deviceType === 'android') && !hasActivatedAR.current) {
      const timer = setTimeout(() => {
        if (modelViewerRef.current) {
          try {
            if (modelViewerRef.current.canActivateAR) {
              modelViewerRef.current.activateAR();
              hasActivatedAR.current = true;
            }
          } catch (error) {
            console.log('AR activation failed:', error);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isMobile, modelUrl, deviceType]);

  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`;

  const handleManualARActivation = () => {
    if (modelViewerRef.current) {
      try {
        if (modelViewerRef.current.canActivateAR) {
          modelViewerRef.current.activateAR();
        }
      } catch (error) {
        console.log('Manual AR activation failed:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 rounded-xl md:rounded-2xl max-w-lg md:max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 md:p-8 relative border border-primary/20 dark:border-primary/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/5 pointer-events-none rounded-xl md:rounded-2xl" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all p-2 hover:bg-white/80 dark:hover:bg-white/10 rounded-lg shadow-lg hover:shadow-xl touch-manipulation z-10 backdrop-blur-sm border border-slate-200/50 dark:border-white/10"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6 relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 150, damping: 15 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl mb-4 shadow-xl shadow-primary/40 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              AR Görüntüleme
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
              Kamera açılıyor... Ürünü kendi mekanınızda görün
            </p>

            {currentColor && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-full border border-primary/20 dark:border-primary/30 shadow-lg"
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-600 shadow-md ring-2 ring-primary/20"
                  style={{ backgroundColor: currentColor }}
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-200">
                  {colorName}
                </span>
              </motion.div>
            )}
          </div>

          {!showQRCode ? (
            <div className="space-y-4 relative">
              {isMobile && modelUrl && (deviceType === 'ios' || deviceType === 'android') ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-primary/20 dark:border-primary/30 rounded-xl p-4 shadow-xl overflow-hidden"
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-900 dark:to-slate-800">
                      <model-viewer
                        ref={modelViewerRef}
                        src={modelUrl}
                        alt="3D Model"
                        ar={true}
                        ar-modes="webxr scene-viewer quick-look"
                        camera-controls={true}
                        auto-rotate={true}
                        shadow-intensity="1"
                        exposure="1"
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'transparent'
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleManualARActivation}
                    className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 text-white font-bold py-4 rounded-xl shadow-2xl shadow-primary/40 transition-all flex items-center justify-center gap-3 touch-manipulation relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <Camera className="w-6 h-6 relative z-10" />
                    <span className="text-base relative z-10">AR'ı Tekrar Başlat</span>
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-primary/5 border border-primary/20 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>İpucu:</strong> AR otomatik başlamadıysa yukarıdaki butona dokunun veya model üzerindeki AR simgesini kullanın.
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 text-center">
                      {deviceType === 'ios' ? 'iOS Quick Look' : 'Android Scene Viewer'} destekli
                    </p>
                  </motion.div>
                </>
              ) : isMobile && (!deviceType || deviceType === 'other') ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50/30 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-amber-300 dark:border-yellow-500/30 rounded-xl p-4 shadow-xl"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                          AR Desteklenmiyor
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                          Cihazınız AR özelliğini desteklemiyor. iOS veya Android cihaz kullanmanız gerekmektedir.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50/30 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-amber-300 dark:border-yellow-500/30 rounded-xl p-4 shadow-xl"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                          Mobil Cihaz Gerekli
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                          AR özelliğini kullanmak için iOS veya Android mobil cihaz gereklidir.
                          QR kodu telefonunuzla tarayın.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(95, 200, 218, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQRCode(true)}
                    className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 text-white font-bold py-4 sm:py-5 rounded-xl shadow-2xl shadow-primary/40 transition-all flex items-center justify-center gap-3 touch-manipulation relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <Camera className="w-6 h-6 relative z-10" />
                    <span className="text-base sm:text-lg relative z-10">QR Kodu Göster</span>
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 text-center">
                      iPhone, iPad veya Android cihaz gereklidir
                    </p>
                  </motion.div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl flex flex-col items-center shadow-2xl border-2 border-primary/20 dark:border-primary/30"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="mb-5"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-2xl shadow-xl relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                    <Smartphone className="w-7 h-7 text-white relative z-10" />
                  </div>
                </motion.div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-lg mb-5 border-2 border-slate-200 dark:border-white/10">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-52 h-52 sm:w-64 sm:h-64"
                  />
                </div>

                <p className="text-slate-900 dark:text-white text-center font-bold text-lg mb-2">
                  QR Kodu Tarayın
                </p>
                <p className="text-sm text-slate-600 dark:text-gray-400 text-center max-w-sm">
                  Telefonunuzun kamerasını QR koda tutun ve AR deneyimini başlatın
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowQRCode(false)}
                className="w-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 text-slate-900 dark:text-white font-bold py-4 rounded-xl transition-all touch-manipulation border-2 border-slate-300 dark:border-slate-500 shadow-lg"
              >
                <span className="text-base">Geri Dön</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ARViewer;
