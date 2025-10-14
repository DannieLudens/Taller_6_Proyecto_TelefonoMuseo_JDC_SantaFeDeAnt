// ============================================
// SIMULADOR DE TELÉFONO - MUSEO JUAN DEL CORRAL
// Archivo Principal (Coordinador)
// ============================================

// NOTA: Las variables globales están definidas en los módulos individuales
// Este archivo solo contiene las funciones principales de p5.js

/**
 * Precarga todos los assets (imágenes y audios)
 */
function preload() {
  // Cargar imágenes de persona
  personaRostro = loadImage('assets/images/persona_rostro.png');
  personaMano = loadImage('assets/images/persona_mano.png');
  
  // Cargar audios del sistema
  pickupSound = loadSound('assets/sounds/pickup_phone.mp3');
  hangupSound = loadSound('assets/sounds/hangup_phone.mp3');
  errorCallSound = loadSound('assets/sounds/error_call_phone.mp3');
  
  // Cargar audios de personajes
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

/**
 * Configuración inicial
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Crear fondo de madera
  createWoodBackground();
  
  // Crear osciladores de audio
  createDTMFOscillators();
  createSystemTones();
  
  // Inicializar posición del headset
  headsetX = 0;
  headsetY = 0;
  targetHeadsetX = 0;
  targetHeadsetY = 0;
  
  // Configurar fuente
  textFont('Arial');
}

/**
 * Loop principal de dibujo
 */
function draw() {
  // Fondo de madera
  image(woodBackground, 0, 0);
  
  // Escala responsive
  let scaleRatio = min(width / 1200, height / 800);
  
  // ==== FADE DE PERSONA ====
  let targetAlpha = headsetLifted ? 255 : 0;
  earAlpha = lerp(earAlpha, targetAlpha, 0.08);
  
  // === CAPA 1: Rostro de la persona ===
  if (personaRostro && earAlpha > 5) {
    push();
    translate(width * 0.80, height * 0.35);
    let imgScale = scaleRatio * 0.6;
    
    tint(255, earAlpha);
    
    // Máscara con bordes redondeados
    drawingContext.save();
    let maskWidth = personaRostro.width * imgScale;
    let maskHeight = personaRostro.height * imgScale;
    let cornerRadius = 30 * scaleRatio;
    
    drawingContext.beginPath();
    drawingContext.roundRect(-maskWidth/2, -maskHeight/2, maskWidth, maskHeight, cornerRadius);
    drawingContext.clip();
    
    imageMode(CENTER);
    image(personaRostro, 0, 0, maskWidth, maskHeight);
    drawingContext.restore();
    pop();
  }
  
  // === CAPA 2: Teléfono y componentes ===
  drawDirectorio(scaleRatio);
  drawSettingsButton(scaleRatio);
  drawSettingsPanel(scaleRatio);
  drawTelefono(scaleRatio);
  drawCallToAction(scaleRatio);
  
  // === CAPA 3: Mano de la persona (encima de todo) ===
  if (personaMano && earAlpha > 5) {
    push();
    translate(width * 0.80, height * 0.35);
    let imgScale = scaleRatio * 0.6;
    tint(255, earAlpha);
    imageMode(CENTER);
    image(personaMano, 0, 0, personaMano.width * imgScale, personaMano.height * imgScale);
    pop();
  }
  
  // Información de estado (última capa)
  drawEstadoInfo(scaleRatio);
  
  // ==== TIMERS ====
  // Timer de opciones
  if (currentState === STATES.WAITING_OPTION) {
    optionTimer++;
    if (optionTimer > OPTION_TIMEOUT / 16.67) {
      console.log("Timeout de opciones alcanzado");
      hangUp();
    }
  }
  
  // Timer de auto-hangup (solo en BUSY, ERROR ya no auto-cuelga)
  if (currentState === STATES.BUSY) {
    autoHangupTimer++;
    if (autoHangupTimer > AUTO_HANGUP_TIME / 16.67) {
      hangUp();
    }
  }
}

/**
 * Maneja resize de la ventana
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createWoodBackground(); // Recrear fondo con nuevo tamaño
}
