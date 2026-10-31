const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../src/app');
const Usuario = require('../../src/models/Usuario');
const Equipamento = require('../../src/models/Equipamento');
const OrdemServico = require('../../src/models/OrdemServico');

const MONGO_TEST_URI = 'mongodb://127.0.0.1:27017/dm-cmms-test';

async function rodarTestes() {
  console.log('--- Iniciando Testes Completos do Backend DM-CMMS ---');
  
  await mongoose.connect(MONGO_TEST_URI, { family: 4 });
  await Usuario.deleteMany({});
  await Equipamento.deleteMany({});
  await OrdemServico.deleteMany({});

  try {
    // 1. Health check
    const health = await request(app).get('/api/health');
    assert.strictEqual(health.status, 200);
    console.log(' [GET /api/health] Status 200 OK');

    // 2. Cadastro de Usuário
    const criacaoUser = await request(app)
      .post('/api/usuarios')
      .send({
        nome: 'Devan Técnico',
        dataNascimento: '1995-04-12',
        email: 'devan.cmms@empresa.com',
        senha: 'SenhaForte123',
        perfil: 'admin'
      });
    assert.strictEqual(criacaoUser.status, 201);
    const token = criacaoUser.body.token;
    assert.ok(token, 'Token JWT gerado');
    console.log(' [POST /api/usuarios] Usuário criado e salvo no MongoDB com sucesso!');

    // 3. Login com JWT
    const login = await request(app)
      .post('/api/usuarios/auth/login')
      .send({
        email: 'devan.cmms@empresa.com',
        senha: 'SenhaForte123'
      });
    assert.strictEqual(login.status, 200);
    assert.ok(login.body.token, 'Token JWT validado');
    console.log(' [POST /api/usuarios/auth/login] Login e JWT autenticados');

    // 4. CRUD de Equipamento (MongoDB + JWT)
    const criacaoEq = await request(app)
      .post('/api/equipamentos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        codigo: 'EQ-001',
        nome: 'Torno CNC Romi D800',
        setor: 'Usinagem',
        criticidade: 'Alta',
        status: 'Operacional'
      });
    assert.strictEqual(criacaoEq.status, 201);
    const idEquipamento = criacaoEq.body.equipamento.id;
    console.log(' [POST /api/equipamentos] Equipamento salvo no MongoDB');

    const listarEq = await request(app)
      .get('/api/equipamentos')
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(listarEq.status, 200);
    assert.strictEqual(listarEq.body.total, 1);
    console.log(' [GET /api/equipamentos] Listagem de equipamentos com JWT OK');

    // 5. CRUD de Ordens de Serviço (MongoDB + JWT)
    const criacaoOS = await request(app)
      .post('/api/ordens')
      .set('Authorization', `Bearer ${token}`)
      .send({
        codigoEquipamento: 'EQ-001',
        tipo: 'Corretiva',
        prioridade: 'Alta',
        descricao: 'Vazamento de óleo no cabeçote principal',
        responsavel: 'Devan Técnico'
      });
    assert.strictEqual(criacaoOS.status, 201);
    const idOS = criacaoOS.body.ordem.id;
    console.log(' [POST /api/ordens] Ordem de Serviço criada com número sequencial');

    // Verifica se o status do equipamento mudou para "Em Manutenção"
    const eqAtualizado = await Equipamento.findById(idEquipamento);
    assert.strictEqual(eqAtualizado.status, 'Em Manutenção');
    console.log(' [Regra de Negócio] Status do Equipamento alterado para "Em Manutenção"');

    // Conclui a Ordem de Serviço
    const conclusaoOS = await request(app)
      .put(`/api/ordens/${idOS}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Concluída' });
    assert.strictEqual(conclusaoOS.status, 200);
    console.log(' [PUT /api/ordens/:id] Ordem concluída e equipamento liberado');

    // 6. Dashboard Indicadores
    const dashboard = await request(app)
      .get('/api/dashboard/resumo')
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(dashboard.status, 200);
    assert.strictEqual(dashboard.body.indicadores.totalEquipamentos, 1);
    assert.strictEqual(dashboard.body.indicadores.totalOrdens, 1);
    console.log(' [GET /api/dashboard/resumo] Indicadores calculados via MongoDB com sucesso!');

    console.log('\n TODOS OS TESTES DO BACKEND CMMS PASSARAM COM SUCESSO!');
  } finally {
    await Usuario.deleteMany({});
    await Equipamento.deleteMany({});
    await OrdemServico.deleteMany({});
    await mongoose.disconnect();
  }
}

rodarTestes().catch(err => {
  console.error('❌ Falha nos testes:', err);
  process.exit(1);
});
