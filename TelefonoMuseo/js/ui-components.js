// ============================================
// UI - COMPONENTES DE INTERFAZ
// (Directorio, Settings, Call-to-Action, Info)
// ============================================

// ====== VARIABLES GLOBALES ======

// Imágenes de persona
let personaRostro = null;
let personaMano = null;

// Animaciones
let earAlpha = 0;
let breathePhase = 0;
let callToActionAlpha = 0;

// Menú de ajustes
let settingsOpen = false;
let settingsAlpha = 0;
let settingsButtonBounds = null;
let settingsVolumeSliderBounds = null;

// ====== FUNCIONES DE DIBUJO ======

/**
 * Dibuja el directorio telefónico con los números de los personajes
 * UBICACIÓN ORIGINAL: sketch.js líneas 497-585
 * DISEÑO ORIGINAL RESTAURADO: Sin cajas individuales, con líneas separadoras
 */
function drawDirectorio(scaleRatio) {
  push();
  // Posición X: 18% del ancho de la pantalla desde la izquierda
  let directorioX = width * 0.18;
  
  // Posición Y: 25% de la altura de la pantalla desde arriba
  let directorioY = height * 0.25;
  
  translate(directorioX, directorioY);
  
  // Fondo del directorio - ajustado para más altura
  fill(255, 250, 240);
  stroke(100);
  strokeWeight(2);
  
  // Ancho: 260px (escalado responsivamente)
  let directorioAncho = 260 * scaleRatio;
  
  // Alto: 400px (escalado responsivamente)
  let directorioAlto = 400 * scaleRatio;
  
  rect(0, 0, directorioAncho, directorioAlto, 10);
  
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

/**
 * Dibuja el botón de ajustes (engranaje)
 * UBICACIÓN ORIGINAL: sketch.js líneas 945-1012
 * POSICIÓN ORIGINAL RESTAURADA: A la derecha del directorio
 */
function drawSettingsButton(scaleRatio) {
  // Tamaño del botón (30px base, escalado responsivamente)
  let buttonSize = 30 * scaleRatio;
  
  // Posición X: Al lado derecho del directorio
  // - width * 0.08: Alineado con el directorio
  // - + 370 * scaleRatio: Separación adicional hacia la derecha
  let buttonX = width * 0.08 + 370 * scaleRatio;
  
  // Posición Y: A la altura del directorio (28.5% de la altura)
  let buttonY = height * 0.285;
  
  // Detectar hover
  let isHovering = dist(mouseX, mouseY, buttonX, buttonY) < buttonSize/2;
  
  push();
  translate(buttonX, buttonY);
  
  // Escala animada en hover (crece ligeramente)
  let hoverScale = isHovering ? 1.1 : 1.0;
  scale(hoverScale);
  
  // Fondo del botón con hover (cambia color)
  if (isHovering) {
    fill(220, 240, 255, 250); // Azul muy claro en hover
  } else {
    fill(255, 255, 255, 200); // Blanco semi-transparente normal
  }
  
  if (settingsOpen) {
    stroke(0, 150, 255);
  } else if (isHovering) {
    stroke(0, 150, 255); // Borde azul en hover
  } else {
    stroke(100); // Borde gris normal
  }
  strokeWeight(settingsOpen ? 3 : 2);
  circle(0, 0, buttonSize);
  
  // Icono de engranaje (⚙️)
  if (settingsOpen) {
    fill(0, 150, 255); // Azul cuando está abierto
  } else if (isHovering) {
    fill(0, 150, 255); // Azul en hover
  } else {
    fill(80); // Gris normal
  }
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(28 * scaleRatio);
  text("⚙", 0, 2.5);
  
  pop();
  
  // Guardar bounds para detección de click
  settingsButtonBounds = {
    x: buttonX,
    y: buttonY,
    radius: buttonSize/2
  };
}

/**
 * Dibuja el panel de ajustes (volumen y estilo)
 * UBICACIÓN ORIGINAL: sketch.js líneas 1014-1255
 */
function drawSettingsPanel(scaleRatio) {
  let targetAlpha = settingsOpen ? 255 : 0;
  settingsAlpha = lerp(settingsAlpha, targetAlpha, 0.15);
  
  if (settingsAlpha < 5) return;
  
  let panelWidth = 320 * scaleRatio;
  let panelHeight = 280 * scaleRatio;
  let panelX = 30 * scaleRatio;
  let panelY = 30 * scaleRatio;
  
  push();
  translate(panelX, panelY);
  
  // Fondo semi-transparente (overlay)
  fill(0, 0, 0, settingsAlpha * 0.5);
  noStroke();
  rect(-panelX, -panelY, width, height);
  
  // Panel principal
  fill(255, 255, 255, settingsAlpha);
  stroke(0, 150, 255, settingsAlpha);
  strokeWeight(3);
  rect(0, 0, panelWidth, panelHeight, 15);
  
  // Solo dibujar contenido si está visible
  if (settingsAlpha > 100) {
    // Título
    fill(40);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(20 * scaleRatio);
    textStyle(BOLD);
    text("⚙ Ajustes", panelWidth/2, 20 * scaleRatio);
    
    // Botón cerrar (X)
    fill(200, 50, 50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24 * scaleRatio);
    text("×", panelWidth - 25 * scaleRatio, 25 * scaleRatio);
    
    // Línea separadora
    stroke(150);
    strokeWeight(2);
    line(20 * scaleRatio, 60 * scaleRatio, panelWidth - 20 * scaleRatio, 60 * scaleRatio);
    
    // Sección: Estilo de teléfono
    fill(60);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16 * scaleRatio);
    textStyle(BOLD);
    text("Estilo de Teléfono:", 30 * scaleRatio, 80 * scaleRatio);
    
    // Botones de estilo
    let buttonY = 115 * scaleRatio;
    let buttonWidth = 120 * scaleRatio;
    let buttonHeight = 40 * scaleRatio;
    
    // Botón: Botones
    if (phoneStyle === 'buttons') {
      fill(0, 150, 255);
      stroke(0, 100, 200);
    } else {
      fill(220);
      stroke(150);
    }
    strokeWeight(2);
    rect(30 * scaleRatio, buttonY, buttonWidth, buttonHeight, 8);
    fill(phoneStyle === 'buttons' ? 255 : 60);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14 * scaleRatio);
    text("📞 Botones", 30 * scaleRatio + buttonWidth/2, buttonY + buttonHeight/2);
    
    // Botón: Rotatorio
    if (phoneStyle === 'rotary') {
      fill(0, 150, 255);
      stroke(0, 100, 200);
    } else {
      fill(220);
      stroke(150);
    }
    strokeWeight(2);
    rect(170 * scaleRatio, buttonY, buttonWidth, buttonHeight, 8);
    fill(phoneStyle === 'rotary' ? 255 : 60);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14 * scaleRatio);
    text("📞 Rotatorio", 170 * scaleRatio + buttonWidth/2, buttonY + buttonHeight/2);
    
    // Sección: Volumen
    fill(60);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16 * scaleRatio);
    textStyle(BOLD);
    text("🔊 Volumen:", 30 * scaleRatio, 180 * scaleRatio);
    
    // Slider de volumen
    let sliderX = 30 * scaleRatio;
    let sliderY = 220 * scaleRatio;
    let sliderWidth = 260 * scaleRatio;
    let sliderHeight = 10 * scaleRatio;
    
    // Barra de fondo
    fill(200);
    noStroke();
    rect(sliderX, sliderY, sliderWidth, sliderHeight, 5);
    
    // Barra de progreso
    fill(0, 150, 255);
    rect(sliderX, sliderY, sliderWidth * masterVolume, sliderHeight, 5);
    
    // Indicador
    fill(0, 100, 200);
    stroke(255);
    strokeWeight(2);
    circle(sliderX + sliderWidth * masterVolume, sliderY + sliderHeight/2, 20 * scaleRatio);
    
    // Porcentaje
    fill(60);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(14 * scaleRatio);
    text(int(masterVolume * 100) + "%", panelWidth/2, 245 * scaleRatio);
    
    // Guardar bounds del slider
    settingsVolumeSliderBounds = {
      x: panelX + sliderX,
      y: panelY + sliderY,
      width: sliderWidth,
      height: sliderHeight + 20 * scaleRatio
    };
  }
  
  pop();
}

/**
 * Dibuja animación de call-to-action (¡Levántame! / ¡Acércame!)
 * UBICACIÓN ORIGINAL: sketch.js líneas 1492-1585
 */
function drawCallToAction(scaleRatio) {
  breathePhase += 0.03;
  let breatheScale = 1 + sin(breathePhase) * 0.08;
  
  // Determinar qué mensaje mostrar
  let showLiftMessage = (currentState === STATES.IDLE && !headsetLifted);
  let showBringToEarMessage = (currentState === STATES.DIAL_TONE && headsetLifted);
  
  if (!showLiftMessage && !showBringToEarMessage) {
    callToActionAlpha = lerp(callToActionAlpha, 0, 0.1);
  } else {
    callToActionAlpha = lerp(callToActionAlpha, 255, 0.1);
  }
  
  if (callToActionAlpha < 10) return;
  
  push();
  translate(width * 0.5, height * 0.42 - 150 * scaleRatio);
  scale(breatheScale);
  
  // Mensaje: ¡Levántame!
  if (showLiftMessage) {
    fill(255, 200, 50, callToActionAlpha);
    stroke(139, 90, 60, callToActionAlpha);
    strokeWeight(3);
    textAlign(CENTER, CENTER);
    textSize(32 * scaleRatio);
    textStyle(BOLD);
    text("¡Levántame!", 0, 0);
    
    // Flecha hacia abajo
    fill(255, 200, 50, callToActionAlpha);
    stroke(139, 90, 60, callToActionAlpha);
    strokeWeight(3);
    beginShape();
    vertex(0, 50 * scaleRatio);
    vertex(-15 * scaleRatio, 30 * scaleRatio);
    vertex(-6 * scaleRatio, 30 * scaleRatio);
    vertex(-6 * scaleRatio, 20 * scaleRatio);
    vertex(6 * scaleRatio, 20 * scaleRatio);
    vertex(6 * scaleRatio, 30 * scaleRatio);
    vertex(15 * scaleRatio, 30 * scaleRatio);
    endShape(CLOSE);
  }
  
  // Mensaje: ¡Acércame al oído!
  if (showBringToEarMessage) {
    fill(100, 200, 255, callToActionAlpha);
    stroke(40, 80, 120, callToActionAlpha);
    strokeWeight(3);
    textAlign(CENTER, CENTER);
    textSize(28 * scaleRatio);
    textStyle(BOLD);
    text("¡Acércame", 0, -10 * scaleRatio);
    text("al oído!", 0, 20 * scaleRatio);
    
    // Flecha hacia la derecha
    push();
    translate(150 * scaleRatio, 0);
    fill(100, 200, 255, callToActionAlpha);
    stroke(40, 80, 120, callToActionAlpha);
    strokeWeight(3);
    beginShape();
    vertex(30 * scaleRatio, 0);
    vertex(5 * scaleRatio, -15 * scaleRatio);
    vertex(5 * scaleRatio, -6 * scaleRatio);
    vertex(-15 * scaleRatio, -6 * scaleRatio);
    vertex(-15 * scaleRatio, 6 * scaleRatio);
    vertex(5 * scaleRatio, 6 * scaleRatio);
    vertex(5 * scaleRatio, 15 * scaleRatio);
    endShape(CLOSE);
    pop();
  }
  
  pop();
}

/**
 * Dibuja la información de estado y mensajes
 * UBICACIÓN ORIGINAL: sketch.js líneas 1587-1680
 * DISEÑO ORIGINAL RESTAURADO: Con dos líneas (título + instrucción)
 */
function drawEstadoInfo(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.93); // Bajado más: de 0.90 a 0.93
  
  fill(255, 255, 255, 230);
  stroke(100);
  strokeWeight(2);
  rect(-225 * scaleRatio, -45 * scaleRatio, 450 * scaleRatio, 90 * scaleRatio, 10); // Reducido de 500 a 450
  
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
      instruction = "Levanta el auricular para comenzar";
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
