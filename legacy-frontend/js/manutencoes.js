(function () {
    'use strict';

    const CHAVE = 'sgm_manutencoes';
    const $ = (id) => document.getElementById(id);

    const FREQ_DIAS = { Semanal: 7, Quinzenal: 15, Mensal: 30, Trimestral: 90, Semestral: 180, Anual: 365 };

    const hojeISO = () => {
        const d = new Date();
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    };
    const somarDias = (iso, dias) => {
        const d = new Date(iso + 'T12:00:00');
        d.setDate(d.getDate() + dias);
        return d.toISOString().slice(0, 10);
    };
    const fmtData = (iso) => (iso ? iso.split('-').reverse().join('/') : '—');
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function seed() {
        const h = hojeISO();
        return [
            { id: 1, tarefa: 'Troca de óleo e filtros', ativo: 'Compressor de Ar - C02', categoria: 'Preventiva', frequencia: 'Mensal', data: somarDias(h, 23), responsavel: 'Carlos Silva', concluida: false },
            { id: 2, tarefa: 'Alinhamento e calibragem', ativo: 'Torno CNC - T01', categoria: 'Preditiva', frequencia: 'Trimestral', data: somarDias(h, 25), responsavel: 'Equipe Externa', concluida: false },
            { id: 3, tarefa: 'Revisão do sistema hidráulico', ativo: 'Prensa Hidráulica - P03', categoria: 'Preventiva', frequencia: 'Quinzenal', data: somarDias(h, -3), responsavel: 'Roberto Lima', concluida: false }
        ];
    }

    function carregar() {
        try {
            const salvo = JSON.parse(localStorage.getItem(CHAVE));
            if (Array.isArray(salvo)) return salvo;
        } catch (e) { /* ignora */ }
        const inicial = seed();
        try { localStorage.setItem(CHAVE, JSON.stringify(inicial)); } catch (e) { /* ignora */ }
        return inicial;
    }

    function salvar() {
        try { localStorage.setItem(CHAVE, JSON.stringify(rotinas)); } catch (e) { /* ignora */ }
    }

    // Equipamentos: mesma fonte da página equipamentos.html (js/dados.js)
    function listaEquip() {
        try {
            return typeof carregarEquipamentos === 'function' ? carregarEquipamentos() : [];
        } catch (e) {
            console.error('Erro ao carregar equipamentos:', e);
            return [];
        }
    }
    let mapaEq = {};
    function atualizarMapaEq() {
        mapaEq = {};
        listaEquip().forEach((e) => { mapaEq[e.codigo] = e; });
    }
    const ativoDe = (r) => (r.codigo && mapaEq[r.codigo] ? mapaEq[r.codigo].nome : r.ativo);

    function popularAtivos(r) {
        const eq = listaEquip();
        const sel = $('f-ativo');
        let html = eq.map((e) => `<option value="${esc(e.codigo)}">${esc(e.codigo)} — ${esc(e.nome)}</option>`).join('');
        let escolhido = '';

        if (r && r.codigo) {
            const porCodigo = eq.find((e) => e.codigo === r.codigo);
            if (porCodigo) {
                escolhido = porCodigo.codigo;
            } else {
                html = `<option value="__legado">${esc(r.ativo)} (não cadastrado)</option>` + html;
                escolhido = '__legado';
            }
        } else if (r && r.ativo) {
            // Rotina antiga sem código (ex.: os dados de seed)
            html = `<option value="__legado">${esc(r.ativo)} (não cadastrado)</option>` + html;
            escolhido = '__legado';
        }

        sel.innerHTML = html;
        if (escolhido) sel.value = escolhido;
        $('aviso-sem-equip').hidden = eq.length > 0 || !!escolhido;
    }

    let rotinas = carregar();
    let editandoId = null;

    function vincularCodigos() {
        const eq = listaEquip();
        let mudou = false;
        rotinas.forEach((r) => {
            if (r.codigo || !r.ativo) return;
            const m = eq.find((e) =>
                r.ativo === e.nome ||
                r.ativo.endsWith(' - ' + e.codigo) ||
                r.ativo.includes(e.codigo)
            );
            if (m) {
                r.codigo = m.codigo;
                r.ativo = m.nome;
                mudou = true;
            }
        });
        if (mudou) salvar();
    }

    function resolverAtivo() {
        const val = $('f-ativo').value;
        if (!val) return null;

        if (val === '__legado') {
            const r0 = rotinas.find((x) => x.id === editandoId);
            return r0 ? { ativo: r0.ativo, codigo: r0.codigo } : null;
        }

        const e = listaEquip().find((x) => x.codigo === val);
        return e ? { ativo: e.nome, codigo: e.codigo } : null;
    }

    function statusDe(r) {
        if (r.concluida) return 'Concluída';
        return r.data < hojeISO() ? 'Atrasada' : 'Programada';
    }
    const CLASSE = { 'Programada': 'status-agendada', 'Atrasada': 'status-pendente', 'Concluída': 'status-concluida' };

    function filtradas() {
        const q = $('busca').value.trim().toLowerCase();
        const cat = $('filtro-categoria').value;
        const st = $('filtro-status').value;
        const ate = $('filtro-data').value;
        return rotinas
            .filter((r) => {
                if (q && !`${r.tarefa} ${ativoDe(r)} ${r.codigo || ''} ${r.responsavel}`.toLowerCase().includes(q)) return false;
                if (cat && r.categoria !== cat) return false;
                if (st && statusDe(r) !== st) return false;
                if (ate && r.data > ate) return false;
                return true;
            })
            .sort((a, b) => (a.concluida - b.concluida) || (a.concluida ? b.data.localeCompare(a.data) : a.data.localeCompare(b.data)));
    }

    function renderIndicadores() {
        const h = hojeISO(), lim = somarDias(h, 7);
        const abertas = rotinas.filter((r) => !r.concluida);
        $('ind-total').textContent = rotinas.length;
        $('ind-programada').textContent = abertas.filter((r) => r.data >= h).length;
        $('ind-atrasada').textContent = abertas.filter((r) => r.data < h).length;
        $('ind-concluida').textContent = rotinas.filter((r) => r.concluida).length;
        $('ind-semana').textContent = abertas.filter((r) => r.data >= h && r.data <= lim).length;
    }

    function renderTabela() {
        atualizarMapaEq();
        const lista = filtradas();
        const corpo = $('tabela-corpo');
        if (!lista.length) {
            corpo.innerHTML = '<tr><td colspan="8" class="td-vazio">Nenhuma rotina encontrada.</td></tr>';
        } else {
            corpo.innerHTML = lista.map((r) => {
                const st = statusDe(r);
                return `<tr class="${st === 'Atrasada' ? 'linha-atrasada' : ''}">
                    <td class="td-principal">${esc(r.tarefa)}</td>
                    <td>${esc(ativoDe(r))}${r.codigo ? `<small class="data-conclusao">${esc(r.codigo)}</small>` : ''}</td>
                    <td>${esc(r.categoria)}</td>
                    <td>${esc(r.frequencia)}</td>
                    <td>${fmtData(r.data)}${r.ultimaExecucao && !r.concluida ? `<small class="data-conclusao">última: ${fmtData(r.ultimaExecucao)}</small>` : ''}</td>
                    <td>${esc(r.responsavel)}</td>
                    <td><span class="status ${CLASSE[st]}">${st}</span>${r.concluida && r.dataConclusao ? `<small class="data-conclusao">em ${fmtData(r.dataConclusao)}</small>` : ''}</td>
                    <td><div class="acoes-linha">
                        ${r.concluida
                        ? (r.reagendada ? '' : `<button type="button" class="btn-link" data-acao="reagendar" data-id="${r.id}">Reagendar</button>`)
                        : `<button type="button" class="btn-link" data-acao="concluir" data-id="${r.id}">Concluir</button>
                               <button type="button" class="btn-link" data-acao="editar" data-id="${r.id}">Editar</button>`}
                        <button type="button" class="btn-link perigo" data-acao="excluir" data-id="${r.id}">Excluir</button>
                    </div></td>
                </tr>`;
            }).join('');
        }
        renderIndicadores();
    }

    // ---------- Modal ----------
    function abrirModal(r) {
        editandoId = r ? r.id : null;
        $('mm-titulo').textContent = r ? 'Editar Rotina' : 'Nova Rotina';
        $('f-tarefa').value = r ? r.tarefa : '';
        popularAtivos(r);
        $('f-categoria').value = r ? r.categoria : 'Preventiva';
        $('f-frequencia').value = r ? r.frequencia : 'Mensal';
        $('f-data').value = r ? r.data : hojeISO();
        $('f-responsavel').value = r ? r.responsavel : '';
        $('modal-rotina').classList.add('aberto');
        $('modal-rotina').setAttribute('aria-hidden', 'false');
        $('f-tarefa').focus();
    }
    function fecharModal() {
        $('modal-rotina').classList.remove('aberto');
        $('modal-rotina').setAttribute('aria-hidden', 'true');
    }

    $('btn-nova').addEventListener('click', () => abrirModal(null));
    $('modal-rotina').addEventListener('click', (e) => {
        if (e.target === e.currentTarget || e.target.hasAttribute('data-fechar')) fecharModal();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharModal(); });

    // ---------- Submit do formulário ----------
    $('form-rotina').addEventListener('submit', (e) => {
        e.preventDefault();

        if (!$('f-tarefa').value.trim()) {
            alert('Preencha a tarefa.');
            return;
        }

        const at = resolverAtivo();
        if (!at) {
            alert('Selecione um equipamento válido.');
            return;
        }

        const dados = {
            tarefa: $('f-tarefa').value.trim(),
            ativo: at.ativo,
            codigo: at.codigo,
            categoria: $('f-categoria').value,
            frequencia: $('f-frequencia').value,
            data: $('f-data').value,
            responsavel: $('f-responsavel').value.trim()
        };

        if (editandoId) {
            const r = rotinas.find((x) => x.id === editandoId);
            Object.assign(r, dados, { concluida: false });
        } else {
            rotinas.push({ id: Date.now(), concluida: false, ...dados });
        }
        salvar(); fecharModal(); renderTabela();
    });

    // ---------- Ações da tabela ----------
    $('tabela-corpo').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-acao]');
        if (!btn) return;
        const id = Number(btn.dataset.id);
        const r = rotinas.find((x) => x.id === id);
        if (!r) return;

        if (btn.dataset.acao === 'editar') return abrirModal(r);

        if (btn.dataset.acao === 'excluir') {
            if (!confirm(`Excluir a rotina "${r.tarefa}"?`)) return;
            rotinas = rotinas.filter((x) => x.id !== id);
        }
        if (btn.dataset.acao === 'concluir') {
            r.concluida = true;
            r.dataConclusao = hojeISO();
        }
        if (btn.dataset.acao === 'reagendar') {
            if (r.reagendada) return;
            const base = r.dataConclusao || hojeISO();
            r.reagendada = true;
            rotinas.push({
                id: Date.now(),
                tarefa: r.tarefa,
                ativo: r.ativo,
                codigo: r.codigo,
                categoria: r.categoria,
                frequencia: r.frequencia,
                data: somarDias(base, FREQ_DIAS[r.frequencia] || 30),
                responsavel: r.responsavel,
                ultimaExecucao: base,
                concluida: false
            });
        }
        salvar(); renderTabela();
    });

    // ---------- Filtros ----------
    ['busca', 'filtro-categoria', 'filtro-status', 'filtro-data'].forEach((id) => {
        $(id).addEventListener('input', renderTabela);
    });
    $('btn-limpar').addEventListener('click', () => {
        ['busca', 'filtro-categoria', 'filtro-status', 'filtro-data'].forEach((id) => { $(id).value = ''; });
        renderTabela();
    });

    // ---------- Início ----------
    vincularCodigos();
    renderTabela();
})();