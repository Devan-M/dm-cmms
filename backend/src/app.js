const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'API funcionando',
    versao: 'V2'
  });
});

module.exports = app;