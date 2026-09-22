const API_BASE = "https://api.open-meteo.com/v1/forecast?latitude=-25.4278&longitude=-49.2731&current=rain,is_day,temperature_2m&timezone=America%2FSao_Paulo&forecast_days=1";

const pikachu = document.getElementById("pikachu-sem-chuva");
const gengar = document.getElementById("gengar-chuva");
const rainOverlay = document.getElementById("rain-overlay");
const weatherCard = document.getElementById("weather-card");
const tempEl = document.getElementById("temp");
const statusEl = document.getElementById("status");
const loading = document.getElementById("loading");
const body = document.querySelector("body");

async function fetchRain(){
    const resposta = await fetch(API_BASE);
    if(!resposta.ok){
        throw new Error("Falha na resposta da API");
    }
    const dado = await resposta.json();
    return dado;
}

function mostrar(elemento){
    elemento.classList.remove("none");
    elemento.classList.add("showup");
}

function esconder(elemento){
    elemento.classList.remove("showup");
    elemento.classList.add("none");
}

async function mudarClima(){
    try{
        const dado = await fetchRain();
        const chuva = dado.current.rain;
        const temperatura = dado.current.temperature_2m;
        const diaAtual = dado.current.is_day === 1;

        body.classList.toggle("dia", diaAtual);
        body.classList.toggle("noite", !diaAtual);

        tempEl.textContent = `${Math.round(temperatura)}°C`;

        if(chuva >= 0.5){
            esconder(pikachu);
            mostrar(gengar);
            gengar.classList.add("gengar-ativo");
            mostrar(rainOverlay);
            statusEl.textContent = "Chovendo";
        }else{
            esconder(gengar);
            gengar.classList.remove("gengar-ativo");
            mostrar(pikachu);
            esconder(rainOverlay);
            statusEl.textContent = "Sem chuva";
        }

        mostrar(weatherCard);
        esconder(loading);

    } catch(error){
        esconder(loading);
        body.innerHTML = `
            <img src="https://tenor.com/pt-BR/view/pikachu-pokemon-pfff-walk-gif-3231170403271482048.gif" alt="Erro" style="width:100vw;height:100vh;object-fit:cover;">
            <p class="erro-msg">Erro ao carregar pokémons.</p>
        `;
        console.error(error);
    }
}

mudarClima();