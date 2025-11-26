import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, Globe, Smartphone, Database, BrainCircuit,
  PaintBucket, FileImage, Figma, Monitor,
  Search, Target, BarChart2, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    category: "Yazılım",
    icon: Code2,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
    items: [
      { icon: Globe, title: "Web Geliştirme", link: "/services/software" },
      { icon: Smartphone, title: "Mobil Uygulama", link: "/services/software" },
      { icon: Database, title: "SaaS Çözümleri", link: "/services/software" },
      { icon: BrainCircuit, title: "AI Entegrasyonları", link: "/services/software" }
    ]
  },
  {
    category: "Tasarım",
    icon: PaintBucket,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=2000",
    items: [
      { icon: Monitor, title: "Dijital & Web Tasarım", link: "/services/design/digital-web" },
      { icon: PaintBucket, title: "Kurumsal Kimlik & Marka", link: "/services/design/brand-identity" },
      { icon: FileImage, title: "Basılı & Grafik Tasarım", link: "/services/design/print-graphic" },
      { icon: Figma, title: "İllüstrasyon & 3D", link: "/services/design/illustration" }
    ]
  },
  {
    category: "Dijital Pazarlama",
    icon: Target,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000",
    items: [
      { icon: Search, title: "SEO & SEM", link: "/services/marketing" },
      { icon: Target, title: "Dijital Reklam", link: "/services/marketing" },
      { icon: BarChart2, title: "Analitik", link: "/services/marketing" }
    ]
  }
];

const ServicesSection = () => {
  return (
    <div className="w-full py-12 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:from-transparent dark:via-transparent dark:to-transparent">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Hizmetlerimiz</h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Modern teknolojiler ve yaratıcı çözümlerle işletmenizi dijital dünyada öne çıkarıyoruz.
          </p>
        </motion.div>

        {/* Hizmet kartları */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px]">
            {services.map((service, index) => (
              <motion.div
                key={service.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-dark-light/50 dark:via-dark-light/30 dark:to-dark-light/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl relative group shadow-lg hover:shadow-2xl overflow-hidden w-full transition-shadow duration-500"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={service.image}
                    alt={service.category}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-100/95 via-slate-50/90 to-slate-100/95 dark:from-dark/90 dark:via-dark/80 dark:to-dark/90" />
                </div>
                
                <div className="relative z-10 p-6">
                  {/* Category Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{service.category}</h3>
                  </div>

                  {/* Service Items */}
                  <div className="flex flex-col gap-4">
                    {service.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        to={item.link}
                        className="flex items-center p-4 bg-white/80 dark:bg-dark/50 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-dark transition-colors group/item border border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-transparent shadow-sm"
                      >
                        <div className="w-10 h-10 bg-primary/10 dark:bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-900 dark:text-white transition-colors">{item.title}</span>
                            <ArrowUpRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ServicesSection };