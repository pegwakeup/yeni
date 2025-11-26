/*
  # Add Status Column to Blog Posts Table

  1. Changes
    - Add 'status' column to blog_posts table
    - Set default value to 'draft'
    - Add check constraint for valid status values
    - Update existing rows to have 'published' status if they are published

  2. Notes
    - Status can be either 'draft' or 'published'
    - Existing published posts will be marked as 'published'
    - Unpublished posts will be marked as 'draft'
*/

-- Add status column with default value
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

-- Add check constraint for valid status values
ALTER TABLE blog_posts
ADD CONSTRAINT valid_status CHECK (status IN ('draft', 'published'));

-- Update existing published posts
UPDATE blog_posts
SET status = CASE
  WHEN published = true THEN 'published'
  ELSE 'draft'
END;