// ============================================
// UI-OBJECTS.JS - Dibujo de objetos y tarimillas
// ============================================

// Sistema de iluminación
let lights = [];

/**
 * Inicializa el sistema de luces
 */
function initLights() {
  lights = [];
  for (let i = 0; i < objetos.length; i++) {
    lights.push({
      current: LIGHTING.IDLE,
      target: LIGHTING.IDLE,
      active: false
    });
  }
}

/**
 * Actualiza las animaciones de iluminación
 */
function updateLights() {
  for (let i = 0; i < lights.length; i++) {
    lights[i].current = lerp(lights[i].current, lights[i].target, 0.05);
  }
}

/**
 * Dibuja todos los objetos según el layout
 * @param {number} scaleRatio - Factor de escala
 */
function drawObjetos(scaleRatio) {
  switch(currentLayout) {
    case LAYOUTS.INDIVIDUAL:
      drawObjectsLayout1(scaleRatio);
      break;
    case LAYOUTS.HORIZONTAL:
      drawObjectsLayout2(scaleRatio);
      break;
    case LAYOUTS.LEVELS:
      drawObjectsLayout3(scaleRatio);
      break;
  }
}

/**
 * Layout 1: Objetos en vitrinas individuales
 */
function drawObjectsLayout1(scaleRatio) {
  for (let i = 0; i < objetos.length; i++) {
    let obj = objetos[i];
    let x = map(obj.posX, 0, 100, -550 * scaleRatio, 550 * scaleRatio);  // Aumentado de -450 a -550
    
    push();
    translate(width * 0.5 + x, height * 0.55);
    
    // Haz de luz desde el LED (ajustado para estar dentro del vidrio)
    // glassY = -240, entonces LED está en -210, luz llega hasta la tarimilla
    drawLightBeam(0, -210 * scaleRatio, 0, 40 * scaleRatio, 
                  lights[i].current, scaleRatio);
    
    // Tarimilla (trapecio) - apoyada en el fondo, cerca de baseY (40)
    drawTarimilla(0, 36 * scaleRatio, obj, i, scaleRatio);
    
    // Objeto sobre la tarimilla
    drawObject(0, -60 * scaleRatio, obj, i, scaleRatio);
    
    pop();
  }
}

/**
 * Layout 2: Objetos en vitrina horizontal
 */
function drawObjectsLayout2(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.55);
  
  // Dibujar una sola tarimilla grande para toda la vitrina
  drawSingleTarimilla(0, 48 * scaleRatio, 700, scaleRatio);
  
  for (let i = 0; i < objetos.length; i++) {
    let obj = objetos[i];
    let x = map(obj.posX, 0, 100, -350 * scaleRatio, 350 * scaleRatio);
    
    push();
    translate(x, 0);
    
    // Haz de luz (ajustado para estar dentro del vidrio)
    drawLightBeam(0, -200 * scaleRatio, 0, 48 * scaleRatio, 
                  lights[i].current, scaleRatio);
    
    // Texto del objeto (sin tarimilla individual)
    drawObjectLabel(0, 48 * scaleRatio, obj, scaleRatio);
    
    // Objeto (más arriba para no tapar el texto)
    drawObject(0, -50 * scaleRatio, obj, i, scaleRatio);
    
    pop();
  }
  
  pop();
}

/**
 * Layout 3: Objetos en diferentes niveles
 */
function drawObjectsLayout3(scaleRatio) {
  push();
  translate(width * 0.5, height * 0.55);
  
  // Dibujar una sola tarimilla grande para toda la vitrina
  drawSingleTarimilla(0, 48 * scaleRatio, 700, scaleRatio);
  
  // Niveles diferentes para cada objeto (ajustados para estar más abajo, cerca del fondo)
  const levels = [-30, 0, -15]; // Alturas Y diferentes (más cerca de baseY=50, sin flotar)
  
  for (let i = 0; i < objetos.length; i++) {
    let obj = objetos[i];
    let x = map(obj.posX, 0, 100, -350 * scaleRatio, 350 * scaleRatio);
    let yOffset = levels[i] * scaleRatio;
    
    push();
    translate(x, yOffset);
    
    // Haz de luz (ajustado para estar dentro del vidrio)
    drawLightBeam(0, -210 * scaleRatio, 0, 48 * scaleRatio - yOffset, 
                  lights[i].current, scaleRatio);
    
    // Texto del objeto (sin tarimilla individual)
    drawObjectLabel(0, 48 * scaleRatio - yOffset, obj, scaleRatio);
    
    // Objeto
    drawObject(0, -22 * scaleRatio, obj, i, scaleRatio);
    
    pop();
  }
  
  pop();
}

/**
 * Dibuja el haz de luz desde el LED
 */
function drawLightBeam(x1, y1, x2, y2, intensity, scaleRatio) {
  if (intensity < 0.1) return; // No dibujar si está apagado
  
  push();
  
  // Gradiente de luz
  drawingContext.save();
  let gradient = drawingContext.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, `rgba(255, 255, 200, ${intensity * 0.6})`);
  gradient.addColorStop(0.5, `rgba(255, 255, 200, ${intensity * 0.3})`);
  gradient.addColorStop(1, `rgba(255, 255, 200, 0)`);
  
  drawingContext.fillStyle = gradient;
  drawingContext.beginPath();
  drawingContext.moveTo(x1 - 15 * scaleRatio, y1);
  drawingContext.lineTo(x2 - 60 * scaleRatio, y2);
  drawingContext.lineTo(x2 + 60 * scaleRatio, y2);
  drawingContext.lineTo(x1 + 15 * scaleRatio, y1);
  drawingContext.closePath();
  drawingContext.fill();
  drawingContext.restore();
  
  pop();
}

/**
 * Dibuja una tarimilla trapezoidal
 */
/**
 * Dibuja una tarimilla individual (para Layout 1)
 */
function drawTarimilla(x, y, obj, index, scaleRatio) {
  push();
  translate(x, y);
  
  let lightIntensity = lights[index].current;
  
  // Trapecio (base ancha abajo, estrecha arriba)
  let topWidth = 100 * scaleRatio;
  let bottomWidth = 190 * scaleRatio;
  let height = 36 * scaleRatio;
  
  // Sombra de la tarimilla
  fill(COLORS.SHADOW);
  noStroke();
  quad(
    -topWidth/2 + 2 * scaleRatio, -height + 2 * scaleRatio,
    topWidth/2 + 2 * scaleRatio, -height + 2 * scaleRatio,
    bottomWidth/2 + 2 * scaleRatio, 2 * scaleRatio,
    -bottomWidth/2 + 2 * scaleRatio, 2 * scaleRatio
  );
  
  // Tarimilla principal
  fill(250 - lightIntensity * 20, 248 - lightIntensity * 20, 245 - lightIntensity * 20);
  stroke(COLORS.TEXT_SECONDARY);
  strokeWeight(1.5 * scaleRatio);
  quad(
    -topWidth/2, -height,
    topWidth/2, -height,
    bottomWidth/2, 0,
    -bottomWidth/2, 0
  );
  
  // Texto en las caras inclinadas
  fill(0); // Negro para mejor contraste
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(9 * scaleRatio);
  textStyle(BOLD);
  text(obj.nombre, 0, -height/2 - 8 * scaleRatio);
  
  textSize(7 * scaleRatio);
  textStyle(NORMAL);
  fill(0); // Negro para la descripción también
  text(obj.descripcion, 0, -height/2 + 5 * scaleRatio);
  
  pop();
}

/**
 * Dibuja una tarimilla grande única para layouts compartidos (2 y 3)
 */
function drawSingleTarimilla(x, y, width, scaleRatio) {
  push();
  translate(x, y);
  
  // Obtener iluminación promedio
  let avgIntensity = lights.reduce((sum, light) => sum + light.current, 0) / lights.length;
  
  // Trapecio largo (base ancha abajo, estrecha arriba)
  let topWidth = (width - 20) * scaleRatio;
  let bottomWidth = (width + 140) * scaleRatio;
  let height = 36 * scaleRatio;
  
  // Sombra de la tarimilla
  fill(COLORS.SHADOW);
  noStroke();
  quad(
    -topWidth/2 + 2 * scaleRatio, -height + 2 * scaleRatio,
    topWidth/2 + 2 * scaleRatio, -height + 2 * scaleRatio,
    bottomWidth/2 + 2 * scaleRatio, 2 * scaleRatio,
    -bottomWidth/2 + 2 * scaleRatio, 2 * scaleRatio
  );
  
  // Tarimilla principal
  fill(250 - avgIntensity * 20, 248 - avgIntensity * 20, 245 - avgIntensity * 20);
  stroke(COLORS.TEXT_SECONDARY);
  strokeWeight(1.5 * scaleRatio);
  quad(
    -topWidth/2, -height,
    topWidth/2, -height,
    bottomWidth/2, 0,
    -bottomWidth/2, 0
  );
  
  pop();
}

/**
 * Dibuja solo el texto (etiqueta) de un objeto
 */
function drawObjectLabel(x, y, obj, scaleRatio) {
  push();
  translate(x, y);
  
  let height = 36 * scaleRatio;
  
  // Texto del objeto
  fill(0); // Negro para mejor contraste
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(9 * scaleRatio);
  textStyle(BOLD);
  text(obj.nombre, 0, -height/2 - 8 * scaleRatio);
  
  textSize(7 * scaleRatio);
  textStyle(NORMAL);
  text(obj.descripcion, 0, -height/2 + 5 * scaleRatio);
  
  pop();
}

/**
 * Dibuja un objeto (imagen PNG o fallback)
 */
function drawObject(x, y, obj, index, scaleRatio) {
  push();
  translate(x, y);
  
  let lightIntensity = lights[index].current;
  let objectSize = 80 * scaleRatio;
  
  // Sombra del objeto
  fill(0, 0, 0, 80 + lightIntensity * 40);
  noStroke();
  ellipse(0, 70 * scaleRatio, objectSize, 25 * scaleRatio);
  
  // Dibujar imagen PNG si está cargada
  if (obj.imagen) {
    push();
    
    // Aplicar brillo según iluminación
    tint(255, 255 - (1 - lightIntensity) * 100);
    
    imageMode(CENTER);
    
    // Calcular dimensiones respetando la proporción original
    let maxSize = objectSize * 1.2;
    let aspectRatio = obj.imagen.width / obj.imagen.height;
    let imgWidth, imgHeight;
    
    if (aspectRatio > 1) {
      // Imagen horizontal (más ancha que alta)
      imgWidth = maxSize;
      imgHeight = maxSize / aspectRatio;
    } else {
      // Imagen vertical (más alta que ancha)
      imgHeight = maxSize;
      imgWidth = maxSize * aspectRatio;
    }
    
    image(obj.imagen, 0, 0, imgWidth, imgHeight);
    
    pop();
  } else {
    // Fallback: dibujar forma según índice
    drawObjectFallback(obj, index, objectSize, lightIntensity, scaleRatio);
  }
  
  // Brillo si está activo
  if (lights[index].target === LIGHTING.ACTIVE) {
    fill(255, 255, 200, lightIntensity * 80);
    noStroke();
    ellipse(0, 0, objectSize * 0.8, objectSize * 0.8);
  }
  
  pop();
}

/**
 * Dibuja objeto fallback si no hay imagen
 */
function drawObjectFallback(obj, index, size, lightIntensity, scaleRatio) {
  let [r, g, b] = obj.color;
  fill(
    r + lightIntensity * 75,
    g + lightIntensity * 75,
    b + lightIntensity * 75
  );
  stroke(100, 80, 60);
  strokeWeight(2 * scaleRatio);
  
  if (index === 0) {
    // Camisa
    rect(-size/2, -size/2, size, size * 1.1, 8);
  } else if (index === 1) {
    // Máscara
    ellipse(0, 0, size, size * 1.1);
  } else {
    // Muñeco
    ellipse(0, -size/4, size/2, size/2);
    rect(-size/3, 0, size * 0.66, size * 0.75, 5);
  }
}
