// =========================================================
// SGM - Ordens de Serviço (interface). Dados vêm de js/dados.js
// =========================================================

let osAberta = null; // número da O.S. exibida no modal

const classePrioridade = (p) => slug(p); // Alta / Média / Baixa -> alta / media / baixa

// --- Equipamentos no select (sempre lidos do localStorage) ------------------
function preencherEquipamentos(selecionar) {
    const select = document.getElementById('os-equipamento');
    const atual = selecionar || select.value;
    const equipamentos = carregarEquipamentos();
    const semEquip = equipamentos.length === 0;

    select.innerHTML = '<option value="">Selecione...</option>' + equipamentos
        .map(e => `<option value="${esc(e.codigo)}">${esc(e.nome)} (${esc(e.codigo)})</option>`).join('');
    select.disabled = semEquip;
    document.getElementById('btn-criar-os').disabled = semEquip;
    document.getElementById('aviso-sem-equip').hidden = !semEquip;

    if (atual && equipamentos.some(e => e.codigo === atual)) select.value = atual;
}

const nomeEquipamento = (os) => {
    const eq = carregarEquipamentos().find(e => e.codigo === os.codigo);
    return eq ? eq.nome : os.equipamento;
};

// --- Indicadores (sempre sobre o total, ignorando filtros) --------------------
function atualizarIndicadores(ordens) {
    const total = ordens.length;
    const contar = (s) => ordens.filter(o => o.status === s).length;
    const pct = (n) => `${total ? Math.round((n / total) * 100) : 0}% do total`;

    document.getElementById('ind-total').textContent = total;
    [['aberto', 'Em Aberto'], ['andamento', 'Em Andamento'], ['concluida', 'Concluída'], ['cancelada', 'Cancelada']]
        .forEach(([id, status]) => {
            const n = contar(status);
            document.getElementById(`ind-${id}`).textContent = n;
            document.getElementById(`ind-${id}-pct`).textContent = pct(n);
        });
}

// --- Tabela -----------------------------------------------------------------
function renderizarTabela() {
    atualizarIndicadores(carregarOrdens());

    const termo = document.getElementById('busca').value.trim().toLowerCase();
    const status = document.getElementById('filtro-status').value;
    const prio = document.getElementById('filtro-prioridade').value;

    const lista = carregarOrdens()
        .filter(o => `${o.numero} ${nomeEquipamento(o)} ${o.codigo} ${o.responsavel}`.toLowerCase().includes(termo)
            && (!status || o.status === status)
            && (!prio || o.prioridade === prio))
        .sort((a, b) => b.numero - a.numero);

    const tbody = document.getElementById('tabela-corpo');
    if (!lista.length) {
        tbody.innerHTML = '<tr class="sem-resultado"><td colspan="6">Nenhuma O.S. encontrada. Ajuste os filtros ou abra uma nova.</td></tr>';
        return;
    }

    tbody.innerHTML = lista.map(o => `
        <tr>
            <td><strong>#${o.numero}</strong></td>
            <td>${esc(nomeEquipamento(o))}</td>
            <td><span class="badge-criticidade ${classePrioridade(o.prioridade)}">${esc(o.prioridade)}</span></td>
            <td>${formatarData(o.abertura)}</td>
            <td><span class="status ${classeStatusOS(o.status)}">${esc(o.status)}</span></td>
            <td><a href="#" class="link-acao" data-numero="${o.numero}">Detalhes</a></td>
        </tr>`).join('');
}

// --- Modal ------------------------------------------------------------------
const abrirModal = (el) => { el.classList.add('show'); el.setAttribute('aria-hidden', 'false'); };
const fecharModal = (el) => { el.classList.remove('show'); el.setAttribute('aria-hidden', 'true'); };

function campo(rotulo, html) {
    return `<div class="campo-ficha"><label>${rotulo}</label><p>${html}</p></div>`;
}

function mostrarAba(nome) {
    document.querySelectorAll('.tab-link').forEach(b => b.classList.toggle('active', b.dataset.tab === nome));
    document.querySelectorAll('.tab-panel').forEach(p => { p.hidden = p.id !== `tab-${nome}`; });
}

function abrirDetalhes(numero, aba = 'resumo') {
    const os = carregarOrdens().find(o => o.numero === numero);
    if (!os) return;
    osAberta = numero;

    const badge = document.getElementById('os-status');
    badge.textContent = os.status;
    badge.className = `modal-badge-status status ${classeStatusOS(os.status)}`;
    document.getElementById('os-titulo').innerHTML =
        `O.S. <span>#${os.numero}</span> <span class="modal-subtitulo">${esc(os.tipo)}</span>`;

    // Aba: Resumo
    document.getElementById('tab-resumo').innerHTML = `
        <div class="grid-ficha-tecnica">
            ${campo('Equipamento', esc(nomeEquipamento(os)))}
            ${campo('Código do ativo', esc(os.codigo))}
            ${campo('Prioridade', `<span class="badge-criticidade ${classePrioridade(os.prioridade)}">${esc(os.prioridade)}</span>`)}
            ${campo('Tipo de serviço', esc(os.tipo))}
            ${campo('Data de abertura', formatarData(os.abertura))}
            ${campo('Responsável', esc(os.responsavel || 'Não atribuído'))}
        </div>
        <div class="descricao-os"><strong>Descrição:</strong> ${esc(os.descricao)}</div>`;

    // Aba: Andamento
    const eventos = os.eventos || [];
    document.getElementById('tab-andamento').innerHTML = eventos.length
        ? `<ol class="linha-tempo">${eventos.map(ev =>
            `<li><time>${formatarDataHora(ev.data)}</time>${esc(ev.texto)}</li>`).join('')}</ol>`
        : '<div class="vazio">Nenhum evento registrado.</div>';

    // Aba: Equipamento (dados vindos do cadastro de equipamentos)
    const eq = carregarEquipamentos().find(e => e.codigo === os.codigo);
    document.getElementById('tab-equipamento').innerHTML = eq ? `
        <div class="grid-ficha-tecnica">
            ${campo('Fabricante / Marca', esc(eq.fabricante) || '—')}
            ${campo('Modelo', esc(eq.modelo) || '—')}
            ${campo('Setor / Localização', esc(eq.localizacao || eq.setor))}
            ${campo('Status atual', `<span class="status ${classeStatus(eq.status)}">${esc(eq.status)}</span>`)}
            ${campo('Criticidade', `<span class="badge-criticidade ${slug(eq.criticidade)}">${esc(eq.criticidade)}</span>`)}
            ${campo('Tensão Elétrica', esc(eq.tensao) || '—')}
        </div>
        <p class="subtitulo-aba">Peças deste equipamento</p>
        ${(eq.pecas || []).length
            ? `<ul class="lista-manuais" style="margin-top:0">${eq.pecas.map(p =>
                `<li>${esc(p.codigo)} — ${esc(p.nome)} (estoque: ${esc(p.estoque)})</li>`).join('')}</ul>`
            : '<div class="vazio">Nenhuma peça cadastrada.</div>'}`
        : '<div class="vazio">Este equipamento não está mais cadastrado.</div>';

    // Rodapé: ações conforme o status
    const acoes = [];
    if (os.status === 'Em Aberto') acoes.push('<button type="button" class="btn btn-primary" data-acao="Em Andamento">Iniciar atendimento</button>');
    if (os.status === 'Em Andamento') acoes.push('<button type="button" class="btn btn-primary" data-acao="Concluída">Concluir O.S.</button>');
    const cancelavel = os.status === 'Em Aberto' || os.status === 'Em Andamento';
    document.getElementById('os-rodape').innerHTML =
        (cancelavel ? '<button type="button" class="btn btn-secondary btn-perigo" data-acao="Cancelada">Cancelar O.S.</button>' : '')
        + '<button type="button" class="btn btn-secondary" data-fechar>Fechar</button>'
        + acoes.join('');

    mostrarAba(aba);
    abrirModal(document.getElementById('modal-os'));
}

function alterarStatus(novoStatus) {
    const lista = carregarOrdens();
    const os = lista.find(o => o.numero === osAberta);
    if (!os) return;

    const textos = {
        'Em Andamento': 'Atendimento iniciado',
        'Concluída': 'O.S. concluída',
        'Cancelada': 'O.S. cancelada'
    };
    os.status = novoStatus;
    os.eventos = [...(os.eventos || []), { data: agoraISO(), texto: textos[novoStatus] }];
    salvarOrdens(lista);

    renderizarTabela();
    abrirDetalhes(osAberta, 'andamento');
}

// --- Nova O.S. ----------------------------------------------------------------
function criarOS(ev) {
    ev.preventDefault();
    const f = ev.target.elements;
    const eq = carregarEquipamentos().find(e => e.codigo === f.equipamento.value);
    if (!eq) return;

    const lista = carregarOrdens();
    const numero = lista.reduce((max, o) => Math.max(max, o.numero), 1000) + 1;

    lista.push({
        numero,
        codigo: eq.codigo,
        equipamento: eq.nome,
        prioridade: f.prioridade.value,
        tipo: f.tipo.value,
        abertura: hojeISO(),
        status: 'Em Aberto',
        responsavel: 'Não atribuído',
        descricao: f.descricao.value.trim(),
        eventos: [{ data: agoraISO(), texto: 'O.S. aberta' }]
    });
    salvarOrdens(lista);

    ev.target.reset();
    preencherEquipamentos();
    renderizarTabela();
    abrirDetalhes(numero);
}

// --- Inicialização --------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Vindo de "Abrir Ordem de Serviço" na página de equipamentos
    const preSelecionado = new URLSearchParams(location.search).get('equipamento');
    preencherEquipamentos(preSelecionado);
    if (preSelecionado) document.getElementById('os-descricao').focus();

    renderizarTabela();

    ['busca', 'filtro-status', 'filtro-prioridade'].forEach(id =>
        document.getElementById(id).addEventListener('input', renderizarTabela));

    document.getElementById('form-os').addEventListener('submit', criarOS);

    document.getElementById('tabela-corpo').addEventListener('click', (ev) => {
        const link = ev.target.closest('.link-acao');
        if (!link) return;
        ev.preventDefault();
        abrirDetalhes(Number(link.dataset.numero));
    });

    document.querySelector('.modal-tabs').addEventListener('click', (ev) => {
        const btn = ev.target.closest('.tab-link');
        if (btn) mostrarAba(btn.dataset.tab);
    });

    const modal = document.getElementById('modal-os');
    modal.addEventListener('click', (ev) => {
        if (ev.target === modal || ev.target.closest('[data-fechar]')) return fecharModal(modal);
        const acao = ev.target.closest('[data-acao]');
        if (!acao) return;
        if (acao.dataset.acao === 'Cancelada' && !confirm('Cancelar esta O.S.?')) return;
        alterarStatus(acao.dataset.acao);
    });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') fecharModal(modal); });

    // Mantém a lista de equipamentos atualizada se mudar em outra aba ou ao voltar para esta página
    window.addEventListener('storage', () => { preencherEquipamentos(); renderizarTabela(); });
    window.addEventListener('pageshow', (ev) => { if (ev.persisted) { preencherEquipamentos(); renderizarTabela(); } });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) preencherEquipamentos(); });
});