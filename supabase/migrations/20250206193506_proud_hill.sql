/*
  # Blog Sistemi Veritabanı Şeması

  1. Yeni Tablolar
    - `blog_authors`: Blog yazarları için tablo
      - `id` (uuid, primary key)
      - `name` (text, zorunlu)
      - `role` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    
    - `blog_posts`: Blog yazıları için tablo
      - `id` (uuid, primary key)
      - `title` (text, zorunlu)
      - `slug` (text, benzersiz)
      - `excerpt` (text)
      - `content` (text)
      - `image_url` (text)
      - `category` (text)
      - `tags` (text[])
      - `author_id` (uuid, foreign key)
      - `published` (boolean)
      - `read_time` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Güvenlik
    - Her iki tablo için RLS etkinleştirildi
    - Okuma politikaları tanımlandı
    - Yazma politikaları tanımlandı

  3. İndeksler
    - slug için indeks
    - published durumu için indeks
    - kategori için indeks
*/

-- Gerekli uzantıyı etkinleştir
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- Blog yazarları tablosu
CREATE TABLE blog_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Blog yazıları tablosu
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  image_url text,
  category text,
  tags text[],
  author_id uuid REFERENCES blog_authors(id),
  published boolean DEFAULT false,
  read_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Otomatik güncelleme tarihi
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime();

-- RLS'i etkinleştir
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Okuma politikaları
CREATE POLICY "Yayınlanan blog yazıları herkese açık"
  ON blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Blog yazarları herkese açık"
  ON blog_authors
  FOR SELECT
  USING (true);

-- Yazma politikaları
CREATE POLICY "Sadece yetkilendirilmiş kullanıcılar blog yazısı ekleyebilir"
  ON blog_posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Sadece yetkilendirilmiş kullanıcılar blog yazısı düzenleyebilir"
  ON blog_posts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- İndeksler
CREATE INDEX blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX blog_posts_published_idx ON blog_posts(published);
CREATE INDEX blog_posts_category_idx ON blog_posts(category);