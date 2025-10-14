# 📞 Simulador de Teléfono - Museo Juan del Corral# 📞 Simulador de Teléfono - Museo Juan del Corral



<div align="center"><div align="center">



![p5.js](https://img.shields.io/badge/p5.js-v1.11.10-ED225D?logo=p5.js&logoColor=white)![p5.js](https://img.shields.io/badge/p5.js-v1.11.10-ED225D?logo=p5.js&logoColor=white)

![Estado](https://img.shields.io/badge/Estado-Producción-success)![Estado](https://img.shields.io/badge/Estado-Prototipo%20Funcional-success)

![Arquitectura](https://img.shields.io/badge/Arquitectura-Modular-blue)![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

**Experiencia interactiva inmersiva para conectar visitantes con personajes históricos de Santa Fe de Antioquia**

**Experiencia interactiva inmersiva para conectar visitantes con personajes históricos de Santa Fe de Antioquia**

[Demo en Vivo](https://editor.p5js.org/DanieLudens/full/qBaePigQs) • [Documentación](#características) • [Contribuir](#cómo-contribuir)

[Demo en Vivo](https://editor.p5js.org/DanieLudens/full/qBaePigQs) • [Instalación](#-instalación-y-uso) • [Arquitectura](#-arquitectura-modular)

</div>

</div>

---

---

## 📖 Sobre el Proyecto

## 📑 Índice

Prototipo de exhibición museográfica interactiva desarrollado para el **Museo Juan del Corral** en Santa Fe de Antioquia, Colombia. Los visitantes podrán "llamar" a personajes históricos, cercanos a ellos y/o locales usando un teléfono antiguo, escuchando narrativas auténticas sobre sus vidas, vivencias, oficios para darle voz a las personas detrás de la historia viva de Santa Fe de Antioquia y de esta manera que los visitantes conecten con sus historias y tradiciones.

- [Sobre el Proyecto](#-sobre-el-proyecto)

- [Características](#-características)### 🎯 Contexto Académico

- [Instalación y Uso](#-instalación-y-uso)

- [Arquitectura Modular](#-arquitectura-modular)Proyecto de **Taller 6 para la Experiencia de Usuario en Museos**  

- [Estructura de Archivos](#-estructura-de-archivos)📚 Universidad Pontificia Bolivariana - Ingeniería en Diseño de Entretenimiento Digital  

- [Flujo de Interacción](#-flujo-de-interacción)👥 Equipo multidisciplinario enfocado en la preservación del patrimonio cultural y religioso de Santa Fe de Antioquia con tecnologías interactivas

- [Changelog Reciente](#-changelog-octubre-2025)

- [Para Desarrolladores](#-para-desarrolladores)---

- [Backup y Restauración](#-backup-y-restauración)

- [Contribuir](#-cómo-contribuir)## ✨ Características



---### 🎨 Interfaz Visual

- **Dos estilos de teléfono** (switchable en tiempo real):

## 📖 Sobre el Proyecto  - 🔢 **Teléfono de botones** (años 80) - teclado 4×3 estilo vintage

  - 📞 **Teléfono rotatorio** (años 50-60) - disco circular con agujeros numerados

Prototipo de exhibición museográfica interactiva desarrollado para el **Museo Juan del Corral** en Santa Fe de Antioquia, Colombia. Los visitantes podrán "llamar" a personajes históricos usando un teléfono antiguo, escuchando narrativas auténticas sobre sus vidas y oficios, conectando con las historias y tradiciones de la región.- **Toggle visual** en esquina superior izquierda para cambiar entre estilos

- **Headset arrastrable** con escalado dinámico y rotación

### 🎯 Contexto Académico- **Cable en espiral** con bezier y animación

- **Directorio visual** con 4 personajes activos

**Taller 6 para la Experiencia de Usuario en Museos**  - **Imágenes de persona** con inmersión (rostro con máscara redondeada + mano)

📚 Universidad Pontificia Bolivariana - Ingeniería en Diseño de Entretenimiento Digital  - **Diseño responsive** adaptable a tablets y móviles (en fase de mejora)

👥 Equipo multidisciplinario enfocado en la preservación del patrimonio cultural y religioso de Santa Fe de Antioquia con tecnologías interactivas- **Control de volumen visual** con slider interactivo

- **Indicadores de estado** en tiempo real y consola (estado actual, instrucciones, timers)

---

### 🔊 Sistema de Audio

## ✨ Características- **Tonos DTMF realistas** generados con osciladores p5.sound (feedback al presionar teclas)

- **Sonidos del sistema** (archivos MP3 reales):

### 🎨 Interfaz Visual  - `pickup_phone.mp3`: Al levantar el headset (500ms delay antes de dial tone)

- **Dos estilos de teléfono intercambiables** en tiempo real:  - `hangup_phone.mp3`: Al colgar el headset

  - 🔢 **Teléfono de botones** (años 80) - Teclado 4×3 vintage  - `error_call_phone.mp3`: Loop continuo en números incorrectos o timeout

  - 📞 **Teléfono rotatorio** (años 50-60) - Disco circular con agujeros numerados- **4 personajes completos** con narrativas auténticas (5 audios cada uno):

- **Directorio visual** con 4 personajes activos (números telefónicos de 4 dígitos)  - 1 introducción personalizada

- **Headset arrastrable** con escalado dinámico y rotación suave  - 1 menú de opciones (se reproduce 2 veces con pausa de 3s)

- **Cable en espiral animado** con curvas Bezier realistas  - 3 temas narrativos expandidos (16-45 segundos cada uno)

- **Imágenes de persona inmersivas** (rostro + mano con máscaras redondeadas)- **Control de volumen unificado** que afecta todos los audios (MP3 + osciladores) en tiempo real

- **Mesa de madera ovalada** con textura realista (grano, nudos, variaciones)- **Callbacks inteligentes** que mantienen el flujo conversacional y previenen errores de estado

- **Panel de configuración** deslizable con:

  - Control de volumen con slider visual### 🎭 Personajes Implementados

  - Selector de estilo de teléfono1. **Mujer Anónima** - Época Colonial (Tel: 1234)

- **Indicadores de estado** en tiempo real (estado actual, instrucciones, timers)2. **Campesino Indígena Desplazado** (Tel: 2345)

- **Diseño responsive** adaptable a diferentes resoluciones3. **Afrodescendiente Colonial** (Tel: 3456)

4. **Sepulturero Tradicional** (Tel: 4567)

### 🔊 Sistema de Audio5. *(5to 6to y 7mo personaje pendiente de audio)*

- **Tonos DTMF realistas** generados con osciladores p5.sound

- **Sonidos del sistema** (archivos MP3 reales):### 🔄 Flujo de Interacción

  - `pickup_phone.mp3`: Al levantar el auricular```

  - `hangup_phone.mp3`: Al colgar el auricularLevantar headset → Escuchar tono de marcado → Marcar 4 dígitos 

  - `error_call_phone.mp3`: Loop continuo en números incorrectos→ Tono de llamada (ringing) → Introducción del personaje → Menú de 3 opciones (loop 2x)

- **4 personajes completos** con narrativas auténticas:→ Seleccionar tema (1/2/3) durante opciones o en timeout de 5s 

  - 1 introducción personalizada→ Escuchar narrativa → Pausa 3s → Volver a opciones (loop)

  - 1 menú de opciones (se reproduce 2× con pausa de 3s)→ Si no eliges opción en 5s: Tono de error continuo (debes colgar manualmente)

  - 3 temas narrativos expandidos (16-45 segundos c/u)→ Colgar arrastrando headset al teléfono

- **Control de volumen unificado** que afecta todos los audios simultáneamente```

- **Callbacks inteligentes** para flujo conversacional sin interrupciones

---

### 🎭 Personajes Implementados

1. **Mujer Anónima Colonial** (Tel: 1234)## 🚀 Instalación y Uso

2. **Campesino Indígena Desplazado** (Tel: 2345)

3. **Afrodescendiente Colonial** (Tel: 3456)### Prerrequisitos

4. **Sepulturero Tradicional** (Tel: 4567)- Navegador web moderno (Chrome, Firefox, Safari, Edge)

5. *(5to personaje pendiente de audio)*- Servidor local (extension de VSC Live Server,)

- **Importante**: No funciona abriendo directamente `index.html` (por políticas CORS de audio)

---

### Opción 1: VS Code + Live Server (Recomendado)

## 🚀 Instalación y Uso```bash

# 1. Clonar el repositorio

### Prerrequisitosgit clone https://github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt.git

- Navegador web moderno (Chrome, Firefox, Safari, Edge)

- Servidor local (no funciona abriendo `index.html` directamente por políticas CORS)# 2. Abrir carpeta del teléfono en VS Code

cd Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt/TelefonoMuseo

### Opción 1: VS Code + Live Server (Recomendado)code .

```bash

# 1. Clonar el repositorio# 3. Instalar extensión "Live Server" de Ritwick Dey

git clone https://github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt.git# 4. Click derecho en index.html → "Open with Live Server"

```

# 2. Abrir carpeta en VS Code

cd Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt/TelefonoMuseo### Opción 2: Python HTTP Server

code .```bash

# Desde la carpeta TelefonoMuseo:

# 3. Instalar extensión "Live Server" de Ritwick Deycd TelefonoMuseo

# 4. Click derecho en index.html → "Open with Live Server"python -m http.server 8000

```

# Abrir en navegador: http://localhost:8000

### Opción 2: Python HTTP Server```

```bash

cd TelefonoMuseo### Opción 3: Node.js http-server

python -m http.server 8000```bash

# Abrir: http://localhost:8000npx http-server -p 8000

``````



### Opción 3: Node.js http-server---

```bash

npm install -g http-server## 📁 Estructura del Proyecto

cd TelefonoMuseo

http-server -p 8000```

```TelefonoMuseo/

├── index.html                    # Punto de entrada HTML

### 🎮 Cómo Usar├── sketch.js                     # Lógica principal (~1400 líneas)

1. **Click en cualquier parte** de la pantalla (política de autoplay de navegadores)├── style.css                     # Estilos CSS básicos

2. **Arrastra el auricular** hacia arriba para "levantarlo"├── README.md                     # Este archivo

3. **Marca un número** de 4 dígitos del directorio:└── assets/

   - Con botones: Click en teclado    ├── images/

   - Con rotatorio: Arrastra disco y suelta    │   ├── persona_rostro.png    # Rostro con máscara redondeada

4. **Escucha la introducción** del personaje    │   └── persona_mano.png      # Mano sosteniendo headset

5. **Presiona 1, 2 o 3** durante el menú para elegir un tema    └── sounds/

6. **Arrastra el auricular** de vuelta al teléfono para colgar        ├── pickup_phone.mp3

        ├── hangup_phone.mp3

---        ├── error_call_phone.mp3

        └── personajes/

## 🏗️ Arquitectura Modular            ├── Per_1_Intro_MujerAnonColonia.mp3

            ├── Per_1_Opciones_MujerAnonColonia.mp3

El proyecto fue **completamente modularizado en octubre 2025** para mejorar mantenibilidad y escalabilidad.            ├── Per_1_Tema_1_MujerAnonColonia.mp3

            ├── Per_1_Tema_2_MujerAnonColonia.mp3

### Antes vs Después            ├── Per_1_Tema_3_MujerAnonColonia.mp3

            ├── Per_2_*.mp3 (mismo patrón)

| Aspecto | Antes (Monolítico) | Ahora (Modular) |            ├── Per_3_*.mp3

|---------|-------------------|-----------------|            └── Per_4_*.mp3

| **Archivo principal** | 2360 líneas | 140 líneas |```

| **Archivos JavaScript** | 1 archivo | 9 módulos |

| **Mantenibilidad** | ⚠️ Difícil | ✅ Excelente |---

| **Trabajo en equipo** | ⚠️ Conflictos | ✅ Paralelo |

| **Debugging** | ⚠️ Complejo | ✅ Directo |## 🎮 Instrucciones de Uso

| **Funcionalidad** | ✅ 100% | ✅ 100% |

### En Desktop

### 📦 Módulos del Sistema1. **Click** en cualquier parte para activar audio (requerido por navegadores)

2. **[OPCIONAL]** Click en el toggle (🔢/📞) superior izquierdo para cambiar entre:

```   - **Teléfono de botones**: Click directo en números

TelefonoMuseo/   - **Teléfono rotatorio**: Arrastra el agujero numérico hasta el tope y suelta

├── index.html              ← HTML principal (carga 9 módulos)3. **Arrastra** el headset hacia la oreja de la persona (se escala dinámicamente)

├── sketch.js               ← Coordinador p5.js (preload, setup, draw)4. **Marca el número**:

├── style.css               ← Estilos mínimos   - **Botones**: Click en cada dígito

│   - **Rotatorio**: Arrastra cada dígito hacia el tope, espera el regreso automático

├── js/                     ← Módulos organizados5. **Durante la llamada**: Puedes presionar 1, 2 o 3 en cualquier momento para seleccionar opciones

│   ├── constants.js        ← Estados, personajes, DTMF, constantes (50 líneas)6. **Ajusta el volumen** con el slider en la parte inferior derecha

│   ├── background.js       ← Mesa de madera ovalada (120 líneas)7. **Para colgar**: Arrastra el headset de vuelta al teléfono (cerca del origen)

│   ├── audio.js            ← Sistema de audio completo (380 líneas)

│   ├── state.js            ← Máquina de estados (100 líneas)### En Móvil/Tablet

│   ├── ui-telefono.js      ← Teléfono (botones + rotatorio) (380 líneas)1. **Tap** en la pantalla para activar audio (aparecerá mensaje de activación)

│   ├── ui-headset.js       ← Auricular y cable espiral (200 líneas)2. **[OPCIONAL]** Tap en el toggle para cambiar estilo de teléfono

│   ├── ui-components.js    ← Directorio, ajustes, info (350 líneas)3. **Tap y arrastra** el headset hacia arriba/derecha

│   ├── interactions.js     ← Mouse, touch, teclado (240 líneas)4. **Marca**:

│   └── README.md           ← Documentación de arquitectura   - **Botones**: Tap en los números

│   - **Rotatorio**: Tap y arrastra el agujero, suelta para que regrese

├── assets/5. **Tap** en 1, 2 o 3 durante las opciones

│   ├── sounds/             ← MP3s del sistema y personajes6. **Para colgar**: Arrastra el headset de vuelta hacia el teléfono

│   └── images/             ← persona_rostro.png, persona_mano.png

│### ⚠️ Notas Importantes

└── backup/                 ← Código original monolítico- **Timeout de opciones**: Si no seleccionas una opción en 5 segundos, sonará el tono de error continuo. Debes colgar manualmente.

    ├── index.html          ← HTML original- **Estado de error**: No hay auto-hangup en error. El usuario debe colgar manualmente arrastrando el headset.

    ├── sketch.js           ← Código monolítico (2360 líneas)- **Volumen**: El slider controla todos los audios (MP3 y tonos sintéticos) en tiempo real.

    └── README_BACKUP.txt   ← Instrucciones de restauración

```---



### 🔗 Grafo de Dependencias## 🛠️ Tecnologías



```| Tecnología | Versión | Propósito |

constants.js (sin dependencias)|-----------|---------|-----------|

├── background.js (solo p5.js)| [p5.js](https://p5js.org/) | 1.11.10 | Framework gráfico principal |

├── audio.js| [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) | 1.11.10 | Sistema de audio y osciladores |

│   └── state.js| HTML5 Canvas | - | Renderizado 2D |

│       ├── ui-telefono.js| JavaScript ES6 | - | Lógica de aplicación |

│       ├── ui-headset.js

│       └── ui-components.js---

│           └── interactions.js

│               └── sketch.js (coordinador principal)## 🎨 Personalización

```

### Agregar un Nuevo Personaje

### 📋 Descripción de Módulos

**1. Agregar al array de personajes** (`sketch.js` ~línea 29):

#### 1. **constants.js** - Configuración Central```javascript

- Estados de la máquina de estados (`STATES`)const personajes = [

- Array de personajes con datos completos  // ... personajes existentes

- Frecuencias DTMF para tonos telefónicos  { nombre: "Nuevo Personaje", oficio: "Su Oficio", telefono: "7890" }

- Layout del keypad 4×3];

- Timeouts y constantes de tiempo```



#### 2. **background.js** - Fondo de Madera**2. Agregar archivos de audio** en `assets/sounds/personajes/`:

- Generación de textura de mesa ovalada```

- 200 líneas de grano prominentePer_5_Intro_NuevoPersonaje.mp3

- 15 nudos de madera con anillos concéntricosPer_5_Opciones_NuevoPersonaje.mp3

- 40 zonas de variación de brilloPer_5_Tema_1_NuevoPersonaje.mp3

- Máscara elíptica con sombraPer_5_Tema_2_NuevoPersonaje.mp3

Per_5_Tema_3_NuevoPersonaje.mp3

#### 3. **audio.js** - Sistema de Audio Completo```

- Creación de osciladores DTMF duales

- Carga de archivos MP3 (sistema + personajes)**3. Cargar en `preload()`** (~línea 110):

- Funciones de reproducción con callbacks```javascript

- Manejo de tonos (dial, ringing, error)personajeAudios[5] = {

- Control de volumen maestro  intro: loadSound('assets/sounds/personajes/Per_5_Intro_NuevoPersonaje.mp3'),

  opciones: loadSound('assets/sounds/personajes/Per_5_Opciones_NuevoPersonaje.mp3'),

#### 4. **state.js** - Máquina de Estados  tema1: loadSound('assets/sounds/personajes/Per_5_Tema_1_NuevoPersonaje.mp3'),

- `changeState()`: Transiciones con logging  tema2: loadSound('assets/sounds/personajes/Per_5_Tema_2_NuevoPersonaje.mp3'),

- `checkNumber()`: Validación de números marcados  tema3: loadSound('assets/sounds/personajes/Per_5_Tema_3_NuevoPersonaje.mp3')

- `selectOption()`: Manejo de menú (1/2/3)};

- `hangUp()`: Reset completo del sistema```



#### 5. **ui-telefono.js** - Componentes del Teléfono### Ajustar Colores del Teléfono

- Dispatcher `drawTelefono()` (botones/rotatorio)```javascript

- `drawKeypad()`: Teclado 4×3 con hover// sketch.js, función drawTelefono()

- `drawRotaryDial()`: Disco rotatorio con tope fijofill(245, 240, 220);  // Color crema principal

- `pressKey()`: Lógica de marcadostroke(180, 170, 150); // Borde

- Detección de clicks y áreas sensibles```



#### 6. **ui-headset.js** - Auricular y Cable---

- `drawHeadset()`: Dibujo con escala dinámica

- Cable espiral con curvas Bezier## 🤝 Cómo Contribuir

- Horquilla/soporte con switch visual

- `toggleHeadset()`: Levantar/colgar con sonidos### Para Miembros del Equipo

- Animaciones lerp suaves1. **Fork** el repositorio

2. Crea una **branch** para tu feature: `git checkout -b feature/nueva-funcionalidad`

#### 7. **ui-components.js** - Componentes UI3. **Commit** tus cambios: `git commit -m 'Agregar nueva funcionalidad'`

- `drawDirectorio()`: Lista de personajes con teléfonos4. **Push** a la branch: `git push origin feature/nueva-funcionalidad`

- `drawSettingsButton()`: Botón engranaje con hover5. Abre un **Pull Request**

- `drawSettingsPanel()`: Panel deslizable con controles

- `drawCallToAction()`: Mensajes animados contextuales### Reportar Bugs

- `drawEstadoInfo()`: Barra de estado con 2 líneasUsa las [GitHub Issues](../../issues) con la etiqueta `bug` e incluye:

- Pasos para reproducir

#### 8. **interactions.js** - Eventos de Usuario- Comportamiento esperado vs actual

- `mousePressed()`: Clicks en todos los elementos- Screenshots si es posible

- `mouseDragged()`: Arrastre de auricular, slider, disco- Navegador y versión

- `mouseReleased()`: Detección de colgar, soltar disco

- `keyPressed()`: Soporte de teclado físico (0-9, 1-3, ESC)---

- Touch events para móviles

## 📝 Arquitectura Técnica

#### 9. **sketch.js** - Coordinador Principal

- `preload()`: Carga de 23 audios + 2 imágenes### Máquina de Estados (10 estados)

- `setup()`: Inicialización de todos los módulos```

- `draw()`: Orquestación de renderizado (3 capas)IDLE → DIAL_TONE → DIALING → CALLING_RINGING → CALLING_INTRO 

- `windowResized()`: Recreación responsive→ CALLING_OPCIONES → WAITING_OPTION → CALLING_TEMA → [loop] 

- Manejo de timers globales→ ERROR / BUSY

```

---

### Sistema de Coordenadas Responsive

## 🔄 Flujo de Interacción```javascript

let scale = min(width/1200, height/800);

```// Todas las posiciones usan: valor * scale

IDLE → Levantar auricular → DIAL_TONE → Marcar 4 dígitos```

  ↓

¿Válido? → CALLING_RINGING → CALLING_INTRO → CALLING_OPCIONES (2×)### Patrón de Audio

  ↓- Tonos sintéticos: `p5.Oscillator` (DTMF, dial tone)

WAITING_OPTION (5s) → Presionar 1/2/3 → CALLING_TEMA → Pausa 3s → Volver a OPCIONES- Efectos: Archivos MP3 con callbacks `.onended()`

  ↓- Control de volumen: Variable global `masterVolume` (0-1) que afecta todos los audios

Timeout o inválido → ERROR (loop continuo) → Colgar manualmente → IDLE- Validaciones: Todas las funciones de audio verifican estado y personaje válido antes de reproducir

```- No auto-hangup en ERROR: El usuario debe colgar manualmente



### Estados Detallados

## 📄 Licencia

| Estado | Descripción | Acciones Permitidas |

|--------|-------------|---------------------|Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

| `IDLE` | Teléfono esperando | Levantar auricular |

| `DIAL_TONE` | Tono de marcado activo | Marcar números (0-9) |---

| `DIALING` | Marcando número | Completar 4 dígitos |

| `CALLING_RINGING` | Timbrado (aleatorio 3-5s) | Esperar conexión |## � Cambios Recientes (v1.2)

| `CALLING_INTRO` | Introducción del personaje | Escuchar |

| `CALLING_OPCIONES` | Menú de opciones (2×) | Presionar 1/2/3 cualquier momento |### Sistema de Estilos Duales de Teléfono

| `WAITING_OPTION` | Timeout 5s para elegir | Presionar 1/2/3 |**Nueva característica principal:** Los visitantes ahora pueden elegir entre dos estilos visuales de teléfono:

| `CALLING_TEMA` | Reproduciendo narrativa | Escuchar (o colgar) |

| `ERROR` | Número inválido (loop) | Colgar manualmente |#### 📞 Teléfono Rotatorio (Años 50-60)

| `BUSY` | Llamada terminada | Colgar |- Disco circular giratorio con 10 agujeros numerados (0-9)

- Interacción drag-and-return: arrastra el dedo hasta el tope, suelta y el disco regresa automáticamente

---- Animación suave de rotación usando lerp

- Tope físico (finger stop) para limitar la rotación

## 📝 Changelog (Octubre 2025)- Mismo flujo de estado y audio que el teléfono de botones



### 🎉 v2.0.0 - Modularización Completa (14 Oct 2025)#### 🔢 Teléfono de Botones (Años 80)

- Teclado 4×3 tradicional con botones cuadrados oscuros

#### ✨ Nuevas Características- Click directo en cada botón

- **Arquitectura modular**: 9 archivos especializados (vs 1 monolítico)- Hover effect en botones válidos

- **Documentación completa**: README consolidado con todos los detalles- Mantiene todas las características anteriores

- **Sistema de backup**: Código original preservado en `backup/`

#### 🔄 Toggle de Estilo

#### 🎨 Correcciones Visuales- Botón de cambio en esquina superior izquierda

- Indica el estilo activo con color azul

##### 1. **Directorio Restaurado**- Iconos: 🔢 Botones / 📞 Rotatorio

- ❌ **Antes**: Cajas individuales con fondo gris, resaltado amarillo al marcar- Cambio instantáneo sin perder estado de llamada

- ✅ **Ahora**: Diseño original sin cajas, solo líneas separadoras simples

- 📍 Posición: `width*0.18, height*0.25` (260×400px)### Implementación Técnica

```javascript

##### 2. **Botón de Configuración**// Variable global de estilo

- ❌ **Antes**: Posición incorrecta (demasiado a la izquierda)phoneStyle = 'buttons' | 'rotary'

- ✅ **Ahora**: Correctamente a la derecha del directorio (`width*0.08 + 370*scaleRatio`)

// Dispatcher pattern

##### 3. **Headset - Eliminado Snap Automático**function drawTelefono(scaleRatio) {

- ❌ **Antes**: Saltaba automáticamente hacia la oreja al acercarse  if (phoneStyle === 'buttons') drawTelefonoButtons(scaleRatio);

- ✅ **Ahora**: Movimiento libre y suave sin saltos  else if (phoneStyle === 'rotary') drawTelefonoRotary(scaleRatio);

- 📝 **Archivo**: `js/interactions.js` - `mouseDragged()`}



##### 4. **Cuadro de Información**// Variables de estado rotatorio

- ❌ **Antes**: Una sola línea de texto simplerotaryAngle = 0              // Ángulo actual

- ✅ **Ahora**: Dos líneas con formato completo:targetRotaryAngle = 0        // Ángulo objetivo (lerp)

  - **Línea 1 (Bold, color)**: Título del estado con emojiisDraggingDial = false       // Usuario arrastrando

  - **Línea 2 (Normal, gris)**: Instrucción detalladacurrentDialNumber = null     // Número seleccionado

- 📐 Tamaño: 450×90px en `height*0.93`isReturning = false          // Animación de regreso

dialStartAngle = 0           // Ángulo inicial del drag

##### 5. **Teléfono Rotatorio**rotaryDialBounds = {}        // Hit detection

- ✅ Verificado: Tope gris (finger stop) permanece fijo correctamente```

- ✅ Sin cambios necesarios (ya estaba correcto)

### Funciones Agregadas

#### 🔧 Mejoras Técnicas- `drawTelefonoRotary(scaleRatio)` - Renderiza disco giratorio

- Reducción de código: 2360 → 1945 líneas totales (18% optimización)- `drawRotaryDial(scaleRatio)` - Dibuja disco con números

- Separación clara de responsabilidades por módulo- `drawStyleToggle(scaleRatio)` - Botón de cambio de estilo

- Mejor escalabilidad para agregar personajes- `handleRotaryClick(mx, my)` - Detecta click en agujero numérico

- Facilita trabajo en equipo sin conflictos- `handleRotaryDrag()` - Maneja rotación durante drag

- Debugging más directo y rápido

### Cambios en Eventos Existentes

#### 📂 Archivos Modificados- `mousePressed()`: Detecta click en toggle + inicio de drag en disco

- `js/ui-components.js` (3 funciones restauradas)- `mouseDragged()`: Maneja rotación del disco rotatorio

- `js/interactions.js` (snap removido)- `mouseReleased()`: Anima regreso del disco + registra número marcado

- `README.md` (consolidado completo)

---

---

## 🔄 Cambios Recientes (v1.1)

## 👨‍💻 Para Desarrolladores

### Mejoras de Audio y Volumen

### 🛠️ Agregar un Nuevo Personaje

**Desarrollado por:**  

1. **Grabar audios** (5 archivos MP3):Equipo de Taller 6 - Ingeniería en Diseño de Entretenimiento Digital  

   ```Universidad Pontificia Bolivariana, Medellín

   Per_5_Intro_[Nombre].mp3

   Per_5_Opciones_[Nombre].mp3**Museo Colaborador:**  

   Per_5_Tema_1_[Nombre].mp3Museo Juan del Corral, Santa Fe de Antioquia

   Per_5_Tema_2_[Nombre].mp3

   Per_5_Tema_3_[Nombre].mp3**Agradecimientos especiales:**

   ```

- Subequipo de Voces Taller 6 por la paciencia y la contribución constante

2. **Editar `js/constants.js`**:- Taller 6 por la afinación de objetivos de la propuesta

   ```javascript- Profesores de Taller 6 (nombres por confirmar permiso) por su gestión, dedicación, guía, enseñanza y feedback constante

   personajes.push({- Museo Juan del Corral por permitir esta innovación

     nombre: "Nombre del Personaje",- Gemini, GTP5, Claude AI (Anthropic) por asistencia en desarrollo inicial

     oficio: "Profesión u Oficio",- GitHub Desktop por soporte continuo en desarrollo

     telefono: "5678",- Comunidad de p5.js por documentación y ejemplos

     temas: [

       "Título del Tema 1",

       "Título del Tema 2",---

       "Título del Tema 3"

     ]## 📧 Contacto

   });

   ```**Repositorio:** [github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt](https://github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt) - Carpeta: `/TelefonoMuseo/`  

**Issues:** [Reportar un problema](../../issues)  

3. **Cargar audios en `sketch.js`** (función `preload()`):

   ```javascript---

   personajeAudios[5] = {

     intro: loadSound('assets/sounds/personajes/Per_5_Intro_[Nombre].mp3'),<div align="center">

     opciones: loadSound('assets/sounds/personajes/Per_5_Opciones_[Nombre].mp3'),

     tema1: loadSound('assets/sounds/personajes/Per_5_Tema_1_[Nombre].mp3'),**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub ⭐**

     tema2: loadSound('assets/sounds/personajes/Per_5_Tema_2_[Nombre].mp3'),

     tema3: loadSound('assets/sounds/personajes/Per_5_Tema_3_[Nombre].mp3')Hecho con ❤️ para preservar y compartir la historia de Santa Fe de Antioquia

   };

   ```</div>


4. **Probar**: Marcar `5678` y verificar flujo completo

### 🧪 Testing Checklist

- [ ] **Levantar auricular** → Tono de marcado después de 500ms
- [ ] **Marcar número válido** → Timbrado → Intro → Opciones (2×)
- [ ] **Presionar 1/2/3** → Reproduce tema → Pausa 3s → Vuelve a opciones
- [ ] **Timeout 5s sin elegir** → Tono de error (loop continuo)
- [ ] **Colgar durante llamada** → Reset completo a IDLE
- [ ] **Cambiar volumen** → Afecta todos los audios
- [ ] **Cambiar estilo teléfono** → Alterna botones ↔ rotatorio
- [ ] **Teléfono rotatorio** → Tope gris no rota
- [ ] **Directorio** → Sin cajas, solo líneas
- [ ] **Headset** → Sin snap, movimiento suave
- [ ] **Info estado** → 2 líneas con colores

### 🐛 Debugging

**Consola del navegador (F12):**
- Todos los cambios de estado se logean: `[STATE] IDLE → DIAL_TONE`
- Errores de carga de audio visibles
- Callbacks de audio reportan inicio/fin

**Variables útiles en consola:**
```javascript
currentState          // Estado actual (ej: "CALLING_OPCIONES")
dialedNumber          // Número marcado hasta ahora
currentPersonaje      // Objeto del personaje activo
headsetLifted         // true/false
masterVolume          // 0-1
```

### 📐 Convenciones de Código

- **Escala responsive**: Todas las posiciones usan `* scaleRatio`
- **Coordenadas**: Especificadas en "unidades ideales" (ej: `150*scale` no `150px`)
- **Timers**: Incrementan por frame (~60fps), convertir: `timeout / 16.67 = frames`
- **Audio**: Siempre multiplicar por `masterVolume` antes de `.play()`
- **Estados**: Solo cambiar con `changeState()` (nunca `currentState = ...`)

---

## 💾 Backup y Restauración

### 📦 Contenido del Backup

La carpeta `backup/` contiene el código original completo antes de la modularización:

```
backup/
├── index.html              ← HTML original (1 script tag)
├── sketch.js               ← Código monolítico (2360 líneas)
└── README_BACKUP.txt       ← Instrucciones de restauración
```

### 🔄 Cómo Restaurar el Código Original

Si necesitas volver a la versión monolítica (por ejemplo, para comparar comportamientos):

```powershell
cd TelefonoMuseo

# Eliminar versión modular
del index.html
del sketch.js

# Restaurar desde backup
cp backup/index.html .
cp backup/sketch.js .

# Opcional: Eliminar módulos si no los necesitas
# rmdir /s js
```

### ⚠️ Nota Importante
El código en `backup/` es **funcionalmente idéntico** a la versión modular. La única diferencia es la organización del código:
- **Backup**: Todo en un archivo (2360 líneas)
- **Actual**: Dividido en 9 módulos organizados

---

## 🤝 Cómo Contribuir

### 🌟 Áreas de Mejora Sugeridas

1. **Más Personajes**
   - Grabar narrativas del 5to, 6to y 7mo personaje
   - Investigar más historias locales auténticas

2. **Mejoras Visuales**
   - Animaciones más fluidas en transiciones
   - Efectos de partículas al marcar
   - Mejoras en responsive para móviles pequeños

3. **Mejoras de Audio**
   - Reducción de ruido en grabaciones existentes
   - Música de fondo ambiente opcional
   - Efectos de eco/filtro para inmersión

4. **Accesibilidad**
   - Subtítulos opcionales para audio
   - Modo alto contraste
   - Soporte de lector de pantalla

5. **Analytics**
   - Tracking de personajes más populares
   - Tiempo promedio de interacción
   - Temas más escuchados

### 📋 Proceso de Contribución

1. **Fork** el repositorio
2. **Crea una rama** (`git checkout -b feature/nueva-caracteristica`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva característica'`)
4. **Push** a la rama (`git push origin feature/nueva-caracteristica`)
5. **Abre un Pull Request** con descripción detallada

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Equipo

**Universidad Pontificia Bolivariana - Taller 6**  
Ingeniería en Diseño de Entretenimiento Digital

**Museo Juan del Corral**  
Santa Fe de Antioquia, Colombia

---

## 📞 Contacto

Para preguntas sobre el proyecto o colaboraciones:
- 📧 Email: [Contacto UPB]
- 🏛️ Museo: [Información del Museo Juan del Corral]

---

<div align="center">

**Hecho con ❤️ para preservar la memoria histórica de Santa Fe de Antioquia**

[⬆️ Volver arriba](#-simulador-de-teléfono---museo-juan-del-corral)

</div>
