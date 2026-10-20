
const request = require('supertest');
const app = require('../../src/app');

describe('API de Usuários', () => {
  describe('GET /api/health', () => {
    it('deve retornar status 200 e confirmar que a API está funcionando', async () => {
      const resposta = await request(app).get('/api/health');

      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual({
        status: 'API funcionando',
        versao: 'V2'
      });
    });
  });

  describe('GET /api/usuarios', () => {
    it('deve listar os usuários sem expor senhas', async () => {
      const resposta = await request(app).get('/api/usuarios');

      expect(resposta.status).toBe(200);
      expect(resposta.body.sucesso).toBe(true);
      expect(Array.isArray(resposta.body.usuarios)).toBe(true);
      expect(resposta.body.total).toBe(resposta.body.usuarios.length);

      resposta.body.usuarios.forEach((usuario) => {
        expect(usuario).not.toHaveProperty('senha');
        expect(usuario).not.toHaveProperty('senhaHash');
      });
    });
  });

  describe('POST /api/usuarios', () => {
    it('deve criar um usuário válido', async () => {
      const novoUsuario = {
        nome: 'Teste Automatizado',
        dataNascimento: '1995-04-12',
        email: 'teste.automatizado@dmcmms.com',
        senha: 'Teste@123',
        perfil: 'tecnico'
      };

      const resposta = await request(app)
        .post('/api/usuarios')
        .send(novoUsuario);

      expect(resposta.status).toBe(201);
      expect(resposta.body.sucesso).toBe(true);
      expect(resposta.body.usuario.nome).toBe(novoUsuario.nome);
      expect(resposta.body.usuario.email).toBe(novoUsuario.email);
      expect(resposta.body.usuario).not.toHaveProperty('senhaHash');
    });

    it('deve rejeitar a criação sem campos obrigatórios', async () => {
      const resposta = await request(app)
        .post('/api/usuarios')
        .send({ nome: 'Usuário Incompleto' });

      expect(resposta.status).toBe(400);
      expect(resposta.body.sucesso).toBe(false);
    });
  });

  describe('GET /api/usuarios/:id', () => {
    it('deve retornar 404 para um usuário inexistente', async () => {
      const resposta = await request(app)
        .get('/api/usuarios/id-inexistente');

      expect(resposta.status).toBe(404);
      expect(resposta.body.sucesso).toBe(false);
    });
  });


  describe('PUT /api/usuarios/:id', () => {
    it('deve atualizar o nome de um usuário existente', async () => {
      const criacao = await request(app)
        .post('/api/usuarios')
        .send({
          nome: 'Usuario Antes',
          dataNascimento: '1990-05-15',
          email: 'usuario.antes@dmcmms.com',
          senha: 'Teste@123',
          perfil: 'tecnico'
        });

      expect(criacao.status).toBe(201);

      const id = criacao.body.usuario.id;

      const resposta = await request(app)
        .put(`/api/usuarios/${id}`)
        .send({ nome: 'Usuario Depois' });

      expect(resposta.status).toBe(200);
      expect(resposta.body.sucesso).toBe(true);
      expect(resposta.body.usuario.nome).toBe('Usuario Depois');
    });

    it('deve retornar 404 ao atualizar um usuário inexistente', async () => {
      const resposta = await request(app)
        .put('/api/usuarios/id-inexistente')
        .send({ nome: 'Novo Nome' });

      expect(resposta.status).toBe(404);
      expect(resposta.body.sucesso).toBe(false);
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    it('deve excluir um usuário existente', async () => {
      const criacao = await request(app)
        .post('/api/usuarios')
        .send({
          nome: 'Usuario Para Excluir',
          dataNascimento: '1990-05-15',
          email: 'usuario.excluir@dmcmms.com',
          senha: 'Teste@123',
          perfil: 'tecnico'
        });

      expect(criacao.status).toBe(201);

      const id = criacao.body.usuario.id;

      const exclusao = await request(app)
        .delete(`/api/usuarios/${id}`);

      expect(exclusao.status).toBe(200);
      expect(exclusao.body.sucesso).toBe(true);

      const consulta = await request(app)
        .get(`/api/usuarios/${id}`);

      expect(consulta.status).toBe(404);
    });

    it('deve retornar 404 ao excluir um usuário inexistente', async () => {
      const resposta = await request(app)
        .delete('/api/usuarios/id-inexistente');

      expect(resposta.status).toBe(404);
      expect(resposta.body.sucesso).toBe(false);
    });
  });


});
