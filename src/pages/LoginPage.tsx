import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Shield } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="flex items-center space-x-2 mb-8">
        <Shield className="h-10 w-10 text-blue-600" />
        <span className="text-3xl font-bold text-gray-900">Efika Seguros</span>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
