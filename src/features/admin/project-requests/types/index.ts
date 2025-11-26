export interface ProjectRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  project_description: string;
  service_categories: string[];
  budget_range?: string;
  timeline?: string;
  brief_url?: string;
  status: 'pending' | 'reviewing' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ProjectRequestStats {
  total: number;
  pending: number;
  reviewing: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  byService: Record<string, number>;
}