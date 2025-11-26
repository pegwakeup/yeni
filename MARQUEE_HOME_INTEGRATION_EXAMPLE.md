# Adding Marquee to Home Page - Step by Step

## Quick Integration Example

Here's how to add the marquee effect to your Home page in 3 simple steps:

### Step 1: Import the Component

```tsx
// src/pages/Home.tsx
import { ServicesMarqueeSection } from "../components/ui/sections/marquee-section";
```

### Step 2: Add to Your JSX

```tsx
const Home = () => {
  return (
    <div>
      {/* Existing hero section */}
      <section className="hero">
        <h1>Welcome to Unilancer</h1>
        <p>Your tagline here</p>
      </section>

      {/* NEW: Add marquee section */}
      <ServicesMarqueeSection />

      {/* Rest of your page */}
      <section className="features">
        {/* Features content */}
      </section>
    </div>
  );
};
```

### Step 3: Done! 🎉

That's it! The marquee will now display with:
- ✅ Smooth scrolling animation
- ✅ Translated service names (Turkish/English)
- ✅ Responsive design
- ✅ Dark mode support

## Complete Example

Here's a full example of integrating the marquee into different sections of the Home page:

```tsx
// src/pages/Home.tsx
import React from 'react';
import { MarqueeAnimation } from "../components/ui/effects/marquee-effect";
import {
  ServicesMarqueeSection,
  TechStackMarquee,
  BrandMarquee
} from "../components/ui/sections/marquee-section";
import { useTranslation } from "../hooks/useTranslation";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {t('home.hero.subtitle')}
          </p>
          <button className="btn-primary">
            {t('home.hero.cta')}
          </button>
        </div>
      </section>

      {/* Services Marquee - Right after hero */}
      <ServicesMarqueeSection />

      {/* About Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          {t('home.about.title')}
        </h2>
        {/* About content */}
      </section>

      {/* Tech Stack Showcase */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-4xl font-bold text-center mb-4">
            {t('home.tech.title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {t('home.tech.subtitle')}
          </p>
        </div>

        {/* Tech marquee */}
        <TechStackMarquee />
      </section>

      {/* Testimonials */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          {t('home.testimonials.title')}
        </h2>
        {/* Testimonial content */}
      </section>

      {/* Brand Statement - Bold ending */}
      <section className="py-0">
        <BrandMarquee />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('home.cta.title')}
          </h2>
          <button className="btn-secondary">
            {t('home.cta.button')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
```

## Custom Marquee Examples

### Example 1: Services with Emojis

```tsx
<MarqueeAnimation
  direction="left"
  baseVelocity={-4}
  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-6 text-4xl"
>
  💻 Web Development • 📱 Mobile Apps • 🎨 UI/UX Design • 📈 Marketing
</MarqueeAnimation>
```

### Example 2: Client Count

```tsx
<MarqueeAnimation
  direction="right"
  baseVelocity={-3}
  className="bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 py-4 text-3xl font-bold"
>
  ⭐ 500+ Projects Completed • ⭐ 100+ Happy Clients • ⭐ 98% Satisfaction Rate
</MarqueeAnimation>
```

### Example 3: Locations

```tsx
<MarqueeAnimation
  direction="left"
  baseVelocity={-5}
  className="bg-slate-900 text-white py-4 text-2xl"
>
  🌍 Istanbul • 🌍 Ankara • 🌍 Izmir • 🌍 Bursa • 🌍 Antalya
</MarqueeAnimation>
```

## Placement Recommendations

### ✅ Best Locations

1. **After Hero Section** - Great visual transition
2. **Before Footer** - Memorable exit point
3. **Between Major Sections** - Visual separator
4. **Above CTA Sections** - Builds momentum

### ❌ Avoid

1. Top of page (blocks navigation)
2. Middle of text content
3. Near important forms
4. Multiple marquees close together

## Responsive Behavior

The component automatically adjusts:

```tsx
// Mobile: Smaller text
// Tablet: Medium text
// Desktop: Large text

<MarqueeAnimation
  className="
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
    py-2 sm:py-3 md:py-4 lg:py-6
  "
>
  Responsive Text
</MarqueeAnimation>
```

## Performance Tips

1. **Lazy Load** - Use below the fold
```tsx
import { lazy, Suspense } from 'react';

const ServicesMarqueeSection = lazy(() =>
  import('../components/ui/sections/marquee-section').then(mod => ({
    default: mod.ServicesMarqueeSection
  }))
);

// In component
<Suspense fallback={<div className="h-20" />}>
  <ServicesMarqueeSection />
</Suspense>
```

2. **Limit Instances** - Use 1-3 per page maximum

3. **Optimize Speed** - Slower is often better for readability

## Testing Checklist

After adding to Home page:

- [ ] Marquee scrolls smoothly
- [ ] Text is readable on mobile
- [ ] Dark mode works correctly
- [ ] No layout shift when loading
- [ ] Scroll velocity effect works
- [ ] Works in all browsers (Chrome, Firefox, Safari)
- [ ] Translation system working (TR/EN switch)

## Before/After Example

### Before (Plain Section)
```tsx
<section className="py-8 bg-gray-100">
  <p className="text-center">
    We offer Web Development, Mobile Apps, Design, and Marketing
  </p>
</section>
```

### After (With Marquee)
```tsx
<ServicesMarqueeSection />
```

**Result:**
- ✨ More engaging
- 🎨 Better visual appeal
- 🚀 Dynamic movement
- 📱 Professional look

## Quick Customization

Change the colors to match your brand:

```tsx
// Default (uses theme colors)
<ServicesMarqueeSection />

// Custom colors
<MarqueeAnimation
  direction="left"
  baseVelocity={-4}
  className="bg-[#YOUR-BRAND-COLOR] text-white py-6"
>
  Your Custom Text Here
</MarqueeAnimation>
```

## Need Help?

Check these files:
- `docs/MARQUEE_COMPONENT.md` - Complete documentation
- `src/components/ui/effects/marquee-effect-demo.tsx` - More examples
- `src/components/ui/sections/marquee-section.tsx` - Pre-built sections

---

**Ready to implement?** Just copy-paste the code above and you're done! 🚀
