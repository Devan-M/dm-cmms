import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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

/**
 * Componente Layout
 * Shell da aplicação: sidebar fixa (fiel ao legado) + área de conteúdo.
 * Usa <Outlet /> do React Router para renderizar a página ativa.
 */
function Layout({ equipamentos, ordens }) {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [sidebarColapsada, setSidebarColapsada] = useState(false);
  const totalEq = equipamentos.length;
  const osAbertas = ordens.filter(
    (o) => o.status === 'Em Aberto' || o.status === 'Em Andamento'
  ).length;
  const usuarioSalvo = localStorage.getItem('usuario');
  let usuario = null;
  try {
    usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  } catch {
    usuario = null;
  }

  const sair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
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
            className="sidebar-collapse-button"
            type="button"
            aria-label={sidebarColapsada ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            title={sidebarColapsada ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            onClick={() => setSidebarColapsada((colapsada) => !colapsada)}
          >
            {sidebarColapsada ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((aberto) => !aberto)}
          >
            {menuAberto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav aria-label="Navegação principal">
          <ul>
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
          <span className="sidebar-account-name">{usuario?.nome || 'Conta'}</span>
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
