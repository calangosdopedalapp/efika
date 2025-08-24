import React from 'react';
import { motion } from 'framer-motion';
import { Heart, User, Building, Shield, Check, Star } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Heart,
      title: 'Seguro Saúde',
      description: 'Planos de saúde individuais e familiares com a melhor rede credenciada.',
      features: ['Cobertura nacional', 'Sem carência em emergências', 'Telemedicina incluída'],
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: User,
      title: 'Seguro de Vida',
      description: 'Proteção financeira para você e sua família em todos os momentos.',
      features: ['Indenização garantida', 'Assistência funeral', 'Cobertura de acidentes'],
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Building,
      title: 'Seguro Empresarial',
      description: 'Soluções completas para proteger seu negócio e seus colaboradores.',
      features: ['Responsabilidade civil', 'Proteção patrimonial', 'Seguro de equipamentos'],
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma gama completa de soluções em seguros, sempre com foco na sua tranquilidade e proteção.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`${service.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                <service.icon className={`h-8 w-8 ${service.color}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Solicitar Cotação
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white"
        >
          <Shield className="h-12 w-12 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Por que escolher a Efika?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 mb-3" />
              <h4 className="text-xl font-semibold mb-2">Excelência</h4>
              <p className="text-blue-100">Atendimento de qualidade superior</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-8 w-8 mb-3" />
              <h4 className="text-xl font-semibold mb-2">Personalização</h4>
              <p className="text-blue-100">Soluções feitas sob medida</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 mb-3" />
              <h4 className="text-xl font-semibold mb-2">Confiança</h4>
              <p className="text-blue-100">10+ anos protegendo famílias</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
