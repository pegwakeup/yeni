import React from 'react';
import { Helmet } from 'react-helmet-async';
import TeamSection from '../components/ui/TeamSection';

const Team = () => {
  // SEO meta data
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const seoTitle = currentLang === 'tr' 
    ? 'Ekibimiz | Unilancer - Genç ve Yetenekli Profesyoneller'
    : 'Our Team | Unilancer - Young and Talented Professionals';
  const seoDescription = currentLang === 'tr'
    ? 'Unilancer ekibini tanıyın. Web tasarım, yazılım, 3D, pazarlama ve daha fazlasında uzman genç yeteneklerimizle tanışın.'
    : 'Meet the Unilancer team. Get to know our young talented experts in web design, software, 3D, marketing, and more.';
  const canonicalUrl = `https://unilancerlabs.com/${currentLang}/ekip`;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="ekip, takım, team, unilancer, genç yetenek, profesyoneller, uzmanlar" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="tr" href="https://unilancerlabs.com/tr/ekip" />
        <link rel="alternate" hrefLang="en" href="https://unilancerlabs.com/en/team" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://unilancerlabs.com/og-team.jpg" />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:locale" content={currentLang === 'tr' ? 'tr_TR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://unilancerlabs.com/og-team.jpg" />
        
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
                "item": `https://unilancerlabs.com/${currentLang}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": currentLang === 'tr' ? "Ekip" : "Team",
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      </Helmet>
      
    <div className="min-h-screen bg-white dark:bg-dark pt-24">
      <TeamSection />
    </div>
    </>
  );
};

export default Team;
