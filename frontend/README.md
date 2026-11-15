# DM-CMMS — Frontend (React + TypeScript + Vite + Tailwind CSS)

Interface Single Page Application (SPA) para o **DM-CMMS (Sistema de Gestão de Manutenção Industrial)**, desenvolvida em **React 19**, **TypeScript** e **Tailwind CSS**, com empacotamento ultrarrápido via **Vite**, cliente HTTP **Axios** e navegação segura com **React Router Dom**.

---

## 🛠️ Tecnologias e Bibliotecas

- **React 19 & TypeScript:** Componentização declarativa, tipagem estática e hooks modernos.
- **Tailwind CSS 4 (@tailwindcss/vite):** Framework CSS utilitário para estilização e responsividade.
- **Vite:** Ferramenta de build de última geração com Hot Module Replacement (HMR).
- **React Router Dom 7:** Gerenciamento de rotas protegidas, layouts aninhados com `<Outlet />` e troca de dados via props de rota.
- **Axios:** Cliente HTTP com instância centralizada, interceptors de cabeçalho `Authorization: Bearer <token>` e tratamento unificado de erros.
- **Context API (`AuthContext`):** Estado global para controle de autenticação, perfil e permissões de acesso (RBAC).
- **React Toastify:** Notificações visuais e alertas de sucesso/erro para o usuário.
- **Lucide React:** Conjunto de ícones vetoriais em SVG.

---

## ⚙️ Principais Funcionalidades

- **Autenticação & Proteção de Rotas:**
  - Tela de login com validações, bloqueios de segurança e feedback visual.
  - Guarda de rotas `ProtectedRoute` que impede acesso de usuários não autenticados e redireciona automaticamente para `/login`.
- **Dashboard Operacional (`/`):**
  - Consumo de dados via props de rota (`useOutletContext`).
  - Cards de métricas (ativos cadastrados, ordens em aberto, manutenções preventivas e taxa de disponibilidade).
  - Tabela com as ordens de serviço mais recentes.
- **Inventário de Equipamentos (`/equipamentos`):**
  - CRUD completo de ativos industriais.
  - Filtros reativos por texto, setor fabril e status operacional.
  - Paginação com seletor de quantidade (**5**, **10**, **20** ou **50** itens por página).
- **Ficha Técnica do Equipamento (`/equipamentos/:id`):**
  - Recebe o estado instantaneamente via navegação de rota (`useLocation().state`).
  - Edição de especificações e alternância de status operacional.
  - Exclusão com diálogo de confirmação.
- **Gestão de Ordens de Serviço (`/ordens`):**
  - CRUD completo para abertura, acompanhamento e finalização de ordens de serviço.
  - Filtros por status e tipo de manutenção (*Preventiva, Corretiva, Preditiva, Inspeção*).
  - Paginação completa com seletor de registros por página.
- **Ficha Técnica da Ordem (`/ordens/:id`):**
  - Acompanhamento do ciclo de vida da OS, avanço de etapas de manutenção e custos associados.
- **Minha Conta & Usuários (`/usuarios`):**
  - Card retrátil de **Dados Pessoais** para edição de informações e troca de senha.
  - Card retrátil de **Cadastrar Novo Usuário** (exibido apenas para administradores).
  - Tabela de **Usuários Cadastrados** com paginação e ativação/desativação de contas.
- **Página 404 (`*`):**
  - Tratamento para rotas inexistentes com atalho para retornar ao Dashboard.

---

## 🗺️ Estrutura de Rotas

| Rota | Tipo | Descrição |
| :--- | :---: | :--- |
| `/login` | Pública | Autenticação e entrada no sistema |
| `/` | Privada | Dashboard operacional com indicadores |
| `/equipamentos` | Privada | Inventário de ativos, cadastro, filtros e paginação |
| `/equipamentos/:id` | Privada | Detalhamento, edição e exclusão de um equipamento |
| `/ordens` | Privada | Gestão, abertura, filtros e paginação de ordens |
| `/ordens/:id` | Privada | Ficha técnica da OS e avanço de status |
| `/usuarios` | Privada | Gestão da conta do usuário e administração de usuários |
| `*` | Pública | Página 404 de rota não encontrada |

---

## 🏗️ Estrutura de Diretórios

```
frontend/src/
├── assets/                  # Imagens e ícones SVG
├── components/              # Componentes de estrutura e layout
│   ├── Layout.jsx           # Shell com sidebar, navegação e Outlet com context
│   └── Login.tsx            # Tela de autenticação com Tailwind CSS
├── contexts/                # Gerenciamento de estado global
│   └── AuthContext.tsx      # Contexto de autenticação, tokens e permissões
├── pages/                   # Telas da aplicação
│   ├── Dashboard.tsx        # Dashboard operacional
│   ├── Equipamentos.tsx     # Inventário e paginação de ativos
│   ├── EquipamentoDetalhe.tsx # Ficha técnica e edição do ativo
│   ├── Ordens.tsx           # Gestão e paginação de ordens de serviço
│   ├── OrdemDetalhe.tsx     # Detalhamento e ciclo de vida da OS
│   ├── Usuarios.jsx         # Minha Conta e administração de usuários
│   └── NotFound.tsx         # Página de erro 404
├── services/
│   └── api.ts               # Instância do Axios com interceptor de tokens JWT
├── styles/                  # Estilos globais e modulares
│   └── global.css           # Configuração de variáveis e @import "tailwindcss"
├── App.tsx                  # Configuração de rotas e ProtectedRoute
└── main.jsx                 # Ponto de entrada da aplicação
```

---

## 🚀 Como Executar o Frontend

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** (versão 9 ou superior)
- Backend da aplicação em execução na porta `3000`

### Instalação e Execução

1. Acesse o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador:
   ```
   http://localhost:5173
   ```

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor Vite em modo de desenvolvimento |
| `npm run build` | Compila o projeto TypeScript e gera o bundle de produção em `/dist` |
| `npm run preview` | Executa o preview local do bundle gerado em produção |
| `npm run lint` | Executa a verificação estática de código com o linter |
