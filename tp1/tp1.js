/*
Nombre: Iván ledesma
Comisión: 3
tp N°1 - Septiembre 2026
*/

let framesAang = [];
let framesMomo = [];
let framesMeditar = [];
let cantFramesAang = 8;
let cantFramesMomo = 3;
let cantFramesMeditar = 2;
let fondo;
let imgMenu;
let estado = "menu";
let aangX = 50;
let momoX = 700;
let velocidadAang = 6;
let velocidadMomo = 12;
let velocidadMeditar = 120;
let velocidadMovimiento = 3;
let escalaPersonajes = 1.5;
let pisoY = 490;
let distanciaFrenado = 90;

function preload() {
  for (let i = 0; i < cantFramesAang; i++) {
    framesAang[i] = loadImage("data/aank/aank" + nf(i, 4) + ".png");
  }
  for (let i = 0; i < cantFramesMomo; i++) {
    framesMomo[i] = loadImage("data/momo/momo" + nf(i, 4) + ".png");
  }
  for (let i = 0; i < cantFramesMeditar; i++) {
    framesMeditar[i] = loadImage("data/aank/aank" + nf(i + 8, 4) + ".png");
  }
  fondo = loadImage("data/fondo3.png");
  imgMenu = loadImage("data/menu.png");
}

function setup() {
  createCanvas(800, 600);
}

function obtenerFrameActual(cantidadFrames, velocidad) {
  return floor(frameCount / velocidad) % cantidadFrames;
}
//Lo que hice fue tratar de que el personaje se dibuje sobre el piso sin que se me rompa la imagen
//y se mantenga volando unos pixeles más arriba para dar esa sensación de estar suspendido en el aire
function dibujarPersonaje(frames, x, yPies, velocidad, escala) {
  let indice = obtenerFrameActual(frames.length, velocidad);
  let frame = frames[indice];
  let w = frame.width * escala;
  let h = frame.height * escala;
  image(frame, x, yPies - h, w, h);
}
//La imagen original de momo estaba mirando hacia la derecha y me parece que queda mejor girado
//Utilicé IA para ver la manera de girarlo sin tener que hacerlo con una app externa, translate y 
//push pop lo habíamos utilizado en el último tp del cuatri anterior
function dibujarPersonajeEspejado(frames, x, yPies, velocidad, escala) {
  let indice = obtenerFrameActual(frames.length, velocidad);
  let frame = frames[indice];
  let w = frame.width * escala;
  let h = frame.height * escala;

  push();
  translate(x + w, yPies - h);
  scale(-1, 1);
  image(frame, 0, 0, w, h);
  pop();
}

function draw() {
  if (estado === "menu") {
    image(imgMenu, 0, 0, 800, 600);
    return;
  }

  image(fondo, 0, 0, 800, 600);

  if (estado === "inicio") {
    dibujarPersonajeEspejado(framesMomo, momoX, pisoY, velocidadMomo, escalaPersonajes);
    let frameAangQuieto = framesAang[0];
    image(frameAangQuieto, aangX, pisoY - frameAangQuieto.height * escalaPersonajes,
          frameAangQuieto.width * escalaPersonajes, frameAangQuieto.height * escalaPersonajes);

  } else if (estado === "corriendo") {
    dibujarPersonajeEspejado(framesMomo, momoX, pisoY, velocidadMomo, escalaPersonajes);
    dibujarPersonaje(framesAang, aangX, pisoY, velocidadAang, escalaPersonajes);

    let frameActualAang = obtenerFrameActual(cantFramesAang, velocidadAang);

    if (aangX < momoX - distanciaFrenado) {
      aangX += velocidadMovimiento;
    } else if (frameActualAang === cantFramesAang - 1) {
      estado = "final";
    }

  } else if (estado === "final") {
    dibujarPersonajeEspejado(framesMomo, momoX, pisoY, velocidadMomo, escalaPersonajes);
    dibujarPersonaje(framesMeditar, aangX, pisoY, velocidadMeditar, escalaPersonajes);
  }
}

function mousePressed() {
  if (estado === "menu") {
    if (mouseX > 300 && mouseX < 300 + 210 && mouseY > 400 && mouseY < 460 + 40) {
      estado = "corriendo";
    }
  }
}
//Para reiniciar la animación y volver a la primer pantalla opté por usar la tecla r
//No sé si tuve que sumar esa info  en la imagen pero no me gustaba cómo quedaba estéticamente.
function keyPressed() {
  if (key === 'r' || key === 'R') {
    estado = "menu";
    aangX = 50;
  }
}
