/*
  # Fix blog settings table

  1. Changes
    - Clear existing data
    - Add constraint to ensure only one row
    - Re-insert default settings
*/

-- Clear existing data
TRUNCATE TABLE blog_settings;

-- Add constraint to ensure only one row
CREATE UNIQUE INDEX IF NOT EXISTS blog_settings_single_row ON blog_settings ((TRUE));

-- Insert default settings
INSERT INTO blog_settings (title, description, cover_image)
VALUES (
  'Blog',
  'Teknoloji, tasarım ve dijital dönüşüm hakkında güncel içerikler',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
);