import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Wrench,
  LayoutDashboard,
  Settings,
  ClipboardList,
  UserRound,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import '../styles/layout.css';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';

/**
 * Componente Layout
 * Shell da aplicação: sidebar fixa + área de conteúdo.
 * Usa <Outlet /> do React Router para renderizar a página ativa.
 */
function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [sidebarColapsada, setSidebarColapsada] = useState(false);

  const [totalEq, setTotalEq] = useState(0);
  const [osAbertas, setOsAbertas] = useState(0);

  // Recarrega contadores sempre que a rota mudar ou a cada intervalo (para manter atualizado)
  useEffect(() => {
    async function carregarTotais() {
      try {
        const [resEq, resOs] = await Promise.allSettled([
          apiRequest('/equipamentos'),
          apiRequest('/ordens')
        ]);

        if (resEq.status === 'fulfilled') {
          const dadosEq = Array.isArray(resEq.value) ? resEq.value : (resEq.value.dados || resEq.value.equipamentos || []);
          setTotalEq(dadosEq.length);
        }

        if (resOs.status === 'fulfilled') {
          const dadosOs = Array.isArray(resOs.value) ? resOs.value : (resOs.value.dados || resOs.value.ordens || []);
          const abertas = dadosOs.filter((o) => o.status === 'Em Aberto' || o.status === 'Em Andamento').length;
          setOsAbertas(abertas);
        }
      } catch (err) {
        console.error('Erro ao atualizar contadores da barra lateral:', err);
      }
    }

    carregarTotais();
    // Atualiza automaticamente a cada 10 segundos para refletir alterações
    const intervalo = setInterval(carregarTotais, 10000);
    return () => clearInterval(intervalo);
  }, [location.pathname]);

  const sair = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={`shell${sidebarColapsada ? ' shell--collapsed' : ''}`}>
      {/* Sidebar lateral fixa — estilo fiel ao legacy-frontend */}
      <header className={`sidebar${menuAberto ? ' sidebar--mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo-icon">
            <Wrench size={20} color="#ffffff" />
          </div>
          <div className="sidebar-brand-copy">
            <h1>DM-CMMS</h1>
            <p>Gestão de Manutenção</p>
          </div>
          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={() => setSidebarColapsada((v) => !v)}
            aria-label={sidebarColapsada ? 'Expandir sidebar' : 'Recolher sidebar'}
            title={sidebarColapsada ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            {sidebarColapsada ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navegação principal com NavLink (adiciona classe 'active' automaticamente) */}
        <nav aria-label="Navegação principal">
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/" end title="Dashboard" onClick={() => setMenuAberto(false)}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/equipamentos" title="Equipamentos" onClick={() => setMenuAberto(false)}>
                <Settings size={16} />
                <span>Equipamentos</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/ordens" title="Ordens de Serviço" onClick={() => setMenuAberto(false)}>
                <ClipboardList size={16} />
                <span>Ordens de Serviço</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/usuarios" title="Minha Conta" onClick={() => setMenuAberto(false)}>
                <UserRound size={16} />
                <span>Minha Conta</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-account">
          <span className="sidebar-account-name">{user?.nome || 'Conta'}</span>
          <button type="button" onClick={sair} title="Sair" aria-label="Sair">
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>

        {/* Badges de resumo na sidebar */}
        <div className="sidebar-stats">
          <div className="sidebar-stat-item">
            <span className="sidebar-stat-label">Equipamentos</span>
            <span className="sidebar-stat-value">{totalEq}</span>
          </div>
          <div className="sidebar-stat-item">
            <span className="sidebar-stat-label">OS Abertas</span>
            <span className="sidebar-stat-value sidebar-stat-alert">{osAbertas}</span>
          </div>
        </div>
      </header>

      {/* Botão flutuante para abrir menu no mobile */}
      <button
        type="button"
        className="mobile-menu-button"
        aria-label={menuAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
        aria-expanded={menuAberto}
        onClick={() => setMenuAberto((v) => !v)}
      >
        {menuAberto ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuAberto && (
        <button
          className="mobile-menu-backdrop"
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Área principal de conteúdo */}
      <div className="main-shell">
        <main>
          {/* Outlet renderiza a página ativa via React Router */}
          <Outlet />
        </main>

        <footer>
          <p>DM-CMMS — Sistema de Gestão de Manutenção &copy; 2026</p>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
