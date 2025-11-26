import React from 'react';
import { Users, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';
import type { FreelancerStats } from '../types';

interface FreelancerStatsProps {
  stats: FreelancerStats;
}

const FreelancerStats = ({ stats }: FreelancerStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Toplam Başvuru</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Bekleyen</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.pending}</h3>
          </div>
          <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Kabul Edilen</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.accepted}</h3>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Reddedilen</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.rejected}</h3>
          </div>
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerStats;