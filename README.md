# 📞 Simulador de Teléfono - Museo Juan del Corral

<div align="center">

![p5.js](https://img.shields.io/badge/p5.js-v1.11.10-ED225D?logo=p5.js&logoColor=white)
![Estado](https://img.shields.io/badge/Estado-Prototipo%20Funcional-success)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

**Experiencia interactiva inmersiva para conectar visitantes con personajes históricos de Santa Fe de Antioquia**

[Demo en Vivo](https://editor.p5js.org/DanieLudens/full/qBaePigQs) • [Documentación](#características) • [Contribuir](#cómo-contribuir)

</div>

---

## 📖 Sobre el Proyecto

Prototipo de exhibición museográfica interactiva desarrollado para el **Museo Juan del Corral** en Santa Fe de Antioquia, Colombia. Los visitantes podrán "llamar" a personajes históricos, cercanos a ellos y/o locales usando un teléfono antiguo, escuchando narrativas auténticas sobre sus vidas, vivencias, oficios para darle voz a las personas detrás de la historia viva de Santa Fe de Antioquia y de esta manera que los visitantes conecten con sus historias y tradiciones.

### 🎯 Contexto Académico

Proyecto de **Taller 6 para la Experiencia de Usuario en Museos**  
📚 Universidad Pontificia Bolivariana - Ingeniería en Diseño de Entretenimiento Digital  
👥 Equipo multidisciplinario enfocado en la preservación del patrimonio cultural y religioso de Santa Fe de Antioquia con tecnologías interactivas

---

## ✨ Características

### 🎨 Interfaz Visual
- **Dos estilos de teléfono** (switchable en tiempo real):
  - 🔢 **Teléfono de botones** (años 80) - teclado 4×3 estilo vintage
  - 📞 **Teléfono rotatorio** (años 50-60) - disco circular con agujeros numerados
- **Toggle visual** en esquina superior izquierda para cambiar entre estilos
- **Headset arrastrable** con escalado dinámico y rotación
- **Cable en espiral** con bezier y animación
- **Directorio visual** con 4 personajes activos
- **Imágenes de persona** con inmersión (rostro con máscara redondeada + mano)
- **Diseño responsive** adaptable a tablets y móviles (en fase de mejora)
- **Control de volumen visual** con slider interactivo
- **Indicadores de estado** en tiempo real y consola (estado actual, instrucciones, timers)

### 🔊 Sistema de Audio
- **Tonos DTMF realistas** generados con osciladores p5.sound (feedback al presionar teclas)
- **Sonidos del sistema** (archivos MP3 reales):
  - `pickup_phone.mp3`: Al levantar el headset (500ms delay antes de dial tone)
  - `hangup_phone.mp3`: Al colgar el headset
  - `error_call_phone.mp3`: Loop continuo en números incorrectos o timeout
- **4 personajes completos** con narrativas auténticas (5 audios cada uno):
  - 1 introducción personalizada
  - 1 menú de opciones (se reproduce 2 veces con pausa de 3s)
  - 3 temas narrativos expandidos (16-45 segundos cada uno)
- **Control de volumen unificado** que afecta todos los audios (MP3 + osciladores) en tiempo real
- **Callbacks inteligentes** que mantienen el flujo conversacional y previenen errores de estado

### 🎭 Personajes Implementados
1. **Mujer Anónima** - Época Colonial (Tel: 1234)
2. **Campesino Indígena Desplazado** (Tel: 2345)
3. **Afrodescendiente Colonial** (Tel: 3456)
4. **Sepulturero Tradicional** (Tel: 4567)
5. *(5to 6to y 7mo personaje pendiente de audio)*

### 🔄 Flujo de Interacción
```
Levantar headset → Escuchar tono de marcado → Marcar 4 dígitos 
→ Tono de llamada (ringing) → Introducción del personaje → Menú de 3 opciones (loop 2x)
→ Seleccionar tema (1/2/3) durante opciones o en timeout de 5s 
→ Escuchar narrativa → Pausa 3s → Volver a opciones (loop)
→ Si no eliges opción en 5s: Tono de error continuo (debes colgar manualmente)
→ Colgar arrastrando headset al teléfono
```

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local (extension de VSC Live Server,)
- **Importante**: No funciona abriendo directamente `index.html` (por políticas CORS de audio)

### Opción 1: VS Code + Live Server (Recomendado)
```bash
# 1. Clonar el repositorio
git clone https://github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt.git

# 2. Abrir en VS Code
code Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt

# 3. Instalar extensión "Live Server" de Ritwick Dey
# 4. Click derecho en index.html → "Open with Live Server"
```

### Opción 2: Python HTTP Server
```bash
# Desde la carpeta del proyecto:
python -m http.server 8000

# Abrir en navegador: http://localhost:8000
```

### Opción 3: Node.js http-server
```bash
npx http-server -p 8000
```

---

## 📁 Estructura del Proyecto

```
Taller_6_ProyectoTelefonoMuseo/
├── index.html                    # Punto de entrada HTML
├── sketch.js                     # Lógica principal (~1400 líneas)
├── style.css                     # Estilos CSS básicos
├── README.md                     # Este archivo
├── .github/
│   └── copilot-instructions.md   # Instrucciones para AI coding agents
└── assets/
    ├── images/
    │   ├── persona_rostro.png    # Rostro con máscara redondeada
    │   └── persona_mano.png      # Mano sosteniendo headset
    └── sounds/
        ├── pickup_phone.mp3
        ├── hangup_phone.mp3
        ├── error_call_phone.mp3
        └── personajes/
            ├── Per_1_Intro_MujerAnonColonia.mp3
            ├── Per_1_Opciones_MujerAnonColonia.mp3
            ├── Per_1_Tema_1_MujerAnonColonia.mp3
            ├── Per_1_Tema_2_MujerAnonColonia.mp3
            ├── Per_1_Tema_3_MujerAnonColonia.mp3
            ├── Per_2_*.mp3 (mismo patrón)
            ├── Per_3_*.mp3
            └── Per_4_*.mp3
```

---

## 🎮 Instrucciones de Uso

### En Desktop
1. **Click** en cualquier parte para activar audio (requerido por navegadores)
2. **[OPCIONAL]** Click en el toggle (🔢/📞) superior izquierdo para cambiar entre:
   - **Teléfono de botones**: Click directo en números
   - **Teléfono rotatorio**: Arrastra el agujero numérico hasta el tope y suelta
3. **Arrastra** el headset hacia la oreja de la persona (se escala dinámicamente)
4. **Marca el número**:
   - **Botones**: Click en cada dígito
   - **Rotatorio**: Arrastra cada dígito hacia el tope, espera el regreso automático
5. **Durante la llamada**: Puedes presionar 1, 2 o 3 en cualquier momento para seleccionar opciones
6. **Ajusta el volumen** con el slider en la parte inferior derecha
7. **Para colgar**: Arrastra el headset de vuelta al teléfono (cerca del origen)

### En Móvil/Tablet
1. **Tap** en la pantalla para activar audio (aparecerá mensaje de activación)
2. **[OPCIONAL]** Tap en el toggle para cambiar estilo de teléfono
3. **Tap y arrastra** el headset hacia arriba/derecha
4. **Marca**:
   - **Botones**: Tap en los números
   - **Rotatorio**: Tap y arrastra el agujero, suelta para que regrese
5. **Tap** en 1, 2 o 3 durante las opciones
6. **Para colgar**: Arrastra el headset de vuelta hacia el teléfono

### ⚠️ Notas Importantes
- **Timeout de opciones**: Si no seleccionas una opción en 5 segundos, sonará el tono de error continuo. Debes colgar manualmente.
- **Estado de error**: No hay auto-hangup en error. El usuario debe colgar manualmente arrastrando el headset.
- **Volumen**: El slider controla todos los audios (MP3 y tonos sintéticos) en tiempo real.

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| [p5.js](https://p5js.org/) | 1.11.10 | Framework gráfico principal |
| [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) | 1.11.10 | Sistema de audio y osciladores |
| HTML5 Canvas | - | Renderizado 2D |
| JavaScript ES6 | - | Lógica de aplicación |

---

## 🎨 Personalización

### Agregar un Nuevo Personaje

**1. Agregar al array de personajes** (`sketch.js` ~línea 29):
```javascript
const personajes = [
  // ... personajes existentes
  { nombre: "Nuevo Personaje", oficio: "Su Oficio", telefono: "7890" }
];
```

**2. Agregar archivos de audio** en `assets/sounds/personajes/`:
```
Per_5_Intro_NuevoPersonaje.mp3
Per_5_Opciones_NuevoPersonaje.mp3
Per_5_Tema_1_NuevoPersonaje.mp3
Per_5_Tema_2_NuevoPersonaje.mp3
Per_5_Tema_3_NuevoPersonaje.mp3
```

**3. Cargar en `preload()`** (~línea 110):
```javascript
personajeAudios[5] = {
  intro: loadSound('assets/sounds/personajes/Per_5_Intro_NuevoPersonaje.mp3'),
  opciones: loadSound('assets/sounds/personajes/Per_5_Opciones_NuevoPersonaje.mp3'),
  tema1: loadSound('assets/sounds/personajes/Per_5_Tema_1_NuevoPersonaje.mp3'),
  tema2: loadSound('assets/sounds/personajes/Per_5_Tema_2_NuevoPersonaje.mp3'),
  tema3: loadSound('assets/sounds/personajes/Per_5_Tema_3_NuevoPersonaje.mp3')
};
```

### Ajustar Colores del Teléfono
```javascript
// sketch.js, función drawTelefono()
fill(245, 240, 220);  // Color crema principal
stroke(180, 170, 150); // Borde
```

---

## 🤝 Cómo Contribuir

### Para Miembros del Equipo
1. **Fork** el repositorio
2. Crea una **branch** para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a la branch: `git push origin feature/nueva-funcionalidad`
5. Abre un **Pull Request**

### Reportar Bugs
Usa las [GitHub Issues](../../issues) con la etiqueta `bug` e incluye:
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si es posible
- Navegador y versión

---

## 📝 Arquitectura Técnica

### Máquina de Estados (10 estados)
```
IDLE → DIAL_TONE → DIALING → CALLING_RINGING → CALLING_INTRO 
→ CALLING_OPCIONES → WAITING_OPTION → CALLING_TEMA → [loop] 
→ ERROR / BUSY
```

### Sistema de Coordenadas Responsive
```javascript
let scale = min(width/1200, height/800);
// Todas las posiciones usan: valor * scale
```

### Patrón de Audio
- Tonos sintéticos: `p5.Oscillator` (DTMF, dial tone)
- Efectos: Archivos MP3 con callbacks `.onended()`
- Control de volumen: Variable global `masterVolume` (0-1) que afecta todos los audios
- Validaciones: Todas las funciones de audio verifican estado y personaje válido antes de reproducir
- No auto-hangup en ERROR: El usuario debe colgar manualmente


## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## � Cambios Recientes (v1.2)

### Sistema de Estilos Duales de Teléfono
**Nueva característica principal:** Los visitantes ahora pueden elegir entre dos estilos visuales de teléfono:

#### 📞 Teléfono Rotatorio (Años 50-60)
- Disco circular giratorio con 10 agujeros numerados (0-9)
- Interacción drag-and-return: arrastra el dedo hasta el tope, suelta y el disco regresa automáticamente
- Animación suave de rotación usando lerp
- Tope físico (finger stop) para limitar la rotación
- Mismo flujo de estado y audio que el teléfono de botones

#### 🔢 Teléfono de Botones (Años 80)
- Teclado 4×3 tradicional con botones cuadrados oscuros
- Click directo en cada botón
- Hover effect en botones válidos
- Mantiene todas las características anteriores

#### 🔄 Toggle de Estilo
- Botón de cambio en esquina superior izquierda
- Indica el estilo activo con color azul
- Iconos: 🔢 Botones / 📞 Rotatorio
- Cambio instantáneo sin perder estado de llamada

### Implementación Técnica
```javascript
// Variable global de estilo
phoneStyle = 'buttons' | 'rotary'

// Dispatcher pattern
function drawTelefono(scaleRatio) {
  if (phoneStyle === 'buttons') drawTelefonoButtons(scaleRatio);
  else if (phoneStyle === 'rotary') drawTelefonoRotary(scaleRatio);
}

// Variables de estado rotatorio
rotaryAngle = 0              // Ángulo actual
targetRotaryAngle = 0        // Ángulo objetivo (lerp)
isDraggingDial = false       // Usuario arrastrando
currentDialNumber = null     // Número seleccionado
isReturning = false          // Animación de regreso
dialStartAngle = 0           // Ángulo inicial del drag
rotaryDialBounds = {}        // Hit detection
```

### Funciones Agregadas
- `drawTelefonoRotary(scaleRatio)` - Renderiza disco giratorio
- `drawRotaryDial(scaleRatio)` - Dibuja disco con números
- `drawStyleToggle(scaleRatio)` - Botón de cambio de estilo
- `handleRotaryClick(mx, my)` - Detecta click en agujero numérico
- `handleRotaryDrag()` - Maneja rotación durante drag

### Cambios en Eventos Existentes
- `mousePressed()`: Detecta click en toggle + inicio de drag en disco
- `mouseDragged()`: Maneja rotación del disco rotatorio
- `mouseReleased()`: Anima regreso del disco + registra número marcado

---

## 🔄 Cambios Recientes (v1.1)

### Mejoras de Audio y Volumen

**Desarrollado por:**  
Equipo de Taller 6 - Ingeniería en Diseño de Entretenimiento Digital  
Universidad Pontificia Bolivariana, Medellín

**Museo Colaborador:**  
Museo Juan del Corral, Santa Fe de Antioquia

**Agradecimientos especiales:**

- Subequipo de Voces Taller 6 por la paciencia y la contribución constante
- Taller 6 por la afinación de objetivos de la propuesta
- Profesores de Taller 6 (nombres por confirmar permiso) por su gestión, dedicación, guía, enseñanza y feedback constante
- Museo Juan del Corral por permitir esta innovación
- Gemini, GTP5, Claude AI (Anthropic) por asistencia en desarrollo inicial
- GitHub Desktop por soporte continuo en desarrollo
- Comunidad de p5.js por documentación y ejemplos


---

## 📧 Contacto

**Repositorio:** [github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt](https://github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt)  
**Issues:** [Reportar un problema](../../issues)  

---

<div align="center">

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub ⭐**

Hecho con ❤️ para preservar y compartir la historia de Santa Fe de Antioquia

</div>
