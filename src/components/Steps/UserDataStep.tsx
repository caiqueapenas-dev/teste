import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail, Phone, Instagram, Briefcase } from 'lucide-react';
import { UserData } from '../../types';

interface UserDataStepProps {
  userData: UserData;
  onUserDataChange: (data: UserData) => void;
  onNext: () => void;
  onPrev: () => void;
}

const UserDataStep: React.FC<UserDataStepProps> = ({
  userData,
  onUserDataChange,
  onNext,
  onPrev
}) => {
  const [formData, setFormData] = useState<UserData>(userData);

  const handleInputChange = (field: keyof UserData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUserDataChange(updatedData);
  };

  const handlePhoneChange = (value: string) => {
    // Simple phone mask (00) 00000-0000
    let phone = value.replace(/\D/g, '');
    if (phone.length <= 11) {
      phone = phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      phone = phone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      phone = phone.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      handleInputChange('phone', phone);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone && formData.field) {
      onNext();
    }
  };

  const isValid = formData.name && formData.email && formData.phone && formData.field;

  return (
    <div className="max-w-xl mx-auto animate-in fade-in duration-600">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Primeiro, vamos nos conhecer.
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-600 text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-600 text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="tel"
            placeholder="Celular (com DDD)"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-600 text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <Instagram className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Seu Instagram (@usuario)"
            value={formData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Sua área de atuação (Ex: Nutricionista)"
            value={formData.field}
            onChange={(e) => handleInputChange('field', e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-600 text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDataStep;