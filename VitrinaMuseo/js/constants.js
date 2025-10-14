// ============================================
// CONSTANTS.JS - Configuraciones y constantes
// ============================================

// Estados del sistema
const STATES = {
  IDLE: 'idle',
  DETECTING: 'detecting',
  PLAYING_NARRATIVE: 'playing',
  TRANSITIONING: 'transitioning',
  COOLDOWN: 'cooldown'
};

// Layouts disponibles para la vitrina
const LAYOUTS = {
  INDIVIDUAL: 1,      // Tres vitrinas separadas
  HORIZONTAL: 2,      // Vitrina alargada compartida
  LEVELS: 3           // Vitrina con niveles diferentes
};

// Configuración de tiempos (en milisegundos)
const TIMINGS = {
  DETECTION_THRESHOLD: 5000,    // 5 segundos para activar
  TRANSITION_DELAY: 2000,        // 2 segundos entre narrativas
  COOLDOWN_DELAY: 5000           // 5 segundos después de terminar
};

// Configuración de iluminación
const LIGHTING = {
  IDLE: 0.25,        // 25% intensidad en reposo
  ACTIVE: 0.65       // 65% intensidad al narrar
};

// Colores del tema
const COLORS = {
  BACKGROUND: [25, 25, 30],           // Fondo oscuro para contraste (museo)
  BACKGROUND_LIGHT_BLUE: [200, 220, 240],  // Azul claro (luz natural)
  BACKGROUND_CREAM: [245, 242, 235],   // Blanco hueso (luz cálida)
  WOOD_DARK: [80, 60, 40],            // Marco oscuro
  WOOD_LIGHT: [100, 80, 60],          // Marco claro
  GLASS: [200, 220, 240, 20],         // Vidrio semi-transparente
  BASE_WHITE: [250, 248, 245],        // Base blanca del museo
  SHADOW: [0, 0, 0, 150],             // Sombras
  LIGHT_BEAM: [255, 255, 200],        // Haz de luz LED
  TEXT_PRIMARY: [220, 220, 220],      // Texto principal (claro para fondo oscuro)
  TEXT_SECONDARY: [150, 150, 150]     // Texto secundario (claro para fondo oscuro)
};

// Configuración de objetos en la vitrina
const objetos = [
  {
    nombre: "Camisa Indígena",
    descripcion: "Ilustraciones de mapa",
    narrativa: null,                    // Se carga en preload()
    imagen: null,                        // Se carga en preload()
    audioFile: "Camisa Indigena con ilustraciones de mapa.mp3",
    imageFile: "camisa indigena.png",    // Nombre real del archivo
    posX: 25,                           // Posición horizontal (%)
    color: [180, 120, 80],              // Color base (fallback)
    volumeAdjust: 1.0                   // Ajuste de volumen (1.0 = normal)
  },
  {
    nombre: "Máscara de los Diablitos",
    descripcion: "Celebración de diciembre",
    narrativa: null,
    imagen: null,
    audioFile: "Mascara de los diablitos celebracion de diciembre .mp3",
    imageFile: "mascara diablitos.png",  // Nombre real del archivo
    posX: 50,
    color: [200, 50, 50],                // Rojo para los diablitos
    volumeAdjust: 0.5                    // Reducido al 50% porque viene muy alto
  },
  {
    nombre: "Muñeco Curandero",
    descripcion: "Cultura Cuna",
    narrativa: null,
    imagen: null,
    audioFile: "Muñeco curandero de la cultura cuna para los enfermos.mp3",
    imageFile: "muneco curandero.png",   // Nombre real del archivo
    posX: 75,
    color: [140, 100, 120],
    volumeAdjust: 1.0                    // Normal
  }
];

// Configuración de la UI
const UI_CONFIG = {
  SCALE_BASE_WIDTH: 1400,
  SCALE_BASE_HEIGHT: 900,
  VOLUME_SLIDER_X: 0.90,              // Posición X del volumen (%)
  VOLUME_SLIDER_Y: 0.75,              // Posición Y del volumen (%)
  LAYOUT_SELECTOR_Y: 0.10             // Posición Y del selector de layout
};
