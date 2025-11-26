# Marquee Effect Component Integration

## Overview

The Marquee Effect component has been successfully integrated into the Unilancer project. This component creates smooth, animated scrolling text effects that respond to page scrolling velocity.

## Component Location

```
src/components/ui/effects/
├── marquee-effect.tsx          # Main component
└── marquee-effect-demo.tsx     # Usage examples
```

## Dependencies Installed

✅ **@motionone/utils** (v10.18.0) - For animation utilities
✅ **framer-motion** (v11.0.8) - Already installed

## Component API

### MarqueeAnimation

```typescript
type MarqueeAnimationProps = {
  children: string;           // Text to display
  className?: string;         // Additional CSS classes
  direction?: "left" | "right"; // Scroll direction (default: "left")
  baseVelocity: number;       // Scroll speed (negative for slower, positive for faster)
};
```

## Usage Examples

### Basic Usage

```tsx
import { MarqueeAnimation } from '../components/ui/effects/marquee-effect';

function MyComponent() {
  return (
    <MarqueeAnimation
      direction="left"
      baseVelocity={-3}
      className="bg-primary text-white py-2"
    >
      Your Text Here
    </MarqueeAnimation>
  );
}
```

### Double Marquee (Opposite Directions)

```tsx
import { MarqueeAnimation } from '../components/ui/effects/marquee-effect';

function HeroSection() {
  return (
    <div className="flex flex-col gap-4">
      <MarqueeAnimation
        direction="left"
        baseVelocity={-3}
        className="bg-green-500 text-white py-2"
      >
        Web Development • Design • Marketing
      </MarqueeAnimation>
      <MarqueeAnimation
        direction="right"
        baseVelocity={-3}
        className="bg-purple-500 text-white py-2"
      >
        React • TypeScript • Tailwind
      </MarqueeAnimation>
    </div>
  );
}
```

### Branded Example (Multiple Speeds)

```tsx
import { MarqueeAnimation } from '../components/ui/effects/marquee-effect';

function BrandShowcase() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <MarqueeAnimation
        direction="left"
        baseVelocity={-5}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 text-6xl"
      >
        Web Development • Design • Marketing • Consulting
      </MarqueeAnimation>
      <MarqueeAnimation
        direction="right"
        baseVelocity={-4}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 text-4xl"
      >
        React • TypeScript • Tailwind • Supabase
      </MarqueeAnimation>
      <MarqueeAnimation
        direction="left"
        baseVelocity={-3}
        className="bg-slate-900 text-white py-4 text-5xl"
      >
        Trusted by 100+ Companies Worldwide
      </MarqueeAnimation>
    </div>
  );
}
```

## Pre-built Demo Components

Three ready-to-use demo components are available in `marquee-effect-demo.tsx`:

1. **MarqueeEffectSingleExample** - Single marquee with Unilancer branding
2. **MarqueeEffectDoubleExample** - Two marquees in opposite directions
3. **MarqueeEffectBrandedExample** - Multi-layered marquee with gradients

```tsx
import {
  MarqueeEffectSingleExample,
  MarqueeEffectDoubleExample,
  MarqueeEffectBrandedExample
} from '../components/ui/effects/marquee-effect-demo';

// Use in any page
function MyPage() {
  return (
    <div>
      <MarqueeEffectBrandedExample />
    </div>
  );
}
```

## Customization Options

### Speed Control

- **baseVelocity: -1 to -3**: Slow, smooth scrolling
- **baseVelocity: -4 to -6**: Medium speed
- **baseVelocity: -7 to -10**: Fast scrolling

### Styling with Tailwind

The component accepts any Tailwind classes through `className`:

```tsx
<MarqueeAnimation
  className="
    bg-gradient-to-r from-blue-500 to-purple-500
    text-white
    py-6
    text-7xl
    font-black
    tracking-wider
  "
>
  Your Text
</MarqueeAnimation>
```

### Responsive Sizing

```tsx
<MarqueeAnimation
  className="
    text-2xl sm:text-4xl md:text-5xl lg:text-6xl
    py-2 sm:py-4
  "
>
  Responsive Text
</MarqueeAnimation>
```

## Best Practices

### 1. Performance
- Use sparingly (1-3 instances per page)
- Avoid very long text strings
- Consider lazy loading for below-fold content

### 2. Accessibility
- Ensure text has sufficient contrast
- Provide alternative static content for users who prefer reduced motion
- Consider adding `aria-label` for screen readers

```tsx
<div aria-label="Featured services">
  <MarqueeAnimation ...>
    Services Text
  </MarqueeAnimation>
</div>
```

### 3. Content Guidelines
- Use separator characters (•, /, |) between items
- Keep text concise and impactful
- Test on mobile devices for readability

## Recommended Use Cases

### ✅ Good Use Cases

1. **Hero Sections** - Dynamic brand messaging
2. **Service Showcases** - Highlighting key offerings
3. **Tech Stack Display** - Showing technologies used
4. **Client Logos/Names** - Scrolling testimonials
5. **Event Announcements** - Promotional banners

### ❌ Avoid Using For

1. Critical navigation elements
2. Important calls-to-action
3. Legal text or terms
4. Form labels or instructions
5. Long paragraphs of content

## Integration in Unilancer Pages

### Home Page Hero

```tsx
// src/pages/Home.tsx
import { MarqueeAnimation } from '../components/ui/effects/marquee-effect';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20">
        <h1>Welcome to Unilancer</h1>

        {/* Marquee showing services */}
        <MarqueeAnimation
          direction="left"
          baseVelocity={-4}
          className="bg-primary/10 text-primary py-4 text-4xl mt-8"
        >
          Web Development • Mobile Apps • UI/UX Design • Digital Marketing
        </MarqueeAnimation>
      </section>
    </div>
  );
};
```

### Services Page

```tsx
// src/pages/Services.tsx
import { MarqueeAnimation } from '../components/ui/effects/marquee-effect';

const Services = () => {
  return (
    <div>
      <section className="py-12">
        <MarqueeAnimation
          direction="right"
          baseVelocity={-3}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 text-3xl"
        >
          React • Vue • Angular • Node.js • Python • PHP • WordPress
        </MarqueeAnimation>
      </section>
    </div>
  );
};
```

### About Page - Company Values

```tsx
// src/pages/About.tsx
import { MarqueeAnimation } from '../components/ui/effects/marquee-effect';

const About = () => {
  return (
    <div>
      <section className="py-16">
        <h2>Our Values</h2>
        <div className="flex flex-col gap-6 mt-8">
          <MarqueeAnimation
            direction="left"
            baseVelocity={-2}
            className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 py-3"
          >
            Quality • Innovation • Integrity • Collaboration
          </MarqueeAnimation>
        </div>
      </section>
    </div>
  );
};
```

## Scroll Velocity Feature

The marquee automatically responds to page scrolling:
- **Faster scroll** = Faster marquee movement
- **Slower scroll** = Slower marquee movement
- **No scroll** = Constant base velocity

This creates a dynamic, interactive experience.

## Dark Mode Support

The component fully supports dark mode through Tailwind classes:

```tsx
<MarqueeAnimation
  className="
    bg-white dark:bg-slate-900
    text-slate-900 dark:text-white
    py-4
  "
>
  Dark Mode Friendly Text
</MarqueeAnimation>
```

## Troubleshooting

### Text Not Scrolling
- Check `baseVelocity` is not 0
- Ensure `children` prop contains text
- Verify framer-motion is installed

### Jittery Animation
- Reduce `baseVelocity` value
- Adjust `damping` and `stiffness` in source code
- Check for performance issues in browser DevTools

### Text Cut Off
- Ensure parent container has proper width
- Check for conflicting CSS overflow properties
- Verify text size is appropriate for container

## Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Motion One Utils](https://motion.dev/)
- [Tailwind CSS](https://tailwindcss.com)

## Maintenance Notes

- Component is fully typed with TypeScript
- No external API calls required
- No database dependencies
- Pure client-side animation
- Compatible with SSR/SSG (Next.js ready)

## Version History

- **v1.0.0** (Nov 20, 2025) - Initial integration into Unilancer
  - Added component to `src/components/ui/effects/`
  - Created demo examples
  - Installed @motionone/utils dependency
  - Documentation completed

---

**Component Status:** ✅ Ready for Production Use

**Last Updated:** November 20, 2025
