(function () {
    "use strict";

    // ===== Configuração =====
    const LOCAL_PADRAO = {
        nome: "São Paulo",
        regiao: "SP",
        latitude: -23.5505,
        longitude: -46.6333,
    };

    const CHAVE_STORAGE = "sgm_clima_local";
    const LIMITE_CHUVA_AVISO = 60;
    const LIMITE_VENTO_AVISO = 40;
    const TIMEOUT_MS = 10000;
    const CAMINHO_ICONES = "./weather_icons/"; // Ajuste se necessário

    // Códigos WMO -> descrição + ícone
    const CODIGOS_CLIMA = {
        0: { desc: "Céu limpo", icone: "day.svg" },
        1: { desc: "Predomínio de sol", icone: "day.svg" },
        2: { desc: "Parcialmente nublado", icone: "cloudy-day-1.svg" },
        3: { desc: "Nublado", icone: "cloudy.svg" },
        45: { desc: "Neblina", icone: "cloudy.svg" },
        48: { desc: "Neblina com geada", icone: "cloudy.svg" },
        51: { desc: "Garoa fraca", icone: "rainy-1.svg" },
        53: { desc: "Garoa moderada", icone: "rainy-2.svg" },
        55: { desc: "Garoa forte", icone: "rainy-4.svg" },
        56: { desc: "Garoa congelante fraca", icone: "snowy-1.svg" },
        57: { desc: "Garoa congelante forte", icone: "snowy-3.svg" },
        61: { desc: "Chuva fraca", icone: "rainy-2.svg" },
        63: { desc: "Chuva moderada", icone: "rainy-4.svg" },
        65: { desc: "Chuva forte", icone: "rainy-6.svg" },
        66: { desc: "Chuva congelante fraca", icone: "snowy-2.svg" },
        67: { desc: "Chuva congelante forte", icone: "snowy-5.svg" },
        71: { desc: "Neve fraca", icone: "snowy-1.svg" },
        73: { desc: "Neve moderada", icone: "snowy-3.svg" },
        75: { desc: "Neve forte", icone: "snowy-6.svg" },
        77: { desc: "Grãos de neve", icone: "snowy-2.svg" },
        80: { desc: "Pancadas de chuva fracas", icone: "rainy-3.svg" },
        81: { desc: "Pancadas de chuva moderadas", icone: "rainy-5.svg" },
        82: { desc: "Pancadas de chuva fortes", icone: "rainy-7.svg" },
        85: { desc: "Pancadas de neve fracas", icone: "snowy-2.svg" },
        86: { desc: "Pancadas de neve fortes", icone: "snowy-6.svg" },
        95: { desc: "Tempestade", icone: "thunder.svg" },
        96: { desc: "Tempestade com granizo", icone: "thunder.svg" },
        99: { desc: "Tempestade com granizo forte", icone: "thunder.svg" },
    };

    // ===== Elementos =====
    const el = {
        form: document.getElementById("clima-form"),
        inputCidade: document.getElementById("clima-cidade"),
        local: document.getElementById("clima-local"),
        temperatura: document.getElementById("clima-temperatura"),
        descricao: document.getElementById("clima-descricao"),
        sensacao: document.getElementById("clima-sensacao"),
        umidade: document.getElementById("clima-umidade"),
        vento: document.getElementById("clima-vento"),
        chuva: document.getElementById("clima-chuva"),
        aviso: document.getElementById("clima-aviso"),
        dias: document.getElementById("clima-dias"),
    };

    if (!el.local) return;

    // ===== Utilidades =====
    async function fetchJSON(url) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            const resposta = await fetch(url, { signal: controller.signal });
            if (!resposta.ok) throw new Error("HTTP " + resposta.status);
            return await resposta.json();
        } finally {
            clearTimeout(timer);
        }
    }

    function obterClima(codigo) {
        return CODIGOS_CLIMA[codigo] || { desc: "Condição indisponível", icone: "weather.svg" };
    }

    function formatarNumero(valor, casas = 0) {
        return Number(valor).toLocaleString("pt-BR", {
            minimumFractionDigits: casas,
            maximumFractionDigits: casas,
        });
    }

    function nomeDiaSemana(dataISO, indice) {
        if (indice === 0) return "Hoje";
        if (indice === 1) return "Amanhã";
        const data = new Date(dataISO + "T12:00:00");
        return data.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
    }

    function carregarLocal() {
        try {
            const salvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
            if (salvo && salvo.latitude && salvo.longitude) return salvo;
        } catch (e) {
            /* ignora */
        }
        return LOCAL_PADRAO;
    }

    function salvarLocal(local) {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(local));
    }

    // ===== API =====
    async function buscarCidade(nome) {
        const url =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" + encodeURIComponent(nome) +
            "&count=1&language=pt&format=json";

        const dados = await fetchJSON(url);
        if (!dados.results || !dados.results.length) return null;

        const r = dados.results[0];
        return {
            nome: r.name,
            regiao: r.admin1 || r.country || "",
            latitude: r.latitude,
            longitude: r.longitude,
        };
    }

    async function buscarPrevisao(latitude, longitude) {
        const params = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            current:
                "temperature_2m,relative_humidity_2m,apparent_temperature," +
                "precipitation,weather_code,wind_speed_10m",
            daily:
                "weather_code,temperature_2m_max,temperature_2m_min," +
                "precipitation_probability_max",
            timezone: "auto",
            forecast_days: "5",
        });

        return fetchJSON("https://api.open-meteo.com/v1/forecast?" + params.toString());
    }

    // ===== Renderização =====
    function renderizarAtual(local, dados) {
        const atual = dados.current;
        const unidades = dados.current_units;
        const clima = obterClima(atual.weather_code);

        el.local.classList.remove("clima-erro");
        el.local.textContent = local.regiao
            ? local.nome + " - " + local.regiao
            : local.nome;

        el.temperatura.textContent = formatarNumero(atual.temperature_2m);
        el.descricao.textContent = clima.desc;
        el.sensacao.textContent = formatarNumero(atual.apparent_temperature) + "°C";
        el.umidade.textContent = formatarNumero(atual.relative_humidity_2m) + "%";
        el.vento.textContent =
            formatarNumero(atual.wind_speed_10m) + " " + unidades.wind_speed_10m;
        el.chuva.textContent =
            formatarNumero(atual.precipitation, 1) + " " + unidades.precipitation;

        // Adiciona ícone na temperatura
        const iconePath = CAMINHO_ICONES + clima.icone;
        let img = document.querySelector(".clima-temp img");
        if (!img) {
            img = document.createElement("img");
            img.alt = clima.desc;
            img.style.width = "80px";
            img.style.height = "80px";
            img.style.marginRight = "1rem";
            el.temperatura.parentElement.insertBefore(img, el.temperatura);
        }
        img.src = iconePath;
        img.alt = clima.desc;
    }

    function renderizarDias(dados) {
        const d = dados.daily;
        el.dias.replaceChildren();

        d.time.forEach((data, i) => {
            const li = document.createElement("li");
            const clima = obterClima(d.weather_code[i]);

            const nome = document.createElement("span");
            nome.className = "dia-nome";
            nome.textContent = nomeDiaSemana(data, i);

            const img = document.createElement("img");
            img.src = CAMINHO_ICONES + clima.icone;
            img.alt = clima.desc;
            img.style.width = "48px";
            img.style.height = "48px";
            img.style.margin = "0.5rem auto";

            const desc = document.createElement("span");
            desc.className = "dia-desc";
            desc.textContent = clima.desc;

            const temp = document.createElement("span");
            temp.className = "dia-temp";
            temp.textContent =
                formatarNumero(d.temperature_2m_min[i]) + "° / " +
                formatarNumero(d.temperature_2m_max[i]) + "°";

            const chuva = document.createElement("span");
            chuva.className = "dia-chuva";
            const prob = d.precipitation_probability_max[i];
            chuva.textContent = "Chuva: " + (prob == null ? "--" : prob + "%");

            li.append(nome, img, desc, temp, chuva);
            el.dias.appendChild(li);
        });
    }

    function renderizarAviso(dados) {
        const probHoje = dados.daily.precipitation_probability_max[0] || 0;
        const vento = dados.current.wind_speed_10m || 0;
        const motivos = [];

        if (probHoje >= LIMITE_CHUVA_AVISO) {
            motivos.push("alta probabilidade de chuva hoje (" + probHoje + "%)");
        }
        if (vento >= LIMITE_VENTO_AVISO) {
            motivos.push("vento forte (" + formatarNumero(vento) + " km/h)");
        }

        if (motivos.length) {
            el.aviso.textContent =
                "Atenção: " + motivos.join(" e ") +
                ". Avalie reprogramar serviços em áreas externas ou em altura.";
            el.aviso.hidden = false;
        } else {
            el.aviso.hidden = true;
            el.aviso.textContent = "";
        }
    }

    function renderizarErro(mensagem) {
        el.local.textContent = mensagem;
        el.local.classList.add("clima-erro");
        el.dias.replaceChildren();
        el.aviso.hidden = true;
    }

    // ===== Fluxo principal =====
    async function atualizarClima(local) {
        el.local.classList.remove("clima-erro");
        el.local.textContent = "Carregando previsão...";

        try {
            const dados = await buscarPrevisao(local.latitude, local.longitude);
            renderizarAtual(local, dados);
            renderizarDias(dados);
            renderizarAviso(dados);
        } catch (erro) {
            console.error("Erro ao carregar previsão:", erro);
            renderizarErro("Não foi possível carregar a previsão do tempo.");
        }
    }

    if (el.form) {
        el.form.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const termo = el.inputCidade.value.trim();
            if (!termo) return;

            el.local.classList.remove("clima-erro");
            el.local.textContent = "Buscando cidade...";

            try {
                const local = await buscarCidade(termo);

                if (!local) {
                    renderizarErro('Cidade "' + termo + '" não encontrada.');
                    return;
                }

                salvarLocal(local);
                el.inputCidade.value = "";
                await atualizarClima(local);
            } catch (erro) {
                console.error("Erro ao buscar cidade:", erro);
                renderizarErro("Não foi possível buscar a cidade.");
            }
        });
    }

    atualizarClima(carregarLocal());

    setInterval(() => atualizarClima(carregarLocal()), 30 * 60 * 1000);
})();