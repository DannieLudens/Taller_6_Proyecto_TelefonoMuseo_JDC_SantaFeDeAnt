# 📦 Modularización del Código

## Estructura de Módulos

Este proyecto ha sido modularizado para mejor mantenibilidad. Los archivos están organizados de la siguiente manera:

### `js/constants.js` ✅
**Contenido:**
- `STATES` - Estados de la máquina de estados
- `personajes[]` - Configuración de personajes del museo
- `dtmfFreqs[][]` - Frecuencias DTMF
- `keypadLayout[][]` - Layout del teclado
- Constantes de tiempo (timeouts)

**Dependencias:** Ninguna

---

### `js/background.js` ✅
**Contenido:**
- `woodBackground` - Variable global del gráfico
- `createWoodBackground()` - Genera mesa ovalada con textura de madera

**Dependencias:** p5.js

---

### `js/audio.js` 🔄
**Contenido:**
- Variables de audio (osciladores, archivos MP3, volumen)
- `createDTMFOscillators()` - Crea osciladores para tonos de teclado
- `createSystemTones()` - Crea osciladores del sistema
- `startAudioContext()` - Inicializa contexto de audio
- `playDTMFTone()` - Reproduce tono de tecla
- `playDialTone()` - Reproduce tono de marcado
- `playRingingTone()` - Reproduce tono de llamada
- `playErrorTone()` - Reproduce tono de error
- `playBusyTone()` - Reproduce tono de ocupado
- `playIntroAudio()` - Reproduce intro de personaje
- `playOpcionesAudio()` - Reproduce menú de opciones
- `playTemaAudio()` - Reproduce tema seleccionado
- `stopAllTones()` - Detiene todos los tonos
- `updateAllVolumes()` - Actualiza volumen de todos los audios

**Dependencias:** constants.js, p5.sound

---

### `js/state.js` 🔄
**Contenido:**
- Variables de estado (currentState, dialedNumber, etc.)
- `changeState()` - Cambia estado y ejecuta transiciones
- `checkNumber()` - Valida número marcado
- Lógica de timers y timeouts

**Dependencias:** constants.js, audio.js

---

### `js/ui-telefono.js` 🔄
**Contenido:**
- `drawTelefonoButton()` - Dibuja teléfono de botones
- `drawTelefonoRotary()` - Dibuja teléfono rotatorio
- `drawRotaryDial()` - Dibuja disco rotatorio
- `drawKeypad()` - Dibuja teclado numérico
- `pressKey()` - Lógica de presionar tecla

**Dependencias:** constants.js, state.js, audio.js

---

### `js/ui-headset.js` 🔄
**Contenido:**
- Variables de headset (posición, rotación, arrastre)
- `drawHeadset()` - Dibuja auricular
- `drawCable()` - Dibuja cable en espiral
- `drawHorquilla()` - Dibuja soporte
- `toggleHeadset()` - Levanta/cuelga auricular
- `hangUp()` - Lógica de colgar

**Dependencias:** state.js, audio.js

---

### `js/ui-components.js` 🔄
**Contenido:**
- `drawDirectorio()` - Dibuja directorio telefónico
- `drawSettingsButton()` - Dibuja botón de ajustes
- `drawSettingsPanel()` - Dibuja panel de configuración
- `drawCallToAction()` - Dibuja animaciones de instrucción
- `drawEstadoInfo()` - Dibuja información de estado
- Variables de UI (settings, bounds, animaciones)

**Dependencias:** constants.js, state.js

---

### `js/interactions.js` 🔄
**Contenido:**
- `mousePressed()` - Maneja clicks
- `mouseDragged()` - Maneja arrastre
- `mouseReleased()` - Maneja soltar
- `touchStarted()` - Touch equivalente
- `touchMoved()` - Touch drag
- `touchEnded()` - Touch release
- `keyPressed()` - Teclado físico

**Dependencias:** state.js, ui-telefono.js, ui-headset.js, ui-components.js

---

### `sketch.js` (Principal) 🔄
**Contenido:**
- Variables globales compartidas
- `preload()` - Carga assets
- `setup()` - Configuración inicial
- `draw()` - Loop principal
- `windowResized()` - Maneja resize

**Dependencias:** TODOS los módulos

---

## 📋 Orden de Carga (index.html)

```html
<!-- Librerías externas -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.10/p5.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.10/addons/p5.sound.js"></script>

<!-- Módulos del proyecto (en orden de dependencias) -->
<script src="js/constants.js"></script>      <!-- Sin dependencias -->
<script src="js/background.js"></script>     <!-- Solo p5.js -->
<script src="js/audio.js"></script>          <!-- constants.js -->
<script src="js/state.js"></script>          <!-- constants.js, audio.js -->
<script src="js/ui-telefono.js"></script>    <!-- constants.js, state.js, audio.js -->
<script src="js/ui-headset.js"></script>     <!-- state.js, audio.js -->
<script src="js/ui-components.js"></script>  <!-- constants.js, state.js -->
<script src="js/interactions.js"></script>   <!-- Todos los UI -->
<script src="sketch.js"></script>            <!-- Principal (último) -->
```

## 🎯 Estado Actual

- ✅ `constants.js` - Completado
- ✅ `background.js` - Completado
- 🔄 Resto de módulos - En proceso

## 🔧 Próximos Pasos

1. Extraer módulo audio.js
2. Extraer módulo state.js  
3. Extraer módulos UI (telefono, headset, components)
4. Extraer módulo interactions.js
5. Actualizar sketch.js principal
6. Actualizar index.html
7. Probar funcionalidad completa
