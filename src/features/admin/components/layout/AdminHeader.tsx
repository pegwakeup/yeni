import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Home, Menu } from 'lucide-react';
import { signOut } from '../../../../lib/auth';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-64 h-16 bg-dark-light border-b border-white/10 z-40">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link
            to="/"
            className="flex items-center space-x-2 px-4 py-2 bg-dark hover:bg-dark/80 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Ana Sayfa</span>
          </Link>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Çıkış Yap</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;