(function () {
    'use strict';

    const CHAVE_OS = 'sgm_ordens_v1';
    const CHAVE_MANUTENCOES = 'sgm_manutencoes';

    const $ = (id) => document.getElementById(id);

    const escapar = (valor) => String(valor ?? '').replace(/[&<>"']/g, (caractere) => ({
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '&quot;',
        "'": '&#39;'
    }[caractere]));

    function hojeISO() {
        const data = new Date();
        data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
        return data.toISOString().slice(0, 10);
    }

    function formatarData(iso) {
        if (!iso) return '—';

        const partes = String(iso).slice(0, 10).split('-');
        if (partes.length !== 3) return '—';

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function formatarHoraAtual() {
        return new Date().toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    }

    function carregarOrdensDashboard() {
        try {
            const dados = JSON.parse(localStorage.getItem(CHAVE_OS));
            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            console.error('Erro ao carregar ordens no dashboard:', erro);
            return [];
        }
    }

    function carregarManutencoesDashboard() {
        try {
            const dados = JSON.parse(localStorage.getItem(CHAVE_MANUTENCOES));
            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            console.error('Erro ao carregar manutenções no dashboard:', erro);
            return [];
        }
    }

    function nomeDoEquipamento(ordem, equipamentos) {
        const equipamento = equipamentos.find((item) => item.codigo === ordem.codigo);
        return equipamento ? equipamento.nome : ordem.equipamento || 'Equipamento não identificado';
    }

    function classeStatusManutencao(rotina) {
        if (rotina.concluida) return 'status-concluida';
        return rotina.data < hojeISO() ? 'status-atrasada' : 'status-agendada';
    }

    function textoStatusManutencao(rotina) {
        if (rotina.concluida) return 'Concluída';
        return rotina.data < hojeISO() ? 'Atrasada' : 'Programada';
    }

    function atualizarIndicadores(equipamentos, ordens, manutencoes) {
        const ordensAbertas = ordens.filter((ordem) =>
            ordem.status === 'Em Aberto' ||
            ordem.status === 'Em Andamento'
        );

        const manutencoesPendentes = manutencoes.filter((rotina) => !rotina.concluida);

        const mesAtual = hojeISO().slice(0, 7);
        const preventivasMes = manutencoes.filter((rotina) =>
            rotina.categoria === 'Preventiva' &&
            String(rotina.data || '').slice(0, 7) === mesAtual
        );

        $('ind-equipamentos').textContent = equipamentos.length;
        $('ind-os-abertas').textContent = ordensAbertas.length;
        $('ind-manutencoes').textContent = manutencoesPendentes.length;
        $('ind-preventivas').textContent = preventivasMes.length;
        $('ultima-atualizacao').textContent = formatarHoraAtual();
    }

    function renderizarProximasManutencoes(manutencoes, equipamentos) {
        const corpo = $('tabela-proximas-manutencoes');

        const lista = manutencoes
            .filter((rotina) => !rotina.concluida)
            .sort((a, b) => String(a.data).localeCompare(String(b.data)))
            .slice(0, 5);

        if (!lista.length) {
            corpo.innerHTML = `
                <tr>
                    <td colspan="5" class="dashboard-vazio">
                        Nenhuma manutenção pendente cadastrada.
                    </td>
                </tr>`;
            return;
        }

        corpo.innerHTML = lista.map((rotina) => {
            const equipamento = equipamentos.find((item) =>
                item.codigo === rotina.codigo
            );

            const nome = equipamento
                ? equipamento.nome
                : rotina.ativo || 'Equipamento não identificado';

            const status = textoStatusManutencao(rotina);
            const classe = classeStatusManutencao(rotina);

            return `
                <tr>
                    <td>
                        ${escapar(nome)}
                        ${rotina.codigo
                    ? `<small class="dashboard-subtexto">${escapar(rotina.codigo)}</small>`
                    : ''}
                    </td>
                    <td>${escapar(rotina.categoria || 'Preventiva')}</td>
                    <td>${formatarData(rotina.data)}</td>
                    <td>${escapar(rotina.responsavel || 'Não atribuído')}</td>
                    <td>
                        <span class="status ${classe}">
                            ${status}
                        </span>
                    </td>
                </tr>`;
        }).join('');
    }

    function renderizarAtividades(ordens, equipamentos) {
        const lista = $('lista-atividades');

        const atividades = [...ordens]
            .sort((a, b) => String(b.abertura).localeCompare(String(a.abertura)))
            .slice(0, 4);

        if (!atividades.length) {
            lista.innerHTML = `
                <li class="dashboard-atividade-vazia">
                    Nenhuma atividade registrada.
                </li>`;
            return;
        }

        lista.innerHTML = atividades.map((ordem) => {
            const equipamento = nomeDoEquipamento(ordem, equipamentos);

            let titulo = 'O.S. registrada';
            if (ordem.status === 'Em Aberto') titulo = 'Nova O.S. aberta';
            if (ordem.status === 'Em Andamento') titulo = 'O.S. em andamento';
            if (ordem.status === 'Concluída') titulo = 'O.S. concluída';
            if (ordem.status === 'Cancelada') titulo = 'O.S. cancelada';

            return `
                <li>
                    <strong>${escapar(titulo)} #${escapar(ordem.numero)}</strong>
                    <span>
                        ${escapar(equipamento)} · ${formatarData(ordem.abertura)}
                    </span>
                </li>`;
        }).join('');
    }

    function renderizarDistribuicao(ordens) {
        const total = ordens.length;

        const quantidadePreventiva = ordens.filter((ordem) =>
            ordem.tipo === 'Preventiva'
        ).length;

        const quantidadeCorretiva = ordens.filter((ordem) =>
            ordem.tipo === 'Corretiva'
        ).length;

        const quantidadeInspecao = ordens.filter((ordem) =>
            ordem.tipo === 'Inspeção'
        ).length;

        const percentual = (quantidade) =>
            total ? Math.round((quantidade / total) * 100) : 0;

        const preventiva = percentual(quantidadePreventiva);
        const corretiva = percentual(quantidadeCorretiva);
        const inspecao = percentual(quantidadeInspecao);

        $('total-tipos').textContent = total;
        $('pct-preventiva').textContent = `${preventiva}%`;
        $('pct-corretiva').textContent = `${corretiva}%`;
        $('pct-inspecao').textContent = `${inspecao}%`;

        const inicioCorretiva = preventiva;
        const inicioInspecao = preventiva + corretiva;

        $('grafico-tipos').style.background = `
            conic-gradient(
                var(--primary) 0% ${inicioCorretiva}%,
                var(--danger) ${inicioCorretiva}% ${inicioInspecao}%,
                var(--warning) ${inicioInspecao}% 100%
            )`;
    }

    function renderizarDashboard() {
        const equipamentos = typeof carregarEquipamentos === 'function'
            ? carregarEquipamentos()
            : [];

        const ordens = carregarOrdensDashboard();
        const manutencoes = carregarManutencoesDashboard();

        atualizarIndicadores(equipamentos, ordens, manutencoes);
        renderizarProximasManutencoes(manutencoes, equipamentos);
        renderizarAtividades(ordens, equipamentos);
        renderizarDistribuicao(ordens);
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderizarDashboard();

        window.addEventListener('storage', renderizarDashboard);

        window.addEventListener('pageshow', (evento) => {
            if (evento.persisted) {
                renderizarDashboard();
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                renderizarDashboard();
            }
        });
    });
})();