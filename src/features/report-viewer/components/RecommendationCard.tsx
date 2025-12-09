import React from 'react';
import { motion } from 'framer-motion';
import type { Recommendation, RecommendationCardProps } from '../types';

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, index }) => {
  const priorityConfig = {
    high: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-500',
      badgeText: 'Yüksek Öncelik',
      icon: '🔥',
    },
    medium: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      badge: 'bg-yellow-500',
      badgeText: 'Orta Öncelik',
      icon: '⚡',
    },
    low: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-500',
      badgeText: 'Düşük Öncelik',
      icon: '💡',
    },
  };

  const config = priorityConfig[recommendation.priority];

  const effortLabels = {
    low: { text: 'Kolay', color: 'text-green-600 dark:text-green-400' },
    medium: { text: 'Orta', color: 'text-yellow-600 dark:text-yellow-400' },
    high: { text: 'Zor', color: 'text-red-600 dark:text-red-400' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${config.bg} ${config.border} border rounded-xl p-5 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start gap-4">
        {/* Number Badge */}
        <div className={`flex-shrink-0 w-10 h-10 ${config.badge} rounded-full flex items-center justify-center text-white font-bold`}>
          {index + 1}
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{config.icon}</span>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {recommendation.title}
            </h4>
          </div>

          {/* Description */}
          {recommendation.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              {recommendation.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 text-xs">
            {recommendation.category && (
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                {recommendation.category}
              </span>
            )}
            {recommendation.effort && (
              <span className={`px-2 py-1 rounded ${effortLabels[recommendation.effort].color}`}>
                Efor: {effortLabels[recommendation.effort].text}
              </span>
            )}
            {recommendation.impact && (
              <span className="px-2 py-1 text-gray-500 dark:text-gray-400">
                Etki: {recommendation.impact}
              </span>
            )}
            {recommendation.timeline && (
              <span className="px-2 py-1 text-gray-500 dark:text-gray-400">
                ⏱️ {recommendation.timeline}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  const highPriority = recommendations.filter(r => r.priority === 'high');
  const mediumPriority = recommendations.filter(r => r.priority === 'medium');
  const lowPriority = recommendations.filter(r => r.priority === 'low');

  return (
    <div className="space-y-6">
      {highPriority.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🔥 Yüksek Öncelikli Öneriler
          </h3>
          <div className="space-y-3">
            {highPriority.map((rec, index) => (
              <RecommendationCard key={rec.id} recommendation={rec} index={index} />
            ))}
          </div>
        </div>
      )}

      {mediumPriority.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            ⚡ Orta Öncelikli Öneriler
          </h3>
          <div className="space-y-3">
            {mediumPriority.map((rec, index) => (
              <RecommendationCard key={rec.id} recommendation={rec} index={highPriority.length + index} />
            ))}
          </div>
        </div>
      )}

      {lowPriority.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            💡 Düşük Öncelikli Öneriler
          </h3>
          <div className="space-y-3">
            {lowPriority.map((rec, index) => (
              <RecommendationCard key={rec.id} recommendation={rec} index={highPriority.length + mediumPriority.length + index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
