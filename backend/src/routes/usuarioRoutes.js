const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');

// Guarda RBAC: exige um perfil específico (aplicar SEMPRE após o authMiddleware).
const exigirPerfil = (perfilObrigatorio) => (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ sucesso: false, mensagem: 'Autenticação necessária' });
  }
  if (req.usuario.perfil !== perfilObrigatorio) {
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Acesso negado: perfil insuficiente para esta operação'
    });
  }
  return next();
};

// Guarda anti-IDOR: o usuário pode acessar a si mesmo; admin acessa qualquer um.
const selfOuAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ sucesso: false, mensagem: 'Autenticação necessária' });
  }
  const ehAdmin = req.usuario.perfil === 'admin';
  const ehProprio = String(req.usuario.id) === String(req.params.id);
  if (!ehAdmin && !ehProprio) {
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Acesso negado: você só pode acessar seu próprio perfil'
    });
  }
  return next();
};

// Rota pública: APENAS o login (única porta de entrada do sistema).
router.post('/auth/login', usuarioController.autenticar);

// Rotas protegidas por JWT (exigem header: Authorization: Bearer <token>)
// O CRUD de usuários é operação sensível: exclusivo de ADMIN.
router.post('/', authMiddleware, exigirPerfil('admin'), usuarioController.criarUsuario);
router.get('/', authMiddleware, exigirPerfil('admin'), usuarioController.listarUsuarios);
router.get('/:id', authMiddleware, selfOuAdmin, usuarioController.obterUsuario);
router.put('/:id', authMiddleware, exigirPerfil('admin'), usuarioController.atualizarUsuario);
router.delete('/:id', authMiddleware, exigirPerfil('admin'), usuarioController.deletarUsuario);

module.exports = router;
