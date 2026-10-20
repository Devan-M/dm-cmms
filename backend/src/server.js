const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/usuarios', usuarioRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'API funcionando', versao: 'V2' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação: http://localhost:${PORT}/api/health`);
});

module.exports = app;