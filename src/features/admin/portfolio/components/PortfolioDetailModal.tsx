import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Globe,
  Github,
  ExternalLink,
  Calendar,
  Code2,
  Palette,
  LineChart,
  CheckCircle,
  GripVertical,
  PartyPopper
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PortfolioItem } from '../types';

interface PortfolioDetailModalProps {
  item: PortfolioItem;
  onClose: () => void;
}

const PortfolioDetailModal = ({ item, onClose }: PortfolioDetailModalProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'software':
        return Code2;
      case 'design':
        return Palette;
      case 'marketing':
        return LineChart;
      default:
        return Code2;
    }
  };

  const CategoryIcon = getCategoryIcon(item.main_category);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-dark-light rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-dark-light/95 backdrop-blur-sm z-10">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">{item.title}</h2>
              <div className="px-3 py-1 rounded-full text-sm border bg-primary/10 text-primary border-primary/20">
                <div className="flex items-center space-x-1.5">
                  <CategoryIcon className="w-4 h-4" />
                  <span>{item.main_category}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)] space-y-8">
            {/* Main Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <img
                src={item.main_image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Proje Açıklaması</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>

            {/* Technologies */}
            {item.technologies && item.technologies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Teknolojiler</h3>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {item.gallery_images && item.gallery_images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Galeri</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {item.gallery_images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members */}
            {item.team_members && item.team_members.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Proje Ekibi</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {item.team_members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-dark rounded-lg border border-white/10"
                    >
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-400">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-4">
              {item.live_url && (
                <a
                  href={item.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Canlı Görüntüle</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {item.github_url && (
                <a
                  href={item.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Oluşturulma: {new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Güncelleme: {new Date(item.updated_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PortfolioDetailModal;
