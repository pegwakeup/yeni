import React from 'react';
import { FileText, Eye, Edit3, BarChart2 } from 'lucide-react';
import type { BlogStats } from '../types';

interface BlogStatsProps {
  stats: BlogStats;
}

const BlogStats = ({ stats }: BlogStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Toplam Yazı</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.totalPosts}</h3>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Yayında</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.publishedPosts}</h3>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Taslak</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.draftPosts}</h3>
          </div>
          <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Kategori</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.categories.size}</h3>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogStats;