import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Layout shell com sidebar
import Layout from './components/Layout';

// Pǭginas da aplica��ǜo
import Dashboard from './pages/Dashboard';
import Equipamentos from './pages/Equipamentos';
import EquipamentoDetalhe from './pages/EquipamentoDetalhe';
import Ordens from './pages/Ordens';
import OrdemDetalhe from './pages/OrdemDetalhe';
import Login from './components/Login';
import NotFound from './pages/NotFound';

/**
 * Verifica se hǭ token no localStorage para autentica��ǜo
 */
function isAuth(): boolean {
  return localStorage.getItem('token') !== null;
}

// Guard de autentica��ǜo - redireciona para /login se nǜo tiver token
function requireAuth() {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuth()) {
      navigate('/login');
    }
  }, [navigate]);
  
  // Componente vazio que sempre retorna null quando requer auth
  return null as React.ReactElement;
}

/**
 * App.tsx �?" Raiz da aplica��ǜo DM-CMMS
 * Rotas protegidas verificam token no localStorage e redirecionam para /login se necessǭrio.
 */
function App() {
  const [equipamentos, setEquipamentos] = useState([
    { id: 1, nome: 'Torno Mecǽnico Nardini', codigo: 'TOR-01', setor: 'Usinagem', criticidade: 'Alta', status: 'Operacional', dataCadastro: '28/10/2026' },
    { id: 2, nome: 'Compressor de Ar Schulz', codigo: 'CMP-02', setor: 'Utilidades', criticidade: 'Cr��tica', status: 'Em Manuten��ǜo', dataCadastro: '29/10/2026' },
    { id: 3, nome: 'Rob�� de Solda Yaskawa', codigo: 'SLD-05', setor: 'Soldagem', criticidade: 'Alta', status: 'Operacional', dataCadastro: '30/10/2026' },
    { id: 4, nome: 'Prensa Hidrǭulica Romi', codigo: 'PRN-08', setor: 'Estamparia', criticidade: 'MǸdia', status: 'Operacional', dataCadastro: '01/11/2026' },
  ]);

  const [ordens, setOrdens] = useState([
    { id: 1001, equipamento: 'Compressor de Ar Schulz', equipamentoId: 2, tipo: 'Corretiva', prioridade: 'Alta', status: 'Em Andamento', responsavel: 'Carlos Melo', descricao: 'Substitui��ǜo do filtro de ar e revisǜo do sistema de pressǜo.', dataAbertura: '29/10/2026' },
    { id: 1002, equipamento: 'Torno Mecǽnico Nardini', equipamentoId: 1, tipo: 'Preventiva', prioridade: 'MǸdia', status: 'Em Aberto', responsavel: 'Ana Silva', descricao: 'Lubrifica��ǜo geral e verifica��ǜo de folgas.', dataAbertura: '01/11/2026' },
    { id: 1003, equipamento: 'Rob�� de Solda Yaskawa', equipamentoId: 3, tipo: 'Inspe��ǜo', prioridade: 'Baixa', status: 'Conclu��da', responsavel: 'Pedro Costa', descricao: 'Inspe��ǜo peri��dica semestral de rotina.', dataAbertura: '30/10/2026' },
  ]);

  const handleAddEquipamento = (novo) => { setEquipamentos((prev) => [novo, ...prev]); };
  const handleToggleEquipamento = (id) => {
    setEquipamentos((prev) => prev.map((eq) =>
      eq.id === id ? { ...eq, status: eq.status === 'Operacional' ? 'Em Manuten��ǜo' : 'Operacional' } : eq
    ));
  };
  const handleDeleteEquipamento = (id) => { setEquipamentos((prev) => prev.filter((eq) => eq.id !== id)); };

  const handleAddOrdem = (nova) => { setOrdens((prev) => [nova, ...prev]); };
  const handleUpdateStatusOrdem = (id, novoStatus) => {
    setOrdens((prev) => prev.map(os => os.id === id ? { ...os, status: novoStatus } : os));
  };

  return (
    <Router>
      <Routes>
        {/* Rota de Login - acess��vel para todos */}
        <Route path="/login" element={<Login />} />

        {/* Guard de autentica��ǜo */}
        <Route path="/" element={requireAuth()} />

        {/* Layout shell envolve todas as pǭginas protegidas */}
        <Route path="/" element={<Layout equipamentos={equipamentos} ordens={ordens} />}>
          <Route index element={<Dashboard />} />

          <Route path="equipamentos" element={<Equipamentos equipments={equipamentos} onAdd={handleAddEquipamento} onToggle={handleToggleEquipamento} onDelete={handleDeleteEquipamento} />} />
          <Route path="equipamentos/:id" element={<EquipamentoDetalhe equipments={equipamentos} onToggle={handleToggleEquipamento} onDelete={handleDeleteEquipamento} />} />

          <Route path="ordens" element={<Ordens />} />
          <Route path="ordens/:id" element={<OrdemDetalhe />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;




