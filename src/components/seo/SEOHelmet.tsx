import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { getRouteForLanguage } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export function SEOHelmet({
  title = 'Unilancer',
  description,
  keywords,
  image = 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/Unilancer%20logo%202.webp',
  type = 'website'
}: SEOHelmetProps) {
  const { language } = useLanguage();
  const location = useLocation();

  const defaultTitles = {
    tr: 'Unilancer - Türkiye\'nin Üniversiteli Freelancer Platformu',
    en: 'Unilancer - Turkey\'s University Freelancer Platform'
  };

  const defaultDescriptions = {
    tr: 'Unilancer\'da projelerinizi seçilmiş üniversiteli ekipler üretir, deneyimli proje yöneticileri uçtan uca yönetir. Uygun bütçeyle kaliteli işler yapın.',
    en: 'At Unilancer, selected university teams produce your projects, experienced project managers manage them end-to-end. Get quality work with an affordable budget.'
  };

  const defaultKeywords = {
    tr: 'freelancer, üniversiteli, öğrenci, proje, web tasarım, yazılım geliştirme, grafik tasarım, dijital pazarlama',
    en: 'freelancer, university student, project, web design, software development, graphic design, digital marketing'
  };

  const fullTitle = title === 'Unilancer' ? defaultTitles[language] : `${title} | Unilancer`;
  const finalDescription = description || defaultDescriptions[language];
  const finalKeywords = keywords || defaultKeywords[language];

  const baseUrl = 'https://unilancer.com';
  const currentPath = location.pathname.replace(/^\/(tr|en)/, '');

  const trUrl = `${baseUrl}${getRouteForLanguage(currentPath, 'tr')}`;
  const enUrl = `${baseUrl}${getRouteForLanguage(currentPath, 'en')}`;

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      <link rel="alternate" hrefLang="tr" href={trUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={trUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={language === 'tr' ? trUrl : enUrl} />
      <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : 'en_US'} />
      <meta property="og:locale:alternate" content={language === 'tr' ? 'en_US' : 'tr_TR'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />

      <link rel="canonical" href={language === 'tr' ? trUrl : enUrl} />
    </Helmet>
  );
}
