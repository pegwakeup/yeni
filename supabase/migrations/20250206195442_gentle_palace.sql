/*
  # Varsayılan blog yazarı ekleme

  1. Değişiklikler
    - Varsayılan bir blog yazarı ekleniyor
    
  2. Güvenlik
    - RLS politikaları korunuyor
*/

INSERT INTO blog_authors (id, name, role, avatar_url)
VALUES (
  'a52c1934-0c96-4c44-9567-97c36ce7e042',
  'Admin',
  'İçerik Editörü',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
) ON CONFLICT DO NOTHING;