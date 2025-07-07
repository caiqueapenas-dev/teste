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
  const [formData, setFormData] = useState<UserData>({
    ...userData,
    lgpdAccepted: false, // Adicionando o campo lgpd ao estado inicial
  });


  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUserDataChange(updatedData);
  };

const handlePhoneChange = (value: string) => {
    // Remove todos os caracteres não numéricos e limita a 11 dígitos.
    const onlyDigits = value.replace(/\D/g, '').slice(0, 11);
    const { length } = onlyDigits;

    if (length >= 11) {
      // Formata para celular com 11 dígitos: (XX) XXXXX-XXXX
      const masked = onlyDigits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      handleInputChange('phone', masked);
    } else {
      // Formata para telefone com 10 dígitos ou menos (enquanto digita): (XX) XXXX-XXXX
      let masked = onlyDigits.replace(/(\d{2})(\d*)/, '($1) $2');
      masked = masked.replace(/( \d{4})(\d*)/, '$1-$2');
      handleInputChange('phone', masked);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Primeiro, valida se o formulário está preenchido
  if (!isValid) {
    // Opcional: você pode adicionar um toast aqui para avisar o usuário
    return;
  }

  try {
    // A URL da sua API. Em ambiente de desenvolvimento, aponta para localhost.
    // Em produção (após o deploy), '/api/save-lead' usará o mesmo domínio do site.
    const apiUrl = '/api/save-lead.php';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Se a API retornar um erro (ex: 500), loga o erro, mas continua.
      const errorResult = await response.json();
      console.error('Falha ao salvar o lead, mas continuando o fluxo:', errorResult.message);
    } else {
      // Se a API retornar sucesso, loga a mensagem de sucesso.
      const successResult = await response.json();
      console.log('Lead salvo com sucesso!', successResult.message);
    }

  } catch (error) {
    // Se houver um erro de rede (ex: API offline), loga e continua.
    console.error('Erro de rede ao tentar salvar o lead. Verifique se a API está rodando.', error);
  } finally {
    // INDEPENDENTE do resultado da API, avança para o próximo passo.
    // A captura do lead não deve impedir o usuário de montar o orçamento.
    onNext();
  }
};

  const isValid = formData.name && formData.email && formData.phone && formData.field && formData.lgpdAccepted;

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

<div className="pt-2">
    <label className="flex items-center gap-3 cursor-pointer">
        <input
        type="checkbox"
        checked={formData.lgpdAccepted}
        onChange={(e) => handleInputChange('lgpdAccepted', e.target.checked)}
        required
        className="h-5 w-5 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-blue-500"
        />
        <span className="text-slate-400 text-sm">
        Ao continuar, você concorda em fornecer seus dados para contato, de acordo com a nossa <a href="/politica-de-privacidade" target="_blank" className="text-blue-400 hover:underline">Política de Privacidade</a>.
        </span>
    </label>
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