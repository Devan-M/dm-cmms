// frontend/src/pages/Ordens.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiRequest } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/ordens.css';

const Ordens: React.FC = () => {
  const [ordens, setOrdens] = useState<any[]>([]);
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados dos filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  // Estados do formulário
  const [showForm, setShowForm] = useState(false);
  const [codigoEquipamento, setCodigoEquipamento] = useState('');
  const [tipo, setTipo] = useState('Preventiva');
  const [prioridade, setPrioridade] = useState('Média');
  const [responsavel, setResponsavel] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [resOrdens, resEquip] = await Promise.allSettled([
        apiRequest('/ordens'),
        apiRequest('/equipamentos'),
      ]);

      if (resOrdens.status === 'fulfilled') {
        const val = resOrdens.value;
        setOrdens(Array.isArray(val) ? val : (val.dados || val.ordens || []));
      }

      if (resEquip.status === 'fulfilled') {
        const val = resEquip.value;
        setEquipamentos(Array.isArray(val) ? val : (val.dados || val.equipamentos || []));
      }
    } catch (err) {
      console.error('Erro ao carregar ordens:', err);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoEquipamento || !descricao.trim()) {
      toast.warning('Selecione um equipamento e informe a descrição!');
      return;
    }

    try {
      await apiRequest('/ordens', {
        method: 'POST',
        data: {
          codigoEquipamento,
          tipo,
          prioridade,
          responsavel: responsavel.trim() || 'Técnico Responsável',
          descricao,
        },
      });

      toast.success('Ordem de Serviço criada com sucesso!');
      setCodigoEquipamento('');
      setTipo('Preventiva');
      setPrioridade('Média');
      setResponsavel('');
      setDescricao('');
      setShowForm(false);
      carregarDados();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar ordem de serviço');
    }
  };

  // Helper para obter o nome legível do equipamento
  const getNomeEquipamento = (os: any) => {
    if (os.nomeEquipamento) return os.nomeEquipamento;
    const eq = equipamentos.find(e => e._id === os.equipamento || e.codigo === os.codigoEquipamento);
    if (eq) return `${eq.codigo} — ${eq.nome}`;
    if (os.codigoEquipamento) return os.codigoEquipamento;
    return 'Equipamento';
  };

  // Formatar data para DD/MM/AAAA
  const formatarData = (val: string | undefined) => {
    if (!val) return '—';
    if (val.includes('/')) return val; // Já está formatada
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      return d.toLocaleDateString('pt-BR');
    } catch {
      return val;
    }
  };

  const filtradas = ordens.filter((os) => {
    const nomeEq = getNomeEquipamento(os).toLowerCase();
    const resp = (os.responsavel || '').toLowerCase();
    const termo = busca.toLowerCase();

    const atendeBusca = nomeEq.includes(termo) || resp.includes(termo);
    const atendeStatus = filtroStatus === 'Todos' || os.status === filtroStatus;
    const atendeTipo = filtroTipo === 'Todos' || os.tipo === filtroTipo;
    return atendeBusca && atendeStatus && atendeTipo;
  });

  const statusClassMap: Record<string, string> = {
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
                value={codigoEquipamento}
                onChange={(e) => setCodigoEquipamento(e.target.value)}
                required
              >
                <option value="">Selecione um equipamento...</option>
                {equipamentos.map((eq) => (
                  <option key={eq._id || eq.id} value={eq.codigo}>
                    {eq.codigo} — {eq.nome} ({eq.setor})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="os-responsavel">Responsável</label>
              <input
                id="os-responsavel"
                type="text"
                placeholder="Nome do técnico responsável..."
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
              <label htmlFor="os-descricao">Descrição / Detalhes do Chamado</label>
              <textarea
                id="os-descricao"
                className="textarea-custom"
                rows={3}
                placeholder="Descreva o problema ou a rotina de manutenção a ser realizada..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
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

      {/* Barra de Filtros */}
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
        <div className="painel-cabecalho-simples" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>Registro de Ordens</h3>
            <span className="contagem-badge">{filtradas.length} ordens</span>
          </div>

          {/* Seletor de registros por página */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            <label htmlFor="itens-por-pagina-ordens">Exibir:</label>
            <select
              id="itens-por-pagina-ordens"
              value={itensPorPagina}
              onChange={(e) => {
                setItensPorPagina(Number(e.target.value));
                setPaginaAtual(1);
              }}
              style={{
                padding: '0.3rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
        </div>

        {carregando ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
            Carregando ordens de serviço da API...
          </div>
        ) : filtradas.length === 0 ? (
          <div className="empty-state">
            Nenhuma ordem de serviço encontrada com os filtros aplicados.
          </div>
        ) : (
          <>
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
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const inicio = (paginaAtual - 1) * itensPorPagina;
                    const paginadas = filtradas.slice(inicio, inicio + itensPorPagina);

                    return paginadas.map((os) => {
                      const numOS = os.numero || String(os.id || os._id || '0').slice(-4);
                      const osId = os._id || os.id;
                      return (
                        <tr key={osId}>
                          <td data-label="Nº OS">
                            <Link to={`/ordens/${osId}`} className="link-acao" style={{ fontWeight: 600 }}>
                              #{numOS}
                            </Link>
                          </td>
                          <td data-label="Equipamento">
                            <strong>{getNomeEquipamento(os)}</strong>
                          </td>
                          <td data-label="Tipo">{os.tipo || 'Corretiva'}</td>
                          <td data-label="Prioridade">
                            <span className={`badge-criticidade ${String(os.prioridade || 'baixa').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                              {os.prioridade || 'Média'}
                            </span>
                          </td>
                          <td data-label="Responsável">{os.responsavel || 'Não atribuído'}</td>
                          <td data-label="Abertura" style={{ color: '#64748b' }}>
                            {formatarData(os.dataAbertura || os.createdAt)}
                          </td>
                          <td data-label="Status">
                            <span className={`status ${statusClassMap[os.status] || 'status-pendente'}`}>
                              {os.status}
                            </span>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginação */}
            {(() => {
              const totalPaginas = Math.ceil(filtradas.length / itensPorPagina) || 1;
              const inicioIndex = filtradas.length === 0 ? 0 : (paginaAtual - 1) * itensPorPagina + 1;
              const fimIndex = Math.min(paginaAtual * itensPorPagina, filtradas.length);

              return (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                  borderTop: '1px solid #f1f5f9',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  fontSize: '0.85rem',
                  color: '#64748b'
                }}>
                  <div>
                    Mostrando <strong>{inicioIndex}</strong> a <strong>{fimIndex}</strong> de <strong>{filtradas.length}</strong> ordens
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                      disabled={paginaAtual === 1}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: paginaAtual === 1 ? '#f8fafc' : '#ffffff',
                        color: paginaAtual === 1 ? '#cbd5e1' : '#334155',
                        cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer'
                      }}
                      title="Página anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <span style={{ padding: '0 0.5rem', fontWeight: 600, color: '#334155' }}>
                      {paginaAtual} de {totalPaginas}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
                      disabled={paginaAtual >= totalPaginas}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: paginaAtual >= totalPaginas ? '#f8fafc' : '#ffffff',
                        color: paginaAtual >= totalPaginas ? '#cbd5e1' : '#334155',
                        cursor: paginaAtual >= totalPaginas ? 'not-allowed' : 'pointer'
                      }}
                      title="Próxima página"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </article>
    </div>
  );
};

export default Ordens;
