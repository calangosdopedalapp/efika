import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, LogOut, Shield } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { signOut, profile } = useAuth();
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="w-64 bg-white border-r flex flex-col h-screen shadow-lg">
      <div className="flex items-center justify-center h-20 border-b">
        <Shield className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">Efika Admin</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/admin/dashboard" className={navLinkClasses}>
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>
        {(profile?.role === 'super_admin' || profile?.role === 'admin') && (
          <NavLink to="/admin/users" className={navLinkClasses}>
            <Users className="h-5 w-5 mr-3" />
            Usuários
          </NavLink>
        )}
      </nav>
      <div className="px-4 py-6 border-t">
        <button
          onClick={signOut}
          className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
