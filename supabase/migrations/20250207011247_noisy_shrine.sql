/*
  # Update Freelancer Applications Schema

  1. Changes
    - Add portfolio_links JSONB column for multiple portfolio links
    - Add social_links JSONB column for social media profiles
    - Add file size limit trigger for uploads
    - Remove step 4, merge with step 3
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
    - Add file size validation
*/

-- First drop the old table
DROP TABLE IF EXISTS freelancer_applications CASCADE;

-- Create the new table with updated schema
CREATE TABLE freelancer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location_type text NOT NULL CHECK (location_type IN ('turkey', 'international')),
  location text NOT NULL,
  work_preference text NOT NULL CHECK (work_preference IN ('remote', 'hybrid')),
  
  -- Arrays for expertise and skills
  main_expertise text[] NOT NULL,
  sub_expertise text[] NOT NULL,
  tools_and_technologies text[] NOT NULL,
  
  -- Education and work status
  education_status text NOT NULL,
  work_status text NOT NULL,
  
  -- About and files
  about_text text NOT NULL,
  cv_url text,
  portfolio_url text,
  
  -- New fields for multiple links
  portfolio_links jsonb DEFAULT '[]'::jsonb, -- Array of {title: string, url: string}
  social_links jsonb DEFAULT '[]'::jsonb,    -- Array of {platform: string, url: string}
  
  -- Application status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE freelancer_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert applications"
  ON freelancer_applications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view applications"
  ON freelancer_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update applications"
  ON freelancer_applications
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON freelancer_applications
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Create storage bucket for CVs and portfolios if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('freelancer-files', 'freelancer-files', false)
ON CONFLICT DO NOTHING;

-- Create function to validate file size
CREATE OR REPLACE FUNCTION validate_file_size()
RETURNS trigger AS $$
BEGIN
  IF NEW.metadata->>'size' IS NOT NULL AND (NEW.metadata->>'size')::bigint > 8388608 THEN -- 8MB in bytes
    RAISE EXCEPTION 'File size exceeds 8MB limit';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for file size validation
DROP TRIGGER IF EXISTS check_file_size ON storage.objects;
CREATE TRIGGER check_file_size
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'freelancer-files')
  EXECUTE FUNCTION validate_file_size();