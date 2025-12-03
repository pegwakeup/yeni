import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Code2, Palette, LineChart, Globe, Smartphone, Database,
  BrainCircuit, PaintBucket, FileImage, Figma, Monitor,
  Search, Target, BarChart2, ArrowUpRight, ExternalLink,
  Github, Eye, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPortfolioItems, type PortfolioItem } from '../lib/api/portfolio';
import { useTranslation } from '../hooks/useTranslation';

// Categories and subcategories mapping (using function to access t)
const getCategories = (t: (key: string) => string) => ({
  software: {
    label: t('portfolio.category.software'),
    icon: Code2,
    subcategories: [
      { id: 'web', label: t('portfolio.category.web'), icon: Globe },
      { id: 'mobile', label: t('portfolio.category.mobile'), icon: Smartphone },
      { id: 'saas', label: t('portfolio.category.saas'), icon: Database },
      { id: 'ai', label: t('portfolio.category.ai'), icon: BrainCircuit }
    ]
  },
  design: {
    label: t('portfolio.category.design'),
    icon: Palette,
    subcategories: [
      { id: 'ui-ux', label: t('portfolio.category.uiux'), icon: Monitor },
      { id: 'brand', label: t('portfolio.category.brand'), icon: PaintBucket },
      { id: 'print', label: t('portfolio.category.print'), icon: FileImage },
      { id: 'illustration', label: t('portfolio.category.illustration'), icon: Figma }
    ]
  },
  marketing: {
    label: t('portfolio.category.marketing'),
    icon: LineChart,
    subcategories: [
      { id: 'seo', label: t('portfolio.category.seo'), icon: Search },
      { id: 'ads', label: t('portfolio.category.ads'), icon: Target },
      { id: 'analytics', label: t('portfolio.category.analytics'), icon: BarChart2 }
    ]
  }
});

const Portfolio = () => {
  const { t } = useTranslation();
  const categories = getCategories(t);
  
  // SEO meta data
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const seoTitle = currentLang === 'tr' 
    ? 'Portfolyo | Unilancer - Tamamladığımız Projeler ve Çalışmalar'
    : 'Portfolio | Unilancer - Our Completed Projects and Works';
  const seoDescription = currentLang === 'tr'
    ? 'Unilancer\'ın tamamladığı web tasarım, yazılım, 3D/AR, e-ticaret, dijital pazarlama ve kurumsal kimlik projelerini keşfedin. Başarılı çalışmalarımızı inceleyin.'
    : 'Discover Unilancer\'s completed web design, software, 3D/AR, e-commerce, digital marketing, and brand identity projects. Explore our successful works.';
  const canonicalUrl = `https://unilancer.co/${currentLang}/portfolyo`;

  const CategoryIcon = ({ category }: { category: string }) => {
    const categoryData = categories[category as keyof typeof categories];
    if (!categoryData) return null;

    const Icon = categoryData.icon;
    return <Icon className="w-4 h-4 text-primary" />;
  };
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolioItems();
  }, []);

  const loadPortfolioItems = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioItems();
      setItems(data);
    } catch (err) {
      console.error('Portfolio items loading error:', err);
      setError(t('portfolio.loading'));
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = !selectedCategory || item.main_category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || item.sub_category === selectedSubcategory;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="portfolyo, projeler, web tasarım, yazılım, 3D, AR, e-ticaret, dijital pazarlama, kurumsal kimlik, başarılı çalışmalar" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="tr" href="https://unilancer.co/tr/portfolyo" />
        <link rel="alternate" hrefLang="en" href="https://unilancer.co/en/portfolio" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://unilancer.co/og-portfolio.jpg" />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:locale" content={currentLang === 'tr' ? 'tr_TR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://unilancer.co/og-portfolio.jpg" />
        
        {/* CollectionPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": seoTitle,
            "description": seoDescription,
            "url": canonicalUrl,
            "mainEntity": {
              "@type": "ItemList",
              "name": currentLang === 'tr' ? "Unilancer Portfolyo" : "Unilancer Portfolio",
              "numberOfItems": items.length,
              "itemListElement": items.slice(0, 10).map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "CreativeWork",
                  "name": item.title,
                  "description": item.description,
                  "image": item.main_image,
                  "url": `https://unilancer.co/${currentLang}/portfolyo/${item.slug}`
                }
              }))
            }
          })}
        </script>
        
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": currentLang === 'tr' ? "Ana Sayfa" : "Home",
                "item": `https://unilancer.co/${currentLang}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": currentLang === 'tr' ? "Portfolyo" : "Portfolio",
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      </Helmet>

    <div className="pt-24 pb-16 bg-white dark:bg-dark">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000"
            alt="Portfolio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white dark:from-dark/90 dark:via-dark/70 dark:to-dark" />
        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              {t('portfolio.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('portfolio.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-blue-100/40 dark:bg-dark-light/30 sticky top-20 z-30 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder={t('blog.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              className={`px-6 py-3 rounded-xl transition-all ${
                !selectedCategory
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-dark-light text-gray-700 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-transparent'
              }`}
            >
              {t('portfolio.category.all')}
            </button>
            
            {Object.entries(categories).map(([key, category]) => (
              <div key={key} className="relative group">
                <button
                  onClick={() => {
                    setSelectedCategory(key);
                    setSelectedSubcategory(null);
                  }}
                  className={`px-6 py-3 rounded-xl transition-all ${
                    selectedCategory === key
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-dark-light text-gray-700 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-transparent'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <category.icon className="w-5 h-5" />
                    <span>{category.label}</span>
                  </span>
                </button>

                {/* Subcategories Dropdown */}
                <AnimatePresence>
                  {selectedCategory === key && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-xl z-10"
                    >
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedSubcategory(sub.id)}
                          className={`w-full px-4 py-3 flex items-center space-x-2 transition-colors ${
                            selectedSubcategory === sub.id
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <sub.icon className="w-4 h-4" />
                          <span>{sub.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={loadPortfolioItems}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
              >
                {t('portfolio.retry', 'Tekrar Dene')}
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">{t('portfolio.noProjects')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="group relative"
                  onHoverStart={() => setHoveredId(item.id)}
                  onHoverEnd={() => setHoveredId(null)}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-dark-light/50 border border-slate-200 dark:border-white/10">
                    <motion.img
                      src={item.main_image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: hoveredId === item.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent dark:from-dark/90 dark:via-dark/50 dark:to-transparent p-6 flex flex-col justify-end"
                      initial={{ opacity: 0.8 }}
                      animate={{
                        opacity: hoveredId === item.id ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: hoveredId === item.id ? 0 : 20,
                          opacity: hoveredId === item.id ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Category Badge */}
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={item.main_category} />
                          <span className="text-sm text-primary uppercase tracking-wider">
                            {categories[item.main_category as keyof typeof categories]?.label}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                          <p className="text-gray-200 dark:text-gray-300 line-clamp-2">{item.description}</p>
                        </div>

                        {/* Technologies */}
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.technologies.slice(0, 3).map((tech, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-white/10 rounded-full text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                            {item.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                                +{item.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex items-center gap-4">
                          {item.live_url && (
                            <a 
                              href={item.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="text-sm">{t('portfolio.live', 'Canlı')}</span>
                            </a>
                          )}
                          {item.github_url && (
                            <a 
                              href={item.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
                            >
                              <Github className="w-4 h-4" />
                              <span className="text-sm">{t('portfolio.github', 'GitHub')}</span>
                            </a>
                          )}
                          <Link
                            to={`/portfolio/${item.slug}`}
                            className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors ml-auto"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{t('portfolio.details', 'Detaylar')}</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
};

export default Portfolio;