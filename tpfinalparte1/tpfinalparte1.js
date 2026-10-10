// =================================================================
// TP FINAL PARTE 1 - AVENTURA GRÁFICA INTERACTIVA WEB (AGIW)
// Título: ¡Es Hora de Levantarse, Querido!
// Alumnos: Arian Imanoni Legajo: 125600/9 e Iván Ledesma Legajo: 94422/4
// Diagrama de Flujo:
// https://www.figma.com/board/TepEUJ1RpaOs2UJqp8kCmi/Primer-d%C3%ADa-de-trabajo?node-id=0-1&t=PeO9dVEWLugItrR3-1
// Link al video de YouTube:
// https://www.youtube.com/watch?v=JnieEbBd700
// =================================================================

// -----------------------------------------------------------------
// VARIABLES GLOBALES Y MÁQUINA DE ESTADOS
// -----------------------------------------------------------------
let pantallaActual = "INICIO"; 
let estres = 1;                
let arreglado = false;         

let imagenes = {};
let sonidos = {};
let datosPantallas = {};

// Animación de Créditos
let posicionYCreditos = 450;

// ---------------------------
// PRELOAD: Carga de Recursos 
// ---------------------------
function preload() {
  // Carga de imágenes
  imagenes["portada"] = loadImage('data/imagenes/portada.png');
  imagenes["e1_alarma"] = loadImage('data/imagenes/e1_alarma.png');
  imagenes["e2a_desarreglado"] = loadImage('data/imagenes/e2a_desarreglado.png');
  imagenes["e2b_arreglado"] = loadImage('data/imagenes/e2b_arreglado.png');
  imagenes["e3_calle"] = loadImage('data/imagenes/e3_calle.png');
  imagenes["e3_calle_desarreglado"] = loadImage('data/imagenes/e3_calle_desarreglado.png');
  imagenes["e4_bici"] = loadImage('data/imagenes/e4_bici.png');
  imagenes["e5a_colectivo_lleno"] = loadImage('data/imagenes/e5a_colectivo_lleno.png');
  imagenes["e5b_colectivo_vacio"] = loadImage('data/imagenes/e5b_colectivo_vacio.png');
  imagenes["e6_uber"] = loadImage('data/imagenes/e6_uber.png');
  imagenes["f11_oficina_bien"] = loadImage('data/imagenes/f11_oficina_bien.png');
  imagenes["f11_cama_feliz"] = loadImage('data/imagenes/f11_cama_feliz.png');
  imagenes["f12_oficina_mal"] = loadImage('data/imagenes/f12_oficina_mal.png');
  imagenes["f12_cama_preocupado"] = loadImage('data/imagenes/f12_cama_preocupado.png');
  imagenes["f12_cama_preocupadoadr"] = loadImage('data/imagenes/f12_cama_preocupadoadr.png');
  imagenes["f21_defensa_trapito"] = loadImage('data/imagenes/f21_defensa_trapito.png');
  imagenes["f22_emboscada"] = loadImage('data/imagenes/f22_emboscada.png');
  imagenes["f3_paranoia_oficina"] = loadImage('data/imagenes/f3_paranoia_oficina.png');
  imagenes["f3_microondas"] = loadImage('data/imagenes/f3_microondas.png');
  // Carga de sonidos
  soundFormats('mp3', 'wav');
  sonidos["alarma"] = loadSound('data/sonidos/alarma.mp3');
  sonidos["redondos"] = loadSound('data/sonidos/redondos.mp3');
}

function setup() {
  createCanvas(800, 450); 
  textFont('Trebuchet MS');
  inicializarMapaPantallas();
}

// ----------------------
// DRAW: Bucle principal
// ----------------------
function draw() {
  background(5);

  // Control automático de audios ambientales por pantalla
  gestionarSonidosAmbiente();

  if (pantallaActual === "INICIO") {
    dibujarPantallaInicio();
  } else if (pantallaActual === "CREDITOS") {
    dibujarPantallaCreditos();
  } else if (datosPantallas[pantallaActual]) {
    dibujarPantallaNarrativa(datosPantallas[pantallaActual]);
  }
}

// -----------------------------------------------------------------
// CONTROL DE AUDIOS AMBIENTALES Y MÚSICA DE FONDO
// -----------------------------------------------------------------
function gestionarSonidosAmbiente() {
  // Previene que se ejecute audio antes de que el usuario haga el primer clic en el navegador
  if (getAudioContext().state !== 'running') {
    return;
  }

  if (sonidos["redondos"] && sonidos["redondos"].isLoaded()) {
    if (!sonidos["redondos"].isPlaying()) {
      sonidos["redondos"].setVolume(0.1); 
      sonidos["redondos"].loop();
    }
  }

  if (pantallaActual === "ESCENA_1") {
    if (sonidos["alarma"] && !sonidos["alarma"].isPlaying()) {
      sonidos["alarma"].setVolume(0.2);
      sonidos["alarma"].loop();
    }
  } else {
    if (sonidos["alarma"] && sonidos["alarma"].isPlaying()) {
      sonidos["alarma"].stop();
    }
  }
}

// ------------------
// INTERFAZ NARRATIVA 
// ------------------

function dibujarPantallaNarrativa(escena) {
  // Se dibuja la imagen a pantalla completa
  let nombreImagen = (typeof escena.imagen === 'function') ? escena.imagen() : escena.imagen;
  if (imagenes[nombreImagen]) {
    image(imagenes[nombreImagen], 0, 0, width, height);
  }

  // Se agrega un gradiente suave inferior
  push();
  noStroke(); 
  let gradienteColor = drawingContext.createLinearGradient(0, 220, 0, height);
  gradienteColor.addColorStop(0, 'rgba(0,0,0,0)');
  gradienteColor.addColorStop(1, 'rgba(0,0,0,0.85)');
  drawingContext.fillStyle = gradienteColor;
  rect(0, 220, width, height - 220);
  pop();

  // Se dibuja el HUD de Estrés
  dibujarHUD();

  // Se dibuja una caja para la narrativa
  let textoNarrativo = (typeof escena.texto === 'function') ? escena.texto() : escena.texto;
  let posicionCajaX = 60;
  let posicionCajaY = 285;
  let anchoCaja = 680;
  let altoCaja = 50;
  dibujarCajaRectangular(posicionCajaX, posicionCajaY, anchoCaja, altoCaja, false, true);

  fill(255);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(textoNarrativo, posicionCajaX + 25, posicionCajaY + 5, anchoCaja - 50, altoCaja - 10);

  // Obtener y Renderizar Opciones
  let listaOpciones = obtenerOpcionesEscena(escena);
  let cantidadOpciones = listaOpciones.length;
  
  if (cantidadOpciones === 1) {
    let posicionBotonX = 180;
    let posicionBotonY = 350;
    let anchoBoton = 440;
    let altoBoton = 38;
    let mouseEstaEncima = esMouseSobreCaja(posicionBotonX, posicionBotonY, anchoBoton, altoBoton);
    dibujarCajaRectangular(posicionBotonX, posicionBotonY, anchoBoton, altoBoton, mouseEstaEncima, false);
    dibujarTextoOpcion(posicionBotonX, posicionBotonY, anchoBoton, altoBoton, "A: ", listaOpciones[0].texto);

  } else if (cantidadOpciones === 2) {
    let anchoBoton = 325;
    let altoBoton = 38;
    let posicionBotonY = 350;
    let posicionXOp1 = 60;
    let posicionXOp2 = 415;

    let mouseEncimaOp1 = esMouseSobreCaja(posicionXOp1, posicionBotonY, anchoBoton, altoBoton);
    dibujarCajaRectangular(posicionXOp1, posicionBotonY, anchoBoton, altoBoton, mouseEncimaOp1, false);
    dibujarTextoOpcion(posicionXOp1, posicionBotonY, anchoBoton, altoBoton, "A: ", listaOpciones[0].texto);

    let mouseEncimaOp2 = esMouseSobreCaja(posicionXOp2, posicionBotonY, anchoBoton, altoBoton);
    dibujarCajaRectangular(posicionXOp2, posicionBotonY, anchoBoton, altoBoton, mouseEncimaOp2, false);
    dibujarTextoOpcion(posicionXOp2, posicionBotonY, anchoBoton, altoBoton, "B: ", listaOpciones[1].texto);

  } else if (cantidadOpciones === 3) {
    let anchoBoton = 325;
    let altoBoton = 34;
    let posicionXOp1 = 60;
    let posicionXOp2 = 415;
    let posicionXOp3 = 237;

    let mouseEncimaOp1 = esMouseSobreCaja(posicionXOp1, 345, anchoBoton, altoBoton);
    dibujarCajaRectangular(posicionXOp1, 345, anchoBoton, altoBoton, mouseEncimaOp1, false);
    dibujarTextoOpcion(posicionXOp1, 345, anchoBoton, altoBoton, "A: ", listaOpciones[0].texto);

    let mouseEncimaOp2 = esMouseSobreCaja(posicionXOp2, 345, anchoBoton, altoBoton);
    dibujarCajaRectangular(posicionXOp2, 345, anchoBoton, altoBoton, mouseEncimaOp2, false);
    dibujarTextoOpcion(posicionXOp2, 345, anchoBoton, altoBoton, "B: ", listaOpciones[1].texto);

    let mouseEncimaOp3 = esMouseSobreCaja(posicionXOp3, 388, anchoBoton, altoBoton);
    dibujarCajaRectangular(posicionXOp3, 388, anchoBoton, altoBoton, mouseEncimaOp3, false);
    dibujarTextoOpcion(posicionXOp3, 388, anchoBoton, altoBoton, "C: ", listaOpciones[2].texto);
  }
}

// -----------------------------------------------------------------
// DIBUJO DE CONTENEDORES RECTANGULARES TRANSPARENTES
// -----------------------------------------------------------------

function dibujarCajaRectangular(posicionX, posicionY, ancho, alto, mouseEstaEncima, esCajaPregunta) {
  push();
  rectMode(CORNER);

  if (esCajaPregunta) {
    fill(0, 0, 0, 195); 
    stroke(80, 150, 240);
    strokeWeight(2);
  } else if (mouseEstaEncima) {
    fill(220, 130, 20, 230);
    stroke(255, 255, 200);
    strokeWeight(2);
  } else {
    fill(0, 0, 0, 185);
    stroke(60, 120, 200);
    strokeWeight(1.5);
  }

  rect(posicionX, posicionY, ancho, alto, 8);
  pop();
}

function dibujarTextoOpcion(posicionX, posicionY, ancho, alto, prefijoTexto, textoOpcion) {
  push();
  textAlign(LEFT, CENTER);
  noStroke();

  let inicioTextoX = posicionX + 18;
  let centroTextoY = posicionY + alto / 2;

  if (prefijoTexto !== "") {
    fill(255, 205, 0);
    textSize(12);
    textStyle(BOLD);
    text(prefijoTexto, inicioTextoX, centroTextoY);
    inicioTextoX += textWidth(prefijoTexto) + 4;
  }

  fill(255);
  textSize(11);
  textStyle(NORMAL);
  text(textoOpcion, inicioTextoX, centroTextoY);
  pop();
}

// HUD de Estrés
function dibujarHUD() {
  push();
  fill(0, 0, 0, 180);
  stroke(60, 120, 200);
  strokeWeight(1.5);
  rect(20, 15, 250, 34, 6);

  noStroke();
  fill(255, 205, 0);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text("ESTRÉS:", 30, 32);

  fill(50);
  rect(90, 26, 75, 12, 3);
  fill(estres > 3 ? color(255, 60, 60) : color(0, 210, 120));
  rect(90, 26, constrain(estres * 15, 0, 75), 12, 3);

  fill(220);
  textSize(11);
  textStyle(NORMAL);
  text((arreglado ? "👔 Arreglado" : "👟 Desarreglado"), 175, 32);
  pop();
}

// -----------------------------------------------------------------
// INICIO Y CRÉDITOS
// -----------------------------------------------------------------
function dibujarPantallaInicio() {
  if (imagenes["portada"]) {
    image(imagenes["portada"], 0, 0, width, height);
  }

  dibujarCajaRectangular(100, 80, 600, 65, false, true);
  fill(255);
  textSize(22);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("¡ES HORA DE LEVANTARSE, QUERIDO!", width / 2, 112);

  let mouseEncimaInicio = esMouseSobreCaja(250, 220, 300, 44);
  dibujarCajaRectangular(250, 220, 300, 44, mouseEncimaInicio, false);
  dibujarTextoOpcion(250, 220, 300, 44, "▶ ", "COMENZAR TU DÍA");

  let mouseEncimaCreditos = esMouseSobreCaja(250, 280, 300, 44);
  dibujarCajaRectangular(250, 280, 300, 44, mouseEncimaCreditos, false);
  dibujarTextoOpcion(250, 280, 300, 44, "ℹ ", "AUTORÍA Y CRÉDITOS");
}

function dibujarPantallaCreditos() {
  if (imagenes["portada"]) {
    image(imagenes["portada"], 0, 0, width, height);
    fill(0, 200);
    rect(0, 0, width, height);
  }

  push();
  textAlign(CENTER, TOP);
  fill(255, 215, 0);
  textSize(18);
  textStyle(BOLD);
  text("CRÉDITOS Y AUTORÍA", width / 2, posicionYCreditos);

  textSize(14);
  textStyle(NORMAL);
  fill(240);
  text("Obra Original y Guion:\n'¡Es Hora de Levantarse, Querido!'\n\nDesarrollo y Código:\nArian Imanoni 125600/9\nIván Ledesma 94422/4\n\nCátedra: PMIW - UNLP\nAño: 2026", width / 2, posicionYCreditos + 40);

  posicionYCreditos -= 0.8;
  if (posicionYCreditos < -180) posicionYCreditos = height + 20;
  pop();

  let mouseEncimaVolver = esMouseSobreCaja(20, 385, 160, 38);
  dibujarCajaRectangular(20, 385, 160, 38, mouseEncimaVolver, false);
  dibujarTextoOpcion(20, 385, 160, 38, "← ", "VOLVER");
}

// -------------------------------
// EVENTOS Y LÓGICA DE INTERACCIÓN
// -------------------------------
function mousePressed() {
  // Activa el motor de audio con la primera interacción del usuario
  userStartAudio();

  if (pantallaActual === "INICIO") {
    if (esMouseSobreCaja(250, 220, 300, 44)) {
      resetearValores();
      pantallaActual = "ESCENA_1";
    } else if (esMouseSobreCaja(250, 280, 300, 44)) {
      pantallaActual = "CREDITOS";
    }
  } else if (pantallaActual === "CREDITOS") {
    if (esMouseSobreCaja(20, 385, 160, 38)) {
      pantallaActual = "INICIO";
    }
  } else if (datosPantallas[pantallaActual]) {
    let escena = datosPantallas[pantallaActual];
    let listaOpciones = obtenerOpcionesEscena(escena);
    let cantidadOpciones = listaOpciones.length;

    if (cantidadOpciones === 1) {
      if (esMouseSobreCaja(180, 350, 440, 38)) ejecutarOpcion(listaOpciones[0]);
    } else if (cantidadOpciones === 2) {
      if (esMouseSobreCaja(60, 350, 325, 38)) ejecutarOpcion(listaOpciones[0]);
      if (esMouseSobreCaja(415, 350, 325, 38)) ejecutarOpcion(listaOpciones[1]);
    } else if (cantidadOpciones === 3) {
      if (esMouseSobreCaja(60, 345, 325, 34)) ejecutarOpcion(listaOpciones[0]);
      if (esMouseSobreCaja(415, 345, 325, 34)) ejecutarOpcion(listaOpciones[1]);
      if (esMouseSobreCaja(237, 388, 325, 34)) ejecutarOpcion(listaOpciones[2]);
    }
  }
}

function ejecutarOpcion(opcionElegida) {
  if (opcionElegida.accion) opcionElegida.accion();
  if (opcionElegida.idDestino) {
    pantallaActual = opcionElegida.idDestino;
  }
}

function esMouseSobreCaja(posicionX, posicionY, ancho, alto) {
  return mouseX >= posicionX && mouseX <= posicionX + ancho && mouseY >= posicionY && mouseY <= posicionY + alto;
}

function obtenerOpcionesEscena(escena) {
  if (typeof escena.getOpciones === 'function') {
    return escena.getOpciones();
  }
  return escena.opciones || [];
}

function resetearValores() {
  estres = 1;
  arreglado = false;
  posicionYCreditos = height;
  
  if (sonidos["alarma"] && sonidos["alarma"].isPlaying()) sonidos["alarma"].stop();
}

// ------------------
// MAPA DE PANTALLAS
// ------------------
function inicializarMapaPantallas() {
  datosPantallas = {
    "ESCENA_1": {
      imagen: "e1_alarma",
      texto: "Entran los primeros rayos de luz por la ventana y suena el despertador a las 07:00 AM. ¿Qué hacés?",
      opciones: [
        { texto: "Postergar la alarma.", idDestino: "ESCENA_2A", accion: () => { estres += 1; arreglado = false; } },
        { texto: "Levantarse de inmediato.", idDestino: "ESCENA_2B", accion: () => { arreglado = true; } }
      ]
    },
    "ESCENA_2A": {
      imagen: "e2a_desarreglado",
      texto: "Te levantás a las apuradas, te ponés la primera muda que encontrás y salís corriendo.",
      opciones: [
        { texto: "Salir hacia el trabajo.", idDestino: "ESCENA_3", accion: null }
      ]
    },
    "ESCENA_2B": {
      imagen: "e2b_arreglado",
      texto: "Tomás unos mates con medialunas, mientras escuchás Los Redondos.",
      opciones: [
        { texto: "Salir hacia el trabajo.", idDestino: "ESCENA_3", accion: null }
      ]
    },
    "ESCENA_3": {
      imagen: () => (arreglado ? "e3_calle" : "e3_calle_desarreglado"),
      texto: () => (arreglado ? 
        "En la vereda de tu casa ves el clima y decidís el transporte." : 
        "Saliste tarde y apurado, la única opción para no perder más tiempo es ir a la parada de colectivos."
      ),
      getOpciones: function() {
        if (!arreglado) {
          return [
            { texto: "Tomar el primero que pase.", idDestino: "ESCENA_5A", accion: () => { estres += 3; } }
          ];
        } else {
          return [
            { texto: "Bicicleta.", idDestino: "ESCENA_4", accion: () => { estres += 2; } },
            { texto: "Colectivo.", idDestino: "ESCENA_5B", accion: () => { estres = max(1, estres - 1); } },
            { texto: "Uber.", idDestino: "ESCENA_6", accion: () => { estres += 1; } }
          ];
        }
      }
    },
    "ESCENA_4": {
      imagen: "e4_bici",
      texto: "Frenás en un semáforo y un trapito te pide monedas para comer. ¿Qué hacés?",
      opciones: [
        { texto: "Ayudarlo y darle plata.", idDestino: "FINAL_2_1_A", accion: () => { estres = max(1, estres - 1); } },
        { texto: "Negarse de mala manera.", idDestino: "FINAL_2_2_A", accion: () => { estres += 2; } }
      ]
    },
    "ESCENA_5A": {
      imagen: "e5a_colectivo_lleno",
      texto: "El colectivo estaba lleno y viajás apretado.",
      opciones: [
        { texto: "Llegar a la oficina.", idDestino: "FINAL_1_2_A", accion: null }
      ]
    },
    "ESCENA_5B": {
      imagen: "e5b_colectivo_vacio",
      texto: "Como saliste con tiempo, pudiste esperar y subirte al colectivo que estaba vacío.",
      opciones: [
        { texto: "Llegar a la oficina.", idDestino: "FINAL_1_1_A", accion: null }
      ]
    },
    "ESCENA_6": {
      imagen: "e6_uber",
      texto: "El chofer te dice: '¿Pibe viste lo de las IA? Si sigue todo así pronto nos van a reemplazar y nos van a dominar...'",
      opciones: [
        { 
          texto: "Ignorarlo y mirar por la ventana.", 
          idDestino: null,
          accion: function() {
            estres += 1;
            pantallaActual = arreglado ? "FINAL_1_1_A" : "FINAL_1_2_A";
          } 
        },
        { texto: "Engancharte a hablar sobre las teorías conspiranoicas.", idDestino: "FINAL_3_A", accion: () => { estres += 3; } }
      ]
    },

    // FINALES 
    "FINAL_1_1_A": {
      imagen: "f11_oficina_bien",
      texto: "Tu jefe te felicita por tu rendimiento y te da una grata bienvenida.",
      opciones: [{ texto: "Volver a casa.", idDestino: "FINAL_1_1_B", accion: null }]
    },
    "FINAL_1_1_B": {
      imagen: "f11_cama_feliz",
      texto: "Tu primer día fue mejor de lo esperado, te vas a dormir desestresado y feliz.",
      opciones: [{ texto: "Acostarse a dormir.", idDestino: "INICIO", accion: resetearValores }]
    },

    "FINAL_1_2_A": {
      imagen: "f12_oficina_mal",
      texto: "Llegas a la oficina y tu jefe te llama la atención por tu impuntualidad y vestimenta.",
      opciones: [{ texto: "Volver a casa.", idDestino: "FINAL_1_2_B", accion: null }]
    },
    "FINAL_1_2_B": {
      imagen: "f12_cama_preocupado",
      texto: "Terminaste tu primer día con un llamado de atención y muy estresado. Mañana no postergues la alarma.",
      opciones: [{ texto: "Acostarse a dormir.", idDestino: "INICIO", accion: resetearValores }]
    },

    "FINAL_2_1_A": {
      imagen: "f21_defensa_trapito",
      texto: "Luego de completar tú primer día de trabajo. Volvés en bici y te intentan robar, pero aparece el trapito a defenderte.",
      opciones: [{ texto: "Le agradeces y continuas tu camino a casa.", idDestino: "FINAL_2_1_B", accion: null }]
    },
    "FINAL_2_1_B": {
      imagen: "f11_cama_feliz",
      texto: "Llegas a tu casa reflexiónando sobre lo ocurrido y empezás a creer en el Karma.",
      opciones: [{ texto: "Acostarse a dormir.", idDestino: "INICIO", accion: resetearValores }]
    },

    "FINAL_2_2_A": {
      imagen: "f22_emboscada",
      texto: "Luego de completar tu primer día de trabajo. Volvés en bici y el trapito te espera con su grupo de amigos para insultarte por haberlo tratado mal.",
      opciones: [{ texto: "Pedis disculpas y te vas asustado.", idDestino: "FINAL_2_2_B", accion: null }]
    },
    "FINAL_2_2_B": {
      imagen: "f12_cama_preocupadoadr",
      texto: "Llegas a tu casa con mucha adrenalina pensando en cómo tratar a las personas la próxima vez.",
      opciones: [{ texto: "Acostarse a dormir.", idDestino: "INICIO", accion: resetearValores }]
    },

    "FINAL_3_A": {
      imagen: "f3_paranoia_oficina",
      texto: "Llegas a la oficina perseguido y empezas a susurrar a tus compañeros que la cafetera inteligente está grabando todo y aprendiendo sobre los humanos para reemplazarlos.",
      opciones: [{ texto: "Volvés a tu casa aterrado.", idDestino: "FINAL_3_B", accion: null }]
    },
    "FINAL_3_B": {
      imagen: "f3_microondas",
      texto: "Llegas paranoico a tu casa y metés el celular en el microondas en modo avión.",
      opciones: [{ texto: "Acostarse a dormir.", idDestino: "INICIO", accion: resetearValores }]
    }
  };
}
