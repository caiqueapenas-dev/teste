import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import MarketingBudget from './pages/MarketingBudget';
import PoliticaDePrivacidade from './pages/PoliticaDePrivacidade';
import TermosDeUso from './pages/TermosDeUso';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Rota inicial do orçamento, começa no passo 0 */}
      <Route path="/marketing-budget" element={<MarketingBudget key="start" />} />
      
      {/* Rota para continuar após o formulário, começa no passo 2 */}
      <Route path="/agradecimento" element={<MarketingBudget key="continue" initialStep={2} />} />
      
      <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
      <Route path="/termos-de-uso" element={<TermosDeUso />} />
    </Routes>
  );
}

export default App;