-- Drop project requests table and related objects
DROP TABLE IF EXISTS project_requests CASCADE;

-- Drop storage bucket and policies for project briefs
DO $$
BEGIN
  -- Drop storage policies
  DROP POLICY IF EXISTS "project_briefs_policy" ON storage.objects;
  DROP POLICY IF EXISTS "project_briefs_insert_policy" ON storage.objects;
  DROP POLICY IF EXISTS "project_briefs_select_policy" ON storage.objects;

  -- Delete all files in the project-briefs bucket
  DELETE FROM storage.objects WHERE bucket_id = 'project-briefs';
  
  -- Delete the bucket
  DELETE FROM storage.buckets WHERE id = 'project-briefs';
END $$;