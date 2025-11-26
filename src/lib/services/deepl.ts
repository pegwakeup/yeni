import { supabase } from '../config/supabase';

export type Language = 'tr' | 'en';

interface TranslationFunctionResponse {
  originalText: string;
  translatedText: string;
  detectedSourceLang?: string;
  contentKey?: string;
  contentHash?: string;
  targetLang: string;
}

interface TranslationFunctionBatchItem {
  contentKey: string;
  originalText: string;
  translatedText: string;
  contentHash?: string;
  targetLang?: string;
  sourceLang?: string;
  success: boolean;
  error?: string;
}

interface TranslationFunctionBatchResponse {
  translations: TranslationFunctionBatchItem[];
  totalCount: number;
  successCount: number;
}

export interface BatchTranslationInput {
  text: string;
  contentKey?: string;
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLang?: string;
  contentKey?: string;
  contentHash?: string;
  error?: string;
}

export interface TranslationMetadata {
  totalCharacters: number;
  apiCalls: number;
  lastTranslationDate: string;
}

function generateHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

async function assertAdminSession() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new Error('Admin session is required to trigger translations');
  }

  const role = data.user.app_metadata?.role;
  if (role !== 'admin') {
    throw new Error('Only admin users can trigger translations');
  }
}

async function invokeTranslationFunction<T>(
  path: 'translate-content' | 'translate-content/batch',
  payload: Record<string, unknown>
): Promise<T> {
  await assertAdminSession();

  const { data, error } = await supabase.functions.invoke<T>(path, {
    body: payload
  });

  if (error) {
    throw new Error(error.message || 'Translation function failed');
  }

  if (!data) {
    throw new Error('Translation function returned no data');
  }

  return data;
}

export async function translateText(
  text: string,
  sourceLang: Language = 'tr',
  targetLang: Language = 'en',
  contentKey?: string
): Promise<TranslationResult> {
  if (!text?.trim()) {
    return {
      translatedText: '',
      error: 'No text provided for translation'
    };
  }

  try {
    const result = await invokeTranslationFunction<TranslationFunctionResponse>('translate-content', {
      text,
      targetLang: targetLang.toUpperCase(),
      sourceLang: sourceLang.toUpperCase(),
      contentKey
    });

    return {
      translatedText: result.translatedText || text,
      detectedSourceLang: result.detectedSourceLang,
      contentKey: result.contentKey || contentKey,
      contentHash: result.contentHash
    };
  } catch (error) {
    console.error('Error translating text:', error);
    return {
      translatedText: text,
      error: error instanceof Error ? error.message : 'Unknown translation error'
    };
  }
}

export async function translateTextBatch(
  texts: BatchTranslationInput[],
  sourceLang: Language = 'tr',
  targetLang: Language = 'en'
): Promise<TranslationResult[]> {
  if (!texts.length) {
    return [];
  }

  const normalizedTexts = texts.map((item, index) => ({
    text: item.text,
    contentKey: item.contentKey || `batch_${index}_${generateHash(item.text)}`
  }));

  try {
    const result = await invokeTranslationFunction<TranslationFunctionBatchResponse>('translate-content/batch', {
      texts: normalizedTexts,
      targetLang: targetLang.toUpperCase(),
      sourceLang: sourceLang.toUpperCase()
    });

    const translationMap = new Map(
      result.translations.map(item => [item.contentKey, item])
    );

    return normalizedTexts.map(({ contentKey, text }) => {
      const translation = translationMap.get(contentKey);

      if (translation?.success) {
        return {
          translatedText: translation.translatedText,
          contentKey,
          contentHash: translation.contentHash,
          detectedSourceLang: (translation.sourceLang as Language) || sourceLang
        };
      }

      return {
        translatedText: text,
        contentKey,
        error: translation?.error || 'Translation failed'
      };
    });
  } catch (error) {
    console.error('Error translating text batch:', error);
    return normalizedTexts.map(({ contentKey, text }) => ({
      translatedText: text,
      contentKey,
      error: error instanceof Error ? error.message : 'Unknown translation error'
    }));
  }
}

export async function getOrCreateTranslation(
  contentKey: string,
  originalText: string,
  language: Language = 'en',
  options?: { allowTranslate?: boolean; sourceLang?: Language }
): Promise<string> {
  if (language === 'tr') {
    return originalText;
  }

  const contentHash = generateHash(originalText);

  try {
    const { data: existingTranslation, error } = await supabase
      .from('translations')
      .select('translated_text, content_hash')
      .eq('content_key', contentKey)
      .eq('language', language)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (existingTranslation) {
      if (existingTranslation.content_hash === contentHash) {
        return existingTranslation.translated_text;
      }

      // Translation exists but belongs to an older version of the Turkish text.
      // We still return the latest saved translation to avoid triggering DeepL
      // automatically. A manual admin translation run should refresh it.
      return existingTranslation.translated_text || originalText;
    }

    if (!options?.allowTranslate) {
      return originalText;
    }

    try {
      const translation = await translateText(
        originalText,
        options?.sourceLang || 'tr',
        language,
        contentKey
      );

      return translation.translatedText;
    } catch (translationError) {
      console.error('Failed to create translation via DeepL:', translationError);
      return originalText;
    }
  } catch (error) {
    console.error('Error in getOrCreateTranslation:', error);
    return originalText;
  }
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Admin-only helper: call this from your dashboard or Supabase Edge Function to
 * translate a blog post on demand. Regular visitors should never invoke this.
 */
export async function translateBlogPost(
  postId: string,
  title: string,
  excerpt: string,
  content: string,
  slug: string
): Promise<{
  title_en: string;
  excerpt_en: string;
  content_en: string;
  slug_en: string;
}> {
  try {
    const { data: existingPost, error } = await supabase
      .from('blog_posts')
      .select('title_en, excerpt_en, content_en, slug_en')
      .eq('id', postId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (existingPost?.title_en && existingPost?.excerpt_en && existingPost?.content_en && existingPost?.slug_en) {
      return {
        title_en: existingPost.title_en,
        excerpt_en: existingPost.excerpt_en,
        content_en: existingPost.content_en,
        slug_en: existingPost.slug_en
      };
    }

    const batchResults = await translateTextBatch([
      { text: title, contentKey: `${postId}:title` },
      { text: excerpt, contentKey: `${postId}:excerpt` },
      { text: content, contentKey: `${postId}:content` }
    ]);

    const [titleResult, excerptResult, contentResult] = batchResults;

    const title_en = titleResult?.translatedText || title;
    const excerpt_en = excerptResult?.translatedText || excerpt;
    const content_en = contentResult?.translatedText || content;
    const slug_en = slugify(title_en || slug || title);

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        title_en,
        excerpt_en,
        content_en,
        slug_en
      })
      .eq('id', postId);

    if (updateError) {
      throw updateError;
    }

    return {
      title_en,
      excerpt_en,
      content_en,
      slug_en
    };
  } catch (error) {
    console.error('Error translating blog post:', error);
    return {
      title_en: title,
      excerpt_en: excerpt,
      content_en: content,
      slug_en: slugify(slug)
    };
  }
}

export async function getTranslationMetadata(): Promise<TranslationMetadata | null> {
  try {
    const { data } = await supabase
      .from('translation_metadata')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!data) return null;

    return {
      totalCharacters: data.total_characters_translated,
      apiCalls: data.api_calls_count,
      lastTranslationDate: data.last_translation_date
    };
  } catch (error) {
    console.error('Error fetching translation metadata:', error);
    return null;
  }
}

export async function checkDeepLUsage(): Promise<null> {
  console.warn('DeepL usage check should be done server-side');
  return null;
}
