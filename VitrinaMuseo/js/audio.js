// ============================================
// AUDIO.JS - Sistema de audio y volumen
// ============================================

// Variables de audio
let currentAudio = null;
let masterVolume = 0.7;
let audioContextStarted = false;

/**
 * Precarga todos los archivos de audio e imágenes
 */
function preload() {
  console.log("=== Cargando assets ===");
  
  // Cargar narrativas y imágenes de objetos
  for (let i = 0; i < objetos.length; i++) {
    // Cargar audio
    let audioPath = `assets/sounds/${objetos[i].audioFile}`;
    console.log(`Cargando audio: ${audioPath}`);
    
    try {
      objetos[i].narrativa = loadSound(audioPath, 
        () => console.log(`✓ Audio ${i+1} cargado: ${objetos[i].nombre}`),
        (err) => console.error(`✗ Error cargando audio ${i+1}:`, err)
      );
    } catch(e) {
      console.error(`Error en preload audio ${i+1}:`, e);
    }
    
    // Cargar imagen PNG
    let imagePath = `assets/images/${objetos[i].imageFile}`;
    console.log(`Cargando imagen: ${imagePath}`);
    
    try {
      objetos[i].imagen = loadImage(imagePath,
        () => console.log(`✓ Imagen ${i+1} cargada: ${objetos[i].nombre}`),
        (err) => console.error(`✗ Error cargando imagen ${i+1}:`, err)
      );
    } catch(e) {
      console.error(`Error en preload imagen ${i+1}:`, e);
    }
  }
  
  console.log(`Total: ${objetos.length} objetos configurados`);
}

/**
 * Reproduce la narrativa de un objeto específico
 * @param {number} index - Índice del objeto en el array
 */
function playNarrativa(index) {
  console.log(`=== Reproduciendo narrativa ${index + 1}/${objetos.length} ===`);
  console.log(`Objeto: ${objetos[index].nombre}`);
  
  // Apagar todas las luces
  for (let i = 0; i < lights.length; i++) {
    lights[i].target = LIGHTING.IDLE;
  }
  
  // Encender luz del objeto actual
  lights[index].target = LIGHTING.ACTIVE;
  
  // Reproducir audio con ajuste de volumen individual
  currentAudio = objetos[index].narrativa;
  let adjustedVolume = masterVolume * (objetos[index].volumeAdjust || 1.0);
  currentAudio.setVolume(adjustedVolume);
  currentAudio.play();
  
  // Callback cuando termine
  currentAudio.onended(() => {
    handleNarrativaEnded();
  });
}

/**
 * Actualiza el volumen de todos los audios
 */
function updateAllVolumes() {
  if (currentAudio && currentAudio.isPlaying()) {
    // Aplicar ajuste de volumen individual del objeto
    let adjustedVolume = masterVolume * (objetos[currentObjetoIndex].volumeAdjust || 1.0);
    currentAudio.setVolume(adjustedVolume);
  }
}

/**
 * Inicializa el contexto de audio (requerido por navegadores)
 */
function initAudioContext() {
  if (!audioContextStarted) {
    userStartAudio().then(() => {
      audioContextStarted = true;
      console.log("Audio context iniciado");
    });
  }
}

/**
 * Detiene toda reproducción de audio
 */
function stopAllAudio() {
  if (currentAudio && currentAudio.isPlaying()) {
    currentAudio.stop();
  }
}
