# DM-CMMS - Frontend (React + Vite + React Router)

Interface moderna de Single Page Application (SPA) para o **DM-CMMS (Sistema de Gerenciamento de Manutenção Computadorizado)**, desenvolvida em **React 19** utilizando **Vite** para empacotamento rápido e **React Router Dom** para navegação e roteamento dinâmico.

---

## 📌 Requisitos Atendidos na Aplicação

- [x] **No mínimo 4 páginas:** Dashboard (`/`), Equipamentos (`/equipamentos`), Ordens de Serviço (`/ordens`), Detalhes do Equipamento (`/equipamentos/:id`), Detalhes da Ordem (`/ordens/:id`) e Página 404 (`*`).
- [x] **Envio de dados via rotas através de parâmetros:** Rotas dinâmicas `/equipamentos/:id` e `/ordens/:id` consumindo os parâmetros de URL via hook `useParams`.
- [x] **Página de erro 404:** Rota curinga `path="*"` com tela personalizada, amigável e estilizada para rotas não mapeadas.
- [x] **Todas as páginas estilizadas:** Interface inspirada na identidade visual do frontend legado (sidebar fixa escura `#0f172a`, cards brancos, badges pill semânticos e tabelas responsivas).
- [x] **Organização de estilos:** Todos os arquivos CSS centralizados e modulares na pasta `src/styles/`.

---

## 🏗️ Estrutura do Projeto

```
frontend/src/
├── assets/                  # Imagens e ícones estáticos
├── components/              # Componentes de estrutura e blocos reutilizáveis
│   ├── CardContainer.jsx    # Container flexível usando a prop 'children'
│   ├── EquipamentoForm.jsx  # Formulário isolado para cadastro
│   ├── EquipamentoLista.jsx # Grid/listagem de cartões de ativos
│   ├── Header.jsx           # Cabeçalho complementar com métricas
│   └── Layout.jsx           # Shell da aplicação (Sidebar fixa + Outlet de rotas)
├── pages/                   # Telas / Páginas da aplicação
│   ├── Dashboard.jsx        # Visão geral, KPIs operacionais e gráficos
│   ├── Equipamentos.jsx     # Inventário completo, filtros e cadastro
│   ├── EquipamentoDetalhe.jsx # Ficha técnica do ativo consumindo :id da rota
│   ├── Ordens.jsx           # Gestão e abertura de Ordens de Serviço
│   ├── OrdemDetalhe.jsx     # Detalhes da OS e timeline de status consumindo :id
│   └── NotFound.jsx         # Página de erro 404 para rotas inexistentes
├── styles/                  # Todos os estilos CSS centralizados
│   ├── card-container.css
│   ├── dashboard.css
│   ├── equipamento-detalhe.css
│   ├── equipamento-form.css
│   ├── equipamento-lista.css
│   ├── equipamentos.css
│   ├── global.css           # Variáveis de design tokens, resets e tipografia
│   ├── header.css
│   ├── layout.css           # Estilos da Sidebar e estrutura principal
│   ├── not-found.css
│   ├── ordem-detalhe.css
│   └── ordens.css
├── App.jsx                  # Configuração do BrowserRouter, Routes e estado global
└── main.jsx                 # Ponto de entrada da aplicação React
```

---

## 🗺️ Rotas Disponíveis

| Rota | Componente | Descrição |
| :--- | :--- | :--- |
| `/` | `Dashboard` | Visão geral dos KPIs, alertas, distribuição e resumo de OSs |
| `/equipamentos` | `Equipamentos` | Listagem com busca em tempo real, filtros por setor/status e novo cadastro |
| `/equipamentos/:id` | `EquipamentoDetalhe` | **Rota com parâmetro:** Exibe a ficha técnica completa do ativo correspondente |
| `/ordens` | `Ordens` | Listagem de Ordens de Serviço, abertura de nova OS e filtros |
| `/ordens/:id` | `OrdemDetalhe` | **Rota com parâmetro:** Exibe dados da OS e fluxo de avanço de status |
| `*` | `NotFound` | **Erro 404:** Captura qualquer endereço inválido com atalhos de retorno |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **npm** (v9 ou superior)

### Passo a Passo

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

4. Abra no seu navegador:
   ```
   http://localhost:5173
   ```

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento com Vite e HMR |
| `npm run build` | Valida tipos e compila a aplicação para produção na pasta `dist/` |
| `npm run preview` | Executa localmente o build gerado para validação em ambiente similar à produção |
