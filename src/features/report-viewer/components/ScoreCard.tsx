import React from 'react';
import { motion } from 'framer-motion';
import type { ScoreCardProps } from '../types';

const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  maxScore,
  label,
  description,
  icon,
  color = 'emerald',
}) => {
  const percentage = Math.round((score / maxScore) * 100);
  
  const getStatusColor = () => {
    if (percentage >= 70) return 'emerald';
    if (percentage >= 40) return 'yellow';
    return 'red';
  };

  const statusColor = color || getStatusColor();

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500',
      bgLight: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      ring: 'ring-emerald-500',
    },
    yellow: {
      bg: 'bg-yellow-500',
      bgLight: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-600 dark:text-yellow-400',
      ring: 'ring-yellow-500',
    },
    red: {
      bg: 'bg-red-500',
      bgLight: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      ring: 'ring-red-500',
    },
    blue: {
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      ring: 'ring-blue-500',
    },
    purple: {
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
      ring: 'ring-purple-500',
    },
  };

  const colors = colorClasses[statusColor as keyof typeof colorClasses] || colorClasses.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.bgLight}`}>
          {icon || (
            <svg className={`w-6 h-6 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )}
        </div>
        <div className="text-right">
          <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
          <span className="text-gray-400 dark:text-gray-500">/{maxScore}</span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{label}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`absolute top-0 left-0 h-full ${colors.bg} rounded-full`}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>0</span>
        <span className={colors.text}>{percentage}%</span>
        <span>{maxScore}</span>
      </div>
    </motion.div>
  );
};

export default ScoreCard;
