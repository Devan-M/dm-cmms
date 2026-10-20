const Usuario = require('../models/Usuario');
const UsuarioRepository = require('../models/UsuarioRepository');

const repo = new UsuarioRepository();

// Dados iniciais para teste
repo.criar('Admin Sistema', '1990-05-15', 'admin@dmcmms.com', 'Admin@123', 'admin');
repo.criar('Carlos Menezes', '1985-08-22', 'carlos@dmcmms.com', 'Carlos@123', 'tecnico');
repo.criar('Rafael Souza', '1992-03-10', 'rafael@dmcmms.com', 'Rafael@123', 'tecnico');

const criarUsuario = (req, res) => {
  try {
    const { nome, dataNascimento, email, senha, perfil } = req.body;

    if (!nome || !dataNascimento || !email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, data de nascimento, email e senha são obrigatórios'
      });
    }

    const usuario = repo.criar(nome, dataNascimento, email, senha, perfil);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário criado com sucesso',
      usuario: usuario.toJSON()
    });
  } catch (erro) {
    res.status(400).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

const listarUsuarios = (req, res) => {
  try {
    const usuarios = repo.listar();
    res.json({
      sucesso: true,
      total: usuarios.length,
      usuarios
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

const obterUsuario = (req, res) => {
  try {
    const { id } = req.params;
    const usuario = repo.encontrarPorId(id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    res.json({
      sucesso: true,
      usuario: usuario.toJSON()
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

const atualizarUsuario = (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const usuario = repo.atualizar(id, dados);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Usuário atualizado com sucesso',
      usuario: usuario.toJSON()
    });
  } catch (erro) {
    res.status(400).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

const deletarUsuario = (req, res) => {
  try {
    const { id } = req.params;
    const deletado = repo.deletar(id);

    if (!deletado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Usuário deletado com sucesso'
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

const autenticar = (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email e senha são obrigatórios'
      });
    }

    const resultado = repo.autenticar(email, senha);

    if (!resultado.sucesso) {
      return res.status(401).json({
        sucesso: false,
        mensagem: resultado.mensagem
      });
    }

    res.json({
      sucesso: true,
      mensagem: resultado.mensagem,
      usuario: resultado.usuario.toJSON()
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

const alterarSenha = (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Senha atual e nova senha são obrigatórias'
      });
    }

    const resultado = repo.alterarSenha(id, senhaAtual, novaSenha);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    res.json(resultado);
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

module.exports = {
  criarUsuario,
  listarUsuarios,
  obterUsuario,
  atualizarUsuario,
  deletarUsuario,
  autenticar,
  alterarSenha,
  repo // Exporta o repositório para testes
};