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

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "project_requests_insert_policy" ON project_requests;
  DROP POLICY IF EXISTS "project_requests_select_policy" ON project_requests;
  DROP POLICY IF EXISTS "project_requests_update_policy" ON project_requests;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies with proper public access for form submissions
CREATE POLICY "project_requests_insert_policy"
  ON project_requests
  FOR INSERT
  WITH CHECK (true);  -- Allow anyone to insert

CREATE POLICY "project_requests_select_policy"
  ON project_requests
  FOR SELECT
  USING (auth.role() = 'authenticated');  -- Only authenticated users can view

CREATE POLICY "project_requests_update_policy"
  ON project_requests
  FOR UPDATE
  USING (auth.role() = 'authenticated');  -- Only authenticated users can update

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
  VALUES ('project-briefs', 'project-briefs', false)
  ON CONFLICT DO NOTHING;

  -- Drop existing storage policies
  DROP POLICY IF EXISTS "project_briefs_insert_policy" ON storage.objects;
  DROP POLICY IF EXISTS "project_briefs_select_policy" ON storage.objects;
  
  -- Create new storage policies with proper public access
  CREATE POLICY "project_briefs_insert_policy"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'project-briefs');  -- Allow anyone to upload

  CREATE POLICY "project_briefs_select_policy"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'project-briefs' AND auth.role() = 'authenticated');  -- Only authenticated users can view
END $$;