(function () {
    "use strict";

    // Requer: dados.js (e graficos.js) carregados ANTES deste arquivo.
    // Reutiliza de dados.js: esc, formatarData, hojeISO, agoraISO,
    // percentuaisInteiros, carregarEquipamentos, carregarOrdens,
    // carregarManutencoes.

    const $ = (id) => document.getElementById(id);

    const definirTexto = (id, valor) => {
        const elemento = $(id);

        if (elemento) {
            elemento.textContent = valor;
        }
    };

    function formatarHoraAtual() {
        return new Date().toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short"
        });
    }

    function nomeDoEquipamento(ordem, equipamentos) {
        const equipamento = equipamentos.find(
            (item) => item.codigo === ordem.codigo
        );

        return equipamento
            ? equipamento.nome
            : ordem.equipamento || "Equipamento não identificado";
    }

    function manutencaoAtrasada(rotina) {
        return !rotina.concluida && String(rotina.data) < hojeISO();
    }

    function classeStatusManutencao(rotina) {
        if (rotina.concluida) {
            return "status-concluida";
        }

        return manutencaoAtrasada(rotina)
            ? "status-atrasada"
            : "status-agendada";
    }

    function textoStatusManutencao(rotina) {
        if (rotina.concluida) {
            return "Concluída";
        }

        return manutencaoAtrasada(rotina)
            ? "Atrasada"
            : "Programada";
    }

    function atualizarIndicadores(equipamentos, ordens, manutencoes) {
        const ordensAbertas = ordens.filter(
            (ordem) =>
                ordem.status === "Em Aberto" ||
                ordem.status === "Em Andamento"
        );

        const manutencoesPendentes = manutencoes.filter(
            (rotina) => !rotina.concluida
        );

        const mesAtual = hojeISO().slice(0, 7);

        const preventivasMes = manutencoes.filter(
            (rotina) =>
                rotina.categoria === "Preventiva" &&
                String(rotina.data || "").slice(0, 7) === mesAtual
        );

        definirTexto("ind-equipamentos", equipamentos.length);
        definirTexto("ind-os-abertas", ordensAbertas.length);
        definirTexto("ind-manutencoes", manutencoesPendentes.length);
        definirTexto("ind-preventivas", preventivasMes.length);
        definirTexto("ultima-atualizacao", formatarHoraAtual());
    }

    function renderizarProximasManutencoes(manutencoes, equipamentos) {
        const corpo = $("tabela-proximas-manutencoes");

        if (!corpo) {
            return;
        }

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
                </tr>
            `;

            return;
        }

        corpo.innerHTML = lista
            .map((rotina) => {
                const equipamento = equipamentos.find(
                    (item) => item.codigo === rotina.codigo
                );

                const nome = equipamento
                    ? equipamento.nome
                    : rotina.ativo || "Equipamento não identificado";

                const subtexto = rotina.codigo
                    ? `<small class="dashboard-subtexto">${esc(rotina.codigo)}</small>`
                    : "";

                return `
                    <tr>
                        <td>${esc(nome)} ${subtexto}</td>
                        <td>${esc(rotina.categoria || "Preventiva")}</td>
                        <td>${formatarData(rotina.data)}</td>
                        <td>${esc(rotina.responsavel || "Não atribuído")}</td>
                        <td>
                            <span class="status ${classeStatusManutencao(rotina)}">
                                ${textoStatusManutencao(rotina)}
                            </span>
                        </td>
                    </tr>
                `;
            })
            .join("");
    }

    const TITULOS_ATIVIDADE = {
        "Em Aberto": "Nova O.S. aberta",
        "Em Andamento": "O.S. em andamento",
        "Concluída": "O.S. concluída",
        "Cancelada": "O.S. cancelada"
    };

    function renderizarAtividades(ordens, equipamentos) {
        const lista = $("lista-atividades");

        if (!lista) {
            return;
        }

        const atividades = [...ordens]
            .sort((a, b) => String(b.abertura).localeCompare(String(a.abertura)))
            .slice(0, 4);

        if (!atividades.length) {
            lista.innerHTML = `
                <li class="dashboard-atividade-vazia">
                    Nenhuma atividade registrada.
                </li>
            `;

            return;
        }

        lista.innerHTML = atividades
            .map((ordem) => {
                const titulo = TITULOS_ATIVIDADE[ordem.status] || "O.S. registrada";

                return `
                    <li>
                        <strong>${esc(titulo)} #${esc(ordem.numero)}</strong>
                        <span>
                            ${esc(nomeDoEquipamento(ordem, equipamentos))}
                            ·
                            ${formatarData(ordem.abertura)}
                        </span>
                    </li>
                `;
            })
            .join("");
    }

    function renderizarDistribuicao(ordens) {
        const contar = (tipo) =>
            ordens.filter((ordem) => ordem.tipo === tipo).length;

        // Percentuais inteiros que sempre somam 100% (ou 0% sem ordens).
        const [preventiva, corretiva, inspecao] = percentuaisInteiros([
            contar("Preventiva"),
            contar("Corretiva"),
            contar("Inspeção")
        ]);

        definirTexto("pct-preventiva", `${preventiva}%`);
        definirTexto("pct-corretiva", `${corretiva}%`);
        definirTexto("pct-inspecao", `${inspecao}%`);

        if (window.atualizarGraficoComDados) {
            window.atualizarGraficoComDados();
        }
    }

    function renderizarDashboard() {
        const equipamentos = carregarEquipamentos();
        const ordens = carregarOrdens();
        const manutencoes = carregarManutencoes();

        atualizarIndicadores(equipamentos, ordens, manutencoes);
        renderizarProximasManutencoes(manutencoes, equipamentos);
        renderizarAtividades(ordens, equipamentos);
        renderizarDistribuicao(ordens);
    }

    document.addEventListener("DOMContentLoaded", () => {
        renderizarDashboard();

        // Disparado quando outra aba altera o localStorage.
        window.addEventListener("storage", renderizarDashboard);

        // Volta pelo botão "voltar" do navegador (cache de página).
        window.addEventListener("pageshow", (evento) => {
            if (evento.persisted) {
                renderizarDashboard();
            }
        });

        // Ao voltar para a aba.
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                renderizarDashboard();
            }
        });
    });

})();