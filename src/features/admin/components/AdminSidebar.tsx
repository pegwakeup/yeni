import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Users, LogOut, X, Briefcase,
  Image
} from 'lucide-react';
import { signOut } from '../lib/auth';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const sidebarLinks = [
  { icon: FileText, label: 'Blog Yönetimi', href: '/admin/blog' },
  { icon: Image, label: 'Portfolyo', href: '/admin/portfolio' },
  { icon: Users, label: 'Freelancerlar', href: '/admin/freelancers' },
  { icon: Briefcase, label: 'Proje Talepleri', href: '/admin/project-requests' },
];

const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  // Hover edince masaüstü kapalı sidebar'ı açmak istiyorsanız (opsiyonel)
  useEffect(() => {
    if (isHovered && !isOpen) {
      onToggle();
    }
  }, [isHovered, isOpen, onToggle]);

  return (
    <>
      {/* Masaüstü Sidebar */}
      <motion.div 
        className="fixed top-0 left-0 h-full hidden lg:flex flex-col bg-dark-light/95 backdrop-blur-sm border-r border-white/10 z-50"
        animate={{
          width: isOpen ? '320px' : '96px',
          transition: { duration: 0.3, ease: 'easeInOut' },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (isOpen) onToggle();
        }}
      >
        {/* Arkaplan Deseni */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] opacity-50" />

        {/* Logo */}
        <Link to="/" className="relative">
          <div className="p-6 border-b border-white/10 flex items-center justify-center">
            {isOpen ? (
              <motion.img 
                key="full-logo"
                src="/images/Unilancer logo 2.png" 
                alt="Unilancer"
                className="h-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              <motion.img 
                key="icon-logo"
                src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/blog-images//Unilancer%20icon-01-03.png"
                alt="Unilancer"
                className="h-12 w-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
        </Link>

        {/* Linkler */}
        <nav className="relative flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="group flex items-center rounded-xl transition-all overflow-hidden relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[calc(100%-16px)] bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="flex-shrink-0 w-[72px] h-[72px] p-2">
                  <div 
                    className={`
                      w-full h-full rounded-xl flex items-center justify-center transition-all duration-200
                      ${isActive ? 'bg-primary/20' : 'bg-white/5 group-hover:bg-white/10'}
                    `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <motion.span
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    width: isOpen ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden pr-4"
                >
                  {link.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* Çıkış Butonu */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Çıkış Yap</span>
          </button>
        </div>
      </motion.div>

      {/* Mobil Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onToggle}
            />

            {/* Sidebar İçeriği (Mobilde tam genişlik) */}
            <div className="absolute inset-y-0 left-0 w-full bg-dark-light/95 backdrop-blur-sm flex flex-col">
              <div className="relative flex flex-col h-full">
                {/* Üst Kısım */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <Link to="/">
                    <img
                      src="/images/Unilancer logo 2.png"
                      alt="Unilancer"
                      className="h-8"
                    />
                  </Link>
                  <button
                    onClick={onToggle}
                    className="p-3 hover:bg-white/5 rounded-lg transition-colors"
                    aria-label="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Linkler */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={onToggle}
                        className="group flex items-center space-x-3 p-4 rounded-xl transition-all relative"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[calc(100%-16px)] bg-primary rounded-r-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <div
                          className={`w-[72px] h-[72px] rounded-xl flex items-center justify-center transition-all duration-200 ${
                            isActive
                              ? 'bg-primary/20'
                              : 'bg-white/5 group-hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-base font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Çıkış Butonu */}
                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors group"
                  >
                    <div className="w-[72px] h-[72px] bg-red-500/10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:bg-red-500/20">
                      <LogOut className="w-6 h-6" />
                    </div>
                    <span className="text-base font-medium">Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
