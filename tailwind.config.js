import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#5FC8DA',
        'primary-dark': '#4BA3B2',
        'primary-light': '#7DD4E3',
        dark: '#121212',
        'dark-light': '#1A1A1A',
        'light-accent': '#E0F7FA',
        'light-secondary': '#B2EBF2',
        brand: "hsl(var(--brand))",
        "brand-foreground": "hsl(var(--brand-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      maxWidth: {
        container: "80rem",
      },
      keyframes: {
        appear: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "appear-zoom": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glitch-1": {
          "0%": { clipPath: "inset(20% 0 80% 0)", transform: "translate(-2px, 1px)" },
          "20%": { clipPath: "inset(60% 0 10% 0)", transform: "translate(2px, -1px)" },
          "40%": { clipPath: "inset(40% 0 50% 0)", transform: "translate(-2px, 2px)" },
          "60%": { clipPath: "inset(80% 0 5% 0)", transform: "translate(2px, -2px)" },
          "80%": { clipPath: "inset(10% 0 70% 0)", transform: "translate(-1px, 1px)" },
          "100%": { clipPath: "inset(30% 0 50% 0)", transform: "translate(1px, -1px)" },
        },
        "glitch-2": {
          "0%": { clipPath: "inset(10% 0 60% 0)", transform: "translate(2px, -1px)" },
          "20%": { clipPath: "inset(80% 0 5% 0)", transform: "translate(-2px, 2px)" },
          "40%": { clipPath: "inset(30% 0 20% 0)", transform: "translate(2px, 1px)" },
          "60%": { clipPath: "inset(10% 0 80% 0)", transform: "translate(-1px, -2px)" },
          "80%": { clipPath: "inset(50% 0 30% 0)", transform: "translate(1px, 2px)" },
          "100%": { clipPath: "inset(70% 0 10% 0)", transform: "translate(-2px, -1px)" },
        },
      },
      animation: {
        appear: "appear 0.5s ease-out forwards",
        "appear-zoom": "appear-zoom 0.5s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glitch-1": "glitch-1 2.5s infinite linear alternate-reverse",
        "glitch-2": "glitch-2 3s infinite linear alternate-reverse",
      }
    },
  },
  plugins: [
    typography,
  ],
};