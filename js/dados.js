// =========================================================
// SGM - Camada de dados compartilhada (somente localStorage)
// =========================================================

const CHAVE = 'sgm_equipamentos_v2';
const CHAVE_OS = 'sgm_ordens_v1';
const CHAVE_MANUTENCOES = 'sgm_manutencoes';
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
    const partes = String(iso).slice(0, 10).split('-');
    if (partes.length !== 3) return '—';
    const [a, m, d] = partes;
    return `${d}/${m}/${a}`;
}

function formatarDataHora(iso) {
    if (!iso) return '—';
    const [data, hora] = String(iso).replace(' ', 'T').split('T');
    const [a, m, d] = data.split('-');
    return hora ? `${d}/${m}/${a} ${hora.slice(0, 5)}` : `${d}/${m}/${a}`;
}

const formatarMoeda = (v) => (typeof v === 'number'
    ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    : (v || '—'));

const classeStatus = (s) => ({ 'Operacional': 'status-agendada', 'Em Manutenção': 'status-pendente' }[s] || 'status-inativo');

const classeStatusOS = (s) => ({
    'Concluída': 'status-agendada', 'Em andamento': 'status-andamento', 'Em Andamento': 'status-andamento',
    'Pendente': 'status-pendente', 'Em Aberto': 'status-pendente'
}[s] || 'status-inativo');

const agoraISO = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16); // ex.: 2026-10-02T14:35
};

const hojeISO = () => agoraISO().slice(0, 10);

// Calcula percentuais inteiros cuja soma é sempre 100 (maior resto).
function percentuaisInteiros(quantidades) {
    const total = quantidades.reduce((a, b) => a + b, 0);
    if (!total) return quantidades.map(() => 0);

    const exatos = quantidades.map(q => (q / total) * 100);
    const pisos = exatos.map(Math.floor);
    const restante = 100 - pisos.reduce((a, b) => a + b, 0);

    exatos
        .map((valor, i) => ({ i, resto: valor - pisos[i] }))
        .sort((a, b) => b.resto - a.resto)
        .slice(0, restante)
        .forEach(({ i }) => pisos[i]++);

    return pisos;
}

// --- Equipamentos (localStorage) -----------------------------------------
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

// --- Ordens de serviço ----------------------------------------------------
const ordensIniciais = [
    {
        numero: 1045, codigo: 'EQ-002', equipamento: 'Prensa Hidráulica - P03', prioridade: 'Alta', tipo: 'Corretiva',
        abertura: '2026-09-22', status: 'Em Aberto', responsavel: 'Não atribuído',
        descricao: 'Vazamento de óleo no cilindro principal durante o ciclo de prensagem.',
        eventos: [{ data: '2026-09-22', texto: 'O.S. aberta' }]
    },
    {
        numero: 1044, codigo: 'EQ-001', equipamento: 'Torno CNC - T01', prioridade: 'Média', tipo: 'Preventiva',
        abertura: '2026-09-21', status: 'Em Andamento', responsavel: 'Carlos Menezes',
        descricao: 'Lubrificação do fuso e verificação de folgas nos eixos X e Z.',
        eventos: [{ data: '2026-09-21', texto: 'O.S. aberta' }, { data: '2026-09-22', texto: 'Atendimento iniciado' }]
    },
    {
        numero: 1043, codigo: 'EQ-003', equipamento: 'Compressor de Ar - C02', prioridade: 'Baixa', tipo: 'Inspeção',
        abertura: '2026-09-20', status: 'Concluída', responsavel: 'Rafael Souza',
        descricao: 'Inspeção de rotina: pressostato, drenos e nível de óleo.',
        eventos: [{ data: '2026-09-20', texto: 'O.S. aberta' }, { data: '2026-09-20', texto: 'Atendimento iniciado' }, { data: '2026-09-21', texto: 'O.S. concluída' }]
    },
    {
        numero: 1042, codigo: 'EQ-005', equipamento: 'Fresadora Vertical - F01', prioridade: 'Alta', tipo: 'Corretiva',
        abertura: '2026-09-10', status: 'Em Andamento', responsavel: 'Carlos Menezes',
        descricao: 'Falha no servo motor do eixo Y. Aguardando chegada da peça.',
        eventos: [{ data: '2026-09-10', texto: 'O.S. aberta' }, { data: '2026-09-11', texto: 'Atendimento iniciado' }]
    },
    {
        numero: 1041, codigo: 'EQ-004', equipamento: 'Ponte Rolante - PR01', prioridade: 'Baixa', tipo: 'Inspeção',
        abertura: '2026-09-02', status: 'Concluída', responsavel: 'Rafael Souza',
        descricao: 'Inspeção periódica de cabos de aço e freios.',
        eventos: [{ data: '2026-09-02', texto: 'O.S. aberta' }, { data: '2026-09-03', texto: 'O.S. concluída' }]
    }
];

function carregarOrdens() {
    try {
        const salvo = localStorage.getItem(CHAVE_OS);
        if (salvo) {
            const dados = JSON.parse(salvo);
            if (Array.isArray(dados)) return dados;
        }
    } catch (e) {
        console.error('Erro ao ler ordens:', e);
    }
    salvarOrdens(ordensIniciais);
    return ordensIniciais;
}

function salvarOrdens(lista) {
    try {
        localStorage.setItem(CHAVE_OS, JSON.stringify(lista));
    } catch (e) {
        console.error('Erro ao salvar ordens:', e);
        alert('Não foi possível salvar os dados neste navegador.');
    }
}

// --- Manutenções programadas ---------------------------------------------
// Formato: { codigo, ativo, categoria, data, responsavel, concluida }
// Obs.: se a sua página de manutenções já grava 'sgm_manutencoes' com outro
// formato, ajuste os campos abaixo para ficarem iguais aos dela.
const manutencoesIniciais = [
    { codigo: 'EQ-001', ativo: 'Torno CNC - T01', categoria: 'Preventiva', data: '2026-10-20', responsavel: 'Carlos Menezes', concluida: false },
    { codigo: 'EQ-006', ativo: 'Injetora - INJ01', categoria: 'Preventiva', data: '2026-12-05', responsavel: 'Rafael Souza', concluida: false },
    { codigo: 'EQ-003', ativo: 'Compressor de Ar - C02', categoria: 'Preventiva', data: '2026-12-20', responsavel: 'Rafael Souza', concluida: false },
    { codigo: 'EQ-004', ativo: 'Ponte Rolante - PR01', categoria: 'Inspeção', data: '2027-01-10', responsavel: 'Carlos Menezes', concluida: false },
    { codigo: 'EQ-001', ativo: 'Torno CNC - T01', categoria: 'Preventiva', data: '2026-08-02', responsavel: 'Carlos Menezes', concluida: true }
];

function carregarManutencoes() {
    try {
        const salvo = localStorage.getItem(CHAVE_MANUTENCOES);
        if (salvo) {
            const dados = JSON.parse(salvo);
            if (Array.isArray(dados)) return dados;
        }
    } catch (e) {
        console.error('Erro ao ler manutenções:', e);
    }
    salvarManutencoes(manutencoesIniciais);
    return manutencoesIniciais;
}

function salvarManutencoes(lista) {
    try {
        localStorage.setItem(CHAVE_MANUTENCOES, JSON.stringify(lista));
    } catch (e) {
        console.error('Erro ao salvar manutenções:', e);
        alert('Não foi possível salvar os dados neste navegador.');
    }
}