import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { detectUserLocation, markGeolocationDetected } from '../lib/services/geolocation';
import { getStaticTranslation } from '../lib/translations';

export type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'unilancer_language';

const routeTranslations: Record<string, Record<Language, string>> = {
  '/': { tr: '/', en: '/' },
  '/portfolio': { tr: '/portfolyo', en: '/portfolio' },
  '/services': { tr: '/hizmetler', en: '/services' },
  '/about': { tr: '/hakkimizda', en: '/about' },
  '/blog': { tr: '/blog', en: '/blog' },
  '/contact': { tr: '/iletisim', en: '/contact' },
  '/team': { tr: '/ekibimiz', en: '/team' },
  '/join': { tr: '/basvuru', en: '/join' },
  '/project-request': { tr: '/proje-talebi', en: '/project-request' },
  '/digitall/3d-ar-sanal-tur': { tr: '/digitall/3d-ar-sanal-tur', en: '/digitall/3d-ar-virtual-tour' }
};

const reverseRouteTranslations: Record<string, string> = {};
Object.entries(routeTranslations).forEach(([base, langs]) => {
  reverseRouteTranslations[langs.tr] = base;
  reverseRouteTranslations[langs.en] = base;
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialLanguage = async (): Promise<Language> => {
    const pathLang = location.pathname.startsWith('/en/') ? 'en' :
                     location.pathname.startsWith('/tr/') ? 'tr' : null;

    if (pathLang) return pathLang;

    const savedLang = localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (savedLang === 'tr' || savedLang === 'en') return savedLang;

    const geoResult = await detectUserLocation();
    if (geoResult && geoResult.detected) {
      markGeolocationDetected();
      return geoResult.suggestedLanguage;
    }

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) return 'en';

    return 'tr';
  };

  const [language, setLanguageState] = useState<Language>('tr');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initLanguage = async () => {
      // Skip language redirect for admin and login routes
      if (location.pathname.startsWith('/admin') || location.pathname === '/login') {
        setIsInitialized(true);
        return;
      }

      const initialLang = await getInitialLanguage();
      setLanguageState(initialLang);
      await loadTranslations(initialLang);
      setIsInitialized(true);

      if (!location.pathname.startsWith(`/${initialLang}`)) {
        const currentPathWithoutLang = location.pathname.replace(/^\/(tr|en)/, '') || '/';
        const baseRoute = reverseRouteTranslations[currentPathWithoutLang] || currentPathWithoutLang;
        const translatedRoute = routeTranslations[baseRoute]?.[initialLang] || baseRoute;
        const newPath = `/${initialLang}${translatedRoute}`;

        if (location.pathname !== newPath) {
          navigate(newPath, { replace: true });
        }
      }
    };

    if (!isInitialized) {
      initLanguage();
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      loadTranslations(language);
    }
  }, [language, isInitialized]);

  const loadTranslations = async (lang: Language) => {
    if (lang === 'tr') {
      setTranslations({});
      return;
    }

    try {
      const { supabase } = await import('../lib/config/supabase');
      const { data } = await supabase
        .from('translations')
        .select('content_key, translated_text')
        .eq('language', lang);

      if (data) {
        const translationMap: Record<string, string> = {};
        data.forEach((item) => {
          translationMap[item.content_key] = item.translated_text;
        });
        setTranslations(translationMap);
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);

    const currentPathWithoutLang = location.pathname.replace(/^\/(tr|en)/, '') || '/';
    const baseRoute = reverseRouteTranslations[currentPathWithoutLang] || currentPathWithoutLang;

    // If switching to English and on a blog page, redirect to home
    if (lang === 'en' && (baseRoute === '/blog' || baseRoute.startsWith('/blog/'))) {
      navigate('/en', { replace: true });
      return;
    }

    const translatedRoute = routeTranslations[baseRoute]?.[lang] || baseRoute;
    const newPath = `/${lang}${translatedRoute}`;

    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  const t = (key: string, fallback?: string): string => {
    const staticFallback = getStaticTranslation(key, language);

    if (language === 'tr') {
      return fallback || staticFallback || key;
    }

    return translations[key] || staticFallback || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function getRouteForLanguage(route: string, lang: Language): string {
  const baseRoute = reverseRouteTranslations[route] || route;
  const translatedRoute = routeTranslations[baseRoute]?.[lang] || route;
  return `/${lang}${translatedRoute}`;
}

export function getBaseRoute(pathname: string): string {
  const pathWithoutLang = pathname.replace(/^\/(tr|en)/, '') || '/';
  return reverseRouteTranslations[pathWithoutLang] || pathWithoutLang;
}
