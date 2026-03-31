let correctas = 0;
let incorrectas = 0;
let preguntas = [];
let bloqueado = false;
let preguntaActual = null;
let btns = [
  document.getElementById("btn1"),
  document.getElementById("btn2"),
  document.getElementById("btn3"),
  document.getElementById("btn4"),
];
appInit();
async function appInit() {
  preguntas = await readText();
  oprimirBtn();
  escogerPregunta();
}
async function readText() {
  const res = await fetch("preguntas.json");
  const data = await res.json();
  return data;
}
function escogerPregunta() {
  if (!preguntas || preguntas.length === 0) {
    terminarJuego();
    return;
  }
  bloqueado = false;
  reiniciarColores();
  document.getElementById("correctas").innerText = correctas;
  document.getElementById("incorrectas").innerText = incorrectas;
  let indexPregunta = Math.floor(Math.random() * preguntas.length);
  preguntaActual = preguntas.splice(indexPregunta, 1)[0];
  if (!preguntaActual) {
    terminarJuego();
    return;
  }
  document.getElementById("categoria").innerText = preguntaActual.categoria;
  document.getElementById("pregunta").innerText = preguntaActual.pregunta;
  desordenarRespuestas(preguntaActual);
}

function desordenarRespuestas(pregunta) {
  let posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  posibles_respuestas = posibles_respuestas.sort(() => Math.random() - 0.5);
  btns.forEach((btn, i) => {
    btn.innerText = posibles_respuestas[i];
  });
}
function oprimirBtn(pregunta) {
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (bloqueado || !preguntaActual) return;

      bloqueado = true;
      if (btn.textContent === preguntaActual.respuesta) {
        btn.classList.add("correct");
        correctas += 1;
        bloqueado = true;
        setTimeout(() => {
          escogerPregunta();
        }, 1500);
      } else {
        btn.classList.add("incorrect");
        incorrectas += 1;
        btns.forEach((b) => {
          if (b.textContent === preguntaActual.respuesta) {
            b.classList.add("correct");
          }
        });
        setTimeout(() => {
          escogerPregunta();
        }, 1500);
      }
    });
  });
}
function reiniciarColores() {
  btns.forEach((btn) => {
    btn.classList.remove("correct");
    btn.classList.remove("incorrect");
  });
}
function terminarJuego() {
  const contenedor = document.querySelector(".contenedor");
  const total = correctas + incorrectas;
  const efectividad = Math.round((correctas / total) * 100);

  contenedor.innerHTML = `
                <div style="color: white; padding: 2rem;">
                    <h1 style="font-size: 3rem; color: var(--color2);">¡Trivia Finalizada!</h1>
                    <p style="font-size: 1.5rem;">Respondiste un total de ${total} preguntas.</p>
                    <div style="background: #181546; padding: 2rem; border-radius: 1rem; margin: 2rem 0;">
                        <h2 style="color: #00800b;">Correctas: ${correctas}</h2>
                        <h2 style="color: rgb(206, 51, 51);">Incorrectas: ${incorrectas}</h2>
                        <hr style="border: 1px solid var(--color1);">
                        <h3>Efectividad: ${efectividad}%</h3>
                    </div>
                    <button onclick="location.reload()" class="btn" style="width: 250px; margin: auto;">
                        Jugar de nuevo
                    </button>
                </div>
            `;
}
