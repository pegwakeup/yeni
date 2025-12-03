# 🚀 Unilancer

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Modern Digital Agency Platform**

[🌐 Live Demo](https://unilancer.co) · [📖 Documentation](./docs/) · [🐛 Report Bug](https://github.com/pegwakeup/yeni/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Routing & Internationalization](#-routing--internationalization)
- [Development Guide](#-development-guide)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Documentation](#-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 About

Unilancer is a modern digital agency platform offering web design, 3D/AR experiences, e-commerce solutions, AI-powered tools, and more. Built with cutting-edge technologies for optimal performance and SEO.

### Key Features

- 🌍 **Bilingual Support** - Turkish & English with automatic language detection
- 🌙 **Dark/Light Mode** - Theme switching with system preference detection
- 📱 **Fully Responsive** - Mobile-first design approach
- 🔍 **SEO Optimized** - Meta tags, JSON-LD schemas, sitemap, robots.txt
- ⚡ **Performance First** - Lazy loading, code splitting, optimized assets
- 🎨 **3D/AR Features** - Three.js powered interactive experiences
- 📝 **Blog System** - Full CMS with admin panel
- 🤖 **Digibot** - AI-powered chatbot integration

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x+ or **pnpm** 8.x+
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/pegwakeup/yeni.git
cd yeni

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npm run dev
```

🎉 Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | 18.3 | UI Framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.6 | Type Safety |
| [Vite](https://vitejs.dev/) | 6.0 | Build Tool & Dev Server |
| [React Router](https://reactrouter.com/) | 7.0 | Client-side Routing |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS |
| [Framer Motion](https://www.framer.com/motion/) | 11.x | Animations |
| [Three.js](https://threejs.org/) / React Three Fiber | - | 3D Graphics |
| [Lucide React](https://lucide.dev/) | - | Icons |
| [react-helmet-async](https://github.com/staylor/react-helmet-async) | - | SEO Meta Tags |

### Backend (Supabase)
| Service | Purpose |
|---------|---------|
| **PostgreSQL** | Database |
| **Auth** | User Authentication |
| **Storage** | File/Image Storage |
| **Edge Functions** | Serverless API (Deno) |
| **Realtime** | Live Updates |

### Design System
```
Primary Color:    #5FC8DA (Cyan)
Dark Background:  #121212
Font Family:      Inter (sans-serif)
```

---

## 📁 Project Structure

```
yeni/
├── 📂 public/                  # Static assets
│   ├── robots.txt             # SEO crawl rules
│   ├── sitemap.xml            # SEO sitemap
│   └── images/                # Static images
│
├── 📂 src/
│   ├── 📄 App.tsx             # Root component & routing
│   ├── 📄 main.tsx            # Entry point
│   ├── 📄 index.css           # Global styles & Tailwind
│   │
│   ├── 📂 components/         # Reusable UI components
│   │   ├── Navbar.tsx        # Main navigation
│   │   ├── Footer.tsx        # Site footer
│   │   ├── PrivateRoute.tsx  # Auth guard
│   │   ├── 📂 ui/            # UI primitives (Button, Badge, etc.)
│   │   ├── 📂 layout/        # Layout components (SiteLayout)
│   │   ├── 📂 3d/            # Three.js 3D components
│   │   ├── 📂 modals/        # Modal dialogs
│   │   ├── 📂 animations/    # Animation components
│   │   └── 📂 seo/           # SEO components
│   │
│   ├── 📂 pages/              # Route pages
│   │   ├── Home.tsx          # Landing page
│   │   ├── About.tsx         # About us
│   │   ├── Services.tsx      # Services overview
│   │   ├── Portfolio.tsx     # Portfolio gallery
│   │   ├── Blog.tsx          # Blog listing
│   │   ├── BlogDetail.tsx    # Blog post detail
│   │   ├── Contact.tsx       # Contact form
│   │   ├── Team.tsx          # Team members
│   │   ├── JoinUs.tsx        # Freelancer application
│   │   ├── ProjectRequest.tsx # Project request form
│   │   ├── Digibot.tsx       # AI chatbot page
│   │   └── 📂 services/      # Individual service pages
│   │       ├── WebDesign.tsx
│   │       ├── ThreeDAR.tsx
│   │       ├── Ecommerce.tsx
│   │       ├── Marketing.tsx
│   │       ├── Digibot.tsx
│   │       ├── SoftwareDevelopment.tsx
│   │       ├── Branding.tsx
│   │       └── GraphicDesign.tsx
│   │
│   ├── 📂 contexts/           # React Context providers
│   │   ├── LanguageContext.tsx  # i18n (TR/EN)
│   │   └── ThemeContext.tsx     # Dark/Light mode
│   │
│   ├── 📂 hooks/              # Custom React hooks
│   │   └── useTranslation.ts # Translation hook
│   │
│   ├── 📂 lib/                # Core utilities
│   │   ├── utils.ts          # Helper functions (cn, etc.)
│   │   ├── translations.ts   # Static translations
│   │   ├── auth.ts           # Auth helpers
│   │   ├── 📂 api/           # API clients
│   │   │   ├── freelancers.ts
│   │   │   ├── portfolio.ts
│   │   │   └── projectRequests.ts
│   │   ├── 📂 config/        # Configuration
│   │   │   └── supabase.ts   # Supabase client
│   │   └── 📂 services/      # External services
│   │       └── geolocation.ts
│   │
│   ├── 📂 features/           # Feature modules
│   │   └── 📂 admin/         # Admin panel
│   │       ├── routes.tsx
│   │       ├── 📂 blog/
│   │       ├── 📂 portfolio/
│   │       ├── 📂 freelancers/
│   │       └── 📂 translations/
│   │
│   ├── 📂 data/               # Static data
│   │   ├── 📂 location/      # Location data
│   │   └── 📂 static/        # Static content
│   │
│   └── 📂 types/              # TypeScript types
│       └── freelancer.ts
│
├── 📂 supabase/               # Supabase configuration
│   ├── 📂 migrations/        # Database migrations
│   └── 📂 functions/         # Edge functions
│       ├── send-notification/
│       ├── sync-translations/
│       └── translate-content/
│
├── 📂 docs/                   # Documentation
│   ├── ARCHITECTURE.md       # System architecture
│   ├── DEVELOPER_GUIDE.md    # Development guide
│   ├── FEATURES.md           # Feature documentation
│   ├── TRANSLATION_SYSTEM.md # i18n system
│   └── MARQUEE_COMPONENT.md  # Marquee component
│
├── 📄 package.json
├── 📄 tailwind.config.js      # Tailwind configuration
├── 📄 vite.config.ts          # Vite configuration
├── 📄 tsconfig.json           # TypeScript config
└── 📄 vercel.json             # Vercel deployment config
```

---

## 🌍 Routing & Internationalization

### Bilingual URL Structure

All routes are prefixed with language code (`/tr` or `/en`):

| Page | Turkish URL | English URL |
|------|-------------|-------------|
| Home | `/tr` | `/en` |
| Portfolio | `/tr/portfolyo` | `/en/portfolio` |
| Services | `/tr/hizmetler` | `/en/services` |
| About | `/tr/hakkimizda` | `/en/about` |
| Blog | `/tr/blog` | `/en/blog` |
| Contact | `/tr/iletisim` | `/en/contact` |
| Team | `/tr/ekibimiz` | `/en/team` |
| Join Us | `/tr/basvuru` | `/en/join` |
| Project Request | `/tr/proje-talebi` | `/en/project-request` |

### Service Detail Pages

| Service | Turkish URL | English URL |
|---------|-------------|-------------|
| Web Design | `/tr/hizmetler/web-tasarim` | `/en/services/web-design` |
| 3D/AR | `/tr/hizmetler/3d-ar` | `/en/services/3d-ar` |
| E-Commerce | `/tr/hizmetler/e-ticaret-cozumleri` | `/en/services/ecommerce` |
| Marketing | `/tr/hizmetler/pazarlama-reklam` | `/en/services/marketing` |
| AI Digibot | `/tr/hizmetler/yapay-zeka-digibot` | `/en/services/ai-digibot` |
| Software Dev | `/tr/hizmetler/yazilim-gelistirme` | `/en/services/software-development` |
| Branding | `/tr/hizmetler/kurumsal-kimlik-marka` | `/en/services/branding` |
| Graphic Design | `/tr/hizmetler/grafik-tasarim` | `/en/services/graphic-design` |

### Using Translations

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>Current: {language}</p>
      <button onClick={toggleLanguage}>Switch Language</button>
    </div>
  );
};
```

### Language Detection

The system automatically:
1. Checks `localStorage` for saved preference
2. Detects user's country via IP geolocation
3. Defaults to Turkish (`tr`) for Turkey, English (`en`) otherwise

---

## 💻 Development Guide

### Adding a New Page

1. **Create the page component:**

```tsx
// src/pages/NewPage.tsx
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

const NewPage = () => {
  const { t, language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>New Page | Unilancer</title>
        <meta name="description" content="Page description" />
        <link rel="canonical" href={`https://unilancer.co/${language}/new-page`} />
      </Helmet>

      <main className="min-h-screen bg-white dark:bg-dark">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('newpage.title')}
          </h1>
        </div>
      </main>
    </>
  );
};

export default NewPage;
```

2. **Add route in `src/App.tsx`:**

```tsx
const NewPage = lazy(() => import('./pages/NewPage'));

// Inside Routes, add both language versions:
<Route path="/tr/yeni-sayfa" element={<NewPage />} />
<Route path="/en/new-page" element={<NewPage />} />
```

3. **Add to navigation in `src/components/Navbar.tsx`** (if needed)

### Creating a UI Component

```tsx
// src/components/ui/MyButton.tsx
import { cn } from '../../lib/utils';

interface MyButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MyButton = ({
  variant = 'primary',
  children,
  className,
  onClick
}: MyButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
        variant === 'secondary' && 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300',
        className
      )}
    >
      {children}
    </button>
  );
};
```

### Styling Guidelines

```tsx
// ✅ Always include dark mode variants
<div className="bg-white dark:bg-dark text-gray-900 dark:text-white">

// ✅ Use primary color for brand elements
<button className="bg-primary hover:bg-primary/90">

// ✅ Use cn() for conditional classes
<div className={cn('base-class', isActive && 'active-class')}>

// ✅ Mobile-first responsive design
<div className="w-full md:w-1/2 lg:w-1/3">

// ✅ Touch-friendly tap targets (min 44px)
<button className="min-h-[44px] min-w-[44px]">
```

### Theme Colors (tailwind.config.js)

```javascript
colors: {
  primary: '#5FC8DA',    // Main brand color
  dark: '#121212',       // Dark mode background
  'dark-card': '#1E1E1E' // Dark mode card
}
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: DeepL API (for translations - configured in Edge Functions)
# DEEPL_API_KEY=your-deepl-key
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select the Unilancer project
3. Navigate to **Settings → API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📐 Architecture](./docs/ARCHITECTURE.md) | System architecture, database schema, data flow |
| [👨‍💻 Developer Guide](./docs/DEVELOPER_GUIDE.md) | Detailed development guide, common tasks, onboarding |
| [🌐 Translation System](./docs/TRANSLATION_SYSTEM.md) | i18n implementation, adding translations |
| [✨ Features](./docs/FEATURES.md) | Feature documentation and usage |
| [🎠 Marquee Component](./docs/MARQUEE_COMPONENT.md) | Marquee animation component guide |

---

## 🚀 Deployment

### Vercel (Current Production)

The site is deployed on **Vercel** at [unilancer.co](https://unilancer.co).

**Automatic Deployment:**
- Push to `main` branch triggers production deploy
- Pull requests get preview deployments

**Manual Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Build Configuration

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 🤝 Contributing

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push and create PR
git push origin feature/my-feature
```

### Commit Convention

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `style:` | Code style (formatting) |
| `refactor:` | Code refactoring |
| `perf:` | Performance improvement |
| `chore:` | Maintenance tasks |

### Pre-commit Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Dark mode works correctly
- [ ] Mobile responsive (test 375px, 768px, 1440px)
- [ ] Both TR and EN versions work
- [ ] No console errors

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<div align="center">

**Built with ❤️ by the Unilancer Team**

[🌐 unilancer.co](https://unilancer.co) · [📧 Contact](https://unilancer.co/tr/iletisim)

</div>
