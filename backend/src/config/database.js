const mongoose = require('mongoose');

const conectarBanco = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dm-cmms';
    await mongoose.connect(uri, { family: 4 });
    console.log(' Conectado ao MongoDB com sucesso!');
  } catch (erro) {
    console.error(' Erro ao conectar ao MongoDB:', erro.message);
    process.exit(1);
  }
};

module.exports = conectarBanco;
