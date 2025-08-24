import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Building, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contato');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Proteja o que mais{' '}
              <span className="text-blue-600">importa</span> para você
            </h1>
            <p className="text-xl text-gray-600 mt-6 leading-relaxed">
              Na Efika Corretora, oferecemos soluções completas em seguros de saúde, vida e empresarial. 
              Com mais de 10 anos de experiência, garantimos a proteção ideal para cada necessidade.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={scrollToContact}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Solicitar Cotação Gratuita</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('servicos');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Conhecer Serviços
              </button>
            </div>

            <div className="flex items-center space-x-8 mt-12">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-green-500" />
                <span className="text-sm text-gray-600">100% Seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-500" />
                <span className="text-sm text-gray-600">Atendimento Humanizado</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-blue-500" />
                <span className="text-sm text-gray-600">Empresas e Pessoas</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Família protegida por seguros"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-blue-200 rounded-2xl -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-blue-100 rounded-2xl -z-20"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
