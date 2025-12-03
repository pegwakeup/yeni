import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const NotFound = () => {
  const { language } = useLanguage();
  const location = useLocation();

  const content = {
    tr: {
      title: '404 - Sayfa Bulunamadı',
      heading: 'Aradığınız sayfa bulunamadı',
      description: 'Üzgünüz, aradığınız sayfa mevcut değil veya taşınmış olabilir.',
      homeButton: 'Ana Sayfaya Dön',
      backButton: 'Geri Dön',
      searchText: 'Belki şunları arıyordunuzdur:',
      links: [
        { name: 'Hizmetlerimiz', path: '/tr/hizmetler' },
        { name: 'Portfolyo', path: '/tr/portfolyo' },
        { name: 'Hakkımızda', path: '/tr/hakkimizda' },
        { name: 'İletişim', path: '/tr/iletisim' },
      ]
    },
    en: {
      title: '404 - Page Not Found',
      heading: 'Page not found',
      description: 'Sorry, the page you are looking for does not exist or may have been moved.',
      homeButton: 'Go to Home',
      backButton: 'Go Back',
      searchText: 'Maybe you were looking for:',
      links: [
        { name: 'Our Services', path: '/en/services' },
        { name: 'Portfolio', path: '/en/portfolio' },
        { name: 'About Us', path: '/en/about' },
        { name: 'Contact', path: '/en/contact' },
      ]
    }
  };

  const t = content[language];
  const homePath = language === 'tr' ? '/tr' : '/en';

  return (
    <>
      <Helmet>
        <title>{t.title} | Unilancer</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-white dark:bg-dark flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold text-gray-100 dark:text-gray-800 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 md:w-24 md:h-24 text-primary animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t.heading}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {t.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to={homePath}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors min-h-[44px]"
            >
              <Home className="w-5 h-5" />
              {t.homeButton}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
              {t.backButton}
            </button>
          </div>

          {/* Suggested Links */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t.searchText}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {t.links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 text-sm text-primary hover:text-primary/80 bg-primary/10 rounded-full transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Path Info (for debugging) */}
          <p className="mt-8 text-xs text-gray-400 dark:text-gray-600">
            {location.pathname}
          </p>
        </div>
      </main>
    </>
  );
};

export default NotFound;
