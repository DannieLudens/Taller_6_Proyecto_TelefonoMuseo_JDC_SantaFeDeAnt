// ============================================
// INTERACTIONS.JS - Manejo de eventos de usuario
// ============================================

// Variables de interacción
let proximityDetected = false;

/**
 * Actualiza el estado del sensor de proximidad
 * Simula sensor con posición del mouse sobre la vitrina
 */
function updateProximitySensor() {
  let scaleRatio = min(width / UI_CONFIG.SCALE_BASE_WIDTH, 
                       height / UI_CONFIG.SCALE_BASE_HEIGHT);
  
  // Áreas de detección según el layout
  let detected = false;
  
  switch(currentLayout) {
    case LAYOUTS.INDIVIDUAL:
      // Detectar sobre cada vitrina individual
      detectedVitrineIndex = -1;  // Resetear
      
      for (let i = 0; i < objetos.length; i++) {
        let x = map(objetos[i].posX, 0, 100, -550 * scaleRatio, 550 * scaleRatio);
        let centerX = width * 0.5 + x;
        let centerY = height * 0.55;
        let vitrinaWidth = 200 * scaleRatio;
        let vitrinaHeight = 400 * scaleRatio;
        
        if (abs(mouseX - centerX) < vitrinaWidth/2 && 
            abs(mouseY - centerY) < vitrinaHeight/2) {
          detected = true;
          detectedVitrineIndex = i;  // Guardar cuál vitrina fue detectada
          break;
        }
      }
      break;
      
    case LAYOUTS.HORIZONTAL:
      // Vitrina alargada (ANCHO REDUCIDO)
      let centerX = width * 0.5;
      let centerY = height * 0.55;
      let vitrinaWidth = 850 * scaleRatio;  // Reducido de 1000 a 850
      let vitrinaHeight = 400 * scaleRatio;
      
      if (abs(mouseX - centerX) < vitrinaWidth/2 && 
          abs(mouseY - centerY) < vitrinaHeight/2) {
        detected = true;
      }
      break;
      
    case LAYOUTS.LEVELS:
      // Vitrina con niveles
      let centerX2 = width * 0.5;
      let centerY2 = height * 0.55;
      let vitrinaWidth2 = 800 * scaleRatio;
      let vitrinaHeight2 = 450 * scaleRatio;
      
      if (abs(mouseX - centerX2) < vitrinaWidth2/2 && 
          abs(mouseY - centerY2) < vitrinaHeight2/2) {
        detected = true;
      }
      break;
  }
  
  proximityDetected = detected;
}

/**
 * Maneja el evento de mouse moved
 */
function mouseMoved() {
  updateProximitySensor();
}

/**
 * Maneja el evento de mouse pressed
 */
function mousePressed() {
  // Inicializar contexto de audio
  initAudioContext();
  
  // Verificar clicks en controles
  if (handleVolumeClick(mouseX, mouseY)) {
    return;
  }
  
  if (handleLayoutClick(mouseX, mouseY)) {
    return;
  }
  
  if (handleBackgroundClick(mouseX, mouseY)) {
    return;
  }
  
  // Click en cualquier parte actualiza proximidad
  updateProximitySensor();
}

/**
 * Maneja el evento de mouse dragged
 */
function mouseDragged() {
  // Actualizar controles mientras se arrastra
  handleVolumeClick(mouseX, mouseY);
  handleBackgroundClick(mouseX, mouseY);
  updateProximitySensor();
}

/**
 * Maneja el evento de window resized
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * Touch support para dispositivos móviles
 */
function touchStarted() {
  mousePressed();
  return false; // Prevenir comportamiento por defecto
}

function touchMoved() {
  mouseMoved();
  mouseDragged();
  return false;
}

function touchEnded() {
  return false;
}
