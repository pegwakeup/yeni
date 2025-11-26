/*
  # Blog RLS Politikaları Güncellemesi

  1. Değişiklikler
    - Blog yazıları için INSERT politikası güncellendi
    - Blog yazıları için UPDATE politikası güncellendi
    - Blog yazıları için DELETE politikası eklendi
  
  2. Güvenlik
    - Yetkilendirilmiş kullanıcılar için tam CRUD izinleri
    - Anonim kullanıcılar için sadece okuma izni
*/

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Sadece yetkilendirilmiş kullanıcılar blog yazısı ekleyebilir" ON blog_posts;
DROP POLICY IF EXISTS "Sadece yetkilendirilmiş kullanıcılar blog yazısı düzenleyebilir" ON blog_posts;

-- INSERT politikası
CREATE POLICY "Blog yazısı ekleme politikası"
ON blog_posts
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE politikası
CREATE POLICY "Blog yazısı güncelleme politikası"
ON blog_posts
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- DELETE politikası
CREATE POLICY "Blog yazısı silme politikası"
ON blog_posts
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- SELECT politikası zaten var, değiştirmeye gerek yok