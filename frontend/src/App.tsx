// frontend/src/App.tsx

import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexto de Autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout shell com sidebar
import Layout from './components/Layout.jsx';

// Páginas da aplicação
import Dashboard from './pages/Dashboard';
import Equipamentos from './pages/Equipamentos';
import EquipamentoDetalhe from './pages/EquipamentoDetalhe';
import Ordens from './pages/Ordens';
import OrdemDetalhe from './pages/OrdemDetalhe';
// @ts-ignore
import Usuarios from './pages/Usuarios';
import Login from './components/Login';
import NotFound from './pages/NotFound';

/**
 * Componente de Rota Protegida (Rotas Privadas)
 * Utiliza o useContext através de useAuth para validar a sessão
 */
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page-loading-overlay" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <span className="visually-hidden">Carregando autenticação...</span>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <PageLoadingOverlay />
        <Routes>
          {/* Rota pública de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Privadas (Protegidas por Autenticação) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="equipamentos" element={<Equipamentos />} />
              <Route path="equipamentos/:id" element={<EquipamentoDetalhe />} />
              <Route path="ordens" element={<Ordens />} />
              <Route path="ordens/:id" element={<OrdemDetalhe />} />
              <Route path="usuarios" element={<Usuarios />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
