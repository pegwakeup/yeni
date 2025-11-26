import { MarqueeAnimation } from "./marquee-effect";

function MarqueeEffectSingleExample() {
  return (
    <div className="flex flex-col gap-4">
      <MarqueeAnimation
        direction="left"
        baseVelocity={-3}
        className="bg-primary text-white py-2"
      >
        Unilancer - Freelance Platform
      </MarqueeAnimation>
    </div>
  );
}

function MarqueeEffectDoubleExample() {
  return (
    <div className="flex flex-col gap-4">
      <MarqueeAnimation
        direction="left"
        baseVelocity={-3}
        className="bg-green-500 text-white py-2"
      >
        Unilancer Components
      </MarqueeAnimation>
      <MarqueeAnimation
        direction="right"
        baseVelocity={-3}
        className="bg-purple-500 text-white py-2"
      >
        Unilancer Components
      </MarqueeAnimation>
    </div>
  );
}

function MarqueeEffectBrandedExample() {
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

export {
  MarqueeEffectSingleExample,
  MarqueeEffectDoubleExample,
  MarqueeEffectBrandedExample
};
