// ============================================
// VITRINA INTERACTIVA - MUSEO JUAN DEL CORRAL
// Sistema de narrativas secuenciales con iluminación dinámica
// 
// Versión 2.0 - Código Modular
// ============================================

/**
 * Función de configuración inicial
 * Se ejecuta una vez al cargar
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Arial');
  
  // Inicializar sistemas
  initLights();
  
  console.log("=== VITRINA INTERACTIVA V2.0 ===");
  console.log(`✓ ${objetos.length} objetos configurados`);
  console.log(`✓ Layout inicial: ${currentLayout}`);
  console.log("✓ Mueve el mouse sobre la vitrina para activar");
  console.log("===================================");
}

/**
 * Función de dibujo principal
 * Se ejecuta en cada frame (~60fps)
 */
function draw() {
  // Fondo del museo (color dinámico según slider)
  let bgColor = getCurrentBackgroundColor();
  background(bgColor[0], bgColor[1], bgColor[2]);
  
  // Calcular escala responsive
  let scaleRatio = min(width / UI_CONFIG.SCALE_BASE_WIDTH, 
                       height / UI_CONFIG.SCALE_BASE_HEIGHT);
  
  // === CAPA 1: Base y estructura ===
  drawVitrina(scaleRatio);
  
  // === CAPA 2: Objetos e iluminación ===
  drawObjetos(scaleRatio);
  
  // === CAPA 3: Controles de usuario ===
  drawControls(scaleRatio);
  
  // === CAPA 4: Indicadores de estado ===
  drawStatusIndicators(scaleRatio);
  
  // === ACTUALIZAR SISTEMAS ===
  updateStateMachine();
  updateLights();
}
