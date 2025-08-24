import React, { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Efika Corretora</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('servicos')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contato
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Área do Cliente
            </Link>
            <button
              onClick={() => scrollToSection('contato')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Solicitar Cotação
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t"
          >
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('inicio')}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('servicos')}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                Serviços
              </button>
              <button
                onClick={() => scrollToSection('sobre')}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection('contato')}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                Contato
              </button>
              <Link
                to="/login"
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Área do Cliente
              </Link>
              <button
                onClick={() => scrollToSection('contato')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Solicitar Cotação
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
