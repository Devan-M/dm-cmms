const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

router.get('/resumo', authMiddleware, dashboardController.obterResumo);

module.exports = router;
