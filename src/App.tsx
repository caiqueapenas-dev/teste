import React, { useState, useEffect } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useToast } from './hooks/useToast';
import WelcomeStep from './components/Steps/WelcomeStep';
import UserDataStep from './components/Steps/UserDataStep';
import ServiceTypeStep from './components/Steps/ServiceTypeStep';
import CategorySelectionStep from './components/Steps/CategorySelectionStep';
import ServiceConfigStep from './components/ServiceConfig/ServiceConfigStep';
import FinalBudgetStep from './components/FinalBudget/FinalBudgetStep';
import BudgetFooter from './components/BudgetSummary/BudgetFooter';
import ToastContainer from './components/Toast/ToastContainer';
import SessionRestoreModal from './components/SessionRestore/SessionRestoreModal';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentConfigIndex, setCurrentConfigIndex] = useState(0);
  const [showSessionRestore, setShowSessionRestore] = useState(false);
  // ADICIONE ESTE CÓDIGO
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
    const hasSession = loadSession();
    if (hasSession) {
      setShowSessionRestore(true);
    }
  }, [loadSession]);

  const navigateToStep = (step: number) => {
    setCurrentStep(step);
    if (step === 1) {
      clearSession();
    }
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
    setCurrentStep(0);
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
            onNext={() => setCurrentStep(2)}
            onPrev={() => setCurrentStep(0)}
          />
        );
      
      case 2:
        return (
          <ServiceTypeStep
            onServiceTypeSelect={handleServiceTypeSelect}
            onPrev={() => setCurrentStep(1)}
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-inter">
      <main className="container mx-auto px-6 lg:px-10 py-10 pb-32">
        {renderCurrentStep()}
      </main>

      {currentStep >= 3 && (
        <BudgetFooter
          totals={totals}
          serviceType={serviceType as 'recorrente' | 'avulso'}
          discountApplied={discountState.applied}
          onViewBudget={() => setCurrentStep(5)}
          formatCurrency={formatCurrency}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <SessionRestoreModal
        isOpen={showSessionRestore}
        onRestore={handleSessionRestore}
        onStartNew={handleStartNew}
      />
    </div>
  );
}

export default App;