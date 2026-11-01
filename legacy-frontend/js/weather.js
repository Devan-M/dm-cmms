(function () {
    "use strict";

    // ===== Configuração =====
    const LOCAL_PADRAO = {
        nome: "Curitiba",
        regiao: "PR",
        latitude: -25.4284,
        longitude: -49.2733,
    };

    const CHAVE_STORAGE = "sgm_clima_local";
    const LIMITE_CHUVA_AVISO = 60;
    const LIMITE_VENTO_AVISO = 40;
    const TIMEOUT_MS = 10000;
    const INTERVALO_ATUALIZACAO_MS = 30 * 60 * 1000;
    const CAMINHO_ICONES = "./weather_icons/";
    const CHAVE_GPS = "sgm_clima_gps";             // cache da localização automática
    const TIMEOUT_GPS_MS = 8000;                   // tempo máximo esperando o navegador
    const VALIDADE_GPS_MS = 6 * 60 * 60 * 1000;    // reaproveita a posição por 6h

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

    // ===== Loader (SVG animado) =====
    const LOADER_HTML = `
<svg id="cloud" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <filter id="roundness">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"></feGaussianBlur>
      <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10"></feColorMatrix>
    </filter>
    <mask id="shapes">
      <g fill="white">
        <polygon points="50 37.5 80 75 20 75 50 37.5"></polygon>
        <circle cx="20" cy="60" r="15"></circle>
        <circle cx="80" cy="60" r="15"></circle>
        <g>
          <circle cx="20" cy="60" r="15"></circle>
          <circle cx="20" cy="60" r="15"></circle>
          <circle cx="20" cy="60" r="15"></circle>
        </g>
      </g>
    </mask>
    <mask id="clipping" clipPathUnits="userSpaceOnUse">
      <g id="lines" filter="url(#roundness)">
        <g mask="url(#shapes)" stroke="white">
          ${Array.from({ length: 21 }, (_, i) => {
        const y = -40 + i * 9;
        return `<line x1="-50" y1="${y}" x2="150" y2="${y}"></line>`;
    }).join("")}
        </g>
      </g>
    </mask>
  </defs>
  <rect x="0" y="0" width="100" height="100" rx="0" ry="0" mask="url(#clipping)"></rect>
  <g>
    <path d="M33.52,68.12 C35.02,62.8 39.03,58.52 44.24,56.69 C49.26,54.93 54.68,55.61 59.04,58.4 C59.04,58.4 56.24,60.53 56.24,60.53 C55.45,61.13 55.68,62.37 56.63,62.64 C56.63,62.64 67.21,65.66 67.21,65.66 C67.98,65.88 68.75,65.3 68.74,64.5 C68.74,64.5 68.68,53.5 68.68,53.5 C68.67,52.51 67.54,51.95 66.75,52.55 C66.75,52.55 64.04,54.61 64.04,54.61 C57.88,49.79 49.73,48.4 42.25,51.03 C35.2,53.51 29.78,59.29 27.74,66.49 C27.29,68.08 28.22,69.74 29.81,70.19 C30.09,70.27 30.36,70.31 30.63,70.31 C31.94,70.31 33.14,69.44 33.52,68.12Z"></path>
    <path d="M69.95,74.85 C68.35,74.4 66.7,75.32 66.25,76.92 C64.74,82.24 60.73,86.51 55.52,88.35 C50.51,90.11 45.09,89.43 40.73,86.63 C40.73,86.63 43.53,84.51 43.53,84.51 C44.31,83.91 44.08,82.67 43.13,82.4 C43.13,82.4 32.55,79.38 32.55,79.38 C31.78,79.16 31.02,79.74 31.02,80.54 C31.02,80.54 31.09,91.54 31.09,91.54 C31.09,92.53 32.22,93.09 33.01,92.49 C33.01,92.49 35.72,90.43 35.72,90.43 C39.81,93.63 44.77,95.32 49.84,95.32 C52.41,95.32 55,94.89 57.51,94.01 C64.56,91.53 69.99,85.75 72.02,78.55 C72.47,76.95 71.54,75.3 69.95,74.85Z"></path>
  </g>
</svg>`;

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
        botaoGps: document.getElementById("clima-usar-gps"),
    };

    if (!el.local) return;

    // Painel que contém o clima (o loader fica centralizado nele)
    const painel = el.local.closest(".painel-clima") || el.local.parentElement;

    const loader = document.createElement("div");
    loader.className = "loader";
    loader.hidden = true;
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-label", "Carregando previsão do tempo");
    loader.innerHTML = LOADER_HTML;
    painel.appendChild(loader);

    function mostrarLoader(visivel) {
        loader.hidden = !visivel;
        painel.classList.toggle("clima-carregando", visivel);
        painel.setAttribute("aria-busy", String(visivel));
    }

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

    function lerStorage(chave) {
        try {
            return JSON.parse(localStorage.getItem(chave));
        } catch (e) {
            return null;
        }
    }

    // Cidade escolhida manualmente pelo usuário (se houver)
    function carregarLocalManual() {
        const salvo = lerStorage(CHAVE_STORAGE);
        return salvo && salvo.latitude && salvo.longitude ? salvo : null;
    }

    function salvarLocal(local) {
        try {
            localStorage.setItem(CHAVE_STORAGE, JSON.stringify(local));
        } catch (e) {
            /* ignora (modo privado, storage cheio etc.) */
        }
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

    // Pede a posição ao navegador. Resolve null se negar, der timeout ou não houver suporte.
    function posicaoDoNavegador() {
        return new Promise((resolve) => {
            if (!("geolocation" in navigator)) {
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (p) => resolve({
                    latitude: p.coords.latitude,
                    longitude: p.coords.longitude,
                }),
                () => resolve(null),
                { enableHighAccuracy: false, timeout: TIMEOUT_GPS_MS, maximumAge: 600000 }
            );
        });
    }

    // Converte coordenadas em nome de cidade (API gratuita, sem chave)
    async function nomeDasCoordenadas(latitude, longitude) {
        try {
            const url =
                "https://api.bigdatacloud.net/data/reverse-geocode-client" +
                "?latitude=" + latitude +
                "&longitude=" + longitude +
                "&localityLanguage=pt";

            const dados = await fetchJSON(url);

            return {
                nome: dados.city || dados.locality || "Sua localização",
                regiao: (dados.principalSubdivisionCode || "").split("-")[1] || "",
            };
        } catch (e) {
            return { nome: "Sua localização", regiao: "" };
        }
    }

    // Localização automática, com cache para não pedir/consultar a cada visita
    async function localizacaoAutomatica() {
        const cache = lerStorage(CHAVE_GPS);

        if (cache && cache.local && Date.now() - cache.ts < VALIDADE_GPS_MS) {
            return cache.local;
        }

        const posicao = await posicaoDoNavegador();
        if (!posicao) return null;

        const lugar = await nomeDasCoordenadas(posicao.latitude, posicao.longitude);
        const local = { ...lugar, ...posicao };

        try {
            localStorage.setItem(CHAVE_GPS, JSON.stringify({ local, ts: Date.now() }));
        } catch (e) {
            /* ignora */
        }

        return local;
    }

    // Define qual local usar ao abrir a página
    async function definirLocalInicial() {
        const manual = carregarLocalManual();
        if (manual) return manual;

        el.local.classList.remove("clima-erro");
        el.local.textContent = "Obtendo sua localização...";
        mostrarLoader(true);

        const automatico = await localizacaoAutomatica();
        return automatico || LOCAL_PADRAO;
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

        // Ícone ao lado da temperatura (tamanho vem do CSS: .clima-temp img)
        let img = document.querySelector(".clima-temp img");
        if (!img) {
            img = document.createElement("img");
            el.temperatura.parentElement.insertBefore(img, el.temperatura);
        }
        img.src = CAMINHO_ICONES + clima.icone;
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

            // Tamanho e margem vêm do CSS: .clima-dias img
            const img = document.createElement("img");
            img.src = CAMINHO_ICONES + clima.icone;
            img.alt = clima.desc;

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

    let localAtual = LOCAL_PADRAO;

    async function atualizarClima(local, silencioso = false) {
        localAtual = local;

        if (!silencioso) {
            el.local.classList.remove("clima-erro");
            el.local.textContent = "Carregando previsão...";
            mostrarLoader(true);
        }

        try {
            const dados = await buscarPrevisao(local.latitude, local.longitude);
            renderizarAtual(local, dados);
            renderizarDias(dados);
            renderizarAviso(dados);
        } catch (erro) {
            console.error("Erro ao carregar previsão:", erro);
            if (!silencioso) {
                renderizarErro("Não foi possível carregar a previsão do tempo.");
            }
        } finally {
            mostrarLoader(false);
        }
    }

    if (el.form) {
        el.form.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const termo = el.inputCidade.value.trim();
            if (!termo) return;

            el.local.classList.remove("clima-erro");
            el.local.textContent = "Buscando cidade...";
            mostrarLoader(true);

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
            } finally {
                mostrarLoader(false);
            }
        });
    }

    async function iniciar() {
        const local = await definirLocalInicial();
        await atualizarClima(local);
    }

    if (el.botaoGps) {
        el.botaoGps.addEventListener("click", async () => {
            localStorage.removeItem(CHAVE_STORAGE);
            localStorage.removeItem(CHAVE_GPS);

            const local = await definirLocalInicial();
            await atualizarClima(local);
        });
    }

    iniciar();

    // A atualização automática usa o local já definido, sem pedir permissão de novo
    setInterval(() => atualizarClima(localAtual, true), INTERVALO_ATUALIZACAO_MS);
})();