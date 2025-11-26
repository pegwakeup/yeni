-- Mevcut tetikleyiciyi kaldır
DROP TRIGGER IF EXISTS set_updated_at ON blog_posts;

-- moddatetime uzantısını yeniden etkinleştir
CREATE EXTENSION IF NOT EXISTS moddatetime;

-- Doğru tetikleyiciyi oluştur
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);