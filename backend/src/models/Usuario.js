const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class Usuario {
  constructor(nome, dataNascimento, email, senha, perfil = 'tecnico') {
    this.id = uuidv4();
    this.nome = nome;
    this.dataNascimento = dataNascimento; // formato: YYYY-MM-DD
    this.email = email;
    this.senhaHash = null; // será definida pelo setter
    this.perfil = perfil; // 'admin', 'tecnico', 'supervisor'
    this.ativo = true;
    this.dataCriacao = new Date().toISOString();
    this.dataUltimoAcesso = null;
    this.tentativasLogin = 0;
    this.bloqueado = false;

    // Define a senha (com hash)
    this.setSenha(senha);
  }

  /**
   * Define a senha com hash bcrypt
   * @param {string} senha - Senha em texto plano
   */
  setSenha(senha) {
    if (!senha || senha.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }
    const salt = bcrypt.genSaltSync(10);
    this.senhaHash = bcrypt.hashSync(senha, salt);
  }

  /**
   * Valida a senha contra o hash armazenado
   * @param {string} senha - Senha em texto plano
   * @returns {boolean}
   */
  validarSenha(senha) {
    return bcrypt.compareSync(senha, this.senhaHash);
  }

  /**
   * Obtém a idade do usuário
   * @returns {number}
   */
  obterIdade() {
    const hoje = new Date();
    const nascimento = new Date(this.dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  }

  /**
   * Registra um acesso bem-sucedido
   */
  registrarAcesso() {
    this.dataUltimoAcesso = new Date().toISOString();
    this.tentativasLogin = 0;
    this.bloqueado = false;
  }

  /**
   * Registra uma tentativa de login falha
   * Bloqueia após 5 tentativas
   */
  registrarTentativaFalha() {
    this.tentativasLogin++;
    if (this.tentativasLogin >= 5) {
      this.bloqueado = true;
    }
  }

  /**
   * Desbloqueia o usuário
   */
  desbloquear() {
    this.bloqueado = false;
    this.tentativasLogin = 0;
  }

  /**
   * Retorna os dados do usuário sem a senha
   * @returns {object}
   */
  toJSON() {
    const { senhaHash, ...dados } = this;
    return dados;
  }

  /**
   * Valida os dados obrigatórios
   * @returns {object} { valido: boolean, erros: array }
   */
  validar() {
    const erros = [];

    if (!this.nome || this.nome.trim().length < 3) {
      erros.push('Nome deve ter no mínimo 3 caracteres');
    }

    if (!this.dataNascimento || isNaN(new Date(this.dataNascimento).getTime())) {
      erros.push('Data de nascimento inválida (use YYYY-MM-DD)');
    }

    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      erros.push('Email inválido');
    }

    if (this.obterIdade() < 18) {
      erros.push('Usuário deve ter no mínimo 18 anos');
    }

    return {
      valido: erros.length === 0,
      erros
    };
  }

  /**
   * Atualiza dados do usuário (exceto senha e ID)
   * @param {object} dados
   */
  atualizar(dados) {
    const camposPermitidos = ['nome', 'dataNascimento', 'email', 'perfil', 'ativo'];

    camposPermitidos.forEach(campo => {
      if (dados[campo] !== undefined) {
        this[campo] = dados[campo];
      }
    });
  }
}

module.exports = Usuario;