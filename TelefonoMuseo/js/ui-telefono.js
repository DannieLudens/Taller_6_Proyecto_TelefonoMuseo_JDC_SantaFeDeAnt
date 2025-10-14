// ============================================
// UI - COMPONENTES DEL TELÉFONO
// ============================================

// ====== VARIABLES GLOBALES ======

// Sistema de estilos de teléfono
let phoneStyle = 'buttons'; // 'buttons' o 'rotary'
let styleToggleBounds = null; // Bounds del botón toggle

// Variables del teclado numérico
let keypadButtons = [];

// Variables del disco rotatorio
let rotaryAngle = 0; // Ángulo actual del disco
let targetRotaryAngle = 0; // Ángulo objetivo
let isDraggingDial = false; // Si está arrastrando el disco
let dialStartAngle = 0; // Ángulo donde empezó el arrastre
let currentDialNumber = -1; // Número actual siendo marcado
let isReturning = false; // Si el disco está volviendo a la posición inicial
let rotaryDialBounds = null; // Bounds del disco rotatorio

// ====== FUNCIONES PRINCIPALES ======

/**
 * Dispatcher principal - decide qué estilo de teléfono dibujar
 * @param {number} scaleRatio - Escala responsive
 */
function drawTelefono(scaleRatio) {
  if (phoneStyle === 'buttons') {
    drawTelefonoButtons(scaleRatio);
  } else if (phoneStyle === 'rotary') {
    drawTelefonoRotary(scaleRatio);
  }
}

// ====== TELÉFONO DE BOTONES (ESTILO 1980s) ======

/**
 * Dibuja el teléfono de botones estilo 1980s
 * @param {number} scaleRatio - Escala responsive
 */
function drawTelefonoButtons(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.42);
  
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
  
  // Sombra inferior para dar profundidad
  fill(220, 210, 190);
  noStroke();
  beginShape();
  vertex(-138.6 * scaleRatio + cornerRadius, 303 * scaleRatio);
  vertex(138.6 * scaleRatio - cornerRadius, 303 * scaleRatio);
  quadraticVertex(138.6 * scaleRatio, 303 * scaleRatio, 138.6 * scaleRatio + 2 * scaleRatio, 303 * scaleRatio + cornerRadius);
  vertex(140 * scaleRatio - 2 * scaleRatio, 320 * scaleRatio - cornerRadius);
  quadraticVertex(140 * scaleRatio, 320 * scaleRatio, 140 * scaleRatio - cornerRadius, 320 * scaleRatio);
  vertex(-140 * scaleRatio + cornerRadius, 320 * scaleRatio);
  quadraticVertex(-140 * scaleRatio, 320 * scaleRatio, -140 * scaleRatio + 2 * scaleRatio, 320 * scaleRatio - cornerRadius);
  vertex(-138.6 * scaleRatio - 2 * scaleRatio, 303 * scaleRatio + cornerRadius);
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
  
  // Dibujar headset y horquilla
  drawHeadset(scaleRatio);
  
  pop();
}

/**
 * Dibuja el teclado numérico (0-9, *, #)
 * @param {number} scaleRatio - Escala responsive
 */
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
      
      // Botón principal - color oscuro
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
      fill(255);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(18 * scaleRatio);
      textStyle(BOLD);
      text(label, 0, 0);
      
      pop();
    }
  }
}

// ====== TELÉFONO ROTATORIO (ESTILO 1950s-60s) ======

/**
 * Dibuja el teléfono rotatorio vintage
 * @param {number} scaleRatio - Escala responsive
 */
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
  
  // Dibujar headset y horquilla
  drawHeadset(scaleRatio);
  
  pop();
}

/**
 * Dibuja el disco rotatorio para marcar números
 * @param {number} scaleRatio - Escala responsive
 */
function drawRotaryDial(scaleRatio) {
  let centerX = 0;
  let centerY = 160 * scaleRatio;
  let outerRadius = 110 * scaleRatio;
  let innerRadius = 35 * scaleRatio;
  
  // Animar rotación
  rotaryAngle = lerp(rotaryAngle, targetRotaryAngle, 0.15);
  
  push();
  translate(centerX, centerY);
  
  // ==== PARTE ROTATIVA (números y disco) ====
  push();
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
    let angle = map(i, 0, 10, -PI * 0.25, PI * 1.75);
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
  
  pop(); // Fin de rotación
  
  // ==== PARTE FIJA (tope/finger stop) ====
  // Tope - rectángulo gris que NO se mueve con la rotación
  push();
  rotate(PI * 1.85); // Posición fija en el ángulo especificado
  fill(100, 100, 100);
  noStroke();
  rect(-5 * scaleRatio, outerRadius - 10 * scaleRatio, 10 * scaleRatio, 25 * scaleRatio, 3 * scaleRatio);
  pop();
  
  pop(); // Fin de translate
  
  // Guardar posición del disco para detección de arrastre
  rotaryDialBounds = {
    x: width * 0.5 + centerX,
    y: height * 0.42 + centerY,
    outerRadius: outerRadius,
    innerRadius: innerRadius
  };
}

// ====== LÓGICA DE MARCADO ======

/**
 * Procesa la presión de una tecla del teclado numérico
 * @param {string|number} key - Tecla presionada
 * @param {number} row - Fila de la tecla
 * @param {number} col - Columna de la tecla
 */
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
