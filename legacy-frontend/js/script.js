// SGM - Equipamentos (interface). Dados vêm de js/dados.js

// --- Tabela, filtros e indicadores ----------------------------------------
function atualizarIndicadores(lista) {
    const total = lista.length;
    const op = lista.filter(e => e.status === 'Operacional').length;
    document.getElementById('ind-total').textContent = total;
    document.getElementById('ind-operacional').textContent = op;
    document.getElementById('ind-manutencao').textContent = lista.filter(e => e.status === 'Em Manutenção').length;
    document.getElementById('ind-inativo').textContent = lista.filter(e => e.status === 'Inativo').length;
    const pct = total ? ((op / total) * 100).toFixed(1) : '0.0';
    document.getElementById('ind-disponibilidade').textContent = `${pct}% de disponibilidade`;
}

function renderizarTabela() {
    const todos = carregarEquipamentos();
    atualizarIndicadores(todos);

    const termo = document.getElementById('busca').value.trim().toLowerCase();
    const setor = document.getElementById('filtro-setor').value;
    const status = document.getElementById('filtro-status').value;

    const lista = todos.filter(e =>
        `${e.codigo} ${e.nome} ${e.setor}`.toLowerCase().includes(termo)
        && (!setor || e.setor === setor)
        && (!status || e.status === status));

    const tbody = document.getElementById('tabela-corpo');
    if (!lista.length) {
        tbody.innerHTML = '<tr class="sem-resultado"><td colspan="6">Nenhum equipamento encontrado. Ajuste os filtros ou cadastre um novo.</td></tr>';
        return;
    }

    tbody.innerHTML = lista.map(e => `
        <tr>
            <td><strong>${esc(e.codigo)}</strong></td>
            <td>${esc(e.nome)}</td>
            <td>${esc(e.setor)}</td>
            <td><span class="badge-criticidade ${slug(e.criticidade)}">${esc(e.criticidade)}</span></td>
            <td><span class="status ${classeStatus(e.status)}">${esc(e.status)}</span></td>
            <td><a href="#" class="link-acao" data-codigo="${esc(e.codigo)}">Detalhes</a></td>
        </tr>`).join('');
}

// --- Modais ---------------------------------------------------------------
const abrirModal = (el) => { el.classList.add('show'); el.setAttribute('aria-hidden', 'false'); };
const fecharModal = (el) => { el.classList.remove('show'); el.setAttribute('aria-hidden', 'true'); };

function campo(rotulo, valorHtml) {
    return `<div class="campo-ficha"><label>${rotulo}</label><p>${valorHtml}</p></div>`;
}

function mostrarAba(nome) {
    document.querySelectorAll('.tab-link').forEach(b => b.classList.toggle('active', b.dataset.tab === nome));
    document.querySelectorAll('.tab-panel').forEach(p => { p.hidden = p.id !== `tab-${nome}`; });
}

function abrirDetalhes(codigo) {
    const e = carregarEquipamentos().find(x => x.codigo === codigo);
    if (!e) return;

    const badge = document.getElementById('det-status');
    badge.textContent = e.status;
    badge.className = `modal-badge-status status ${classeStatus(e.status)}`;
    document.getElementById('det-titulo').innerHTML = `${esc(e.nome)} <span class="modal-subtitulo">#${esc(e.codigo)}</span>`;
    document.getElementById('det-disp').textContent = e.disponibilidade || '—';
    document.getElementById('det-mtbf').textContent = e.mtbf || '—';
    document.getElementById('det-custo').textContent = formatarMoeda(e.custoAcumulado);

    // Aba 1: Ficha técnica
    const proxima = e.proximaData
        ? `${formatarData(e.proximaData)}${e.proximaDescricao ? ' (' + esc(e.proximaDescricao) + ')' : ''}`
        : (esc(e.proximaDescricao) || 'Nenhuma agendada');
    document.getElementById('tab-ficha').innerHTML = `
        <div class="grid-ficha-tecnica">
            ${campo('Fabricante / Marca', esc(e.fabricante) || '—')}
            ${campo('Modelo', esc(e.modelo) || '—')}
            ${campo('Setor / Localização', esc(e.localizacao || e.setor))}
            ${campo('Criticidade', `<span class="badge-criticidade ${slug(e.criticidade)}">${esc(e.criticidade)}</span>`)}
            ${campo('Tensão Elétrica', esc(e.tensao) || '—')}
            ${campo('Data de Instalação', formatarData(e.dataInstalacao))}
        </div>
        <div class="alerta-manutencao"><strong>Próxima manutenção preventiva:</strong> ${proxima}</div>`;

    // Aba 2: Histórico de O.S.
    const daPagina = carregarOrdens().filter(o => o.codigo === e.codigo).map(o => ({
        os: `#${o.numero}`, data: o.abertura, tipo: o.tipo, descricao: o.descricao, status: o.status
    }));
    const hist = [...daPagina, ...(e.historico || [])].sort((a, b) => b.data.localeCompare(a.data));
    document.getElementById('tab-historico').innerHTML = hist.length ? `
        <table class="tabela-modal">
            <thead><tr><th>O.S.</th><th>Data</th><th>Tipo</th><th>Descrição</th><th>Status</th></tr></thead>
            <tbody>${hist.map(h => `
                <tr>
                    <td><strong>${esc(h.os)}</strong></td>
                    <td>${formatarData(h.data)}</td>
                    <td>${esc(h.tipo)}</td>
                    <td>${esc(h.descricao)}</td>
                    <td><span class="status ${classeStatusOS(h.status)}">${esc(h.status)}</span></td>
                </tr>`).join('')}
            </tbody>
        </table>`
        : '<div class="vazio">Nenhuma ordem de serviço registrada para este equipamento.</div>';

    // Aba 3: Peças e manuais
    const pecas = e.pecas || [];
    const manuais = e.manuais || [];
    document.getElementById('tab-pecas').innerHTML = `
        <p class="subtitulo-aba" style="margin-top:0">Peças de reposição</p>
        ${pecas.length ? `
        <table class="tabela-modal">
            <thead><tr><th>Código</th><th>Peça</th><th class="num">Qtd. por troca</th><th class="num">Em estoque</th></tr></thead>
            <tbody>${pecas.map(p => `
                <tr>
                    <td><strong>${esc(p.codigo)}</strong></td>
                    <td>${esc(p.nome)}</td>
                    <td class="num">${esc(p.qtd)}</td>
                    <td class="num ${p.estoque < p.qtd ? 'estoque-baixo' : ''}">${esc(p.estoque)}</td>
                </tr>`).join('')}
            </tbody>
        </table>` : '<div class="vazio">Nenhuma peça cadastrada.</div>'}
        <p class="subtitulo-aba">Manuais e documentos</p>
        ${manuais.length
            ? `<ul class="lista-manuais" style="margin-top:0">${manuais.map(m => `<li>${esc(m)}</li>`).join('')}</ul>`
            : '<div class="vazio">Nenhum manual anexado.</div>'}`;

    document.getElementById('det-abrir-os').href = `ordens.html?equipamento=${encodeURIComponent(e.codigo)}`;
    mostrarAba('ficha');
    abrirModal(document.getElementById('modal-detalhes'));
}

function abrirCadastro() {
    const form = document.getElementById('form-equipamento');
    form.reset();
    form.elements.codigo.value = proximoCodigo(carregarEquipamentos());
    abrirModal(document.getElementById('modal-cadastro'));
    form.elements.nome.focus();
}

function salvarNovoEquipamento(ev) {
    ev.preventDefault();
    const f = ev.target.elements;
    const lista = carregarEquipamentos();

    lista.push({
        codigo: proximoCodigo(lista),
        nome: f.nome.value.trim(),
        setor: f.setor.value,
        criticidade: f.criticidade.value,
        status: f.status.value,
        fabricante: f.fabricante.value.trim(),
        modelo: f.modelo.value.trim(),
        localizacao: f.localizacao.value.trim() || f.setor.value,
        tensao: f.tensao.value.trim(),
        dataInstalacao: f.dataInstalacao.value,
        disponibilidade: '—',
        mtbf: '—',
        custoAcumulado: 0,
        proximaData: f.proximaData.value,
        proximaDescricao: f.proximaDescricao.value.trim(),
        historico: [],
        pecas: [],
        manuais: []
    });

    salvarTodos(lista);
    fecharModal(document.getElementById('modal-cadastro'));
    renderizarTabela();
}

// --- Inicialização --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Selects de setor
    document.getElementById('filtro-setor').innerHTML =
        '<option value="">Todos os Setores</option>' + SETORES.map(s => `<option>${s}</option>`).join('');
    document.getElementById('f-setor').innerHTML = SETORES.map(s => `<option>${s}</option>`).join('');

    renderizarTabela();

    // Filtros
    ['busca', 'filtro-setor', 'filtro-status'].forEach(id =>
        document.getElementById(id).addEventListener('input', renderizarTabela));

    // Detalhes
    document.getElementById('tabela-corpo').addEventListener('click', (ev) => {
        const link = ev.target.closest('.link-acao');
        if (!link) return;
        ev.preventDefault();
        abrirDetalhes(link.dataset.codigo);
    });

    // Abas
    document.querySelector('.modal-tabs').addEventListener('click', (ev) => {
        const btn = ev.target.closest('.tab-link');
        if (btn) mostrarAba(btn.dataset.tab);
    });

    // Cadastro
    document.getElementById('btn-novo-equipamento').addEventListener('click', abrirCadastro);
    document.getElementById('form-equipamento').addEventListener('submit', salvarNovoEquipamento);

    // Fechar modais: botões, clique no fundo e Esc
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (ev) => {
            if (ev.target === modal || ev.target.closest('[data-fechar]')) fecharModal(modal);
        });
    });
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') document.querySelectorAll('.modal-overlay.show').forEach(fecharModal);
    });
});