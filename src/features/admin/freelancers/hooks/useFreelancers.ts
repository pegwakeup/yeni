import { useState, useEffect } from 'react';
import { getFreelancerApplications, updateFreelancerStatus, getFreelancerStats } from '../../../../lib/api/freelancers';
import type { FreelancerApplication, FreelancerStats } from '../types';

export function useFreelancers() {
  const [freelancers, setFreelancers] = useState<FreelancerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FreelancerStats>({
    total: 0,
    pending: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0,
    byExpertise: {},
    byLocation: {}
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [applicationsData, statsData] = await Promise.all([
        getFreelancerApplications(),
        getFreelancerStats()
      ]);
      
      setFreelancers(applicationsData);
      setStats(statsData);
    } catch (err) {
      console.error('Data loading error:', err);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: FreelancerApplication['status']) => {
    try {
      await updateFreelancerStatus(id, status);
      
      // Update local state
      setFreelancers(prev => prev.map(f => 
        f.id === id ? { ...f, status } : f
      ));

      // Refresh stats
      const statsData = await getFreelancerStats();
      setStats(statsData);
    } catch (error) {
      console.error('Status update error:', error);
      throw new Error('Durum güncellenirken bir hata oluştu.');
    }
  };

  const filterFreelancers = (filters: {
    search: string;
    status: string;
    expertise: string;
    location: string;
    workPreference: string;
  }) => {
    return freelancers.filter(freelancer => {
      const matchesSearch = !filters.search || 
        freelancer.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        freelancer.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || freelancer.status === filters.status;
      const matchesExpertise = !filters.expertise || freelancer.main_expertise.includes(filters.expertise);
      const matchesLocation = !filters.location || freelancer.location === filters.location;
      const matchesWorkPreference = !filters.workPreference || freelancer.work_preference === filters.workPreference;
      
      return matchesSearch && matchesStatus && matchesExpertise && 
             matchesLocation && matchesWorkPreference;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    freelancers,
    loading,
    error,
    stats,
    filterFreelancers,
    handleUpdateStatus,
    refresh: loadData
  };
}