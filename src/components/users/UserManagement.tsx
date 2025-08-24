import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Profile, UserRole } from '../../lib/supabase';
import CreateUserModal from './CreateUserModal';

const UserManagement: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      await loadUsers();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const getRoleDisplay = (role: UserRole) => {
    const roles = {
      super_admin: 'Super Admin',
      admin: 'Administrador',
      corretor: 'Corretor',
      suporte: 'Suporte'
    };
    return roles[role];
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-purple-100 text-purple-800',
      corretor: 'bg-blue-100 text-blue-800',
      suporte: 'bg-green-100 text-green-800'
    };
    return colors[role];
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
              <p className="text-gray-600">Gerencie usuários e suas permissões</p>
            </div>
            {(profile?.role === 'super_admin' || profile?.role === 'admin') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Novo Usuário</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os níveis</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Administrador</option>
                  <option value="corretor">Corretor</option>
                  <option value="suporte">Suporte</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nível de Acesso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {user.nome_completo.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nome_completo}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {user.email}
                          </div>
                          {user.telefone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {user.telefone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleDisplay(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login ? 
                        new Date(user.last_login).toLocaleDateString('pt-BR') :
                        'Nunca'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          className={`p-1 rounded-full ${
                            user.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.is_active ? 'Desativar usuário' : 'Ativar usuário'}
                        >
                          {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button
                          className="text-blue-600 hover:bg-blue-50 p-1 rounded-full"
                          title="Editar usuário"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.role !== 'super_admin' && (
                          <button
                            className="text-red-600 hover:bg-red-50 p-1 rounded-full"
                            title="Excluir usuário"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || roleFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando o primeiro usuário'
              }
            </p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadUsers();
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
