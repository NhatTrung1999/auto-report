import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-lg transition duration-200 
      ${
        active
          ? 'bg-gray-700 text-white font-semibold shadow-md'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

export default SidebarItem;
