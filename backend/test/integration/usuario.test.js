const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../src/app');
const Usuario = require('../../src/models/Usuario');

const MONGO_TEST_URI = 'mongodb://127.0.0.1:27017/dm-cmms-test';

async function rodarTestes() {
  console.log('--- Iniciando Testes de Integração com MongoDB e JWT ---');
  
  await mongoose.connect(MONGO_TEST_URI, { family: 4 });
  await Usuario.deleteMany({});

  try {
    // 1. Health check
    const health = await request(app).get('/api/health');
    assert.strictEqual(health.status, 200);
    console.log(' [GET /api/health] Status 200 OK');

    // 2. Criar Usuário (POST)
    const criacao = await request(app)
      .post('/api/usuarios')
      .send({
        nome: 'Usuario Teste',
        dataNascimento: '1995-04-12',
        email: 'usuario.teste@dmcmms.com',
        senha: 'SenhaForte123',
        perfil: 'tecnico'
      });
    assert.strictEqual(criacao.status, 201);
    assert.strictEqual(criacao.body.sucesso, true);
    assert.ok(criacao.body.token, 'Token JWT deve ser gerado no cadastro');
    assert.strictEqual(criacao.body.usuario.senha, undefined);
    console.log(' [POST /api/usuarios] Usuário criado e salvo no MongoDB com sucesso!');

    const idCriado = criacao.body.usuario.id;
    const token = criacao.body.token;

    // 3. Login com JWT (POST)
    const login = await request(app)
      .post('/api/usuarios/auth/login')
      .send({
        email: 'usuario.teste@dmcmms.com',
        senha: 'SenhaForte123'
      });
    assert.strictEqual(login.status, 200);
    assert.strictEqual(login.body.sucesso, true);
    assert.ok(login.body.token, 'Token JWT retornado no login');
    console.log(' [POST /api/usuarios/auth/login] Autenticação e geração de JWT OK');

    // 4. Bloqueio sem JWT (GET)
    const semToken = await request(app).get('/api/usuarios');
    assert.strictEqual(semToken.status, 401);
    console.log(' [GET /api/usuarios] Bloqueio sem token JWT (401) OK');

    // 5. Listar com JWT (GET)
    const listar = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(listar.status, 200);
    assert.strictEqual(listar.body.total, 1);
    console.log(' [GET /api/usuarios] Listagem autenticada com sucesso!');

    // 6. Buscar por ID com JWT (GET)
    const obter = await request(app)
      .get(`/api/usuarios/${idCriado}`)
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(obter.status, 200);
    assert.strictEqual(obter.body.usuario.id, idCriado);
    console.log(' [GET /api/usuarios/:id] Busca por ID com JWT OK');

    // 7. Atualizar com JWT (PUT)
    const atualizar = await request(app)
      .put(`/api/usuarios/${idCriado}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Nome Atualizado MongoDB' });
    assert.strictEqual(atualizar.status, 200);
    assert.strictEqual(atualizar.body.usuario.nome, 'Nome Atualizado MongoDB');
    console.log(' [PUT /api/usuarios/:id] Atualização no MongoDB com JWT OK');

    // 8. Deletar com JWT (DELETE)
    const deletar = await request(app)
      .delete(`/api/usuarios/${idCriado}`)
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(deletar.status, 200);
    console.log(' [DELETE /api/usuarios/:id] Exclusão no MongoDB com JWT OK');

    console.log('\n TODOS OS TESTES PASSARAM COM SUCESSO!');
  } finally {
    await Usuario.deleteMany({});
    await mongoose.disconnect();
  }
}

rodarTestes().catch(err => {
  console.error('❌ Falha nos testes:', err);
  process.exit(1);
});
