```typescript
export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  main_image: string;
  gallery_images?: string[];
  main_category: string;
  sub_category: string;
  technologies?: string[];
  tags?: string[];
  live_url?: string;
  github_url?: string;
  team_members?: Array<{
    name: string;
    role: string;
    avatar_url?: string;
  }>;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioStats {
  total: number;
  published: number;
  draft: number;
  byCategory: Record<string, number>;
}

export interface PortfolioFilters {
  search: string;
  status: string;
  category: string;
  subcategory: string;
}
```