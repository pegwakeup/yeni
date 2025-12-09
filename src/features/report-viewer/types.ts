// Report Viewer Types

export interface DigitalAnalysisReport {
  id: string;
  public_id: string;
  company_name: string;
  company_website: string;
  contact_email: string;
  contact_name?: string;
  industry?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  digital_score?: number;
  analysis_result?: AnalysisResult;
  report_data?: ReportData;
  is_public: boolean;
  view_count: number;
  last_viewed_at?: string;
  pdf_url?: string;
  email_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisResult {
  summary: string;
  scores: CategoryScores;
  recommendations: Recommendation[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  competitors?: CompetitorAnalysis[];
}

export interface CategoryScores {
  website: CategoryScore;
  seo: CategoryScore;
  social_media: CategoryScore;
  content: CategoryScore;
  branding: CategoryScore;
  analytics: CategoryScore;
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  label: string;
  description: string;
  details?: string[];
}

export interface Recommendation {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeline?: string;
}

export interface CompetitorAnalysis {
  name: string;
  website?: string;
  strengths: string[];
  weaknesses: string[];
}

export interface ReportData {
  generatedAt: string;
  version: string;
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  title: string;
  icon?: string;
  content: string;
  score?: number;
  status?: 'good' | 'warning' | 'critical';
  items?: ReportItem[];
}

export interface ReportItem {
  label: string;
  value: string | number | boolean;
  status?: 'good' | 'warning' | 'critical';
  description?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  reportId: string;
  messages: ChatMessage[];
  createdAt: Date;
}

// Viewer Types
export interface ReportViewer {
  id: string;
  report_id: string;
  viewer_email: string;
  viewer_name?: string;
  viewer_company?: string;
  verified_at?: string;
  access_token: string;
  token_expires_at: string;
  created_at: string;
  last_access_at?: string;
}

// API Response Types
export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  tokensUsed?: number;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Component Props Types
export interface ReportDashboardProps {
  report: DigitalAnalysisReport;
  onRefresh?: () => void;
}

export interface DigiBotChatProps {
  reportId: string;
  reportContext: string;
  viewerId?: string;
}

export interface ScoreCardProps {
  category: string;
  score: number;
  maxScore: number;
  label: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}
