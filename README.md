# DM-CMMS

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
[![Licença](https://img.shields.io/badge/licença-free%20até%20o%20momento-brightgreen)](#licença)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Devan%20M.-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/devan-m/)

Sistema de gerenciamento de manutenção (CMMS) para controlar ativos, ordens de serviço, rotinas preventivas e o histórico operacional da manutenção.

## Visão geral

O DM-CMMS é uma aplicação web estática desenvolvida em HTML, CSS e JavaScript para apoiar a gestão da manutenção industrial e de instalações. O objetivo é centralizar a operação em um único ambiente com foco em:

- organização dos equipamentos;
- agendamento de manutenções;
- abertura e acompanhamento de ordens de serviço;
- visão geral do desempenho da manutenção por dashboard;
- persistência local dos dados no navegador.

A solução foi pensada para uso em ambientes de produção, manutenção predial, manutenção de plantas e setores fabris que necessitam de acompanhamento simples e visual.

## Funcionalidades

### 1. Dashboard

A página inicial apresenta indicadores resumidos e visão operacional do sistema, incluindo:

- total de equipamentos cadastrados;
- ordens de serviço abertas;
- manutenções pendentes;
- preventivas do mês;
- próximas manutenções;
- últimas atividades registradas;
- distribuição de tipos de O.S. por categoria.

### 2. Gestão de equipamentos

A área de equipamentos permite:

- cadastro de novos ativos;
- filtro por setor e status;
- consulta por código, nome ou setor;
- visualização de ficha técnica detalhada;
- histórico de O.S. associadas;
- peças de reposição e manuais do equipamento;
- atualização do status do ativo (operacional, em manutenção, inativo).

Cada equipamento pode ter informações como:

- código;
- fabricante e modelo;
- setor e localização;
- criticidade;
- tensão elétrica;
- data de instalação;
- disponibilidade;
- MTBF;
- custo acumulado;
- próxima manutenção;
- peças e manuais.

### 3. Ordens de serviço

A área de O.S. oferece:

- abertura de novas ordens de serviço;
- seleção do equipamento, prioridade e tipo de serviço;
- acompanhamento por status (Em Aberto, Em Andamento, Concluída, Cancelada);
- filtros por busca, prioridade e status;
- detalhamento da ordem com resumo, eventos e dados do equipamento;
- possibilidade de iniciar atendimento e encerrar O.S. diretamente no modal.

### 4. Planejamento de manutenções

A seção de manutenções permite:

- cadastro de rotinas e planos de manutenção;
- definição de categoria (Preventiva, Corretiva, Preditiva);
- frequência (semanal, quinzenal, mensal, trimestral, semestral, anual);
- responsável técnico;
- próxima data da execução;
- status da rotina (programada, atrasada, concluída);
- filtros por tarefa, categoria, status e data.

### 5. Persistência local

Os dados são armazenados no navegador via `localStorage`, o que facilita testes, demonstrações e uso local sem necessidade de banco de dados ou backend.

Isso significa que:

- os dados ficam salvos no navegador do usuário;
- a aplicação funciona em modo standalone;
- o conteúdo pode ser reutilizado entre sessões no mesmo navegador.

### 6. Módulos em desenvolvimento

Algumas páginas já foram estruturadas como futuras funcionalidades do sistema, mas ainda não estão totalmente liberadas:

- Histórico de intervenções;
- Relatórios e indicadores;
- Usuários e níveis de acesso;

Essas páginas aparecem com estrutura educacional e de orientação para o futuro do produto.

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla
- LocalStorage para persistência

## Requisitos

Para usar o projeto, basta ter:

- navegador moderno (Chrome, Edge, Firefox ou Safari);
- conexão opcional para carregar fontes externas da internet;
- acesso local ao projeto em pasta ou via servidor HTTP.

Não há dependências de Node.js, npm ou framework para execução básica.

## Estrutura do projeto

```text
.
├── css/
│   ├── dashboard.css
│   ├── equipamentos.css
│   ├── manutencoes.css
│   ├── ordens.css
│   ├── style.css
│   └── usuarios.css
├── js/
│   ├── dashboard.js
│   ├── dados.js
│   ├── manutencoes.js
│   ├── ordens.js
│   └── script.js
├── index.html
├── equipamentos.html
├── ordens.html
├── manutencoes.html
├── historico.html
├── relatorios.html
├── usuarios.html
├── README.md
└── .gitignore
```

## Como executar

### Opção 1: abrir diretamente no navegador

1. Faça o clone do projeto:

```bash
git clone https://github.com/Devan-M/dm-cmms.git
cd dm-cmms
```

2. Abra o arquivo `index.html` no navegador.

### Opção 2: servir localmente com Python

Se preferir executar em um servidor local para evitar limitações do navegador:

```bash
cd dm-cmms
python -m http.server 8000
```

Em seguida, acesse:

```text
http://localhost:8000
```

## Como usar o sistema

### Dashboard

- Acesse a página inicial para acompanhar o status geral da manutenção.
- Veja indicadores de desempenho e principais pendências.

### Equipamentos

- Clique em "Equipamentos" no menu superior.
- Utilize o botão "Novo Equipamento" para cadastrar um ativo.
- Aplique filtros por setor e status.
- Clique em "Detalhes" para acessar ficha técnica, histórico e peças.

### Ordens de Serviço

- Na página "Ordens de Serviço", informe equipamento, prioridade e descrição.
- Crie a O.S. e acompanhe ela na lista.
- Abra o detalhamento para iniciar atendimento, concluir ou cancelar.

### Manutenções

- Na página "Manutenções", cadastre rotinas preventivas, corretivas ou preditivas.
- Defina data, categoria, responsável e frequência.
- Marque a rotina como concluída quando executada.

## Dados de demonstração

O projeto já vem com dados iniciais de exemplo para facilitar a visualização e a navegação, incluindo equipamentos e rotinas prontas. Esses dados são carregados no `localStorage` na primeira execução do sistema.

## Fluxo de desenvolvimento

O projeto está organizado como uma aplicação front-end de gestão de manutenção, com foco em validação de conceitos, interface e usabilidade. O próximo estágio de evolução pode incluir:

- backend para persistência centralizada;
- autenticação de usuários;
- banco de dados relacional ou NoSQL;
- exportação de relatórios;
- integração com APIs e sistemas externos;
- versões responsivas e mobile-first.

## Boas práticas

- Não versionar dados sensíveis ou reais;
- manter a documentação atualizada quando a aplicação evoluir;
- testar as alterações no navegador antes de compartilhar a versão;
- manter nomes de arquivos e elementos consistentes com a estrutura do projeto.

## Contribuição

Contribuições são bem-vindas. Para colaborar:

```bash
git checkout -b feature/minha-alteracao
git add .
git commit -m "Adiciona funcionalidade X"
git push origin feature/minha-alteracao
```

Depois, abra um pull request com uma descrição clara do que foi alterado e como validar.

## Licença

A licença do projeto está em desenvolvimento. Neste momento, a aplicação é disponibilizada como uso gratuito para fins de estudo, demonstração e evolução interna.

## Contato

Para dúvidas, sugestões, melhorias ou relatórios de problema, você pode:

- abrir uma issue no repositório;
- entrar em contato pelo [LinkedIn de Devan M.](https://www.linkedin.com/in/devan-m/).
