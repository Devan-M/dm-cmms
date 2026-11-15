# DM-CMMS — Backend (Node.js + Express + MongoDB)

API RESTful completa para o **DM-CMMS (Sistema de Gestão de Manutenção Industrial)**, responsável pela autenticação de usuários, regras de negócio, controle de acesso baseado em papéis (RBAC) e persistência de dados em banco MongoDB via Mongoose.

---

## 🛠️ Tecnologias e Bibliotecas

- **Node.js (>= 18):** Ambiente de execução JavaScript no servidor.
- **Express.js (v4.21):** Framework web rápido e minimalista para criação de rotas e middlewares.
- **MongoDB & Mongoose (v8.9):** Banco de dados NoSQL orientado a documentos com modelagem via schemas e validações estritas.
- **JSON Web Token (jsonwebtoken v9.0):** Emissão e verificação de tokens JWT para autenticação stateless.
- **Bcrypt.js (v2.4):** Hashing e criptografia unidirecional para armazenamento seguro de senhas.
- **CORS & Dotenv:** Controle de requisições cross-origin e gerenciamento de variáveis de ambiente.
- **Nodemon:** Reinicialização automática do servidor durante o desenvolvimento.
- **Supertest:** Testes de integração de endpoints HTTP.

---

## 🗄️ Modelagem de Dados (Schemas)

A API gerencia 3 entidades principais no MongoDB:

1. **Usuários (`Usuario`):**
   - Campos: `nome`, `email` (único), `senha` (hash bcrypt), `dataNascimento`, `perfil` (`admin` | `tecnico` | `supervisor`), `ativo`, `tentativasLogin`, `bloqueado`, `dataUltimoAcesso`.
2. **Equipamentos (`Equipamento`):**
   - Campos: `codigo` (único, ex: `EQP-001`), `nome`, `setor` (*Usinagem, Estamparia, Utilidades, Logística, Moldagem, Geral*), `criticidade` (*Alta, Média, Baixa*), `status` (*Operacional, Em Manutenção, Inativo*), `fabricante`, `modelo`, `localizacao`, `dataCadastro`.
3. **Ordens de Serviço (`OrdemServico`):**
   - Campos: `numero` (único sequencial), `equipamento` (ObjectId ref), `codigoEquipamento`, `nomeEquipamento`, `tipo` (*Corretiva, Preventiva, Preditiva, Inspeção*), `prioridade`, `status` (*Em Aberto, Em Andamento, Concluída, Cancelada, Pendente*), `responsavel`, `descricao`, `dataAbertura`, `dataConclusao`, `custoTotal`.

---

## 🔐 Controle de Acesso e Permissões (RBAC)

A API implementa middlewares de segurança em `src/middleware/auth.js`:
- **`authMiddleware`:** Valida o cabeçalho `Authorization: Bearer <token>` e injeta o usuário autenticado na requisição.
- **`exigirPerfil('admin')`:** Garante que rotas administrativas (ex: listar todos os usuários, criar novas contas, alterar status de usuários) sejam acessadas exclusivamente por administradores.
- **`selfOuAdmin`:** Permite que o próprio usuário edite seus dados ou que um administrador o faça.

---

## 📡 Endpoints da API

Todas as rotas são prefixadas por `/api`.

### 1. Autenticação & Usuários (`/api/usuarios`)

| Método | Endpoint | Protegido? | Perfil Mínimo | Descrição |
| :---: | :--- | :---: | :---: | :--- |
| `POST` | `/api/usuarios/auth/login` | Não | Público | Autentica o usuário e retorna o token JWT e dados do perfil |
| `GET` | `/api/usuarios/me` | Sim | Qualquer | Retorna os dados da conta do usuário autenticado |
| `PUT` | `/api/usuarios/me` | Sim | Qualquer | Atualiza dados cadastrais e senha do próprio usuário |
| `GET` | `/api/usuarios` | Sim | `admin` | Lista todos os usuários cadastrados no sistema |
| `POST` | `/api/usuarios` | Sim | `admin` | Cadastra um novo usuário no sistema |
| `PATCH`| `/api/usuarios/:id/status`| Sim | `admin` | Alterna o status do usuário entre Ativo e Inativo |
| `GET` | `/api/usuarios/:id` | Sim | Self/Admin | Retorna os detalhes de um usuário específico |
| `PUT` | `/api/usuarios/:id` | Sim | `admin` | Edita os dados de um usuário pelo ID |
| `DELETE`| `/api/usuarios/:id` | Sim | `admin` | Remove um usuário do banco de dados |

### 2. Equipamentos (`/api/equipamentos`)

| Método | Endpoint | Protegido? | Descrição |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/equipamentos` | Sim | Lista todos os equipamentos com suporte a filtros |
| `GET` | `/api/equipamentos/:id` | Sim | Retorna os detalhes de um equipamento específico |
| `POST` | `/api/equipamentos` | Sim | Cadastra um novo equipamento no inventário |
| `PUT` | `/api/equipamentos/:id` | Sim | Atualiza os dados ou status de um equipamento |
| `DELETE`| `/api/equipamentos/:id` | Sim | Remove um equipamento do inventário |

### 3. Ordens de Serviço (`/api/ordens`)

| Método | Endpoint | Protegido? | Descrição |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/ordens` | Sim | Lista todas as ordens de serviço cadastradas |
| `GET` | `/api/ordens/:id` | Sim | Retorna os detalhes completos de uma ordem de serviço |
| `POST` | `/api/ordens` | Sim | Abre uma nova ordem de serviço |
| `PUT` | `/api/ordens/:id` | Sim | Atualiza o ciclo de vida, status ou custos da OS |
| `DELETE`| `/api/ordens/:id` | Sim | Remove uma ordem de serviço do sistema |

### 4. Dashboard (`/api/dashboard`)

| Método | Endpoint | Protegido? | Descrição |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/dashboard/resumo` | Sim | Retorna os KPIs e métricas consolidadas em tempo real |

---

## 🏗️ Estrutura de Diretórios

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Conexão com o MongoDB via Mongoose
│   ├── controllers/             # Controladores com regras de negócio
│   │   ├── dashboardController.js
│   │   ├── equipamentoController.js
│   │   ├── ordemController.js
│   │   └── usuarioController.js
│   ├── middleware/              # Middlewares de autenticação e RBAC
│   │   └── auth.js
│   ├── models/                  # Schemas do Mongoose
│   │   ├── Equipamento.js
│   │   ├── OrdemServico.js
│   │   └── Usuario.js
│   ├── routes/                  # Definição dos endpoints REST
│   │   ├── dashboardRoutes.js
│   │   ├── equipamentoRoutes.js
│   │   ├── index.js
│   │   ├── ordemRoutes.js
│   │   └── usuarioRoutes.js
│   ├── app.js                   # Configuração dos middlewares Express e rotas
│   ├── seed.js                  # Script unificado para popular banco de dados
│   └── server.js                # Inicialização do servidor HTTP
├── test/                        # Testes automatizados de integração
├── .env.example                 # Exemplo das variáveis de ambiente necessárias
├── package.json
└── README.md
```

---

## 🚀 Como Executar o Backend

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **Instância do MongoDB** rodando localmente na porta `27017` (via Docker Compose na raiz do projeto)

### 1. Configurar variáveis de ambiente
Crie um arquivo `.env` na pasta `backend/` caso não exista:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/dm-cmms
JWT_SECRET=dm_cmms_secret_token_key_2026
```

### 2. Instalar dependências
```bash
cd backend
npm install
```

### 3. Popular o banco de dados (Seed unificado)
Executa o seed que cria contas de acesso, 150 equipamentos e 100 ordens de serviço:

```bash
npm run seed
```

### 4. Iniciar o servidor
```bash
# Modo desenvolvimento (com reload automático via nodemon):
npm run dev

# Ou modo produção:
npm start
```
> O servidor estará acessível em: `http://localhost:3000`

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia a API com recarregamento automático (`nodemon`) |
| `npm start` | Inicia a API em modo padrão com `node src/server.js` |
| `npm run seed` | Executa o seed unificado cadastrando usuários, equipamentos e ordens |
| `npm test` | Executa a suíte de testes de integração da API |
