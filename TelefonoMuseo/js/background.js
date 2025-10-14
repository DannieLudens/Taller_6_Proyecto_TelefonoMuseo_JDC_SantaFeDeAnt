// ============================================
// FONDO DE MADERA - MESA OVALADA
// ============================================

// Variable global para el fondo pre-renderizado
let woodBackground;

/**
 * Crea el fondo de madera con mesa ovalada y textura realista
 * Se renderiza una sola vez para mejor rendimiento
 */
function createWoodBackground() {
  // Crear gráfico de fondo de madera con textura realista
  woodBackground = createGraphics(windowWidth, windowHeight);
  
  // Fondo de la pared (color neutro)
  woodBackground.background(200, 195, 185);
  
  // ==== MESA OVALADA DE MADERA ====
  // Dimensiones de la mesa ovalada
  let tableWidth = windowWidth * 0.85;  // 85% del ancho
  let tableHeight = windowHeight * 0.80; // 80% del alto
  let tableCenterX = windowWidth / 2;
  let tableCenterY = windowHeight / 2;
  
  // Sombra debajo de la mesa (dibujar primero, antes de la mesa)
  woodBackground.noStroke();
  woodBackground.fill(0, 0, 0, 30);
  woodBackground.ellipse(tableCenterX, tableCenterY + 15, tableWidth * 0.98, tableHeight * 0.95);
  
  // Color base de madera - tono café más cálido
  woodBackground.noStroke();
  woodBackground.fill(120, 85, 60);
  woodBackground.ellipse(tableCenterX, tableCenterY, tableWidth, tableHeight);
  
  // Sombra/borde de la mesa (efecto 3D)
  woodBackground.noFill();
  woodBackground.stroke(80, 60, 40, 100);
  woodBackground.strokeWeight(8);
  woodBackground.ellipse(tableCenterX, tableCenterY, tableWidth, tableHeight);
  
  // ==== CREAR MÁSCARA PARA TEXTURA SOLO DENTRO DEL ÓVALO ====
  // Usar el método correcto de canvas para crear la elipse
  woodBackground.drawingContext.save();
  woodBackground.drawingContext.beginPath();
  woodBackground.drawingContext.ellipse(
    tableCenterX, 
    tableCenterY, 
    tableWidth / 2, 
    tableHeight / 2,
    0,  // rotation
    0,  // startAngle
    Math.PI * 2  // endAngle
  );
  woodBackground.drawingContext.clip();
  
  // ==== VETAS HORIZONTALES (grain principal) ====
  woodBackground.noStroke();
  woodBackground.randomSeed(42); // Misma textura siempre
  
  // Vetas largas y prominentes (más realistas)
  for (let i = 0; i < 200; i++) {
    let alpha = woodBackground.random(15, 40);
    let darkness = woodBackground.random(0.7, 1.0);
    woodBackground.fill(100 * darkness, 70 * darkness, 50 * darkness, alpha);
    // Generar dentro del área de la mesa
    let x = tableCenterX + woodBackground.random(-tableWidth/2, tableWidth/2);
    let y = tableCenterY + woodBackground.random(-tableHeight/2, tableHeight/2);
    let w = woodBackground.random(200, 600);
    let h = woodBackground.random(1, 4);
    woodBackground.rect(x, y, w, h);
  }
  
  // Vetas medias con variación
  for (let i = 0; i < 120; i++) {
    woodBackground.fill(90, 60, 40, woodBackground.random(20, 35));
    let x = tableCenterX + woodBackground.random(-tableWidth/2, tableWidth/2);
    let y = tableCenterY + woodBackground.random(-tableHeight/2, tableHeight/2);
    woodBackground.rect(x, y, woodBackground.random(150, 400), woodBackground.random(2, 5));
  }
  
  // Nudos de madera (manchas circulares oscuras)
  for (let i = 0; i < 15; i++) {
    let x = tableCenterX + woodBackground.random(-tableWidth/2.5, tableWidth/2.5);
    let y = tableCenterY + woodBackground.random(-tableHeight/2.5, tableHeight/2.5);
    let size = woodBackground.random(30, 80);
    
    // Núcleo del nudo
    woodBackground.fill(70, 45, 30, 60);
    woodBackground.ellipse(x, y, size, size * 0.7);
    
    // Anillos concéntricos
    for (let ring = 0; ring < 3; ring++) {
      woodBackground.noFill();
      woodBackground.stroke(80, 50, 35, 40 - ring * 10);
      woodBackground.strokeWeight(woodBackground.random(1, 2));
      woodBackground.ellipse(x, y, size + ring * 15, (size + ring * 15) * 0.7);
    }
  }
  
  // Variaciones de color en zonas (tono desigual de madera natural)
  woodBackground.noStroke();
  for (let i = 0; i < 40; i++) {
    let brightness = woodBackground.random(0.9, 1.1);
    woodBackground.fill(130 * brightness, 90 * brightness, 65 * brightness, 15);
    let x = tableCenterX + woodBackground.random(-tableWidth/2.5, tableWidth/2.5);
    let y = tableCenterY + woodBackground.random(-tableHeight/2.5, tableHeight/2.5);
    woodBackground.ellipse(x, y, woodBackground.random(150, 300), woodBackground.random(100, 200));
  }
  
  // Restaurar contexto (quitar máscara)
  woodBackground.drawingContext.restore();
}
