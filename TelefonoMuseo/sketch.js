// ============================================
// SIMULADOR DE TELÉFONO - MUSEO JUAN DEL CORRAL
// ============================================

// SISTEMA DE SKINS DEL TELÉFONO
let phoneStyle = 'buttons'; // 'buttons' o 'rotary'
let styleToggleBounds = null; // Bounds del botón toggle

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

// Variables para teléfono rotatorio
let rotaryAngle = 0; // Ángulo actual del disco
let targetRotaryAngle = 0; // Ángulo objetivo
let isDraggingDial = false; // Si está arrastrando el disco
let dialStartAngle = 0; // Ángulo donde empezó el arrastre
let currentDialNumber = -1; // Número actual siendo marcado
let isReturning = false; // Si el disco está volviendo a la posición inicial

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
  let scaleRatio = min(width / 1200, height / 800);
  
  // === CAPA 1: Rostro de la persona (fondo) ===
  if (personaRostro) {
    push();
    // Posicionar rostro en la parte derecha superior
    translate(width * 0.80, height * 0.35);
    let imgScale = scaleRatio * 0.6; // Ajustar tamaño
    
    // Crear máscara con bordes redondeados
    drawingContext.save();
    
    // Definir el rectángulo redondeado como región de recorte
    let maskWidth = personaRostro.width * imgScale;
    let maskHeight = personaRostro.height * imgScale;
    let cornerRadius = 30 * scaleRatio; // Radio de las esquinas redondeadas
    
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
  drawDirectorio(scaleRatio);
  
  // === CAPA 2: Teléfono con headset (medio) ===
  // Dibujar teléfono (según el estilo seleccionado)
  drawTelefono(scaleRatio);
  
  // === CAPA 3: Mano de la persona (frente) ===
  // Misma posición que el rostro para superponerse exactamente
  if (personaMano) {
    push();
    translate(width * 0.80, height * 0.35); // Misma posición que el rostro
    let imgScale = scaleRatio * 0.6; // Mismo tamaño que el rostro
    imageMode(CENTER);
    image(personaMano, 0, 0, personaMano.width * imgScale, personaMano.height * imgScale);
    pop();
  }
  
  // Dibujar toggle de estilo de teléfono
  drawStyleToggle(scaleRatio);
  
  // Dibujar control de volumen
  drawVolumeControl(scaleRatio);
  
  // Dibujar información de estado
  drawEstadoInfo(scaleRatio);
  
  // Actualizar animaciones
  updateAnimations();
  
  // Manejar timers
  handleTimers();
}

function drawLCDDisplay(scaleRatio) {
  // Display debajo del teclado (posición relativa al teléfono)
  push();
  translate(0, 250 * scaleRatio);
  
  // Pantalla LCD verde
  fill(120, 180, 120);
  stroke(80, 120, 80);
  strokeWeight(2);
  rect(-100 * scaleRatio, 0, 200 * scaleRatio, 35 * scaleRatio, 4);
  
  // Texto del número marcado
  fill(20);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18 * scaleRatio);
  textStyle(BOLD);
  text(dialedNumber || "____", 0, 17 * scaleRatio);
  
  pop();
}

function drawEar(scaleRatio) {
  // La oreja aparece en la parte superior derecha
  earAlpha = lerp(earAlpha, headsetLifted ? 255 : 0, 0.1);
  
  if (earAlpha < 5) return;
  
  push();
  translate(width * 0.75, height * 0.25);
  
  // Oreja simplificada
  fill(255, 220, 190, earAlpha);
  stroke(180, 140, 100, earAlpha);
  strokeWeight(2 * scaleRatio);
  
  // Forma de C de la oreja
  beginShape();
  vertex(0, -40 * scaleRatio);
  bezierVertex(
    30 * scaleRatio, -40 * scaleRatio,
    40 * scaleRatio, -20 * scaleRatio,
    40 * scaleRatio, 0
  );
  bezierVertex(
    40 * scaleRatio, 20 * scaleRatio,
    30 * scaleRatio, 40 * scaleRatio,
    0, 40 * scaleRatio
  );
  bezierVertex(
    15 * scaleRatio, 40 * scaleRatio,
    20 * scaleRatio, 20 * scaleRatio,
    20 * scaleRatio, 0
  );
  bezierVertex(
    20 * scaleRatio, -20 * scaleRatio,
    15 * scaleRatio, -40 * scaleRatio,
    0, -40 * scaleRatio
  );
  endShape();
  
  // Canal auditivo
  fill(220, 180, 150, earAlpha);
  noStroke();
  ellipse(10 * scaleRatio, 0, 15 * scaleRatio, 20 * scaleRatio);
  
  // Texto indicativo
  if (earAlpha > 200) {
    fill(100, 100, 100, earAlpha);
    textAlign(CENTER, CENTER);
    textSize(14 * scaleRatio);
    text("Arrastra aquí", 0, 70 * scaleRatio);
  }
  
  pop();
}

function drawDirectorio(scaleRatio) {
  push();
  translate(width * 0.08, height * 0.15);
  
  // Fondo del directorio - ajustado para más altura
  fill(255, 250, 240);
  stroke(100);
  strokeWeight(2);
  rect(0, 0, 260 * scaleRatio, 480 * scaleRatio, 10);
  
  // Título
  fill(80);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(22 * scaleRatio);
  textStyle(BOLD);
  text("DIRECTORIO", 20 * scaleRatio, 20 * scaleRatio);
  
  // Línea decorativa
  stroke(180);
  strokeWeight(2);
  line(20 * scaleRatio, 50 * scaleRatio, 240 * scaleRatio, 50 * scaleRatio);
  
  // Lista de personajes
  textStyle(NORMAL);
  let yPos = 70 * scaleRatio;
  
  for (let i = 0; i < personajes.length; i++) {
    let p = personajes[i];
    
    // Nombre
    fill(60);
    noStroke();
    textSize(15 * scaleRatio);
    textStyle(BOLD);
    text(p.nombre, 20 * scaleRatio, yPos);
    
    // Oficio
    fill(100);
    textSize(13 * scaleRatio);
    textStyle(NORMAL);
    text(p.oficio, 20 * scaleRatio, yPos + 20 * scaleRatio);
    
    // Teléfono con ícono
    fill(0, 100, 200);
    textSize(18 * scaleRatio);
    textStyle(BOLD);
    text("☎ " + p.telefono, 20 * scaleRatio, yPos + 42 * scaleRatio);
    
    // Línea separadora
    if (i < personajes.length - 1) {
      stroke(200);
      strokeWeight(1);
      line(20 * scaleRatio, yPos + 70 * scaleRatio, 240 * scaleRatio, yPos + 70 * scaleRatio);
    }
    
    yPos += 80 * scaleRatio;
    textStyle(NORMAL);
  }
  
  pop();
}

function drawTelefono(scaleRatio) {
  // Dispatcher: llamar a la función correcta según el estilo
  if (phoneStyle === 'buttons') {
    drawTelefonoButtons(scaleRatio);
  } else if (phoneStyle === 'rotary') {
    drawTelefonoRotary(scaleRatio);
  }
}

function drawTelefonoButtons(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.42); // Subido de 0.5 a 0.42
  
  // Base del teléfono - color crema (forma trapezoidal inclinada con bordes redondeados)
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * scaleRatio);
  
  // Dibujar trapecio con bordes redondeados
  let cornerRadius = 12 * scaleRatio;
  beginShape();
  // Esquina superior izquierda (redondeada)
  vertex(-120 * scaleRatio + cornerRadius, -30 * scaleRatio);
  // Línea superior
  vertex(120 * scaleRatio - cornerRadius, -30 * scaleRatio);
  // Esquina superior derecha (redondeada)
  quadraticVertex(120 * scaleRatio, -30 * scaleRatio, 120 * scaleRatio + 2 * scaleRatio, -30 * scaleRatio + cornerRadius);
  // Lado derecho (paralelo al panel del teclado)
  vertex(150 * scaleRatio - 2 * scaleRatio, 330 * scaleRatio - cornerRadius);
  // Esquina inferior derecha (redondeada)
  quadraticVertex(150 * scaleRatio, 330 * scaleRatio, 150 * scaleRatio - cornerRadius, 330 * scaleRatio);
  // Línea inferior (más ancha para mantener paralelismo)
  vertex(-150 * scaleRatio + cornerRadius, 330 * scaleRatio);
  // Esquina inferior izquierda (redondeada)
  quadraticVertex(-150 * scaleRatio, 330 * scaleRatio, -150 * scaleRatio + 2 * scaleRatio, 330 * scaleRatio - cornerRadius);
  // Lado izquierdo (paralelo al panel del teclado)
  vertex(-120 * scaleRatio - 2 * scaleRatio, -30 * scaleRatio + cornerRadius);
  // Esquina superior izquierda (redondeada)
  quadraticVertex(-120 * scaleRatio, -30 * scaleRatio, -120 * scaleRatio + cornerRadius, -30 * scaleRatio);
  endShape(CLOSE);
  
  // Sombra inferior para dar profundidad (más grande y más arriba)
  fill(220, 210, 190);
  noStroke();
  beginShape();
  // Esquina superior izquierda (redondeada)
  vertex(-138.6 * scaleRatio + cornerRadius, 303 * scaleRatio);
  // Línea superior
  vertex(138.6 * scaleRatio - cornerRadius, 303 * scaleRatio);
  // Esquina superior derecha (redondeada)
  quadraticVertex(138.6 * scaleRatio, 303 * scaleRatio, 138.6 * scaleRatio + 2 * scaleRatio, 303 * scaleRatio + cornerRadius);
  // Lado derecho (paralelo al panel del teclado)
  vertex(140 * scaleRatio - 2 * scaleRatio, 320 * scaleRatio - cornerRadius);
  // Esquina inferior derecha (redondeada)
  quadraticVertex(140 * scaleRatio, 320 * scaleRatio, 140 * scaleRatio - cornerRadius, 320 * scaleRatio);
  // Línea inferior (más ancha para mantener paralelismo)
  vertex(-140 * scaleRatio + cornerRadius, 320 * scaleRatio);
  // Esquina inferior izquierda (redondeada)
  quadraticVertex(-140 * scaleRatio, 320 * scaleRatio, -140 * scaleRatio + 2 * scaleRatio, 320 * scaleRatio - cornerRadius);
  // Lado izquierdo (paralelo al panel del teclado)
  vertex(-138.6 * scaleRatio - 2 * scaleRatio, 303 * scaleRatio + cornerRadius);
  // Esquina superior izquierda (redondeada)
  quadraticVertex(-138.6 * scaleRatio, 303 * scaleRatio, -138.6 * scaleRatio + cornerRadius, 303 * scaleRatio);
  endShape(CLOSE);
  
  // Panel inclinado superior para el teclado
  fill(250, 245, 225);
  stroke(180, 170, 150);
  strokeWeight(2 * scaleRatio);
  beginShape();
  vertex(-100 * scaleRatio, 0);
  vertex(100 * scaleRatio, 0);
  vertex(120 * scaleRatio, 235 * scaleRatio);
  vertex(-120 * scaleRatio, 235 * scaleRatio);
  endShape(CLOSE);
  
  // Borde del panel
  fill(235, 225, 205);
  noStroke();
  rect(-97 * scaleRatio, 5 * scaleRatio, 194 * scaleRatio, 8 * scaleRatio, 3 * scaleRatio);
  
  // Dibujar teclado numérico
  drawKeypad(scaleRatio);
  
  // Display LCD debajo del teclado
  drawLCDDisplay(scaleRatio);
  
  // Dibujar headset y horquilla
  drawHeadset(scaleRatio);
  
  pop();
}

function drawKeypad(scaleRatio) {
  let startX = -55 * scaleRatio;
  let startY = 40 * scaleRatio;
  let buttonSpacing = 55 * scaleRatio;
  let buttonSize = 38 * scaleRatio;
  
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
      
      // Dibujar el botón visualmente
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
      rect(-buttonSize/2 + 2 * scaleRatio, -buttonSize/2 + 2 * scaleRatio, buttonSize, buttonSize, 6 * scaleRatio);
      
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
      rect(-buttonSize/2, -buttonSize/2, buttonSize, buttonSize, 6 * scaleRatio);
      
      // Borde superior brillante sutil
      if (!isHovered && canPress) {
        fill(90, 85, 80, 60);
        noStroke();
        rect(-buttonSize/2, -buttonSize/2, buttonSize, buttonSize * 0.3, 6 * scaleRatio, 6 * scaleRatio, 0, 0);
      }
      
      // Etiqueta del botón - SIEMPRE BLANCO
      fill(255); // Siempre blanco, sin importar si canPress
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(18 * scaleRatio);
      textStyle(BOLD);
      text(label, 0, 0);
      
      pop();
    }
  }
}

// ============================================
// TELÉFONO ROTATORIO
// ============================================

function drawTelefonoRotary(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.42);
  
  // Base del teléfono rotatorio - más cuadrada
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * scaleRatio);
  
  // Base cuadrada redondeada
  let baseWidth = 280 * scaleRatio;
  let baseHeight = 340 * scaleRatio;
  rect(-baseWidth/2, -30 * scaleRatio, baseWidth, baseHeight, 15 * scaleRatio);
  
  // Sombra
  fill(220, 210, 190);
  noStroke();
  rect(-baseWidth/2 + 5 * scaleRatio, 310 * scaleRatio, baseWidth - 10 * scaleRatio, 10 * scaleRatio, 5 * scaleRatio);
  
  // Disco rotatorio
  drawRotaryDial(scaleRatio);
  
  // Display LCD arriba
  push();
  translate(0, 30 * scaleRatio);
  fill(120, 180, 120);
  stroke(80, 120, 80);
  strokeWeight(2);
  rect(-100 * scaleRatio, 0, 200 * scaleRatio, 35 * scaleRatio, 4);
  
  // Texto del número marcado
  fill(20);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18 * scaleRatio);
  textStyle(BOLD);
  text(dialedNumber || "____", 0, 17 * scaleRatio);
  pop();
  
  // Dibujar headset y horquilla (mismo que botones)
  drawHeadset(scaleRatio);
  
  pop();
}

function drawRotaryDial(scaleRatio) {
  let centerX = 0;
  let centerY = 160 * scaleRatio;
  let outerRadius = 110 * scaleRatio;
  let innerRadius = 35 * scaleRatio;
  
  // Animar rotación
  rotaryAngle = lerp(rotaryAngle, targetRotaryAngle, 0.15);
  
  push();
  translate(centerX, centerY);
  rotate(rotaryAngle);
  
  // Disco principal
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * scaleRatio);
  circle(0, 0, outerRadius * 2);
  
  // Círculo interior (donde va el dedo)
  fill(235, 225, 205);
  circle(0, 0, innerRadius * 2);
  
  // Dibujar números (0-9) en círculo
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  for (let i = 0; i < numbers.length; i++) {
    let angle = map(i, 0, 10, -PI * 0.25, PI * 1.75); // Desde arriba derecha
    let numRadius = (outerRadius + innerRadius) / 2;
    let x = cos(angle) * numRadius;
    let y = sin(angle) * numRadius;
    
    push();
    translate(x, y);
    
    // Agujero para el dedo
    fill(60, 55, 50);
    stroke(40, 35, 30);
    strokeWeight(2 * scaleRatio);
    circle(0, 0, 25 * scaleRatio);
    
    // Número
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16 * scaleRatio);
    textStyle(BOLD);
    text(numbers[i], 0, 0);
    pop();
  }
  
  // Tope (finger stop) - una pequeña barra metálica
  push();
  rotate(PI * 1.85);
  fill(100, 100, 100);
  noStroke();
  rect(-5 * scaleRatio, outerRadius - 10 * scaleRatio, 10 * scaleRatio, 25 * scaleRatio, 3 * scaleRatio);
  pop();
  
  pop();
  
  // Guardar posición del disco para detección de arrastre
  rotaryDialBounds = {
    x: width * 0.5 + centerX,
    y: height * 0.42 + centerY,
    outerRadius: outerRadius,
    innerRadius: innerRadius
  };
}

function drawStyleToggle(scaleRatio) {
  push();
  translate(width * 0.15, height * 0.08);
  
  let toggleWidth = 180 * scaleRatio;
  let toggleHeight = 50 * scaleRatio;
  let buttonWidth = toggleWidth / 2 - 5 * scaleRatio;
  
  // Fondo del toggle
  fill(255, 255, 255, 200);
  stroke(100);
  strokeWeight(2);
  rect(-toggleWidth/2, -toggleHeight/2, toggleWidth, toggleHeight, 10);
  
  // Botón izquierdo (Botones)
  if (phoneStyle === 'buttons') {
    fill(0, 150, 255); // Activo - azul
  } else {
    fill(200); // Inactivo - gris
  }
  stroke(100);
  strokeWeight(2);
  rect(-toggleWidth/2 + 5 * scaleRatio, -toggleHeight/2 + 5 * scaleRatio, buttonWidth, toggleHeight - 10 * scaleRatio, 8);
  
  // Texto "Botones"
  fill(phoneStyle === 'buttons' ? 255 : 60);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12 * scaleRatio);
  textStyle(BOLD);
  text("🔢 Botones", -toggleWidth/4, 0);
  
  // Botón derecho (Rotatorio)
  if (phoneStyle === 'rotary') {
    fill(0, 150, 255); // Activo - azul
  } else {
    fill(200); // Inactivo - gris
  }
  stroke(100);
  strokeWeight(2);
  rect(5 * scaleRatio, -toggleHeight/2 + 5 * scaleRatio, buttonWidth, toggleHeight - 10 * scaleRatio, 8);
  
  // Texto "Rotatorio"
  fill(phoneStyle === 'rotary' ? 255 : 60);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12 * scaleRatio);
  textStyle(BOLD);
  text("📞 Rotatorio", toggleWidth/4, 0);
  
  pop();
  
  // Guardar bounds para detección de click
  styleToggleBounds = {
    leftX: width * 0.15 - toggleWidth/2,
    rightX: width * 0.15 + toggleWidth/2,
    topY: height * 0.08 - toggleHeight/2,
    bottomY: height * 0.08 + toggleHeight/2,
    midX: width * 0.15
  };
}

function handleRotaryClick(mx, my) {
  if (!rotaryDialBounds || !headsetLifted) return null;
  
  let dx = mx - rotaryDialBounds.x;
  let dy = my - rotaryDialBounds.y;
  let distance = sqrt(dx * dx + dy * dy);
  
  // Click dentro del área de números (entre innerRadius y outerRadius)
  if (distance > rotaryDialBounds.innerRadius && distance < rotaryDialBounds.outerRadius) {
    // Calcular qué número está en esa posición
    let angle = atan2(dy, dx);
    // Normalizar ángulo
    if (angle < 0) angle += TWO_PI;
    
    // Mapear ángulo a número
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let startAngle = -PI * 0.25;
    let endAngle = PI * 1.75;
    
    for (let i = 0; i < numbers.length; i++) {
      let numAngle = map(i, 0, 10, startAngle, endAngle);
      if (numAngle < 0) numAngle += TWO_PI;
      
      // Verificar si el click está cerca de este número
      let angleDiff = abs(angle - numAngle);
      if (angleDiff < 0.3) { // ~17 grados de tolerancia
        return numbers[i];
      }
    }
  }
  
  return null;
}

function handleRotaryDrag() {
  if (!isDraggingDial || !rotaryDialBounds) return;
  
  let dx = mouseX - rotaryDialBounds.x;
  let dy = mouseY - rotaryDialBounds.y;
  let currentAngle = atan2(dy, dx);
  
  // Actualizar ángulo objetivo
  targetRotaryAngle = currentAngle - dialStartAngle;
  
  // Limitar rotación (solo puede rotar en sentido horario hasta el tope)
  targetRotaryAngle = constrain(targetRotaryAngle, 0, PI * 0.5);
}

function drawHeadset(scaleRatio) {
  // Animar posición y rotación del headset
  headsetX = lerp(headsetX, targetHeadsetX, 0.15);
  headsetY = lerp(headsetY, targetHeadsetY, 0.15);
  headsetRotation = lerp(headsetRotation, targetHeadsetRotation, 0.12);
  
  // Calcular escala dinámica basada en la distancia al rostro
  // Cuando headsetX aumenta (se mueve a la derecha hacia el rostro), el headset se hace más pequeño
  let distanceToFace = map(headsetX, 0, 500 * scaleRatio, 1.0, 0.5); // De tamaño normal (1.0) a mitad (0.5)
  distanceToFace = constrain(distanceToFace, 0.5, 1.0); // Limitar entre 0.5 y 1.0
  let dynamicScale = scaleRatio * distanceToFace;
  
  push();
  
  // Horquilla/soporte del teléfono (SIEMPRE VISIBLE - tamaño fijo)
  fill(235, 225, 205);
  stroke(180, 170, 150);
  strokeWeight(2 * scaleRatio);
  
  // Base de la horquilla
  rect(-50 * scaleRatio, -80 * scaleRatio, 100 * scaleRatio, 20 * scaleRatio, 5 * scaleRatio);
  
  // Dos ganchos verticales
  rect(-35 * scaleRatio, -70 * scaleRatio, 12 * scaleRatio, 45 * scaleRatio, 4 * scaleRatio);
  rect(23 * scaleRatio, -70 * scaleRatio, 12 * scaleRatio, 45 * scaleRatio, 4 * scaleRatio);
  
  // Botón/switch de la horquilla
  if (!headsetLifted) {
    fill(200, 190, 170); // Presionado
  } else {
    fill(235, 225, 205); // Liberado
  }
  rect(-15 * scaleRatio, -65 * scaleRatio, 30 * scaleRatio, 8 * scaleRatio, 3 * scaleRatio);
  
  // Cable que conecta el headset con la base del teléfono (estilo retro en espiral)
  // DIBUJAR ANTES DE TRANSFORMAR EL HEADSET
  
  // Punto de anclaje en el headset (parte inferior del auricular izquierdo)
  // Este punto debe rotar con el headset
  let localAnchorX = -130 * scaleRatio; // Posición en el headset sin rotar
  let localAnchorY = 30 * scaleRatio; // Parte inferior del auricular (ajusta este valor)
  
  // Aplicar rotación manualmente para calcular la posición real
  let cosRot = cos(headsetRotation);
  let sinRot = sin(headsetRotation);
  
  // Punto de inicio (auricular izquierdo del headset con rotación aplicada)
  let cableStartX = headsetX + (localAnchorX * cosRot - localAnchorY * sinRot);
  let cableStartY = -80 * scaleRatio + headsetY + (localAnchorX * sinRot + localAnchorY * cosRot);
  
  // Punto de conexión en la parte trasera/arriba de la base del teléfono
  let cableEndX = -122 * scaleRatio;
  let cableEndY = -20 * scaleRatio;
  
  // Calcular distancia para determinar cuántas espirales dibujar
  let cableDist = dist(cableStartX, cableStartY, cableEndX, cableEndY);
  let numSpirals = int(cableDist / (25 * scaleRatio)); // Una espiral cada 25 unidades
  
  // Función para dibujar el cable en espiral
  function drawSpiralCable(strokeColor, weight) {
    noFill();
    stroke(strokeColor);
    strokeWeight(weight);
    
    beginShape();
    for (let i = 0; i <= numSpirals * 12; i++) {
      let t = i / (numSpirals * 12);
      
      // Posición base a lo largo del cable (curva bezier)
      let controlX1 = cableStartX - 100 * scaleRatio;
      let controlY1 = cableStartY + 200 * scaleRatio;
      let controlX2 = cableEndX - 300 * scaleRatio;
      let controlY2 = cableEndY + 200 * scaleRatio;
      
      // Punto en la curva bezier
      let x = bezierPoint(cableStartX, controlX1, controlX2, cableEndX, t);
      let y = bezierPoint(cableStartY, controlY1, controlY2, cableEndY, t);
      
      // Añadir ondulación en espiral perpendicular a la curva
      let spiralAngle = t * numSpirals * TWO_PI * 2; // 2 vueltas por segmento
      let spiralRadius = 8 * scaleRatio * sin(t * PI); // Amplitud variable (más en el centro)
      
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
  drawSpiralCable(color(180, 170, 150), 5.5 * scaleRatio);
  
  // Dibujar el cable crema encima (más delgado)
  drawSpiralCable(color(245, 240, 220), 4 * scaleRatio);
  
  // Headset en vista lateral (con escala dinámica)
  translate(0 + headsetX, -50 * scaleRatio + headsetY);
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

function drawVolumeControl(scaleRatio) {
  push();
  translate(width * 0.85, height * 0.75);
  
  // Fondo del control
  fill(255, 255, 255, 200);
  stroke(100);
  strokeWeight(2);
  rect(-80 * scaleRatio, -40 * scaleRatio, 160 * scaleRatio, 80 * scaleRatio, 10);
  
  // Título
  fill(60);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14 * scaleRatio);
  text("🔊 Volumen", 0, -30 * scaleRatio);
  
  // Barra del slider
  let sliderWidth = 120 * scaleRatio;
  let sliderHeight = 8 * scaleRatio;
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
  circle(handleX, sliderY + sliderHeight / 2, 20 * scaleRatio);
  
  fill(0, 150, 255);
  noStroke();
  circle(handleX, sliderY + sliderHeight / 2, 10 * scaleRatio);
  
  // Guardar posición del slider para detección de click
  this.volumeSliderBounds = {
    x: sliderX + width * 0.85,
    y: sliderY + height * 0.75,
    width: sliderWidth,
    height: sliderHeight + 20 * scaleRatio,
    centerX: width * 0.85,
    centerY: height * 0.75
  };
  
  // Valor del volumen
  textSize(12 * scaleRatio);
  fill(80);
  text(Math.round(masterVolume * 100) + "%", 0, 20 * scaleRatio);
  
  pop();
}

function drawEstadoInfo(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.90); // Movido más abajo de 0.88 a 0.90
  
  fill(255, 255, 255, 230);
  stroke(100);
  strokeWeight(2);
  rect(-250 * scaleRatio, -45 * scaleRatio, 500 * scaleRatio, 90 * scaleRatio, 10);
  
  fill(60);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16 * scaleRatio);
  
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
      statusText = currentPersonaje ? `Llamando a ${currentPersonaje.nombre}...` : "Llamando...";
      instruction = "Esperando respuesta...";
      statusColor = color(100, 0, 200);
      break;
    case STATES.CALLING_INTRO:
      statusText = currentPersonaje ? `Llamada con ${currentPersonaje.nombre}` : "En llamada";
      instruction = "Escucha la introducción...";
      statusColor = color(200, 0, 200);
      break;
    case STATES.CALLING_OPCIONES:
      statusText = currentPersonaje ? `${currentPersonaje.nombre} - Opciones ${opcionesPlayCount}/2` : `Opciones ${opcionesPlayCount}/2`;
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
  textSize(18 * scaleRatio);
  text(statusText, 0, -15 * scaleRatio);
  
  fill(100);
  textStyle(NORMAL);
  textSize(14 * scaleRatio);
  text(instruction, 0, 10 * scaleRatio);
  
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
      // Timeout - reproducir sonido de error
      console.log("Timeout: No se seleccionó opción en 5 segundos");
      changeState(STATES.ERROR);
      playErrorTone();
      optionTimer = 0;
    }
  } else {
    optionTimer = 0;
  }
}

function mousePressed() {
  startAudioContext();
  
  let scaleRatio = min(width / 1200, height / 800);
  
  // Click en toggle de estilo de teléfono
  if (styleToggleBounds) {
    if (mouseX > styleToggleBounds.leftX && mouseX < styleToggleBounds.rightX &&
        mouseY > styleToggleBounds.topY && mouseY < styleToggleBounds.bottomY) {
      // Determinar qué lado se clickeó
      if (mouseX < styleToggleBounds.midX) {
        phoneStyle = 'buttons';
      } else {
        phoneStyle = 'rotary';
      }
      console.log(`Estilo cambiado a: ${phoneStyle}`);
      return;
    }
  }
  
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
  let headsetWorldY = height * 0.42 - 50 * scaleRatio + headsetY;
  
  if (dist(mouseX, mouseY, headsetWorldX, headsetWorldY) < 130 * scaleRatio) {
    isDraggingHeadset = true;
    if (!headsetLifted) {
      toggleHeadset();
    }
    return;
  }
  
  // Para teléfono rotatorio: detectar click en disco
  if (phoneStyle === 'rotary' && headsetLifted) {
    let clickedNumber = handleRotaryClick(mouseX, mouseY);
    if (clickedNumber !== null) {
      isDraggingDial = true;
      currentDialNumber = clickedNumber;
      let dx = mouseX - rotaryDialBounds.x;
      let dy = mouseY - rotaryDialBounds.y;
      dialStartAngle = atan2(dy, dx) - rotaryAngle;
      return;
    }
  }
  
  // Click en botones del teclado (solo para phoneStyle === 'buttons')
  if (headsetLifted && phoneStyle === 'buttons') {
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
  // Arrastrar disco rotatorio
  if (isDraggingDial) {
    handleRotaryDrag();
    return;
  }
  
  if (isDraggingHeadset && headsetLifted) {
    let scaleRatio = min(width / 1200, height / 800);
    let baseX = width * 0.5;
    let baseY = height * 0.42 - 50 * scaleRatio;
    
    targetHeadsetX = mouseX - baseX;
    targetHeadsetY = mouseY - baseY;
    
    // Limitar el rango de movimiento (ampliado para alcanzar el rostro de la imagen)
    targetHeadsetX = constrain(targetHeadsetX, -300 * scaleRatio, 500 * scaleRatio);
    targetHeadsetY = constrain(targetHeadsetY, -400 * scaleRatio, 200 * scaleRatio);
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
  
  // Soltar disco rotatorio - animar regreso y marcar número
  if (isDraggingDial) {
    isDraggingDial = false;
    isReturning = true;
    
    // Animar regreso a posición inicial
    targetRotaryAngle = 0;
    
    // Después de un delay, registrar el número
    if (currentDialNumber !== null) {
      // Esperar a que termine la animación de regreso
      setTimeout(() => {
        if (currentState === STATES.DIAL_TONE || currentState === STATES.DIALING) {
          pressKey(currentDialNumber, 0, 0); // row y col no importan para rotatorio
        }
        currentDialNumber = null;
        isReturning = false;
      }, 500); // Tiempo de animación de regreso
    }
    return;
  }
  
  // Si el headset está levantado pero muy lejos, colgarlo
  if (headsetLifted) {
    let scaleRatio = min(width / 1200, height / 800);
    let baseX = width * 0.5;
    let baseY = height * 0.42 - 50 * scaleRatio;
    let currentX = baseX + headsetX;
    let currentY = baseY + headsetY;
    
    // Si está muy cerca de la posición original, colgar
    if (dist(currentX, currentY, baseX, baseY) < 30 * scaleRatio) {
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
          // Verificar que aún estamos en el estado correcto y el personaje es válido
          if (currentState === STATES.CALLING_RINGING && currentPersonajeIndex > 0 && currentPersonaje) {
            changeState(STATES.CALLING_INTRO);
            playIntroAudio();
          }
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
  
  // Validar que el personaje sea válido
  if (!currentPersonaje || currentPersonajeIndex < 1 || !personajeAudios[currentPersonajeIndex]) {
    console.error(`Error: Personaje inválido (index: ${currentPersonajeIndex})`);
    changeState(STATES.ERROR);
    playErrorTone();
    return;
  }
  
  console.log(`Reproduciendo introducción del personaje ${currentPersonajeIndex}`);
  
  // Reproducir audio real
  currentAudio = personajeAudios[currentPersonajeIndex].intro;
  currentAudio.setVolume(masterVolume);
  currentAudio.play();
  
  // Cuando termine la intro, reproducir audio de opciones
  currentAudio.onended(() => {
    if (currentState === STATES.CALLING_INTRO && currentPersonaje && currentPersonajeIndex > 0) {
      playOpcionesAudio();
    }
  });
}

function playOpcionesAudio() {
  // Validar que el personaje sea válido
  if (!currentPersonaje || currentPersonajeIndex < 1 || !personajeAudios[currentPersonajeIndex]) {
    console.error(`Error: Personaje inválido al reproducir opciones (index: ${currentPersonajeIndex})`);
    changeState(STATES.ERROR);
    playErrorTone();
    return;
  }
  
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
  
  // Validar que el personaje sea válido
  if (!currentPersonaje || currentPersonajeIndex < 1 || !personajeAudios[currentPersonajeIndex]) {
    console.error(`Error: Personaje inválido al reproducir tema (index: ${currentPersonajeIndex})`);
    changeState(STATES.ERROR);
    playErrorTone();
    return;
  }
  
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
  
  // Actualizar volumen del audio actual si está reproduciéndose
  if (currentAudio && currentAudio.isPlaying && currentAudio.isPlaying()) {
    currentAudio.setVolume(masterVolume);
  }
  
  // Actualizar volumen de sonidos del sistema
  if (pickupSound) pickupSound.setVolume(masterVolume);
  if (hangupSound) hangupSound.setVolume(masterVolume);
  if (errorCallSound) errorCallSound.setVolume(masterVolume);
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
