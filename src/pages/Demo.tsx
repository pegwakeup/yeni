import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from '@/components/ui/hero-section-5';

const Demo = () => {
  return (
    <>
      <Helmet>
        <title>Demo | Unilancer</title>
        <meta name="description" content="Unilancer demo sayfası - Dijital çözümlerimizi keşfedin." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeroSection />
      </div>
    </>
  );
};

export default Demo;
