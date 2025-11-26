-- Drop existing policies
DROP POLICY IF EXISTS "freelancer_applications_insert_policy" ON freelancer_applications;
DROP POLICY IF EXISTS "freelancer_applications_select_policy" ON freelancer_applications;
DROP POLICY IF EXISTS "freelancer_applications_update_policy" ON freelancer_applications;

-- Create new policies with proper public access
CREATE POLICY "freelancer_applications_insert_policy"
  ON freelancer_applications
  FOR INSERT
  TO public  -- Allow public inserts
  WITH CHECK (true);

CREATE POLICY "freelancer_applications_select_policy"
  ON freelancer_applications
  FOR SELECT
  TO authenticated  -- Only authenticated users can view
  USING (true);

CREATE POLICY "freelancer_applications_update_policy"
  ON freelancer_applications
  FOR UPDATE
  TO authenticated  -- Only authenticated users can update
  USING (true);

-- Update storage policies
DO $$
BEGIN
  -- Drop existing storage policies
  DROP POLICY IF EXISTS "freelancer_files_insert_policy" ON storage.objects;
  DROP POLICY IF EXISTS "freelancer_files_select_policy" ON storage.objects;
  
  -- Create new storage policies with proper public access
  CREATE POLICY "freelancer_files_insert_policy"
    ON storage.objects
    FOR INSERT
    TO public  -- Allow public uploads
    WITH CHECK (bucket_id = 'freelancer-files');

  CREATE POLICY "freelancer_files_select_policy"
    ON storage.objects
    FOR SELECT
    TO authenticated  -- Only authenticated users can view
    USING (bucket_id = 'freelancer-files');
END $$;