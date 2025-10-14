// ============================================
// VITRINA INTERACTIVA - MUSEO JUAN DEL CORRAL
// Sistema de narrativas secuenciales con iluminación dinámica
// ============================================

// Estados del sistema
const STATES = {
  IDLE: 'idle',
  DETECTING: 'detecting',
  PLAYING_NARRATIVE: 'playing',
  TRANSITIONING: 'transitioning',
  COOLDOWN: 'cooldown'
};

let currentState = STATES.IDLE;
let currentObjetoIndex = 0;
let detectionTimer = 0;
const DETECTION_THRESHOLD = 5000; // 5 segundos
const TRANSITION_DELAY = 2000; // 2 segundos entre narrativas
const COOLDOWN_DELAY = 5000; // 5 segundos después de terminar

// Configuración de objetos en la vitrina (3 objetos basados en audios reales)
const objetos = [
  {
    nombre: "Camisa Indígena",
    descripcion: "Ilustraciones de mapa",
    narrativa: null, // loadSound en preload()
    audioFile: "Camisa Indigena con ilustraciones de mapa.mp3",
    posX: 25,  // Porcentaje de posición en X (más espaciado)
    color: [180, 120, 80] // Color base del objeto
  },
  {
    nombre: "Máscara de los Diablitos",
    descripcion: "Celebración de diciembre",
    narrativa: null,
    audioFile: "Mascara de los diablitos celebracion de diciembre .mp3",
    posX: 50,
    color: [200, 50, 50] // Rojo para los diablitos
  },
  {
    nombre: "Muñeco Curandero",
    descripcion: "Cultura Cuna",
    narrativa: null,
    audioFile: "Muñeco curandero de la cultura cuna para los enfermos.mp3",
    posX: 75,
    color: [140, 100, 120]
  }
];

// Sistema de iluminación
let lights = [];
const LIGHT_IDLE = 0.25; // 25% intensidad en reposo
const LIGHT_ACTIVE = 0.65; // 65% intensidad al narrar

// Sensor de proximidad (simulado con mouse por ahora)
let proximityDetected = false;

// Audio
let currentAudio = null;
let masterVolume = 0.7;
let audioContextStarted = false;

// UI
let progressBar = 0;
let maxProgress = 0;

function preload() {
  // Cargar narrativas de objetos desde archivos MP3 reales
  console.log("Cargando archivos de audio...");
  
  for (let i = 0; i < objetos.length; i++) {
    let audioPath = `assets/sounds/${objetos[i].audioFile}`;
    console.log(`Cargando: ${audioPath}`);
    
    try {
      objetos[i].narrativa = loadSound(audioPath, 
        () => console.log(`✓ Audio ${i+1} cargado: ${objetos[i].nombre}`),
        (err) => console.error(`✗ Error cargando audio ${i+1}:`, err)
      );
    } catch(e) {
      console.error(`Error en preload para objeto ${i+1}:`, e);
    }
  }
  
  console.log(`Total de ${objetos.length} objetos configurados`);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Arial');
  
  // Inicializar sistema de luces
  for (let i = 0; i < objetos.length; i++) {
    lights.push({
      current: LIGHT_IDLE,  // Intensidad actual
      target: LIGHT_IDLE,   // Intensidad objetivo
      active: false   // Si está en transición
    });
  }
  
  console.log("=== VITRINA INTERACTIVA ===");
  console.log(`${objetos.length} objetos configurados`);
  console.log("Mueve el mouse sobre la vitrina para activar sensor");
}

function draw() {
  // Fondo oscuro de museo
  background(20, 20, 25);
  
  let scaleRatio = min(width / 1400, height / 900);
  
  // Dibujar vitrina
  drawVitrina(scaleRatio);
  
  // Dibujar objetos con iluminación
  drawObjetos(scaleRatio);
  
  // Dibujar bocina superior
  drawBocina(scaleRatio);
  
  // Dibujar sensor de proximidad (visual)
  drawProximitySensor(scaleRatio);
  
  // Dibujar barra de progreso de narrativa
  if (currentState === STATES.PLAYING_NARRATIVE) {
    drawProgressBar(scaleRatio);
  }
  
  // Dibujar estado del sistema
  drawEstadoInfo(scaleRatio);
  
  // Dibujar control de volumen
  drawVolumeControl(scaleRatio);
  
  // Actualizar lógica
  updateStateMachine();
  updateLights();
}

function drawVitrina(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.55);
  
  // Marco de vitrina (madera)
  fill(80, 60, 40);
  stroke(60, 45, 30);
  strokeWeight(12 * scaleRatio);
  rect(-620 * scaleRatio, -320 * scaleRatio, 1240 * scaleRatio, 640 * scaleRatio, 15);
  
  // Marco interior
  noFill();
  stroke(100, 80, 60);
  strokeWeight(8 * scaleRatio);
  rect(-600 * scaleRatio, -300 * scaleRatio, 1200 * scaleRatio, 600 * scaleRatio, 10);
  
  // Vidrio (semi-transparente con reflejos)
  fill(200, 220, 240, 20);
  noStroke();
  rect(-600 * scaleRatio, -300 * scaleRatio, 1200 * scaleRatio, 600 * scaleRatio, 10);
  
  // Reflejos en el vidrio
  fill(255, 255, 255, 10);
  rect(-590 * scaleRatio, -290 * scaleRatio, 300 * scaleRatio, 100 * scaleRatio, 5);
  
  // Base interna de la vitrina
  fill(50, 45, 40);
  noStroke();
  rect(-600 * scaleRatio, 100 * scaleRatio, 1200 * scaleRatio, 200 * scaleRatio);
  
  // Textura de terciopelo en la base
  for (let i = 0; i < 50; i++) {
    fill(45, 40, 35, random(50, 100));
    let x = random(-600, 600) * scaleRatio;
    let y = random(100, 300) * scaleRatio;
    ellipse(x, y, random(20, 50) * scaleRatio, random(10, 30) * scaleRatio);
  }
  
  pop();
}

function drawObjetos(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.60);
  
  for (let i = 0; i < objetos.length; i++) {
    let obj = objetos[i];
    let x = map(obj.posX, 0, 100, -450 * scaleRatio, 450 * scaleRatio);
    
    // Luz desde arriba (efecto de spotlight) - más amplia para 3 objetos
    let lightIntensity = lights[i].current;
    
    // Cono de luz con gradiente
    drawingContext.save();
    let gradient = drawingContext.createRadialGradient(
      x, -250 * scaleRatio, 0,
      x, -50 * scaleRatio, 120 * scaleRatio
    );
    gradient.addColorStop(0, `rgba(255, 255, 200, ${lightIntensity * 0.8})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 200, ${lightIntensity * 0.4})`);
    gradient.addColorStop(1, `rgba(255, 255, 200, 0)`);
    drawingContext.fillStyle = gradient;
    drawingContext.fillRect(
      x - 100 * scaleRatio,
      -250 * scaleRatio,
      200 * scaleRatio,
      300 * scaleRatio
    );
    drawingContext.restore();
    
    // Objeto (representación más grande para 3 objetos)
    push();
    translate(x, -30 * scaleRatio);
    
    // Sombra del objeto (más grande)
    fill(0, 0, 0, 100 + lightIntensity * 50);
    noStroke();
    ellipse(0, 70 * scaleRatio, 90 * scaleRatio, 25 * scaleRatio);
    
    // Objeto principal
    let [r, g, b] = obj.color;
    fill(
      r + lightIntensity * 75,
      g + lightIntensity * 75,
      b + lightIntensity * 75
    );
    stroke(100, 80, 60);
    strokeWeight(2 * scaleRatio);
    
    // Forma del objeto específica para cada uno
    if (i === 0) {
      // Camisa Indígena - forma de prenda
      rect(-40 * scaleRatio, -45 * scaleRatio, 80 * scaleRatio, 90 * scaleRatio, 8);
      // Cuello
      rect(-15 * scaleRatio, -45 * scaleRatio, 30 * scaleRatio, 15 * scaleRatio, 3);
      // Decoraciones (líneas de mapa)
      stroke(80, 60, 40);
      strokeWeight(1);
      for(let j = 0; j < 5; j++) {
        line(-30 * scaleRatio, (-30 + j * 15) * scaleRatio, 30 * scaleRatio, (-30 + j * 15) * scaleRatio);
      }
    } else if (i === 1) {
      // Máscara de diablitos - forma de máscara
      fill(r + lightIntensity * 75, g + lightIntensity * 75, b + lightIntensity * 75);
      ellipse(0, -10 * scaleRatio, 70 * scaleRatio, 80 * scaleRatio);
      // Cuernos
      triangle(-35 * scaleRatio, -50 * scaleRatio, -25 * scaleRatio, -30 * scaleRatio, -20 * scaleRatio, -50 * scaleRatio);
      triangle(35 * scaleRatio, -50 * scaleRatio, 25 * scaleRatio, -30 * scaleRatio, 20 * scaleRatio, -50 * scaleRatio);
      // Ojos
      fill(0);
      ellipse(-15 * scaleRatio, -15 * scaleRatio, 10 * scaleRatio, 15 * scaleRatio);
      ellipse(15 * scaleRatio, -15 * scaleRatio, 10 * scaleRatio, 15 * scaleRatio);
    } else {
      // Muñeco Curandero - forma de muñeco
      fill(r + lightIntensity * 75, g + lightIntensity * 75, b + lightIntensity * 75);
      // Cabeza
      ellipse(0, -20 * scaleRatio, 40 * scaleRatio, 40 * scaleRatio);
      // Cuerpo
      rect(-25 * scaleRatio, 0, 50 * scaleRatio, 60 * scaleRatio, 5);
      // Brazos
      rect(-40 * scaleRatio, 10 * scaleRatio, 15 * scaleRatio, 30 * scaleRatio, 3);
      rect(25 * scaleRatio, 10 * scaleRatio, 15 * scaleRatio, 30 * scaleRatio, 3);
    }
    
    // Brillo si está activo
    if (lights[i].target === LIGHT_ACTIVE) {
      fill(255, 255, 200, lightIntensity * 100);
      noStroke();
      ellipse(0, -20 * scaleRatio, 50 * scaleRatio, 50 * scaleRatio);
    }
    
    // Etiqueta del objeto (texto más grande)
    fill(220, 220, 220, 100 + lightIntensity * 155);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(13 * scaleRatio);
    textStyle(BOLD);
    text(obj.nombre, 0, 60 * scaleRatio);
    
    textSize(11 * scaleRatio);
    textStyle(NORMAL);
    fill(180, 180, 180, 80 + lightIntensity * 120);
    text(obj.descripcion, 0, 78 * scaleRatio);
    
    pop();
  }
  
  pop();
}

function drawBocina(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.25);
  
  // Bocina superior (representación visual)
  fill(40, 40, 45);
  stroke(60, 60, 70);
  strokeWeight(3 * scaleRatio);
  
  // Cuerpo de la bocina
  rect(-80 * scaleRatio, -20 * scaleRatio, 160 * scaleRatio, 40 * scaleRatio, 10);
  
  // Rejilla de altavoz
  fill(20, 20, 25);
  noStroke();
  for (let i = 0; i < 15; i++) {
    let x = map(i, 0, 14, -70, 70) * scaleRatio;
    rect(x, -15 * scaleRatio, 3 * scaleRatio, 30 * scaleRatio, 2);
  }
  
  // Indicador LED de actividad
  if (currentState === STATES.PLAYING_NARRATIVE) {
    fill(0, 255, 100);
    noStroke();
    ellipse(70 * scaleRatio, 0, 8 * scaleRatio, 8 * scaleRatio);
    
    // Glow del LED
    fill(0, 255, 100, 50);
    ellipse(70 * scaleRatio, 0, 16 * scaleRatio, 16 * scaleRatio);
  } else {
    fill(100, 100, 100);
    noStroke();
    ellipse(70 * scaleRatio, 0, 6 * scaleRatio, 6 * scaleRatio);
  }
  
  // Texto indicativo si está reproduciendo
  if (currentState === STATES.PLAYING_NARRATIVE) {
    fill(200, 200, 200);
    textAlign(CENTER, CENTER);
    textSize(12 * scaleRatio);
    textStyle(ITALIC);
    text("🔊 Reproduciendo...", 0, 35 * scaleRatio);
  }
  
  pop();
}

function drawProximitySensor(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.15);
  
  // Fondo del indicador
  fill(40, 40, 45, 200);
  stroke(80, 80, 90);
  strokeWeight(2);
  rect(-100 * scaleRatio, -30 * scaleRatio, 200 * scaleRatio, 60 * scaleRatio, 10);
  
  // Indicador de detección
  if (proximityDetected) {
    fill(0, 255, 100);
    // Animación de pulso
    let pulseSize = 30 + sin(frameCount * 0.2) * 5;
    noStroke();
    ellipse(0, 0, pulseSize * scaleRatio, pulseSize * scaleRatio);
  } else {
    fill(100, 100, 100);
    noStroke();
    ellipse(0, 0, 25 * scaleRatio, 25 * scaleRatio);
  }
  
  // Texto del sensor
  fill(proximityDetected ? 200 : 150);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12 * scaleRatio);
  textStyle(BOLD);
  
  if (currentState === STATES.DETECTING) {
    let progress = Math.floor((detectionTimer / (DETECTION_THRESHOLD / 16.67)) * 5);
    text(`👤 DETECTANDO (${progress}/5)`, 0, 30 * scaleRatio);
  } else if (proximityDetected) {
    text("👤 VISITANTE DETECTADO", 0, 30 * scaleRatio);
  } else {
    text("👁️ ESPERANDO VISITANTE", 0, 30 * scaleRatio);
  }
  
  pop();
}

function drawProgressBar(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.35);
  
  // Fondo de la barra
  fill(40, 40, 45);
  stroke(80, 80, 90);
  strokeWeight(2);
  rect(-300 * scaleRatio, -15 * scaleRatio, 600 * scaleRatio, 30 * scaleRatio, 15);
  
  // Progreso (simular progreso basado en tiempo)
  fill(0, 200, 255);
  noStroke();
  let progress = map(frameCount % 180, 0, 180, 0, 600 * scaleRatio);
  rect(-300 * scaleRatio, -15 * scaleRatio, progress, 30 * scaleRatio, 15);
  
  // Texto del objeto actual
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(13 * scaleRatio);
  textStyle(BOLD);
  text(objetos[currentObjetoIndex].nombre, 0, 0);
  
  pop();
}

function drawEstadoInfo(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.88);
  
  // Fondo
  fill(0, 0, 0, 200);
  stroke(100);
  strokeWeight(2);
  rect(-350 * scaleRatio, -50 * scaleRatio, 700 * scaleRatio, 100 * scaleRatio, 10);
  
  // Estado actual
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16 * scaleRatio);
  
  let statusText = "";
  let statusColor = color(200, 200, 200);
  
  switch(currentState) {
    case STATES.IDLE:
      statusText = "💤 Sistema en espera - Acércate a la vitrina";
      statusColor = color(150, 150, 150);
      break;
    case STATES.DETECTING:
      let timeLeft = Math.ceil((DETECTION_THRESHOLD - detectionTimer * 16.67) / 1000);
      statusText = `⏱️ Detectando presencia (${5 - timeLeft}/5 segundos)`;
      statusColor = color(255, 200, 0);
      break;
    case STATES.PLAYING_NARRATIVE:
      statusText = `🎭 Narrativa ${currentObjetoIndex + 1}/${objetos.length}: "${objetos[currentObjetoIndex].nombre}"`;
      statusColor = color(0, 255, 100);
      break;
    case STATES.TRANSITIONING:
      statusText = `⏩ Cambiando a siguiente objeto (${currentObjetoIndex + 1}/${objetos.length})`;
      statusColor = color(100, 150, 255);
      break;
    case STATES.COOLDOWN:
      statusText = "✅ Secuencia completada - Alejándose...";
      statusColor = color(100, 200, 100);
      break;
  }
  
  fill(statusColor);
  textStyle(BOLD);
  text(statusText, 0, -10 * scaleRatio);
  
  // Instrucción
  fill(180);
  textStyle(NORMAL);
  textSize(13 * scaleRatio);
  let instruction = currentState === STATES.IDLE ? 
    "Simula el sensor moviendo el mouse sobre la vitrina" :
    "La secuencia se reproduce automáticamente";
  text(instruction, 0, 15 * scaleRatio);
  
  pop();
}

function drawVolumeControl(scaleRatio) {
  push();
  translate(width * 0.90, height * 0.75);
  
  // Fondo del control
  fill(255, 255, 255, 200);
  stroke(100);
  strokeWeight(2);
  rect(-80 * scaleRatio, -40 * scaleRatio, 160 * scaleRatio, 80 * scaleRatio, 10);
  
  // Título
  fill(60);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12 * scaleRatio);
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
  
  // Valor del volumen
  textSize(11 * scaleRatio);
  fill(80);
  text(Math.round(masterVolume * 100) + "%", 0, 18 * scaleRatio);
  
  pop();
}

function updateStateMachine() {
  switch(currentState) {
    case STATES.IDLE:
      // Esperar detección de proximidad
      if (proximityDetected) {
        changeState(STATES.DETECTING);
        detectionTimer = 0;
      }
      break;
      
    case STATES.DETECTING:
      detectionTimer++;
      if (detectionTimer > DETECTION_THRESHOLD / 16.67) {
        // Iniciar secuencia
        currentObjetoIndex = 0;
        changeState(STATES.PLAYING_NARRATIVE);
        playNarrativa(currentObjetoIndex);
      }
      if (!proximityDetected) {
        // Usuario se fue, cancelar
        changeState(STATES.IDLE);
        detectionTimer = 0;
      }
      break;
      
    case STATES.PLAYING_NARRATIVE:
      // El audio tiene callback .onended()
      break;
      
    case STATES.TRANSITIONING:
      // Esperar transición controlada por setTimeout
      break;
      
    case STATES.COOLDOWN:
      // Esperar cooldown controlado por setTimeout
      break;
  }
}

function updateLights() {
  // Animación suave de intensidad de luz (lerp)
  for (let i = 0; i < lights.length; i++) {
    lights[i].current = lerp(lights[i].current, lights[i].target, 0.05);
  }
}

function playNarrativa(index) {
  console.log(`=== Reproduciendo narrativa ${index + 1}/${objetos.length} ===`);
  console.log(`Objeto: ${objetos[index].nombre}`);
  
  // Apagar todas las luces
  for (let i = 0; i < lights.length; i++) {
    lights[i].target = LIGHT_IDLE;
  }
  
  // Encender luz del objeto actual
  lights[index].target = LIGHT_ACTIVE;
  
  // Reproducir audio
  currentAudio = objetos[index].narrativa;
  currentAudio.setVolume(masterVolume);
  currentAudio.play();
  
  // Callback cuando termine
  currentAudio.onended(() => {
    handleNarrativaEnded();
  });
}

function handleNarrativaEnded() {
  console.log(`Narrativa ${currentObjetoIndex + 1} terminada`);
  
  // Verificar si hay más objetos
  if (currentObjetoIndex < objetos.length - 1) {
    // Transición al siguiente
    changeState(STATES.TRANSITIONING);
    
    setTimeout(() => {
      if (currentState === STATES.TRANSITIONING) {
        currentObjetoIndex++;
        changeState(STATES.PLAYING_NARRATIVE);
        playNarrativa(currentObjetoIndex);
      }
    }, TRANSITION_DELAY);
  } else {
    // Todas las narrativas completadas
    console.log("=== Secuencia completa terminada ===");
    changeState(STATES.COOLDOWN);
    
    // Apagar todas las luces gradualmente
    setTimeout(() => {
      for (let i = 0; i < lights.length; i++) {
        lights[i].target = LIGHT_IDLE;
      }
      
      // Volver a IDLE después del cooldown
      setTimeout(() => {
        changeState(STATES.IDLE);
        currentObjetoIndex = 0;
        console.log("Sistema listo para nueva secuencia");
      }, COOLDOWN_DELAY);
    }, 1000);
  }
}

function changeState(newState) {
  console.log(`Estado: ${currentState} -> ${newState}`);
  currentState = newState;
}

// === INTERACCIÓN DEL USUARIO ===

function mouseMoved() {
  // Simular sensor de proximidad con posición del mouse
  // Si el mouse está sobre la vitrina, activar sensor
  let scaleRatio = min(width / 1400, height / 900);
  let vitrineLeft = width * 0.5 - 600 * scaleRatio;
  let vitrineRight = width * 0.5 + 600 * scaleRatio;
  let vitrineTop = height * 0.55 - 300 * scaleRatio;
  let vitrineBottom = height * 0.55 + 300 * scaleRatio;
  
  if (mouseX > vitrineLeft && mouseX < vitrineRight &&
      mouseY > vitrineTop && mouseY < vitrineBottom) {
    proximityDetected = true;
  } else {
    proximityDetected = false;
  }
}

function mousePressed() {
  // Activar contexto de audio
  if (!audioContextStarted) {
    userStartAudio().then(() => {
      audioContextStarted = true;
      console.log("Audio context iniciado");
    });
  }
  
  // Control de volumen
  let scaleRatio = min(width / 1400, height / 900);
  let sliderCenterX = width * 0.90;
  let sliderCenterY = height * 0.75;
  let sliderWidth = 120 * scaleRatio;
  
  let dx = mouseX - sliderCenterX;
  let dy = mouseY - sliderCenterY;
  
  if (abs(dx) < sliderWidth / 2 && abs(dy) < 40 * scaleRatio) {
    let newVolume = (dx + sliderWidth / 2) / sliderWidth;
    masterVolume = constrain(newVolume, 0, 1);
    if (currentAudio) {
      currentAudio.setVolume(masterVolume);
    }
  }
}

function mouseDragged() {
  // Actualizar volumen mientras se arrastra
  let scaleRatio = min(width / 1400, height / 900);
  let sliderCenterX = width * 0.90;
  let sliderCenterY = height * 0.75;
  let sliderWidth = 120 * scaleRatio;
  
  let dx = mouseX - sliderCenterX;
  let dy = mouseY - sliderCenterY;
  
  if (abs(dy) < 60 * scaleRatio) {
    let newVolume = (dx + sliderWidth / 2) / sliderWidth;
    masterVolume = constrain(newVolume, 0, 1);
    if (currentAudio) {
      currentAudio.setVolume(masterVolume);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Touch support para móvil
function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseMoved();
  mouseDragged();
  return false;
}
