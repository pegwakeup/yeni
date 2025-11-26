import React from 'react';
import { Search } from 'lucide-react';
import type { PortfolioFilters as PortfolioFiltersType } from '../types';

interface PortfolioFiltersProps {
  filters: PortfolioFiltersType;
  onFilterChange: (key: keyof PortfolioFiltersType, value: string) => void;
  categories: {
    id: string;
    label: string;
    subcategories: Array<{
      id: string;
      label: string;
    }>;
  }[];
}

const PortfolioFiltersComponent = ({
  filters,
  onFilterChange,
  categories
}: PortfolioFiltersProps) => {
  const selectedCategory = categories.find(cat => cat.id === filters.category);

  return (
    <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4 lg:p-6 mb-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Proje ara..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
        >
          <option value="">Tüm Durumlar</option>
          <option value="published">Yayında</option>
          <option value="draft">Taslak</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        {/* Subcategory Filter */}
        <select
          value={filters.subcategory}
          onChange={(e) => onFilterChange('subcategory', e.target.value)}
          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
          disabled={!selectedCategory}
        >
          <option value="">Tüm Alt Kategoriler</option>
          {selectedCategory?.subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PortfolioFiltersComponent;
