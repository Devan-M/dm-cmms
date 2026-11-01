const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');

// Rotas públicas
router.post('/', usuarioController.criarUsuario);
router.post('/auth/login', usuarioController.autenticar);

// Rotas protegidas por JWT (exigem header: Authorization: Bearer <token>)
router.get('/', authMiddleware, usuarioController.listarUsuarios);
router.get('/:id', authMiddleware, usuarioController.obterUsuario);
router.put('/:id', authMiddleware, usuarioController.atualizarUsuario);
router.delete('/:id', authMiddleware, usuarioController.deletarUsuario);

module.exports = router;
