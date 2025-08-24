import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SetupPage from './pages/SetupPage';
import DashboardPage from './pages/admin/DashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';

// Layouts & Protected Routes
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  const { loading, isSystemInitialized, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        !isSystemInitialized 
          ? <Navigate to="/setup" replace /> 
          : user 
            ? <Navigate to="/admin/dashboard" replace />
            : <LandingPage />
      } />

      <Route path="/setup" element={
        !isSystemInitialized ? <SetupPage /> : <Navigate to="/login" replace />
      } />
      
      <Route path="/login" element={
        !user ? <LoginPage /> : <Navigate to="/admin/dashboard" replace />
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin', 'corretor', 'suporte']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <UserManagementPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* Fallback for any other route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
