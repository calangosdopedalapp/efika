import React from 'react';
import { Shield, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Efika Corretora</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Protegendo o que mais importa para você há mais de 10 anos. 
              Somos especializados em seguros de saúde, vida e empresarial.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Seguro Saúde</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seguro de Vida</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seguro Empresarial</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Consultoria</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@efikacorretora.com.br</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Av. Paulista, 1000 - São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Efika Corretora de Seguros. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
