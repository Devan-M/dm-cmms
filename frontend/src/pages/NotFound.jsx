import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import '../styles/not-found.css';

/**
 * Página: 404 — Not Found
 * Exibida para qualquer rota não mapeada na aplicação.
 */
function NotFound() {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <div className="notfound-icon">
          <AlertTriangle size={48} color="#eab308" />
        </div>

        <p className="notfound-code">404</p>
        <h1 className="notfound-title">Página não encontrada</h1>
        <p className="notfound-message">
          A rota que você tentou acessar não existe neste sistema.<br />
          Verifique o endereço ou retorne ao painel principal.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            Ir para o Dashboard
          </Link>
          <Link to="/equipamentos" className="btn btn-secondary">
            Ver Equipamentos
          </Link>
        </div>

        <p className="notfound-hint">
          Rotas disponíveis:{' '}
          <Link to="/" className="link-acao">Dashboard</Link>,{' '}
          <Link to="/equipamentos" className="link-acao">Equipamentos</Link>,{' '}
          <Link to="/ordens" className="link-acao">Ordens de Serviço</Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
