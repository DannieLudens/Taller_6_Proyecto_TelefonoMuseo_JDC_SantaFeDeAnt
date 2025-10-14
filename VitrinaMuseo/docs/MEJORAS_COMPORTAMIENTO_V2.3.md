# 🎯 Mejoras de Comportamiento Individual - v2.3

**Fecha**: 14 de octubre de 2025  
**Versión**: 2.3 - Sistema de detección individual y ajustes de volumen

---

## ✅ Cambios Implementados

### 1️⃣ **Sistema de Detección Individual para Layout 1** 🎯

#### **Problema Anterior**:
En Layout de Vitrinas Individuales, al detectar presencia en una vitrina, se reproducían **todas las narrativas en secuencia**, lo cual no tenía sentido lógico.

#### **Solución Implementada**:

**Layout 1 (Vitrinas Individuales)**:
- ✅ Cada vitrina tiene su **propio timer de detección**
- ✅ Solo se activa la vitrina donde se detectó presencia
- ✅ Reproduce **únicamente** la narrativa de esa vitrina
- ✅ Después de terminar, vuelve a IDLE (no secuencia)
- ✅ La bocina muestra el nombre de la vitrina detectada

**Layouts 2 y 3 (Horizontal/Niveles)**:
- ✅ Mantienen el comportamiento original
- ✅ Un solo sensor activa la **secuencia completa**
- ✅ Reproducen las 3 narrativas en orden

---

### 2️⃣ **Ajuste de Volumen por Objeto** 🔊

#### **Problema**:
El audio de "Máscara de los Diablitos" venía con volumen muy alto por defecto, resultando molesto.

#### **Solución**:
Sistema de ajuste de volumen individual por objeto usando la propiedad `volumeAdjust`:

```javascript
objetos = [
  { ..., volumeAdjust: 1.0 },   // Camisa: 100% (normal)
  { ..., volumeAdjust: 0.5 },   // Máscara: 50% (reducido)
  { ..., volumeAdjust: 1.0 }    // Muñeco: 100% (normal)
]
```

- ✅ Volumen de máscara reducido al **50%**
- ✅ Sistema flexible para ajustar cualquier objeto
- ✅ Respeta el control master de volumen
- ✅ Fórmula: `volumenFinal = masterVolume × volumeAdjust`

---

## 🔧 Cambios Técnicos por Archivo

### **`js/constants.js`**
```javascript
✓ Agregada propiedad volumeAdjust a cada objeto
✓ Máscara configurada en 0.5 (50%)
✓ Otros objetos en 1.0 (100%)
```

### **`js/state.js`**
```javascript
✓ Variables nuevas:
  - individualDetectionTimers[3]: Timer por vitrina
  - detectedVitrineIndex: Cuál vitrina detectó presencia

✓ updateStateMachine() modificada:
  - Layout 1: Lógica individual
  - Layouts 2-3: Lógica secuencial (original)

✓ handleNarrativaEnded() modificada:
  - Layout 1: Termina y vuelve a IDLE
  - Layouts 2-3: Continúa secuencia completa
```

### **`js/audio.js`**
```javascript
✓ playNarrativa(): Aplica volumeAdjust individual
✓ updateAllVolumes(): Respeta volumeAdjust al cambiar master
```

### **`js/interactions.js`**
```javascript
✓ updateProximitySensor(): 
  - Layout 1: Identifica CUÁL vitrina (detectedVitrineIndex)
  - Layouts 2-3: Detección global (original)
```

### **`js/ui-status.js`**
```javascript
✓ Bocina muestra nombre del objeto detectado en Layout 1
✓ Ejemplo: "👤 Camisa Indígena (3/5)"
```

---

## 🎮 Comportamiento por Layout

### **Layout 1: Vitrinas Individuales**

```
Visitante se acerca a Vitrina 2 (Máscara)
        ↓
Bocina muestra: "👤 Máscara de los Diablitos (0/5)"
        ↓
Timer incrementa durante 5 segundos
        ↓
Se ilumina SOLO la Vitrina 2
        ↓
Reproduce narrativa de Máscara (50% volumen)
        ↓
Al terminar: Apaga luz y vuelve a IDLE
        ↓
Sistema listo para detectar otra vitrina
```

**NO reproduce Camisa ni Muñeco** ✅

---

### **Layout 2 y 3: Horizontal/Niveles**

```
Visitante se acerca a la vitrina
        ↓
Bocina muestra: "👤 Detectando (0/5)"
        ↓
Timer global incrementa 5 segundos
        ↓
Se ilumina Objeto 1 (Camisa)
        ↓
Reproduce narrativa Camisa
        ↓
Pausa 2 segundos → Transición
        ↓
Se ilumina Objeto 2 (Máscara)
        ↓
Reproduce narrativa Máscara (50% volumen)
        ↓
Pausa 2 segundos → Transición
        ↓
Se ilumina Objeto 3 (Muñeco)
        ↓
Reproduce narrativa Muñeco
        ↓
Cooldown 5 segundos → IDLE
```

**Secuencia completa** ✅

---

## 🧪 Casos de Prueba

### **Prueba 1: Vitrinas Individuales**
1. Seleccionar Layout 1 (Individual)
2. Mover mouse sobre vitrina izquierda (Camisa)
3. Esperar 5 segundos
4. **Resultado esperado**: 
   - Solo se ilumina la vitrina de la Camisa
   - Solo reproduce audio de Camisa
   - Al terminar vuelve a IDLE
   - NO reproduce Máscara ni Muñeco

### **Prueba 2: Cambio de Vitrina**
1. En Layout 1
2. Detectar Camisa (izquierda)
3. Antes de 5 segundos, mover a Máscara (centro)
4. **Resultado esperado**:
   - Timer de Camisa se resetea
   - Timer de Máscara empieza desde 0
   - Solo se reproduce Máscara si se completan los 5 segundos

### **Prueba 3: Volumen de Máscara**
1. Reproducir narrativa de Máscara
2. **Resultado esperado**:
   - Volumen notablemente más bajo que Camisa/Muñeco
   - No molesto
   - Control master de volumen sigue funcionando

### **Prueba 4: Secuencia Horizontal**
1. Seleccionar Layout 2 (Horizontal)
2. Mover mouse sobre vitrina
3. Esperar 5 segundos
4. **Resultado esperado**:
   - Secuencia completa: Camisa → Máscara → Muñeco
   - Máscara se escucha al 50% pero sigue en secuencia

---

## 📊 Comparación Antes/Después

| Aspecto | Antes (v2.2) | Después (v2.3) |
|---------|--------------|----------------|
| **Layout 1 Detección** | Global (todas) | ✅ **Individual (solo una)** |
| **Layout 1 Reproducción** | Secuencia completa | ✅ **Solo vitrina detectada** |
| **Layouts 2-3** | Secuencia completa | ✅ **Sin cambios (correcto)** |
| **Volumen Máscara** | 100% (molesto) | ✅ **50% (ajustado)** |
| **Bocina Layout 1** | Genérico | ✅ **Muestra nombre objeto** |
| **Lógica** | Inconsistente | ✅ **Coherente con layout** |

---

## 🎯 Ventajas del Nuevo Sistema

### **Lógica Museográfica Correcta** 🏛️
- ✅ Vitrinas individuales = Experiencia individual
- ✅ Vitrina compartida = Experiencia completa
- ✅ Comportamiento intuitivo para visitantes

### **Flexibilidad de Volumen** 🔊
- ✅ Ajuste por objeto sin regrabar audio
- ✅ Fácil modificar si hay más audios problemáticos
- ✅ No afecta funcionalidad del control master

### **Mejor UX** 😊
- ✅ Visitante no tiene que esperar secuencia completa
- ✅ Puede elegir qué objeto explorar
- ✅ Experiencia más rápida y directa

---

## 🔮 Configuración para Nuevos Objetos

Si en el futuro agregas más objetos, ajusta el volumen así:

```javascript
{
  nombre: "Nuevo Objeto",
  // ... otras propiedades ...
  volumeAdjust: 0.8  // 80% si viene un poco alto
}
```

**Valores recomendados**:
- `1.0` - Normal (por defecto)
- `0.8` - Ligeramente alto
- `0.6` - Alto
- `0.5` - Muy alto (como Máscara)
- `1.2` - Un poco bajo (máximo recomendado)

---

## ✅ Estado Final

**Versión**: 2.3  
**Layout 1**: ✅ Detección y reproducción individual  
**Layouts 2-3**: ✅ Secuencia completa (sin cambios)  
**Volumen Máscara**: ✅ Reducido al 50%  
**Sistema**: ✅ Lógico y coherente  

---

## 📝 Notas para el Museo

### **Montaje Físico**:
- Layout 1 requiere **3 sensores independientes** (uno por vitrina)
- Layouts 2-3 requieren **1 sensor compartido**
- Considerar distancia de activación (5 segundos actuales)

### **Ajustes Futuros**:
Si algún otro audio viene con volumen problemático, solo editar:
```javascript
// js/constants.js
volumeAdjust: 0.5  // Ajustar este valor
```

No requiere regrabar audio ni modificar código complejo.

---

**Resultado**: Sistema completamente funcional con comportamiento lógico según tipo de vitrina y volúmenes balanceados.
