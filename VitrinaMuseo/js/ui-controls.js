// ============================================
// UI-CONTROLS.JS - Controles de usuario
// ============================================

// Bounds de los controles para detección de clicks
let volumeSliderBounds = {};
let layoutButtonsBounds = [];
let backgroundSliderBounds = {};

// Control de color de fondo
let backgroundBlend = 0.0;  // 0 = oscuro, 0.5 = azul claro, 1 = crema

/**
 * Dibuja todos los controles de usuario
 * @param {number} scaleRatio - Factor de escala
 */
function drawControls(scaleRatio) {
  drawVolumeControl(scaleRatio);
  drawLayoutSelector(scaleRatio);
  drawBackgroundControl(scaleRatio);  // Nuevo control
}

/**
 * Dibuja el control de volumen
 */
function drawVolumeControl(scaleRatio) {
  push();
  translate(width * UI_CONFIG.VOLUME_SLIDER_X, height * UI_CONFIG.VOLUME_SLIDER_Y);
  
  // Fondo del control
  fill(255, 255, 255, 240);  // Más opaco
  stroke(200, 200, 200);
  strokeWeight(2);
  rect(-80 * scaleRatio, -40 * scaleRatio, 160 * scaleRatio, 80 * scaleRatio, 10);
  
  // Título
  fill(40, 40, 40);  // Texto muy oscuro para fondo blanco
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12 * scaleRatio);
  textStyle(BOLD);
  text("🔊 Volumen", 0, -30 * scaleRatio);
  
  // Barra del slider
  let sliderWidth = 120 * scaleRatio;
  let sliderHeight = 8 * scaleRatio;
  let sliderX = -sliderWidth / 2;
  let sliderY = 0;
  
  // Guardar bounds para detección de clicks
  volumeSliderBounds = {
    x: width * UI_CONFIG.VOLUME_SLIDER_X + sliderX,
    y: height * UI_CONFIG.VOLUME_SLIDER_Y + sliderY,
    width: sliderWidth,
    height: 40 * scaleRatio,
    centerX: width * UI_CONFIG.VOLUME_SLIDER_X,
    centerY: height * UI_CONFIG.VOLUME_SLIDER_Y
  };
  
  // Fondo del slider
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
  textStyle(NORMAL);
  fill(60, 60, 60);  // Gris oscuro
  text(Math.round(masterVolume * 100) + "%", 0, 18 * scaleRatio);
  
  pop();
}

/**
 * Dibuja el selector de layouts
 */
function drawLayoutSelector(scaleRatio) {
  push();
  translate(width * 0.5, height * UI_CONFIG.LAYOUT_SELECTOR_Y);
  
  // Fondo
  fill(255, 255, 255, 240);  // Más opaco
  stroke(200, 200, 200);
  strokeWeight(2);
  rect(-200 * scaleRatio, -40 * scaleRatio, 400 * scaleRatio, 80 * scaleRatio, 10);
  
  // Título
  fill(40, 40, 40);  // Texto muy oscuro para fondo blanco
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12 * scaleRatio);
  textStyle(BOLD);
  text("🎨 Diseño de Vitrina", 0, -30 * scaleRatio);
  
  // Limpiar array de bounds
  layoutButtonsBounds = [];
  
  // Botones de layout
  let buttonWidth = 100 * scaleRatio;
  let buttonHeight = 35 * scaleRatio;
  let spacing = 120 * scaleRatio;
  
  for (let i = 1; i <= 3; i++) {
    let x = (i - 2) * spacing;
    let y = 5 * scaleRatio;
    
    // Guardar bounds
    layoutButtonsBounds.push({
      x: width * 0.5 + x - buttonWidth/2,
      y: height * UI_CONFIG.LAYOUT_SELECTOR_Y + y - buttonHeight/2,
      width: buttonWidth,
      height: buttonHeight,
      layout: i
    });
    
    // Botón activo o inactivo
    if (currentLayout === i) {
      fill(0, 150, 255);  // Azul brillante para activo
      stroke(0, 100, 200);
    } else {
      fill(240, 240, 240);  // Gris muy claro para inactivo
      stroke(180, 180, 180);
    }
    
    strokeWeight(2);
    rect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 8);
    
    // Texto del botón
    fill(currentLayout === i ? 255 : 60);  // Blanco si activo, negro si inactivo
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11 * scaleRatio);
    textStyle(currentLayout === i ? BOLD : NORMAL);
    
    let labels = ["Individual", "Horizontal", "Niveles"];
    text(labels[i-1], x, y);
  }
  
  pop();
}

/**
 * Maneja el click en el control de volumen
 * @param {number} mx - Posición X del mouse
 * @param {number} my - Posición Y del mouse
 * @returns {boolean} - True si se hizo click en el control
 */
function handleVolumeClick(mx, my) {
  let bounds = volumeSliderBounds;
  
  if (abs(mx - bounds.centerX) < bounds.width/2 && 
      abs(my - bounds.centerY) < bounds.height) {
    
    let dx = mx - bounds.centerX;
    let newVolume = (dx + bounds.width/2) / bounds.width;
    masterVolume = constrain(newVolume, 0, 1);
    updateAllVolumes();
    return true;
  }
  
  return false;
}

/**
 * Maneja el click en el selector de layout
 * @param {number} mx - Posición X del mouse
 * @param {number} my - Posición Y del mouse
 * @returns {boolean} - True si se hizo click en un botón
 */
function handleLayoutClick(mx, my) {
  for (let bounds of layoutButtonsBounds) {
    if (mx >= bounds.x && mx <= bounds.x + bounds.width &&
        my >= bounds.y && my <= bounds.y + bounds.height) {
      setLayout(bounds.layout);
      return true;
    }
  }
  
  return false;
}

/**
 * Dibuja el control de color de fondo
 */
function drawBackgroundControl(scaleRatio) {
  push();
  translate(width * 0.10, height * UI_CONFIG.VOLUME_SLIDER_Y);  // Lado izquierdo
  
  // Fondo del control
  fill(255, 255, 255, 240);
  stroke(200, 200, 200);
  strokeWeight(2);
  rect(-80 * scaleRatio, -50 * scaleRatio, 160 * scaleRatio, 100 * scaleRatio, 10);
  
  // Título
  fill(40, 40, 40);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(11 * scaleRatio);
  textStyle(BOLD);
  text("🌈 Iluminación", 0, -40 * scaleRatio);
  
  // Indicadores visuales de los colores
  let indicatorY = -15 * scaleRatio;
  let indicatorSize = 12 * scaleRatio;
  
  // Oscuro
  fill(25, 25, 30);
  stroke(100);
  strokeWeight(1);
  circle(-50 * scaleRatio, indicatorY, indicatorSize);
  
  // Azul claro
  fill(200, 220, 240);
  circle(0, indicatorY, indicatorSize);
  
  // Crema
  fill(245, 242, 235);
  circle(50 * scaleRatio, indicatorY, indicatorSize);
  
  // Barra del slider
  let sliderWidth = 120 * scaleRatio;
  let sliderHeight = 8 * scaleRatio;
  let sliderX = -sliderWidth / 2;
  let sliderY = 10 * scaleRatio;
  
  // Guardar bounds para detección de clicks
  backgroundSliderBounds = {
    x: width * 0.10 + sliderX,
    y: height * UI_CONFIG.VOLUME_SLIDER_Y + sliderY,
    width: sliderWidth,
    height: 50 * scaleRatio,
    centerX: width * 0.10,
    centerY: height * UI_CONFIG.VOLUME_SLIDER_Y + sliderY
  };
  
  // Gradiente en la barra
  drawingContext.save();
  let gradient = drawingContext.createLinearGradient(sliderX, sliderY, sliderX + sliderWidth, sliderY);
  gradient.addColorStop(0, 'rgb(25, 25, 30)');         // Oscuro
  gradient.addColorStop(0.5, 'rgb(200, 220, 240)');    // Azul
  gradient.addColorStop(1, 'rgb(245, 242, 235)');      // Crema
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(sliderX, sliderY, sliderWidth, sliderHeight);
  drawingContext.restore();
  
  // Borde de la barra
  noFill();
  stroke(150);
  strokeWeight(1);
  rect(sliderX, sliderY, sliderWidth, sliderHeight, 4);
  
  // Handle del slider
  let handleX = sliderX + sliderWidth * backgroundBlend;
  fill(255);
  stroke(100);
  strokeWeight(2);
  circle(handleX, sliderY + sliderHeight / 2, 20 * scaleRatio);
  
  fill(60);
  noStroke();
  circle(handleX, sliderY + sliderHeight / 2, 10 * scaleRatio);
  
  // Etiquetas
  textSize(9 * scaleRatio);
  textStyle(NORMAL);
  fill(60);
  text("Oscuro", -50 * scaleRatio, 30 * scaleRatio);
  text("Azul", 0, 30 * scaleRatio);
  text("Crema", 50 * scaleRatio, 30 * scaleRatio);
  
  pop();
}

/**
 * Maneja el click en el control de fondo
 * @param {number} mx - Posición X del mouse
 * @param {number} my - Posición Y del mouse
 * @returns {boolean} - True si se hizo click en el control
 */
function handleBackgroundClick(mx, my) {
  let bounds = backgroundSliderBounds;
  
  if (abs(mx - bounds.centerX) < bounds.width/2 && 
      abs(my - bounds.centerY) < bounds.height) {
    
    let dx = mx - bounds.centerX;
    let newBlend = (dx + bounds.width/2) / bounds.width;
    backgroundBlend = constrain(newBlend, 0, 1);
    return true;
  }
  
  return false;
}

/**
 * Calcula el color de fondo actual basado en backgroundBlend
 * @returns {Array} - Array RGB [r, g, b]
 */
function getCurrentBackgroundColor() {
  if (backgroundBlend <= 0.5) {
    // Interpolar entre oscuro y azul claro
    let t = backgroundBlend * 2;  // 0 a 1
    return [
      lerp(COLORS.BACKGROUND[0], COLORS.BACKGROUND_LIGHT_BLUE[0], t),
      lerp(COLORS.BACKGROUND[1], COLORS.BACKGROUND_LIGHT_BLUE[1], t),
      lerp(COLORS.BACKGROUND[2], COLORS.BACKGROUND_LIGHT_BLUE[2], t)
    ];
  } else {
    // Interpolar entre azul claro y crema
    let t = (backgroundBlend - 0.5) * 2;  // 0 a 1
    return [
      lerp(COLORS.BACKGROUND_LIGHT_BLUE[0], COLORS.BACKGROUND_CREAM[0], t),
      lerp(COLORS.BACKGROUND_LIGHT_BLUE[1], COLORS.BACKGROUND_CREAM[1], t),
      lerp(COLORS.BACKGROUND_LIGHT_BLUE[2], COLORS.BACKGROUND_CREAM[2], t)
    ];
  }
}
