export interface FreelancerApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location_type: 'turkey' | 'international';
  location: string;
  work_preference: 'remote' | 'hybrid';
  main_expertise: string[];
  sub_expertise: string[];
  tools_and_technologies: string[];
  education_status: string;
  work_status: string;
  about_text: string;
  cv_url?: string;
  portfolio_url?: string;
  portfolio_links: Array<{
    title: string;
    url: string;
  }>;
  social_links: Array<{
    platform: string;
    url: string;
  }>;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface FreelancerStats {
  total: number;
  pending: number;
  reviewing: number;
  accepted: number;
  rejected: number;
  byExpertise: Record<string, number>;
  byLocation: Record<string, number>;
}

export interface FreelancerFilters {
  search: string;
  status: string;
  expertise: string;
  location: string;
  workPreference: string;
  dateRange: [Date | null, Date | null];
}