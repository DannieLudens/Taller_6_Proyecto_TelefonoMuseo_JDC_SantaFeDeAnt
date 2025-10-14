# 🔊 Mejoras de Bocinas en Vitrinas - v2.5

**Fecha**: 14 de octubre de 2025  
**Versión**: 2.5 - Sistema de bocinas indicadoras en vitrinas

---

## ✅ Cambios Implementados

### 1️⃣ **Revertir LEDs de Vitrinas** ↩️

#### **Decisión**:
El efecto de LEDs verdes parpadeantes en las luces superiores de las vitrinas no gustó visualmente. 

#### **Solución**:
✅ **UNDO completo**: LEDs superiores vuelven a comportamiento original
- Color: Amarillo/blanco según intensidad de iluminación
- Sin efecto verde parpadeante
- Solo reflejan el estado de iluminación del objeto
- Código restaurado a versión v2.3

---

### 2️⃣ **Reposicionar Barra de Progreso** 📊

#### **Problema Anterior**:
Barra se mostraba en el centro de la pantalla (width * 0.5), ocupando espacio visual importante.

#### **Solución**:
✅ Movida a la **izquierda**, alineada con panel de iluminación
- **Posición X**: `width * 0.90` (misma que panel de volumen)
- **Posición Y**: `height * 0.68` (justo encima del panel al 75%)
- **Ancho**: 160px (mismo que panel)
- **Altura**: 22px (compacta)
- **Texto**: 2 líneas (nombre + porcentaje separados)

**Resultado**: Barra discreta en esquina inferior derecha, no interfiere con vitrinas

---

### 3️⃣ **Sistema de Bocinas Indicadoras** 🔊

#### **Concepto**:
En lugar de hacer parpadear los LEDs superiores, agregar **bocinas indicadoras** dentro de cada vitrina que muestren el estado de detección/reproducción.

#### **Diseño**:
Bocina idéntica a la principal del sensor de proximidad, pero escalada:
- ✅ Cuerpo rectangular gris oscuro con bordes redondeados
- ✅ Rejilla de 15 líneas verticales
- ✅ LED circular a la derecha con 3 estados
- ✅ Escala proporcional al tamaño de vitrina

---

## 🎯 Implementación por Layout

### **Layout 1: Individual (3 Vitrinas Separadas)**

```
[Vitrina 1]    [Vitrina 2]    [Vitrina 3]
    🔊             🔊             🔊
  (cada una con su propia bocina)
```

**Especificaciones**:
- **Cantidad**: 3 bocinas independientes
- **Posición**: Debajo del vidrio, sobre la base, centradas
- **Escala**: 62.5% del tamaño original (100px ancho × 25px alto)
- **Comportamiento**: 
  - Solo parpadea la bocina de la vitrina detectada
  - Verde parpadeante cuando detecta presencia
  - Verde estático cuando reproduce
  - Gris cuando inactiva

**Código**:
```javascript
drawVitrineIndicator(0, indicatorY, i, scaleRatio, 0.625);
// i = índice de vitrina (0, 1, 2)
```

---

### **Layout 2: Horizontal (Vitrina Alargada)**

```
[=============== Vitrina Grande ===============]
                    🔊
              (bocina compartida)
```

**Especificaciones**:
- **Cantidad**: 1 bocina compartida
- **Posición**: Centro inferior, debajo del vidrio
- **Escala**: 75% del tamaño original (120px ancho × 30px alto)
- **Comportamiento**:
  - Verde parpadeante cuando detecta presencia (cualquier punto)
  - Verde estático durante toda la secuencia de reproducción
  - Gris cuando inactiva

**Código**:
```javascript
drawVitrineIndicator(0, indicatorY, -1, scaleRatio, 0.75);
// -1 = vitrina compartida (no individual)
```

---

### **Layout 3: Niveles (Vitrina con Alturas)**

```
[=============== Vitrina Grande ===============]
                    🔊
              (bocina compartida)
```

**Especificaciones**:
- Idéntico a Layout 2 (Horizontal)
- 1 bocina compartida, 75% escala
- Mismo comportamiento de detección/reproducción

---

## 🎨 Estados de Bocina

### **Estado: Inactivo** ⚫
```
LED: Gris pequeño (6px × escala)
Sin glow
```

### **Estado: Detectando** 💚⚡
```
LED: Verde parpadeante
Alpha: 150 + sin(frameCount * 0.1) * 0.5 * 105
Glow: Tamaño dinámico 12-20px
Frecuencia: ~1 segundo por ciclo
```

### **Estado: Reproduciendo** 💚
```
LED: Verde estático
Alpha: 255
Glow: 16px fijo
```

---

## 🔧 Función Principal

### **`drawVitrineIndicator(x, y, vitrineIndex, scaleRatio, sizeScale)`**

**Parámetros**:
- `x`: Posición X (centro de la bocina)
- `y`: Posición Y (centro de la bocina)
- `vitrineIndex`: 
  - `0, 1, 2`: Vitrina individual específica
  - `-1`: Vitrina compartida (Horizontal/Niveles)
- `scaleRatio`: Factor de escala responsivo
- `sizeScale`: 
  - `0.625`: Vitrinas individuales (62.5%)
  - `0.75`: Vitrinas compartidas (75%)

**Lógica de Estado**:
```javascript
if (vitrineIndex >= 0) {
  // Layout Individual
  isDetecting = (currentState === DETECTING && detectedVitrineIndex === vitrineIndex);
  isPlaying = (currentState === PLAYING && currentObjetoIndex === vitrineIndex);
} else {
  // Layouts Compartidos
  isDetecting = (currentState === DETECTING && proximityDetected);
  isPlaying = (currentState === PLAYING);
}
```

---

## 📐 Dimensiones Comparativas

| Elemento | Original | Individual | Compartida |
|----------|----------|------------|------------|
| **Ancho** | 160px | 100px (62.5%) | 120px (75%) |
| **Alto** | 40px | 25px (62.5%) | 30px (75%) |
| **LED** | 8px | 5px | 6px |
| **Glow** | 16px | 10px | 12px |
| **Rejilla** | 15 líneas | 15 líneas | 15 líneas |
| **Grosor Borde** | 3px | ~2px | ~2px |

---

## 🎮 Comportamiento por Escenario

### **Escenario 1: Layout Individual - Detección de Vitrina 2**

```
1. Visitante mueve mouse sobre Vitrina 2 (Máscara)
   → Bocina principal (arriba): Parpadea verde
   → Bocina Vitrina 2: Parpadea verde
   → Bocinas Vitrinas 1-3: Gris
   → LEDs superiores: Amarillo según iluminación

2. Completa 5 segundos
   → Bocina Vitrina 2: Verde fijo
   → LED superior Vitrina 2: Amarillo brillante (iluminado)
   → Reproduce narrativa de Máscara

3. Termina narrativa
   → Bocina Vitrina 2: Gris
   → LED superior Vitrina 2: Amarillo tenue
   → Sistema a IDLE
```

---

### **Escenario 2: Layout Horizontal - Secuencia Completa**

```
1. Visitante acerca mouse a vitrina
   → Bocina principal: Parpadea verde
   → Bocina vitrina: Parpadea verde
   → LEDs superiores: Amarillo según iluminación

2. Activa secuencia
   → Bocina vitrina: Verde fijo (durante toda secuencia)
   → LED 1: Amarillo brillante → apaga
   → LED 2: Amarillo brillante → apaga
   → LED 3: Amarillo brillante → apaga

3. Completa secuencia
   → Bocina vitrina: Gris
   → Cooldown → IDLE
```

---

## 💡 Ventajas del Nuevo Sistema

### **1. Feedback Visual Claro** 👁️
- ✅ Bocinas dentro de vitrinas son más intuitivas
- ✅ Visitante sabe exactamente qué vitrina está activa
- ✅ Separación clara entre iluminación (LEDs) y detección (bocinas)

### **2. No Confunde Iluminación con Detección** 💡
- ✅ LEDs superiores = Solo iluminación (amarillo)
- ✅ Bocinas inferiores = Estado del sistema (verde/gris)
- ✅ Dos sistemas independientes y complementarios

### **3. Coherencia Visual** 🎨
- ✅ Bocinas idénticas a la principal del sensor
- ✅ Mismo color verde para todo el sistema
- ✅ Mismo patrón de parpadeo
- ✅ Diseño unificado

### **4. Proporcionalidad** 📏
- ✅ Escala 62.5% para vitrinas pequeñas (individuales)
- ✅ Escala 75% para vitrinas grandes (compartidas)
- ✅ No obstruyen vista de objetos
- ✅ Tamaño adecuado para ser visibles pero discretas

---

## 📊 Comparación Antes/Después

| Aspecto | v2.4 (LEDs Verdes) | v2.5 (Bocinas) |
|---------|-------------------|----------------|
| **Indicador Visual** | LEDs superiores parpadeantes | ✅ **Bocinas inferiores** |
| **Confusión** | LEDs mezclaban iluminación + detección | ✅ **Separados claramente** |
| **Layout Individual** | Solo LED de vitrina detectada | ✅ **Solo bocina de vitrina detectada** |
| **Escala** | Fija (15px) | ✅ **Proporcional (62.5-75%)** |
| **Posición** | Arriba del vidrio | ✅ **Debajo del vidrio (más integrado)** |
| **Coherencia** | Diseño diferente a sensor principal | ✅ **Idéntico a sensor principal** |
| **Barra Progreso** | Centro pantalla | ✅ **Izquierda (encima panel)** |

---

## 🧪 Casos de Prueba

### **Prueba 1: Layout Individual - Bocinas Independientes**
1. Seleccionar Layout 1
2. Mover mouse sobre Vitrina 1 (izquierda)
3. **Resultado esperado**:
   - Solo bocina de Vitrina 1 parpadea verde
   - Bocinas 2 y 3 permanecen grises
   - Después de 5s, bocina 1 verde fijo
   - Solo reproduce narrativa 1

---

### **Prueba 2: Layout Horizontal - Bocina Compartida**
1. Seleccionar Layout 2
2. Mover mouse sobre cualquier parte de vitrina
3. **Resultado esperado**:
   - Bocina compartida parpadea verde
   - Al activar, bocina verde fijo durante toda secuencia
   - Reproduce las 3 narrativas

---

### **Prueba 3: Barra de Progreso Reposicionada**
1. Activar cualquier narrativa
2. **Resultado esperado**:
   - Barra aparece en esquina inferior derecha
   - Alineada con panel de iluminación
   - No obstruye vista de vitrinas
   - Muestra nombre + porcentaje

---

### **Prueba 4: LEDs Superiores Sin Verde**
1. Durante detección y reproducción
2. **Resultado esperado**:
   - LEDs superiores SOLO amarillo/blanco
   - NO verde en ningún momento
   - Brillo según estado de iluminación del objeto

---

## 🔧 Archivos Modificados

### **`js/ui-vitrina.js`**

#### Nueva función `drawVitrineIndicator()`:
```javascript
✓ Parámetros: x, y, vitrineIndex, scaleRatio, sizeScale
✓ Dibuja cuerpo rectangular con bordes redondeados
✓ Rejilla de 15 líneas verticales
✓ LED con 3 estados (gris/verde parpadeante/verde estático)
✓ Lógica diferenciada para individual vs compartida
```

#### Modificación `drawLED()`:
```javascript
✓ Revertido a comportamiento original
✓ Solo color amarillo/blanco según ledIntensity
✓ Sin efectos verdes
✓ Código v2.3 restaurado
```

#### Integración en layouts:
```javascript
✓ Layout 1: drawVitrineIndicator(0, indicatorY, i, scale, 0.625) × 3
✓ Layout 2: drawVitrineIndicator(0, indicatorY, -1, scale, 0.75) × 1
✓ Layout 3: drawVitrineIndicator(0, indicatorY, -1, scale, 0.75) × 1
```

---

### **`js/ui-status.js`**

#### Modificación `drawProgressBar()`:
```javascript
✓ Posición X: width * 0.5 → width * UI_CONFIG.VOLUME_SLIDER_X
✓ Altura: 20px → 22px
✓ Texto: 1 línea → 2 líneas (nombre en línea 1, % en línea 2)
✓ Tamaño fuente: 10px → 9px (nombre), 8px (%)
```

---

## 🎯 Estado Final

**Versión**: 2.5  
**LEDs Superiores**: ✅ Amarillo/blanco (solo iluminación)  
**Bocinas Vitrinas**: ✅ Verde parpadeante/estático (detección)  
**Barra Progreso**: ✅ Izquierda, encima panel iluminación  
**Layout Individual**: ✅ 3 bocinas independientes (62.5%)  
**Layouts Compartidos**: ✅ 1 bocina compartida (75%)  
**Sistema**: ✅ Separación clara entre iluminación y detección  

---

## 📝 Notas Finales

### **Decisiones de Diseño**:
- Bocinas escaladas proporcionalmente para no dominar visualmente
- Posición debajo del vidrio las integra naturalmente en la vitrina
- Separación de roles: LEDs = luz, Bocinas = estado del sistema
- Barra de progreso fuera del área central mantiene foco en vitrinas

### **Futuras Consideraciones**:
- Si se agregan más objetos, las bocinas escalan automáticamente
- Sistema modular permite ajustar fácilmente tamaño de bocinas
- Lógica de detección puede extenderse a otros tipos de sensores
- Color verde unificado facilita comprensión del estado activo

---

**Estado**: Implementado completamente y listo para pruebas 🔊✨
