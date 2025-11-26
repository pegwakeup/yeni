-- Insert default categories
INSERT INTO blog_categories (name, slug, description)
VALUES 
  ('Teknoloji', 'teknoloji', 'Teknoloji dünyasından en son gelişmeler'),
  ('Tasarım', 'tasarim', 'UI/UX ve grafik tasarım konuları'),
  ('Yapay Zeka', 'yapay-zeka', 'Yapay zeka ve makine öğrenimi'),
  ('Web Geliştirme', 'web-gelistirme', 'Web teknolojileri ve geliştirme'),
  ('Mobil', 'mobil', 'Mobil uygulama geliştirme')
ON CONFLICT (slug) DO NOTHING;

-- Update blog settings with default values if not exists
INSERT INTO blog_settings (title, description, cover_image)
VALUES (
  'Blog',
  'Teknoloji, tasarım ve dijital dönüşüm hakkında güncel içerikler',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
)
ON CONFLICT (id) DO NOTHING;