import React, { useEffect, useState } from 'react';
import { PlusCircle, RefreshCw, Save } from 'lucide-react';
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

      <div className="usuarios-grid">
        <article className="card-painel">
          <div className="painel-cabecalho-simples">
            <h3>Dados Pessoais</h3>
            <span className="badge-perfil">{usuario?.perfil || 'Usuário'}</span>
          </div>

          <form onSubmit={salvarConta} className="form-usuario">
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

            <button type="submit" className="btn btn-primary" disabled={salvando}>
              <Save size={16} />
              {salvando ? 'Salvando...' : 'Atualizar Meus Dados'}
            </button>
          </form>
        </article>

        {ehAdmin && (
          <article className="card-painel">
            <div className="painel-cabecalho-simples">
              <h3>Cadastrar Novo Usuário</h3>
              <span className="contagem-badge">Apenas Administradores</span>
            </div>

            <form onSubmit={cadastrarUsuario} className="form-usuario">
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

              <button type="submit" className="btn btn-primary" disabled={salvando}>
                <PlusCircle size={16} />
                Cadastrar Usuário
              </button>
            </form>
          </article>
        )}
      </div>

      {ehAdmin && (
        <article className="card-painel" style={{ marginTop: '1.5rem' }}>
          <div className="painel-cabecalho-simples">
            <h3>Usuários Cadastrados</h3>
            <span className="contagem-badge">{usuarios.length} usuários</span>
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
                {usuarios.map((u) => {
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
                })}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </div>
  );
}

export default Usuarios;
