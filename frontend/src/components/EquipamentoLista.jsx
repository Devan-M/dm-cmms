import React, { useState } from 'react';
import './EquipamentoLista.css';
import { Search, Trash2, RefreshCw } from 'lucide-react';

/**
 * Componente EquipamentoLista
 * Recebe props: lista (equipamentos), onToggleStatus, onDelete
 * Utiliza useState para gerenciar filtro de busca e filtro por setor
 */
function EquipamentoLista({ equipamentos, onToggleStatus, onDelete }) {
  const [busca, setBusca] = useState('');
  const [filtroSetor, setFiltroSetor] = useState('Todos');

  // Filtra equipamentos conforme as variáveis de estado
  const equipamentosFiltrados = equipamentos.filter((eq) => {
    const atendeBusca =
      eq.nome.toLowerCase().includes(busca.toLowerCase()) ||
      eq.codigo.toLowerCase().includes(busca.toLowerCase());
    const atendeSetor = filtroSetor === 'Todos' || eq.setor === filtroSetor;
    return atendeBusca && atendeSetor;
  });

  return (
    <div className="equipamentos-container">
      {/* Controles de filtro com estados locais */}
      <div className="filtros-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar por nome ou tag..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <select
          className="filtro-select"
          value={filtroSetor}
          onChange={(e) => setFiltroSetor(e.target.value)}
        >
          <option value="Todos">Todos os setores</option>
          <option value="Usinagem">Usinagem</option>
          <option value="Soldagem">Soldagem</option>
          <option value="Pintura">Pintura</option>
          <option value="Montagem">Montagem</option>
          <option value="Utilidades">Utilidades</option>
        </select>
      </div>

      {/* Renderização da lista de cartões */}
      {equipamentosFiltrados.length === 0 ? (
        <div className="empty-state">
          Nenhum equipamento encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="cards-grid">
          {equipamentosFiltrados.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-header">
                <div className="item-title-group">
                  <h4>{item.nome}</h4>
                  <span className="item-tag">{item.codigo}</span>
                </div>
                <span
                  className={`status-badge ${
                    item.status === 'Operacional'
                      ? 'status-operacional'
                      : 'status-manutencao'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="item-details">
                <div>Setor: <strong>{item.setor}</strong></div>
                <div>
                  Criticidade:{' '}
                  <span className={`criticidade-badge crit-${item.criticidade}`}>
                    {item.criticidade}
                  </span>
                </div>
                <div>Cadastrado em: {item.dataCadastro}</div>
              </div>

              <div className="item-actions">
                <button
                  className="btn-toggle-status"
                  title="Alterar status operacional"
                  onClick={() => onToggleStatus(item.id)}
                >
                  <RefreshCw size={14} />
                  Alterar Status
                </button>
                <button
                  className="btn-delete"
                  title="Excluir equipamento"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EquipamentoLista;
