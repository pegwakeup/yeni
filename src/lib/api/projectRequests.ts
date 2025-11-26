import { supabase } from '../config/supabase';

export interface ProjectRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  project_description: string;
  service_categories: string[];
  solution_type: 'one-time' | 'additional-support' | 'regular-service' | 'other';
  timeline: string;
  brief_url?: string;
  budget_range?: string;
  status: 'pending' | 'reviewing' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export async function createProjectRequest(data: Omit<ProjectRequest, 'id' | 'created_at' | 'updated_at' | 'status'>) {
  const { data: record, error } = await supabase
    .from('project_requests')
    .insert([{
      ...data,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
  return record;
}

export async function getProjectRequests() {
  const { data, error } = await supabase
    .from('project_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProjectRequest[];
}

export async function updateProjectStatus(id: string, status: ProjectRequest['status']) {
  const { error } = await supabase
    .from('project_requests')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}