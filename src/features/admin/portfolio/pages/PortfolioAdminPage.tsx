import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PortfolioStats from '../components/PortfolioStats';
import PortfolioFilters from '../components/PortfolioFilters';
import PortfolioList from '../components/PortfolioList';
import PortfolioDetailModal from '../components/PortfolioDetailModal';
import { usePortfolio } from '../hooks/usePortfolio';
import type { PortfolioItem, PortfolioFilters as Filters } from '../types';

// Categories configuration
const categories = [
  {
    id: 'software',
    label: 'Yazılım',
    subcategories: [
      { id: 'web', label: 'Web Geliştirme' },
      { id: 'mobile', label: 'Mobil Uygulama' },
      { id: 'saas', label: 'SaaS Çözümleri' },
      { id: 'ai', label: 'AI Entegrasyonları' }
    ]
  },
  {
    id: 'design',
    label: 'Tasarım',
    subcategories: [
      { id: 'ui-ux', label: 'UI/UX Tasarım' },
      { id: 'brand', label: 'Kurumsal Kimlik' },
      { id: 'print', label: 'Basılı Tasarım' },
      { id: 'illustration', label: '3D & İllüstrasyon' }
    ]
  },
  {
    id: 'marketing',
    label: 'Dijital Pazarlama',
    subcategories: [
      { id: 'seo', label: 'SEO & SEM' },
      { id: 'ads', label: 'Dijital Reklam' },
      { id: 'analytics', label: 'Analitik' }
    ]
  }
];

const PortfolioAdminPage = () => {
  const { 
    items,
    loading,
    error,
    stats,
    filterItems,
    handleDelete,
    refresh
  } = usePortfolio();

  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    category: '',
    subcategory: ''
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Reset subcategory when category changes
    if (key === 'category' && value !== filters.category) {
      setFilters(prev => ({ ...prev, [key]: value, subcategory: '' }));
    }
  };

  const filteredItems = filterItems(filters);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Portfolyo Yönetimi</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Portfolyo projelerini yönetin</p>
        </div>

        <Link
          to="/admin/portfolio/new"
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 min-h-[48px]"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Yeni Proje</span>
        </Link>
      </div>

      <PortfolioStats stats={stats} />

      <PortfolioFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
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
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      ) : (
        <PortfolioList
          items={filteredItems}
          onEdit={(item) => navigate(`/admin/portfolio/edit/${item.id}`)}
          onDelete={handleDelete}
          onView={(item) => setSelectedItem(item)}
        />
      )}

      {selectedItem && (
        <PortfolioDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
};

export default PortfolioAdminPage;