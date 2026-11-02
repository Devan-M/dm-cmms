const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const ALGORITMOS_PERMITIDOS = ['HS256'];

const obterSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Falha fechada (fail-closed): nunca usar um segredo fraco/previsível.
    const erro = new Error('Configuração ausente: defina a variável JWT_SECRET');
    erro.status = 500;
    throw erro;
  }
  return secret;
};

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token de autenticação não fornecido'
      });
    }

    const partes = authHeader.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token mal formatado. Formato esperado: Bearer <token>'
      });
    }

    const token = partes[1];
    const secret = obterSecret();

    // Restringe o algoritmo aceito (mitiga "algorithm confusion").
    const decoded = jwt.verify(token, secret, { algorithms: ALGORITMOS_PERMITIDOS });

    // Revalida o usuário no banco a cada request:
    // - usuário apagado, inativo ou bloqueado perde o acesso imediatamente,
    //   mesmo que o token ainda esteja dentro do prazo de validade.
    const usuarioAtual = await Usuario.findById(decoded.id).select('_id email perfil nome ativo bloqueado');
    if (!usuarioAtual) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }
    if (!usuarioAtual.ativo) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Usuário inativo'
      });
    }
    if (usuarioAtual.bloqueado) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Usuário bloqueado'
      });
    }

    // Contrato mantido (id, email, perfil) + nome para o cabeçalho da UI.
    req.usuario = {
      id: usuarioAtual._id,
      email: usuarioAtual.email,
      perfil: usuarioAtual.perfil,
      nome: usuarioAtual.nome
    };

    return next();
  } catch (erro) {
    if (erro && erro.status === 500) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro de configuração no servidor'
      });
    }
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Token inválido ou expirado'
    });
  }
};

module.exports = authMiddleware;
