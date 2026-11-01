# Frontend Legado (HTML, CSS e JavaScript Vanilla)

Esta pasta preserva a versão original do front-end do **DM-CMMS**. Ela serve como **base de referência visual, regras de negócio e prototipação** para a migração gradual das telas para a nova aplicação em React (`../frontend`).

---

## 📁 Estrutura de Arquivos

| Arquivo / Pasta | Finalidade | Referência para o React |
| :--- | :--- | :--- |
| `index.html` / `js/dashboard.js` | Painel principal com indicadores e gráficos | Base para o Dashboard com Recharts/Chart.js |
| `equipamentos.html` / `css/equipamentos.css` | Cadastro e listagem de ativos industriais | Já implementado na SPA React (`EquipamentoForm`, `EquipamentoLista`) |
| `ordens.html` / `js/ordens.js` | Gestão de Ordens de Serviço (abertura, prioridade, status) | Próximo módulo a ser integrado em React |
| `manutencoes.html` / `js/manutencoes.js` | Registro e histórico de intervenções preventivas/corretivas | Módulo de Manutenções em React |
| `historico.html` | Linha do tempo e log de manutenções realizadas | Componente de Timeline |
| `relatorios.html` | Exportação de dados e relatórios operacionais | Módulo de Relatórios |
| `usuarios.html` | Gestão de operadores e administradores | Autenticação e perfil de usuário |
| `js/dados.js` | Estrutura de dados mockados e schemas locais | Base para tipagem e estados iniciais |
| `js/weather.js` / `weather_icons/` | Previsão climática para rotinas operacionais | Widget de clima |
| `css/style.css` | Paleta de cores, tipografia e reset de estilos | Guia de identidade visual do sistema |
