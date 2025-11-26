import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Award } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  department: string;
  linkedin?: string;
  email?: string;
  skills: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'Ahmet Yılmaz',
    role: 'CEO & Kurucu Ortak',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    bio: '5+ yıl yazılım geliştirme ve proje yönetimi deneyimi',
    department: 'leadership',
    linkedin: 'https://linkedin.com',
    email: 'ahmet@unilancer.com',
    skills: ['Liderlik', 'Strateji', 'İş Geliştirme'],
  },
  {
    name: 'Ayşe Kaya',
    role: 'Tasarım Direktörü',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    bio: 'UI/UX ve marka tasarımı konusunda uzman',
    department: 'leadership',
    linkedin: 'https://linkedin.com',
    skills: ['UI/UX', 'Branding', 'Design Systems'],
  },
  {
    name: 'Mehmet Demir',
    role: 'Teknoloji Direktörü',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'Full-stack geliştirme ve AI entegrasyonları uzmanı',
    department: 'leadership',
    linkedin: 'https://linkedin.com',
    skills: ['Full-Stack', 'AI', 'Cloud Architecture'],
  },
  {
    name: 'Zeynep Arslan',
    role: 'Proje Yöneticisi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    bio: 'Agile proje yönetimi ve müşteri ilişkileri uzmanı',
    department: 'management',
    skills: ['Agile', 'Scrum', 'Müşteri İlişkileri'],
  },
  {
    name: 'Can Öztürk',
    role: 'Backend Geliştirici',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    bio: 'Mikroservis mimarisi ve veritabanı optimizasyonu uzmanı',
    department: 'engineering',
    skills: ['Node.js', 'PostgreSQL', 'Microservices'],
  },
  {
    name: 'Elif Yıldız',
    role: 'UI/UX Tasarımcı',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Kullanıcı deneyimi ve arayüz tasarımı uzmanı',
    department: 'design',
    skills: ['Figma', 'User Research', 'Prototyping'],
  },
  {
    name: 'Burak Şahin',
    role: 'Frontend Geliştirici',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Modern web teknolojileri ve performans optimizasyonu uzmanı',
    department: 'engineering',
    skills: ['React', 'TypeScript', 'Performance'],
  },
  {
    name: 'Selin Aydın',
    role: 'Pazarlama Yöneticisi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    bio: 'Dijital pazarlama ve marka stratejisi uzmanı',
    department: 'marketing',
    skills: ['SEO', 'Content Marketing', 'Analytics'],
  },
  {
    name: 'Emre Koç',
    role: 'DevOps Mühendisi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    bio: 'CI/CD ve cloud infrastructure uzmanı',
    department: 'engineering',
    skills: ['Docker', 'Kubernetes', 'AWS'],
  },
  {
    name: 'Deniz Aktaş',
    role: 'İçerik Yöneticisi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    bio: 'Content strategy ve copywriting uzmanı',
    department: 'marketing',
    skills: ['Copywriting', 'Content Strategy', 'SEO'],
  },
  {
    name: 'Barış Özkan',
    role: 'Mobil Geliştirici',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'iOS ve Android uygulama geliştirme uzmanı',
    department: 'engineering',
    skills: ['React Native', 'Swift', 'Kotlin'],
  },
  {
    name: 'Gizem Erdoğan',
    role: 'Grafik Tasarımcı',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    bio: 'Brand identity ve visual design uzmanı',
    department: 'design',
    skills: ['Illustrator', 'Photoshop', 'Brand Design'],
  },
  {
    name: 'Oğuz Yıldırım',
    role: 'İş Geliştirme Müdürü',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
    bio: 'B2B satış ve ortaklık geliştirme uzmanı',
    department: 'business',
    skills: ['B2B Sales', 'Partnerships', 'Strategy'],
  },
  {
    name: 'Merve Çelik',
    role: 'Müşteri İlişkileri Uzmanı',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop',
    bio: 'Customer success ve account management uzmanı',
    department: 'business',
    skills: ['Customer Success', 'CRM', 'Communication'],
  },
];

const departments = [
  { id: 'all', label: 'Tümü', color: 'primary' },
  { id: 'leadership', label: 'Liderlik', color: 'purple' },
  { id: 'engineering', label: 'Mühendislik', color: 'blue' },
  { id: 'design', label: 'Tasarım', color: 'pink' },
  { id: 'marketing', label: 'Pazarlama', color: 'green' },
  { id: 'business', label: 'İş Geliştirme', color: 'orange' },
  { id: 'management', label: 'Yönetim', color: 'cyan' },
];

export default function TeamModern() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const filteredMembers =
    selectedDepartment === 'all'
      ? teamMembers
      : teamMembers.filter((member) => member.department === selectedDepartment);

  return (
    <div>
      {/* Department Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDepartment(dept.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedDepartment === dept.id
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-dark-light text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark'
            }`}
          >
            {dept.label} ({teamMembers.filter((m) => dept.id === 'all' || m.department === dept.id).length})
          </button>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member, index) => (
          <motion.div
            key={member.name}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
          >
            {/* Card */}
            <div className="relative bg-white dark:bg-dark-light rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              {/* Avatar with Gradient Border */}
              <div className="relative p-6 pb-0">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-500" />
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="relative w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex space-x-3">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 pt-0">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {member.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Department Badge */}
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                  <Award className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Bu departmanda henüz ekip üyesi bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
}
