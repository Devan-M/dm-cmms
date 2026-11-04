import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2, Wrench } from 'lucide-react';
import '../styles/equipamento-detalhe.css';

/**
 * Página: EquipamentoDetalhe
 * Demonstra o envio de dados via parâmetros de rota (:id).
 * Recebe o ID pela URL e busca o equipamento na lista de estado global.
 */
function EquipamentoDetalhe({ equipments: equipamentos, onToggle, onDelete }) {
  const { id } = useParams(); // 👈 Parâmetro de rota recebido via URL
  const navigate = useNavigate();

  const equipamento = equipamentos.find((eq) => String(eq.id) === String(id));

  if (!equipamento) {
    return (
      <div className="page-content">
        <div className="detalhe-not-found">
          <Wrench size={48} color="#94a3b8" />
          <h3>Equipamento não encontrado</h3>
          <p>O ativo com ID <strong>{id}</strong> não existe ou foi removido.</p>
          <Link to="/equipamentos" className="btn btn-primary">
            <ArrowLeft size={16} />
            Voltar para Equipamentos
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Deseja realmente remover este ativo do sistema?')) {
      onDelete(equipamento.id);
      navigate('/equipamentos');
    }
  };

  const statusClass =
    equipamento.status === 'Operacional'
      ? 'status-agendada'
      : equipamento.status === 'Em Manutenção'
      ? 'status-pendente'
      : 'status-inativo';

  const criticidadeClass = equipamento.criticidade
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return (
    <div className="page-content">
      {/* Cabeçalho com breadcrumb */}
      <div className="main-header">
        <div className="detalhe-breadcrumb">
          <Link to="/equipamentos" className="breadcrumb-link">
            <ArrowLeft size={15} />
            Equipamentos
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span>{equipamento.codigo}</span>
        </div>
        <div className="detalhe-acoes">
          <button
            className="btn btn-secondary"
            onClick={() => onToggle(equipamento.id)}
          >
            <RefreshCw size={15} />
            Alterar Status
          </button>
          <button className="btn btn-danger-outline" onClick={handleDelete}>
            <Trash2 size={15} />
            Excluir
          </button>
        </div>
      </div>

      {/* Título e status */}
      <article className="card-painel detalhe-hero">
        <div className="detalhe-hero-content">
          <div className="detalhe-logo">
            <Wrench size={28} color="#2563eb" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 className="detalhe-nome">{equipamento.nome}</h2>
              <span className={`status ${statusClass}`}>{equipamento.status}</span>
            </div>
            <p className="detalhe-subtitulo">
              Código: <strong>{equipamento.codigo}</strong> &nbsp;·&nbsp; Setor: <strong>{equipamento.setor}</strong>
            </p>
          </div>
        </div>
      </article>

      {/* KPIs rápidos */}
      <div className="modal-kpis">
        <div className="modal-kpi-card">
          <p className="kpi-label">Criticidade</p>
          <p className="kpi-valor">
            <span className={`badge-criticidade ${criticidadeClass}`}>
              {equipamento.criticidade}
            </span>
          </p>
        </div>
        <div className="modal-kpi-card">
          <p className="kpi-label">Status Atual</p>
          <p className="kpi-valor">{equipamento.status}</p>
        </div>
        <div className="modal-kpi-card">
          <p className="kpi-label">Data de Cadastro</p>
          <p className="kpi-valor">{equipamento.dataCadastro}</p>
        </div>
      </div>

      {/* Ficha técnica */}
      <article className="card-painel">
        <h3 className="ficha-titulo">Ficha Técnica</h3>
        <div className="grid-ficha-tecnica">
          <div className="campo-ficha">
            <label>Nome do Ativo</label>
            <p>{equipamento.nome}</p>
          </div>
          <div className="campo-ficha">
            <label>Código / TAG</label>
            <p>{equipamento.codigo}</p>
          </div>
          <div className="campo-ficha">
            <label>Setor de Alocação</label>
            <p>{equipamento.setor}</p>
          </div>
          <div className="campo-ficha">
            <label>Nível de Criticidade</label>
            <p>
              <span className={`badge-criticidade ${criticidadeClass}`}>
                {equipamento.criticidade}
              </span>
            </p>
          </div>
          <div className="campo-ficha">
            <label>Status Operacional</label>
            <p>
              <span className={`status ${statusClass}`}>{equipamento.status}</span>
            </p>
          </div>
          <div className="campo-ficha">
            <label>Data de Cadastro</label>
            <p>{equipamento.dataCadastro}</p>
          </div>
          <div className="campo-ficha">
            <label>ID do Registro</label>
            <p style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{equipamento.id}</p>
          </div>
        </div>

        <div className="alerta-manutencao">
          <strong>⚠ Atenção:</strong> Mantenha as informações deste ativo atualizadas para garantir
          a rastreabilidade das manutenções e inspeções realizadas.
        </div>
      </article>
    </div>
  );
}

export default EquipamentoDetalhe;
