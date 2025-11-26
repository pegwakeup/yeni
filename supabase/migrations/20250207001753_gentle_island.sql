/*
  # Reset Database Structure
  
  1. Changes
    - Drop all new tables and constraints
    - Remove new columns
    - Reset policies
    
  2. Security
    - Drop existing policies first
    - Recreate policies with correct names
*/

-- Drop all new tables and constraints
DROP TABLE IF EXISTS blog_settings CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;

-- Remove new columns from blog_posts
ALTER TABLE blog_posts 
DROP COLUMN IF EXISTS category_id,
DROP COLUMN IF EXISTS status;

-- Drop ALL existing policies first to avoid conflicts
DO $$ 
DECLARE 
  pol text;
BEGIN 
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'blog_posts'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON blog_posts', pol);
  END LOOP;
END $$;

-- Create fresh policies with unique names
CREATE POLICY "blog_posts_select_policy"
  ON blog_posts
  FOR SELECT
  USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "blog_posts_insert_policy"
  ON blog_posts
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "blog_posts_update_policy"
  ON blog_posts
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "blog_posts_delete_policy"
  ON blog_posts
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Reset the published column default
ALTER TABLE blog_posts 
ALTER COLUMN published SET DEFAULT false;

-- Ensure moddatetime extension is enabled
CREATE EXTENSION IF NOT EXISTS moddatetime;

-- Reset the updated_at trigger
DROP TRIGGER IF EXISTS handle_updated_at ON blog_posts;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);