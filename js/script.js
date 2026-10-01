// =========================================================
// SGM - Equipamentos (dados somente no localStorage)
// =========================================================

const CHAVE = 'sgm_equipamentos_v2';
const SETORES = ['Usinagem', 'Estamparia', 'Utilidades', 'Logística', 'Moldagem'];

// --- Dados iniciais -------------------------------------------------------
const equipamentosIniciais = [
    {
        codigo: 'EQ-001', nome: 'Torno CNC - T01', setor: 'Usinagem', criticidade: 'Alta', status: 'Operacional',
        fabricante: 'Romi', modelo: 'D 800 New Generation', localizacao: 'Usinagem (Linha A)',
        tensao: '380V Trifásico', dataInstalacao: '2022-03-14',
        disponibilidade: '94.2%', mtbf: '420h', custoAcumulado: 4250,
        proximaData: '2026-11-15', proximaDescricao: 'Troca de óleo hidráulico e calibração dos eixos',
        historico: [
            { os: 'OS-0412', data: '2026-08-02', tipo: 'Preventiva', descricao: 'Lubrificação geral e inspeção de eixos', status: 'Concluída' },
            { os: 'OS-0357', data: '2026-05-18', tipo: 'Corretiva', descricao: 'Substituição de sensor de proximidade', status: 'Concluída' },
            { os: 'OS-0291', data: '2026-02-09', tipo: 'Inspeção', descricao: 'Verificação de folgas no fuso', status: 'Concluída' }
        ],
        pecas: [
            { codigo: 'P-1020', nome: 'Sensor de proximidade M12', qtd: 2, estoque: 5 },
            { codigo: 'P-1034', nome: 'Óleo hidráulico ISO VG 46 (20L)', qtd: 1, estoque: 3 },
            { codigo: 'P-1101', nome: 'Correia dentada do fuso', qtd: 1, estoque: 0 }
        ],
        manuais: ['Manual de operação - Romi D 800 (PDF)', 'Esquema elétrico - T01 (PDF)']
    },
    {
        codigo: 'EQ-002', nome: 'Prensa Hidráulica - P03', setor: 'Estamparia', criticidade: 'Alta', status: 'Em Manutenção',
        fabricante: 'Schuler', modelo: 'HP 200T', localizacao: 'Estamparia (Linha B)',
        tensao: '440V Trifásico', dataInstalacao: '2020-08-10',
        disponibilidade: '78.5%', mtbf: '180h', custoAcumulado: 12800,
        proximaData: '', proximaDescricao: 'Em andamento (troca de vedações)',
        historico: [
            { os: 'OS-0431', data: '2026-09-28', tipo: 'Corretiva', descricao: 'Vazamento no cilindro principal', status: 'Em andamento' },
            { os: 'OS-0388', data: '2026-06-11', tipo: 'Corretiva', descricao: 'Troca de mangueira de alta pressão', status: 'Concluída' },
            { os: 'OS-0302', data: '2026-02-20', tipo: 'Preventiva', descricao: 'Troca de filtro e análise do óleo', status: 'Concluída' }
        ],
        pecas: [
            { codigo: 'P-2005', nome: 'Kit de vedações do cilindro', qtd: 1, estoque: 1 },
            { codigo: 'P-2011', nome: 'Mangueira hidráulica 3/4"', qtd: 2, estoque: 4 }
        ],
        manuais: ['Manual de manutenção - Schuler HP 200T (PDF)', 'Diagrama hidráulico - P03 (PDF)']
    },
    {
        codigo: 'EQ-003', nome: 'Compressor de Ar - C02', setor: 'Utilidades', criticidade: 'Média', status: 'Operacional',
        fabricante: 'Atlas Copco', modelo: 'GA 37', localizacao: 'Sala de Compressores',
        tensao: '380V Trifásico', dataInstalacao: '2021-01-05',
        disponibilidade: '98.1%', mtbf: '650h', custoAcumulado: 1500,
        proximaData: '2026-12-20', proximaDescricao: 'Troca de filtros',
        historico: [
            { os: 'OS-0399', data: '2026-07-04', tipo: 'Preventiva', descricao: 'Troca de óleo e filtro separador', status: 'Concluída' },
            { os: 'OS-0260', data: '2026-01-15', tipo: 'Inspeção', descricao: 'Verificação de pressostato', status: 'Concluída' }
        ],
        pecas: [
            { codigo: 'P-3010', nome: 'Filtro de ar GA 37', qtd: 1, estoque: 2 },
            { codigo: 'P-3022', nome: 'Elemento separador ar/óleo', qtd: 1, estoque: 1 }
        ],
        manuais: ['Manual do compressor GA 37 (PDF)']
    },
    {
        codigo: 'EQ-004', nome: 'Ponte Rolante - PR01', setor: 'Logística', criticidade: 'Baixa', status: 'Operacional',
        fabricante: 'Demag', modelo: 'EKKE 10t', localizacao: 'Galpão Principal',
        tensao: '380V Trifásico', dataInstalacao: '2019-05-22',
        disponibilidade: '99.0%', mtbf: '800h', custoAcumulado: 800,
        proximaData: '2027-01-10', proximaDescricao: 'Inspeção estrutural de cabos',
        historico: [
            { os: 'OS-0345', data: '2026-04-30', tipo: 'Inspeção', descricao: 'Inspeção anual de cabos e freios', status: 'Concluída' }
        ],
        pecas: [
            { codigo: 'P-4001', nome: 'Cabo de aço 12mm (por metro)', qtd: 40, estoque: 60 }
        ],
        manuais: ['Manual Demag EKKE (PDF)', 'Checklist NR-11 (PDF)']
    },
    {
        codigo: 'EQ-005', nome: 'Fresadora Vertical - F01', setor: 'Usinagem', criticidade: 'Média', status: 'Inativo',
        fabricante: 'Mazak', modelo: 'VCN-530C', localizacao: 'Usinagem (Linha B)',
        tensao: '220V Trifásico', dataInstalacao: '2018-11-03',
        disponibilidade: '0%', mtbf: '300h', custoAcumulado: 9600,
        proximaData: '', proximaDescricao: 'Aguardando chegada do servo motor',
        historico: [
            { os: 'OS-0420', data: '2026-09-10', tipo: 'Corretiva', descricao: 'Falha no servo motor do eixo Y', status: 'Pendente' }
        ],
        pecas: [
            { codigo: 'P-5003', nome: 'Servo motor eixo Y', qtd: 1, estoque: 0 }
        ],
        manuais: ['Manual Mazak VCN-530C (PDF)']
    },
    {
        codigo: 'EQ-006', nome: 'Injetora - INJ01', setor: 'Moldagem', criticidade: 'Alta', status: 'Operacional',
        fabricante: 'Haitian', modelo: 'MA3800', localizacao: 'Setor de Moldagem',
        tensao: '380V Trifásico', dataInstalacao: '2023-06-19',
        disponibilidade: '96.4%', mtbf: '510h', custoAcumulado: 2100,
        proximaData: '2026-12-05', proximaDescricao: 'Limpeza do canhão e troca de resistências',
        historico: [
            { os: 'OS-0405', data: '2026-07-22', tipo: 'Preventiva', descricao: 'Limpeza do canhão e verificação de resistências', status: 'Concluída' }
        ],
        pecas: [
            { codigo: 'P-6010', nome: 'Resistência de canhão 2kW', qtd: 3, estoque: 6 }
        ],
        manuais: ['Manual Haitian MA3800 (PDF)']
    }
];

// --- Utilitários ----------------------------------------------------------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const slug = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');

function formatarData(iso) {
    if (!iso) return '—';
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
}

const formatarMoeda = (v) => (typeof v === 'number'
    ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    : (v || '—'));

const classeStatus = (s) => ({ 'Operacional': 'status-agendada', 'Em Manutenção': 'status-pendente' }[s] || 'status-inativo');

const classeStatusOS = (s) => ({ 'Concluída': 'status-agendada', 'Em andamento': 'status-andamento', 'Pendente': 'status-pendente' }[s] || 'status-inativo');

// --- localStorage ---------------------------------------------------------
function carregarEquipamentos() {
    try {
        const salvo = localStorage.getItem(CHAVE);
        if (salvo) return JSON.parse(salvo);
    } catch (e) {
        console.error('Erro ao ler localStorage:', e);
    }
    salvarTodos(equipamentosIniciais);
    return equipamentosIniciais;
}

function salvarTodos(lista) {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(lista));
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
        alert('Não foi possível salvar os dados neste navegador.');
    }
}

function proximoCodigo(lista) {
    const maior = lista.reduce((max, e) => Math.max(max, parseInt(e.codigo.replace(/\D/g, ''), 10) || 0), 0);
    return `EQ-${String(maior + 1).padStart(3, '0')}`;
}

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
    const hist = e.historico || [];
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