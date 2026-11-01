const express = require('express');
const router = express.Router();
const ordemController = require('../controllers/ordemController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas de ordens requerem autenticação JWT
router.use(authMiddleware);

router.post('/', ordemController.criarOrdem);
router.get('/', ordemController.listarOrdens);
router.get('/:id', ordemController.obterOrdem);
router.put('/:id', ordemController.atualizarOrdem);
router.delete('/:id', ordemController.deletarOrdem);

module.exports = router;
