# DM-CMMS - Frontend (React + Vite)

Interface moderna de Single Page Application (SPA) para o **DM-CMMS (Sistema de Gerenciamento de Manutenção Computadorizado)**, desenvolvida em **React** utilizando **Vite** para empacotamento rápido e Hot Module Replacement (HMR).

---

## 🏗️ Arquitetura dos Componentes

A aplicação foi estruturada seguindo o princípio de componentes reutilizáveis e desacoplados:

```
frontend/src/
├── components/
│   ├── Header.jsx           # Cabeçalho com identidade visual e badges de métricas
│   ├── Header.css
│   ├── CardContainer.jsx    # Componente container flexível usando a prop 'children'
│   ├── CardContainer.css
│   ├── EquipamentoForm.jsx  # Formulário controlado via useState para novos ativos
│   ├── EquipamentoForm.css
│   ├── EquipamentoLista.jsx # Grid de cartões de ativos com filtros e busca reativa
│   └── EquipamentoLista.css
├── App.jsx                  # Componente raiz, gerenciamento de estado global e regras de negócio
├── App.css                  # Estilização do layout geral e cards de estatísticas
├── index.css                # Variáveis de cor globais e reset de CSS
└── main.jsx                 # Ponto de entrada da aplicação React
```

---

## ⚙️ Funcionalidades da Interface

- **Painel de Indicadores (Dashboard Operacional):** Exibição em tempo real do total de ativos monitorados, quantidade em plena operação e equipamentos parados em manutenção.
- **Cadastro de Ativos:** Inclusão rápida de novos equipamentos informando nome, código/tag, setor fabril (Usinagem, Soldagem, etc.) e criticidade (Baixa a Crítica).
- **Inventário Interativo:** Cartões visuais detalhando cada equipamento cadastrado.
- **Busca e Filtros Instantâneos:** Filtragem simultânea por digitação (nome ou tag) e seleção por setor fabril gerenciada via `useState`.
- **Alternância de Status:** Botão de ação rápida para comutar o ativo entre *Operacional* e *Em Manutenção*, recalculando automaticamente os indicadores do sistema.

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
| `npm run build` | Gera o build de produção otimizado na pasta `dist/` |
| `npm run preview` | Executa localmente o build gerado para pré-visualização |
