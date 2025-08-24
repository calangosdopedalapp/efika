import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Lock, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SetupFormData {
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  password: string;
  confirmPassword: string;
}

const FirstSetupForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SetupFormData>();

  const password = watch('password');

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

  const onSubmit = async (data: SetupFormData) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await signUp({
        email: data.email,
        password: data.password,
        nome_completo: data.nome_completo,
        cpf: data.cpf.replace(/\D/g, ''),
        role: 'super_admin'
      });

      if (error) {
        setError(error.message || 'Erro ao criar conta');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistema Configurado!</h2>
          <p className="text-gray-600 mb-6">
            Sua conta de Super Admin foi criada com sucesso. 
            Você será redirecionado para o dashboard em instantes.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Primeira Configuração</h2>
          <p className="text-gray-600 mt-2">
            Configure o sistema criando a conta de Super Administrador
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('nome_completo', {
                  required: 'Nome completo é obrigatório',
                  minLength: {
                    value: 3,
                    message: 'Nome deve ter pelo menos 3 caracteres'
                  }
                })}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>
            {errors.nome_completo && (
              <p className="mt-1 text-sm text-red-600">{errors.nome_completo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('email', {
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Digite um e-mail válido'
                  }
                })}
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@efikaseguros.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF *
            </label>
            <input
              {...register('cpf', {
                required: 'CPF é obrigatório',
                pattern: {
                  value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                  message: 'Digite um CPF válido'
                }
              })}
              type="text"
              onChange={(e) => {
                e.target.value = formatCPF(e.target.value);
              }}
              maxLength={14}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="000.000.000-00"
            />
            {errors.cpf && (
              <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('telefone')}
                type="text"
                onChange={(e) => {
                  e.target.value = formatPhone(e.target.value);
                }}
                maxLength={15}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('password', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 8,
                    message: 'Senha deve ter pelo menos 8 caracteres'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Senha deve conter pelo menos: 1 minúscula, 1 maiúscula e 1 número'
                  }
                })}
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sua senha segura"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('confirmPassword', {
                  required: 'Confirmação de senha é obrigatória',
                  validate: (value) => value === password || 'Senhas não coincidem'
                })}
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirme sua senha"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {loading ? 'Configurando Sistema...' : 'Configurar Sistema'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Esta conta terá acesso total ao sistema. 
            Mantenha suas credenciais seguras.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FirstSetupForm;
