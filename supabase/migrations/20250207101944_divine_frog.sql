/*
  # Project Requests Schema

  1. New Tables
    - `project_requests`
      - Basic information about the project request
      - Contact details
      - Project requirements
      - Budget and timeline details
      
  2. Security
    - Enable RLS
    - Add policies for insert and view
    
  3. Storage
    - Add bucket for project brief files
*/

-- Create project requests table
CREATE TABLE project_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  project_description text NOT NULL,
  
  -- Service categories (array of: software, design, digital-strategy)
  service_categories text[] NOT NULL,
  
  -- Optional fields
  budget_range text,
  timeline text,
  brief_url text,
  
  -- Status tracking
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'in-progress', 'completed', 'cancelled')),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit project requests"
  ON project_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view project requests"
  ON project_requests
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update project requests"
  ON project_requests
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON project_requests
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Create storage bucket for project briefs
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-briefs', 'project-briefs', false)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload project briefs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-briefs');

CREATE POLICY "Only authenticated users can view project briefs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-briefs' AND auth.role() = 'authenticated');