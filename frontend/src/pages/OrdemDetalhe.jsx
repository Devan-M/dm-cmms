import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import '../styles/ordem-detalhe.css';

/**
 * Página: OrdemDetalhe
 * Recebe o ID da OS via parâmetro de rota (:id),
 * busca a ordem no estado global e exibe a ficha completa.
 */
function OrdemDetalhe({ ordens, onUpdateStatus }) {
  const { id } = useParams(); // 👈 Parâmetro de rota
  const navigate = useNavigate();

  const ordem = ordens.find((os) => String(os.id) === String(id));

  if (!ordem) {
    return (
      <div className="page-content">
        <div className="detalhe-not-found">
          <ClipboardList size={48} color="#94a3b8" />
          <h3>Ordem de Serviço não encontrada</h3>
          <p>A OS com ID <strong>{id}</strong> não existe ou foi removida do sistema.</p>
          <Link to="/ordens" className="btn btn-primary">
            <ArrowLeft size={16} />
            Voltar para Ordens
          </Link>
        </div>
      </div>
    );
  }

  const statusClassMap = {
    'Em Aberto': 'status-pendente',
    'Em Andamento': 'status-andamento',
    'Concluída': 'status-agendada',
    'Cancelada': 'status-inativo',
  };

  const proximoStatus = {
    'Em Aberto': 'Em Andamento',
    'Em Andamento': 'Concluída',
    'Concluída': null,
    'Cancelada': null,
  };

  const proximo = proximoStatus[ordem.status];

  return (
    <div className="page-content">
      {/* Breadcrumb / cabeçalho */}
      <div className="main-header">
        <div className="detalhe-breadcrumb">
          <Link to="/ordens" className="breadcrumb-link">
            <ArrowLeft size={15} />
            Ordens de Serviço
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span>OS #{String(ordem.id).slice(-4).padStart(4, '0')}</span>
        </div>
        <div className="detalhe-acoes">
          {proximo && (
            <button
              className="btn btn-primary"
              onClick={() => onUpdateStatus(ordem.id, proximo)}
            >
              Avançar → {proximo}
            </button>
          )}
          {ordem.status === 'Em Aberto' && (
            <button
              className="btn btn-secondary"
              onClick={() => onUpdateStatus(ordem.id, 'Cancelada')}
            >
              Cancelar OS
            </button>
          )}
        </div>
      </div>

      {/* Hero da OS */}
      <article className="card-painel os-hero">
        <div className="detalhe-hero-content">
          <div className="os-logo">
            <ClipboardList size={28} color="#0284c7" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 className="detalhe-nome">
                OS #{String(ordem.id).slice(-4).padStart(4, '0')}
              </h2>
              <span className={`status ${statusClassMap[ordem.status] || 'status-inativo'}`}>
                {ordem.status}
              </span>
            </div>
            <p className="detalhe-subtitulo">
              Equipamento: <strong>{ordem.equipamento}</strong>
              &nbsp;·&nbsp; Tipo: <strong>{ordem.tipo}</strong>
            </p>
          </div>
        </div>
      </article>

      {/* KPIs */}
      <div className="modal-kpis">
        <div className="modal-kpi-card">
          <p className="kpi-label">Prioridade</p>
          <p className="kpi-valor">
            <span className={`badge-criticidade ${ordem.prioridade?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
              {ordem.prioridade}
            </span>
          </p>
        </div>
        <div className="modal-kpi-card">
          <p className="kpi-label">Responsável</p>
          <p className="kpi-valor" style={{ fontSize: '1rem' }}>{ordem.responsavel || '—'}</p>
        </div>
        <div className="modal-kpi-card">
          <p className="kpi-label">Data de Abertura</p>
          <p className="kpi-valor" style={{ fontSize: '1rem' }}>{ordem.dataAbertura}</p>
        </div>
      </div>

      {/* Ficha da OS */}
      <article className="card-painel">
        <h3 className="ficha-titulo">Detalhes da Ordem</h3>
        <div className="grid-ficha-tecnica">
          <div className="campo-ficha">
            <label>Equipamento</label>
            <p>{ordem.equipamento}</p>
          </div>
          <div className="campo-ficha">
            <label>Tipo de Manutenção</label>
            <p>{ordem.tipo}</p>
          </div>
          <div className="campo-ficha">
            <label>Prioridade</label>
            <p>
              <span className={`badge-criticidade ${ordem.prioridade?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                {ordem.prioridade}
              </span>
            </p>
          </div>
          <div className="campo-ficha">
            <label>Status</label>
            <p>
              <span className={`status ${statusClassMap[ordem.status] || 'status-inativo'}`}>
                {ordem.status}
              </span>
            </p>
          </div>
          <div className="campo-ficha">
            <label>Responsável</label>
            <p>{ordem.responsavel || '—'}</p>
          </div>
          <div className="campo-ficha">
            <label>Data de Abertura</label>
            <p>{ordem.dataAbertura}</p>
          </div>
        </div>

        {ordem.descricao && (
          <div className="os-descricao-bloco">
            <h4>Descrição / Observações</h4>
            <p>{ordem.descricao}</p>
          </div>
        )}

        {/* Linha do tempo de status */}
        <div className="os-timeline">
          <h4>Linha do Tempo</h4>
          <div className="timeline-steps">
            {['Em Aberto', 'Em Andamento', 'Concluída'].map((step, i) => {
              const stepIndex = ['Em Aberto', 'Em Andamento', 'Concluída'].indexOf(ordem.status);
              const isActive = i <= stepIndex && ordem.status !== 'Cancelada';
              const isCurrent = step === ordem.status;
              return (
                <div key={step} className={`timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="timeline-dot">{i + 1}</div>
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
          {ordem.status === 'Cancelada' && (
            <div className="alerta-manutencao" style={{ marginTop: '1rem' }}>
              <strong>OS Cancelada.</strong> Esta ordem foi encerrada sem conclusão.
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default OrdemDetalhe;
