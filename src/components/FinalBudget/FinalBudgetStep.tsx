import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import { Cart, UserData, Totals } from '../../types';
import FinalCartItem from './FinalCartItem';
import DiscountModal from '../Modals/DiscountModal';
import { services } from '../../data/services';

interface FinalBudgetStepProps {
  cart: Cart;
  userData: UserData;
  totals: Totals;
  serviceType: 'recorrente' | 'avulso';
  discountApplied: boolean;
  onCartUpdate: (serviceId: string, quantity: number) => void;
  onBack: () => void;
  onApplyDiscount: () => void;
  onCancelOrder: () => void;
  formatCurrency: (value: number) => string;
  findServiceById: (id: string) => any;
  calculateItemSubtotal: (service: any, quantity: number) => number;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const FinalBudgetStep: React.FC<FinalBudgetStepProps> = ({
  cart,
  userData,
  totals,
  serviceType,
  discountApplied,
  onCartUpdate,
  onBack,
  onApplyDiscount,
  onCancelOrder,
  formatCurrency,
  findServiceById,
  calculateItemSubtotal,
  showToast
}) => {
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const formatBudgetDetails = () => {
    let message = `*DADOS DO CLIENTE:*\n`;
    message += `Nome: ${userData.name || 'Não informado'}\n`;
    message += `E-mail: ${userData.email || 'Não informado'}\n`;
    message += `Celular: ${userData.phone || 'Não informado'}\n`;
    message += `Instagram: ${userData.instagram || 'Não informado'}\n`;
    message += `Área de Atuação: ${userData.field || 'Não informado'}\n\n`;
    message += `*SERVIÇOS SOLICITADOS (${serviceType === 'recorrente' ? 'Plano Recorrente' : 'Serviço Avulso'}):*\n`;

    Object.entries(cart).sort((a,b) => a[0].localeCompare(b[0])).forEach(([id, value]) => {
      let service, itemTotal, name;
      if (id === 'trafego_investimento_custom') {
        service = { name: 'Investimento em Anúncios' };
        itemTotal = value;
        name = service.name;
      } else {
        service = findServiceById(id);
        itemTotal = calculateItemSubtotal(service, value);
        name = service.type === 'quantity' ? `${service.name} (Qtd: ${value})` : service.name;
      }
      message += `- ${name}: ${formatCurrency(itemTotal)}\n`;
    });

    message += `\n*RESUMO DO ORÇAMENTO:*\n`;
    if (discountApplied) {
      const discountTerm = serviceType === 'recorrente' ? 'no valor total do primeiro mês.' : 'no valor total.';
      message += `*OFERTA ESPECIAL APLICADA (50% OFF ${discountTerm})*\n\n`;
      message += `Subtotal: ${formatCurrency(totals.originalFirstMonthPayment)}\n`;
      message += `Desconto (50%): -${formatCurrency(totals.discountAmount)}\n`;
      message += `--------------------------------\n`;
      message += `*Total a Pagar:* ${formatCurrency(totals.finalFirstMonthPayment)}\n`;
    } else {
      message += `*Pagamento Inicial:* ${formatCurrency(totals.originalFirstMonthPayment)}\n`;
    }

    if (serviceType === 'recorrente' && totals.monthlyTotal > 0) {
      message += `*Mensalidade (a partir do 2º mês):* ${formatCurrency(totals.monthlyTotal)}`;
    }
    return message;
  }

  const saveBudgetToDatabase = async () => {
    const budgetDetails = formatBudgetDetails();
    try {
      await fetch('/api/save-budget.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userData.email, budgetDetails }),
      });
    } catch (error) {
      console.error('Erro ao salvar o orçamento:', error);
    }
  };

  useEffect(() => {
    if (!totals.cartIsEmpty) {
      saveBudgetToDatabase();
    }
  }, []);


  const sendToWhatsApp = () => {
    const message = formatBudgetDetails();
    const whatsappUrl = `https://wa.me/5575981865878?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCancelOrder = () => {
    if (discountApplied) return;
    setShowDiscountModal(true);
  };

  const handleDiscountAccept = () => {
    onApplyDiscount();
    setShowDiscountModal(false);
    showToast('Desconto de 50% aplicado!', 'success');
  };

  const handleDiscountReject = () => {
    setShowDiscountModal(false);
    onCancelOrder();
  };

  // Separate items by billing type
  const oneTimeItems: any[] = [];
  const recurringItems: any[] = [];

  Object.entries(cart).forEach(([id, value]) => {
    if (value === 0) return;
    
    let isMonthly;
    if (id === 'trafego_investimento_custom') {
      isMonthly = serviceType === 'recorrente';
    } else {
      const service = findServiceById(id);
      if (!service) return;
      isMonthly = serviceType === 'recorrente' && 
        (service.billing === 'monthly' || service.type === 'quantity');
    }

    const itemData = { id, value };
    if (isMonthly) {
      recurringItems.push(itemData);
    } else {
      oneTimeItems.push(itemData);
    }
  });

  if (totals.cartIsEmpty) {
    return (
      <div className="animate-in fade-in duration-600">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Seu Orçamento
        </h2>
        <div className="bg-slate-800 p-8 rounded-xl max-w-3xl mx-auto text-center">
          <p className="text-slate-400 text-lg mb-6">Seu orçamento está vazio.</p>
          <button
            onClick={onBack}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar e adicionar serviços
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-600">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Seu Orçamento Personalizado está Pronto!
      </h2>
      
      <div className="bg-slate-800 p-6 lg:p-8 rounded-xl max-w-4xl mx-auto">
        <div className="space-y-6 mb-6">
          {oneTimeItems.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-blue-300 border-b border-slate-600 pb-2 mb-4">
                Custos de Setup (Pagamento Único)
              </h4>
              <div className="space-y-3">
                {oneTimeItems.map(({ id, value }) => (
                  <FinalCartItem
                    key={id}
                    serviceId={id}
                    quantity={value}
                    serviceType={serviceType}
                    onUpdate={onCartUpdate}
                    formatCurrency={formatCurrency}
                    findServiceById={findServiceById}
                    calculateItemSubtotal={calculateItemSubtotal}
                  />
                ))}
              </div>
            </div>
          )}

          {recurringItems.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-blue-300 border-b border-slate-600 pb-2 mb-4">
                Custos Mensais Recorrentes
              </h4>
              <div className="space-y-3">
                {recurringItems.map(({ id, value }) => (
                  <FinalCartItem
                    key={id}
                    serviceId={id}
                    quantity={value}
                    serviceType={serviceType}
                    onUpdate={onCartUpdate}
                    formatCurrency={formatCurrency}
                    findServiceById={findServiceById}
                    calculateItemSubtotal={calculateItemSubtotal}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {(() => {
          const totalPosts = Object.entries(cart).reduce((total, [id, quantity]) => {
            const serviceInfo = services
              .flatMap(cat => cat.items.map(item => ({...item, categoryName: cat.category})))
              .find(item => item.id === id);

            if (serviceInfo && serviceInfo.type === 'quantity' && (serviceInfo.categoryName === 'Criação de Artes Gráficas' || serviceInfo.categoryName === 'Edição de Vídeo')) {
              return total + quantity;
            }
            return total;
          }, 0);

          if (serviceType === 'recorrente' && totalPosts > 0) {
            const averageWeekly = (totalPosts / 4).toFixed(1).replace('.0', '');
            return (
              <div className="my-6 text-center bg-slate-900/50 p-4 rounded-lg border border-blue-500/30">
                <h4 className="text-lg font-bold text-blue-300 mb-1">Resumo de Conteúdo Contratado</h4>
                <p className="text-white text-xl">
                  Total de <span className="font-bold">{averageWeekly} posts</span> por semana, em média.
                </p>
              </div>
            );
          }
          return null;
        })()}
        {/* Totals */}
        <div className="border-t-2 border-slate-600 pt-6 space-y-3">
          {discountApplied ? (
            <>
              <div className="text-center text-green-400 text-sm mb-4">
                {serviceType === 'recorrente' 
                  ? 'Desconto de 50% aplicado no valor total do primeiro mês.' 
                  : 'Desconto de 50% aplicado no valor total.'}
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-slate-300">Subtotal:</span>
                <span className="font-semibold text-white">
                  {formatCurrency(totals.originalFirstMonthPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-green-400">Desconto (50%):</span>
                <span className="font-semibold text-green-400">
                  -{formatCurrency(totals.discountAmount)}
                </span>
              </div>
              <div className="border-t border-slate-600 my-3"></div>
              <div className="flex justify-between items-center text-xl">
                <span className="font-bold text-slate-300">Total a Pagar:</span>
                <span className="font-bold text-blue-400">
                  {formatCurrency(totals.finalFirstMonthPayment)}
                </span>
              </div>
              {serviceType === 'recorrente' && totals.monthlyTotal > 0 && (
                <div className="flex justify-between items-center text-lg mt-2">
                  <span className="font-semibold text-slate-300">
                    Mensalidade (a partir do 2º mês):
                  </span>
                  <span className="font-bold text-white">
                    {formatCurrency(totals.monthlyTotal)}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center text-xl">
                <span className="font-semibold text-slate-300">Valor Inicial a Pagar:</span>
                <span className="font-bold text-blue-400">
                  {formatCurrency(totals.originalFirstMonthPayment)}
                </span>
              </div>
              {serviceType === 'recorrente' && totals.monthlyTotal > 0 && (
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-slate-300">
                    Cobrança Mensal Recorrente:
                  </span>
                  <span className="font-bold text-white">
                    {formatCurrency(totals.monthlyTotal)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-3 mt-8">
          <button
            onClick={sendToWhatsApp}
            className="w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Finalizar e Enviar no WhatsApp
          </button>
          
          <button
            onClick={onBack}
            className="w-full text-slate-400 font-semibold py-3 rounded-lg hover:bg-slate-700 transition-colors"
          >
            ← Voltar e editar serviços
          </button>
          
          {!discountApplied && (
            <button
              onClick={handleCancelOrder}
              className="w-full text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors py-2 rounded-lg"
            >
              Cancelar Pedido
            </button>
          )}
        </div>
      </div>

      <DiscountModal
        isOpen={showDiscountModal}
        onAccept={handleDiscountAccept}
        onReject={handleDiscountReject}
        serviceType={serviceType}
      />
    </div>
  );
};

export default FinalBudgetStep;