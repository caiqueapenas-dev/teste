import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCalculator } from '../hooks/useCalculator';
import { useToast } from '../hooks/useToast';
import WelcomeStep from '../components/Steps/WelcomeStep';
import UserDataStep from '../components/Steps/UserDataStep';
import ServiceTypeStep from '../components/Steps/ServiceTypeStep';
import CategorySelectionStep from '../components/Steps/CategorySelectionStep';
import ServiceConfigStep from '../components/ServiceConfig/ServiceConfigStep';
import FinalBudgetStep from '../components/FinalBudget/FinalBudgetStep';
import BudgetFooter from '../components/BudgetSummary/BudgetFooter';
import ToastContainer from '../components/Toast/ToastContainer';
import SessionRestoreModal from '../components/SessionRestore/SessionRestoreModal';

// O componente agora aceita a prop 'initialStep'
const MarketingBudget: React.FC<{ initialStep?: number }> = ({ initialStep = 0 }) => {
  // O estado inicial usa a prop ou o valor padrão 0
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [currentConfigIndex, setCurrentConfigIndex] = useState(0);
  const [showSessionRestore, setShowSessionRestore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentStep, currentConfigIndex]);

  const {
    cart,
    serviceType,
    selectedCategories,
    userData,
    discountState,
    totals,
    setServiceType,
    setSelectedCategories,
    setUserData,
    setDiscountState,
    updateCart,
    clearSession,
    loadSession,
    formatCurrency,
    findServiceById,
    calculateItemSubtotal
  } = useCalculator();

  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    // Só tenta restaurar a sessão se estiver na página inicial do orçamento
    if (initialStep === 0) {
      const hasSession = loadSession();
      if (hasSession) {
        setShowSessionRestore(true);
      }
    }
  }, [loadSession, initialStep]);

  const handleUserDataNext = () => {
    // A única responsabilidade agora é navegar. O App.tsx cuida do resto.
    navigate('/agradecimento');
  };

  const handleServiceTypeSelect = (type: 'recorrente' | 'avulso') => {
    setServiceType(type);
    setSelectedCategories([]);
    setCurrentStep(3);
  };

  const handleConfigNext = () => {
    if (currentConfigIndex < selectedCategories.length - 1) {
      setCurrentConfigIndex(currentConfigIndex + 1);
    } else {
      setCurrentStep(5);
    }
  };

  const handleConfigPrev = () => {
    if (currentConfigIndex > 0) {
      setCurrentConfigIndex(currentConfigIndex - 1);
    } else {
      setCurrentStep(3);
    }
  };

  const handleApplyDiscount = () => {
    setDiscountState({ applied: true, timerId: null });
  };

  const handleCancelOrder = () => {
    clearSession();
    // Volta para a página inicial
    navigate('/marketing-budget');
  };

  const handleSessionRestore = () => {
    setShowSessionRestore(false);
    if (Object.keys(cart).length > 0) {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
    showToast('Sessão restaurada com sucesso!', 'success');
  };

  const handleStartNew = () => {
    clearSession();
    setShowSessionRestore(false);
    setCurrentStep(0);
    navigate('/marketing-budget');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={() => setCurrentStep(1)} />;
      case 1:
        return (
          <UserDataStep
            userData={userData}
            onUserDataChange={setUserData}
            // Aqui passamos a nova função de navegação
            onNext={handleUserDataNext}
            onPrev={() => setCurrentStep(0)}
          />
        );
      case 2:
        return (
          <ServiceTypeStep
            onServiceTypeSelect={handleServiceTypeSelect}
            // Se o usuário voltar, ele deve ir para a página inicial do orçamento
            onPrev={() => navigate('/marketing-budget')}
          />
        );
      case 3:
        return (
          <CategorySelectionStep
            serviceType={serviceType as 'recorrente' | 'avulso'}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            onServiceTypeChange={setServiceType}
            onNext={() => {
              setCurrentConfigIndex(0);
              setCurrentStep(4);
            }}
            onPrev={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <ServiceConfigStep
            selectedCategories={selectedCategories}
            currentIndex={currentConfigIndex}
            cart={cart}
            serviceType={serviceType as 'recorrente' | 'avulso'}
            onCartUpdate={updateCart}
            onServiceTypeChange={setServiceType}
            onNext={handleConfigNext}
            onPrev={handleConfigPrev}
            formatCurrency={formatCurrency}
            calculateItemSubtotal={calculateItemSubtotal}
            showToast={showToast}
          />
        );
      case 5:
        return (
          <FinalBudgetStep
            cart={cart}
            userData={userData}
            totals={totals}
            serviceType={serviceType as 'recorrente' | 'avulso'}
            discountApplied={discountState.applied}
            onCartUpdate={updateCart}
            onBack={() => setCurrentStep(4)}
            onApplyDiscount={handleApplyDiscount}
            onCancelOrder={handleCancelOrder}
            formatCurrency={formatCurrency}
            findServiceById={findServiceById}
            calculateItemSubtotal={calculateItemSubtotal}
            showToast={showToast}
          />
        );
      default:
        return <WelcomeStep onNext={() => setCurrentStep(1)} />;
    }
  };
  
  const renderFooter = () => {
    if (currentStep === 3) {
      return (
        <BudgetFooter
          onPrev={() => setCurrentStep(2)}
          onNext={() => {
            setCurrentConfigIndex(0);
            setCurrentStep(4);
          }}
          isNextDisabled={selectedCategories.length === 0}
          nextLabel="Continuar"
        />
      );
    }
    if (currentStep === 4) {
      const isLastStep = currentConfigIndex === selectedCategories.length - 1;
      return (
        <BudgetFooter
          onPrev={handleConfigPrev}
          onNext={handleConfigNext}
          isNextDisabled={false}
          nextLabel={isLastStep ? 'Ver Orçamento Final' : 'Próximo'}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-inter">
      <main className="container mx-auto px-6 lg:px-10 py-10 pb-40">
        {renderCurrentStep()}
      </main>

      {renderFooter()}

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <SessionRestoreModal
        isOpen={showSessionRestore}
        onRestore={handleSessionRestore}
        onStartNew={handleStartNew}
      />
    </div>
  );
}

export default MarketingBudget;