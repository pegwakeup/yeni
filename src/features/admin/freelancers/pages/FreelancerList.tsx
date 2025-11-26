import React, { useState } from 'react';
import FreelancerStats from '../components/FreelancerStats';
import FreelancerFilters from '../components/FreelancerFilters';
import FreelancerTable from '../components/FreelancerList';
import FreelancerDetailModal from '../components/FreelancerDetailModal';
import { useFreelancers } from '../hooks/useFreelancers';
import type { FreelancerApplication } from '../types';

const FreelancerListPage = () => {
  const { 
    freelancers,
    loading,
    error,
    stats,
    filterFreelancers,
    handleUpdateStatus,
    refresh
  } = useFreelancers();

  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerApplication | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    expertise: '',
    location: '',
    workPreference: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusUpdate = async (id: string, status: FreelancerApplication['status']) => {
    try {
      await handleUpdateStatus(id, status);
    } catch (error) {
      alert('Durum güncellenirken bir hata oluştu.');
    }
  };

  const filteredFreelancers = filterFreelancers(filters);

  const expertiseOptions = Array.from(
    new Set(freelancers.flatMap(f => f.main_expertise))
  ).sort();

  const locationOptions = Array.from(
    new Set(freelancers.map(f => f.location))
  ).sort();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Freelancer Başvuruları</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Freelancer başvurularını yönetin</p>
        </div>
      </div>

      <FreelancerStats stats={stats} />

      <FreelancerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        expertiseOptions={expertiseOptions}
        locationOptions={locationOptions}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      ) : (
        <FreelancerTable
          freelancers={filteredFreelancers}
          onView={setSelectedFreelancer}
          onUpdateStatus={handleStatusUpdate}
        />
      )}

      {selectedFreelancer && (
        <FreelancerDetailModal
          freelancer={selectedFreelancer}
          onClose={() => setSelectedFreelancer(null)}
        />
      )}
    </>
  );
};

export default FreelancerListPage;