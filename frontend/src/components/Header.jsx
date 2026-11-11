import React from 'react';
import '../styles/header.css';
import { Wrench } from 'lucide-react';

/**
 * Componente Header
 * Recebe props: title, subtitle, totalEquipamentos, totalOrdens
 */
function Header({ title, subtitle, totalEquipamentos, totalOrdens }) {
  return (
    <header className="header">
      <div className="brand-section">
        <div className="logo-icon">
          <Wrench size={24} color="#ffffff" />
        </div>
        <div>
          <h1 className="brand-title">{title}</h1>
          <p className="brand-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="stats-badges">
        <div className="badge">
          Equipamentos: <strong>{totalEquipamentos}</strong>
        </div>
        <div className="badge">
          O.S. Ativas: <strong>{totalOrdens}</strong>
        </div>
      </div>
    </header>
  );
}

export default Header;
