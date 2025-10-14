// ============================================
// SISTEMA DE AUDIO - DTMF, TONOS Y NARRATIVAS
// ============================================

// ====== VARIABLES GLOBALES DE AUDIO ======

// Osciladores DTMF (tonos de teclado telefónico)
let dtmfOscs = [];

// Tonos del sistema (dial tone, error, busy)
let dialToneOsc, errorToneOsc, busyToneOsc;

// Control de volumen
let masterVolume = 0.75; // 75% por defecto
let audioContextStarted = false;

// Audios de personajes (MP3)
let personajeAudios = [];
let currentAudio = null;

// Audios del sistema (MP3)
let pickupSound = null;   // Sonido de levantar teléfono
let hangupSound = null;   // Sonido de colgar teléfono
let errorCallSound = null; // Sonido de error de llamada

// Timer para tono de llamada
let ringingTimer = 0;

// ====== FUNCIONES DE INICIALIZACIÓN ======

/**
 * Crea los osciladores DTMF para los tonos del teclado
 * Dual-tone multi-frequency para cada tecla
 */
function createDTMFOscillators() {
  for (let i = 0; i < dtmfFreqs.length; i++) {
    dtmfOscs.push([]);
    for (let j = 0; j < dtmfFreqs[i].length; j++) {
      let osc = new p5.Oscillator(dtmfFreqs[i][j]);
      osc.amp(0);
      dtmfOscs[i].push(osc);
    }
  }
}

/**
 * Crea los osciladores para tonos del sistema
 * Dial tone, error tone, busy tone
 */
function createSystemTones() {
  // Dial tone: 440Hz
  dialToneOsc = new p5.Oscillator(440);
  dialToneOsc.amp(0);
  
  // Error tone: 480Hz + 620Hz (alternating)
  errorToneOsc = new p5.Oscillator(480);
  errorToneOsc.amp(0);
  
  // Busy tone: 480Hz + 620Hz (faster alternating)
  busyToneOsc = new p5.Oscillator(480);
  busyToneOsc.amp(0);
}

/**
 * Inicializa el contexto de audio de p5.js
 * Debe ser llamado después de interacción del usuario
 */
function startAudioContext() {
  if (!audioContextStarted) {
    userStartAudio().then(() => {
      audioContextStarted = true;
      // Iniciar osciladores
      dialToneOsc.start();
      errorToneOsc.start();
      busyToneOsc.start();
      for (let i = 0; i < dtmfOscs.length; i++) {
        for (let j = 0; j < dtmfOscs[i].length; j++) {
          dtmfOscs[i][j].start();
        }
      }
      console.log("Audio context iniciado");
    });
  }
}

// ====== FUNCIONES DE REPRODUCCIÓN DE TONOS ======

/**
 * Reproduce tono DTMF para una tecla específica
 * @param {number} col - Columna de la tecla (0-2)
 * @param {number} row - Fila de la tecla (0-3)
 */
function playDTMFTone(col, row) {
  stopAllTones();
  
  let vol = 0.15 * masterVolume;
  dtmfOscs[0][col].amp(vol, 0.05);
  dtmfOscs[1][row].amp(vol, 0.05);
  
  setTimeout(() => {
    dtmfOscs[0][col].amp(0, 0.05);
    dtmfOscs[1][row].amp(0, 0.05);
  }, 200);
}

/**
 * Reproduce tono de marcado (dial tone)
 * Tono continuo de 440Hz
 */
function playDialTone() {
  stopAllTones();
  dialToneOsc.amp(0.1 * masterVolume);
}

/**
 * Reproduce tono de llamada (ringing)
 * Pitidos intermitentes que simulan el teléfono sonando
 */
function playRingingTone() {
  stopAllTones();
  ringingTimer = 0;
  
  console.log("Reproduciendo tono de llamada (ringing)...");
  
  // Tono de llamada intermitente: 440Hz + 480Hz
  let ringingCount = 0;
  let ringingInterval = setInterval(() => {
    if (currentState !== STATES.CALLING_RINGING) {
      clearInterval(ringingInterval);
      errorToneOsc.amp(0);
      busyToneOsc.amp(0);
      return;
    }
    
    if (ringingCount % 2 === 0) {
      // Pitido (ring)
      errorToneOsc.freq(440);
      busyToneOsc.freq(480);
      errorToneOsc.amp(0.12 * masterVolume);
      busyToneOsc.amp(0.12 * masterVolume);
    } else {
      // Silencio
      errorToneOsc.amp(0);
      busyToneOsc.amp(0);
    }
    ringingCount++;
  }, 1000); // 1 segundo de pitido, 1 segundo de silencio
  
  // Después de 3-5 segundos aleatorios, "contestan" el teléfono
  let ringDuration = random(3000, 5000);
  setTimeout(() => {
    if (currentState === STATES.CALLING_RINGING) {
      clearInterval(ringingInterval);
      errorToneOsc.amp(0);
      busyToneOsc.amp(0);
      
      // Reproducir sonido de levantar teléfono (si está cargado)
      if (pickupSound) {
        pickupSound.setVolume(masterVolume);
        pickupSound.play();
        // Esperar a que termine el sonido de pickup para empezar intro
        pickupSound.onended(() => {
          // Verificar que aún estamos en el estado correcto y el personaje es válido
          if (currentState === STATES.CALLING_RINGING && currentPersonajeIndex > 0 && currentPersonaje) {
            changeState(STATES.CALLING_INTRO);
            playIntroAudio();
          }
        });
      } else {
        // Si no hay sonido de pickup, ir directo a intro
        changeState(STATES.CALLING_INTRO);
        playIntroAudio();
      }
    }
  }, ringDuration);
}

/**
 * Reproduce tono de error (llamada fallida)
 * Audio de error en loop continuo
 */
function playErrorTone() {
  stopAllTones();
  
  // Reproducir el audio de error en loop
  if (errorCallSound) {
    errorCallSound.setVolume(masterVolume);
    errorCallSound.loop(); // Reproducir en loop continuo
  }
}

/**
 * Reproduce tono de ocupado (busy tone)
 * Alternancia rápida de 480Hz y 620Hz
 */
function playBusyTone() {
  stopAllTones();
  
  let count = 0;
  let busyInterval = setInterval(() => {
    if (count % 2 === 0) {
      busyToneOsc.freq(480);
      busyToneOsc.amp(0.15 * masterVolume);
    } else {
      busyToneOsc.freq(620);
      busyToneOsc.amp(0.15 * masterVolume);
    }
    count++;
    if (count > 4) {
      clearInterval(busyInterval);
      busyToneOsc.amp(0);
    }
  }, 500);
}

// ====== FUNCIONES DE NARRATIVAS DE PERSONAJES ======

/**
 * Reproduce audio de introducción del personaje
 */
function playIntroAudio() {
  stopAllTones();
  
  // Validar que el personaje sea válido
  if (!currentPersonaje || currentPersonajeIndex < 1 || !personajeAudios[currentPersonajeIndex]) {
    console.error(`Error: Personaje inválido (index: ${currentPersonajeIndex})`);
    changeState(STATES.ERROR);
    playErrorTone();
    return;
  }
  
  console.log(`Reproduciendo introducción del personaje ${currentPersonajeIndex}`);
  
  // Reproducir audio real
  currentAudio = personajeAudios[currentPersonajeIndex].intro;
  currentAudio.setVolume(masterVolume);
  currentAudio.play();
  
  // Cuando termine la intro, reproducir audio de opciones
  currentAudio.onended(() => {
    if (currentState === STATES.CALLING_INTRO && currentPersonaje && currentPersonajeIndex > 0) {
      playOpcionesAudio();
    }
  });
}

/**
 * Reproduce audio del menú de opciones
 * Se reproduce 2 veces con pausa de 3 segundos
 */
function playOpcionesAudio() {
  // Validar que el personaje sea válido
  if (!currentPersonaje || currentPersonajeIndex < 1 || !personajeAudios[currentPersonajeIndex]) {
    console.error(`Error: Personaje inválido al reproducir opciones (index: ${currentPersonajeIndex})`);
    changeState(STATES.ERROR);
    playErrorTone();
    return;
  }
  
  console.log(`Reproduciendo opciones del personaje ${currentPersonajeIndex} (intento ${opcionesPlayCount + 1}/2)`);
  changeState(STATES.CALLING_OPCIONES);
  opcionesPlayCount++;
  
  // Reproducir audio real
  currentAudio = personajeAudios[currentPersonajeIndex].opciones;
  currentAudio.setVolume(masterVolume);
  currentAudio.play();
  
  // Cuando termine
  currentAudio.onended(() => {
    if (currentState === STATES.CALLING_OPCIONES) {
      handleOpcionesEnded();
    }
  });
}

/**
 * Maneja el final del audio de opciones
 * Controla las 2 reproducciones y el timer
 */
function handleOpcionesEnded() {
  if (opcionesPlayCount === 1) {
    // Primera vez: esperar 3 segundos y reproducir de nuevo
    console.log("Primera reproducción de opciones terminada. Esperando 3 segundos...");
    setTimeout(() => {
      if (currentState === STATES.CALLING_OPCIONES || currentState === STATES.WAITING_OPTION) {
        playOpcionesAudio();
      }
    }, 3000);
  } else if (opcionesPlayCount >= 2) {
    // Segunda vez: activar timer de 5 segundos
    console.log("Segunda reproducción de opciones terminada. Iniciando timer de 5 segundos...");
    changeState(STATES.WAITING_OPTION);
    optionTimer = 0;
  }
}

/**
 * Reproduce audio del tema seleccionado
 * @param {number} option - Número de opción seleccionada (1, 2, o 3)
 */
function playTemaAudio(option) {
  stopAllTones();
  
  // Validar que el personaje sea válido
  if (!currentPersonaje || currentPersonajeIndex < 1 || !personajeAudios[currentPersonajeIndex]) {
    console.error(`Error: Personaje inválido al reproducir tema (index: ${currentPersonajeIndex})`);
    changeState(STATES.ERROR);
    playErrorTone();
    return;
  }
  
  console.log(`Preparando tema ${option} del personaje ${currentPersonajeIndex}...`);
  
  // Esperar 2 segundos antes de reproducir (dar "aire")
  setTimeout(() => {
    // Verificar que seguimos en el estado correcto
    if (currentState !== STATES.CALLING_TEMA) return;
    
    console.log(`Reproduciendo tema ${option}`);
    
    // Reproducir audio real según la opción
    let temaKey = `tema${option}`;
    currentAudio = personajeAudios[currentPersonajeIndex][temaKey];
    currentAudio.setVolume(masterVolume);
    currentAudio.play();
    
    // Cuando termine el tema, esperar 3 segundos y volver a opciones
    currentAudio.onended(() => {
      if (currentState === STATES.CALLING_TEMA) {
        console.log("Tema terminado. Esperando 3 segundos antes de volver a opciones...");
        setTimeout(() => {
          if (currentState === STATES.CALLING_TEMA || currentState === STATES.WAITING_OPTION) {
            // Resetear contador de opciones para empezar el ciclo de nuevo
            opcionesPlayCount = 0;
            playOpcionesAudio();
          }
        }, TEMA_PAUSE);
      }
    });
  }, 2000); // Pausa de 2 segundos antes de reproducir
}

// ====== FUNCIONES DE CONTROL DE AUDIO ======

/**
 * Detiene todos los tonos y audios activos
 */
function stopAllTones() {
  dialToneOsc.amp(0);
  errorToneOsc.amp(0);
  busyToneOsc.amp(0);
  
  // Detener el audio de error si está sonando
  if (errorCallSound && errorCallSound.isPlaying()) {
    errorCallSound.stop();
  }
  
  for (let i = 0; i < dtmfOscs[0].length; i++) {
    dtmfOscs[0][i].amp(0);
  }
  for (let i = 0; i < dtmfOscs[1].length; i++) {
    dtmfOscs[1][i].amp(0);
  }
  
  // Detener audio actual si existe
  if (currentAudio && currentAudio.isPlaying && currentAudio.isPlaying()) {
    currentAudio.stop();
  }
}

/**
 * Actualiza el volumen de todos los audios activos
 * Se llama cuando el usuario cambia el slider de volumen
 */
function updateAllVolumes() {
  // Actualizar volumen de todos los osciladores activos
  if (currentState === STATES.DIAL_TONE) {
    dialToneOsc.amp(0.1 * masterVolume);
  }
  
  // Actualizar volumen del audio actual si está reproduciéndose
  if (currentAudio && currentAudio.isPlaying && currentAudio.isPlaying()) {
    currentAudio.setVolume(masterVolume);
  }
  
  // Actualizar volumen de sonidos del sistema
  if (pickupSound) pickupSound.setVolume(masterVolume);
  if (hangupSound) hangupSound.setVolume(masterVolume);
  if (errorCallSound) errorCallSound.setVolume(masterVolume);
}
