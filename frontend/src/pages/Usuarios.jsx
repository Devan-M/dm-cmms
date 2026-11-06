import React, { useEffect, useState } from 'react';
import { PlusCircle, RefreshCw, Save } from 'lucide-react';
import '../styles/usuarios.css';

const API_URL = 'http://localhost:3000/api/usuarios';

async function requisicao(path, options = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.mensagem || 'Não foi possível concluir a operação.');
  }
  return data;
}

function Usuarios() {
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

  const ehAdmin = usuario?.perfil === 'admin';

  const carregarDados = async () => {
    try {
      const resultado = await requisicao('/me');
      setErro('');
      setUsuario(resultado.usuario);
      setPerfil({
        nome: resultado.usuario.nome || '',
        email: resultado.usuario.email || '',
        dataNascimento: resultado.usuario.dataNascimento || '',
      });
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario));

      if (resultado.usuario.perfil === 'admin') {
        const lista = await requisicao('/');
        setUsuarios(lista.usuarios);
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    // API data is loaded after mount to keep the account screen current.
    // oxlint-disable-next-line react(set-state-in-effect)
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
      const resultado = await requisicao('/me', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      setUsuario(resultado.usuario);
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
      setSenhas({ senhaAtual: '', novaSenha: '' });
      setMensagem(resultado.mensagem);
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const criarConta = async (event) => {
    event.preventDefault();
    setMensagem('');
    setErro('');
    setSalvando(true);
    try {
      const resultado = await requisicao('/', {
        method: 'POST',
        body: JSON.stringify(novaConta),
      });
      setNovaConta({
        nome: '',
        email: '',
        dataNascimento: '',
        senha: '',
        perfil: 'tecnico',
      });
      setMensagem(resultado.mensagem);
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const alternarStatus = async (conta) => {
    setMensagem('');
    setErro('');
    try {
      const resultado = await requisicao(`/${conta.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ ativo: !conta.ativo }),
      });
      setMensagem(resultado.mensagem);
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    }
  };

  if (carregando) {
    return <div className="page-content"><p>Carregando conta...</p></div>;
  }

  return (
    <div className="page-content">
      <header className="main-header">
        <div>
          <h2>Minha Conta</h2>
          <p>Configure seus dados e credenciais de acesso.</p>
        </div>
      </header>

      {mensagem && <p className="account-message" role="status">{mensagem}</p>}
      {erro && <p className="account-error" role="alert">{erro}</p>}

      <article className="card-painel">
        <h3>Dados da conta</h3>
        <form className="account-form" onSubmit={salvarConta}>
          <label>
            Nome
            <input
              required
              minLength="3"
              value={perfil.nome}
              onChange={(event) => setPerfil({ ...perfil, nome: event.target.value })}
            />
          </label>
          <label>
            E-mail
            <input
              required
              type="email"
              value={perfil.email}
              onChange={(event) => setPerfil({ ...perfil, email: event.target.value })}
            />
          </label>
          <label>
            Data de nascimento
            <input
              required
              type="date"
              value={perfil.dataNascimento}
              onChange={(event) => setPerfil({ ...perfil, dataNascimento: event.target.value })}
            />
          </label>
          <label>
            Perfil
            <input value={usuario?.perfil || ''} disabled />
          </label>
          <label>
            Senha atual (necessária para trocar a senha)
            <input
              type="password"
              autoComplete="current-password"
              value={senhas.senhaAtual}
              onChange={(event) => setSenhas({ ...senhas, senhaAtual: event.target.value })}
            />
          </label>
          <label>
            Nova senha
            <input
              type="password"
              minLength="6"
              autoComplete="new-password"
              value={senhas.novaSenha}
              onChange={(event) => setSenhas({ ...senhas, novaSenha: event.target.value })}
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={salvando}>
            <Save size={16} />
            Salvar dados
          </button>
        </form>
      </article>

      {ehAdmin && (
        <>
          <article className="card-painel">
            <h3>Cadastrar usuário</h3>
            <form className="account-form" onSubmit={criarConta}>
              <label>
                Nome
                <input
                  required
                  minLength="3"
                  value={novaConta.nome}
                  onChange={(event) => setNovaConta({ ...novaConta, nome: event.target.value })}
                />
              </label>
              <label>
                E-mail
                <input
                  required
                  type="email"
                  value={novaConta.email}
                  onChange={(event) => setNovaConta({ ...novaConta, email: event.target.value })}
                />
              </label>
              <label>
                Data de nascimento
                <input
                  required
                  type="date"
                  value={novaConta.dataNascimento}
                  onChange={(event) => setNovaConta({ ...novaConta, dataNascimento: event.target.value })}
                />
              </label>
              <label>
                Senha inicial
                <input
                  required
                  minLength="6"
                  type="password"
                  autoComplete="new-password"
                  value={novaConta.senha}
                  onChange={(event) => setNovaConta({ ...novaConta, senha: event.target.value })}
                />
              </label>
              <label>
                Perfil
                <select
                  value={novaConta.perfil}
                  onChange={(event) => setNovaConta({ ...novaConta, perfil: event.target.value })}
                >
                  <option value="tecnico">Técnico</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
              <button className="btn btn-primary" type="submit" disabled={salvando}>
                <PlusCircle size={16} />
                Cadastrar
              </button>
            </form>
          </article>

          <article className="card-painel">
            <div className="account-list-heading">
              <h3>Usuários do sistema</h3>
              <button className="btn btn-secondary" type="button" onClick={carregarDados}>
                <RefreshCw size={15} />
                Atualizar
              </button>
            </div>
            <div className="tabela-responsiva">
              <table className="tabela-dados">
                <thead>
                  <tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th><th>Ação</th></tr>
                </thead>
                <tbody>
                  {usuarios.map((conta) => (
                    <tr key={conta.id}>
                      <td data-label="Nome">{conta.nome}</td>
                      <td data-label="E-mail">{conta.email}</td>
                      <td data-label="Perfil">{conta.perfil}</td>
                      <td data-label="Status">{conta.ativo ? 'Ativo' : 'Inativo'}</td>
                      <td data-label="Ação">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          disabled={conta.id === usuario.id}
                          onClick={() => alternarStatus(conta)}
                        >
                          {conta.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </>
      )}
    </div>
  );
}

export default Usuarios;
