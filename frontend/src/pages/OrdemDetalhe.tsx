// frontend/src/pages/OrdemDetalhe.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList, Edit3, Save, X, Trash2 } from 'lucide-react';
import { apiRequest } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/ordem-detalhe.css';

const OrdemDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ordem, setOrdem] = useState<any>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados de edição
  const [editando, setEditando] = useState<boolean>(false);
  const [tipo, setTipo] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [status, setStatus] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarOrdem();
  }, [id]);

  const carregarOrdem = async () => {
    try {
      setCarregando(true);
      const res = await apiRequest(`/ordens/${id}`);
      const dados = res.ordem || res;
      setOrdem(dados);

      // Preenche campos do formulário
      setTipo(dados.tipo || 'Corretiva');
      setPrioridade(dados.prioridade || 'Média');
      setResponsavel(dados.responsavel || '');
      setStatus(dados.status || 'Em Aberto');
      setDescricao(dados.descricao || '');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao carregar detalhes da ordem de serviço');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest(`/ordens/${id}`, {
        method: 'PUT',
        data: {
          tipo,
          prioridade,
          responsavel,
          status,
          descricao,
        },
      });
      toast.success('Ordem de serviço atualizada com sucesso!');
      setEditando(false);
      carregarOrdem();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar ordem de serviço');
    }
  };

  const handleUpdateStatusRapido = async (novoStatus: string) => {
    try {
      await apiRequest(`/ordens/${id}`, {
        method: 'PUT',
        data: { status: novoStatus },
      });
      toast.success(`Status alterado para ${novoStatus}!`);
      carregarOrdem();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar status');
    }
  };

  const handleExcluir = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) return;

    try {
      await apiRequest(`/ordens/${id}`, {
        method: 'DELETE',
      });
      toast.success('Ordem de serviço excluída com sucesso!');
      navigate('/ordens');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir ordem de serviço');
    }
  };

  const formatarData = (val: string | undefined) => {
    if (!val) return '—';
    if (val.includes('/')) return val;
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      return d.toLocaleDateString('pt-BR');
    } catch {
      return val;
    }
  };

  if (carregando) {
    return (
      <div className="page-content">
        <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>
          Carregando detalhes da Ordem de Serviço...
        </div>
      </div>
    );
  }

  if (!ordem) {
    return (
      <div className="page-content">
        <div className="detalhe-not-found">
          <ClipboardList size={48} color="#94a3b8" />
          <h3>Ordem de Serviço não encontrada</h3>
          <p>A OS solicitada não foi localizada no sistema.</p>
          <Link to="/ordens" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={16} />
            Voltar para Ordens
          </Link>
        </div>
      </div>
    );
  }

  const numOS = ordem.numero || String(ordem._id || ordem.id || '0').slice(-4);
  const nomeEq = ordem.nomeEquipamento || ordem.codigoEquipamento || ordem.equipamento || 'Equipamento';

  const statusClassMap: Record<string, string> = {
    'Em Aberto': 'status-pendente',
    'Em Andamento': 'status-andamento',
    'Concluída': 'status-agendada',
    'Cancelada': 'status-inativo',
  };

  const proximoStatusMap: Record<string, string | null> = {
    'Em Aberto': 'Em Andamento',
    'Em Andamento': 'Concluída',
    'Concluída': null,
    'Cancelada': null,
  };

  const proximo = proximoStatusMap[ordem.status];

  return (
    <div className="page-content">
      {/* Breadcrumb / Topo */}
      <div className="main-header">
        <div className="detalhe-breadcrumb">
          <Link to="/ordens" className="breadcrumb-link">
            <ArrowLeft size={15} />
            Ordens de Serviço
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span>OS #{numOS}</span>
        </div>

        <div className="detalhe-acoes" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {!editando ? (
            <>
              <button className="btn btn-secondary" onClick={() => setEditando(true)}>
                <Edit3 size={15} />
                Editar Informações
              </button>
              {proximo && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdateStatusRapido(proximo)}
                >
                  Avançar → {proximo}
                </button>
              )}
              {ordem.status === 'Em Aberto' && (
                <button
                  className="btn btn-secondary"
                  onClick={() => handleUpdateStatusRapido('Cancelada')}
                >
                  Cancelar OS
                </button>
              )}
              <button
                className="btn-icone btn-danger"
                style={{ padding: '0.5rem', borderRadius: '6px' }}
                title="Excluir OS"
                onClick={handleExcluir}
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <button className="btn btn-secondary" onClick={() => setEditando(false)}>
              <X size={15} />
              Cancelar Edição
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
              <h2 className="detalhe-nome">OS #{numOS}</h2>
              <span className={`status ${statusClassMap[ordem.status] || 'status-inativo'}`}>
                {ordem.status}
              </span>
            </div>
            <p className="detalhe-subtitulo">
              Equipamento: <strong>{nomeEq}</strong>
              &nbsp;·&nbsp; Tipo: <strong>{ordem.tipo}</strong>
            </p>
          </div>
        </div>
      </article>

      {/* Se estiver no modo de edição */}
      {editando ? (
        <article className="card-painel" style={{ marginTop: '1.5rem' }}>
          <h3 className="ficha-titulo">Editar Dados da Ordem</h3>
          <form onSubmit={handleSalvarEdicao} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label htmlFor="edit-tipo">Tipo de Manutenção</label>
              <select id="edit-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Preventiva</option>
                <option>Corretiva</option>
                <option>Preditiva</option>
                <option>Inspeção</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-prioridade">Prioridade</label>
              <select id="edit-prioridade" value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-status">Status</label>
              <select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Em Aberto</option>
                <option>Em Andamento</option>
                <option>Concluída</option>
                <option>Cancelada</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-resp">Responsável</label>
              <input
                id="edit-resp"
                type="text"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="edit-desc">Descrição / Observações</label>
              <textarea
                id="edit-desc"
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="textarea-custom"
                placeholder="Detalhes do serviço..."
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                Salvar Alterações
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditando(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </article>
      ) : (
        /* Visualização Normal */
        <>
          <div className="modal-kpis">
            <div className="modal-kpi-card">
              <p className="kpi-label">Prioridade</p>
              <p className="kpi-valor">
                <span className={`badge-criticidade ${String(ordem.prioridade || 'baixa').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                  {ordem.prioridade || 'Média'}
                </span>
              </p>
            </div>
            <div className="modal-kpi-card">
              <p className="kpi-label">Responsável</p>
              <p className="kpi-valor" style={{ fontSize: '1rem' }}>{ordem.responsavel || 'Não informado'}</p>
            </div>
            <div className="modal-kpi-card">
              <p className="kpi-label">Data de Abertura</p>
              <p className="kpi-valor" style={{ fontSize: '1rem' }}>
                {formatarData(ordem.dataAbertura || ordem.createdAt)}
              </p>
            </div>
          </div>

          <article className="card-painel" style={{ marginTop: '1.5rem' }}>
            <h3 className="ficha-titulo">Ficha da Ordem</h3>
            <div className="grid-ficha-tecnica">
              <div className="campo-ficha">
                <label>Equipamento</label>
                <p>{nomeEq}</p>
              </div>
              <div className="campo-ficha">
                <label>Tipo de Manutenção</label>
                <p>{ordem.tipo || 'Corretiva'}</p>
              </div>
              <div className="campo-ficha">
                <label>Prioridade</label>
                <p>
                  <span className={`badge-criticidade ${String(ordem.prioridade || 'baixa').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                    {ordem.prioridade || 'Média'}
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
                <p>{ordem.responsavel || 'Não atribuído'}</p>
              </div>
              <div className="campo-ficha">
                <label>Data de Abertura</label>
                <p>{formatarData(ordem.dataAbertura || ordem.createdAt)}</p>
              </div>
            </div>

            {ordem.descricao && (
              <div className="os-descricao-bloco">
                <h4>Descrição / Observações</h4>
                <p>{ordem.descricao}</p>
              </div>
            )}

            {/* Linha do tempo */}
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
                  <strong>OS Cancelada.</strong> Esta ordem foi cancelada sem conclusão.
                </div>
              )}
            </div>
          </article>
        </>
      )}
    </div>
  );
};

export default OrdemDetalhe;
