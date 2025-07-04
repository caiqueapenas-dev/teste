import React from 'react';
import { Totals } from '../../types';

interface BudgetFooterProps {
  totals: Totals;
  serviceType: 'recorrente' | 'avulso';
  discountApplied: boolean;
  onViewBudget: () => void;
  formatCurrency: (value: number) => string;
}

const BudgetFooter: React.FC<BudgetFooterProps> = ({
  totals,
  serviceType,
  discountApplied,
  onViewBudget,
  formatCurrency
}) => {
  if (totals.cartIsEmpty) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-600 z-40">
      <div className="container mx-auto p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-grow space-y-1 text-center sm:text-left">
          {discountApplied ? (
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
              <div>
                <span className="text-slate-400 text-sm">Total: </span>
                <span className="font-semibold text-white text-lg line-through">
                  {formatCurrency(totals.originalFirstMonthPayment)}
                </span>
              </div>
              <div>
                <span className="text-green-400 text-sm">Desconto: </span>
                <span className="font-semibold text-green-400 text-lg">
                  -{formatCurrency(totals.discountAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Novo Total: </span>
                <span className="font-semibold text-white text-lg">
                  {formatCurrency(totals.finalFirstMonthPayment)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-1">
              <div>
                <span className="text-slate-400 text-sm">Pagamento Inicial: </span>
                <span className="font-semibold text-white text-lg">
                  {formatCurrency(totals.originalFirstMonthPayment)}
                </span>
              </div>
              {serviceType === 'recorrente' && totals.monthlyTotal > 0 && (
                <div>
                  <span className="text-slate-400 text-sm">Mensalidade: </span>
                  <span className="font-semibold text-white text-lg">
                    {formatCurrency(totals.monthlyTotal)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={onViewBudget}
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        >
          Ver Orçamento Final
        </button>
      </div>
    </footer>
  );
};

export default BudgetFooter;