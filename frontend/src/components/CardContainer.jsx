import React from 'react';
import './CardContainer.css';

/**
 * Componente CardContainer (Usa a prop especial children)
 * Recebe props: title, subtitle, action, children
 */
function CardContainer({ title, subtitle, action, children }) {
  return (
    <div className="card-container">
      {(title || action) && (
        <div className="card-header">
          <div className="card-title-group">
            {title && <h2>{title}</h2>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export default CardContainer;
