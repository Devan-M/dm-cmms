# DM-CMMS — Sistema de Gestão de Manutenção Industrial

Sistema completo para controle de inventário de ativos, acompanhamento de ordens de serviço (OS) e gestão de manutenção com autenticação JWT e controle de acesso (RBAC).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Vite, React Router DOM (Rotas Privadas), React Toastify, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.
- **Banco de Dados:** MongoDB via Docker.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+)
- [Docker & Docker Compose](https://www.docker.com/) (para o banco MongoDB)

---

### 1️⃣ Subir o Banco de Dados (MongoDB via Docker)
Na raiz do projeto (`dm-cmms`), execute:

```bash
docker compose up -d
```
> Isso iniciará um container com o MongoDB na porta padrão `27017`.

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
> O servidor da API rodará em: `http://localhost:3000`

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
> O frontend rodará em: `http://localhost:5173`

---

## 🔑 Credenciais de Acesso (Demo)

Após executar `node src/seedDemo.js`, você poderá entrar com:

| Perfil | E-mail | Senha |
|---|---|---|
| **Administrador** | `demo@teste.com` | `Admin123` |
| **Técnico** | `carlos@dm-cmms.com` | `Admin123` |
| **Técnico** | `ana@dm-cmms.com` | `Admin123` |

---

## 📋 Requisitos Atendidos

- ✅ **No mínimo 2 páginas:** Dashboard, Gestão de Equipamentos, Detalhe do Equipamento, Ordens de Serviço, Detalhe da OS e Minha Conta.
- ✅ **Página de autenticação:** Tela de login conectada ao backend (`POST /api/usuarios/auth/login`) com feedback visual via toasts.
- ✅ **Utilização de Hooks React:**
  - `useContext`: Gestão global da sessão no `AuthContext`.
  - `useState`: Controle de formulários, filtros, buscas e estados locais.
  - `useEffect`: Restauração da sessão no `localStorage` e carregamento de dados assíncronos.
- ✅ **Rotas privadas:** Bloqueio de navegação via `ProtectedRoute` para usuários não autenticados.
- ✅ **Integração com API:** Serviços centralizados via `apiRequest` com envio dinâmico do token `Bearer JWT`.
