// ============================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================

// Estados del sistema telefónico
const STATES = {
  IDLE: 'idle',
  DIAL_TONE: 'dial_tone',
  DIALING: 'dialing',
  CALLING_RINGING: 'calling_ringing',
  CALLING_INTRO: 'calling_intro',
  CALLING_OPCIONES: 'calling_opciones',
  WAITING_OPTION: 'waiting_option',
  CALLING_TEMA: 'calling_tema',
  ERROR: 'error',
  BUSY: 'busy'
};

// Configuración de personajes del museo
const personajes = [
  { nombre: "Mujer Anónima", oficio: "Época Colonial", telefono: "1234" },
  { nombre: "Campesino Indígena", oficio: "Desplazado", telefono: "2345" },
  { nombre: "Afrodescendiente", oficio: "Época Colonial", telefono: "3456" },
  { nombre: "Sepulturero", oficio: "Oficio Tradicional", telefono: "4567" }
];

// Frecuencias DTMF para tonos de teclado telefónico
// [Columnas 1209Hz, 1336Hz, 1477Hz] x [Filas 697Hz, 770Hz, 852Hz, 941Hz]
const dtmfFreqs = [
  [1209, 1336, 1477], // Columnas
  [697, 770, 852, 941] // Filas
];

// Layout del teclado numérico
const keypadLayout = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ["*", 0, "#"]
];

// Tiempos y timeouts (en milisegundos)
const AUTO_HANGUP_TIME = 3000;  // Tiempo antes de auto-colgar en ERROR/BUSY
const OPTION_TIMEOUT = 5000;     // Tiempo para elegir opción (5 segundos)
const TEMA_PAUSE = 3000;         // Pausa después de reproducir tema (3 segundos)
const DIAL_TONE_DELAY = 500;     // Delay antes de reproducir tono de marcado

// Configuración UI
const buttonSize = 50;
const buttonSpacing = 60;
