import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

/**
 * Página: Dashboard
 * Exibe os indicadores gerais do sistema DM-CMMS.
 * Navega para detalhes de equipamentos via parâmetros de rota.
 */
function Dashboard({ equipamentos, ordens }) {
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
        {/* Coluna principal — tabela de últimas OS */}
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
                  {ordens.slice(0, 5).map((os) => (
                    <tr key={os.id}>
                      <td>
                        <Link to={`/ordens/${os.id}`} className="link-acao">
                          #{String(os.id).padStart(4, '0')}
                        </Link>
                      </td>
                      <td>{os.equipamento}</td>
                      <td>{os.tipo}</td>
                      <td>
                        <span className={`badge-criticidade ${os.prioridade?.toLowerCase()}`}>
                          {os.prioridade}
                        </span>
                      </td>
                      <td>
                        <span className={`status status-${os.status === 'Em Aberto' ? 'pendente' : os.status === 'Em Andamento' ? 'andamento' : os.status === 'Concluída' ? 'agendada' : 'inativo'}`}>
                          {os.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {ordens.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                        Nenhuma ordem de serviço cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          {/* Alerta informativo */}
          <article className="card-painel painel-alerta" role="note">
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

        {/* Coluna lateral — equipamentos recentes */}
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
                <li key={eq.id}>
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

          {/* Gráfico CSS de distribuição */}
          <article className="card-painel">
            <div className="painel-cabecalho">
              <div>
                <h3>Distribuição por Tipo</h3>
                <p>Status dos equipamentos</p>
              </div>
            </div>
            <div className="grafico-container">
              <div
                className="donut-chart"
                style={{
                  background: `conic-gradient(
                    #16a34a 0% ${totalEq > 0 ? Math.round((emOperacao / totalEq) * 100) : 50}%,
                    #dc2626 ${totalEq > 0 ? Math.round((emOperacao / totalEq) * 100) : 50}% 100%
                  )`
                }}
              >
                <div className="donut-hole">
                  {totalEq > 0 ? `${Math.round((emOperacao / totalEq) * 100)}%` : '—'}
                </div>
              </div>
              <ul className="legenda-grafico">
                <li><span className="cor-preventiva"></span> Operacionais ({emOperacao})</li>
                <li><span className="cor-corretiva"></span> Em Manutenção ({emManutencao})</li>
              </ul>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}

export default Dashboard;
