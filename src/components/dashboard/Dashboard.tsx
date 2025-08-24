import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Shield, 
  TrendingUp, 
  FileText, 
  Bell,
  Calendar,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();

  const getRoleDisplay = (role: string) => {
    const roles = {
      super_admin: 'Super Administrador',
      admin: 'Administrador',
      corretor: 'Corretor',
      suporte: 'Suporte'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const stats = [
    {
      title: 'Clientes Ativos',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Apólices Ativas',
      value: '856',
      change: '+8%',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 125,430',
      change: '+23%',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Sinistros Pendentes',
      value: '12',
      change: '-5%',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentActivities = [
    { action: 'Novo cliente cadastrado', time: '2 min atrás', type: 'success' },
    { action: 'Apólice renovada', time: '15 min atrás', type: 'info' },
    { action: 'Sinistro reportado', time: '1 hora atrás', type: 'warning' },
    { action: 'Pagamento recebido', time: '2 horas atrás', type: 'success' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Bem-vindo, {profile?.nome_completo} - {getRoleDisplay(profile?.role || '')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Novo Cliente
              </button>
              <button className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} vs mês anterior</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Vendas Mensais</h2>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600">+23% este mês</span>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de vendas (Implementar com biblioteca de charts)</p>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Atividades Recentes</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Novo Cliente</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Shield className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">Nova Apólice</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Relatórios</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Agenda</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
