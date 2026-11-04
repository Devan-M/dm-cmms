import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Trash2, RefreshCw } from 'lucide-react';
import '../styles/equipamentos.css';

/**
 * Página: Equipamentos
 * Lista todos os equipamentos, permite cadastrar novos,
 * alterar status e excluir.
 * Navega para detalhes via Link com parâmetros de rota.
 */
function Equipamentos({ equipments: equipamentos, onAdd, onToggle, onDelete }) {
  const [busca, setBusca] = useState('');
  const [filtroSetor, setFiltroSetor] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // --- Formulário de novo equipamento ---
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [setor, setSetor] = useState('Usinagem');
  const [criticidade, setCriticidade] = useState('Média');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !codigo.trim()) {
      alert('Por favor, preencha o nome e o código do equipamento!');
      return;
    }
    onAdd({
      id: Date.now(),
      nome,
      codigo: codigo.toUpperCase(),
      setor,
      criticidade,
      status: 'Operacional',
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
    });
    setNome('');
    setCodigo('');
    setSetor('Usinagem');
    setCriticidade('Média');
    setShowForm(false);
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

      {/* Formulário de Cadastro (colapsável) */}
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

      {/* Filtros */}
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

      {/* Tabela */}
      <article className="card-painel">
        <div className="painel-cabecalho-simples">
          <h3>Inventário de Ativos</h3>
          <span className="contagem-badge">{filtrados.length} equipamentos</span>
        </div>
        {filtrados.length === 0 ? (
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
                {filtrados.map((eq) => (
                  <tr key={eq.id}>
                    <td>
                      <Link to={`/equipamentos/${eq.id}`} className="link-acao">
                        {eq.codigo}
                      </Link>
                    </td>
                    <td><strong>{eq.nome}</strong></td>
                    <td>{eq.setor}</td>
                    <td>
                      <span className={`badge-criticidade ${eq.criticidade?.toLowerCase().replace('é', 'e')}`}>
                        {eq.criticidade}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${eq.status === 'Operacional' ? 'status-agendada' : eq.status === 'Em Manutenção' ? 'status-pendente' : 'status-inativo'}`}>
                        {eq.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>{eq.dataCadastro}</td>
                    <td>
                      <div className="acoes-celula">
                        <button
                          className="btn-icone btn-toggle"
                          title="Alterar status"
                          onClick={() => onToggle(eq.id)}
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          className="btn-icone btn-danger"
                          title="Excluir equipamento"
                          onClick={() => {
                            if (window.confirm('Deseja realmente remover este ativo?')) onDelete(eq.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}

export default Equipamentos;
