// ============================================
// UI-VITRINA.JS - Dibujo de vitrinas y bases
// ============================================

// Variable de layout actual
let currentLayout = LAYOUTS.INDIVIDUAL;

/**
 * Dibuja la vitrina según el layout seleccionado
 * @param {number} scaleRatio - Factor de escala responsive
 */
function drawVitrina(scaleRatio) {
  switch(currentLayout) {
    case LAYOUTS.INDIVIDUAL:
      drawVitrineLayout1(scaleRatio);
      break;
    case LAYOUTS.HORIZONTAL:
      drawVitrineLayout2(scaleRatio);
      break;
    case LAYOUTS.LEVELS:
      drawVitrineLayout3(scaleRatio);
      break;
  }
}

/**
 * Layout 1: Tres vitrinas individuales separadas
 * @param {number} scaleRatio - Factor de escala
 */
function drawVitrineLayout1(scaleRatio) {
  push();
  
  // Dibujar cada vitrina individual (MÁS SEPARADAS)
  for (let i = 0; i < objetos.length; i++) {
    let x = map(objetos[i].posX, 0, 100, -550 * scaleRatio, 550 * scaleRatio);  // Aumentado de -450 a -550
    
    push();
    translate(width * 0.5 + x, height * 0.55);
    
    // Base blanca (rectángulo vertical del mismo ancho que vidrio)
    let baseWidth = 200 * scaleRatio;
    let baseHeight = 350 * scaleRatio;
    let baseY = 40 * scaleRatio;
    
    // Sombra de la base
    noStroke();
    fill(COLORS.SHADOW);
    rect(-baseWidth/2 + 5 * scaleRatio, baseY + 5 * scaleRatio, baseWidth, baseHeight);
    
    // Dibujar la base
    fill(COLORS.BASE_WHITE);
    stroke(COLORS.TEXT_SECONDARY);
    strokeWeight(2 * scaleRatio);
    rect(-baseWidth/2, baseY, baseWidth, baseHeight);
    
    // Vitrina de vidrio (encima de la base)
    let glassWidth = baseWidth;
    let glassHeight = 280 * scaleRatio;
    let glassY = baseY - glassHeight;
    
    // Marco del vidrio
    stroke(COLORS.WOOD_LIGHT);
    strokeWeight(8 * scaleRatio);
    noFill();
    rect(-glassWidth/2, glassY, glassWidth, glassHeight, 5);
    
    // Vidrio semi-transparente
    fill(COLORS.GLASS);
    noStroke();
    rect(-glassWidth/2, glassY, glassWidth, glassHeight, 5);
    
    // Reflejos en el vidrio
    fill(255, 255, 255, 30);
    rect(-glassWidth/2 + 10 * scaleRatio, glassY + 10 * scaleRatio, 
         glassWidth * 0.3, glassHeight * 0.2, 3);
    
    // LED superior (dentro del vidrio, cerca del borde superior)
    drawLED(0, glassY + 30 * scaleRatio, i, scaleRatio);
    
    // Bocina indicadora (encima del rectángulo blanco, ajustada 22px abajo)
    let indicatorY = baseY;  // Justo en el borde superior de la base (Y=40)
    drawVitrineIndicator(0, indicatorY + 22 * scaleRatio, i, scaleRatio, 0.625);
    
    pop();
  }
  
  pop();
}

/**
 * Layout 2: Vitrina alargada horizontal compartida
 * @param {number} scaleRatio - Factor de escala
 */
function drawVitrineLayout2(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.55);
  
  // Base blanca alargada (REDUCIDA)
  let baseWidth = 850 * scaleRatio;  // Reducido de 1000 a 850
  let baseHeight = 350 * scaleRatio;
  let baseY = 50 * scaleRatio;
  
  // Sombra
  noStroke();
  fill(COLORS.SHADOW);
  rect(-baseWidth/2 + 5 * scaleRatio, baseY + 5 * scaleRatio, baseWidth, baseHeight);
  
  // Base
  fill(COLORS.BASE_WHITE);
  stroke(COLORS.TEXT_SECONDARY);
  strokeWeight(2 * scaleRatio);
  rect(-baseWidth/2, baseY, baseWidth, baseHeight);
  
  // Vitrina de vidrio alargada
  let glassHeight = 280 * scaleRatio;
  let glassY = baseY - glassHeight;
  
  // Marco
  stroke(COLORS.WOOD_LIGHT);
  strokeWeight(8 * scaleRatio);
  noFill();
  rect(-baseWidth/2, glassY, baseWidth, glassHeight, 5);
  
  // Vidrio
  fill(COLORS.GLASS);
  noStroke();
  rect(-baseWidth/2, glassY, baseWidth, glassHeight, 5);
  
  // Reflejos
  fill(255, 255, 255, 30);
  rect(-baseWidth/2 + 20 * scaleRatio, glassY + 15 * scaleRatio, 
       baseWidth * 0.25, glassHeight * 0.15, 3);
  
  // LEDs individuales para cada objeto (dentro del vidrio)
  for (let i = 0; i < objetos.length; i++) {
    let ledX = map(objetos[i].posX, 0, 100, -350 * scaleRatio, 350 * scaleRatio);
    drawLED(ledX, glassY + 30 * scaleRatio, i, scaleRatio);
  }
  
  // Bocina indicadora compartida (encima del rectángulo blanco, en el borde superior)
  let indicatorY = baseY;  // Justo en el borde superior de la base
  drawVitrineIndicator(0, indicatorY + 24 * scaleRatio, -1, scaleRatio, 0.75);
  
  pop();
}

/**
 * Layout 3: Vitrina con niveles diferentes
 * @param {number} scaleRatio - Factor de escala
 */
function drawVitrineLayout3(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.55);
  
  // Base blanca
  let baseWidth = 800 * scaleRatio;
  let baseHeight = 350 * scaleRatio;
  let baseY = 50 * scaleRatio;
  
  // Sombra
  noStroke();
  fill(COLORS.SHADOW);
  rect(-baseWidth/2 + 5 * scaleRatio, baseY + 5 * scaleRatio, baseWidth, baseHeight);
  
  // Base
  fill(COLORS.BASE_WHITE);
  stroke(COLORS.TEXT_SECONDARY);
  strokeWeight(2 * scaleRatio);
  rect(-baseWidth/2, baseY, baseWidth, baseHeight);
  
  // Vitrina de vidrio
  let glassHeight = 320 * scaleRatio;
  let glassY = baseY - glassHeight;
  
  // Marco
  stroke(COLORS.WOOD_LIGHT);
  strokeWeight(8 * scaleRatio);
  noFill();
  rect(-baseWidth/2, glassY, baseWidth, glassHeight, 5);
  
  // Vidrio
  fill(COLORS.GLASS);
  noStroke();
  rect(-baseWidth/2, glassY, baseWidth, glassHeight, 5);
  
  // Reflejos
  fill(255, 255, 255, 30);
  rect(-baseWidth/2 + 15 * scaleRatio, glassY + 12 * scaleRatio, 
       baseWidth * 0.3, glassHeight * 0.18, 3);
  
  // LEDs para cada objeto (dentro del vidrio, cerca del borde superior)
  for (let i = 0; i < objetos.length; i++) {
    let ledX = map(objetos[i].posX, 0, 100, -350 * scaleRatio, 350 * scaleRatio);
    drawLED(ledX, glassY + 30 * scaleRatio, i, scaleRatio);
  }
  
  // Bocina indicadora compartida (encima del rectángulo blanco, en el borde superior)
  let indicatorY = baseY;  // Justo en el borde superior de la base
  drawVitrineIndicator(0, indicatorY + 24 * scaleRatio, -1, scaleRatio, 0.75);
  
  pop();
}

/**
 * Dibuja un LED individual con su haz de luz
 * @param {number} x - Posición X
 * @param {number} y - Posición Y
 * @param {number} index - Índice del objeto
 * @param {number} scaleRatio - Factor de escala
 */
function drawLED(x, y, index, scaleRatio) {
  push();
  translate(x, y);
  
  // Cuerpo del LED (comportamiento original: amarillo/blanco según intensidad)
  let ledIntensity = lights[index].current;
  fill(ledIntensity * 255, ledIntensity * 255, ledIntensity * 200);
  noStroke();
  ellipse(0, 0, 15 * scaleRatio, 15 * scaleRatio);
  
  // Glow del LED
  if (ledIntensity > 0.3) {
    fill(255, 255, 200, ledIntensity * 100);
    ellipse(0, 0, 25 * scaleRatio, 25 * scaleRatio);
  }
  
  // Soporte del LED
  fill(COLORS.WOOD_DARK);
  rect(-8 * scaleRatio, -3 * scaleRatio, 16 * scaleRatio, 6 * scaleRatio, 2);
  
  pop();
}

/**
 * Dibuja una bocina indicadora en la vitrina
 * @param {number} x - Posición X (centro)
 * @param {number} y - Posición Y (centro)
 * @param {number} vitrineIndex - Índice de vitrina (-1 para vitrina compartida)
 * @param {number} scaleRatio - Factor de escala
 * @param {number} sizeScale - Escala de tamaño (0.625 para individuales, 0.75 para compartidas)
 */
function drawVitrineIndicator(x, y, vitrineIndex, scaleRatio, sizeScale = 0.625) {
  push();
  translate(x, y);
  
  // Dimensiones escaladas
  let width = 160 * scaleRatio * sizeScale;
  let height = 40 * scaleRatio * sizeScale;
  let ledX = 70 * scaleRatio * sizeScale;
  
  // Cuerpo de la bocina
  fill(40, 40, 45);
  stroke(60, 60, 70);
  strokeWeight(2 * scaleRatio * sizeScale);
  rect(-width/2, -height/2, width, height, 8 * sizeScale);
  
  // Rejilla de altavoz
  fill(20, 20, 25);
  noStroke();
  let gridWidth = 140 * scaleRatio * sizeScale;
  for (let i = 0; i < 15; i++) {
    let lineX = map(i, 0, 14, -gridWidth/2, gridWidth/2);
    let lineHeight = 30 * scaleRatio * sizeScale;
    rect(lineX, -lineHeight/2, 2 * scaleRatio * sizeScale, lineHeight, 2);
  }
  
  // Determinar estado del LED para esta vitrina
  let isDetecting = false;
  let isPlaying = false;
  
  if (vitrineIndex >= 0) {
    // Vitrina individual
    if (currentLayout === LAYOUTS.INDIVIDUAL) {
      isDetecting = (currentState === STATES.DETECTING && detectedVitrineIndex === vitrineIndex);
      isPlaying = (currentState === STATES.PLAYING_NARRATIVE && currentObjetoIndex === vitrineIndex);
    }
  } else {
    // Vitrina compartida (Horizontal o Niveles)
    isDetecting = (currentState === STATES.DETECTING && proximityDetected);
    isPlaying = (currentState === STATES.PLAYING_NARRATIVE);
  }
  
  // Dibujar LED según estado
  if (isPlaying) {
    // Verde estático cuando reproduce
    fill(0, 255, 100);
    noStroke();
    ellipse(ledX, 0, 8 * scaleRatio * sizeScale, 8 * scaleRatio * sizeScale);
    
    // Glow del LED
    fill(0, 255, 100, 80);
    ellipse(ledX, 0, 16 * scaleRatio * sizeScale, 16 * scaleRatio * sizeScale);
  } else if (isDetecting) {
    // Verde parpadeante cuando detecta
    let pulse = sin(frameCount * 0.1) * 0.5 + 0.5;
    fill(0, 255, 100, 150 + pulse * 105);
    noStroke();
    ellipse(ledX, 0, 8 * scaleRatio * sizeScale, 8 * scaleRatio * sizeScale);
    
    // Glow parpadeante
    fill(0, 255, 100, 30 + pulse * 50);
    ellipse(ledX, 0, (12 + pulse * 8) * sizeScale, (12 + pulse * 8) * sizeScale);
  } else {
    // Gris cuando inactivo
    fill(100, 100, 100);
    noStroke();
    ellipse(ledX, 0, 6 * scaleRatio * sizeScale, 6 * scaleRatio * sizeScale);
  }
  
  pop();
}

/**
 * Cambia el layout de la vitrina
 * @param {number} newLayout - Nuevo layout (LAYOUTS.*)
 */
function setLayout(newLayout) {
  if (newLayout >= 1 && newLayout <= 3) {
    currentLayout = newLayout;
    console.log(`Layout cambiado a: ${newLayout}`);
  }
}
