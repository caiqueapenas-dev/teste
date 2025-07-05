import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import MarketingBudget from './pages/MarketingBudget';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/marketing-budget" element={<MarketingBudget />} />
    </Routes>
  );
}

export default App;