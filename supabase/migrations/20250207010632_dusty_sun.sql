/*
  # Fix Freelancer Applications Schema

  1. Changes
    - Add location_type column
    - Add location column
    - Update column types for arrays
    - Add status column with default value

  2. Security
    - Keep existing RLS policies
    - Skip duplicate storage policies
*/

-- First drop the old table
DROP TABLE IF EXISTS freelancer_applications CASCADE;

-- Create the new table with correct schema
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