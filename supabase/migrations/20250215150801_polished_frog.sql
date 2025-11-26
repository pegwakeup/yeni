-- First, drop all existing policies to start fresh
DO $$ 
BEGIN
  -- Drop table policies
  DROP POLICY IF EXISTS "freelancer_applications_insert_policy" ON freelancer_applications;
  DROP POLICY IF EXISTS "freelancer_applications_select_policy" ON freelancer_applications;
  DROP POLICY IF EXISTS "freelancer_applications_update_policy" ON freelancer_applications;
  
  -- Drop storage policies
  DROP POLICY IF EXISTS "freelancer_files_insert_policy" ON storage.objects;
  DROP POLICY IF EXISTS "freelancer_files_select_policy" ON storage.objects;
EXCEPTION 
  WHEN undefined_object THEN null;
END $$;

-- Ensure RLS is enabled
ALTER TABLE freelancer_applications ENABLE ROW LEVEL SECURITY;

-- Create a single, simple policy for public submissions
CREATE POLICY "allow_public_submissions"
  ON freelancer_applications
  FOR ALL  -- This covers INSERT, SELECT, UPDATE, and DELETE
  USING (true)  -- Allow all operations
  WITH CHECK (true);  -- Allow all inserts

-- Update storage bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'freelancer-files';

-- Create a single, simple policy for public file access
CREATE POLICY "allow_public_storage_access"
  ON storage.objects
  FOR ALL  -- This covers INSERT, SELECT, UPDATE, and DELETE
  USING (bucket_id = 'freelancer-files')  -- Only for freelancer files
  WITH CHECK (bucket_id = 'freelancer-files');  -- Only for freelancer files