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
        document.getElementById(candidatoArea).innerHTML += `
            <ul class="canditato-ul">
                <li><div class="foto-candidato" style="background-image: url(${candidatoData.foto || 'default.jpg'})"></div></li>
                <li class="descricao-candidato">
                    <p class="nome-candidato">${candidatoData.nome} - <span class="cargo-candidato">${candidatoData.cargo}</span></p>
                    <p class="partido-candidato">${siglaPartido}</p>
                    <canvas id="grafico-${index}" width="400" height="200"></canvas>
                </li>
            </ul><br>
        `;

        // Criar gráfico de barras individual para cada candidato
        const ctx = document.getElementById(`grafico-${index}`).getContext('2d');
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
