import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Edit3, Trash2, Eye, ExternalLink, Github } from 'lucide-react';
import type { PortfolioItem } from '../types';

interface PortfolioListProps {
  items: PortfolioItem[];
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
  onView: (item: PortfolioItem) => void;
}

const PortfolioList = ({ items, onEdit, onDelete, onView }: PortfolioListProps) => {
  return (
    <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10">
              <th className="text-left py-4 px-6 font-medium text-slate-900 dark:text-white">Proje</th>
              <th className="text-left py-4 px-6 font-medium hidden sm:table-cell text-slate-900 dark:text-white">Kategori</th>
              <th className="text-left py-4 px-6 font-medium hidden lg:table-cell text-slate-900 dark:text-white">Teknolojiler</th>
              <th className="text-left py-4 px-6 font-medium hidden md:table-cell text-slate-900 dark:text-white">Tarih</th>
              <th className="text-left py-4 px-6 font-medium text-slate-900 dark:text-white">Durum</th>
              <th className="text-right py-4 px-6 font-medium text-slate-900 dark:text-white">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.main_image}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover hidden sm:block"
                    />
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400 line-clamp-1 hidden sm:block">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 hidden sm:table-cell">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {item.main_category}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-gray-400">
                      {item.sub_category}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {item.technologies?.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-xs text-slate-600 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {(item.technologies?.length || 0) > 3 && (
                      <span className="text-slate-500 dark:text-gray-400 text-xs">
                        +{(item.technologies?.length || 0) - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <div className="flex items-center text-slate-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    item.published
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {item.published ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(item)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-600 dark:text-white"
                      title="Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-600 dark:text-white"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioList;