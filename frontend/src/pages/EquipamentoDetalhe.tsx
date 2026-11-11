// frontend/src/pages/EquipamentoDetalhe.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2, Wrench, Edit3, Save, X } from 'lucide-react';
import { apiRequest } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/equipamento-detalhe.css';

const EquipamentoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [equipamento, setEquipamento] = useState<any>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados de edição
  const [editando, setEditando] = useState<boolean>(false);
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [setor, setSetor] = useState('Usinagem');
  const [criticidade, setCriticidade] = useState('Média');
  const [status, setStatus] = useState('Operacional');

  useEffect(() => {
    carregarEquipamento();
  }, [id]);

  const carregarEquipamento = async () => {
    try {
      setCarregando(true);
      const res = await apiRequest(`/equipamentos/${id}`);
      const dados = res.equipamento || res.dados || res;
      setEquipamento(dados);

      setNome(dados.nome || '');
      setCodigo(dados.codigo || '');
      setSetor(dados.setor || 'Usinagem');
      setCriticidade(dados.criticidade || 'Média');
      setStatus(dados.status || 'Operacional');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao carregar detalhes do equipamento');
    } finally {
      setCarregando(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!equipamento) return;
    const novoStatus = equipamento.status === 'Operacional' ? 'Em Manutenção' : 'Operacional';

    try {
      await apiRequest(`/equipamentos/${id}`, {
        method: 'PUT',
        data: { ...equipamento, status: novoStatus },
      });
      toast.success(`Status alterado para ${novoStatus}!`);
      carregarEquipamento();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao alternar status');
    }
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest(`/equipamentos/${id}`, {
        method: 'PUT',
        data: {
          nome,
          codigo: codigo.toUpperCase(),
          setor,
          criticidade,
          status,
        },
      });
      toast.success('Equipamento atualizado com sucesso!');
      setEditando(false);
      carregarEquipamento();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar equipamento');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Deseja realmente remover este ativo do sistema?')) return;

    try {
      await apiRequest(`/equipamentos/${id}`, {
        method: 'DELETE',
      });
      toast.success('Equipamento excluído com sucesso!');
      navigate('/equipamentos');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao remover equipamento');
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
          Carregando informações do equipamento...
        </div>
      </div>
    );
  }

  if (!equipamento) {
    return (
      <div className="page-content">
        <div className="detalhe-not-found">
          <Wrench size={48} color="#94a3b8" />
          <h3>Equipamento não encontrado</h3>
          <p>O ativo com ID <strong>{id}</strong> não existe ou foi removido.</p>
          <Link to="/equipamentos" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={16} />
            Voltar para Equipamentos
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="detalhe-acoes" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {!editando ? (
            <>
              <button className="btn btn-secondary" onClick={() => setEditando(true)}>
                <Edit3 size={15} />
                Editar Dados
              </button>
              <button className="btn btn-secondary" onClick={handleToggleStatus}>
                <RefreshCw size={15} />
                Alternar Status
              </button>
              <button className="btn btn-danger-outline" onClick={handleDelete}>
                <Trash2 size={15} />
                Excluir
              </button>
            </>
          ) : (
            <button className="btn btn-secondary" onClick={() => setEditando(false)}>
              <X size={15} />
              Cancelar
            </button>
          )}
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

      {/* Formulário de edição ou visualização */}
      {editando ? (
        <article className="card-painel" style={{ marginTop: '1.5rem' }}>
          <h3 className="ficha-titulo">Editar Equipamento</h3>
          <form onSubmit={handleSalvarEdicao} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label htmlFor="ed-nome">Nome do Ativo</label>
              <input
                id="ed-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ed-codigo">Código / TAG</label>
              <input
                id="ed-codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ed-setor">Setor</label>
              <select id="ed-setor" value={setor} onChange={(e) => setSetor(e.target.value)}>
                <option>Usinagem</option>
                <option>Soldagem</option>
                <option>Pintura</option>
                <option>Montagem</option>
                <option>Utilidades</option>
                <option>Estamparia</option>
                <option>Logística</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ed-criticidade">Criticidade</label>
              <select id="ed-criticidade" value={criticidade} onChange={(e) => setCriticidade(e.target.value)}>
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
                <option>Crítica</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ed-status">Status</label>
              <select id="ed-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Operacional</option>
                <option>Em Manutenção</option>
                <option>Inativo</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
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
        <>
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
              <p className="kpi-valor" style={{ fontSize: '1rem' }}>
                {formatarData(equipamento.dataCadastro || equipamento.createdAt)}
              </p>
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
                <p>{formatarData(equipamento.dataCadastro || equipamento.createdAt)}</p>
              </div>
            </div>

            <div className="alerta-manutencao">
              <strong>⚠ Atenção:</strong> Mantenha as informações deste ativo atualizadas para garantir
              a rastreabilidade das manutenções e inspeções realizadas.
            </div>
          </article>
        </>
      )}
    </div>
  );
};

export default EquipamentoDetalhe;
