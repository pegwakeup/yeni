import { MarqueeAnimation } from "../effects/marquee-effect";
import { useTranslation } from "../../../hooks/useTranslation";

/**
 * Marquee section showcasing Unilancer services
 * Can be used in Hero sections or as a visual separator
 */
export function ServicesMarqueeSection() {
  const { t } = useTranslation();

  return (
    <section className="py-8 w-full overflow-hidden">
      <MarqueeAnimation
        direction="left"
        baseVelocity={-4}
        className="bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 text-primary dark:text-primary py-6 text-3xl sm:text-4xl md:text-5xl"
      >
        {t('home.services.web')} • {t('home.services.mobile')} • {t('home.services.design')} • {t('home.services.marketing')}
      </MarqueeAnimation>
    </section>
  );
}

/**
 * Tech stack marquee showing technologies used
 * Great for About or Services pages
 */
export function TechStackMarquee() {
  return (
    <div className="flex flex-col gap-6">
      <MarqueeAnimation
        direction="left"
        baseVelocity={-5}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 text-4xl"
      >
        React • TypeScript • Tailwind CSS • Framer Motion
      </MarqueeAnimation>
      <MarqueeAnimation
        direction="right"
        baseVelocity={-4}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 text-4xl"
      >
        Node.js • Supabase • PostgreSQL • Edge Functions
      </MarqueeAnimation>
    </div>
  );
}

/**
 * Simple brand marquee for hero sections
 */
export function BrandMarquee() {
  return (
    <div className="my-12">
      <MarqueeAnimation
        direction="left"
        baseVelocity={-3}
        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 text-5xl sm:text-6xl md:text-7xl font-black tracking-tight"
      >
        UNILANCER • FREELANCE • PLATFORM • INNOVATION
      </MarqueeAnimation>
    </div>
  );
}

/**
 * Testimonial-style marquee
 */
export function TestimonialMarquee() {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <MarqueeAnimation
        direction="right"
        baseVelocity={-2}
        className="bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 py-4 text-2xl sm:text-3xl italic"
      >
        ⭐ {t('testimonials.rating')} • ⭐ 100+ {t('testimonials.clients')} • ⭐ {t('testimonials.satisfaction')}
      </MarqueeAnimation>
    </section>
  );
}

/**
 * Promotional banner marquee
 */
export function PromotionalMarquee({ message }: { message: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <MarqueeAnimation
        direction="left"
        baseVelocity={-6}
        className="bg-yellow-400 text-slate-900 py-2 text-xl sm:text-2xl font-bold"
      >
        🎉 {message} 🎉
      </MarqueeAnimation>
    </div>
  );
}
