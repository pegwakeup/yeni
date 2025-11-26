import { supabase } from '../config/supabase';

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

export async function getPortfolioItems(includeUnpublished = false) {
  return withRetry(async () => {
    const query = supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeUnpublished) {
      query.eq('published', true);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data as PortfolioItem[];
  });
}

export async function getPortfolioItem(slug: string) {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as PortfolioItem;
  });
}

export async function createPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  });
}

export async function updatePortfolioItem(id: string, updates: Partial<PortfolioItem>) {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  });
}

export async function deletePortfolioItem(id: string) {
  return withRetry(async () => {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  });
}

export async function uploadPortfolioImage(file: File) {
  return withRetry(async () => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName);

    return publicUrl;
  });
}

export async function deletePortfolioImage(path: string) {
  return withRetry(async () => {
    const fileName = path.split('/').pop();
    if (!fileName) throw new Error('Invalid image path');

    const { error } = await supabase.storage
      .from('portfolio-images')
      .remove([fileName]);

    if (error) throw error;
  });
}