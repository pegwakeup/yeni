-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Blog yazısı ekleme politikası" ON blog_posts;
DROP POLICY IF EXISTS "Blog yazısı güncelleme politikası" ON blog_posts;
DROP POLICY IF EXISTS "Blog yazısı silme politikası" ON blog_posts;
DROP POLICY IF EXISTS "Yayınlanan blog yazıları herkese açık" ON blog_posts;

-- Yayınlanan blog yazıları için SELECT politikası
CREATE POLICY "Yayınlanan blog yazıları herkese açık"
ON blog_posts
FOR SELECT
USING (
  published = true OR
  (auth.uid() IS NOT NULL)
);

-- Blog yazısı ekleme politikası
CREATE POLICY "Blog yazısı ekleme politikası"
ON blog_posts
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Blog yazısı güncelleme politikası
CREATE POLICY "Blog yazısı güncelleme politikası"
ON blog_posts
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Blog yazısı silme politikası
CREATE POLICY "Blog yazısı silme politikası"
ON blog_posts
FOR DELETE
USING (auth.uid() IS NOT NULL);