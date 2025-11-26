/*
  # Create Multilingual Translation System

  ## Overview
  This migration sets up a comprehensive translation system for the Unilancer website,
  enabling Turkish and English content without requiring repeated API calls.

  ## 1. New Tables
  
  ### translations
  - `id` (uuid, primary key): Unique identifier for each translation
  - `content_key` (text, indexed): Unique key identifying the content (e.g., 'nav.home', 'footer.copyright')
  - `language` (text): Language code (tr, en)
  - `translated_text` (text): The translated content
  - `content_hash` (text): Hash of the original content for change detection
  - `created_at` (timestamptz): When the translation was created
  - `updated_at` (timestamptz): When the translation was last updated
  - Unique constraint on (content_key, language)

  ### translation_metadata
  - `id` (uuid, primary key): Unique identifier
  - `total_characters_translated` (integer): Total characters sent to DeepL API
  - `last_translation_date` (timestamptz): Last time a translation was performed
  - `api_calls_count` (integer): Number of API calls made
  - `created_at` (timestamptz): When the record was created

  ## 2. Modifications to Existing Tables

  ### blog_posts
  - `title_en` (text): English translation of title
  - `excerpt_en` (text): English translation of excerpt
  - `content_en` (text): English translation of content
  - `slug_en` (text, unique): English URL slug
  - `content_hash` (text): Hash for change detection

  ### portfolio_items
  - `title_en` (text): English translation of title
  - `description_en` (text): English translation of description
  - `slug_en` (text, unique): English URL slug
  - `content_hash` (text): Hash for change detection

  ## 3. Security
  - Enable RLS on all tables
  - Public read access for translations (authenticated and anon users)
  - Admin-only write access for translations
  - Metadata table accessible only to authenticated admins

  ## 4. Indexes
  - Index on translations(content_key, language) for fast lookups
  - Index on blog_posts(slug_en) for English URL routing
  - Index on portfolio_items(slug_en) for English URL routing

  ## 5. Functions
  - Auto-update updated_at timestamp on translations table
*/

-- Create translations table for static content
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL,
  language text NOT NULL CHECK (language IN ('tr', 'en')),
  translated_text text NOT NULL,
  content_hash text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(content_key, language)
);

-- Create translation metadata table
CREATE TABLE IF NOT EXISTS translation_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_characters_translated integer DEFAULT 0,
  last_translation_date timestamptz,
  api_calls_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add English columns to blog_posts if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'title_en'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN title_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'excerpt_en'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN excerpt_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'content_en'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN content_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'slug_en'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN slug_en text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'content_hash'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN content_hash text;
  END IF;
END $$;

-- Add English columns to portfolio_items if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'portfolio_items') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'portfolio_items' AND column_name = 'title_en'
    ) THEN
      ALTER TABLE portfolio_items ADD COLUMN title_en text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'portfolio_items' AND column_name = 'description_en'
    ) THEN
      ALTER TABLE portfolio_items ADD COLUMN description_en text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'portfolio_items' AND column_name = 'slug_en'
    ) THEN
      ALTER TABLE portfolio_items ADD COLUMN slug_en text UNIQUE;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'portfolio_items' AND column_name = 'content_hash'
    ) THEN
      ALTER TABLE portfolio_items ADD COLUMN content_hash text;
    END IF;
  END IF;
END $$;

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_translations_content_key_language 
  ON translations(content_key, language);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_en 
  ON blog_posts(slug_en) WHERE slug_en IS NOT NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'portfolio_items') THEN
    CREATE INDEX IF NOT EXISTS idx_portfolio_items_slug_en 
      ON portfolio_items(slug_en) WHERE slug_en IS NOT NULL;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_metadata ENABLE ROW LEVEL SECURITY;

-- Translations: Public read access for all users
CREATE POLICY "Anyone can read translations"
  ON translations FOR SELECT
  TO public
  USING (true);

-- Translations: Only authenticated admins can insert
CREATE POLICY "Admins can insert translations"
  ON translations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Translations: Only authenticated admins can update
CREATE POLICY "Admins can update translations"
  ON translations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Translations: Only authenticated admins can delete
CREATE POLICY "Admins can delete translations"
  ON translations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Translation metadata: Only admins can read
CREATE POLICY "Admins can read translation metadata"
  ON translation_metadata FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Translation metadata: Only admins can insert
CREATE POLICY "Admins can insert translation metadata"
  ON translation_metadata FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Translation metadata: Only admins can update
CREATE POLICY "Admins can update translation metadata"
  ON translation_metadata FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for translations table
DROP TRIGGER IF EXISTS update_translations_updated_at ON translations;
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial metadata record if it doesn't exist
INSERT INTO translation_metadata (total_characters_translated, api_calls_count)
SELECT 0, 0
WHERE NOT EXISTS (SELECT 1 FROM translation_metadata);