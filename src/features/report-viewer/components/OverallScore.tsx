import React from 'react';
import { motion } from 'framer-motion';

interface OverallScoreProps {
  score: number;
  maxScore?: number;
  companyName: string;
  reportDate?: string;
}

const OverallScore: React.FC<OverallScoreProps> = ({
  score,
  maxScore = 100,
  companyName,
  reportDate,
}) => {
  const percentage = (score / maxScore) * 100;
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-emerald-500', bg: 'from-emerald-500 to-green-500' };
    if (percentage >= 80) return { grade: 'A', color: 'text-emerald-500', bg: 'from-emerald-500 to-green-500' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-500', bg: 'from-blue-500 to-cyan-500' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500', bg: 'from-yellow-500 to-orange-500' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-500', bg: 'from-orange-500 to-red-500' };
    return { grade: 'F', color: 'text-red-500', bg: 'from-red-500 to-pink-500' };
  };

  const { grade, bg } = getGrade();

  // Calculate circumference for circular progress
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{companyName}</h2>
          <p className="text-gray-400 text-sm">Dijital Varlık Analiz Raporu</p>
          {reportDate && (
            <p className="text-gray-500 text-xs mt-1">{reportDate}</p>
          )}
        </div>

        {/* Circular Score Display */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <motion.circle
                cx="96"
                cy="96"
                r={radius}
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score text in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-bold"
              >
                {score}
              </motion.span>
              <span className="text-gray-400">/ {maxScore}</span>
            </div>
          </div>
        </div>

        {/* Grade Badge */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className={`px-6 py-2 rounded-full bg-gradient-to-r ${bg} text-white font-bold text-lg`}
          >
            Derece: {grade}
          </motion.div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p className="text-gray-300">
            {percentage >= 70 ? (
              <>🎉 Tebrikler! Dijital varlığınız güçlü durumda.</>
            ) : percentage >= 50 ? (
              <>📈 İyi yoldasınız, gelişim alanları mevcut.</>
            ) : (
              <>🚀 Dijital dönüşümünüz için büyük potansiyel var!</>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default OverallScore;
