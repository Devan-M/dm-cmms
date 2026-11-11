// frontend/src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [ordens, setOrdens] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        const [resEquip, resOrdens] = await Promise.allSettled([
          apiRequest('/equipamentos'),
          apiRequest('/ordens'),
        ]);

        let listaEquip: any[] = [];
        if (resEquip.status === 'fulfilled') {
          const val = resEquip.value;
          listaEquip = Array.isArray(val) ? val : (val.dados || val.equipamentos || []);
          setEquipamentos(listaEquip);
        }

        if (resOrdens.status === 'fulfilled') {
          const val = resOrdens.value;
          setOrdens(Array.isArray(val) ? val : (val.dados || val.ordens || []));
        }
      } catch (erro) {
        console.error('Erro ao carregar dados do dashboard:', erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // Helper para resolver o nome do equipamento de forma amigável
  const getNomeEquipamento = (os: any) => {
    if (os.nomeEquipamento) return os.nomeEquipamento;
    const eq = equipamentos.find(e => e._id === os.equipamento || e.codigo === os.codigoEquipamento);
    if (eq) return `${eq.codigo} — ${eq.nome}`;
    if (os.codigoEquipamento) return os.codigoEquipamento;
    return 'Equipamento';
  };

  const totalEq = equipamentos.length;
  const emOperacao = equipamentos.filter((e) => e.status === 'Operacional').length;
  const emManutencao = equipamentos.filter((e) => e.status === 'Em Manutenção').length;
  const osAbertas = ordens.filter((o) => o.status === 'Em Aberto' || o.status === 'Em Andamento').length;

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page-content">
      <div className="main-header">
        <div>
          <h2>Dashboard</h2>
          <p>Visão geral do sistema de manutenção — {hoje}</p>
        </div>
      </div>

      {carregando ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Carregando indicadores da API...
        </div>
      ) : (
        <>
          {/* Grid de Indicadores */}
          <section className="indicadores-grid" aria-label="Indicadores do dashboard">
            <article className="indicador-card">
              <div>
                <p className="indicador-label">Total Equipamentos</p>
                <p className="indicador-valor">{totalEq}</p>
                <span className="indicador-descricao">Ativos no sistema</span>
              </div>
              <span className="indicador-icone eq" aria-hidden="true">EQ</span>
            </article>

            <article className="indicador-card">
              <div>
                <p className="indicador-label">OS Abertas</p>
                <p className="indicador-valor">{osAbertas}</p>
                <span className="indicador-descricao">Requerem atenção</span>
              </div>
              <span className="indicador-icone os" aria-hidden="true">OS</span>
            </article>

            <article className="indicador-card">
              <div>
                <p className="indicador-label">Em Operação</p>
                <p className="indicador-valor" style={{ color: '#16a34a' }}>{emOperacao}</p>
                <span className="indicador-descricao">Equipamentos operacionais</span>
              </div>
              <span className="indicador-icone pv" aria-hidden="true">OP</span>
            </article>

            <article className="indicador-card">
              <div>
                <p className="indicador-label">Em Manutenção</p>
                <p className="indicador-valor" style={{ color: '#dc2626' }}>{emManutencao}</p>
                <span className="indicador-descricao">Aguardando retorno</span>
              </div>
              <span className="indicador-icone mt" aria-hidden="true">MT</span>
            </article>
          </section>

          {/* Layout em 2 colunas */}
          <section className="dashboard-grid-layout">
            <div>
              <article className="card-painel">
                <div className="painel-cabecalho">
                  <div>
                    <h3>Ordens de Serviço Recentes</h3>
                    <p>Últimas movimentações do sistema</p>
                  </div>
                  <Link className="link-acao" to="/ordens">Ver todas</Link>
                </div>
                <div className="tabela-responsiva">
                  <table className="tabela-dados">
                    <thead>
                      <tr>
                        <th>Nº OS</th>
                        <th>Equipamento</th>
                        <th>Tipo</th>
                        <th>Prioridade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordens.slice(0, 5).map((os) => {
                        const numOS = os.numero || String(os.id || os._id || '0').slice(-4);
                        return (
                          <tr key={os._id || os.id}>
                            <td data-label="Nº OS">
                              <Link to="/ordens" className="link-acao">
                                #{numOS}
                              </Link>
                            </td>
                            <td data-label="Equipamento">
                              <strong>{getNomeEquipamento(os)}</strong>
                            </td>
                            <td data-label="Tipo">{os.tipo || 'Corretiva'}</td>
                            <td data-label="Prioridade">
                              <span className={`badge-criticidade ${String(os.prioridade || 'Baixa').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                                {os.prioridade || 'Normal'}
                              </span>
                            </td>
                            <td data-label="Status">
                              <span className={`status status-${os.status === 'Em Aberto' ? 'pendente' : os.status === 'Em Andamento' ? 'andamento' : 'agendada'}`}>
                                {os.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {ordens.length === 0 && (
                        <tr>
                          <td data-empty-state colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                            Nenhuma ordem de serviço cadastrada.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="card-painel painel-alerta" role="note" style={{ marginTop: '1.5rem' }}>
                <div className="alerta-icone" aria-hidden="true">!</div>
                <div>
                  <h3>Atenção à manutenção preventiva</h3>
                  <p>
                    A realização das inspeções e rotinas preventivas ajuda a reduzir
                    paradas não planejadas e aumenta a disponibilidade dos equipamentos.
                  </p>
                </div>
              </article>
            </div>

            <aside className="dashboard-coluna-lateral">
              <article className="card-painel">
                <div className="painel-cabecalho">
                  <div>
                    <h3>Equipamentos Recentes</h3>
                    <p>Últimos ativos cadastrados</p>
                  </div>
                  <Link className="link-acao" to="/equipamentos">Ver todos</Link>
                </div>
                <ul className="lista-atividades">
                  {equipamentos.slice(0, 6).map((eq) => (
                    <li key={eq.id || eq._id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{eq.nome}</strong>
                          <br />
                          <span>{eq.codigo} — {eq.setor}</span>
                        </div>
                        <span className={`status ${eq.status === 'Operacional' ? 'status-agendada' : 'status-pendente'}`}>
                          {eq.status}
                        </span>
                      </div>
                    </li>
                  ))}
                  {equipamentos.length === 0 && (
                    <li style={{ color: '#94a3b8', textAlign: 'center' }}>
                      Nenhum equipamento cadastrado.
                    </li>
                  )}
                </ul>
              </article>
            </aside>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
