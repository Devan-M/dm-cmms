const express = require('express');
const router = express.Router();
const equipamentoController = require('../controllers/equipamentoController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas de equipamentos requerem autenticação JWT
router.use(authMiddleware);

router.post('/', equipamentoController.criarEquipamento);
router.get('/', equipamentoController.listarEquipamentos);
router.get('/:id', equipamentoController.obterEquipamento);
router.put('/:id', equipamentoController.atualizarEquipamento);
router.delete('/:id', equipamentoController.deletarEquipamento);

module.exports = router;
