import React, { useState } from 'react';
import './App.css';

// Importação dos componentes criados
import Header from './components/Header';
import CardContainer from './components/CardContainer';
import EquipamentoForm from './components/EquipamentoForm';
import EquipamentoLista from './components/EquipamentoLista';

function App() {
  // Estado inicial de equipamentos
  const [equipamentos, setEquipamentos] = useState([
    {
      id: 1,
      nome: 'Torno Mecânico Nardini',
      codigo: 'TOR-01',
      setor: 'Usinagem',
      criticidade: 'Alta',
      status: 'Operacional',
      dataCadastro: '28/10/2026'
    },
    {
      id: 2,
      nome: 'Compressor de Ar Schulz',
      codigo: 'CMP-02',
      setor: 'Utilidades',
      criticidade: 'Crítica',
      status: 'Em Manutenção',
      dataCadastro: '29/10/2026'
    },
    {
      id: 3,
      nome: 'Robô de Solda Yaskawa',
      codigo: 'SLD-05',
      setor: 'Soldagem',
      criticidade: 'Alta',
      status: 'Operacional',
      dataCadastro: '30/10/2026'
    }
  ]);

  // Handler para adicionar novo equipamento (recebido do EquipamentoForm via props)
  const handleAddEquipamento = (novoEquipamento) => {
    setEquipamentos((prev) => [novoEquipamento, ...prev]);
  };

  // Handler para alternar status entre Operacional e Em Manutenção
  const handleToggleStatus = (id) => {
    setEquipamentos((prev) =>
      prev.map((eq) =>
        eq.id === id
          ? {
              ...eq,
              status: eq.status === 'Operacional' ? 'Em Manutenção' : 'Operacional'
            }
          : eq
      )
    );
  };

  // Handler para deletar equipamento
  const handleDeleteEquipamento = (id) => {
    if (window.confirm('Deseja realmente remover este ativo do sistema?')) {
      setEquipamentos((prev) => prev.filter((eq) => eq.id !== id));
    }
  };

  // Métricas calculadas com base nas variáveis de estado
  const totalEquipamentos = equipamentos.length;
  const emOperacao = equipamentos.filter((eq) => eq.status === 'Operacional').length;
  const emManutencao = totalEquipamentos - emOperacao;

  return (
    <div className="app-container">
      {/* Componente 1: Header (Troca de dados via props) */}
      <Header
        title="DM-CMMS"
        subtitle="Gerenciamento de Ativos e Manutenção Industrial"
        totalEquipamentos={totalEquipamentos}
        totalOrdens={emManutencao}
      />

      <main className="main-content">
        {/* Painel de Indicadores Rápidos */}
        <section className="quick-stats">
          <div className="stat-box">
            <span className="stat-label">Total de Equipamentos</span>
            <span className="stat-value">{totalEquipamentos}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Equipamentos Operacionais</span>
            <span className="stat-value stat-highlight-green">{emOperacao}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Paradas / Em Manutenção</span>
            <span className="stat-value stat-highlight-red">{emManutencao}</span>
          </div>
        </section>

        {/* Grade de Conteúdo */}
        <div className="content-grid">
          {/* Componente 2: CardContainer (Usa a prop children para encapsular o formulário) */}
          <CardContainer
            title="Novo Equipamento"
            subtitle="Cadastre um novo ativo no inventário"
          >
            {/* Componente 3: EquipamentoForm (Usa useState e callback via prop) */}
            <EquipamentoForm onAddEquipamento={handleAddEquipamento} />
          </CardContainer>

          {/* Componente 2: CardContainer reutilizado com children para a lista */}
          <CardContainer
            title="Inventário de Ativos"
            subtitle="Equipamentos industriais monitorados"
          >
            {/* Componente 4: EquipamentoLista (Troca de dados e funções via props, e useState para busca) */}
            <EquipamentoLista
              equipamentos={equipamentos}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteEquipamento}
            />
          </CardContainer>
        </div>
      </main>

      <footer className="footer">
        DM-CMMS &copy; 2026 - Desenvolvido com React + Vite
      </footer>
    </div>
  );
}

export default App;
