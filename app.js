import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "eletiva-47a76.firebaseapp.com",
  projectId: "eletiva-47a76",
  storageBucket: "eletiva-47a76.appspot.com",
  messagingSenderId: "775817480928",
  appId: "1:775817480928:web:0573a05a553afc9ac45e85"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const candidatoRef = ref(db, 'candidatos/');
get(candidatoRef).then((snapshot) => {
    const data = snapshot.val();
    let totalVotos = 0;
    let candidatosComVotos = [];

    // Calcular total de votos e preparar dados para os gráficos
    Object.values(data).forEach((candidatoData) => {
        if (candidatoData.pontos) {
            totalVotos += candidatoData.pontos;
            candidatosComVotos.push({
                nome: candidatoData.nomeDeUrna || candidatoData.nomeCompleto,
                pontos: candidatoData.pontos,
                partido: candidatoData.partido,
                cargo: candidatoData.cargo,
                foto: candidatoData.foto
            });
        }
    });

    // Criar gráficos para cada candidato com votos
    candidatosComVotos.forEach((candidatoData, index) => {
        const siglaPartido = candidatoData.partido.split(' - ')[0];
        const porcentagemVotos = ((candidatoData.pontos / totalVotos) * 100).toFixed(2);

        const candidatoArea = candidatoData.cargo === "Prefeito" ? "prefeito-area" : "vereador-area";
        const canvasId = `grafico-${candidatoData.nome.replace(/\s+/g, '-')}-${index}`; // Gerar um ID único

        // Criar os elementos HTML e adicionar ao candidatoArea
        const br = document.createElement('br')
        const ul = document.createElement('ul');
        ul.classList.add('canditato-ul');

        ul.innerHTML = `
            <li>
                <div class="foto-candidato" style="background-image: url(${candidatoData.foto || 'default.jpg'})"></div>
            </li>
            <li class="descricao-candidato">
                <p class="nome-candidato">${candidatoData.nome} - <span class="cargo-candidato">${candidatoData.cargo}</span></p>
                <p class="partido-candidato">${siglaPartido}</p>
                <canvas id="${canvasId}" width="400" height="200"></canvas> <!-- Usar ID único -->
            </li>
        `;

        document.getElementById(candidatoArea).appendChild(ul); // Adiciona o elemento UL
        document.getElementById(candidatoArea).appendChild(br)
        // Criar gráfico de barras individual para cada candidato
        const ctx = document.getElementById(canvasId).getContext('2d'); // Usar ID único
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Votos', 'Porcentagem (%)'],
                datasets: [{
                    label: candidatoData.nome,
                    data: [candidatoData.pontos, porcentagemVotos],
                    backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Quantidade'
                        }
                    }
                }
            }
        });
    });
});


get(candidatoRef).then((snapshot) => {
    const data = snapshot.val();
    let totalVotos = 0;
    let candidatosComVotos = [];

    // Calcular total de votos e preparar dados para os gráficos
    Object.values(data).forEach((candidatoData) => {
        if (candidatoData.pontos) {
            totalVotos += candidatoData.pontos;
            candidatosComVotos.push({
                nome: candidatoData.nomeDeUrna || candidatoData.nomeCompleto,
                pontos: candidatoData.pontos,
                partido: candidatoData.partido,
                cargo: candidatoData.cargo,
                foto: candidatoData.foto
            });
        }
    });

    // Gerar gráficos específicos
    gerarGraficoPrefeitos(candidatosComVotos);
    gerarGraficoVereadores(candidatosComVotos);
});

// Função para gerar gráfico apenas para os prefeitos
function gerarGraficoPrefeitos(candidatos) {
    let totalVotosPrefeitos = 0;
    let dadosPrefeitos = [];

    // Filtrar apenas os prefeitos e calcular total de votos
    candidatos.forEach((candidatoData) => {
        if (candidatoData.cargo === "Prefeito") {
            totalVotosPrefeitos += candidatoData.pontos;
            dadosPrefeitos.push({
                nome: candidatoData.nome,
                pontos: candidatoData.pontos
            });
        }
    });

    // Preparar os dados do gráfico
    const nomesPrefeitos = dadosPrefeitos.map(candidato => candidato.nome);
    const votosPrefeitos = dadosPrefeitos.map(candidato => candidato.pontos);

    // Criar o gráfico de prefeitos horizontal
    const ctx = document.getElementById('grafico-prefeito-area').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomesPrefeitos,
            datasets: [{
                label: 'Votos por Prefeito',
                data: votosPrefeitos,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Exibir barras na horizontal
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Votos'
                    }
                }
            }
        }
    });
}

// Função para gerar gráfico apenas para os vereadores
function gerarGraficoVereadores(candidatos) {
    let totalVotosVereadores = 0;
    let dadosVereadores = [];

    // Filtrar apenas os vereadores e calcular total de votos
    candidatos.forEach((candidatoData) => {
        if (candidatoData.cargo === "Vereador") {
            totalVotosVereadores += candidatoData.pontos;
            dadosVereadores.push({
                nome: candidatoData.nome,
                pontos: candidatoData.pontos
            });
        }
    });

    // Preparar os dados do gráfico
    const nomesVereadores = dadosVereadores.map(candidato => candidato.nome);
    const votosVereadores = dadosVereadores.map(candidato => candidato.pontos);

    // Criar o gráfico de vereadores horizontal
    const ctx = document.getElementById('grafico-vereador-area').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomesVereadores,
            datasets: [{
                label: 'Votos por Vereador',
                data: votosVereadores,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Exibir barras na horizontal
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Votos'
                    }
                }
            }
        }
    });
}

// Verificar se o resultado foi liberado
const liberarResultadoRef = ref(db, 'config/liberarResultado');
get(liberarResultadoRef).then((snapshot) => {
    if (snapshot.exists() && snapshot.val() === true) {
        console.log("Resultado liberado!");

        // Carregar dados dos candidatos
        const candidatoRef = ref(db, 'candidatos/');
        get(candidatoRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                let candidatosComVotos = [];

                // Preparar lista de candidatos com votos
                Object.values(data).forEach((candidatoData) => {
                    if (candidatoData.pontos) {
                        candidatosComVotos.push({
                            foto: candidatoData.foto,
                            nome: candidatoData.nomeDeUrna || candidatoData.nomeCompleto,
                            pontos: candidatoData.pontos,
                            cargo: candidatoData.cargo,
                            partido: candidatoData.partido
                        });
                    }
                });

                // Separar e ordenar candidatos por cargo e votos
                const prefeitos = candidatosComVotos
                    .filter(candidato => candidato.cargo === "Prefeito")
                    .sort((a, b) => b.pontos - a.pontos);
                
                const vereadores = candidatosComVotos
                    .filter(candidato => candidato.cargo === "Vereador")
                    .sort((a, b) => b.pontos - a.pontos);

                // Exibir o prefeito com mais votos
                if (prefeitos.length > 0) {
                    console.log("Prefeito com mais votos:", prefeitos[0].nome, prefeitos[0].pontos);
                    const siglaPartido = prefeitos[0].partido.split(' - ')[0];
                    document.getElementById('eleito-area').innerHTML += `
                                <ul class="prefeito-eleito-ul">
                <li><div class="foto-prefeito-eleito" style="background-image: url(${prefeitos[0].foto})"></div></li>
                <li class="descricao-prefeito-eleito">
                    <p class="nome-prefeito-eleito" id="nome-prefeito-eleito">${prefeitos[0].nome} - <span>${prefeitos[0].cargo}</span></p>
                    <p class="partido-prefeito-eleito">${siglaPartido}</p>
                    <p class="votos-prefeito-eleito">${prefeitos[0].pontos} Votos</p>
                </li>
                <li>
                    <div class="resultado-box">Eleito(a)</div>
                </li>
            </ul>
                    
                    `
                }

                // Exibir os três vereadores com mais votos
                console.log("Os três vereadores com mais votos:");
                vereadores.slice(0, 3).forEach((vereador, index) => {
                    console.log(`${index + 1}. ${vereador.nome}: ${vereador.pontos} votos`);
                });
            }
        });
    } else {
        console.log("Resultado ainda não liberado.");
    }
});