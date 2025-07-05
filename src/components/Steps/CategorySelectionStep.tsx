import React from 'react';
import { ArrowLeft, ArrowRight, Lock, RefreshCw } from 'lucide-react';
import { services } from '../../data/services';

interface CategorySelectionStepProps {
  serviceType: 'recorrente' | 'avulso';
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  onServiceTypeChange: (type: 'recorrente' | 'avulso') => void;
  onNext: () => void;
  onPrev: () => void;
}

const CategorySelectionStep: React.FC<CategorySelectionStepProps> = ({
  serviceType,
  selectedCategories,
  onCategoriesChange,
  onServiceTypeChange,
  onNext,
  onPrev
}) => {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const switchToRecurring = () => {
    onServiceTypeChange('recorrente');
  };

  return (
    <div className="animate-in fade-in duration-600">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Quais serviços você está buscando?
      </h2>
      <p className="text-slate-400 text-center mb-12 text-lg">
        Selecione uma ou mais opções para personalizar seu plano.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {services.map((category) => {
          const isAvailable = serviceType === 'avulso' 
            ? category.items.some(item => item.billing === 'once') 
            : true;
          const isSelected = selectedCategories.includes(category.category);

          return (
            <div key={category.category} className="relative">
              <button
                onClick={() => isAvailable && toggleCategory(category.category)}
                disabled={!isAvailable}
                className={`w-full bg-slate-800 p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  isAvailable
                    ? `cursor-pointer hover:border-blue-500 hover:bg-slate-700 ${
                        isSelected ? 'border-blue-500 bg-slate-700' : 'border-transparent'
                      }`
                    : 'cursor-not-allowed opacity-60'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  {category.category}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {category.description}
                </p>
              </button>

              {!isAvailable && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl p-6 text-center">
                  <div className="p-3 bg-blue-500/20 rounded-lg mb-4">
                    <Lock className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300 mb-4">
                    Disponível no Plano Recorrente
                  </p>
                  <button
                    onClick={switchToRecurring}
                    className="flex items-center gap-2 bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Mudar para Recorrente
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      
    </div>
  );
};

export default CategorySelectionStep;