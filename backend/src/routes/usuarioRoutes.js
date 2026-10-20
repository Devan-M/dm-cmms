const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// POST - Criar novo usuário
router.post('/', usuarioController.criarUsuario);

// GET - Listar todos os usuários
router.get('/', usuarioController.listarUsuarios);

// GET - Obter usuário por ID
router.get('/:id', usuarioController.obterUsuario);

// PUT - Atualizar usuário
router.put('/:id', usuarioController.atualizarUsuario);

// DELETE - Deletar usuário
router.delete('/:id', usuarioController.deletarUsuario);

// POST - Autenticar usuário
router.post('/auth/login', usuarioController.autenticar);

// POST - Alterar senha
router.post('/:id/alterar-senha', usuarioController.alterarSenha);

module.exports = router;