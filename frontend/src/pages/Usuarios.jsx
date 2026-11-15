import React, { useEffect, useState } from 'react';
import { PlusCircle, RefreshCw, Save, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiRequest } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/usuarios.css';

function Usuarios() {
  const { user: userContext } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [perfil, setPerfil] = useState({ nome: '', email: '', dataNascimento: '' });
  const [senhas, setSenhas] = useState({ senhaAtual: '', novaSenha: '' });
  const [novaConta, setNovaConta] = useState({
    nome: '',
    email: '',
    dataNascimento: '',
    senha: '',
    perfil: 'tecnico',
  });
  const [expandirCadastro, setExpandirCadastro] = useState(false);
  const [expandirDados, setExpandirDados] = useState(false);

  // Estados de paginação para Usuários Cadastrados
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  const ehAdmin = usuario?.perfil === 'admin' || userContext?.perfil === 'admin';

  const formatarDataInput = (dataRaw) => {
    if (!dataRaw) return '';
    try {
      const d = new Date(dataRaw);
      if (isNaN(d.getTime())) return dataRaw;
      return d.toISOString().slice(0, 10);
    } catch {
      return dataRaw;
    }
  };

  const carregarDados = async () => {
    try {
      setErro('');
      // Usa o apiRequest centralizado com token automático
      const resultado = await apiRequest('/usuarios/me');
      const usr = resultado.usuario || resultado;
      setUsuario(usr);
      setPerfil({
        nome: usr.nome || '',
        email: usr.email || '',
        dataNascimento: formatarDataInput(usr.dataNascimento),
      });

      if (usr.perfil === 'admin') {
        const lista = await apiRequest('/usuarios');
        setUsuarios(lista.usuarios || lista || []);
      }
    } catch (error) {
      setErro(error.message || 'Erro ao carregar dados do usuário');
      // Fallback para o usuário do contexto se existir
      if (userContext) {
        setUsuario(userContext);
        setPerfil({
          nome: userContext.nome || '',
          email: userContext.email || '',
          dataNascimento: '',
        });
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const salvarConta = async (event) => {
    event.preventDefault();
    setMensagem('');
    setErro('');
    setSalvando(true);
    try {
      const body = { ...perfil };
      if (senhas.novaSenha) {
        body.senhaAtual = senhas.senhaAtual;
        body.novaSenha = senhas.novaSenha;
      }
      const resultado = await apiRequest('/usuarios/me', {
        method: 'PUT',
        data: body,
      });

      setMensagem('Dados atualizados com sucesso.');
      setUsuario(resultado.usuario || { ...usuario, ...perfil });
      setSenhas({ senhaAtual: '', novaSenha: '' });
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const cadastrarUsuario = async (event) => {
    event.preventDefault();
    setMensagem('');
    setErro('');
    setSalvando(true);
    try {
      await apiRequest('/usuarios', {
        method: 'POST',
        data: novaConta,
      });

      setMensagem('Usuário cadastrado com sucesso.');
      setNovaConta({
        nome: '',
        email: '',
        dataNascimento: '',
        senha: '',
        perfil: 'tecnico',
      });
      const lista = await apiRequest('/usuarios');
      setUsuarios(lista.usuarios || lista || []);
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const alternarStatus = async (item) => {
    setMensagem('');
    setErro('');
    try {
      const novoAtivo = !item.ativo;
      await apiRequest(`/usuarios/${item.id || item._id}/status`, {
        method: 'PATCH',
        data: { ativo: novoAtivo },
      });

      setUsuarios((prev) =>
        prev.map((u) => (u.id === item.id || u._id === item._id ? { ...u, ativo: novoAtivo } : u))
      );
      setMensagem(`Status de ${item.nome} atualizado.`);
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="page-content">
      <div className="main-header">
        <div>
          <h2>Minha Conta</h2>
          <p>Gerencie seus dados de acesso e preferências do sistema</p>
        </div>
      </div>

      {mensagem && <div className="alerta-sucesso" style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px' }}>{mensagem}</div>}
      {erro && <div className="alerta-erro" style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>{erro}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <article className="card-painel">
          <div 
            className="painel-cabecalho-simples" 
            onClick={() => setExpandirDados(!expandirDados)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>Dados Pessoais</h3>
              <span className="badge-perfil">{usuario?.perfil || 'Usuário'}</span>
            </div>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              {expandirDados ? (
                <>
                  Recolher <ChevronUp size={18} />
                </>
              ) : (
                <>
                  Expandir <ChevronDown size={18} />
                </>
              )}
            </button>
          </div>

          {expandirDados && (
            <form onSubmit={salvarConta} className="form-usuario" style={{ marginTop: '1.25rem' }}>
              <div className="form-group">
                <label htmlFor="usr-nome">Nome Completo</label>
                <input
                  id="usr-nome"
                  type="text"
                  value={perfil.nome}
                  onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="usr-email">E-mail</label>
                <input
                  id="usr-email"
                  type="email"
                  value={perfil.email}
                  onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="usr-nascimento">Data de Nascimento</label>
                <input
                  id="usr-nascimento"
                  type="date"
                  value={perfil.dataNascimento}
                  onChange={(e) => setPerfil({ ...perfil, dataNascimento: e.target.value })}
                />
              </div>

              <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0' }} />

              <div className="form-group">
                <label htmlFor="usr-senha-atual">Senha Atual (apenas para trocar de senha)</label>
                <input
                  id="usr-senha-atual"
                  type="password"
                  placeholder="Digite para confirmar alteração"
                  value={senhas.senhaAtual}
                  onChange={(e) => setSenhas({ ...senhas, senhaAtual: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="usr-nova-senha">Nova Senha</label>
                <input
                  id="usr-nova-senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={senhas.novaSenha}
                  onChange={(e) => setSenhas({ ...senhas, novaSenha: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" disabled={salvando}>
                  <Save size={16} />
                  {salvando ? 'Salvando...' : 'Atualizar Meus Dados'}
                </button>
              </div>
            </form>
          )}
        </article>

        {ehAdmin && (
          <article className="card-painel">
            <div 
              className="painel-cabecalho-simples" 
              onClick={() => setExpandirCadastro(!expandirCadastro)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h3 style={{ margin: 0 }}>Cadastrar Novo Usuário</h3>
                <span className="contagem-badge">Apenas Administradores</span>
              </div>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                {expandirCadastro ? (
                  <>
                    Recolher <ChevronUp size={18} />
                  </>
                ) : (
                  <>
                    Expandir <ChevronDown size={18} />
                  </>
                )}
              </button>
            </div>

            {expandirCadastro && (
              <form onSubmit={cadastrarUsuario} className="form-usuario" style={{ marginTop: '1.25rem' }}>
                <div className="form-group">
                  <label htmlFor="novo-nome">Nome</label>
                  <input
                    id="novo-nome"
                    type="text"
                    value={novaConta.nome}
                    onChange={(e) => setNovaConta({ ...novaConta, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="novo-email">E-mail</label>
                  <input
                    id="novo-email"
                    type="email"
                    value={novaConta.email}
                    onChange={(e) => setNovaConta({ ...novaConta, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="novo-nasc">Data de Nascimento</label>
                  <input
                    id="novo-nasc"
                    type="date"
                    value={novaConta.dataNascimento}
                    onChange={(e) => setNovaConta({ ...novaConta, dataNascimento: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="novo-perfil">Perfil de Acesso</label>
                  <select
                    id="novo-perfil"
                    value={novaConta.perfil}
                    onChange={(e) => setNovaConta({ ...novaConta, perfil: e.target.value })}
                  >
                    <option value="tecnico">Técnico</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="novo-senha">Senha Provisória</label>
                  <input
                    id="novo-senha"
                    type="password"
                    value={novaConta.senha}
                    onChange={(e) => setNovaConta({ ...novaConta, senha: e.target.value })}
                    required
                  />
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary" disabled={salvando}>
                    <PlusCircle size={16} />
                    Cadastrar Usuário
                  </button>
                </div>
              </form>
            )}
          </article>
        )}
        {ehAdmin && (
          <article className="card-painel">
            <div className="painel-cabecalho-simples" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h3 style={{ margin: 0 }}>Usuários Cadastrados</h3>
                <span className="contagem-badge">{usuarios.length} usuários</span>
              </div>

              {/* Seletor de registros por página */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                <label htmlFor="itens-por-pagina">Exibir:</label>
                <select
                  id="itens-por-pagina"
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

            <div className="tabela-responsiva">
              <table className="tabela-dados">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Perfil</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const totalPaginas = Math.ceil(usuarios.length / itensPorPagina) || 1;
                    const inicio = (paginaAtual - 1) * itensPorPagina;
                    const listaPaginada = usuarios.slice(inicio, inicio + itensPorPagina);

                    if (listaPaginada.length === 0) {
                      return (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
                            Nenhum usuário cadastrado.
                          </td>
                        </tr>
                      );
                    }

                    return listaPaginada.map((u) => {
                      const uid = u.id || u._id;
                      return (
                        <tr key={uid}>
                          <td><strong>{u.nome}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className="badge-perfil">{u.perfil}</span>
                          </td>
                          <td>
                            <span className={`status ${u.ativo ? 'status-agendada' : 'status-inativo'}`}>
                              {u.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-icone btn-toggle"
                              title="Alternar Ativo/Inativo"
                              onClick={() => alternarStatus(u)}
                            >
                              <RefreshCw size={14} />
                            </button>
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
              const totalPaginas = Math.ceil(usuarios.length / itensPorPagina) || 1;
              const inicioIndex = usuarios.length === 0 ? 0 : (paginaAtual - 1) * itensPorPagina + 1;
              const fimIndex = Math.min(paginaAtual * itensPorPagina, usuarios.length);

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
                    Mostrando <strong>{inicioIndex}</strong> a <strong>{fimIndex}</strong> de <strong>{usuarios.length}</strong> usuários
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
          </article>
        )}
      </div>
    </div>
  );
}

export default Usuarios;
