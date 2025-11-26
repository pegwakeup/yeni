import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Link as LinkIcon, FileText, ExternalLink, Globe, 
  Calendar, Clock, CheckCircle, XCircle, AlertCircle,
  Linkedin, Github, Code2, Palette, Database, ChevronRight
} from 'lucide-react';
import type { FreelancerApplication } from '../types';

interface FreelancerDetailModalProps {
  freelancer: FreelancerApplication;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: FreelancerApplication['status']) => void;
}

const FreelancerDetailModal = ({ freelancer, onClose, onUpdateStatus }: FreelancerDetailModalProps) => {
  const getStatusColor = (status: FreelancerApplication['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'reviewing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'accepted':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusText = (status: FreelancerApplication['status']) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'reviewing':
        return 'İnceleniyor';
      case 'accepted':
        return 'Kabul Edildi';
      case 'rejected':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: FreelancerApplication['status']) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'reviewing':
        return AlertCircle;
      case 'accepted':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return Linkedin;
      case 'github':
        return Github;
      default:
        return Globe;
    }
  };

  const StatusIcon = getStatusIcon(freelancer.status);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-dark-light/95 backdrop-blur-sm z-10">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{freelancer.full_name}</h2>
              <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(freelancer.status)}`}>
                <div className="flex items-center space-x-1.5">
                  <StatusIcon className="w-4 h-4" />
                  <span>{getStatusText(freelancer.status)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {onUpdateStatus && freelancer.status === 'pending' && (
                <>
                  <button
                    onClick={() => onUpdateStatus(freelancer.id, 'accepted')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Kabul Et</span>
                  </button>
                  <button
                    onClick={() => onUpdateStatus(freelancer.id, 'rejected')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reddet</span>
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)] space-y-8">
            {/* Basic Info */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="bg-gray-50 dark:bg-dark p-6 rounded-xl border border-slate-200 dark:border-white/10 space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">İletişim Bilgileri</h3>
                <div className="space-y-4">
                  <a 
                    href={`mailto:${freelancer.email}`}
                    className="flex items-center space-x-3 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 dark:text-gray-400">E-posta</div>
                      <div>{freelancer.email}</div>
                    </div>
                  </a>

                  {freelancer.phone && (
                    <a 
                      href={`tel:${freelancer.phone}`}
                      className="flex items-center space-x-3 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-500 dark:text-gray-400">Telefon</div>
                        <div>{freelancer.phone}</div>
                      </div>
                    </a>
                  )}

                  <div className="flex items-center space-x-3 text-slate-600 dark:text-gray-300">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 dark:text-gray-400">Konum</div>
                      <div>{freelancer.location}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Work */}
              <div className="bg-gray-50 dark:bg-dark p-6 rounded-xl border border-slate-200 dark:border-white/10 space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Eğitim ve İş</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-600 dark:text-gray-300">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 dark:text-gray-400">Eğitim Durumu</div>
                      <div>{freelancer.education_status}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-600 dark:text-gray-300">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 dark:text-gray-400">Çalışma Durumu</div>
                      <div>{freelancer.work_status}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-600 dark:text-gray-300">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 dark:text-gray-400">Başvuru Tarihi</div>
                      <div>{new Date(freelancer.created_at).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files & Links */}
              <div className="bg-gray-50 dark:bg-dark p-6 rounded-xl border border-slate-200 dark:border-white/10 space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Dosyalar ve Linkler</h3>
                <div className="space-y-4">
                  {freelancer.cv_url && (
                    <a
                      href={freelancer.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-500 dark:text-gray-400">CV</div>
                        <div className="flex items-center space-x-1">
                          <span>Görüntüle</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    </a>
                  )}

                  {freelancer.portfolio_url && (
                    <a
                      href={freelancer.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-500 dark:text-gray-400">Portfolyo</div>
                        <div className="flex items-center space-x-1">
                          <span>Görüntüle</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    </a>
                  )}

                  {freelancer.social_links.map((link, index) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-slate-500 dark:text-gray-400">{link.platform}</div>
                          <div className="flex items-center space-x-1">
                            <span>Profili Görüntüle</span>
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Main Expertise */}
              <div className="bg-gray-50 dark:bg-dark p-6 rounded-xl border border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Ana Uzmanlık Alanları</h3>
                <div className="flex flex-wrap gap-2">
                  {freelancer.main_expertise.map((expertise, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 px-3 py-2 bg-primary/10 text-primary rounded-lg"
                    >
                      <Code2 className="w-4 h-4" />
                      <span>{expertise}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub Expertise */}
              <div className="bg-gray-50 dark:bg-dark p-6 rounded-xl border border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Alt Uzmanlıklar</h3>
                <div className="flex flex-wrap gap-2">
                  {freelancer.sub_expertise.map((expertise, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {expertise}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools & Technologies */}
            <div className="bg-gray-50 dark:bg-dark p-6 rounded-xl border border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Araçlar ve Teknolojiler</h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.tools_and_technologies.map((tool, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-gray-50 dark:bg-dark p-6 rounded-xl border border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Hakkında</h3>
              <p className="text-slate-600 dark:text-gray-300 whitespace-pre-wrap">{freelancer.about_text}</p>
            </div>

            {/* Portfolio Links */}
            {freelancer.portfolio_links.length > 0 && (
              <div className="bg-gray-50 dark:bg-dark p-6 rounded-xl border border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Portfolyo Linkleri</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {freelancer.portfolio_links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-slate-200 dark:bg-white/5 rounded-lg hover:bg-slate-300 dark:hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LinkIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">{link.title}</div>
                        <div className="text-sm text-slate-500 dark:text-gray-400 flex items-center space-x-1">
                          <span>Projeyi İncele</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FreelancerDetailModal;