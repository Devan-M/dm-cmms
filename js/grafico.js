(function () {
    "use strict";

    let chartInstance = null;

    function inicializarGrafico(preventiva, corretiva, inspecao) {
        const canvas = document.getElementById("grafico-tipos");

        if (!canvas) {
            return;
        }

        const total = preventiva + corretiva + inspecao;

        // Destrói o gráfico anterior, caso exista.
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(canvas, {
            type: "doughnut",

            data: {
                labels: [
                    "Preventiva",
                    "Corretiva",
                    "Inspeção"
                ],

                datasets: [
                    {
                        data: [
                            preventiva,
                            corretiva,
                            inspecao
                        ],

                        backgroundColor: [
                            "#10b981",
                            "#ef4444",
                            "#3b82f6"
                        ],

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

                            font: {
                                size: 13,
                                weight: "500"
                            },

                            color: "#475467"
                        }
                    },

                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || "";
                                const valor = context.parsed || 0;

                                const percentual = total > 0
                                    ? ((valor / total) * 100).toFixed(1)
                                    : 0;

                                return `${label}: ${valor} (${percentual}%)`;
                            }
                        },

                        backgroundColor: "#1f2937",
                        padding: 12,

                        titleFont: {
                            size: 13
                        },

                        bodyFont: {
                            size: 12
                        },

                        borderColor: "#e5e7eb",
                        borderWidth: 1
                    }
                }
            }
        });
    }

    // Disponibiliza a função para o dashboard.js.
    window.atualizarGraficoTipos = inicializarGrafico;

})();