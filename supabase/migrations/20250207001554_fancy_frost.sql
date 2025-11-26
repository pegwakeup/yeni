-- First drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Blog yazısı ekleme politikası" ON blog_posts;
DROP POLICY IF EXISTS "Blog yazısı güncelleme politikası" ON blog_posts;
DROP POLICY IF EXISTS "Blog yazısı silme politikası" ON blog_posts;
DROP POLICY IF EXISTS "Yayınlanan blog yazıları herkese açık" ON blog_posts;
DROP POLICY IF EXISTS "Sadece yetkilendirilmiş kullanıcılar blog yazısı ekleyebilir" ON blog_posts;
DROP POLICY IF EXISTS "Sadece yetkilendirilmiş kullanıcılar blog yazısı düzenleyebilir" ON blog_posts;

-- Drop tables in correct order
DROP TABLE IF EXISTS blog_settings CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;

-- Remove new columns from blog_posts
ALTER TABLE blog_posts 
DROP COLUMN IF EXISTS category_id,
DROP COLUMN IF EXISTS status;

-- Reset the published column default
ALTER TABLE blog_posts 
ALTER COLUMN published SET DEFAULT false;

-- Create fresh policies
CREATE POLICY "Yayınlanan blog yazıları herkese açık"
  ON blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Sadece yetkilendirilmiş kullanıcılar blog yazısı ekleyebilir"
  ON blog_posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Sadece yetkilendirilmiş kullanıcılar blog yazısı düzenleyebilir"
  ON blog_posts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Ensure moddatetime extension and trigger are correct
CREATE EXTENSION IF NOT EXISTS moddatetime;

DROP TRIGGER IF EXISTS handle_updated_at ON blog_posts;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);