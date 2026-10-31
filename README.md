# DM-CMMS

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?logo=jsonwebtokens&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![Status](https://img.shields.io/badge/status-ativo-brightgreen)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Devan%20M.-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/devan-m/)

Sistema de Gerenciamento de Manutenção Computadorizado (CMMS) para controle de ativos, ordens de serviço, manutenção industrial e métricas operacionais, estruturado em arquitetura **MVC** com **API RESTful**, persistência no **MongoDB via Mongoose** e autenticação segura com **JSON Web Tokens (JWT)**.

---

## 🏗️ Arquitetura do Backend

O backend foi construído em **Node.js** utilizando o framework **Express** e segue rigorosamente o padrão **MVC (Model-View-Controller)**:

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # Conexão assíncrona com MongoDB (Mongoose)
│   ├── controllers/
│   │   ├── usuarioController.js     # Regras de cadastro, login e CRUD de usuários
│   │   ├── equipamentoController.js # CRUD e filtros de ativos/equipamentos
│   │   ├── ordemController.js       # Abertura, gestão e encerramento de O.S.
│   │   └── dashboardController.js   # Cálculo e agregação de indicadores gerais
│   ├── middleware/
│   │   └── auth.js             # Middleware de interceptação e validação de Token JWT
│   ├── models/
│   │   ├── Usuario.js          # Mongoose Schema de Usuários com hash bcryptjs
│   │   ├── Equipamento.js      # Mongoose Schema de Equipamentos/Ativos
│   │   └── OrdemServico.js     # Mongoose Schema de Ordens de Serviço
│   ├── routes/
│   │   ├── usuarioRoutes.js    # Rotas de autenticação e gestão de usuários
│   │   ├── equipamentoRoutes.js# Rotas protegidas de equipamentos
│   │   ├── ordemRoutes.js      # Rotas protegidas de O.S.
│   │   └── dashboardRoutes.js  # Rota protegida de métricas do dashboard
│   ├── app.js                  # Configuração do Express, CORS e registro de rotas
│   └── server.js               # Inicialização do servidor após conexão com o banco
├── test/
│   └── integration/
│       └── usuario.test.js     # Testes automatizados de ponta a ponta
└── package.json
```

---

## 🚀 Como Executar o Backend

### 1. Pré-requisitos
- **Node.js** (v18+)
- **MongoDB** em execução local na porta `27017` (ou via Docker):
  ```bash
  docker run -d --name mongodb -p 27017:27017 mongo:latest
  ```

### 2. Instalação e Execução
1. Entre na pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O servidor estará acessível em: `http://localhost:3000`*

---

## 🧪 Testes Automatizados
O projeto possui testes de integração automatizados que validam todo o ciclo (Criação de Usuário, Login JWT, bloqueio de rotas sem token, CRUD no MongoDB e regras de negócio de O.S.):

```bash
cd backend
npm test
```

---

## 📡 Endpoints da API

### 🔐 1. Autenticação e Usuários (`/api/usuarios`)
| Método | Endpoint | Protegido por JWT | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/usuarios` | Não | Cadastro de novo usuário (gera token inicial) |
| `POST` | `/api/usuarios/auth/login` | Não | Autenticação com e-mail e senha (retorna Token JWT) |
| `GET` | `/api/usuarios` | **Sim** | Listar todos os usuários cadastrados |
| `GET` | `/api/usuarios/:id` | **Sim** | Buscar usuário específico por ID |
| `PUT` | `/api/usuarios/:id` | **Sim** | Atualizar dados cadastrais |
| `DELETE` | `/api/usuarios/:id` | **Sim** | Excluir usuário |

---

### ⚙️ 2. Gestão de Equipamentos (`/api/equipamentos`)
*Todas as rotas exigem header `Authorization: Bearer <TOKEN>`*

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/equipamentos` | Cadastrar novo ativo (código, nome, setor, criticidade, etc.) |
| `GET` | `/api/equipamentos` | Listar todos os equipamentos (suporta filtros `?setor=&status=`) |
| `GET` | `/api/equipamentos/:id` | Obter ficha técnica detalhada por ID |
| `PUT` | `/api/equipamentos/:id` | Atualizar dados ou status operacional |
| `DELETE` | `/api/equipamentos/:id` | Remover equipamento do sistema |

---

### 📋 3. Ordens de Serviço (`/api/ordens`)
*Todas as rotas exigem header `Authorization: Bearer <TOKEN>`*

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/ordens` | Abrir nova O.S. (Gera número sequencial e altera status do ativo) |
| `GET` | `/api/ordens` | Listar O.S. (suporta filtros `?status=&prioridade=&tipo=`) |
| `GET` | `/api/ordens/:id` | Consultar detalhes da O.S. por ID |
| `PUT` | `/api/ordens/:id` | Atualizar O.S. (ao marcar como "Concluída", restaura o ativo para "Operacional") |
| `DELETE` | `/api/ordens/:id` | Cancelar/remover Ordem de Serviço |

---

### 📊 4. Dashboard & Indicadores (`/api/dashboard`)
*Exige header `Authorization: Bearer <TOKEN>`*

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/resumo` | Retorna total de equipamentos, ativos operacionais, disponibilidade (%), ordens abertas e concluídas |

---

## ⚡ Testando com o Thunder Client

O repositório já inclui uma collection pronta e exportada para o **Thunder Client** no VS Code:

📁 **Arquivo:** [`thunder-client/thunder-collection_DM-CMMS - Usuarios.json`](thunder-client/thunder-collection_DM-CMMS%20-%20Usuarios.json)

### Passo a passo para testar:
1. Abra o **Thunder Client** no VS Code.
2. Na aba **Collections**, clique em `...` -> **Import** e selecione o arquivo acima.
3. Execute a requisição **1. Login (Gerar JWT)** para receber seu token.
4. Nas demais requisições protegidas, informe o token no header `Authorization: Bearer <seu-token>`.

---

## 💻 Interface Front-end

As telas do front-end (`index.html`, `equipamentos.html`, `ordens.html`, etc.) oferecem a interface visual para demonstração e navegação das rotinas do CMMS (com gráficos, previsão do tempo industrial e fichas técnicas).
