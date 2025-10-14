// ============================================
// INTERACCIONES DEL USUARIO
// (Mouse, Touch, Keyboard)
// ============================================

/**
 * Maneja eventos de click del mouse
 * UBICACIÓN ORIGINAL: sketch.js líneas ~1650-1900
 */
function mousePressed() {
  startAudioContext();
  
  // Click en botón de ajustes
  if (settingsButtonBounds) {
    let d = dist(mouseX, mouseY, settingsButtonBounds.x, settingsButtonBounds.y);
    if (d < settingsButtonBounds.radius) {
      settingsOpen = !settingsOpen;
      return;
    }
  }
  
  // Si el panel de ajustes está abierto
  if (settingsOpen && settingsAlpha > 200) {
    let panelX = 30 * min(width / 1200, height / 800);
    let panelY = 30 * min(width / 1200, height / 800);
    let panelWidth = 320 * min(width / 1200, height / 800);
    let panelHeight = 280 * min(width / 1200, height / 800);
    
    // Click en X para cerrar
    if (mouseX > panelX + panelWidth - 40 && mouseX < panelX + panelWidth &&
        mouseY > panelY && mouseY < panelY + 40) {
      settingsOpen = false;
      return;
    }
    
    // Click en botones de estilo
    let buttonY = panelY + 115 * min(width / 1200, height / 800);
    let buttonWidth = 120 * min(width / 1200, height / 800);
    let buttonHeight = 40 * min(width / 1200, height / 800);
    
    // Botón "Botones"
    if (mouseX > panelX + 30 * min(width / 1200, height / 800) && 
        mouseX < panelX + 30 * min(width / 1200, height / 800) + buttonWidth &&
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      phoneStyle = 'buttons';
      return;
    }
    
    // Botón "Rotatorio"
    if (mouseX > panelX + 170 * min(width / 1200, height / 800) && 
        mouseX < panelX + 170 * min(width / 1200, height / 800) + buttonWidth &&
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      phoneStyle = 'rotary';
      return;
    }
    
    // Click en slider de volumen
    if (settingsVolumeSliderBounds) {
      if (mouseX > settingsVolumeSliderBounds.x && 
          mouseX < settingsVolumeSliderBounds.x + settingsVolumeSliderBounds.width &&
          mouseY > settingsVolumeSliderBounds.y - 10 && 
          mouseY < settingsVolumeSliderBounds.y + settingsVolumeSliderBounds.height) {
        let newVolume = (mouseX - settingsVolumeSliderBounds.x) / settingsVolumeSliderBounds.width;
        masterVolume = constrain(newVolume, 0, 1);
        updateAllVolumes();
        return;
      }
    }
    
    // Si clickeó dentro del panel, no procesar otros clicks
    if (mouseX > panelX && mouseX < panelX + panelWidth &&
        mouseY > panelY && mouseY < panelY + panelHeight) {
      return;
    }
  }
  
  // Click en headset para levantarlo
  let scaleRatio = min(width / 1200, height / 800);
  let headsetCenterX = width * 0.5 + headsetX;
  let headsetCenterY = height * 0.42 - 50 * scaleRatio + headsetY;
  
  if (dist(mouseX, mouseY, headsetCenterX, headsetCenterY) < 100 * scaleRatio) {
    if (!headsetLifted && currentState === STATES.IDLE) {
      toggleHeadset();
    }
    isDraggingHeadset = true;
    return;
  }
  
  // Click en botones del teclado (solo si el teléfono es de botones)
  if (phoneStyle === 'buttons' && headsetLifted) {
    for (let btn of keypadButtons) {
      if (dist(mouseX, mouseY, btn.x, btn.y) < btn.size / 2) {
        // Verificar si se puede presionar según el estado
        if (currentState === STATES.DIAL_TONE || currentState === STATES.DIALING) {
          pressKey(btn.label, btn.row, btn.col);
        } else if ((currentState === STATES.CALLING_OPCIONES || currentState === STATES.WAITING_OPTION) && 
                   (btn.label === 1 || btn.label === 2 || btn.label === 3)) {
          selectOption(btn.label);
        }
        return;
      }
    }
  }
  
  // Click en disco rotatorio (solo si el teléfono es rotatorio)
  if (phoneStyle === 'rotary' && headsetLifted && rotaryDialBounds) {
    let dx = mouseX - rotaryDialBounds.x;
    let dy = mouseY - rotaryDialBounds.y;
    let dist = sqrt(dx * dx + dy * dy);
    
    // Verificar si está dentro del anillo del disco
    if (dist > rotaryDialBounds.innerRadius && dist < rotaryDialBounds.outerRadius) {
      isDraggingDial = true;
      dialStartAngle = atan2(dy, dx);
      return;
    }
  }
}

/**
 * Maneja arrastre del mouse
 */
function mouseDragged() {
  let scaleRatio = min(width / 1200, height / 800);
  
  // Arrastrar headset
  if (isDraggingHeadset) {
    // Convertir a coordenadas relativas
    let relX = mouseX - width * 0.5;
    let relY = mouseY - (height * 0.42 - 50 * scaleRatio);
    
    // Limitar rango de movimiento (ampliado para alcanzar el rostro de la imagen)
    targetHeadsetX = constrain(relX, -300 * scaleRatio, 500 * scaleRatio);
    targetHeadsetY = constrain(relY, -400 * scaleRatio, 200 * scaleRatio);
    
    return;
  }
  
  // Arrastrar slider de volumen en panel de ajustes
  if (settingsOpen && settingsVolumeSliderBounds) {
    if (mouseX > settingsVolumeSliderBounds.x && 
        mouseX < settingsVolumeSliderBounds.x + settingsVolumeSliderBounds.width &&
        mouseY > settingsVolumeSliderBounds.y - 10 && 
        mouseY < settingsVolumeSliderBounds.y + settingsVolumeSliderBounds.height) {
      let newVolume = (mouseX - settingsVolumeSliderBounds.x) / settingsVolumeSliderBounds.width;
      masterVolume = constrain(newVolume, 0, 1);
      updateAllVolumes();
      return;
    }
  }
  
  // Arrastrar disco rotatorio
  if (isDraggingDial && rotaryDialBounds) {
    let dx = mouseX - rotaryDialBounds.x;
    let dy = mouseY - rotaryDialBounds.y;
    let currentAngle = atan2(dy, dx);
    
    // Calcular diferencia de ángulo
    let angleDiff = currentAngle - dialStartAngle;
    
    // Limitar rotación (solo hacia la izquierda/sentido antihorario)
    if (angleDiff < 0) {
      targetRotaryAngle = constrain(angleDiff, -PI * 1.5, 0);
      
      // Determinar qué número está siendo marcado
      let rotationSteps = int(abs(targetRotaryAngle) / (PI / 5));
      currentDialNumber = constrain(rotationSteps, 0, 9);
    }
    
    return;
  }
}

/**
 * Maneja soltar el mouse
 */
function mouseReleased() {
  let scaleRatio = min(width / 1200, height / 800);
  
  // Soltar headset
  if (isDraggingHeadset) {
    isDraggingHeadset = false;
    
    // Verificar si está cerca del origen para colgarlo
    if (dist(headsetX, headsetY, 0, 0) < 30 * scaleRatio && headsetLifted) {
      toggleHeadset();
    }
    
    return;
  }
  
  // Soltar disco rotatorio
  if (isDraggingDial) {
    isDraggingDial = false;
    isReturning = true;
    
    // Marcar el número si está en un estado válido
    if (currentDialNumber >= 0 && (currentState === STATES.DIAL_TONE || currentState === STATES.DIALING)) {
      // Animar retorno y luego marcar
      setTimeout(() => {
        let number = currentDialNumber === 0 ? 0 : (10 - currentDialNumber) % 10;
        pressKey(number, 0, 0);
        targetRotaryAngle = 0;
        currentDialNumber = -1;
        isReturning = false;
      }, 500);
    } else {
      targetRotaryAngle = 0;
      currentDialNumber = -1;
      isReturning = false;
    }
    
    return;
  }
}

/**
 * Maneja presión de teclas del teclado físico
 */
function keyPressed() {
  // Números del teclado físico
  if (key >= '0' && key <= '9') {
    let num = parseInt(key);
    let row = int(num / 3);
    let col = num % 3;
    
    if ((currentState === STATES.DIAL_TONE || currentState === STATES.DIALING) && headsetLifted) {
      pressKey(num, row, col);
    } else if ((currentState === STATES.CALLING_OPCIONES || currentState === STATES.WAITING_OPTION) && 
               (num === 1 || num === 2 || num === 3)) {
      selectOption(num);
    }
  }
  
  // ESC para cerrar panel de ajustes
  if (keyCode === ESCAPE) {
    settingsOpen = false;
  }
}

// ====== EVENTOS TÁCTILES (MOBILE) ======

/**
 * Touch equivalente de mousePressed
 */
function touchStarted() {
  startAudioContext();
  mousePressed();
  return false; // Prevenir comportamiento por defecto
}

/**
 * Touch equivalente de mouseDragged
 */
function touchMoved() {
  mouseDragged();
  return false;
}

/**
 * Touch equivalente de mouseReleased
 */
function touchEnded() {
  mouseReleased();
  return false;
}
