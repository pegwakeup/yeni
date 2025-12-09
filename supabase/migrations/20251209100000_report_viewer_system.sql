-- Report Viewer System Migration
-- Extends digital_analysis_reports for public viewing with AI chatbot

-- Add new columns for public viewing
ALTER TABLE digital_analysis_reports
ADD COLUMN IF NOT EXISTS public_id UUID DEFAULT gen_random_uuid() UNIQUE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS report_data JSONB,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS access_password_hash TEXT,
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ;

-- Create index for public_id lookups
CREATE INDEX IF NOT EXISTS idx_digital_analysis_reports_public_id 
ON digital_analysis_reports(public_id) 
WHERE is_public = true;

-- Report Viewers table - tracks who viewed the report
CREATE TABLE IF NOT EXISTS report_viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES digital_analysis_reports(id) ON DELETE CASCADE,
  viewer_email TEXT NOT NULL,
  viewer_name TEXT,
  viewer_company TEXT,
  verification_code TEXT,
  verified_at TIMESTAMPTZ,
  access_token TEXT UNIQUE,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_access_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_report_viewers_report_id ON report_viewers(report_id);
CREATE INDEX IF NOT EXISTS idx_report_viewers_email ON report_viewers(viewer_email);
CREATE INDEX IF NOT EXISTS idx_report_viewers_access_token ON report_viewers(access_token);

-- Report Chat Conversations table - stores chat history with DigiBot
CREATE TABLE IF NOT EXISTS report_chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES digital_analysis_reports(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES report_viewers(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_chat_report_id ON report_chat_conversations(report_id);
CREATE INDEX IF NOT EXISTS idx_report_chat_session_id ON report_chat_conversations(session_id);

-- Report Analytics table - tracks detailed analytics
CREATE TABLE IF NOT EXISTS report_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES digital_analysis_reports(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES report_viewers(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'view', 'chat', 'pdf_download', 'email_sent', 'section_view'
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_analytics_report_id ON report_analytics(report_id);
CREATE INDEX IF NOT EXISTS idx_report_analytics_event_type ON report_analytics(event_type);

-- Enable RLS on new tables
ALTER TABLE report_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for report_viewers
CREATE POLICY "Enable insert for all users" ON report_viewers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for own records" ON report_viewers
  FOR SELECT USING (true);

CREATE POLICY "Enable update for own records" ON report_viewers
  FOR UPDATE USING (true);

-- RLS Policies for report_chat_conversations
CREATE POLICY "Enable insert for all users" ON report_chat_conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for own session" ON report_chat_conversations
  FOR SELECT USING (true);

-- RLS Policies for report_analytics
CREATE POLICY "Enable insert for all users" ON report_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for authenticated" ON report_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_report_view_count(report_public_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE digital_analysis_reports
  SET view_count = view_count + 1,
      last_viewed_at = NOW()
  WHERE public_id = report_public_id AND is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get public report
CREATE OR REPLACE FUNCTION get_public_report(p_public_id UUID)
RETURNS SETOF digital_analysis_reports AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM digital_analysis_reports
  WHERE public_id = p_public_id AND is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_report_view_count(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_public_report(UUID) TO anon, authenticated;
