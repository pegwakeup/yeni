export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    role: string;
    avatar_url: string;
  };
  published: boolean;
  read_time: string;
  created_at: string;
  updated_at: string;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  categories: Set<string>;
}