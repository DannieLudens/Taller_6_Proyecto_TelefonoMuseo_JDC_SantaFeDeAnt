// ============================================
// UI - AURICULAR (HEADSET), CABLE Y HORQUILLA
// ============================================

// ====== VARIABLES GLOBALES ======

let headsetLifted = false;
let headsetX = 0;
let headsetY = 0;
let targetHeadsetX = 0;
let targetHeadsetY = 0;
let headsetRotation = 0;
let targetHeadsetRotation = 0;
let isDraggingHeadset = false;

// ====== FUNCIONES DE DIBUJO ======

/**
 * Dibuja el auricular (headset) con cable en espiral
 * Incluye animación de posición, rotación y escala dinámica
 * @param {number} scaleRatio - Escala responsive
 */
function drawHeadset(scaleRatio) {
  // Animar posición y rotación del headset
  headsetX = lerp(headsetX, targetHeadsetX, 0.15);
  headsetY = lerp(headsetY, targetHeadsetY, 0.15);
  headsetRotation = lerp(headsetRotation, targetHeadsetRotation, 0.12);
  
  // Calcular escala dinámica basada en la distancia al rostro
  let distanceToFace = map(headsetX, 0, 500 * scaleRatio, 1.0, 0.5);
  distanceToFace = constrain(distanceToFace, 0.5, 1.0);
  let dynamicScale = scaleRatio * distanceToFace;
  
  push();
  
  // ==== HORQUILLA/SOPORTE (SIEMPRE VISIBLE - tamaño fijo) ====
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
  
  // ==== CABLE EN ESPIRAL ====
  // Punto de anclaje en el headset (con rotación)
  let localAnchorX = -130 * scaleRatio;
  let localAnchorY = 30 * scaleRatio;
  
  let cosRot = cos(headsetRotation);
  let sinRot = sin(headsetRotation);
  
  let cableStartX = headsetX + (localAnchorX * cosRot - localAnchorY * sinRot);
  let cableStartY = -80 * scaleRatio + headsetY + (localAnchorX * sinRot + localAnchorY * cosRot);
  
  let cableEndX = -122 * scaleRatio;
  let cableEndY = -20 * scaleRatio;
  
  let cableDist = dist(cableStartX, cableStartY, cableEndX, cableEndY);
  let numSpirals = int(cableDist / (25 * scaleRatio));
  
  // Función para dibujar el cable en espiral
  function drawSpiralCable(strokeColor, weight) {
    noFill();
    stroke(strokeColor);
    strokeWeight(weight);
    
    beginShape();
    for (let i = 0; i <= numSpirals * 12; i++) {
      let t = i / (numSpirals * 12);
      
      let controlX1 = cableStartX - 100 * scaleRatio;
      let controlY1 = cableStartY + 200 * scaleRatio;
      let controlX2 = cableEndX - 300 * scaleRatio;
      let controlY2 = cableEndY + 200 * scaleRatio;
      
      let x = bezierPoint(cableStartX, controlX1, controlX2, cableEndX, t);
      let y = bezierPoint(cableStartY, controlY1, controlY2, cableEndY, t);
      
      let spiralAngle = t * numSpirals * TWO_PI * 2;
      let spiralRadius = 8 * scaleRatio * sin(t * PI);
      
      let dx = bezierTangent(cableStartX, controlX1, controlX2, cableEndX, t);
      let dy = bezierTangent(cableStartY, controlY1, controlY2, cableEndY, t);
      let tangentLen = sqrt(dx * dx + dy * dy);
      if (tangentLen > 0) {
        dx /= tangentLen;
        dy /= tangentLen;
      }
      
      let perpX = -dy;
      let perpY = dx;
      
      let spiralOffset = sin(spiralAngle) * spiralRadius;
      vertex(x + perpX * spiralOffset, y + perpY * spiralOffset);
    }
    endShape();
  }
  
  // Dibujar borde oscuro y cable crema
  drawSpiralCable(color(180, 170, 150), 5.5 * scaleRatio);
  drawSpiralCable(color(245, 240, 220), 4 * scaleRatio);
  
  // ==== HEADSET (con escala dinámica) ====
  translate(0 + headsetX, -50 * scaleRatio + headsetY);
  rotate(headsetRotation);
  
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * dynamicScale);
  
  // Auricular izquierdo (para escuchar)
  push();
  translate(-130 * dynamicScale, 0);
  ellipse(-30, 0, 85 * dynamicScale, 100 * dynamicScale);
  fill(235, 225, 205);
  ellipse(-30, 0, 70 * dynamicScale, 85 * dynamicScale);
  noFill();
  stroke(200, 190, 170);
  strokeWeight(2 * dynamicScale);
  ellipse(-30, 0, 78 * dynamicScale, 93 * dynamicScale);
  pop();
  
  // Micrófono derecho (para hablar)
  push();
  translate(130 * dynamicScale, 0);
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * dynamicScale);
  ellipse(30, 0, 80 * dynamicScale, 95 * dynamicScale);
  fill(235, 225, 205);
  ellipse(30, 0, 65 * dynamicScale, 80 * dynamicScale);
  noFill();
  stroke(200, 190, 170);
  strokeWeight(2 * dynamicScale);
  ellipse(30, 0, 73 * dynamicScale, 88 * dynamicScale);
  pop();
  
  // Mango central
  fill(245, 240, 220);
  stroke(180, 170, 150);
  strokeWeight(3 * dynamicScale);
  rect(-175 * dynamicScale, -22 * dynamicScale, 350 * dynamicScale, 44 * dynamicScale, 22 * dynamicScale);
  
  // Detalles del mango
  stroke(220, 210, 190);
  strokeWeight(1.5 * dynamicScale);
  line(-140 * dynamicScale, -15 * dynamicScale, -140 * dynamicScale, 15 * dynamicScale);
  line(-100 * dynamicScale, -15 * dynamicScale, -100 * dynamicScale, 15 * dynamicScale);
  line(100 * dynamicScale, -15 * dynamicScale, 100 * dynamicScale, 15 * dynamicScale);
  line(140 * dynamicScale, -15 * dynamicScale, 140 * dynamicScale, 15 * dynamicScale);
  
  pop();
}

// ====== FUNCIONES DE INTERACCIÓN ======

/**
 * Alterna el estado del auricular (levantado/colgado)
 * Activa/desactiva el tono de marcado
 */
function toggleHeadset() {
  headsetLifted = !headsetLifted;
  
  if (headsetLifted) {
    // Rotar a 50 grados
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
    // Volver a horizontal
    targetHeadsetRotation = 0;
    
    // Reproducir sonido de colgar teléfono
    if (hangupSound) {
      hangupSound.setVolume(masterVolume);
      hangupSound.play();
    }
    
    hangUp();
  }
}
