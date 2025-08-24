import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
