/*
  # Add blog settings and categories

  1. New Tables
    - blog_settings
      - id (uuid, primary key)
      - cover_image (text)
      - title (text)
      - description (text)
      - updated_at (timestamptz)
    
    - blog_categories
      - id (uuid, primary key)
      - name (text)
      - slug (text, unique)
      - description (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Blog Settings table
CREATE TABLE IF NOT EXISTS blog_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cover_image text,
  title text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Blog Categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Enable RLS
ALTER TABLE blog_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Blog Settings Policies
CREATE POLICY "Blog settings are publicly readable"
  ON blog_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can update blog settings"
  ON blog_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Blog Categories Policies
CREATE POLICY "Blog categories are publicly readable"
  ON blog_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage blog categories"
  ON blog_categories
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default blog settings
INSERT INTO blog_settings (title, description, cover_image)
VALUES (
  'Blog',
  'Teknoloji, tasarım ve dijital dönüşüm hakkında güncel içerikler',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
) ON CONFLICT DO NOTHING;

-- Add category reference to blog_posts
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES blog_categories(id);