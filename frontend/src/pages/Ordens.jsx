import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import '../styles/ordens.css';

/**
 * Página: Ordens de Serviço
 * Lista OS com filtros. Navega para detalhes via parâmetros de rota.
 */
function Ordens({ ordens, equipamentos, onAddOrdem }) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [showForm, setShowForm] = useState(false);

  // Estado do formulário de nova OS
  const [equipamentoId, setEquipamentoId] = useState('');
  const [tipo, setTipo] = useState('Preventiva');
  const [prioridade, setPrioridade] = useState('Média');
  const [responsavel, setResponsavel] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!equipamentoId || !responsavel.trim()) {
      alert('Selecione um equipamento e informe o responsável!');
      return;
    }
    const eq = equipamentos.find((e) => String(e.id) === String(equipamentoId));
    onAddOrdem({
      id: Date.now(),
      equipamento: eq?.nome || '—',
      equipamentoId,
      tipo,
      prioridade,
      status: 'Em Aberto',
      responsavel,
      descricao,
      dataAbertura: new Date().toLocaleDateString('pt-BR'),
    });
    setEquipamentoId('');
    setTipo('Preventiva');
    setPrioridade('Média');
    setResponsavel('');
    setDescricao('');
    setShowForm(false);
  };

  const filtradas = ordens.filter((os) => {
    const atendeBusca =
      os.equipamento?.toLowerCase().includes(busca.toLowerCase()) ||
      os.responsavel?.toLowerCase().includes(busca.toLowerCase());
    const atendeStatus = filtroStatus === 'Todos' || os.status === filtroStatus;
    const atendeTipo = filtroTipo === 'Todos' || os.tipo === filtroTipo;
    return atendeBusca && atendeStatus && atendeTipo;
  });

  const statusClassMap = {
    'Em Aberto': 'status-pendente',
    'Em Andamento': 'status-andamento',
    'Concluída': 'status-agendada',
    'Cancelada': 'status-inativo',
    'Pendente': 'status-pendente',
  };

  return (
    <div className="page-content">
      <div className="main-header">
        <div>
          <h2>Ordens de Serviço</h2>
          <p>Gestão e acompanhamento de ordens de manutenção</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          <PlusCircle size={16} />
          {showForm ? 'Cancelar' : 'Nova OS'}
        </button>
      </div>

      {/* Formulário de nova OS */}
      {showForm && (
        <article className="card-painel form-painel-os">
          <h3 className="form-painel-titulo">Abrir Nova Ordem de Serviço</h3>
          <form className="form-os-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="os-equipamento">Equipamento</label>
              <select
                id="os-equipamento"
                value={equipamentoId}
                onChange={(e) => setEquipamentoId(e.target.value)}
              >
                <option value="">Selecione um equipamento...</option>
                {equipamentos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.codigo} — {eq.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="os-responsavel">Responsável</label>
              <input
                id="os-responsavel"
                type="text"
                placeholder="Nome do técnico..."
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="os-tipo">Tipo</label>
              <select id="os-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Preventiva</option>
                <option>Corretiva</option>
                <option>Preditiva</option>
                <option>Inspeção</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="os-prioridade">Prioridade</label>
              <select id="os-prioridade" value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>

            <div className="form-group os-col-full">
              <label htmlFor="os-descricao">Descrição / Observações</label>
              <textarea
                id="os-descricao"
                className="textarea-custom"
                rows="3"
                placeholder="Descreva o serviço a ser realizado..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="os-col-full">
              <button type="submit" className="btn btn-primary">
                <PlusCircle size={16} />
                Abrir Ordem de Serviço
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
            placeholder="Pesquisar por equipamento ou responsável..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select className="select-filter" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option value="Todos">Todos os status</option>
          <option>Em Aberto</option>
          <option>Em Andamento</option>
          <option>Concluída</option>
          <option>Cancelada</option>
        </select>
        <select className="select-filter" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="Todos">Todos os tipos</option>
          <option>Preventiva</option>
          <option>Corretiva</option>
          <option>Preditiva</option>
          <option>Inspeção</option>
        </select>
      </div>

      {/* Tabela de OS */}
      <article className="card-painel">
        <div className="painel-cabecalho-simples">
          <h3>Registro de Ordens</h3>
          <span className="contagem-badge">{filtradas.length} ordens</span>
        </div>

        {filtradas.length === 0 ? (
          <div className="empty-state">
            Nenhuma ordem de serviço encontrada com os filtros aplicados.
          </div>
        ) : (
          <div className="tabela-responsiva">
            <table className="tabela-dados">
              <thead>
                <tr>
                  <th>Nº OS</th>
                  <th>Equipamento</th>
                  <th>Tipo</th>
                  <th>Prioridade</th>
                  <th>Responsável</th>
                  <th>Abertura</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((os) => (
                  <tr key={os.id}>
                    <td>
                      <Link to={`/ordens/${os.id}`} className="link-acao">
                        #{String(os.id).slice(-4).padStart(4, '0')}
                      </Link>
                    </td>
                    <td><strong>{os.equipamento}</strong></td>
                    <td>{os.tipo}</td>
                    <td>
                      <span className={`badge-criticidade ${os.prioridade?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                        {os.prioridade}
                      </span>
                    </td>
                    <td>{os.responsavel}</td>
                    <td style={{ color: '#64748b' }}>{os.dataAbertura}</td>
                    <td>
                      <span className={`status ${statusClassMap[os.status] || 'status-inativo'}`}>
                        {os.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/ordens/${os.id}`} className="link-acao" style={{ fontSize: '0.8rem' }}>
                        Detalhes →
                      </Link>
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

export default Ordens;
