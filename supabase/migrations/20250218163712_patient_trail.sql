/*
  # Portfolio System Schema

  1. New Tables
    - `portfolio_items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `content` (text)
      - `main_image` (text)
      - `gallery_images` (text[])
      - `main_category` (text)
      - `sub_category` (text)
      - `technologies` (text[])
      - `tags` (text[])
      - `live_url` (text)
      - `github_url` (text)
      - `team_members` (jsonb)
      - `published` (boolean)
      - `featured` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on portfolio_items table
    - Add policies for public read access
    - Add policies for authenticated write access

  3. Storage
    - Create bucket for portfolio images
    - Add storage policies
*/

-- Create portfolio_items table
CREATE TABLE portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  content text,
  main_image text NOT NULL,
  gallery_images text[],
  main_category text NOT NULL,
  sub_category text NOT NULL,
  technologies text[],
  tags text[],
  live_url text,
  github_url text,
  team_members jsonb DEFAULT '[]'::jsonb,
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view published portfolio items"
  ON portfolio_items
  FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage portfolio items"
  ON portfolio_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies
CREATE POLICY "Public can view portfolio images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can upload portfolio images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update portfolio images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'portfolio-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete portfolio images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'portfolio-images' AND
    auth.role() = 'authenticated'
  );