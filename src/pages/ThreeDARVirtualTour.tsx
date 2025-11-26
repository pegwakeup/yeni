import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Camera, Eye, Maximize2, RotateCw, ArrowRight, CheckCircle,
  Building2, Factory, GraduationCap, Store, Home, Users, TrendingUp,
  Clock, DollarSign, Target, MousePointer, Smartphone, Globe,
  Zap, ChevronLeft, ChevronRight, Play, X, BoxSelect, ScanLine, Video,
  ShoppingCart, Hotel, Car, Palette, Ruler, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BeanBagChair3D from '../components/3d/BeanBagChair3D';
import ARViewer from '../components/ar/ARViewer';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.15 }
};

const virtualTours = [
  {
    id: 1,
    title: "Luxury Hotel Suite",
    category: "Otel",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1200",
    panoramaUrl: "https://www.kuula.co/share/collection/7l3PY?logo=1&info=1&fs=1&vr=0&zoom=1&sd=1&thumbs=1",
    description: "Lüks otel süiti sanal turu - 360° panoramik görünüm"
  },
  {
    id: 2,
    title: "Modern Factory Floor",
    category: "Fabrika",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    panoramaUrl: "https://www.kuula.co/share/collection/7l3PY?logo=1&info=1&fs=1&vr=0&zoom=1&sd=1&thumbs=1",
    description: "Üretim tesisi sanal turu - İşletme süreçlerinizi sergilemek için"
  },
  {
    id: 3,
    title: "University Campus",
    category: "Üniversite",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200",
    panoramaUrl: "https://www.kuula.co/share/collection/7l3PY?logo=1&info=1&fs=1&vr=0&zoom=1&sd=1&thumbs=1",
    description: "Üniversite kampüsü sanal turu - Öğrencilerinize kampüsü tanıtın"
  }
];

const threeDARBenefits = [
  {
    icon: ShoppingCart,
    title: "Satışları Artırın",
    description: "3D ürün görselleri ile müşterilerinizin satın alma güvenini %80 oranında artırın"
  },
  {
    icon: Eye,
    title: "Her Açıdan İnceleme",
    description: "Müşterileriniz ürünü 360° döndürerek tüm detayları görebilir"
  },
  {
    icon: Smartphone,
    title: "AR ile Yerinde Görün",
    description: "Artırılmış gerçeklik ile ürünü kendi mekanında deneyimle"
  },
  {
    icon: TrendingUp,
    title: "İade Oranını Düşürün",
    description: "Detaylı 3D görsellerle beklenti-gerçeklik uyumsuzluğunu azaltın"
  },
  {
    icon: Palette,
    title: "Renk & Varyasyon",
    description: "Farklı renk ve materyal seçeneklerini anında gösterin"
  },
  {
    icon: Globe,
    title: "Web & Mobil Uyumlu",
    description: "Tüm cihazlarda sorunsuz 3D deneyimi sunun"
  }
];

const virtualTourBenefits = [
  {
    icon: TrendingUp,
    title: "Yüksek Dönüşüm Oranı",
    description: "Sanal tur deneyimi yaşayan potansiyel müşteriler %40 daha fazla dönüşüm sağlar"
  },
  {
    icon: Clock,
    title: "7/24 Erişilebilirlik",
    description: "Müşterileriniz istedikleri zaman, istedikleri yerden işletmenizi ziyaret edebilir"
  },
  {
    icon: DollarSign,
    title: "Maliyet Tasarrufu",
    description: "Fiziksel ziyaret maliyetlerini düşürün, daha fazla potansiyel müşteriyle buluşun"
  },
  {
    icon: Target,
    title: "Nitelikli Müşteri Kazanımı",
    description: "Sanal tur öncesi karar veren müşteriler daha bilinçli ve hazır alıcılardır"
  },
  {
    icon: Globe,
    title: "Küresel Erişim",
    description: "Coğrafi sınırlamaları ortadan kaldırın, dünya çapında müşteriye ulaşın"
  },
  {
    icon: Users,
    title: "Rekabet Avantajı",
    description: "Modern teknoloji kullanarak rakiplerinizin önüne geçin ve fark yaratın"
  }
];

const industries = [
  {
    icon: Building2,
    title: "Gayrimenkul",
    description: "Emlak vitrinini dijitalleştirin, uzaktan ev gezintileri düzenleyin"
  },
  {
    icon: Home,
    title: "Konaklama & Turizm",
    description: "Oteller, resortlar ve tatil köyleri için immersive deneyimler"
  },
  {
    icon: GraduationCap,
    title: "Eğitim",
    description: "Kampüs turları, laboratuvarlar ve eğitim tesisleri"
  },
  {
    icon: Factory,
    title: "Üretim & Sanayi",
    description: "Fabrika gezileri, üretim hatları ve tesis tanıtımları"
  },
  {
    icon: Store,
    title: "Perakende & Showroom",
    description: "Mağazalar, showroomlar ve sergi alanları"
  },
  {
    icon: Building2,
    title: "Müze & Kültür",
    description: "Müzeler, galeriler ve tarihi mekanlar için sanal turlar"
  }
];

const threeDUseCases = [
  {
    icon: ShoppingCart,
    title: "E-Ticaret",
    description: "Online mağazanızda ürünleri gerçeğe yakın şekilde sergileyin"
  },
  {
    icon: Car,
    title: "Otomotiv",
    description: "Araç modellerini tüm detaylarıyla ve iç mekan ile gösterin"
  },
  {
    icon: Home,
    title: "Mobilya & Dekorasyon",
    description: "Ürünlerin mekan uyumunu AR ile test ettirin"
  },
  {
    icon: Hotel,
    title: "Mücevherat",
    description: "Değerli taşları ve ürünleri her açıdan inceletebilir"
  },
  {
    icon: Ruler,
    title: "Mimari & Tasarım",
    description: "Tasarım projelerini 3D olarak müşterilerinize sunun"
  },
  {
    icon: Layers,
    title: "Endüstriyel Ürünler",
    description: "Karmaşık makineleri ve ekipmanları görselleştirin"
  }
];

const comparisonData = [
  {
    feature: "Kullanım Amacı",
    threeD: "Ürün görselleştirme",
    ar: "Ürünü kendi mekanında deneme",
    virtualTour: "Mekan & lokasyon gezisi"
  },
  {
    feature: "En Uygun Sektör",
    threeD: "E-ticaret, Üretim",
    ar: "Mobilya, Dekorasyon",
    virtualTour: "Gayrimenkul, Turizm"
  },
  {
    feature: "Cihaz Gereksinimi",
    threeD: "Tüm cihazlar",
    ar: "Akıllı telefon/tablet",
    virtualTour: "Tüm cihazlar + VR"
  },
  {
    feature: "İnteraksiyon Seviyesi",
    threeD: "Yüksek - 360° dönme",
    ar: "Çok Yüksek - Yerleştirme",
    virtualTour: "Orta - Navigasyon"
  },
  {
    feature: "Uygulama Süresi",
    threeD: "2-5 gün",
    ar: "3-7 gün",
    virtualTour: "5-10 gün"
  }
];

const ThreeDARVirtualTour = () => {
  const [selectedTour, setSelectedTour] = useState<number | null>(null);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [arModelUrl, setArModelUrl] = useState<string>('');
  const [arModelColor, setArModelColor] = useState<string>('#1a1a1a');
  const [arModelColorName, setArModelColorName] = useState<string>('Siyah');
  const videoRef = useRef<HTMLVideoElement>(null);

  const nextTour = () => {
    setCurrentTourIndex((prev) => (prev + 1) % virtualTours.length);
  };

  const prevTour = () => {
    setCurrentTourIndex((prev) => (prev - 1 + virtualTours.length) % virtualTours.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="pb-16 bg-white dark:bg-dark">
      {/* Hero Section with 3D Model - Focused on 3D & AR */}
      <section className="relative min-h-[90vh] md:min-h-[95vh] lg:min-h-screen flex items-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA40_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA40_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#5FC8DA25_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA25_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content - Focus on 3D Modeling & AR */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary-light/20 text-primary mb-6"
              >
                <BoxSelect className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">3D Modelleme & AR Teknolojisi</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                3D Ürün Modelleme
                <span className="block text-primary">& Artırılmış Gerçeklik</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Ürünlerinizi interaktif 3D modeller ve artırılmış gerçeklik (AR) teknolojisi ile sunun.
                Müşterileriniz ürünleri her açıdan inceleyebilir, kendi mekanlarında sanal olarak test edebilir.
              </p>

              <div className="bg-white/50 dark:bg-dark-light/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-primary/10">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">3D & AR İle Neler Yapabilirsiniz?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>360° Ürün Görselleri:</strong> Müşterileriniz ürünü her açıdan döndürerek inceleyebilir
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Renk & Materyal Seçenekleri:</strong> Farklı varyasyonları anında gösterin
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>AR ile Yerinde Test:</strong> Mobilya, dekorasyon ürünlerini kendi mekanında görün
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Web & Mobil Uyumlu:</strong> Tüm platformlarda sorunsuz çalışır
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/project-request"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all group"
                  >
                    <span>3D Model Talebi</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: 3D Bean Bag Chair Model with Color Options */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative w-full">
                <BeanBagChair3D
                  className="w-full"
                  onARClick={(modelUrl, color, colorName) => {
                    setArModelUrl(modelUrl);
                    setArModelColor(color);
                    setArModelColorName(colorName);
                    setIsARModalOpen(true);
                  }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-4 text-center"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Sol üstten renk seçeneklerini deneyin
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3D & AR Benefits Section */}
      <section className="py-16 sm:py-20 bg-white/50 dark:bg-dark-light/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 flex flex-col items-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              3D Modelleme & AR'ın Faydaları
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              İşletmeniz için 3D ürün görselleri ve AR teknolojisinin sağladığı avantajlar
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            {threeDARBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-dark-light/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3D Use Cases Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 flex flex-col items-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              3D & AR Kullanım Alanları
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Farklı sektörlerde 3D modelleme ve AR ile fark yaratın
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            {threeDUseCases.map((useCase, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-dark-light/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all group cursor-pointer touch-manipulation"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <useCase.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  {useCase.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Divider Section - Transitioning to Virtual Tours */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-primary-light/10 to-primary/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Video className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Sanal Turlar Farklı Bir Deneyim
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              3D modelleme ve AR ürünleri sergilerken, sanal turlar tüm mekanınızı, işletmenizi veya lokasyonunuzu
              360° panoramik görüntülerle dijital olarak gezdirir
            </p>
          </motion.div>
        </div>
      </section>

      {/* Virtual Tour Video/Demo Section */}
      <section className="py-16 sm:py-20 bg-white/50 dark:bg-dark-light/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 flex flex-col items-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary-light/20 text-primary mb-6"
            >
              <ScanLine className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">360° Sanal Tur Teknolojisi</span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Sanal Tur Nedir?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              360° panoramik fotoğraflar ve videolarla oluşturulan interaktif mekan gezintileri.
              Müşterileriniz işletmenizi sanki oradaymış gibi keşfedebilir.
            </p>
          </motion.div>

          {/* Video Demo Placeholder */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl mb-12 bg-slate-900"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Örnek Sanal Tur Deneyimi
              </h3>
              <p className="text-gray-200 mb-6 max-w-2xl">
                Modern ofis alanı, üretim tesisi veya otel odası - tüm mekanlarınızı dijital olarak gezintiye dönüştürün
              </p>
            </div>
          </motion.div>

          {/* Virtual Tour Examples Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {virtualTours.map((tour) => (
              <motion.div
                key={tour.id}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={fadeInUp.viewport}
                className="bg-white dark:bg-dark-light/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all cursor-pointer group touch-manipulation"
                onClick={() => setSelectedTour(tour.id)}
              >
                <div className="relative aspect-video overflow-hidden touch-manipulation">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <span className="px-2.5 sm:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {tour.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-3 mb-2">
                    {tour.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tour.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour Benefits */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 flex flex-col items-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Sanal Turların İşletmenize Katkıları
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              360° sanal turlar ile mekanınızı dijital dünyada öne çıkarın
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            {virtualTourBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-dark-light/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 sm:py-20 bg-white/50 dark:bg-dark-light/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 flex flex-col items-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Sanal Tur Kullanım Alanları
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Farklı sektörlerde sanal turlarla fark yaratın
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-dark-light/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all group cursor-pointer touch-manipulation"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <industry.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  {industry.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Comparison Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 flex flex-col items-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Hangi Teknoloji Sizin İçin?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              3D Modelleme, AR ve Sanal Tur teknolojilerini karşılaştırın
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
            className="overflow-x-auto -mx-4 sm:mx-0"
          >
            <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-white/10 sm:rounded-xl">
            <table className="min-w-full bg-white dark:bg-dark-light/50">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    Özellik
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-primary whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <BoxSelect className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">3D Modelleme</span>
                      <span className="sm:hidden">3D</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-primary whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden md:inline">AR (Artırılmış Gerçeklik)</span>
                      <span className="md:hidden">AR</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-primary whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Sanal Tur</span>
                      <span className="sm:hidden">Tur</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {row.threeD}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {row.ar}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {row.virtualTour}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-white/50 dark:bg-dark-light/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/10 to-primary-light/10 backdrop-blur-sm p-8 sm:p-12 rounded-2xl border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA40_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA40_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            <div className="relative text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                İşletmenizi Dijital Dünyaya Taşıyın
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 px-4">
                3D modelleme, AR veya sanal tur çözümlerimiz hakkında detaylı bilgi alın ve ücretsiz demo talep edin
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/project-request"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    <span>Hemen Başlayın</span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-white dark:bg-dark-light border-2 border-primary text-primary rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>İletişime Geçin</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AR Viewer Modal */}
      <ARViewer
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        modelUrl={arModelUrl}
        currentColor={arModelColor}
        colorName={arModelColorName}
      />

      {/* Virtual Tour Modal */}
      <AnimatePresence>
        {selectedTour !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTour(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-dark-light rounded-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate pr-2">
                  {virtualTours.find(t => t.id === selectedTour)?.title}
                </h3>
                <button
                  onClick={() => setSelectedTour(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="aspect-video">
                <iframe
                  src={virtualTours.find(t => t.id === selectedTour)?.panoramaUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Virtual Tour"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThreeDARVirtualTour;
