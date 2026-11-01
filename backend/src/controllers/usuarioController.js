const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const gerarToken = (usuario) => {
  const secret = process.env.JWT_SECRET || 'dm_cmms_jwt_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  return jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      perfil: usuario.perfil
    },
    secret,
    { expiresIn }
  );
};

// POST - Criar novo usuário (Público / Registro)
const criarUsuario = async (req, res) => {
  try {
    const { nome, dataNascimento, email, senha, perfil } = req.body;

    if (!nome || !dataNascimento || !email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, data de nascimento, email e senha são obrigatórios'
      });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email já cadastrado'
      });
    }

    const usuario = await Usuario.create({
      nome,
      dataNascimento,
      email,
      senha,
      perfil
    });

    const token = gerarToken(usuario);

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário criado com sucesso',
      usuario: usuario.toJSON(),
      token
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// POST - Login / Autenticação (Gera Token JWT)
const autenticar = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email e senha são obrigatórios'
      });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais inválidas'
      });
    }

    if (usuario.bloqueado) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Usuário bloqueado por múltiplas tentativas'
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Usuário inativo'
      });
    }

    const senhaValida = await usuario.validarSenha(senha);

    if (!senhaValida) {
      await usuario.registrarTentativaFalha();
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais inválidas'
      });
    }

    await usuario.registrarAcesso();
    const token = gerarToken(usuario);

    return res.json({
      sucesso: true,
      mensagem: 'Autenticação bem-sucedida',
      token,
      usuario: usuario.toJSON()
    });
  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// GET - Listar todos os usuários (Protegido por JWT)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    return res.json({
      sucesso: true,
      total: usuarios.length,
      usuarios: usuarios.map(u => u.toJSON())
    });
  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// GET - Obter usuário por ID (Protegido por JWT)
const obterUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    return res.json({
      sucesso: true,
      usuario: usuario.toJSON()
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID inválido ou erro na busca'
    });
  }
};

// PUT - Atualizar usuário (Protegido por JWT)
const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    delete dados.senha; // Atualização de senha deve ter rota própria

    const usuario = await Usuario.findByIdAndUpdate(id, dados, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    return res.json({
      sucesso: true,
      mensagem: 'Usuário atualizado com sucesso',
      usuario: usuario.toJSON()
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// DELETE - Deletar usuário (Protegido por JWT)
const deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    return res.json({
      sucesso: true,
      mensagem: 'Usuário deletado com sucesso'
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID inválido ou erro ao deletar'
    });
  }
};

module.exports = {
  criarUsuario,
  autenticar,
  listarUsuarios,
  obterUsuario,
  atualizarUsuario,
  deletarUsuario
};
