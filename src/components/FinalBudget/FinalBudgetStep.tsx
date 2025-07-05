import React, { useState } from 'react';
import { ArrowLeft, Download, MessageCircle, X } from 'lucide-react';
import { Cart, UserData, Totals } from '../../types';
import FinalCartItem from './FinalCartItem';
import DiscountModal from '../Modals/DiscountModal';

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

  const generatePDF = () => {
    showToast('Gerando seu PDF...', 'info');
    try {
      // Import jsPDF dynamically
      import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF();

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor('#022b3a');
        doc.text('Orçamento Personalizado', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor('#8892b0');
        doc.setFont('helvetica', 'normal');
        const today = new Date();
        doc.text(`Gerado em: ${today.toLocaleDateString('pt-BR')}`, 105, 26, { align: 'center' });

        // Client data
        doc.setFontSize(12);
        doc.setTextColor('#022b3a');
        doc.setFont('helvetica', 'bold');
        doc.text('Dados do Cliente:', 14, 40);
        
        let yPos = 50;
        const clientInfo = [
          `Nome: ${userData.name || 'Não informado'}`,
          `E-mail: ${userData.email || 'Não informado'}`,
          `Celular: ${userData.phone || 'Não informado'}`,
          `Instagram: ${userData.instagram || 'Não informado'}`,
          `Área de Atuação: ${userData.field || 'Não informado'}`
        ];

        doc.setFontSize(10);
        doc.setTextColor('#172a45');
        doc.setFont('helvetica', 'normal');
        clientInfo.forEach(info => {
          doc.text(info, 14, yPos);
          yPos += 6;
        });

        // Services
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor('#022b3a');
        doc.setFont('helvetica', 'bold');
        doc.text('Serviços Contratados:', 14, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor('#172a45');
        doc.setFont('helvetica', 'normal');
        
        Object.entries(cart).forEach(([id, value]) => {
          let serviceName, totalValue;
          if (id === 'trafego_investimento_custom') {
            serviceName = 'Investimento em Anúncios';
            totalValue = formatCurrency(value);
          } else {
            const service = findServiceById(id);
            serviceName = service.type === 'quantity' ? `${service.name} (Qtd: ${value})` : service.name;
            totalValue = formatCurrency(calculateItemSubtotal(service, value));
          }
          doc.text(`• ${serviceName}: ${totalValue}`, 14, yPos);
          yPos += 6;
        });

        // Totals
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor('#022b3a');
        doc.setFont('helvetica', 'bold');
        doc.text('Resumo Financeiro:', 14, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor('#172a45');
        doc.setFont('helvetica', 'normal');
        
        if (discountApplied) {
          doc.text(`Subtotal: ${formatCurrency(totals.originalFirstMonthPayment)}`, 14, yPos);
          yPos += 6;
          doc.text(`Desconto (50%): -${formatCurrency(totals.discountAmount)}`, 14, yPos);
          yPos += 6;
          doc.setFont('helvetica', 'bold');
          doc.text(`Total a Pagar: ${formatCurrency(totals.finalFirstMonthPayment)}`, 14, yPos);
        } else {
          doc.text(`Total a Pagar: ${formatCurrency(totals.originalFirstMonthPayment)}`, 14, yPos);
        }

        if (serviceType === 'recorrente' && totals.monthlyTotal > 0) {
          yPos += 6;
          doc.text(`Mensalidade: ${formatCurrency(totals.monthlyTotal)}`, 14, yPos);
        }

        const fileName = `Orcamento-${userData.name.split(' ')[0] || 'Cliente'}-${today.toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
        doc.save(fileName);
        showToast('PDF gerado com sucesso!', 'success');
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showToast('Ocorreu um erro ao gerar o PDF.', 'error');
    }
  };

  const sendToWhatsApp = () => {
    let message = `Olá, Carlos! Gostaria de um orçamento.\n\n`;
    message += `*DADOS DO CLIENTE:*\n`;
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
  const oneTimeItems = [];
  const recurringItems = [];

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
            onClick={generatePDF}
            className="w-full flex items-center justify-center gap-3 bg-slate-700 text-slate-300 font-semibold py-3 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar Orçamento em PDF
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