-- Drop existing objects if they exist
DROP TABLE IF EXISTS project_requests CASCADE;

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
  
  -- Solution type
  solution_type text NOT NULL CHECK (solution_type IN ('one-time', 'additional-support', 'regular-service', 'other')),
  
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

-- Drop existing policies
DROP POLICY IF EXISTS "project_requests_insert_policy" ON project_requests;
DROP POLICY IF EXISTS "project_requests_select_policy" ON project_requests;
DROP POLICY IF EXISTS "project_requests_update_policy" ON project_requests;

-- Create new policies
-- Allow anyone to submit project requests (no auth required)
CREATE POLICY "project_requests_insert_policy"
  ON project_requests
  FOR INSERT
  TO anon  -- Explicitly allow anonymous users
  WITH CHECK (true);

-- Only authenticated users can view requests
CREATE POLICY "project_requests_select_policy"
  ON project_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update requests
CREATE POLICY "project_requests_update_policy"
  ON project_requests
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS handle_updated_at ON project_requests;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON project_requests
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Create storage bucket for project briefs
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('project-briefs', 'project-briefs', true)  -- Make bucket public
  ON CONFLICT (id) DO UPDATE SET public = true;  -- Ensure bucket is public

  -- Drop existing storage policies
  DROP POLICY IF EXISTS "project_briefs_insert_policy" ON storage.objects;
  DROP POLICY IF EXISTS "project_briefs_select_policy" ON storage.objects;
  
  -- Create new storage policies
  CREATE POLICY "project_briefs_insert_policy"
    ON storage.objects
    FOR INSERT
    TO anon  -- Allow anonymous uploads
    WITH CHECK (bucket_id = 'project-briefs');

  CREATE POLICY "project_briefs_select_policy"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'project-briefs');  -- Allow public access to files
END $$;