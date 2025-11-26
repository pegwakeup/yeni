import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase bağlantı bilgileri eksik!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  }
});

// Add connection health check
export async function checkConnection() {
  try {
    const { error } = await supabase.from('blog_posts').select('count').limit(1).single();
    return !error;
  } catch {
    return false;
  }
}

// Add retry logic for database operations
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  tags: string[];
  author: BlogAuthor;
  read_time: string;
  created_at: string;
  updated_at: string;
  published: boolean;
};

export type BlogAuthor = {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
};

// Database operations with improved error handling
export async function getBlogPosts(includeUnpublished = false) {
  return withRetry(async () => {
    try {
      const query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:author_id(*)
        `)
        .order('created_at', { ascending: false });

      if (!includeUnpublished) {
        query.eq('published', true);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as BlogPost[];
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      throw error;
    }
  });
}

export async function getBlogPost(slug: string) {
  return withRetry(async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:author_id(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as BlogPost;
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      throw error;
    }
  });
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author'>) {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    return data;
  });
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>) {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  });
}

export async function deleteBlogPost(id: string) {
  return withRetry(async () => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  });
}

export async function uploadImage(file: File, bucket: 'blog-images' | 'portfolio-images') {
  return withRetry(async () => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  });
}