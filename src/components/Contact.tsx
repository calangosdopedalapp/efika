import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  tipoSeguro: string;
  mensagem: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    tipoSeguro: '',
    mensagem: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio do formulário
    console.log('Dados do formulário:', formData);
    setIsSubmitted(true);
    
    // Reset após 3 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        tipoSeguro: '',
        mensagem: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pronto para proteger o que mais importa? Nossa equipe está aqui para ajudar você 
            a encontrar a solução ideal em seguros.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Fale Conosco</h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Telefone</h4>
                  <p className="text-gray-600">(11) 9999-9999</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">E-mail</h4>
                  <p className="text-gray-600">contato@efikacorretora.com.br</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Endereço</h4>
                  <p className="text-gray-600">Av. Paulista, 1000 - São Paulo, SP</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Horário de Atendimento</h4>
              <p className="text-gray-600">Segunda a Sexta: 8h às 18h</p>
              <p className="text-gray-600">Sábado: 9h às 14h</p>
              <p className="text-gray-600">Emergências: 24h por dia</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Solicite sua Cotação</h3>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Mensagem Enviada!</h4>
                  <p className="text-gray-600">Entraremos em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      required
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label htmlFor="tipoSeguro" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Seguro de Interesse
                    </label>
                    <select
                      id="tipoSeguro"
                      name="tipoSeguro"
                      value={formData.tipoSeguro}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="saude">Seguro Saúde</option>
                      <option value="vida">Seguro de Vida</option>
                      <option value="empresarial">Seguro Empresarial</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={4}
                      value={formData.mensagem}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Conte-nos mais sobre suas necessidades..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <span>Enviar Mensagem</span>
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
