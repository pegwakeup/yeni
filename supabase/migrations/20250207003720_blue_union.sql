-- Create freelancer applications table
CREATE TABLE freelancer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  work_preference text NOT NULL CHECK (work_preference IN ('remote', 'hybrid')),
  
  -- Main expertise and skills
  main_expertise text NOT NULL,
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

-- Create storage bucket for CVs and portfolios
INSERT INTO storage.buckets (id, name, public)
VALUES ('freelancer-files', 'freelancer-files', false)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload freelancer files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'freelancer-files');

CREATE POLICY "Only authenticated users can view freelancer files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'freelancer-files' AND auth.role() = 'authenticated');