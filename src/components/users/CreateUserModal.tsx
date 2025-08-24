import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Phone, Shield, AlertCircle } from 'lucide-react';
import { supabase, UserRole } from '../../lib/supabase';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateUserFormData {
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  role: UserRole;
  password: string;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateUserFormData>({
    defaultValues: {
      role: 'corretor'
    }
  });

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const onSubmit = async (data: CreateUserFormData) => {
    setLoading(true);
    setError('');
    try {
      const { error: functionError } = await supabase.functions.invoke('create-user', {
        body: {
          email: data.email,
          password: data.password,
          nome_completo: data.nome_completo,
          cpf: data.cpf,
          telefone: data.telefone,
          role: data.role,
        },
      });

      if (functionError) {
        console.error('Erro na Edge Function:', functionError);
        const message = functionError.context?.msg || functionError.message || 'Erro ao criar usuário. Verifique se a Edge Function foi implantada corretamente.';
        throw new Error(message);
      }
      
      reset();
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Criar Novo Usuário</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('nome_completo', { required: 'Nome é obrigatório' })}
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do usuário"
                  />
                </div>
                {errors.nome_completo && <p className="mt-1 text-sm text-red-600">{errors.nome_completo.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('email', { required: 'E-mail é obrigatório', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' } })}
                    type="email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="usuario@email.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                <input
                  {...register('cpf', { required: 'CPF é obrigatório' })}
                  type="text"
                  onChange={(e) => { e.target.value = formatCPF(e.target.value); }}
                  maxLength={14}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="000.000.000-00"
                />
                {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('telefone')}
                    type="text"
                    onChange={(e) => { e.target.value = formatPhone(e.target.value); }}
                    maxLength={15}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Acesso *</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    {...register('role', { required: 'Nível de acesso é obrigatório' })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="corretor">Corretor</option>
                    <option value="admin">Administrador</option>
                    <option value="suporte">Suporte</option>
                  </select>
                </div>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha Provisória *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('password', { required: 'Senha é obrigatória', minLength: { value: 8, message: 'Senha deve ter pelo menos 8 caracteres' } })}
                    type="password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Senha forte"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <div className="flex justify-end pt-4 space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Criando...' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateUserModal;
