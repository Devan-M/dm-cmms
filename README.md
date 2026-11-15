# DM-CMMS — Sistema de Gestão de Manutenção Industrial

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.0-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Sistema web completo para gestão de manutenção industrial (CMMS), controle de ativos, ordens de serviço (OS) e usuários com controle de acesso baseado em papéis (RBAC).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React 19 & TypeScript
  - Vite (Build Tool & Fast HMR)
  - Tailwind CSS & Vite Plugin
  - Axios (Instância centralizada com interceptors para tokens JWT)
  - React Router DOM 7 (Rotas aninhadas, rotas protegidas e troca de dados via props de rota)
  - Context API (`useContext`) para estado global de autenticação e sessão
  - React Toastify (Notificações visuais)
  - Lucide React (Ícones SVG)
- **Backend:**
  - Node.js & Express.js (API RESTful consumindo endpoints `GET`, `POST`, `PUT`, `DELETE`, `PATCH`)
  - MongoDB com Mongoose (ODM e Modelagem de Dados)
  - Autenticação com JSON Web Token (JWT) e Bcrypt para hash de senhas
  - Middlewares de autorização e controle de acesso RBAC
- **DevOps & Banco de Dados:**
  - Docker & Docker Compose para orquestração do MongoDB

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker Desktop](https://www.docker.com/) (com o serviço em execução)

---

### 1️⃣ Subir o Banco de Dados (MongoDB via Docker)
Na raiz do projeto (`dm-cmms`), execute:

```bash
docker compose up -d
```
> Isso iniciará o container do MongoDB na porta padrão `27017` com volume persistente.

---

### 2️⃣ Iniciar e Popular o Backend (API)
Abra um terminal e acesse a pasta `backend`:

```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Executar o seed unificado (popula usuários, 150 equipamentos e 100 ordens de serviço)
npm run seed

# 3. Iniciar o servidor em modo de desenvolvimento
npm run dev
```
> O servidor da API iniciará em: `http://localhost:3000`

---

### 3️⃣ Iniciar o Frontend (React + Vite)
Abra outro terminal e acesse a pasta `frontend`:

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Iniciar a aplicação em modo de desenvolvimento
npm run dev
```
> O frontend iniciará em: `http://localhost:5173`

---

## 🔑 Credenciais de Acesso (Demo)

Após executar `npm run seed`, utilize qualquer um dos perfis pré-configurados:

| Perfil | E-mail | Senha | Acesso / Permissões |
|---|---|---|---|
| **Administrador** | `demo@teste.com` | `Admin123` | Acesso total: CRUDs, gestão e cadastro de usuários |
| **Supervisor** | `mariana.rocha@dm-cmms.com` | `Admin123` | Supervisão de ativos e ordens de manutenção |
| **Técnico** | `carlos@dm-cmms.com` | `Admin123` | Abertura, execução e atualização de ordens |

---

## 💻 Funcionalidades do Sistema

- **Autenticação & Sessão:**
  - Tela de login com validações de credenciais e persistência de sessão no `localStorage`.
  - Rotas protegidas via `ProtectedRoute`, garantindo redirecionamento automático caso o usuário não esteja autenticado.
- **Dashboard Operacional (`/`):**
  - Contadores em tempo real de ativos cadastrados, ordens em aberto, taxa de disponibilidade e manutenções preventivas.
  - Tabela com as ordens de serviço mais recentes e atalhos rápidos.
- **Inventário de Ativos / Equipamentos (`/equipamentos`):**
  - CRUD completo de equipamentos.
  - Filtros instantâneos por setor (*Usinagem, Soldagem, Pintura, Montagem, etc.*) e status (*Operacional, Em Manutenção, Inativo*).
  - Tabela com paginação selecionável (**5**, **10**, **20** ou **50** registros por página).
- **Ficha Técnica do Equipamento (`/equipamentos/:id`):**
  - Detalhamento completo do ativo acessado via rota dinâmica.
  - Edição de dados técnicos e alternância rápida de status operacional.
  - Remoção do equipamento com diálogo de confirmação.
- **Gestão de Ordens de Serviço (`/ordens`):**
  - CRUD completo para abertura e acompanhamento de OS.
  - Filtros combinados por status (*Em Aberto, Em Andamento, Concluída, Cancelada*) e tipo (*Corretiva, Preventiva, Preditiva, Inspeção*).
  - Tabela com paginação selecionável e histórico de manutenções.
- **Ficha Técnica da Ordem (`/ordens/:id`):**
  - Controle de ciclo de vida da OS, avanço de etapas de manutenção, registro de custos e encerramento.
- **Minha Conta & Gestão de Usuários (`/usuarios`):**
  - Card retrátil de **Dados Pessoais** para alteração de nome, data de nascimento e senha de acesso.
  - Card retrátil exclusivo para administradores de **Cadastrar Novo Usuário**.
  - Tabela de **Usuários Cadastrados** com paginação e ativação/desativação de contas com 1 clique.
