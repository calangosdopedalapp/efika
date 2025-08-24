import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!profile.is_active) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conta Desativada</h2>
          <p className="text-gray-600">
            Sua conta foi desativada. Entre em contato com o administrador.
          </p>
        </div>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta área.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
