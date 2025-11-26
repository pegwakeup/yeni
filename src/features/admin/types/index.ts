// Common types used across admin features
export interface AdminLayoutProps {
  children: React.ReactNode;
}

export interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AdminStatsCard {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}