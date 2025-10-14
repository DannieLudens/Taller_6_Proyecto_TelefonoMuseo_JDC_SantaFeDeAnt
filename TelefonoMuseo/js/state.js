// ============================================
// MÁQUINA DE ESTADOS Y LÓGICA DE LLAMADAS
// ============================================

// ====== VARIABLES DE ESTADO ======

let currentState = STATES.IDLE;
let dialedNumber = '';
let currentPersonaje = null;
let currentPersonajeIndex = -1;
let selectedOption = 0;
let opcionesPlayCount = 0; // Contador de veces que se reprodujo el audio de opciones

// Timers
let autoHangupTimer = 0;
let optionTimer = 0;

// ====== FUNCIONES DE GESTIÓN DE ESTADO ======

/**
 * Cambia el estado del sistema telefónico
 * @param {string} newState - Nuevo estado (uno de los definidos en STATES)
 */
function changeState(newState) {
  console.log(`Estado: ${currentState} -> ${newState}`);
  currentState = newState;
  autoHangupTimer = 0;
}

/**
 * Valida el número marcado contra el directorio de personajes
 * Si es válido, inicia la llamada; si no, reproduce error
 */
function checkNumber() {
  let personaje = personajes.find(p => p.telefono === dialedNumber);
  
  if (personaje) {
    currentPersonaje = personaje;
    // Encontrar el índice del personaje (1-4)
    currentPersonajeIndex = personajes.indexOf(personaje) + 1;
    // Resetear contador de opciones
    opcionesPlayCount = 0;
    // Primero reproducir tono de llamada (ringing)
    changeState(STATES.CALLING_RINGING);
    playRingingTone();
  } else {
    changeState(STATES.ERROR);
    playErrorTone();
  }
}

/**
 * Selecciona una opción del menú de narrativas
 * @param {number} option - Opción seleccionada (1, 2, o 3)
 */
function selectOption(option) {
  selectedOption = option;
  console.log(`Usuario seleccionó opción ${option} (interrumpiendo si está sonando)`);
  
  // Resetear timer de opciones
  optionTimer = 0;
  
  // Detener audio actual si está reproduciéndose
  if (currentAudio && currentAudio.isPlaying && currentAudio.isPlaying()) {
    currentAudio.stop();
  }
  
  // Reproducir tono DTMF para feedback
  let row = 0; // Primera fila para 1, 2, 3
  let col = option - 1; // 0, 1, 2
  playDTMFTone(col, row);
  
  // Cambiar a reproducción de tema
  changeState(STATES.CALLING_TEMA);
  playTemaAudio(option);
}

/**
 * Cuelga el teléfono y resetea todo el estado
 * Vuelve al estado IDLE
 */
function hangUp() {
  changeState(STATES.IDLE);
  stopAllTones();
  dialedNumber = '';
  currentPersonaje = null;
  currentPersonajeIndex = -1;
  selectedOption = 0;
  opcionesPlayCount = 0;
  autoHangupTimer = 0;
  optionTimer = 0;
  ringingTimer = 0;
  targetHeadsetX = 0;
  targetHeadsetY = 0;
}
