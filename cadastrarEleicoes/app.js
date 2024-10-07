  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
  import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
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

function resizeImage(file, maxWidth, maxHeight, callback) {
  var img = new Image();
  var reader = new FileReader();

  reader.onload = function(e) {
      img.src = e.target.result;
  };

  img.onload = function() {
      var canvas = document.createElement("canvas");
      var width = img.width;
      var height = img.height;

      if (width > height) {
          if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
          }
      } else {
          if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
          }
      }

      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(function(blob) {
          callback(blob);
      }, file.type);
  };

  reader.readAsDataURL(file);
}

//Carrega Partidos no Select
const partidoRef = ref(db, 'partidos/');
get(partidoRef).then((snapshot)=>{
  const data = snapshot.val()
  console.log(data)
  if(data != null){
    Object.values(data).forEach((partidoData)=>{
      document.getElementById('partido-input').innerHTML += `<option value="${partidoData.sigla} - ${partidoData.nome}">${partidoData.sigla} - ${partidoData.nome}</option>`
    })
  }

})

//Cadastrar Partido
document.getElementById('cadastrar-partido-btn').addEventListener('click', function() {
    const nomePartido = document.getElementById('nome-partido-input').value;
    const siglaPartido = document.getElementById('sigla-partido-input').value;
    const ideaisPartido = document.getElementById('ideais-partido').value;
  
    if (nomePartido && siglaPartido && ideaisPartido) {
      const partidoRef = ref(db, 'partidos/');
      const novoPartidoRef = push(partidoRef); // Cria chave aleatória
  
      set(novoPartidoRef, {
        nome: nomePartido,
        sigla: siglaPartido,
        ideais: ideaisPartido
      }).then(() => {
        alert("Partido cadastrado com sucesso!");
        window.location.reload()
      }).catch((error) => {
        console.error("Erro ao cadastrar partido: ", error);
      });
    } else {
      alert("Preencha todos os campos do partido.");
    }
  });

  //Cadastrar Candidato
  document.getElementById("foto-candidato-input").addEventListener("change", function(e) {
      var file = e.target.files[0];

      if (file) {
          resizeImage(file, 300, 300, function(resizedBlob) {
              var reader = new FileReader();
              reader.onload = function() {
                  var base64String = reader.result;
                  document.getElementById('foto-candidato').style.backgroundImage = 'url(' + base64String + ')'
              };
              reader.readAsDataURL(resizedBlob);
          });
      }
  });

  document.getElementById('cadastrar-candidato-btn').addEventListener('click', function() {
    const fotoCandidato = document.getElementById('foto-candidato').style.backgroundImage
    .replaceAll('url(', '').replaceAll(')', '').replaceAll('"', '');
    const nomeCompleto = document.getElementById('nome-completo-input').value;
    const nomeDeUrna = document.getElementById('nome-de-urna-input').value;
    const partido = document.getElementById('partido-input').value;
    const cargo = document.getElementById('cargo-input').value;
  
    if (nomeCompleto && partido && cargo) {
      const candidatoRef = ref(db, 'candidatos/');
      const novoCandidatoRef = push(candidatoRef); // Cria chave aleatória
  
      set(novoCandidatoRef, {
        foto: fotoCandidato,
        nomeCompleto: nomeCompleto,
        nomeDeUrna: nomeDeUrna,
        partido: partido,
        cargo: cargo,
        uuid: novoCandidatoRef.key,
      }).then(() => {
        alert("Candidato cadastrado com sucesso!");
        window.location.reload()
      }).catch((error) => {
        console.error("Erro ao cadastrar candidato: ", error);
      });
    } else {
      alert("Preencha todos os campos do candidato.");
    }
  });
  