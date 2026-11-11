// frontend/src/pages/Equipamentos.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Trash2, RefreshCw } from 'lucide-react';
import { apiRequest } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/equipamentos.css';

export interface Equipamento {
  id?: string | number;
  _id?: string;
  nome: string;
  codigo: string;
  setor: string;
  criticidade: string;
  status: string;
  dataCadastro?: string;
}

const Equipamentos: React.FC = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados dos filtros
  const [busca, setBusca] = useState('');
  const [filtroSetor, setFiltroSetor] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // Estados do formulário de novo equipamento
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [setor, setSetor] = useState('Usinagem');
  const [criticidade, setCriticidade] = useState('Média');

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const carregarEquipamentos = async () => {
    try {
      setCarregando(true);
      const res = await apiRequest('/equipamentos');
      const lista = Array.isArray(res) ? res : (res.dados || res.equipamentos || []);
      setEquipamentos(lista);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao carregar equipamentos da API');
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !codigo.trim()) {
      toast.warning('Por favor, preencha o nome e o código do equipamento!');
      return;
    }

    try {
      await apiRequest('/equipamentos', {
        method: 'POST',
        data: {
          nome,
          codigo: codigo.toUpperCase(),
          setor,
          criticidade,
          status: 'Operacional',
          dataCadastro: new Date().toLocaleDateString('pt-BR'),
        },
      });
      toast.success('Equipamento cadastrado com sucesso!');
      setNome('');
      setCodigo('');
      setSetor('Usinagem');
      setCriticidade('Média');
      setShowForm(false);
      carregarEquipamentos();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar equipamento');
    }
  };

  const handleToggleStatus = async (id: any) => {
    const item = equipamentos.find(e => (e._id === id || e.id === id));
    if (!item) return;

    const novoStatus = item.status === 'Operacional' ? 'Em Manutenção' : 'Operacional';

    try {
      await apiRequest(`/equipamentos/${id}`, {
        method: 'PUT',
        data: { ...item, status: novoStatus },
      });
      toast.success(`Status alterado para ${novoStatus}`);
      carregarEquipamentos();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar status');
    }
  };

  const handleDeleteEquipamento = async (id: any) => {
    if (!window.confirm('Deseja realmente remover este ativo?')) return;

    try {
      await apiRequest(`/equipamentos/${id}`, {
        method: 'DELETE',
      });
      toast.success('Equipamento removido com sucesso!');
      carregarEquipamentos();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir equipamento');
    }
  };

  const filtrados = equipamentos.filter((eq) => {
    const atendeBusca =
      eq.nome.toLowerCase().includes(busca.toLowerCase()) ||
      eq.codigo.toLowerCase().includes(busca.toLowerCase());
    const atendeSetor = filtroSetor === 'Todos' || eq.setor === filtroSetor;
    const atendeStatus = filtroStatus === 'Todos' || eq.status === filtroStatus;
    return atendeBusca && atendeSetor && atendeStatus;
  });

  return (
    <div className="page-content">
      <div className="main-header">
        <div>
          <h2>Equipamentos</h2>
          <p>Gerenciamento do inventário de ativos industriais</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          <PlusCircle size={16} />
          {showForm ? 'Cancelar' : 'Novo Equipamento'}
        </button>
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <article className="card-painel form-painel">
          <h3 className="form-painel-titulo">Cadastrar Novo Ativo</h3>
          <form className="form-grid-2col" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="eq-nome">Nome do Ativo / Equipamento</label>
              <input
                id="eq-nome"
                type="text"
                placeholder="Ex: Torno CNC Mazak"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="eq-codigo">Código / Tag</label>
              <input
                id="eq-codigo"
                type="text"
                placeholder="Ex: TNC-001"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="eq-setor">Setor</label>
              <select id="eq-setor" value={setor} onChange={(e) => setSetor(e.target.value)}>
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
              <label htmlFor="eq-criticidade">Criticidade</label>
              <select id="eq-criticidade" value={criticidade} onChange={(e) => setCriticidade(e.target.value)}>
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
                <option>Crítica</option>
              </select>
            </div>
            <div className="form-group form-col-span">
              <button type="submit" className="btn btn-primary">
                <PlusCircle size={16} />
                Cadastrar Equipamento
              </button>
            </div>
          </form>
        </article>
      )}

      {/* Barra de Filtros */}
      <div className="filtros-bar">
        <div className="search-wrapper">
          <Search size={15} className="search-icon-inner" />
          <input
            type="text"
            className="input-search"
            placeholder="Pesquisar por nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select className="select-filter" value={filtroSetor} onChange={(e) => setFiltroSetor(e.target.value)}>
          <option value="Todos">Todos os setores</option>
          <option>Usinagem</option>
          <option>Soldagem</option>
          <option>Pintura</option>
          <option>Montagem</option>
          <option>Utilidades</option>
          <option>Estamparia</option>
          <option>Logística</option>
        </select>
        <select className="select-filter" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option value="Todos">Todos os status</option>
          <option>Operacional</option>
          <option>Em Manutenção</option>
          <option>Inativo</option>
        </select>
      </div>

      {/* Tabela de Dados */}
      <article className="card-painel">
        <div className="painel-cabecalho-simples">
          <h3>Inventário de Ativos</h3>
          <span className="contagem-badge">{filtrados.length} equipamentos</span>
        </div>

        {carregando ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
            Carregando inventário da API...
          </div>
        ) : filtrados.length === 0 ? (
          <div className="empty-state">
            Nenhum equipamento encontrado com os filtros aplicados.
          </div>
        ) : (
          <div className="tabela-responsiva">
            <table className="tabela-dados">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Setor</th>
                  <th>Criticidade</th>
                  <th>Status</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((eq) => {
                  const itemId = eq._id || eq.id;
                  return (
                    <tr key={itemId}>
                      <td data-label="Código">
                        <Link to={`/equipamentos/${itemId}`} className="link-acao" style={{ fontWeight: 600 }}>
                          {eq.codigo}
                        </Link>
                      </td>
                      <td data-label="Nome"><strong>{eq.nome}</strong></td>
                      <td data-label="Setor">{eq.setor}</td>
                      <td data-label="Criticidade">
                        <span className={`badge-criticidade ${String(eq.criticidade || 'media').toLowerCase().replace('é', 'e')}`}>
                          {eq.criticidade}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span className={`status ${eq.status === 'Operacional' ? 'status-agendada' : eq.status === 'Em Manutenção' ? 'status-pendente' : 'status-inativo'}`}>
                          {eq.status}
                        </span>
                      </td>
                      <td data-label="Cadastro" style={{ color: '#64748b' }}>
                        {eq.dataCadastro || '—'}
                      </td>
                      <td data-label="Ações">
                        <div className="acoes-celula">
                          <button
                            className="btn-icone btn-toggle"
                            title="Alternar status Operacional / Em Manutenção"
                            onClick={() => handleToggleStatus(itemId)}
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            className="btn-icone btn-danger"
                            title="Excluir equipamento"
                            onClick={() => handleDeleteEquipamento(itemId)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
};

export default Equipamentos;
