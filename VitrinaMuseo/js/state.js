// ============================================
// STATE.JS - Máquina de estados del sistema
// ============================================

// Variables de estado
let currentState = STATES.IDLE;
let currentObjetoIndex = 0;
let detectionTimer = 0;

// Variables para detección individual (Layout 1)
let individualDetectionTimers = [0, 0, 0];  // Timer para cada vitrina
let detectedVitrineIndex = -1;  // Cuál vitrina fue detectada (-1 = ninguna)

/**
 * Actualiza la lógica de la máquina de estados
 */
function updateStateMachine() {
  switch(currentState) {
    case STATES.IDLE:
      // Esperar detección de proximidad
      if (proximityDetected) {
        changeState(STATES.DETECTING);
        detectionTimer = 0;
        
        // Si es Layout Individual, inicializar timers individuales
        if (currentLayout === LAYOUTS.INDIVIDUAL) {
          individualDetectionTimers = [0, 0, 0];
          detectedVitrineIndex = -1;
        }
      }
      break;
      
    case STATES.DETECTING:
      // Layout Individual: Cada vitrina tiene su propio timer
      if (currentLayout === LAYOUTS.INDIVIDUAL) {
        // Actualizar timer solo de la vitrina con presencia
        if (detectedVitrineIndex >= 0) {
          individualDetectionTimers[detectedVitrineIndex]++;
          
          if (individualDetectionTimers[detectedVitrineIndex] > TIMINGS.DETECTION_THRESHOLD / 16.67) {
            // Iniciar narrativa SOLO de esta vitrina
            currentObjetoIndex = detectedVitrineIndex;
            changeState(STATES.PLAYING_NARRATIVE);
            playNarrativa(currentObjetoIndex);
          }
        }
        
        // Si no hay presencia, cancelar
        if (!proximityDetected) {
          changeState(STATES.IDLE);
          individualDetectionTimers = [0, 0, 0];
          detectedVitrineIndex = -1;
        }
      } else {
        // Layouts 2 y 3: Detección global (comportamiento original)
        detectionTimer++;
        if (detectionTimer > TIMINGS.DETECTION_THRESHOLD / 16.67) {
          // Iniciar secuencia completa
          currentObjetoIndex = 0;
          changeState(STATES.PLAYING_NARRATIVE);
          playNarrativa(currentObjetoIndex);
        }
        if (!proximityDetected) {
          changeState(STATES.IDLE);
          detectionTimer = 0;
        }
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

/**
 * Cambia el estado del sistema con logging
 * @param {string} newState - Nuevo estado del STATES
 */
function changeState(newState) {
  console.log(`Estado: ${currentState} -> ${newState}`);
  currentState = newState;
}

/**
 * Maneja el evento cuando termina una narrativa
 */
function handleNarrativaEnded() {
  console.log(`Narrativa ${currentObjetoIndex + 1} terminada`);
  
  // Layout Individual: Solo reproducir UNA narrativa, luego volver a IDLE
  if (currentLayout === LAYOUTS.INDIVIDUAL) {
    console.log("=== Narrativa individual completada ===");
    
    // Apagar luz gradualmente
    lights[currentObjetoIndex].target = LIGHTING.IDLE;
    
    // Volver a IDLE después de una pausa
    setTimeout(() => {
      changeState(STATES.IDLE);
      individualDetectionTimers = [0, 0, 0];
      detectedVitrineIndex = -1;
      console.log("Sistema listo para nueva detección individual");
    }, 2000);
    
    return;  // Salir, no continuar con secuencia
  }
  
  // Layouts 2 y 3: Secuencia completa (comportamiento original)
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
    }, TIMINGS.TRANSITION_DELAY);
  } else {
    // Todas las narrativas completadas
    console.log("=== Secuencia completa terminada ===");
    changeState(STATES.COOLDOWN);
    
    // Apagar todas las luces gradualmente
    setTimeout(() => {
      for (let i = 0; i < lights.length; i++) {
        lights[i].target = LIGHTING.IDLE;
      }
      
      // Volver a IDLE después del cooldown
      setTimeout(() => {
        changeState(STATES.IDLE);
        currentObjetoIndex = 0;
        console.log("Sistema listo para nueva secuencia");
      }, TIMINGS.COOLDOWN_DELAY);
    }, 1000);
  }
}

/**
 * Reinicia el sistema a estado inicial
 */
function resetSystem() {
  changeState(STATES.IDLE);
  currentObjetoIndex = 0;
  detectionTimer = 0;
  
  // Apagar todas las luces
  for (let i = 0; i < lights.length; i++) {
    lights[i].target = LIGHTING.IDLE;
    lights[i].current = LIGHTING.IDLE;
  }
  
  // Detener audio si está reproduciéndose
  if (currentAudio && currentAudio.isPlaying()) {
    currentAudio.stop();
  }
  
  console.log("Sistema reiniciado");
}
