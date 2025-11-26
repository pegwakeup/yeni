-- Revert blog_settings single row constraint
DROP INDEX IF EXISTS blog_settings_single_row;

-- Revert blog_settings table to original state
DROP TABLE IF EXISTS blog_settings CASCADE;

-- Revert blog_categories table to original state
DROP TABLE IF EXISTS blog_categories CASCADE;

-- Remove category_id column from blog_posts
ALTER TABLE blog_posts DROP COLUMN IF EXISTS category_id;

-- Recreate original blog_posts table structure
ALTER TABLE blog_posts 
DROP COLUMN IF EXISTS status;

-- Reset the published column default
ALTER TABLE blog_posts 
ALTER COLUMN published SET DEFAULT false;

-- Reset RLS policies to original state
DROP POLICY IF EXISTS "Blog yazısı ekleme politikası" ON blog_posts;
DROP POLICY IF EXISTS "Blog yazısı güncelleme politikası" ON blog_posts;
DROP POLICY IF EXISTS "Blog yazısı silme politikası" ON blog_posts;
DROP POLICY IF EXISTS "Yayınlanan blog yazıları herkese açık" ON blog_posts;

-- Recreate original policies
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