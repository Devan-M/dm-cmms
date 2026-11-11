const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
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
    const secret = process.env.JWT_SECRET || 'dm_cmms_jwt_secret_key_2026';

    const decoded = jwt.verify(token, secret);
    req.usuario = decoded;

    return next();
  } catch (erro) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Token inválido ou expirado'
    });
  }
};

module.exports = authMiddleware;
