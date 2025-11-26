import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowUpRight, Clock, ChevronRight, ChevronLeft, Filter, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { getBlogPosts, type BlogPost } from '../lib/config/supabase';
import { useTranslation } from '../hooks/useTranslation';
import AuroraBackground from '../components/ui/effects/aurora-background';

const getCategoryKeys = () => [
  'blog.category.all',
  'blog.category.technology',
  'blog.category.design',
  'blog.category.ai',
  'blog.category.webDevelopment',
  'blog.category.mobile'
];

const BlogHeroSkeleton = () => (
  <div className="w-full h-[500px] md:h-[600px] bg-slate-200 dark:bg-white/5 animate-pulse relative">
    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-4xl space-y-4">
      <div className="h-8 w-32 bg-slate-300 dark:bg-white/10 rounded-full" />
      <div className="h-12 w-3/4 bg-slate-300 dark:bg-white/10 rounded-lg" />
      <div className="h-6 w-1/2 bg-slate-300 dark:bg-white/10 rounded-lg" />
    </div>
  </div>
);

const BlogCardSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="aspect-[4/3] bg-slate-200 dark:bg-white/5 rounded-2xl" />
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="h-4 w-24 bg-slate-200 dark:bg-white/5 rounded" />
        <div className="h-4 w-4 bg-slate-200 dark:bg-white/5 rounded-full" />
        <div className="h-4 w-16 bg-slate-200 dark:bg-white/5 rounded" />
      </div>
      <div className="h-6 w-full bg-slate-200 dark:bg-white/5 rounded" />
      <div className="h-6 w-2/3 bg-slate-200 dark:bg-white/5 rounded" />
    </div>
  </div>
);

const Blog = () => {
  const { t, language } = useTranslation();
  const categoryKeys = getCategoryKeys();
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visiblePosts, setVisiblePosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const postsPerPage = 9;

  // Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  // Auto-play effect
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const filtered = posts.filter(post => {
      // Check if category matches key or translated value
      const matchesCategory = selectedCategory === "blog.category.all" || 
                            post.category === selectedCategory || 
                            post.category === t(selectedCategory);
                            
      const matchesSearch =
        post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setVisiblePosts(filtered);
  }, [selectedCategory, debouncedQuery, posts, t]);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getBlogPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Blog yazıları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Show hero slider if we have any posts and we are not searching
  // Banner is independent of the category filter
  const shouldShowHero = posts.length > 0 && !debouncedQuery;
  
  // Always show the latest 3 posts from the global list in the banner
  const featuredPosts = shouldShowHero ? posts.slice(0, 3) : [];
  
  // Grid shows the filtered list (visiblePosts)
  // We do NOT slice the first 3 anymore, so posts in banner are also shown in the list
  const gridPosts = visiblePosts;
  
  // Pagination logic
  const totalPages = Math.ceil(gridPosts.length / postsPerPage);
  const currentGridPosts = gridPosts.slice((page - 1) * postsPerPage, page * postsPerPage);

  return (
    <div className="relative min-h-screen">
      <Helmet>
        <title>Blog | Unilancer</title>
        <meta name="description" content="Teknoloji, tasarım ve dijital dönüşüm hakkında güncel içerikler." />
      </Helmet>

      {/* Arka plan */}
      <div className="fixed inset-0 z-0">
        <AuroraBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/20 to-blue-100/20 dark:from-dark dark:via-dark-light dark:to-dark" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA10_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)] opacity-70" />
      </div>

      {/* Navbar Spacer */}
      <div className="h-20 md:h-24" />

      {/* HERO SECTION - Full Image Slider */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
        {loading ? (
          <BlogHeroSkeleton />
        ) : featuredPosts.length > 0 ? (
          <div className="relative group">
            <div className="overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5" ref={emblaRef}>
              <div className="flex">
                {featuredPosts.map((post) => (
                  <div key={post.id} className="flex-[0_0_100%] min-w-0 relative h-[500px] md:h-[600px]">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-16 max-w-4xl">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                      >
                        <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/20">
                          {t(post.category)}
                        </span>
                        
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                          {post.title}
                        </h1>
                        
                        <p className="text-gray-200 text-lg md:text-xl line-clamp-3 leading-relaxed max-w-2xl drop-shadow-md">
                          {post.excerpt}
                        </p>
                        
                        <div className="pt-6 flex flex-wrap gap-6 items-center">
                          <Link 
                            to={`/${language}/blog/${post.slug}`}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold transition-all hover:bg-primary hover:scale-105 shadow-lg"
                          >
                            {t('blog.readFullArticle')}
                            <ArrowUpRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex 
                      ? "bg-white w-8" 
                      : "bg-white/40 w-2 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Slider Controls */}
            <div className="absolute bottom-8 right-8 flex gap-3 z-20">
              <button 
                onClick={scrollPrev}
                className="p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={scrollNext}
                className="p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Header & Filters - Centered Pill Style */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Categories Pill */}
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-1.5 rounded-full inline-flex flex-wrap justify-center gap-1 shadow-lg max-w-full overflow-x-auto no-scrollbar">
            {categoryKeys.map((key) => (
              <button
                key={key}
                onClick={() => { setSelectedCategory(key); setPage(1); }}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                  ${selectedCategory === key
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10'}
                `}
              >
                {t(key)}
              </button>
            ))}
          </div>

          {/* Search & Sort Row */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
               {selectedCategory === 'blog.category.all' ? (
                 <>
                   {t('blog.latestUpdates')} <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                 </>
               ) : t(selectedCategory)}
             </h2>
             
             <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-full pl-11 pr-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        {/* POSTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl p-8 max-w-lg mx-auto">
                <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
                <button 
                  onClick={loadBlogPosts} 
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-bold"
                >
                  {t('blog.tryAgain')}
                </button>
              </div>
            </div>
          ) : currentGridPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
                <p className="text-slate-600 dark:text-gray-400 font-medium">
                  {searchQuery ? t('blog.noPostsFound') : t('blog.noPostsYet')}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="mt-4 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:opacity-90 transition-opacity text-sm font-bold"
                  >
                    {t('blog.clearSearch')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            currentGridPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-[2rem] p-4 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:shadow-xl"
              >
                <Link to={`/${language}/blog/${post.slug}`} className="block mb-6 relative overflow-hidden rounded-[1.5rem] aspect-[4/3]">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover object-right transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-black/50 backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold rounded-full shadow-sm">
                      {t(post.category)}
                    </span>
                  </div>
                </Link>
                
                <div className="space-y-4 px-2 pb-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600" />
                    <span>{new Date(post.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  
                  <Link to={`/${language}/blog/${post.slug}`}>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed text-sm">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-4 mt-auto border-t border-slate-100 dark:border-white/5">
                    <Link to={`/${language}/blog/${post.slug}`} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors ml-auto">
                      {t('blog.readMore')}
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-3">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 rounded-full bg-white dark:bg-white/5 text-slate-900 dark:text-white hover:bg-primary hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm border border-slate-200 dark:border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`
                  w-12 h-12 rounded-full text-sm font-bold transition-all shadow-sm border
                  ${page === i + 1
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                    : 'bg-white dark:bg-white/5 text-slate-900 dark:text-white border-slate-200 dark:border-white/10 hover:bg-primary hover:text-slate-900 hover:border-primary'}
                `}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-3 rounded-full bg-white dark:bg-white/5 text-slate-900 dark:text-white hover:bg-primary hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm border border-slate-200 dark:border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* CTA SECTION */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary to-primary-dark">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -left-40 -top-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          className="absolute -right-40 -bottom-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('blog.cta.title', 'Hadi Başlayalım!')}
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            {t('blog.cta.description', 'İster müşteri olun ister freelancer, sizin için doğru yerdesiniz.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href={`/${language}/basvuru`}
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{t('blog.cta.freelancer_apply', 'Freelancer Başvurusu')}</span>
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://wa.me/+905061523255"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{t('blog.cta.project_request', 'Proje Talebi')}</span>
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
