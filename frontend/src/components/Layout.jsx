import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Wrench, LayoutDashboard, Settings, ClipboardList } from 'lucide-react';
import '../styles/layout.css';

/**
 * Componente Layout
 * Shell da aplicação: sidebar fixa (fiel ao legado) + área de conteúdo.
 * Usa <Outlet /> do React Router para renderizar a página ativa.
 */
function Layout({ equipamentos, ordens }) {
  const totalEq = equipamentos.length;
  const osAbertas = ordens.filter(
    (o) => o.status === 'Em Aberto' || o.status === 'Em Andamento'
  ).length;

  return (
    <div className="shell">
      {/* Sidebar lateral fixa — estilo fiel ao legacy-frontend */}
      <header className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo-icon">
            <Wrench size={20} color="#ffffff" />
          </div>
          <div>
            <h1>DM-CMMS</h1>
            <p>Gestão de Manutenção</p>
          </div>
        </div>

        <nav aria-label="Navegação principal">
          <ul>
            <li>
              <NavLink to="/" end>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/equipamentos">
                <Settings size={16} />
                Equipamentos
              </NavLink>
            </li>
            <li>
              <NavLink to="/ordens">
                <ClipboardList size={16} />
                Ordens de Serviço
              </NavLink>
            </li>
          </ul>
        </nav>

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
