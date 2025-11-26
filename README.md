# Unilancer - Modern Freelance Platform

A comprehensive freelance platform built with React, TypeScript, Supabase, and modern web technologies. Unilancer connects businesses with talented freelancers across various disciplines including software development, design, marketing, and more.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- DeepL API key (for translation features)

## 🏗️ Project Structure

```
unilancer/
├── docs/                    # Comprehensive documentation
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   ├── ui/            # UI library (buttons, modals, etc)
│   │   ├── 3d/            # 3D and AR components
│   │   └── ...
│   ├── features/          # Feature-based modules
│   │   └── admin/         # Admin panel features
│   ├── pages/             # Public pages
│   ├── lib/               # Core utilities and API clients
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React context providers
│   ├── data/              # Static data and configurations
│   └── types/             # TypeScript type definitions
├── supabase/
│   ├── migrations/        # Database migrations
│   └── functions/         # Edge functions
└── public/                # Static assets
```

## ✨ Key Features

### For Clients
- **Project Request System** - Submit detailed project requirements
- **Freelancer Discovery** - Browse and filter talented professionals
- **Portfolio Viewing** - Review freelancer work samples
- **Multi-language Support** - Turkish and English interfaces
- **Blog & Resources** - Industry insights and tips

### For Freelancers
- **Profile Management** - Showcase skills and experience
- **Portfolio Upload** - Display your best work
- **Project Notifications** - Get matched with relevant projects
- **Skill Tagging** - Categorize expertise

### For Admins
- **Dashboard** - Comprehensive admin panel
- **Blog Management** - Create and edit blog posts
- **Portfolio Management** - Review and approve freelancer portfolios
- **Freelancer Management** - View and manage freelancer profiles
- **Project Requests** - Monitor and manage client requests
- **Translation Management** - Manage multilingual content

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible component primitives

### 3D & Interactive
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers
- **Model Viewer** - AR and 3D model viewing

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage
  - Edge Functions

### APIs & Services
- **DeepL** - Professional translation
- **Geolocation** - IP-based location detection

## 🔐 Authentication

The platform uses Supabase Authentication with email/password. Admin users have a special `role: admin` in their `app_metadata`.

### Setting Up Admin User

```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  raw_app_meta_data,
  '{role}',
  '"admin"'
)
WHERE email = 'your-admin@email.com';
```

## 🌍 Translation System

Unilancer features a robust translation system supporting Turkish and English.

### Key Components
- Static translations stored in Supabase
- Dynamic translation via DeepL API
- Content hash-based change detection
- Batch processing for bulk translations

### Admin Translation Workflow
1. Navigate to Admin → Translation Management
2. Click "Sync Missing" to detect new content
3. Click "Retranslate All" to translate Turkish → English
4. Translations are stored in database and cached

See [Translation System Documentation](docs/TRANSLATION_SYSTEM.md) for details.

## 🎨 UI Components

The project includes a comprehensive UI library built on Tailwind CSS and Radix UI:

- **Core Components**: Button, Badge, Accordion, Carousel
- **Form Components**: Input, Select, Checkbox, Switch
- **Layout Components**: Navbar, Footer, Sidebar
- **Modals**: Privacy Policy, Terms, Service Details
- **Effects**: Glow effects, Pixel trails, Parallax
- **Sections**: Feature sections, Solutions, Services

See [Component Library Documentation](docs/COMPONENT_LIBRARY.md) for usage.

## 📡 API & Edge Functions

### Edge Functions
- `translate-content` - Translate text via DeepL API
- `sync-translations` - Sync static translations to database
- `send-notification` - Send notifications (email/SMS)

### API Clients (lib/)
- `auth.ts` - Authentication helpers
- `freelancers.ts` - Freelancer CRUD operations
- `portfolio.ts` - Portfolio management
- `projectRequests.ts` - Project request handling
- `translations.ts` - Translation utilities

See [API Documentation](docs/API_DOCUMENTATION.md) for endpoints.

## 🗄️ Database Schema

### Core Tables
- `freelancers` - Freelancer profiles
- `portfolio_items` - Portfolio entries
- `project_requests` - Client project submissions
- `blog_posts` - Blog content
- `translations` - Multilingual content

### Row Level Security (RLS)
All tables have RLS enabled for security. Admin users have elevated privileges.

See [Architecture Documentation](docs/ARCHITECTURE.md) for schema details.

## 🚢 Deployment

### Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
DEEPL_API_KEY=your-deepl-api-key
```

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Netlify (configured in netlify.toml)
netlify deploy --prod
```

### Edge Functions Deployment

Edge functions are deployed via Supabase CLI or the deployment tool:

```bash
# Deploy specific function
supabase functions deploy translate-content

# Or use the MCP tool in the admin interface
```

See [Deployment Guide](docs/DEPLOYMENT.md) for complete instructions.

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build test
npm run build
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Architecture Guide](docs/ARCHITECTURE.md) - System design and decisions
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Onboarding for new developers
- [Component Library](docs/COMPONENT_LIBRARY.md) - UI components reference
- [API Documentation](docs/API_DOCUMENTATION.md) - Backend API reference
- [Features Guide](docs/FEATURES.md) - Complete feature list
- [Translation System](docs/TRANSLATION_SYSTEM.md) - Translation workflow
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment instructions

## 🤝 Contributing

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and inquiries:
- Website: https://unilancerlabs.com
- Email: taha@unilancerlabs.com

## 🙏 Acknowledgments

- React and TypeScript communities
- Supabase team for amazing backend infrastructure
- Tailwind CSS for utility-first CSS
- Three.js community for 3D rendering capabilities

---

**Made with ❤️ by Unilancer Labs**
