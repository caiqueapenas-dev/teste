import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="text-white">
      {/* Header */}
      <header className="text-center py-16">
        <h1 className="text-5xl font-bold">Carlos Henrique</h1>
        <h2 className="text-2xl text-slate-400 mt-4">Especialista em Marketing Digital e Tráfego Pago</h2>
        <button className="mt-8 bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors">
          Faça um orçamento sem compromisso
        </button>
      </header>

      {/* Sobre mim */}
      <section id="sobre" className="py-12">
        <h3 className="text-3xl font-bold text-center mb-8">Sobre Mim</h3>
        {/* Adicionar seu conteúdo aqui */}
      </section>

      {/* Portfólio */}
      <section id="portfolio" className="py-12 bg-slate-800">
        <h3 className="text-3xl font-bold text-center mb-8">Portfólio / Trabalhos / Cases</h3>
        {/* Adicionar seus trabalhos aqui */}
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-12">
        <h3 className="text-3xl font-bold text-center mb-8">Serviços Oferecidos</h3>
        {/* Adicionar seus serviços aqui */}
      </section>

      {/* Prova social */}
      <section id="depoimentos" className="py-12 bg-slate-800">
        <h3 className="text-3xl font-bold text-center mb-8">Prova Social</h3>
        {/* Adicionar depoimentos aqui */}
      </section>
      
      {/* Diferenciais */}
      <section id="diferenciais" className="py-12">
        <h3 className="text-3xl font-bold text-center mb-8">Diferenciais e Benefícios</h3>
        {/* Adicionar seus diferenciais aqui */}
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 bg-slate-800">
        <h3 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes (FAQ)</h3>
        {/* Adicionar FAQ aqui */}
      </section>

      {/* Redes Sociais */}
      <section id="redes" className="py-12">
          <h3 className="text-3xl font-bold text-center mb-8">Redes Sociais e Links</h3>
          {/* Adicionar links aqui */}
      </section>

      {/* Indicadores de Confiança */}
      <section id="confianca" className="py-12 text-center bg-blue-500/10">
          <h3 className="text-3xl font-bold text-center mb-8">Indicadores de Confiança</h3>
          <p>+100 clientes satisfeitos</p>
          {/* Adicionar selos e certificações */}
      </section>
      
      {/* Rodapé */}
      <footer className="text-center py-8 border-t border-slate-700">
        <p>&copy; {new Date().getFullYear()} Carlos Henrique. Todos os direitos reservados.</p>
        <p>
          <a href="/politica-de-privacidade" className="text-blue-400 hover:underline">Política de Privacidade</a> | 
          <a href="/termos-de-uso" className="text-blue-400 hover:underline"> Termos de Uso</a>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;