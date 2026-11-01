const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuarioRoutes');
const equipamentoRoutes = require('./routes/equipamentoRoutes');
const ordemRoutes = require('./routes/ordemRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Registro de Rotas (Padrão REST)
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/equipamentos', equipamentoRoutes);
app.use('/api/ordens', ordemRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'API funcionando',
    sistema: 'DM-CMMS - Sistema de Gestão de Manutenção',
    versao: '2.0.0'
  });
});

module.exports = app;
