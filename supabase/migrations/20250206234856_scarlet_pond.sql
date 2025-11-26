/*
  # Update blog settings and categories functionality

  1. Changes
    - Add trigger for blog_settings updated_at
    - Add policies for blog settings management
    - Add policies for category management
    - Add indexes for better performance

  2. Security
    - Enable RLS policies for authenticated users
    - Add proper constraints
*/

-- Add trigger for blog_settings updated_at
CREATE TRIGGER handle_blog_settings_updated_at
  BEFORE UPDATE ON blog_settings
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

-- Update blog settings policies
DROP POLICY IF EXISTS "Blog settings are publicly readable" ON blog_settings;
DROP POLICY IF EXISTS "Only authenticated users can update blog settings" ON blog_settings;

CREATE POLICY "Blog settings are publicly readable"
  ON blog_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage blog settings"
  ON blog_settings
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Update blog categories policies
DROP POLICY IF EXISTS "Blog categories are publicly readable" ON blog_categories;
DROP POLICY IF EXISTS "Only authenticated users can manage blog categories" ON blog_categories;

CREATE POLICY "Blog categories are publicly readable"
  ON blog_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage blog categories"
  ON blog_categories
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Add useful indexes
CREATE INDEX IF NOT EXISTS blog_categories_name_idx ON blog_categories(name);
CREATE INDEX IF NOT EXISTS blog_posts_category_id_idx ON blog_posts(category_id);

-- Add foreign key constraint if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'blog_posts_category_id_fkey'
  ) THEN
    ALTER TABLE blog_posts
    ADD CONSTRAINT blog_posts_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES blog_categories(id);
  END IF;
END $$;