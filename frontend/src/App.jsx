import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout shell com sidebar
import Layout from './components/Layout';

// Páginas da aplicação
import Dashboard from './pages/Dashboard';
import Equipamentos from './pages/Equipamentos';
import EquipamentoDetalhe from './pages/EquipamentoDetalhe';
import Ordens from './pages/Ordens';
import OrdemDetalhe from './pages/OrdemDetalhe';
import NotFound from './pages/NotFound';

/**
 * App.jsx — Raiz da aplicação DM-CMMS
 *
 * Estado global gerenciado aqui e passado via props às páginas.
 * Roteamento via React Router com passagem de dados por parâmetros de rota.
 *
 * Rotas:
 *   /                      → Dashboard
 *   /equipamentos          → Lista de Equipamentos
 *   /equipamentos/:id      → Detalhe de Equipamento (parâmetro :id)
 *   /ordens                → Lista de Ordens de Serviço
 *   /ordens/:id            → Detalhe de OS (parâmetro :id)
 *   *                      → 404 Not Found
 */
function App() {
  // ── Estado global: Equipamentos ──
  const [equipamentos, setEquipamentos] = useState([
    {
      id: 1,
      nome: 'Torno Mecânico Nardini',
      codigo: 'TOR-01',
      setor: 'Usinagem',
      criticidade: 'Alta',
      status: 'Operacional',
      dataCadastro: '28/10/2026',
    },
    {
      id: 2,
      nome: 'Compressor de Ar Schulz',
      codigo: 'CMP-02',
      setor: 'Utilidades',
      criticidade: 'Crítica',
      status: 'Em Manutenção',
      dataCadastro: '29/10/2026',
    },
    {
      id: 3,
      nome: 'Robô de Solda Yaskawa',
      codigo: 'SLD-05',
      setor: 'Soldagem',
      criticidade: 'Alta',
      status: 'Operacional',
      dataCadastro: '30/10/2026',
    },
    {
      id: 4,
      nome: 'Prensa Hidráulica Romi',
      codigo: 'PRN-08',
      setor: 'Estamparia',
      criticidade: 'Média',
      status: 'Operacional',
      dataCadastro: '01/11/2026',
    },
  ]);

  // ── Estado global: Ordens de Serviço ──
  const [ordens, setOrdens] = useState([
    {
      id: 1001,
      equipamento: 'Compressor de Ar Schulz',
      equipamentoId: 2,
      tipo: 'Corretiva',
      prioridade: 'Alta',
      status: 'Em Andamento',
      responsavel: 'Carlos Melo',
      descricao: 'Substituição do filtro de ar e revisão do sistema de pressão.',
      dataAbertura: '29/10/2026',
    },
    {
      id: 1002,
      equipamento: 'Torno Mecânico Nardini',
      equipamentoId: 1,
      tipo: 'Preventiva',
      prioridade: 'Média',
      status: 'Em Aberto',
      responsavel: 'Ana Silva',
      descricao: 'Lubrificação geral e verificação de folgas.',
      dataAbertura: '01/11/2026',
    },
    {
      id: 1003,
      equipamento: 'Robô de Solda Yaskawa',
      equipamentoId: 3,
      tipo: 'Inspeção',
      prioridade: 'Baixa',
      status: 'Concluída',
      responsavel: 'Pedro Costa',
      descricao: 'Inspeção periódica semestral de rotina.',
      dataAbertura: '30/10/2026',
    },
  ]);

  // ── Handlers: Equipamentos ──
  const handleAddEquipamento = (novo) => {
    setEquipamentos((prev) => [novo, ...prev]);
  };

  const handleToggleEquipamento = (id) => {
    setEquipamentos((prev) =>
      prev.map((eq) =>
        eq.id === id
          ? {
              ...eq,
              status: eq.status === 'Operacional' ? 'Em Manutenção' : 'Operacional',
            }
          : eq
      )
    );
  };

  const handleDeleteEquipamento = (id) => {
    setEquipamentos((prev) => prev.filter((eq) => eq.id !== id));
  };

  // ── Handlers: Ordens ──
  const handleAddOrdem = (nova) => {
    setOrdens((prev) => [nova, ...prev]);
  };

  const handleUpdateStatusOrdem = (id, novoStatus) => {
    setOrdens((prev) =>
      prev.map((os) => (os.id === id ? { ...os, status: novoStatus } : os))
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout shell envolve todas as páginas principais */}
        <Route
          path="/"
          element={<Layout equipamentos={equipamentos} ordens={ordens} />}
        >
          {/* Rota index → Dashboard */}
          <Route
            index
            element={
              <Dashboard equipamentos={equipamentos} ordens={ordens} />
            }
          />

          {/* Rota: /equipamentos */}
          <Route
            path="equipamentos"
            element={
              <Equipamentos
                equipamentos={equipamentos}
                onAdd={handleAddEquipamento}
                onToggle={handleToggleEquipamento}
                onDelete={handleDeleteEquipamento}
              />
            }
          />

          {/* Rota com parâmetro: /equipamentos/:id */}
          <Route
            path="equipamentos/:id"
            element={
              <EquipamentoDetalhe
                equipamentos={equipamentos}
                onToggle={handleToggleEquipamento}
                onDelete={handleDeleteEquipamento}
              />
            }
          />

          {/* Rota: /ordens */}
          <Route
            path="ordens"
            element={
              <Ordens
                ordens={ordens}
                equipamentos={equipamentos}
                onAddOrdem={handleAddOrdem}
              />
            }
          />

          {/* Rota com parâmetro: /ordens/:id */}
          <Route
            path="ordens/:id"
            element={
              <OrdemDetalhe
                ordens={ordens}
                onUpdateStatus={handleUpdateStatusOrdem}
              />
            }
          />
        </Route>

        {/* Rota 404 — captura qualquer caminho não mapeado */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
