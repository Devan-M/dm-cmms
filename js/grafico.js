(function () {
    "use strict";

    // Requer: Chart.js e dados.js carregados ANTES deste arquivo.
    let chartInstance = null;

    const CORES = ["#10b981", "#ef4444", "#3b82f6"];
    const COR_VAZIO = "#e5e7eb";
    const ROTULOS = ["Preventiva", "Corretiva", "Inspeção"];

    function criarGrafico(canvas) {
        return new Chart(canvas, {
            type: "doughnut",

            data: {
                labels: ROTULOS,
                datasets: [
                    {
                        data: [0, 0, 0],
                        backgroundColor: CORES,
                        borderColor: "#ffffff",
                        borderWidth: 2
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: true,

                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            padding: 15,
                            font: { size: 13, weight: "500" },
                            color: "#475467"
                        }
                    },

                    tooltip: {
                        // Sem tooltip quando não há dados.
                        filter: function (item) {
                            return !item.chart.$vazio;
                        },

                        callbacks: {
                            label: function (context) {
                                const total = context.dataset.data
                                    .reduce((soma, v) => soma + v, 0);
                                const valor = context.parsed || 0;
                                const percentual = total > 0
                                    ? ((valor / total) * 100).toFixed(1)
                                    : "0.0";

                                return `${context.label}: ${valor} (${percentual}%)`;
                            }
                        },

                        backgroundColor: "#1f2937",
                        padding: 12,
                        titleFont: { size: 13 },
                        bodyFont: { size: 12 },
                        borderColor: "#e5e7eb",
                        borderWidth: 1
                    }
                }
            },

            // Mensagem central quando não há ordens.
            plugins: [
                {
                    id: "mensagemVazio",
                    afterDraw: function (chart) {
                        if (!chart.$vazio) {
                            return;
                        }

                        const { ctx, chartArea } = chart;
                        const x = (chartArea.left + chartArea.right) / 2;
                        const y = (chartArea.top + chartArea.bottom) / 2;

                        ctx.save();
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = "#475467";
                        ctx.font = "500 13px sans-serif";
                        ctx.fillText("Sem ordens cadastradas", x, y);
                        ctx.restore();
                    }
                }
            ]
        });
    }

    function inicializarGrafico(preventiva, corretiva, inspecao) {
        const canvas = document.getElementById("grafico-tipos");

        if (!canvas || typeof Chart === "undefined") {
            return;
        }

        // Cria uma única vez; nas próximas chamadas só atualiza os dados.
        if (!chartInstance) {
            chartInstance = criarGrafico(canvas);
        }

        const total = preventiva + corretiva + inspecao;
        const dataset = chartInstance.data.datasets[0];

        chartInstance.$vazio = total === 0;

        if (total === 0) {
            dataset.data = [1, 0, 0];
            dataset.backgroundColor = [COR_VAZIO, COR_VAZIO, COR_VAZIO];
        } else {
            dataset.data = [preventiva, corretiva, inspecao];
            dataset.backgroundColor = CORES;
        }

        chartInstance.update();
    }

    function atualizarGraficoComDados() {
        const ordens = typeof carregarOrdens === "function"
            ? carregarOrdens()
            : [];

        const contar = (tipo) =>
            ordens.filter((ordem) => ordem.tipo === tipo).length;

        inicializarGrafico(
            contar("Preventiva"),
            contar("Corretiva"),
            contar("Inspeção")
        );
    }

    // Disponibiliza as funções para o dashboard.js
    window.atualizarGraficoTipos = inicializarGrafico;
    window.atualizarGraficoComDados = atualizarGraficoComDados;

})();