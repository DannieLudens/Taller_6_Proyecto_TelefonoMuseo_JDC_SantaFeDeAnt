// ============================================
// SIMULADOR DE TELÉFONO - MUSEO JUAN DEL CORRAL
// ============================================

// Estados del teléfono
const STATES = {
  IDLE: 'idle',
  DIAL_TONE: 'dial_tone',
  DIALING: 'dialing',
  CALLING_RINGING: 'calling_ringing',
  CALLING_INTRO: 'calling_intro',
  CALLING_OPCIONES: 'calling_opciones',
  WAITING_OPTION: 'waiting_option',
  CALLING_TEMA: 'calling_tema',
  ERROR: 'error',
  BUSY: 'busy'
};

let currentState = STATES.IDLE;
let dialedNumber = '';
let currentPersonaje = null;
let currentPersonajeIndex = -1;
let selectedOption = 0;
let opcionesPlayCount = 0; // Contador de veces que se reprodujo el audio de opciones

// Configuración de personajes
const personajes = [
  { nombre: "Mujer Anónima", oficio: "Época Colonial", telefono: "1234" },
  { nombre: "Campesino Indígena", oficio: "Desplazado", telefono: "2345" },
  { nombre: "Afrodescendiente", oficio: "Época Colonial", telefono: "3456" },
  { nombre: "Sepulturero", oficio: "Oficio Tradicional", telefono: "4567" }
];

// Osciladores para tonos DTMF
const dtmfFreqs = [
  [1209, 1336, 1477], // Columnas
  [697, 770, 852, 941] // Filas
];
let dtmfOscs = [];

// Tonos del sistema
let dialToneOsc, errorToneOsc, busyToneOsc;
let masterVolume = 0.5; // Volumen general (0-1)

// Audios de personajes
let personajeAudios = [];
let currentAudio = null;

// Audios de sistema
let pickupSound = null;  // Sonido de levantar teléfono
let hangupSound = null;  // Sonido de colgar teléfono
let errorCallSound = null; // Sonido de error de llamada
let ringingTimer = 0;     // Timer para el tono de llamada

// UI Elements
let headsetLifted = false;
let headsetX = 0;
let headsetY = 0;
let targetHeadsetX = 0;
let targetHeadsetY = 0;
let headsetRotation = 0;      // Ángulo de rotación del headset
let targetHeadsetRotation = 0; // Ángulo objetivo
let isDraggingHeadset = false;

// Botones del teclado
const keypadLayout = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ["*", 0, "#"]
];

let keypadButtons = [];
let buttonSize = 50;
let buttonSpacing = 60;

// Timer para auto-colgar
let autoHangupTimer = 0;
let optionTimer = 0;
const AUTO_HANGUP_TIME = 3000;
const OPTION_TIMEOUT = 5000; // 5 segundos para elegir opción
const TEMA_PAUSE = 3000; // 3 segundos después del tema

// Control de volumen
let volumeSlider;
let audioContextStarted = false;

// Fondo de madera (pre-renderizado)
let woodBackground;

// Imágenes de persona
let personaRostro = null;  // Rostro en 3/4 con oreja visible
let personaMano = null;    // Mano sosteniendo el headset

// Oreja que aparece
let earVisible = false;
let earAlpha = 0;

function preload() {
  // Cargar imágenes de persona
  personaRostro = loadImage('assets/images/persona_rostro.png');
  personaMano = loadImage('assets/images/persona_mano.png');
  
  // Cargar audios del sistema
  pickupSound = loadSound('assets/sounds/pickup_phone.mp3');
  hangupSound = loadSound('assets/sounds/hangup_phone.mp3');
  errorCallSound = loadSound('assets/sounds/error_call_phone.mp3');
  
  // Cargar audios de personajes
  // Estructura: personajeAudios[i] = { intro, opciones, tema1, tema2, tema3 }
  const personajeNames = [
    'MujerAnonColonia',
    'CampesinoIndigenaDesplazado',
    'AfroColonial',
    'Sepulturero'
  ];
  
  for (let i = 1; i <= 4; i++) {
    personajeAudios[i] = {
      intro: loadSound(`assets/sounds/personajes/Per_${i}_Intro_${personajeNames[i-1]}.mp3`),
      opciones: loadSound(`assets/sounds/personajes/Per_${i}_Opciones_${personajeNames[i-1]}.mp3`),
      tema1: loadSound(`assets/sounds/personajes/Per_${i}_Tema_1_${personajeNames[i-1]}.mp3`),
      tema2: loadSound(`assets/sounds/personajes/Per_${i}_Tema_2_${personajeNames[i-1]}.mp3`),
      tema3: loadSound(`assets/sounds/personajes/Per_${i}_Tema_3_${personajeNames[i-1]}.mp3`)
    };
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Crear fondo de madera (solo una vez)
  createWoodBackground();
  
  // Crear osciladores DTMF
  createDTMFOscillators();
  
  // Crear osciladores de sistema
  createSystemTones();
  
  // Crear slider de volumen
  createVolumeControl();
  
  // Inicializar posición del headset
  headsetX = 0;
  headsetY = 0;
  targetHeadsetX = 0;
  targetHeadsetY = 0;
  
  // Mensaje inicial
  textFont('Arial');
}

function createVolumeControl() {
  // El slider se dibujará manualmente en el canvas
  // No usamos createSlider() de p5 para tener mejor control visual
}

function createWoodBackground() {
  // Crear gráfico de fondo de madera
  woodBackground = createGraphics(windowWidth, windowHeight);
  woodBackground.background(139, 90, 60);
  
  // Textura de madera (vetas)
  woodBackground.noStroke();
  woodBackground.randomSeed(42); // Misma textura siempre
  for (let i = 0; i < 80; i++) {
    woodBackground.fill(120, 80, 50, 30);
    let x = woodBackground.random(woodBackground.width);
    let y = woodBackground.random(woodBackground.height);
    woodBackground.rect(x, y, woodBackground.random(100, 400), woodBackground.random(2, 6));
  }
  
  // Algunas vetas más oscuras
  for (let i = 0; i < 40; i++) {
    woodBackground.fill(100, 65, 40, 20);
    let x = woodBackground.random(woodBackground.width);
    let y = woodBackground.random(woodBackground.height);
    woodBackground.rect(x, y, woodBackground.random(150, 500), woodBackground.random(3, 8));
  }
}

function createDTMFOscillators() {
  for (let i = 0; i < dtmfFreqs.length; i++) {
    dtmfOscs.push([]);
    for (let j = 0; j < dtmfFreqs[i].length; j++) {
      let osc = new p5.Oscillator(dtmfFreqs[i][j]);
      osc.amp(0);
      dtmfOscs[i].push(osc);
    }
  }
}

function createSystemTones() {
  // Dial tone: 440Hz
  dialToneOsc = new p5.Oscillator(440);
  dialToneOsc.amp(0);
  
  // Error tone: 480Hz + 620Hz (alternating)
  errorToneOsc = new p5.Oscillator(480);
  errorToneOsc.amp(0);
  
  // Busy tone: 480Hz + 620Hz (faster alternating)
  busyToneOsc = new p5.Oscillator(480);
  busyToneOsc.amp(0);
}

function startAudioContext() {
  if (!audioContextStarted) {
    userStartAudio().then(() => {
      audioContextStarted = true;
      // Iniciar osciladores
      dialToneOsc.start();
      errorToneOsc.start();
      busyToneOsc.start();
      for (let i = 0; i < dtmfOscs.length; i++) {
        for (let j = 0; j < dtmfOscs[i].length; j++) {
          dtmfOscs[i][j].start();
        }
      }
      console.log("Audio context iniciado");
    });
  }
}

function draw() {
  // Fondo color madera (pre-renderizado)
  image(woodBackground, 0, 0);
  
  // Responsive calculations
  let scale = min(width / 1200, height / 800);
  
  // === CAPA 1: Rostro de la persona (fondo) ===
  if (personaRostro) {
    push();
    // Posicionar rostro en la parte derecha superior
    translate(width * 0.80, height * 0.35);
    let imgScale = scale * 0.6; // Ajustar tamaño
    
    // Crear máscara con bordes redondeados
    drawingContext.save();
    
    // Definir el rectángulo redondeado como región de recorte
    let maskWidth = personaRostro.width * imgScale;
    let maskHeight = personaRostro.height * imgScale;
    let cornerRadius = 30 * scale; // Radio de las esquinas redondeadas
    
    drawingContext.beginPath();
    drawingContext.roundRect(-maskWidth/2, -maskHeight/2, maskWidth, maskHeight, cornerRadius);
    drawingContext.clip();
    
    // Dibujar la imagen dentro de la máscara
    imageMode(CENTER);
    image(personaRostro, 0, 0, maskWidth, maskHeight);
    
    drawingContext.restore();
    pop();
  }
  
  // Dibujar directorio
  drawDirectorio(scale);
  
  // === CAPA 2: Teléfono con headset (medio) ===
  // Dibujar teléfono
  drawTelefono(scale);
  
  // === CAPA 3: Mano de la persona (frente) ===
  // Misma posición que el rostro para superponerse exactamente
  if (personaMano) {
    push();
    translate(width * 0.80, height * 0.35); // Misma posición que el rostro
    let imgScale = scale * 0.6; // Mismo tamaño que el rostro
    imageMode(CENTER);
    image(personaMano, 0, 0, personaMano.width * imgScale, personaMano.height * imgScale);
    pop();
  }
  
  // Dibujar control de volumen
  drawVolumeControl(scale);
  
  // Dibujar información de estado
  drawEstadoInfo(scale);
  
  // Actualizar animaciones
  updateAnimations();
  
  // Manejar timers
  handleTimers();
}

function drawLCDDisplay(scale) {
  // Display debajo del teclado (posición relativa al teléfono)
  push();
  translate(0, 250 * scale);
  
  // Pantalla LCD verde
  fill(120, 180, 120);
  stroke(80, 120, 80);
  strokeWeight(2);
  rect(-100 * scale, 0, 200 * scale, 35 * scale, 4);
  
  // Texto del número marcado
  fill(20);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18 * scale);
  textStyle(BOLD);
  text(dialedNumber || "____", 0, 17 * scale);
  
  pop();
}

function drawEar(scale) {
  // La oreja aparece en la parte superior derecha
  earAlpha = lerp(earAlpha, headsetLifted ? 255 : 0, 0.1);
  
  if (earAlpha < 5) return;
  
  push();
  translate(width * 0.75, height * 0.25);
  
  // Oreja simplificada
  fill(255, 220, 190, earAlpha);
  stroke(180, 140, 100, earAlpha);
  strokeWeight(2 * scale);
  
  // Forma de C de la oreja
  beginShape();
  vertex(0, -40 * scale);
  bezierVertex(
    30 * scale, -40 * scale,
    40 * scale, -20 * scale,
    40 * scale, 0
  );
  bezierVertex(
    40 * scale, 20 * scale,
    30 * scale, 40 * scale,
    0, 40 * scale
  );
  bezierVertex(
    15 * scale, 40 * scale,
    20 * scale, 20 * scale,
    20 * scale, 0
  );
  bezierVertex(
    20 * scale, -20 * scale,
    15 * scale, -40 * scale,
    0, -40 * scale
  );
  endShape();
  
  // Canal auditivo
  fill(220, 180, 150, earAlpha);
  noStroke();
  ellipse(10 * scale, 0, 15 * scale, 20 * scale);
  
  // Texto indicativo
  if (earAlpha > 200) {
    fill(100, 100, 100, earAlpha);
    textAlign(CENTER, CENTER);
    textSize(14 * scale);
    text("Arrastra aquí", 0, 70 * scale);
  }
  
  pop();
}

function drawDirectorio(scale) {
  push();
  translate(width * 0.08, height * 0.15);
  
  // Fondo del directorio - ajustado para más altura
  fill(255, 250, 240);
  stroke(100);
  strokeWeight(2);
  rect(0, 0, 260 * scale, 480 * scale, 10);
  
  // Título
  fill(80);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(22 * scale);
  textStyle(BOLD);
  text("DIRECTORIO", 20 * scale, 20 * scale);
  
  // Línea decorativa
  stroke(180);
  strokeWeight(2);
  line(20 * scale, 50 * scale, 240 * scale, 50 * scale);
  
  // Lista de personajes
  textStyle(NORMAL);
  let yPos = 70 * scale;
  
  for (let i = 0; i < personajes.length; i++) {
    let p = personajes[i];
    
    // Nombre
    fill(60);
    noStroke();
    textSize(15 * scale);
    textStyle(BOLD);
    text(p.nombre, 20 * scale, yPos);
    
    // Oficio
    fill(100);
    textSize(13 * scale);
    textStyle(NORMAL);
    text(p.oficio, 20 * scale, yPos + 20 * scale);
    
    // Teléfono con ícono
    fill(0, 100, 200);
    textSize(18 * scale);
    textStyle(BOLD);
    text("☎ " + p.telefono, 20 * scale, yPos + 42 * scale);
    
    // Línea separadora
    if (i < personajes.length - 1) {
      stroke(200);
      strokeWeight(1);
      line(20 * scale, yPos + 70 * scale, 240 * scale, yPos + 70 * scale);
    }
    
    yPos += 80 * scale;
    textStyle(NORMAL);
  }
  
  pop();
}

function drawTelefono(scale) {
  push();
  translate(width * 0.5, height * 0.42); // Subido de 0.5 a 0.42
  
  // Base del teléfono - color crema (forma trapezoidal inclinada con bordes redondeados)
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * scale);
  
  // Dibujar trapecio con bordes redondeados
  let cornerRadius = 12 * scale;
  beginShape();
  // Esquina superior izquierda (redondeada)
  vertex(-120 * scale + cornerRadius, -30 * scale);
  // Línea superior
  vertex(120 * scale - cornerRadius, -30 * scale);
  // Esquina superior derecha (redondeada)
  quadraticVertex(120 * scale, -30 * scale, 120 * scale + 2 * scale, -30 * scale + cornerRadius);
  // Lado derecho (paralelo al panel del teclado)
  vertex(150 * scale - 2 * scale, 330 * scale - cornerRadius);
  // Esquina inferior derecha (redondeada)
  quadraticVertex(150 * scale, 330 * scale, 150 * scale - cornerRadius, 330 * scale);
  // Línea inferior (más ancha para mantener paralelismo)
  vertex(-150 * scale + cornerRadius, 330 * scale);
  // Esquina inferior izquierda (redondeada)
  quadraticVertex(-150 * scale, 330 * scale, -150 * scale + 2 * scale, 330 * scale - cornerRadius);
  // Lado izquierdo (paralelo al panel del teclado)
  vertex(-120 * scale - 2 * scale, -30 * scale + cornerRadius);
  // Esquina superior izquierda (redondeada)
  quadraticVertex(-120 * scale, -30 * scale, -120 * scale + cornerRadius, -30 * scale);
  endShape(CLOSE);
  
  // Sombra inferior para dar profundidad (más grande y más arriba)
  fill(220, 210, 190);
  noStroke();
  beginShape();
  // Esquina superior izquierda (redondeada)
  vertex(-138.6 * scale + cornerRadius, 303 * scale);
  // Línea superior
  vertex(138.6 * scale - cornerRadius, 303 * scale);
  // Esquina superior derecha (redondeada)
  quadraticVertex(138.6 * scale, 303 * scale, 138.6 * scale + 2 * scale, 303 * scale + cornerRadius);
  // Lado derecho (paralelo al panel del teclado)
  vertex(140 * scale - 2 * scale, 320 * scale - cornerRadius);
  // Esquina inferior derecha (redondeada)
  quadraticVertex(140 * scale, 320 * scale, 140 * scale - cornerRadius, 320 * scale);
  // Línea inferior (más ancha para mantener paralelismo)
  vertex(-140 * scale + cornerRadius, 320 * scale);
  // Esquina inferior izquierda (redondeada)
  quadraticVertex(-140 * scale, 320 * scale, -140 * scale + 2 * scale, 320 * scale - cornerRadius);
  // Lado izquierdo (paralelo al panel del teclado)
  vertex(-138.6 * scale - 2 * scale, 303 * scale + cornerRadius);
  // Esquina superior izquierda (redondeada)
  quadraticVertex(-138.6 * scale, 303 * scale, -138.6 * scale + cornerRadius, 303 * scale);
  endShape(CLOSE);
  
  // Panel inclinado superior para el teclado
  fill(250, 245, 225);
  stroke(180, 170, 150);
  strokeWeight(2 * scale);
  beginShape();
  vertex(-100 * scale, 0);
  vertex(100 * scale, 0);
  vertex(120 * scale, 235 * scale);
  vertex(-120 * scale, 235 * scale);
  endShape(CLOSE);
  
  // Borde del panel
  fill(235, 225, 205);
  noStroke();
  rect(-97 * scale, 5 * scale, 194 * scale, 8 * scale, 3 * scale);
  
  // Dibujar teclado numérico
  drawKeypad(scale);
  
  // Display LCD debajo del teclado
  drawLCDDisplay(scale);
  
  // Dibujar headset y horquilla
  drawHeadset(scale);
  
  pop();
}

function drawKeypad(scale) {
  let startX = -55 * scale;
  let startY = 40 * scale;
  let buttonSpacing = 55 * scale;
  let buttonSize = 38 * scale;
  
  keypadButtons = [];
  
  for (let row = 0; row < keypadLayout.length; row++) {
    for (let col = 0; col < keypadLayout[row].length; col++) {
      let x = startX + col * buttonSpacing;
      let y = startY + row * buttonSpacing;
      let label = keypadLayout[row][col];
      
      keypadButtons.push({
        x: x + width * 0.5,
        y: y + height * 0.42,
        size: buttonSize,
        label: label,
        row: row,
        col: col
      });
      
      let isHovered = dist(mouseX, mouseY, x + width * 0.5, y + height * 0.42) < buttonSize / 2;
      
      // Determinar si el botón puede ser presionado
      let canPress = false;
      
      if (currentState === STATES.DIAL_TONE || currentState === STATES.DIALING) {
        canPress = headsetLifted;
      } else if (currentState === STATES.CALLING_OPCIONES || currentState === STATES.WAITING_OPTION) {
        canPress = headsetLifted;
      }
      
      // Botón cuadrado con bordes redondeados
      push();
      translate(x, y);
      
      // Sombra del botón
      fill(0, 0, 0, 80);
      noStroke();
      rect(-buttonSize/2 + 2 * scale, -buttonSize/2 + 2 * scale, buttonSize, buttonSize, 6 * scale);
      
      // Botón principal - color crema oscuro/casi negro
      if (isHovered && canPress) {
        fill(70, 65, 60); // Presionado - más claro
      } else if (canPress) {
        fill(50, 45, 40); // Normal activo - oscuro
      } else {
        fill(40, 35, 30); // Inactivo - muy oscuro
      }
      
      stroke(30, 25, 20);
      strokeWeight(2);
      rect(-buttonSize/2, -buttonSize/2, buttonSize, buttonSize, 6 * scale);
      
      // Borde superior brillante sutil
      if (!isHovered && canPress) {
        fill(90, 85, 80, 60);
        noStroke();
        rect(-buttonSize/2, -buttonSize/2, buttonSize, buttonSize * 0.3, 6 * scale, 6 * scale, 0, 0);
      }
      
      // Etiqueta del botón - BLANCO
      fill(canPress ? 255 : 120);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(18 * scale);
      textStyle(BOLD);
      text(label, 0, 0);
      
      pop();
    }
  }
}

function drawHeadset(scale) {
  // Animar posición y rotación del headset
  headsetX = lerp(headsetX, targetHeadsetX, 0.15);
  headsetY = lerp(headsetY, targetHeadsetY, 0.15);
  headsetRotation = lerp(headsetRotation, targetHeadsetRotation, 0.12);
  
  // Calcular escala dinámica basada en la distancia al rostro
  // Cuando headsetX aumenta (se mueve a la derecha hacia el rostro), el headset se hace más pequeño
  let distanceToFace = map(headsetX, 0, 500 * scale, 1.0, 0.5); // De tamaño normal (1.0) a mitad (0.5)
  distanceToFace = constrain(distanceToFace, 0.5, 1.0); // Limitar entre 0.5 y 1.0
  let dynamicScale = scale * distanceToFace;
  
  push();
  
  // Horquilla/soporte del teléfono (SIEMPRE VISIBLE - tamaño fijo)
  fill(235, 225, 205);
  stroke(180, 170, 150);
  strokeWeight(2 * scale);
  
  // Base de la horquilla
  rect(-50 * scale, -80 * scale, 100 * scale, 20 * scale, 5 * scale);
  
  // Dos ganchos verticales
  rect(-35 * scale, -70 * scale, 12 * scale, 45 * scale, 4 * scale);
  rect(23 * scale, -70 * scale, 12 * scale, 45 * scale, 4 * scale);
  
  // Botón/switch de la horquilla
  if (!headsetLifted) {
    fill(200, 190, 170); // Presionado
  } else {
    fill(235, 225, 205); // Liberado
  }
  rect(-15 * scale, -65 * scale, 30 * scale, 8 * scale, 3 * scale);
  
  // Cable que conecta el headset con la base del teléfono (estilo retro en espiral)
  // DIBUJAR ANTES DE TRANSFORMAR EL HEADSET
  
  // Punto de anclaje en el headset (parte inferior del auricular izquierdo)
  // Este punto debe rotar con el headset
  let localAnchorX = -130 * scale; // Posición en el headset sin rotar
  let localAnchorY = 30 * scale; // Parte inferior del auricular (ajusta este valor)
  
  // Aplicar rotación manualmente para calcular la posición real
  let cosRot = cos(headsetRotation);
  let sinRot = sin(headsetRotation);
  
  // Punto de inicio (auricular izquierdo del headset con rotación aplicada)
  let cableStartX = headsetX + (localAnchorX * cosRot - localAnchorY * sinRot);
  let cableStartY = -80 * scale + headsetY + (localAnchorX * sinRot + localAnchorY * cosRot);
  
  // Punto de conexión en la parte trasera/arriba de la base del teléfono
  let cableEndX = -122 * scale;
  let cableEndY = -20 * scale;
  
  // Calcular distancia para determinar cuántas espirales dibujar
  let cableDist = dist(cableStartX, cableStartY, cableEndX, cableEndY);
  let numSpirals = int(cableDist / (25 * scale)); // Una espiral cada 25 unidades
  
  // Función para dibujar el cable en espiral
  function drawSpiralCable(strokeColor, weight) {
    noFill();
    stroke(strokeColor);
    strokeWeight(weight);
    
    beginShape();
    for (let i = 0; i <= numSpirals * 12; i++) {
      let t = i / (numSpirals * 12);
      
      // Posición base a lo largo del cable (curva bezier)
      let controlX1 = cableStartX - 100 * scale;
      let controlY1 = cableStartY + 200 * scale;
      let controlX2 = cableEndX - 300 * scale;
      let controlY2 = cableEndY + 200 * scale;
      
      // Punto en la curva bezier
      let x = bezierPoint(cableStartX, controlX1, controlX2, cableEndX, t);
      let y = bezierPoint(cableStartY, controlY1, controlY2, cableEndY, t);
      
      // Añadir ondulación en espiral perpendicular a la curva
      let spiralAngle = t * numSpirals * TWO_PI * 2; // 2 vueltas por segmento
      let spiralRadius = 8 * scale * sin(t * PI); // Amplitud variable (más en el centro)
      
      // Calcular dirección perpendicular
      let dx = bezierTangent(cableStartX, controlX1, controlX2, cableEndX, t);
      let dy = bezierTangent(cableStartY, controlY1, controlY2, cableEndY, t);
      let tangentLen = sqrt(dx * dx + dy * dy);
      if (tangentLen > 0) {
        dx /= tangentLen;
        dy /= tangentLen;
      }
      
      // Perpendicular
      let perpX = -dy;
      let perpY = dx;
      
      // Añadir ondulación
      let spiralOffset = sin(spiralAngle) * spiralRadius;
      vertex(x + perpX * spiralOffset, y + perpY * spiralOffset);
    }
    endShape();
  }
  
  // Dibujar primero el borde oscuro (más grueso)
  drawSpiralCable(color(180, 170, 150), 5.5 * scale);
  
  // Dibujar el cable crema encima (más delgado)
  drawSpiralCable(color(245, 240, 220), 4 * scale);
  
  // Headset en vista lateral (con escala dinámica)
  translate(0 + headsetX, -50 * scale + headsetY);
  rotate(headsetRotation);
  
  // Cuerpo principal del auricular - vista LATERAL (con escala dinámica)
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * dynamicScale);
  
  // Auricular izquierdo (para escuchar)
  push();
  translate(-130 * dynamicScale, 0);
  
  // Parte externa del auricular
  ellipse(-30, 0, 85 * dynamicScale, 100 * dynamicScale);
  
  // Parte interna (más oscura)
  fill(235, 225, 205);
  ellipse(-30, 0, 70 * dynamicScale, 85 * dynamicScale);
  
  // Borde decorativo
  noFill();
  stroke(200, 190, 170);
  strokeWeight(2 * dynamicScale);
  ellipse(-30, 0, 78 * dynamicScale, 93 * dynamicScale);
  pop();
  
  // Micrófono derecho (para hablar)
  push();
  translate(130 * dynamicScale, 0);
  
  // Parte externa del micrófono
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * dynamicScale);
  ellipse(30, 0, 80 * dynamicScale, 95 * dynamicScale);
  
  // Parte interna
  fill(235, 225, 205);
  ellipse(30, 0, 65 * dynamicScale, 80 * dynamicScale);
  
  // Borde decorativo
  noFill();
  stroke(200, 190, 170);
  strokeWeight(2 * dynamicScale);
  ellipse(30, 0, 73 * dynamicScale, 88 * dynamicScale);
  pop();
  
  // Mango/agarre central (conecta los dos extremos)
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * dynamicScale);
  rect(-175 * dynamicScale, -22 * dynamicScale, 350 * dynamicScale, 44 * dynamicScale, 22 * dynamicScale);
  
  // Detalles del mango (líneas decorativas)
  stroke(220, 210, 190);
  strokeWeight(1.5 * dynamicScale);
  line(-140 * dynamicScale, -15 * dynamicScale, -140 * dynamicScale, 15 * dynamicScale);
  line(-100 * dynamicScale, -15 * dynamicScale, -100 * dynamicScale, 15 * dynamicScale);
  line(100 * dynamicScale, -15 * dynamicScale, 100 * dynamicScale, 15 * dynamicScale);
  line(140 * dynamicScale, -15 * dynamicScale, 140 * dynamicScale, 15 * dynamicScale);
  
  pop();
}

function drawVolumeControl(scale) {
  push();
  translate(width * 0.85, height * 0.75);
  
  // Fondo del control
  fill(255, 255, 255, 200);
  stroke(100);
  strokeWeight(2);
  rect(-80 * scale, -40 * scale, 160 * scale, 80 * scale, 10);
  
  // Título
  fill(60);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14 * scale);
  text("🔊 Volumen", 0, -30 * scale);
  
  // Barra del slider
  let sliderWidth = 120 * scale;
  let sliderHeight = 8 * scale;
  let sliderX = -sliderWidth / 2;
  let sliderY = 0;
  
  fill(200);
  stroke(150);
  strokeWeight(1);
  rect(sliderX, sliderY, sliderWidth, sliderHeight, 4);
  
  // Barra de progreso
  fill(0, 150, 255);
  noStroke();
  rect(sliderX, sliderY, sliderWidth * masterVolume, sliderHeight, 4);
  
  // Handle del slider
  let handleX = sliderX + sliderWidth * masterVolume;
  fill(255);
  stroke(100);
  strokeWeight(2);
  circle(handleX, sliderY + sliderHeight / 2, 20 * scale);
  
  fill(0, 150, 255);
  noStroke();
  circle(handleX, sliderY + sliderHeight / 2, 10 * scale);
  
  // Guardar posición del slider para detección de click
  this.volumeSliderBounds = {
    x: sliderX + width * 0.85,
    y: sliderY + height * 0.75,
    width: sliderWidth,
    height: sliderHeight + 20 * scale,
    centerX: width * 0.85,
    centerY: height * 0.75
  };
  
  // Valor del volumen
  textSize(12 * scale);
  fill(80);
  text(Math.round(masterVolume * 100) + "%", 0, 20 * scale);
  
  pop();
}

function drawEstadoInfo(scale) {
  push();
  translate(width * 0.5, height * 0.90); // Movido más abajo de 0.88 a 0.90
  
  fill(255, 255, 255, 230);
  stroke(100);
  strokeWeight(2);
  rect(-250 * scale, -45 * scale, 500 * scale, 90 * scale, 10);
  
  fill(60);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16 * scale);
  
  let statusText = "";
  let statusColor = color(60);
  let instruction = "";
  
  switch(currentState) {
    case STATES.IDLE:
      statusText = "📞 Teléfono disponible";
      instruction = "Toca el auricular para comenzar";
      break;
    case STATES.DIAL_TONE:
      statusText = "Línea lista";
      instruction = "Marca un número del directorio";
      statusColor = color(0, 150, 0);
      break;
    case STATES.DIALING:
      statusText = `Marcando: ${dialedNumber}`;
      instruction = "Completa los 4 dígitos";
      statusColor = color(0, 100, 200);
      break;
    case STATES.CALLING_RINGING:
      statusText = `Llamando a ${currentPersonaje.nombre}...`;
      instruction = "Esperando respuesta...";
      statusColor = color(100, 0, 200);
      break;
    case STATES.CALLING_INTRO:
      statusText = `Llamada con ${currentPersonaje.nombre}`;
      instruction = "Escucha la introducción...";
      statusColor = color(200, 0, 200);
      break;
    case STATES.CALLING_OPCIONES:
      statusText = `${currentPersonaje.nombre} - Opciones ${opcionesPlayCount}/2`;
      instruction = "Puedes presionar 1, 2 o 3 en cualquier momento";
      statusColor = color(150, 0, 200);
      break;
    case STATES.WAITING_OPTION:
      let timeLeft = Math.ceil((OPTION_TIMEOUT - optionTimer * 16.67) / 1000);
      statusText = `Esperando selección (${timeLeft}s)`;
      instruction = "Presiona 1, 2 o 3 para seleccionar";
      statusColor = color(0, 150, 200);
      break;
    case STATES.CALLING_TEMA:
      statusText = `Reproduciendo opción ${selectedOption}`;
      instruction = "Escuchando tema...";
      statusColor = color(100, 0, 200);
      break;
    case STATES.ERROR:
      statusText = "⚠ Número incorrecto";
      instruction = "Cuelga el auricular para intentar de nuevo";
      statusColor = color(200, 0, 0);
      break;
    case STATES.BUSY:
      statusText = "Llamada finalizada";
      instruction = "Cuelga el auricular para terminar";
      statusColor = color(150, 100, 0);
      break;
  }
  
  fill(statusColor);
  textStyle(BOLD);
  textSize(18 * scale);
  text(statusText, 0, -15 * scale);
  
  fill(100);
  textStyle(NORMAL);
  textSize(14 * scale);
  text(instruction, 0, 10 * scale);
  
  pop();
}

function updateAnimations() {
  if (isDraggingHeadset && headsetLifted) {
    // Calcular distancia a la oreja
    let earX = width * 0.75;
    let earY = height * 0.25;
    let headsetWorldX = width * 0.5 + headsetX;
    let headsetWorldY = height * 0.42 - 50 * min(width / 1200, height / 800) + headsetY;
    
    let d = dist(headsetWorldX, headsetWorldY, earX, earY);
    
    // Si está cerca de la oreja, hacer snap
    if (d < 100) {
      // Mantener cerca de la oreja
    }
  } else if (!headsetLifted) {
    // Volver a posición original
    targetHeadsetX = 0;
    targetHeadsetY = 0;
  }
}

function handleTimers() {
  // El estado ERROR se mantiene hasta que el usuario cuelgue manualmente
  // Solo BUSY puede tener auto-hangup si es necesario
  
  // Timer para tono de llamada (3-5 segundos aleatorios)
  if (currentState === STATES.CALLING_RINGING) {
    ringingTimer++;
    // El tiempo se define en playRingingTone()
  }
  
  // Timer para espera de opción (5 segundos)
  if (currentState === STATES.WAITING_OPTION) {
    optionTimer++;
    if (optionTimer > OPTION_TIMEOUT / 16.67) {
      // Timeout - colgar automáticamente
      console.log("Timeout: No se seleccionó opción en 5 segundos");
      changeState(STATES.BUSY);
      playBusyTone();
      optionTimer = 0;
    }
  } else {
    optionTimer = 0;
  }
}

function mousePressed() {
  startAudioContext();
  
  let scale = min(width / 1200, height / 800);
  
  // Click en slider de volumen
  if (this.volumeSliderBounds) {
    let bounds = this.volumeSliderBounds;
    let localX = mouseX - bounds.centerX;
    let localY = mouseY - bounds.centerY;
    
    if (abs(localX) < bounds.width / 2 && abs(localY) < bounds.height) {
      let newVolume = (localX + bounds.width / 2) / bounds.width;
      masterVolume = constrain(newVolume, 0, 1);
      updateAllVolumes();
      return;
    }
  }
  
  // Click en headset (área más grande)
  let headsetWorldX = width * 0.5 + headsetX;
  let headsetWorldY = height * 0.42 - 50 * scale + headsetY;
  
  if (dist(mouseX, mouseY, headsetWorldX, headsetWorldY) < 130 * scale) {
    isDraggingHeadset = true;
    if (!headsetLifted) {
      toggleHeadset();
    }
    return;
  }
  
  // Click en botones del teclado
  if (headsetLifted) {
    // Marcando número inicial
    if (currentState === STATES.DIAL_TONE || currentState === STATES.DIALING) {
      for (let btn of keypadButtons) {
        if (dist(mouseX, mouseY, btn.x, btn.y) < btn.size / 2) {
          pressKey(btn.label, btn.row, btn.col);
          return;
        }
      }
    }
    // Seleccionando opción (solo 1, 2 o 3)
    // Ahora se puede interrumpir durante CALLING_OPCIONES o WAITING_OPTION
    else if (currentState === STATES.CALLING_OPCIONES || currentState === STATES.WAITING_OPTION) {
      for (let btn of keypadButtons) {
        if (dist(mouseX, mouseY, btn.x, btn.y) < btn.size / 2) {
          // Solo aceptar 1, 2 o 3
          if (btn.label === 1 || btn.label === 2 || btn.label === 3) {
            selectOption(btn.label);
          }
          // Si presionan otro botón, no hacer nada
          return;
        }
      }
    }
  }
}

function mouseDragged() {
  if (isDraggingHeadset && headsetLifted) {
    let scale = min(width / 1200, height / 800);
    let baseX = width * 0.5;
    let baseY = height * 0.42 - 50 * scale;
    
    targetHeadsetX = mouseX - baseX;
    targetHeadsetY = mouseY - baseY;
    
    // Limitar el rango de movimiento (ampliado para alcanzar el rostro de la imagen)
    targetHeadsetX = constrain(targetHeadsetX, -300 * scale, 500 * scale);
    targetHeadsetY = constrain(targetHeadsetY, -400 * scale, 200 * scale);
  }
  
  // Actualizar slider de volumen si se está arrastrando
  if (this.volumeSliderBounds) {
    let bounds = this.volumeSliderBounds;
    let localX = mouseX - bounds.centerX;
    let localY = mouseY - bounds.centerY;
    
    if (abs(localX) < bounds.width / 2 + 50 && abs(localY) < bounds.height + 50) {
      let newVolume = (localX + bounds.width / 2) / bounds.width;
      masterVolume = constrain(newVolume, 0, 1);
      updateAllVolumes();
    }
  }
}

function mouseReleased() {
  isDraggingHeadset = false;
  
  // Si el headset está levantado pero muy lejos, colgarlo
  if (headsetLifted) {
    let scale = min(width / 1200, height / 800);
    let baseX = width * 0.5;
    let baseY = height * 0.42 - 50 * scale;
    let currentX = baseX + headsetX;
    let currentY = baseY + headsetY;
    
    // Si está muy cerca de la posición original, colgar
    if (dist(currentX, currentY, baseX, baseY) < 30 * scale) {
      toggleHeadset();
    }
  }
}

function toggleHeadset() {
  headsetLifted = !headsetLifted;
  
  if (headsetLifted) {
    // Rotar a 50 grados (en radianes)
    targetHeadsetRotation = -PI * 50 / 180;
    
    // Reproducir sonido de levantar teléfono
    if (pickupSound) {
      pickupSound.setVolume(masterVolume);
      pickupSound.play();
    }
    
    // Esperar 500ms antes de reproducir el dial tone
    changeState(STATES.DIAL_TONE);
    setTimeout(() => {
      playDialTone();
    }, 500);
  } else {
    // Volver a horizontal (0 grados)
    targetHeadsetRotation = 0;
    
    // Reproducir sonido de colgar teléfono
    if (hangupSound) {
      hangupSound.setVolume(masterVolume);
      hangupSound.play();
    }
    
    hangUp();
  }
}

function pressKey(key, row, col) {
  if (currentState !== STATES.DIAL_TONE && currentState !== STATES.DIALING) {
    return;
  }
  
  playDTMFTone(col, row);
  dialedNumber += key;
  changeState(STATES.DIALING);
  
  if (dialedNumber.length === 4) {
    setTimeout(() => checkNumber(), 500);
  }
}

function checkNumber() {
  let personaje = personajes.find(p => p.telefono === dialedNumber);
  
  if (personaje) {
    currentPersonaje = personaje;
    // Encontrar el índice del personaje (1-4)
    currentPersonajeIndex = personajes.indexOf(personaje) + 1;
    // Resetear contador de opciones
    opcionesPlayCount = 0;
    // Primero reproducir tono de llamada (ringing)
    changeState(STATES.CALLING_RINGING);
    playRingingTone();
  } else {
    changeState(STATES.ERROR);
    playErrorTone();
  }
}

function selectOption(option) {
  selectedOption = option;
  console.log(`Usuario seleccionó opción ${option} (interrumpiendo si está sonando)`);
  
  // Resetear timer de opciones
  optionTimer = 0;
  
  // Detener audio actual si está reproduciéndose
  if (currentAudio && currentAudio.isPlaying && currentAudio.isPlaying()) {
    currentAudio.stop();
  }
  
  // Reproducir tono DTMF para feedback
  let row = 0; // Primera fila para 1, 2, 3
  let col = option - 1; // 0, 1, 2
  playDTMFTone(col, row);
  
  // Cambiar a reproducción de tema
  changeState(STATES.CALLING_TEMA);
  playTemaAudio(option);
}

function playDTMFTone(col, row) {
  stopAllTones();
  
  let vol = 0.15 * masterVolume;
  dtmfOscs[0][col].amp(vol, 0.05);
  dtmfOscs[1][row].amp(vol, 0.05);
  
  setTimeout(() => {
    dtmfOscs[0][col].amp(0, 0.05);
    dtmfOscs[1][row].amp(0, 0.05);
  }, 200);
}

function playDialTone() {
  stopAllTones();
  dialToneOsc.amp(0.1 * masterVolume);
}

function playRingingTone() {
  stopAllTones();
  ringingTimer = 0;
  
  console.log("Reproduciendo tono de llamada (ringing)...");
  
  // Tono de llamada intermitente: 440Hz + 480Hz
  let ringingCount = 0;
  let ringingInterval = setInterval(() => {
    if (currentState !== STATES.CALLING_RINGING) {
      clearInterval(ringingInterval);
      errorToneOsc.amp(0);
      busyToneOsc.amp(0);
      return;
    }
    
    if (ringingCount % 2 === 0) {
      // Pitido (ring)
      errorToneOsc.freq(440);
      busyToneOsc.freq(480);
      errorToneOsc.amp(0.12 * masterVolume);
      busyToneOsc.amp(0.12 * masterVolume);
    } else {
      // Silencio
      errorToneOsc.amp(0);
      busyToneOsc.amp(0);
    }
    ringingCount++;
  }, 1000); // 1 segundo de pitido, 1 segundo de silencio
  
  // Después de 3-5 segundos aleatorios, "contestan" el teléfono
  let ringDuration = random(3000, 5000);
  setTimeout(() => {
    if (currentState === STATES.CALLING_RINGING) {
      clearInterval(ringingInterval);
      errorToneOsc.amp(0);
      busyToneOsc.amp(0);
      
      // Reproducir sonido de levantar teléfono (si está cargado)
      if (pickupSound) {
        pickupSound.setVolume(masterVolume);
        pickupSound.play();
        // Esperar a que termine el sonido de pickup para empezar intro
        pickupSound.onended(() => {
          changeState(STATES.CALLING_INTRO);
          playIntroAudio();
        });
      } else {
        // Si no hay sonido de pickup, ir directo a intro
        changeState(STATES.CALLING_INTRO);
        playIntroAudio();
      }
    }
  }, ringDuration);
}

function playErrorTone() {
  stopAllTones();
  
  // Reproducir el audio de error en loop
  if (errorCallSound) {
    errorCallSound.setVolume(masterVolume);
    errorCallSound.loop(); // Reproducir en loop continuo
  }
}

function playBusyTone() {
  stopAllTones();
  
  let count = 0;
  let busyInterval = setInterval(() => {
    if (count % 2 === 0) {
      busyToneOsc.freq(480);
      busyToneOsc.amp(0.15 * masterVolume);
    } else {
      busyToneOsc.freq(620);
      busyToneOsc.amp(0.15 * masterVolume);
    }
    count++;
    if (count > 4) {
      clearInterval(busyInterval);
      busyToneOsc.amp(0);
    }
  }, 500);
}

function playIntroAudio() {
  stopAllTones();
  
  console.log(`Reproduciendo introducción del personaje ${currentPersonajeIndex}`);
  
  // Reproducir audio real
  currentAudio = personajeAudios[currentPersonajeIndex].intro;
  currentAudio.setVolume(masterVolume);
  currentAudio.play();
  
  // Cuando termine la intro, reproducir audio de opciones
  currentAudio.onended(() => {
    if (currentState === STATES.CALLING_INTRO) {
      playOpcionesAudio();
    }
  });
}

function playOpcionesAudio() {
  console.log(`Reproduciendo opciones del personaje ${currentPersonajeIndex} (intento ${opcionesPlayCount + 1}/2)`);
  changeState(STATES.CALLING_OPCIONES);
  opcionesPlayCount++;
  
  // Reproducir audio real
  currentAudio = personajeAudios[currentPersonajeIndex].opciones;
  currentAudio.setVolume(masterVolume);
  currentAudio.play();
  
  // Cuando termine
  currentAudio.onended(() => {
    if (currentState === STATES.CALLING_OPCIONES) {
      handleOpcionesEnded();
    }
  });
}

function handleOpcionesEnded() {
  if (opcionesPlayCount === 1) {
    // Primera vez: esperar 3 segundos y reproducir de nuevo
    console.log("Primera reproducción de opciones terminada. Esperando 3 segundos...");
    setTimeout(() => {
      if (currentState === STATES.CALLING_OPCIONES || currentState === STATES.WAITING_OPTION) {
        playOpcionesAudio();
      }
    }, 3000);
  } else if (opcionesPlayCount >= 2) {
    // Segunda vez: activar timer de 5 segundos
    console.log("Segunda reproducción de opciones terminada. Iniciando timer de 5 segundos...");
    changeState(STATES.WAITING_OPTION);
    optionTimer = 0;
  }
}

function playTemaAudio(option) {
  stopAllTones();
  
  console.log(`Reproduciendo tema ${option} del personaje ${currentPersonajeIndex}`);
  
  // Reproducir audio real según la opción
  let temaKey = `tema${option}`;
  currentAudio = personajeAudios[currentPersonajeIndex][temaKey];
  currentAudio.setVolume(masterVolume);
  currentAudio.play();
  
  // Cuando termine el tema, esperar 3 segundos y volver a opciones
  currentAudio.onended(() => {
    if (currentState === STATES.CALLING_TEMA) {
      console.log("Tema terminado. Esperando 3 segundos antes de volver a opciones...");
      setTimeout(() => {
        if (currentState === STATES.CALLING_TEMA || currentState === STATES.WAITING_OPTION) {
          // Resetear contador de opciones para empezar el ciclo de nuevo
          opcionesPlayCount = 0;
          playOpcionesAudio();
        }
      }, TEMA_PAUSE);
    }
  });
}

function stopAllTones() {
  dialToneOsc.amp(0);
  errorToneOsc.amp(0);
  busyToneOsc.amp(0);
  
  // Detener el audio de error si está sonando
  if (errorCallSound && errorCallSound.isPlaying()) {
    errorCallSound.stop();
  }
  
  for (let i = 0; i < dtmfOscs[0].length; i++) {
    dtmfOscs[0][i].amp(0);
  }
  for (let i = 0; i < dtmfOscs[1].length; i++) {
    dtmfOscs[1][i].amp(0);
  }
  
  // Detener audio actual si existe
  if (currentAudio && currentAudio.isPlaying && currentAudio.isPlaying()) {
    currentAudio.stop();
  }
}

function updateAllVolumes() {
  // Actualizar volumen de todos los osciladores activos
  if (currentState === STATES.DIAL_TONE) {
    dialToneOsc.amp(0.1 * masterVolume);
  }
}

function hangUp() {
  changeState(STATES.IDLE);
  stopAllTones();
  dialedNumber = '';
  currentPersonaje = null;
  currentPersonajeIndex = -1;
  selectedOption = 0;
  opcionesPlayCount = 0;
  autoHangupTimer = 0;
  optionTimer = 0;
  ringingTimer = 0;
  targetHeadsetX = 0;
  targetHeadsetY = 0;
}

function changeState(newState) {
  console.log(`Estado: ${currentState} -> ${newState}`);
  currentState = newState;
  autoHangupTimer = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createWoodBackground(); // Recrear fondo con nuevo tamaño
}

function touchStarted() {
  startAudioContext();
  
  // En móvil, tratar touch como mouse
  mousePressed();
  
  // Prevenir comportamiento por defecto
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}