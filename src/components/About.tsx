import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Clock, Target } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Users, number: '5000+', label: 'Clientes Atendidos' },
    { icon: Award, number: '10+', label: 'Anos de Experiência' },
    { icon: Clock, number: '24h', label: 'Suporte Disponível' },
    { icon: Target, number: '98%', label: 'Satisfação dos Clientes' }
  ];

  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Sobre a Efika Corretora
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Fundada com o propósito de democratizar o acesso a seguros de qualidade, 
              a Efika Corretora se estabeleceu como referência no mercado nacional.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nossa missão é oferecer proteção completa e tranquilidade para nossos clientes, 
              sejam pessoas físicas ou jurídicas, através de soluções personalizadas e 
              atendimento humanizado.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Consultoria especializada e gratuita</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Parcerias com as principais seguradoras</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Atendimento personalizado e humanizado</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Suporte contínuo durante toda a vigência</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Equipe Efika Corretora"
              className="rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
