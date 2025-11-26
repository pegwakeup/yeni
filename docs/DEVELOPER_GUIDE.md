# Developer Guide - Unilancer

Welcome to the Unilancer development team! This guide will help you get up and running quickly and understand the codebase structure.

## 🎯 Getting Started (15 Minutes)

### 1. Clone and Install (5 min)

```bash
# Clone the repository
git clone <repository-url>
cd unilancer

# Install dependencies
npm install
```

### 2. Environment Setup (5 min)

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these values from:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select the Unilancer project
3. Settings → API
4. Copy URL and anon/public key

### 3. Run Development Server (2 min)

```bash
npm run dev
```

Visit `http://localhost:5173`

### 4. Test Admin Access (3 min)

1. Go to `/login`
2. Sign in with your credentials
3. If you don't have admin access, ask a team member to run:

```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  raw_app_meta_data,
  '{role}',
  '"admin"'
)
WHERE email = 'your-email@example.com';
```

4. Logout and login again
5. Visit `/admin` - you should see the admin panel

## 📁 Project Structure

```
unilancer/
├── src/
│   ├── components/          # Reusable components
│   │   ├── layout/         # Navbar, Footer, SiteLayout
│   │   ├── ui/             # UI library (buttons, modals, etc)
│   │   ├── 3d/             # Three.js 3D components
│   │   └── ...
│   ├── features/           # Feature modules
│   │   └── admin/          # Admin panel
│   │       ├── blog/
│   │       ├── portfolio/
│   │       ├── freelancers/
│   │       ├── translations/
│   │       └── ...
│   ├── pages/              # Route pages
│   ├── lib/                # Core utilities
│   │   ├── api/           # API clients
│   │   ├── auth/          # Auth helpers
│   │   └── config/        # Supabase config
│   ├── hooks/              # Custom hooks
│   ├── contexts/           # React contexts
│   ├── data/               # Static data
│   └── types/              # TypeScript types
├── supabase/
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions
└── docs/                   # Documentation
```

## 🧭 Quick Navigation

### Finding Components
- **UI Components**: `src/components/ui/`
- **Layout Components**: `src/components/layout/`
- **Admin Components**: `src/features/admin/*/components/`

### Finding Pages
- **Public Pages**: `src/pages/`
- **Admin Pages**: `src/features/admin/*/pages/`

### Finding API Code
- **API Clients**: `src/lib/api/`
- **Edge Functions**: `supabase/functions/`

### Finding Types
- **Global Types**: `src/types/`
- **Feature Types**: `src/features/*/types/`

## 🔨 Common Development Tasks

### Adding a New Public Page

1. **Create the page component** in `src/pages/`:

```tsx
// src/pages/NewPage.tsx
import React from 'react';
import SEOHelmet from '../components/SEOHelmet';

const NewPage = () => {
  return (
    <>
      <SEOHelmet
        title="New Page"
        description="Description of the new page"
      />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">New Page</h1>
        {/* Your content */}
      </div>
    </>
  );
};

export default NewPage;
```

2. **Add route** in `src/App.tsx`:

```tsx
import NewPage from './pages/NewPage';

// Inside <Routes>
<Route path="/new-page" element={<NewPage />} />
```

3. **Add to navigation** in `src/components/Navbar.tsx`

### Adding a New UI Component

1. **Create component** in `src/components/ui/`:

```tsx
// src/components/ui/MyComponent.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  className,
  children
}) => {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  );
};
```

2. **Export from barrel** in `src/components/ui/index.ts` (if exists)

### Adding a Database Table

1. **Create migration** in `supabase/migrations/`:

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_add_new_table.sql

/*
  # Add New Table

  1. New Tables
    - `new_table`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies
*/

CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view"
  ON new_table FOR SELECT
  TO public
  USING (true);
```

2. **Apply migration** (automatic on next Supabase sync)

3. **Create TypeScript types** in `src/types/`:

```typescript
// src/types/models.ts
export interface NewTable {
  id: string;
  name: string;
  created_at: string;
}
```

4. **Create API client** in `src/lib/api/`:

```typescript
// src/lib/api/newTable.ts
import { supabase } from '../config/supabase';
import type { NewTable } from '../../types/models';

export async function getNewTableItems(): Promise<NewTable[]> {
  const { data, error } = await supabase
    .from('new_table')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

### Adding a Translation

1. **Add to translation sources** in `src/data/translationSources.ts`:

```typescript
export const staticTranslationTexts: Record<string, string[]> = {
  NewPage: [
    "Yeni başlık",
    "Yeni açıklama metni",
    // ... more Turkish text
  ],
  // ... existing pages
};
```

2. **Sync translations** via Admin Panel:
   - Go to Admin → Translation Management
   - Click "Sync Missing"
   - Click "Auto-Translate Now"

3. **Use in component**:

```tsx
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t } = useTranslation();

  return <h1>{t('newpage.yeni_başlık')}</h1>;
};
```

### Creating an Edge Function

1. **Create function** in `supabase/functions/`:

```typescript
// supabase/functions/my-function/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { data } = await req.json();

    // Your logic here

    return new Response(
      JSON.stringify({ success: true, result: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

2. **Deploy via MCP tool** or Supabase CLI

3. **Call from frontend**:

```typescript
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/my-function`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: 'your-data' }),
  }
);
```

## 🎨 Styling Guidelines

### Tailwind CSS
Use Tailwind utility classes for styling:

```tsx
<div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  {/* Content */}
</div>
```

### Dark Mode
Always include dark mode variants:

```tsx
<p className="text-gray-900 dark:text-gray-100">
  Text that works in both modes
</p>
```

### Responsive Design
Use Tailwind responsive prefixes:

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Responsive width */}
</div>
```

### Component Utilities
Use the `cn()` utility for conditional classes:

```tsx
import { cn } from '../lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)}>
```

## 🧪 Testing

### Manual Testing

Before committing:

```bash
# 1. Lint check
npm run lint

# 2. Type check
npx tsc --noEmit

# 3. Build test
npm run build

# 4. Preview build
npm run preview
```

### Test Checklist
- [ ] Feature works in Chrome, Firefox, Safari
- [ ] Mobile responsive (test at 375px, 768px, 1440px)
- [ ] Dark mode works correctly
- [ ] Turkish and English translations present
- [ ] No console errors
- [ ] Build completes successfully

## 🐛 Debugging Tips

### React DevTools
Install React DevTools browser extension to inspect component hierarchy and props.

### Supabase Logs
Check edge function logs in Supabase Dashboard → Edge Functions → Logs

### Network Tab
Use browser DevTools Network tab to inspect API calls and responses.

### Common Errors

**"Cannot find module"**
- Check import path is correct
- Run `npm install` again
- Restart dev server

**"Module not found: Can't resolve '@/...'"**
- We don't use `@/` alias, use relative imports
- Example: `import { Button } from '../components/ui/button'`

**Translation not showing**
- Check content_key format: `page.section.text`
- Verify translation exists in database
- Check language context is set

**Admin panel not accessible**
- Verify admin role in user metadata
- Clear localStorage and login again
- Check PrivateRoute component

## 📝 Code Style

### TypeScript
- Use explicit types for function parameters
- Avoid `any` type
- Use interfaces for object shapes
- Use type for unions and primitives

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
function getUser(id: any): any {
  // ...
}
```

### React Components
- Use functional components with hooks
- Destructure props
- Use TypeScript interfaces for props

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### Naming Conventions
- Components: PascalCase (`MyComponent.tsx`)
- Hooks: camelCase with 'use' prefix (`useMyHook.ts`)
- Utilities: camelCase (`myUtility.ts`)
- Types: PascalCase (`MyType`)
- Constants: UPPER_SNAKE_CASE (`MY_CONSTANT`)

### File Organization
- One component per file
- Related components in same directory
- Shared utilities in lib/
- Types close to usage or in types/

## 🚀 Deployment

### Development
Automatic deployment on push to `develop` branch.

### Production
Automatic deployment on push to `main` branch.

### Manual Deploy
```bash
npm run build
netlify deploy --prod
```

## 🤝 Collaboration

### Git Workflow
1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes and commit: `git commit -m "Add my feature"`
4. Push branch: `git push origin feature/my-feature`
5. Create Pull Request on GitHub
6. Wait for code review
7. Merge after approval

### Commit Messages
Use conventional commits:

```
feat: add new portfolio filter
fix: resolve translation loading issue
docs: update API documentation
style: format code with prettier
refactor: reorganize component structure
test: add unit tests for auth helper
```

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] No console.log statements
- [ ] TypeScript types are correct
- [ ] Components are responsive
- [ ] Dark mode is supported
- [ ] Translations are added
- [ ] No obvious bugs

## 📚 Learning Resources

### Technologies Used
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)

### Internal Documentation
- [Architecture Guide](./ARCHITECTURE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [Translation System](./TRANSLATION_SYSTEM.md)

## 🆘 Getting Help

### Internal Resources
1. Check documentation in `/docs`
2. Search codebase for similar examples
3. Ask team members in Slack/Discord

### External Resources
1. React/TypeScript: Stack Overflow
2. Supabase: Official Discord
3. Tailwind: Official Discord

## ✅ Onboarding Checklist

- [ ] Repository cloned and dependencies installed
- [ ] Development server running
- [ ] Environment variables configured
- [ ] Admin access granted and tested
- [ ] Read Architecture documentation
- [ ] Familiar with project structure
- [ ] Made first component/page
- [ ] Created first Pull Request
- [ ] Reviewed code with team member

Welcome to the team! 🎉
