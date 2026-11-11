require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

const usuariosDemo = [
  {
    nome: 'Administrador Demo',
    email: 'demo@teste.com',
    perfil: 'admin'
  },
  {
    nome: 'Carlos Melo',
    email: 'carlos@dm-cmms.com',
    perfil: 'tecnico'
  },
  {
    nome: 'Ana Silva',
    email: 'ana@dm-cmms.com',
    perfil: 'tecnico'
  },
  {
    nome: 'Pedro Costa',
    email: 'pedro@dm-cmms.com',
    perfil: 'tecnico'
  }
];

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dm-cmms';
  await mongoose.connect(uri, { family: 4 });

  for (const dados of usuariosDemo) {
    const existente = await Usuario.findOne({ email: dados.email });
    if (existente) {
      console.log(`Conta preservada: ${dados.email}`);
      continue;
    }

    await Usuario.create({
      ...dados,
      dataNascimento: '2000-01-01',
      senha: 'Admin123',
      ativo: true
    });
    console.log(`Conta demo criada: ${dados.email}`);
  }
}

seed()
  .catch((erro) => {
    console.error('Falha ao criar contas demo:', erro.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
