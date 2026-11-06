import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// Layout shell com sidebar
import Layout from './components/Layout.jsx';

// Pǭginas da aplica��ǜo
import Dashboard from './pages/Dashboard.jsx';
import Equipamentos from './pages/Equipamentos.jsx';
import EquipamentoDetalhe from './pages/EquipamentoDetalhe.jsx';
import Ordens from './pages/Ordens.jsx';
import OrdemDetalhe from './pages/OrdemDetalhe.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Login from './components/Login.jsx';
import NotFound from './pages/NotFound.jsx';

/**
 * Verifica se hǭ token no localStorage para autentica��ǜo
 */
function isAuth(): boolean {
  return localStorage.getItem('token') !== null;
}


function ProtectedRoute() {
  return isAuth() ? <Outlet /> : <Navigate to="/login" replace />;
}

function PageLoadingOverlay() {
  const location = useLocation();
  const firstLoad = useRef(true);
  const [readyPath, setReadyPath] = useState<string | null>(null);

  useEffect(() => {
    const delay = firstLoad.current ? 700 : 500;
    firstLoad.current = false;
    const timeout = window.setTimeout(() => setReadyPath(location.pathname), delay);

    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  if (readyPath === location.pathname) return null;

  return (
    <div className="page-loading-overlay" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="visually-hidden">Carregando página</span>
    </div>
  );
}

// Guard de autentica��ǜo - redireciona para /login se nǜo tiver token
/*function requireAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth()) {
      navigate('/login');
    }
  }, [navigate]);

  // Componente vazio que sempre retorna null quando requer auth
  return null;
}

/**
 * App.tsx �?" Raiz da aplica��ǜo DM-CMMS
 * Rotas protegidas verificam token no localStorage e redirecionam para /login se necessǭrio.
 */
function App() {
  const [equipamentos, setEquipamentos] = useState([
    { id: 1, nome: 'Torno Mecânico Nardini', codigo: 'TOR-01', setor: 'Usinagem', criticidade: 'Alta', status: 'Operacional', dataCadastro: '28/10/2026' },
    { id: 2, nome: 'Compressor de Ar Schulz', codigo: 'CMP-02', setor: 'Utilidades', criticidade: 'Crítica', status: 'Em Manutenção', dataCadastro: '29/10/2026' },
    { id: 3, nome: 'Robô de Solda Yaskawa', codigo: 'SLD-05', setor: 'Soldagem', criticidade: 'Alta', status: 'Operacional', dataCadastro: '30/10/2026' },
    { id: 4, nome: 'Prensa Hidráulica Romi', codigo: 'PRN-08', setor: 'Estamparia', criticidade: 'Média', status: 'Operacional', dataCadastro: '01/11/2026' },
  ]);

  const [ordens, setOrdens] = useState([
    { id: 1001, equipamento: 'Compressor de Ar Schulz', equipamentoId: 2, tipo: 'Corretiva', prioridade: 'Alta', status: 'Em Andamento', responsavel: 'Carlos Melo', descricao: 'Substituição do filtro de ar e revisão do sistema de pressão.', dataAbertura: '29/10/2026' },
    { id: 1002, equipamento: 'Torno Mecânico Nardini', equipamentoId: 1, tipo: 'Preventiva', prioridade: 'Média', status: 'Em Aberto', responsavel: 'Ana Silva', descricao: 'Lubrificação geral e verificação de folgas.', dataAbertura: '01/11/2026' },
    { id: 1003, equipamento: 'Robô de Solda Yaskawa', equipamentoId: 3, tipo: 'Inspeção', prioridade: 'Baixa', status: 'Concluída', responsavel: 'Pedro Costa', descricao: 'Inspeção periódica semestral de rotina.', dataAbertura: '30/10/2026' },
  ]);

  const handleAddEquipamento = (novo: any) => { setEquipamentos((prev) => [novo, ...prev]); };
  const handleToggleEquipamento = (id: any) => {
    setEquipamentos((prev) => prev.map((eq) =>
      eq.id === id ? { ...eq, status: eq.status === 'Operacional' ? 'Em Manutenção' : 'Operacional' } : eq
    ));
  };
  const handleDeleteEquipamento = (id: any) => { setEquipamentos((prev) => prev.filter((eq) => eq.id !== id)); };

  const handleAddOrdem = (nova: any) => { setOrdens((prev) => [nova, ...prev]); };
  const handleUpdateStatusOrdem = (id: any, novoStatus: any) => {
    setOrdens((prev) => prev.map(os => os.id === id ? { ...os, status: novoStatus } : os));
  };

  return (
    <Router>
      <PageLoadingOverlay />
      <Routes>
        {/* Rota de Login - acess��vel para todos */}
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout equipamentos={equipamentos} ordens={ordens} />}>
            <Route index element={<Dashboard equipamentos={equipamentos} ordens={ordens} />} />
            <Route
              path="equipamentos"
              element={<Equipamentos
                equipments={equipamentos}
                onAdd={handleAddEquipamento}
                onToggle={handleToggleEquipamento}
                onDelete={handleDeleteEquipamento}
              />}
            />
            <Route
              path="equipamentos/:id"
              element={<EquipamentoDetalhe
                equipments={equipamentos}
                onToggle={handleToggleEquipamento}
                onDelete={handleDeleteEquipamento}
              />}
            />
            <Route
              path="ordens"
              element={<Ordens
                ordens={ordens}
                equipamentos={equipamentos}
                onAddOrdem={handleAddOrdem}
              />}
            />
            <Route
              path="ordens/:id"
              element={<OrdemDetalhe
                ordens={ordens}
                onUpdateStatus={handleUpdateStatusOrdem}
              />}
            />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </Router >
  );
}

export default App;