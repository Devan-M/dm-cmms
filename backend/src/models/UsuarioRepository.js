const Usuario = require('./Usuario');

class UsuarioRepository {
  constructor() {
    this.usuarios = new Map(); // Usa Map para armazenar por ID
  }

  /**
   * Cria e armazena um novo usuário
   * @param {string} nome
   * @param {string} dataNascimento
   * @param {string} email
   * @param {string} senha
   * @param {string} perfil
   * @returns {Usuario}
   */
  criar(nome, dataNascimento, email, senha, perfil = 'tecnico') {
    // Verifica se email já existe
    const existente = Array.from(this.usuarios.values()).find(u => u.email === email);
    if (existente) {
      throw new Error('Email já cadastrado');
    }

    const usuario = new Usuario(nome, dataNascimento, email, senha, perfil);
    const validacao = usuario.validar();

    if (!validacao.valido) {
      throw new Error(validacao.erros.join('; '));
    }

    this.usuarios.set(usuario.id, usuario);
    return usuario;
  }

  /**
   * Encontra usuário por ID
   * @param {string} id
   * @returns {Usuario|null}
   */
  encontrarPorId(id) {
    return this.usuarios.get(id) || null;
  }

  /**
   * Encontra usuário por email
   * @param {string} email
   * @returns {Usuario|null}
   */
  encontrarPorEmail(email) {
    return Array.from(this.usuarios.values()).find(u => u.email === email) || null;
  }

  /**
   * Lista todos os usuários (sem senhas)
   * @returns {array}
   */
  listar() {
    return Array.from(this.usuarios.values()).map(u => u.toJSON());
  }

  /**
   * Atualiza um usuário
   * @param {string} id
   * @param {object} dados
   * @returns {Usuario|null}
   */
  atualizar(id, dados) {
    const usuario = this.usuarios.get(id);
    if (!usuario) return null;

    usuario.atualizar(dados);
    return usuario;
  }

  /**
   * Deleta um usuário
   * @param {string} id
   * @returns {boolean}
   */
  deletar(id) {
    return this.usuarios.delete(id);
  }

  /**
   * Autentica um usuário
   * @param {string} email
   * @param {string} senha
   * @returns {object} { sucesso: boolean, usuario: Usuario|null, mensagem: string }
   */
  autenticar(email, senha) {
    const usuario = this.encontrarPorEmail(email);

    if (!usuario) {
      return { sucesso: false, usuario: null, mensagem: 'Usuário não encontrado' };
    }

    if (usuario.bloqueado) {
      return { sucesso: false, usuario: null, mensagem: 'Usuário bloqueado por múltiplas tentativas' };
    }

    if (!usuario.ativo) {
      return { sucesso: false, usuario: null, mensagem: 'Usuário inativo' };
    }

    if (!usuario.validarSenha(senha)) {
      usuario.registrarTentativaFalha();
      return { sucesso: false, usuario: null, mensagem: 'Senha incorreta' };
    }

    usuario.registrarAcesso();
    return { sucesso: true, usuario, mensagem: 'Autenticação bem-sucedida' };
  }

  /**
   * Altera a senha de um usuário
   * @param {string} id
   * @param {string} senhaAtual
   * @param {string} novaSenha
   * @returns {object}
   */
  alterarSenha(id, senhaAtual, novaSenha) {
    const usuario = this.usuarios.get(id);
    if (!usuario) {
      return { sucesso: false, mensagem: 'Usuário não encontrado' };
    }

    if (!usuario.validarSenha(senhaAtual)) {
      return { sucesso: false, mensagem: 'Senha atual incorreta' };
    }

    try {
      usuario.setSenha(novaSenha);
      return { sucesso: true, mensagem: 'Senha alterada com sucesso' };
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message };
    }
  }
}

module.exports = UsuarioRepository;