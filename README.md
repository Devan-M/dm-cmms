# DM-CMMS — Sistema de Gestão de Manutenção Industrial

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.0-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Sistema web completo para controle de inventário de ativos, acompanhamento de ordens de serviço (OS) e gestão de manutenção com autenticação JWT e controle de acesso baseado em papéis (RBAC).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React 19 & TypeScript
  - Vite (Build Tool & HMR)
  - React Router DOM 7 (Rotas Privadas com verificação de autenticação)
  - Context API (`useContext`) para estado global de sessão
  - React Toastify (Notificações visuais)
  - Lucide React (Ícones SVG)
- **Backend:**
  - Node.js & Express.js (API RESTful)
  - MongoDB com Mongoose (ODM e Modelagem de Dados)
  - Autenticação com JSON Web Token (JWT) e Bcrypt para hash de senhas
  - Middlewares de autorização e segurança RBAC
- **DevOps & Banco de Dados:**
  - Docker & Docker Compose para orquestração do MongoDB

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker & Docker Compose](https://www.docker.com/) (para o banco MongoDB)

---

### 1️⃣ Subir o Banco de Dados (MongoDB via Docker)
Na raiz do projeto (`dm-cmms`), execute:

```bash
docker compose up -d
```
> Isso iniciará o container do MongoDB na porta padrão `27017` com volume persistente.

---

### 2️⃣ Iniciar o Backend (API)
Abra um terminal e acesse a pasta `backend`:

```bash
cd backend

# Instalar dependências
npm install

# (Recomendado) Popular o banco com dados de teste e usuários iniciais
node src/seedDemo.js

# Iniciar o servidor
npm run dev
```
> O servidor da API iniciará em: `http://localhost:3000`

---

### 3️⃣ Iniciar o Frontend (React + Vite)
Abra outro terminal e acesse a pasta `frontend`:

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar a aplicação
npm run dev
```
> O frontend iniciará em: `http://localhost:5173`

---

## 🔑 Credenciais de Acesso (Demo)

Após executar `node src/seedDemo.js`, você poderá entrar com:

| Perfil | E-mail | Senha |
|---|---|---|
| **Administrador** | `demo@teste.com` | `Admin123` |
| **Técnico** | `carlos@dm-cmms.com` | `Admin123` |
| **Técnico** | `ana@dm-cmms.com` | `Admin123` |

---

## 📋 Requisitos do Projeto Atendidos

- ✅ **No mínimo 2 páginas:**
  - `Dashboard`: Indicadores operacionais, métricas e alertas.
  - `Equipamentos`: Inventário de ativos, filtros, busca e cadastro.
  - `EquipamentoDetalhe`: Ficha técnica e alteração de status/dados via rota dinâmica `:id`.
  - `Ordens`: Listagem e abertura de ordens de serviço.
  - `OrdemDetalhe`: Ficha da OS e edição de ciclo de vida via rota `:id`.
  - `Minha Conta`: Gestão de perfil e administração de usuários.
- ✅ **Página de autenticação:**
  - Tela de login conectada ao endpoint `POST /api/usuarios/auth/login` com validações, bloqueios e toasts de notificação.
- ✅ **Utilização de Hooks React:**
  - `useContext`: Compartilhamento do estado global do usuário via `AuthContext`.
  - `useState`: Controle de formulários, listas dinâmicas, modais e filtros.
  - `useEffect`: Restauração da sessão no `localStorage` e carregamento de dados assíncronos.
- ✅ **Rotas privadas:**
  - Componente `ProtectedRoute` que protege todas as páginas internas da aplicação, redirecionando usuários não autenticados para `/login`.
- ✅ **Integração com API:**
  - Módulo `apiRequest` centralizado com injeção automática de tokens JWT no cabeçalho `Authorization: Bearer <token>`.
