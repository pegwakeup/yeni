# Unilancer Architecture Documentation

## Overview

Unilancer is built using a modern, scalable architecture leveraging React for the frontend, Supabase for backend services, and a feature-based module structure for maintainability.

## Architecture Principles

### 1. Separation of Concerns
- **Presentation Layer**: React components handle UI rendering
- **Business Logic**: Custom hooks and service modules
- **Data Layer**: Supabase for persistence, real-time updates, and authentication

### 2. Feature-Based Organization
- Features are self-contained modules (e.g., admin panel, blog)
- Each feature has its own components, hooks, types, and pages
- Shared utilities in central lib/ directory

### 3. Type Safety
- TypeScript throughout the codebase
- Strict type checking enabled
- Shared types in dedicated types/ directory

### 4. Progressive Enhancement
- Core functionality works without JavaScript
- SEO-friendly with react-helmet-async
- Lazy loading for optimal performance

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser/Client                        │
├─────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + React Router + Framer Motion      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Public     │  │    Admin     │  │     AR/3D    │    │
│  │    Pages     │  │    Panel     │  │   Features   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Backend                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │    │
│  │   Database   │  │   Service    │  │   Buckets    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │            Edge Functions (Deno)                     │  │
│  │  • translate-content  • sync-translations           │  │
│  │  • send-notification                                 │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  • DeepL Translation API  • IP Geolocation                  │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

#### freelancers
Stores freelancer profile information.

```sql
CREATE TABLE freelancers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  skills TEXT[],
  experience_years INTEGER,
  hourly_rate DECIMAL(10,2),
  bio TEXT,
  location JSONB,
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### portfolio_items
Freelancer portfolio entries.

```sql
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id UUID REFERENCES freelancers(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### project_requests
Client project submission requests.

```sql
CREATE TABLE project_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  project_type TEXT NOT NULL,
  budget_range TEXT,
  timeline TEXT,
  description TEXT NOT NULL,
  requirements JSONB,
  attachments TEXT[],
  status TEXT DEFAULT 'new',
  assigned_to UUID REFERENCES freelancers(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### blog_posts
Blog content management.

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users,
  category TEXT,
  tags TEXT[],
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### translations
Multilingual content storage.

```sql
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT NOT NULL,
  language TEXT NOT NULL,
  source_lang TEXT,
  translated_text TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(content_key, language)
);
```

### Row Level Security (RLS)

All tables have RLS enabled. Example policies:

```sql
-- Freelancers: Public can view approved, owners can edit own
CREATE POLICY "Public can view approved freelancers"
  ON freelancers FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Users can update own profile"
  ON freelancers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can do anything"
  ON freelancers FOR ALL
  TO authenticated
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');
```

## Frontend Architecture

### Component Hierarchy

```
App.tsx
├── Providers (Theme, Language, Auth)
├── Router
│   ├── Public Routes
│   │   ├── Home
│   │   ├── About
│   │   ├── Services
│   │   ├── Portfolio
│   │   ├── Blog
│   │   ├── Contact
│   │   └── Join Us
│   └── Admin Routes (Protected)
│       ├── Dashboard
│       ├── Blog Management
│       ├── Portfolio Management
│       ├── Freelancer Management
│       ├── Project Requests
│       └── Translation Management
└── Layout Components (Navbar, Footer)
```

### State Management

#### Local State
- React useState for component-specific state
- React useReducer for complex state logic

#### Global State
- React Context API for theme, language, authentication
- No external state management library (Redux, MobX) needed

#### Server State
- Supabase real-time subscriptions
- Manual refetching via custom hooks

### Data Flow

```
User Action
    ↓
Event Handler
    ↓
API Call (lib/api/*.ts)
    ↓
Supabase Client
    ↓
Edge Function / Database
    ↓
Response
    ↓
State Update
    ↓
Re-render
```

## Authentication Flow

```
1. User enters credentials
2. Frontend calls supabase.auth.signInWithPassword()
3. Supabase validates credentials
4. Returns JWT token + user object
5. Token stored in localStorage (handled by Supabase)
6. PrivateRoute checks auth state
7. Admin routes check user.app_metadata.role === 'admin'
```

## Translation System Architecture

### Static Translations
1. Turkish text defined in `translationSources.ts`
2. Content key generated from text + context
3. Hash created for change detection
4. Stored in database as base language

### Dynamic Translation
1. Admin triggers "Retranslate All"
2. Frontend calls `translate-content/batch` edge function
3. Edge function calls DeepL API in batches
4. Translated text stored with same content_key
5. Frontend retrieves by language code

### Translation Retrieval
```typescript
// Custom hook
const { t } = useTranslation();

// In component
<h1>{t('home.hero.title')}</h1>

// Hook queries database by:
// - content_key: 'home.hero.title'
// - language: current language from context
```

## API Architecture

### Edge Functions

#### translate-content
- **Purpose**: Translate text using DeepL API
- **Authentication**: Requires admin role
- **Rate Limiting**: Batches of 50 items
- **Endpoints**:
  - POST `/translate-content` - Single translation
  - POST `/translate-content/batch` - Batch translation

#### sync-translations
- **Purpose**: Sync static translations to database
- **Authentication**: Requires admin role
- **Process**:
  1. Receive array of translations
  2. Compare with existing by content_hash
  3. Upsert new/changed translations
  4. Return sync statistics

#### send-notification
- **Purpose**: Send email/SMS notifications
- **Authentication**: Requires admin role
- **Use Cases**: Project assignment, status updates

### API Client Organization

```
lib/
├── api/
│   ├── freelancers.ts     # CRUD operations
│   ├── portfolio.ts        # Portfolio management
│   └── projectRequests.ts  # Project request handling
├── auth/
│   └── auth.ts            # Authentication helpers
├── services/
│   ├── deepl.ts           # DeepL API wrapper (unused, edge function preferred)
│   └── geolocation.ts     # IP-based location
└── config/
    └── supabase.ts        # Supabase client initialization
```

## Security Architecture

### Authentication Security
- JWT tokens with short expiration
- Refresh tokens for session persistence
- HttpOnly cookies (future enhancement)

### Database Security
- Row Level Security on all tables
- Service role key only in edge functions
- Anon key for client-side access

### API Security
- CORS headers on all edge functions
- Admin role validation via JWT
- Input validation and sanitization

### Content Security
- XSS prevention via React's built-in escaping
- CSP headers (configured in netlify.toml)
- Secure headers for all resources

## Performance Optimizations

### Code Splitting
- Route-based lazy loading
- Dynamic imports for heavy components
- Separate chunks for vendor libraries

### Asset Optimization
- WebP images with fallbacks
- Lazy loading images
- SVG for icons (via lucide-react)

### Caching Strategy
- Translation cache in memory
- Static assets cached via CDN
- Supabase response caching

### Bundle Size
- Tree shaking enabled
- Dead code elimination
- Compression (gzip/brotli)

## Deployment Architecture

### Build Process
```
1. npm run build
2. Vite bundles application
3. TypeScript compilation
4. CSS processing (Tailwind)
5. Asset optimization
6. Output to dist/
```

### Hosting (Netlify)
- Static site hosting
- CDN distribution
- Automatic HTTPS
- Deploy previews for PRs
- Redirects for SPA routing

### Edge Functions (Supabase)
- Deployed independently
- Global distribution
- Auto-scaling
- Zero cold starts

## Monitoring & Logging

### Frontend Monitoring
- Browser console errors
- React error boundaries
- Performance metrics (Web Vitals)

### Backend Monitoring
- Supabase dashboard metrics
- Edge function logs
- Database query performance

### Error Tracking
- Console.error for development
- Supabase logs for production
- User-friendly error messages

## Scalability Considerations

### Database
- Indexed columns for frequent queries
- Connection pooling (Supabase)
- Read replicas (future)

### Edge Functions
- Stateless design
- Horizontal scaling (automatic)
- Rate limiting per user

### Frontend
- CDN for global distribution
- Static generation where possible
- Progressive web app (future)

## Future Enhancements

### Planned Features
- Real-time chat between clients and freelancers
- Payment integration (Stripe)
- Project milestones and deliverables
- Rating and review system
- Advanced search and filtering

### Technical Improvements
- Server-side rendering (SSR)
- Progressive Web App (PWA)
- Advanced caching strategies
- GraphQL API (Hasura)
- Automated testing suite

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server
npm run lint         # Lint code
npm run build        # Test production build
```

### Git Workflow
1. Feature branch from main
2. Develop and test locally
3. Create pull request
4. Code review
5. Merge to main
6. Automatic deployment

### Database Migrations
```bash
# Create migration
supabase migration new migration_name

# Apply migration
supabase db push

# Rollback (manual)
supabase db reset
```

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
- Run `npx tsc --noEmit` to see all errors
- Check for missing type definitions
- Ensure all imports are correct

**Translation not working**
- Verify DeepL API key in edge function secrets
- Check admin role in user metadata
- Review edge function logs in Supabase

**Authentication errors**
- Clear localStorage and cookies
- Verify Supabase credentials in .env
- Check RLS policies in database

**Component not rendering**
- Check React DevTools for errors
- Verify component imports
- Check for circular dependencies

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable freelance platform. The modular design allows for easy feature additions, and the use of modern technologies ensures good performance and developer experience.
