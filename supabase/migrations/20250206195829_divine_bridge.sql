/*
  # Storage bucket oluşturma

  1. Yeni Bucket
    - `blog-images` adında yeni bir bucket oluşturur
    - Public erişime açık olacak şekilde ayarlanır
    - Sadece yetkilendirilmiş kullanıcılar dosya yükleyebilir

  2. Storage Politikaları
    - Herkes görselleri görüntüleyebilir
    - Sadece yetkilendirilmiş kullanıcılar görsel yükleyebilir
*/

-- Storage bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT DO NOTHING;

-- Görsel görüntüleme politikası
CREATE POLICY "Herkes blog görsellerini görüntüleyebilir"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Görsel yükleme politikası
CREATE POLICY "Sadece yetkilendirilmiş kullanıcılar görsel yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.role() = 'authenticated'
);

-- Görsel silme politikası
CREATE POLICY "Sadece yetkilendirilmiş kullanıcılar görsel silebilir"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images'
  AND auth.role() = 'authenticated'
);