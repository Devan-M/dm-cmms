# DM-CMMS - Frontend (React + Vite + React Router)

Interface moderna de Single Page Application (SPA) para o **DM-CMMS (Sistema de Gerenciamento de Manutenção Computadorizado)**, desenvolvida em **React 19** utilizando **Vite** para empacotamento rápido e **React Router Dom** para navegação e roteamento dinâmico entre páginas.

---

## ⚙️ Como a Aplicação Funciona

A aplicação atua como um sistema de gestão industrial de ativos e ordens de serviço (OS), organizada em torno de um layout com barra lateral fixa (sidebar) e área principal de conteúdo dinâmica:

- **Dashboard (`/`):** Apresenta indicadores em tempo real (KPIs de equipamentos operacionais vs. em manutenção), painel de ordens recentes e gráfico de distribuição.
- **Inventário de Equipamentos (`/equipamentos`):** Permite listar, filtrar por setor fabril ou status, pesquisar por texto, cadastrar novos ativos e remover registros.
- **Ficha Técnica do Equipamento (`/equipamentos/:id`):** Ao selecionar um equipamento, a rota dinâmica carrega suas especificações completas, nível de criticidade e atalhos para alternar seu status operacional.
- **Ordens de Serviço (`/ordens`):** Gerenciamento e abertura de ordens de manutenção (Preventiva, Corretiva, Preditiva ou Inspeção) vinculadas aos ativos cadastrados.
- **Detalhes da Ordem de Serviço (`/ordens/:id`):** Exibe a linha do tempo e avanço de etapas da manutenção (*Em Aberto → Em Andamento → Concluída*), além de campos descritivos.
- **Página Não Encontrada (`404`):** Tratamento amigável para rotas inexistentes com botões de retorno rápido para a aplicação.

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
│   ├── EquipamentoDetalhe.jsx # Ficha técnica do ativo por :id
│   ├── Ordens.jsx           # Gestão e abertura de Ordens de Serviço
│   ├── OrdemDetalhe.jsx     # Detalhes da OS e timeline de status por :id
│   └── NotFound.jsx         # Página de erro 404 para rotas inexistentes
├── styles/                  # Estilos CSS centralizados e modulares
│   ├── card-container.css
│   ├── dashboard.css
│   ├── equipamento-detalhe.css
│   ├── equipamento-form.css
│   ├── equipamento-lista.css
│   ├── equipamentos.css
│   ├── global.css           # Variáveis globais de cores, tipografia e reset
│   ├── header.css
│   ├── layout.css           # Estilos da Sidebar e estrutura principal
│   ├── not-found.css
│   ├── ordem-detalhe.css
│   └── ordens.css
├── App.jsx                  # Definição das rotas e estado centralizado da aplicação
└── main.jsx                 # Ponto de entrada da aplicação React
```

---

## 🗺️ Mapa de Rotas

| Rota | Descrição |
| :--- | :--- |
| `/` | Painel de controle (Dashboard) com métricas e resumo do sistema |
| `/equipamentos` | Lista de ativos monitorados com formulário e busca reativa |
| `/equipamentos/:id` | Detalhes específicos de um ativo informado pelo ID na URL |
| `/ordens` | Acompanhamento e abertura de ordens de manutenção |
| `/ordens/:id` | Detalhes e evolução de status da ordem informada pelo ID |
| `*` | Página 404 para qualquer caminho não cadastrado |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior recomendada)
- **npm** (versão 9 ou superior)

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

4. Abra no seu navegador:
   ```
   http://localhost:5173
   ```

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento com Vite e HMR |
| `npm run build` | Compila os arquivos para produção na pasta `dist/` |
| `npm run preview` | Executa localmente o build gerado para pré-visualização |
