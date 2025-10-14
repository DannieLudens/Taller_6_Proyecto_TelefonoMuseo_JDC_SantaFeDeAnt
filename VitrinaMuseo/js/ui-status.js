// ============================================
// UI-STATUS.JS - Indicadores de estado
// ============================================

/**
 * Dibuja todos los indicadores de estado
 * @param {number} scaleRatio - Factor de escala
 */
function drawStatusIndicators(scaleRatio) {
  drawProximitySensor(scaleRatio);
  
  if (currentState === STATES.PLAYING_NARRATIVE) {
    drawProgressBar(scaleRatio);
  }
  
  drawEstadoInfo(scaleRatio);
}

/**
 * Dibuja el indicador del sensor de proximidad (estilo bocina)
 */
function drawProximitySensor(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.20);  // Posición más centrada
  
  // Cuerpo de la bocina
  fill(40, 40, 45);
  stroke(60, 60, 70);
  strokeWeight(3 * scaleRatio);
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
    // Verde estático cuando reproduce
    fill(0, 255, 100);
    noStroke();
    ellipse(70 * scaleRatio, 0, 8 * scaleRatio, 8 * scaleRatio);
    
    // Glow del LED
    fill(0, 255, 100, 80);
    ellipse(70 * scaleRatio, 0, 16 * scaleRatio, 16 * scaleRatio);
  } else if (proximityDetected) {
    // Verde parpadeante suave cuando detecta presencia
    let pulse = sin(frameCount * 0.1) * 0.5 + 0.5;  // Oscila entre 0 y 1
    fill(0, 255, 100, 150 + pulse * 105);  // Parpadeo suave
    noStroke();
    ellipse(70 * scaleRatio, 0, 8 * scaleRatio, 8 * scaleRatio);
    
    // Glow del LED parpadeante
    fill(0, 255, 100, 30 + pulse * 50);
    ellipse(70 * scaleRatio, 0, 12 + pulse * 8, 12 + pulse * 8);
  } else {
    fill(100, 100, 100);  // Gris cuando inactivo
    noStroke();
    ellipse(70 * scaleRatio, 0, 6 * scaleRatio, 6 * scaleRatio);
  }
  
  // Texto indicativo según estado
  fill(220, 220, 220);
  textAlign(CENTER, CENTER);
  textSize(12 * scaleRatio);
  textStyle(ITALIC);
  
  if (currentState === STATES.PLAYING_NARRATIVE) {
    text("🔊 Reproduciendo...", 0, 35 * scaleRatio);
  } else if (currentState === STATES.DETECTING) {
    // Mostrar cuál vitrina está siendo detectada (Layout Individual)
    if (currentLayout === LAYOUTS.INDIVIDUAL && detectedVitrineIndex >= 0) {
      let progress = Math.floor((individualDetectionTimers[detectedVitrineIndex] / (TIMINGS.DETECTION_THRESHOLD / 16.67)) * 5);
      text(`👤 ${objetos[detectedVitrineIndex].nombre} (${progress}/5)`, 0, 35 * scaleRatio);
    } else {
      let progress = Math.floor((detectionTimer / (TIMINGS.DETECTION_THRESHOLD / 16.67)) * 5);
      text(`👤 Detectando (${progress}/5)`, 0, 35 * scaleRatio);
    }
  } else if (proximityDetected) {
    if (currentLayout === LAYOUTS.INDIVIDUAL && detectedVitrineIndex >= 0) {
      text(`👤 ${objetos[detectedVitrineIndex].nombre}`, 0, 35 * scaleRatio);
    } else {
      text("👤 Visitante detectado", 0, 35 * scaleRatio);
    }
  } else {
    text("💤 En espera", 0, 35 * scaleRatio);
  }
  
  pop();
}

/**
 * Dibuja la barra de progreso de narrativa
 * Posicionada a la izquierda, encima del panel de iluminación
 */
function drawProgressBar(scaleRatio) {
  push();
  // Posicionada encima del panel de iluminación (lado izquierdo)
  translate(width * UI_CONFIG.VOLUME_SLIDER_X, height * 0.68);  // Misma X que panel, Y un poco arriba
  
  // Calcular progreso real del audio
  let progress = 0;
  if (currentAudio && currentAudio.isPlaying()) {
    try {
      progress = currentAudio.currentTime() / currentAudio.duration();
    } catch(e) {
      // Fallback a animación simulada
      progress = (frameCount % 180) / 180;
    }
  } else {
    progress = (frameCount % 180) / 180;
  }
  
  // Fondo de la barra (mismo ancho que panel de iluminación)
  fill(255, 255, 255, 200);  // Transparente para ser discreta
  stroke(180, 180, 180);
  strokeWeight(1);
  let barWidth = 160 * scaleRatio;  // Mismo ancho que panel de iluminación
  let barHeight = 22 * scaleRatio;   // Delgada
  rect(-barWidth/2, -barHeight/2, barWidth, barHeight, 8);
  
  // Barra de progreso (verde para coherencia con LEDs)
  fill(0, 200, 100);
  noStroke();
  rect(-barWidth/2, -barHeight/2, barWidth * progress, barHeight, 8);
  
  // Texto del objeto actual (pequeño y discreto)
  fill(40);  // Texto oscuro
  textAlign(CENTER, CENTER);
  textSize(9 * scaleRatio);
  textStyle(NORMAL);
  text(`${objetos[currentObjetoIndex].nombre}`, 0, -2 * scaleRatio);
  
  // Porcentaje
  textSize(8 * scaleRatio);
  text(`${Math.round(progress * 100)}%`, 0, 6 * scaleRatio);
  
  pop();
}

/**
 * Dibuja la información detallada del estado
 */
function drawEstadoInfo(scaleRatio) {
  push();
  translate(width * 0.13, height * 0.90);  // Movido a la izquierda
  
  // Fondo más angosto
  fill(255, 255, 255, 240);  // Fondo blanco para contraste
  stroke(200, 200, 200);
  strokeWeight(2);
  rect(-140 * scaleRatio, -50 * scaleRatio, 280 * scaleRatio, 100 * scaleRatio, 10);
  
  // Estado actual
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14 * scaleRatio);  // Tamaño reducido
  
  let statusText = "";
  let statusColor = color(100, 100, 100);
  let instruction = "";
  
  switch(currentState) {
    case STATES.IDLE:
      statusText = "💤 Sistema en espera";
      statusColor = color(100, 100, 100);
      instruction = "Mueve el mouse sobre la vitrina para activar el sensor";
      break;
      
    case STATES.DETECTING:
      let timeLeft = Math.ceil((TIMINGS.DETECTION_THRESHOLD - detectionTimer * 16.67) / 1000);
      statusText = `⏱️ Detectando presencia (${5 - timeLeft}/5 segundos)`;
      statusColor = color(200, 140, 0);  // Amarillo oscuro
      instruction = "Mantén el mouse sobre la vitrina...";
      break;
      
    case STATES.PLAYING_NARRATIVE:
      statusText = `🎭 Narrativa ${currentObjetoIndex + 1}/${objetos.length}: "${objetos[currentObjetoIndex].nombre}"`;
      statusColor = color(0, 180, 70);  // Verde oscuro
      instruction = "Escuchando la historia del objeto...";
      break;
      
    case STATES.TRANSITIONING:
      statusText = `⏩ Cambiando a siguiente objeto (${currentObjetoIndex + 1}/${objetos.length})`;
      statusColor = color(0, 100, 200);  // Azul
      instruction = "Preparando siguiente narrativa...";
      break;
      
    case STATES.COOLDOWN:
      statusText = "✅ Secuencia completada";
      statusColor = color(0, 150, 70);
      instruction = "Reiniciando sistema...";
      break;
  }
  
  fill(statusColor);
  textStyle(BOLD);
  text(statusText, 0, -15 * scaleRatio);
  
  // Instrucción (texto más pequeño y resumido)
  fill(80);  // Texto oscuro para fondo blanco
  textStyle(NORMAL);
  textSize(11 * scaleRatio);  // Reducido de 13 a 11
  text(instruction, 0, 10 * scaleRatio);
  
  // Contador de objetos (más compacto)
  textSize(9 * scaleRatio);  // Reducido de 11 a 9
  fill(120);
  text(`L${currentLayout} | ${objetos.length} obj`, 0, 30 * scaleRatio);  // Texto abreviado
  
  pop();
}
