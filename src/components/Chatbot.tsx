import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Phone, Mail } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface UserData {
  nome?: string;
  email?: string;
  telefone?: string;
  interesse?: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState('initial');
  const [userData, setUserData] = useState<UserData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage('Olá! 👋 Sou a assistente virtual da Efika Corretora. Como posso ajudá-lo hoje?');
        setTimeout(() => {
          addBotMessage('Escolha uma das opções abaixo ou digite sua dúvida:');
          setCurrentStep('menu');
        }, 1000);
      }, 500);
    }
  }, [isOpen]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (text: string) => {
    setTimeout(() => {
      addMessage(text, 'bot');
    }, 500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    handleUserResponse(inputValue);
    setInputValue('');
  };

  const handleQuickReply = (option: string) => {
    addMessage(option, 'user');
    handleUserResponse(option);
  };

  const handleUserResponse = (response: string) => {
    const lowerResponse = response.toLowerCase();

    switch (currentStep) {
      case 'menu':
        if (lowerResponse.includes('saúde')) {
          addBotMessage('Excelente! Nossos planos de saúde oferecem cobertura completa com a melhor rede credenciada. Para uma cotação personalizada, preciso de alguns dados.');
          setCurrentStep('collect_name');
          setTimeout(() => {
            addBotMessage('Qual é o seu nome?');
          }, 1000);
        } else if (lowerResponse.includes('vida')) {
          addBotMessage('Ótima escolha! Nosso seguro de vida oferece proteção financeira completa para você e sua família.');
          setCurrentStep('collect_name');
          setTimeout(() => {
            addBotMessage('Para prosseguir, qual é o seu nome?');
          }, 1000);
        } else if (lowerResponse.includes('empresarial')) {
          addBotMessage('Perfeito! Temos soluções completas para proteger seu negócio. Vamos conversar sobre suas necessidades.');
          setCurrentStep('collect_name');
          setTimeout(() => {
            addBotMessage('Primeiro, como posso chamá-lo?');
          }, 1000);
        } else if (lowerResponse.includes('faq') || lowerResponse.includes('dúvidas')) {
          showFAQ();
        } else if (lowerResponse.includes('contato') || lowerResponse.includes('humano')) {
          showContact();
        } else {
          addBotMessage('Não entendi sua escolha. Por favor, selecione uma das opções disponíveis ou digite "menu" para ver as opções novamente.');
        }
        break;

      case 'collect_name':
        setUserData(prev => ({ ...prev, nome: response }));
        addBotMessage(`Prazer em conhecê-lo, ${response}! Agora preciso do seu e-mail para enviar a cotação.`);
        setCurrentStep('collect_email');
        break;

      case 'collect_email':
        if (response.includes('@')) {
          setUserData(prev => ({ ...prev, email: response }));
          addBotMessage('Perfeito! Agora seu telefone para contato:');
          setCurrentStep('collect_phone');
        } else {
          addBotMessage('Por favor, digite um e-mail válido.');
        }
        break;

      case 'collect_phone':
        setUserData(prev => ({ ...prev, telefone: response }));
        addBotMessage(`Obrigada, ${userData.nome}! Seus dados foram registrados. Um de nossos consultores entrará em contato em breve.`);
        setTimeout(() => {
          addBotMessage('Posso ajudar com mais alguma coisa? Digite "menu" para ver as opções ou "sair" para encerrar.');
        }, 1500);
        setCurrentStep('final');
        break;

      case 'final':
        if (lowerResponse.includes('menu')) {
          setCurrentStep('menu');
          addBotMessage('Como posso ajudá-lo?');
        } else if (lowerResponse.includes('sair')) {
          addBotMessage('Foi um prazer atendê-lo! Tenha um ótimo dia! 😊');
          setTimeout(() => {
            setIsOpen(false);
            setMessages([]);
            setCurrentStep('initial');
            setUserData({});
          }, 2000);
        } else {
          addBotMessage('Digite "menu" para ver as opções ou "sair" para encerrar o atendimento.');
        }
        break;

      default:
        if (lowerResponse.includes('menu')) {
          setCurrentStep('menu');
          addBotMessage('Como posso ajudá-lo?');
        } else {
          addBotMessage('Não entendi. Digite "menu" para ver as opções disponíveis.');
        }
    }
  };

  const showFAQ = () => {
    addBotMessage('Aqui estão as perguntas mais frequentes:');
    setTimeout(() => {
      addBotMessage('1. Como funciona o seguro saúde?\n2. Qual o prazo de carência?\n3. Posso incluir dependentes?\n4. Como acionar o seguro?');
    }, 1000);
    setTimeout(() => {
      addBotMessage('Digite o número da pergunta ou "menu" para voltar às opções principais.');
    }, 1500);
  };

  const showContact = () => {
    addBotMessage('Aqui estão nossos contatos para falar diretamente com um consultor:');
    setTimeout(() => {
      addBotMessage('📞 Telefone: (11) 9999-9999\n📧 E-mail: contato@efikacorretora.com.br\n📍 Endereço: Av. Paulista, 1000 - São Paulo, SP');
    }, 1000);
    setTimeout(() => {
      addBotMessage('Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Digite "menu" para voltar às opções.');
    }, 1500);
  };

  const getQuickReplies = () => {
    switch (currentStep) {
      case 'menu':
        return [
          '💊 Seguro Saúde',
          '💝 Seguro de Vida',
          '🏢 Seguro Empresarial',
          '❓ Dúvidas Frequentes',
          '👤 Falar com Consultor'
        ];
      default:
        return [];
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Assistente Efika</h3>
                  <p className="text-blue-100 text-sm">Online agora</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === 'bot' ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {getQuickReplies().length > 0 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {getQuickReplies().map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
