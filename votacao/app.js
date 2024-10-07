  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
  import { getDatabase, ref, push, set, get, update } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDPEfQ2cU3mtY_Y4DgZc3-GfkoMafxco64",
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
get(candidatoRef).then((snapshot)=>{
    const data = snapshot.val()

    Object.values(data).forEach((candidatoData)=>{
        if(candidatoData.cargo == 'Prefeito'){
            const sigla = candidatoData.partido
            let siglaPartido = sigla.split(' - ')[0];
            document.getElementById('prefeito-area').innerHTML += `
                                <ul class="canditato-ul">
                    <li><div class="foto-candidato" style="background-image: url(${candidatoData.foto})"></div></li>
                    <li class="descricao-candidato">
                        <p class="nome-candidato">${candidatoData.nomeDeUrna == "" ? candidatoData.nomeCompleto : candidatoData.nomeDeUrna} - <span class="cargo-candidato">${candidatoData.cargo}</span></p>
                        <p class="partido-candidato">${siglaPartido}</p>
                    </li>
                    <li>
                        <div class="votar-btn" id="votar-btn" data-votar-uuid="${candidatoData.uuid}">VOTAR</div>
                    </li>
                </ul><br>
            
            `
        }

        if(candidatoData.cargo == 'Vereador'){
            const sigla = candidatoData.partido
            let siglaPartido = sigla.split(' - ')[0];
            document.getElementById('vereador-area').innerHTML += `
                                <ul class="canditato-ul">
                    <li><div class="foto-candidato" style="background-image: url(${candidatoData.foto})"></div></li>
                    <li class="descricao-candidato">
                        <p class="nome-candidato">${candidatoData.nomeDeUrna == "" ? candidatoData.nomeCompleto : candidatoData.nomeDeUrna} - <span class="cargo-candidato">${candidatoData.cargo}</span></p>
                        <p class="partido-candidato">${siglaPartido}</p>
                    </li>
                    <li>
                        <div class="votar-btn" id="votar-btn" data-votar-uuid="${candidatoData.uuid}">VOTAR</div>
                    </li>
                </ul><br>
            
            `
        }
    })
})


document.getElementById('candidatos-lista-area').addEventListener('click', (e)=>{
    const uuid = e.target.dataset.votarUuid
  
    if(uuid != undefined){
        const configRef = ref(db, 'config/liberarResultado');
        get(configRef).then((snapshot)=>{
            const data = snapshot.val()
            if(data == true){
                alert('Votação Encerrada!')
            }else{
                const candidatoRef = ref(db, 'candidatos/' + uuid);
                get(candidatoRef).then((snapshot)=>{
                    const data = snapshot.val()
                    if(data.pontos){
                        const pontos = data.pontos
                        update(candidatoRef, {
                            pontos: pontos + 1
                        }).then(()=>{
                            alert('Votação Registrada com Sucesso!')
                        })
                    }else{
                        update(candidatoRef, {
                            pontos: 1
                        }).then(()=>{
                            alert('Votação Registrada com Sucesso!')
                        })
                    }
                })
            }
        })

    }
  })

  //Ver Resultados
  document.getElementById('ver-resultados-btn').addEventListener('click', ()=>{
    window.location.assign('./../')
  })