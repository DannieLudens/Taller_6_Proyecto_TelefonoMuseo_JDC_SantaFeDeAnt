# 🏛️ Vitrina Interactiva - Museo Juan del Corral

<div align="center">

![p5.js](https://img.shields.io/badge/p5.js-v1.11.10-ED225D?logo=p5.js&logoColor=white)
![Estado](https://img.shields.io/badge/Estado-v2.5%20Stable-green)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

**Sistema de narrativas secuenciales automáticas con iluminación dinámica**

[Demo](#) • [Documentación](#características) • [Proyecto Teléfono](../TelefonoMuseo/README.md)

</div>

---

## 📖 Sobre el Proyecto

Experiencia museográfica interactiva de **vitrina inteligente** desarrollada para el **Museo Juan del Corral** en Santa Fe de Antioquia, Colombia. El sistema detecta la presencia de visitantes mediante sensores de proximidad y automáticamente reproduce narrativas secuenciales de 3 objetos patrimoniales, acompañadas de iluminación dinámica que guía la atención del visitante.

### 🎭 Objetos Exhibidos
- **Camisa Indígena** con ilustraciones de mapa
- **Máscara de los Diablitos** (celebración de diciembre)
- **Muñeco Curandero** de la cultura Cuna

### 🎯 Contexto Académico

Proyecto de **Taller 6 para la Experiencia de Usuario en Museos**  
📚 Universidad Pontificia Bolivariana - Ingeniería en Diseño de Entretenimiento Digital  
👥 Equipo multidisciplinario enfocado en tecnologías interactivas para museos

---

## ✨ Características (v2.5)

### 🎨 Sistema Visual Modular
- **3 layouts de vitrina** intercambiables:
  - Layout 1: Vitrinas individuales (3 vitrinas separadas)
  - Layout 2: Vitrina horizontal (objetos en línea)
  - Layout 3: Niveles diferentes (objetos escalonados)
- **Vitrina realista** con marco de madera y vidrio reflectante
- **3 objetos patrimoniales** con imágenes PNG reales y aspect ratio preservado
- **Iluminación LED dinámica** por objeto dentro de cada vitrina
- **Tarimillas con texto** (nombre + descripción) en negro legible
- **Bocinas con indicadores LED verdes**:
  - Individuales por vitrina (Layout 1)
  - Compartida con LED pulsante (Layouts 2-3)
- **Diseño responsive** adaptable a diferentes pantallas

### 🔊 Sistema de Audio
- **Narrativas personificadas** para cada objeto (estilo "voz del objeto")
- **Reproducción secuencial automática** de izquierda a derecha
- **Control de volumen** con slider visual
- **Pausas configurables** entre narrativas (2 segundos por defecto)

### 🤖 Sistema de Detección Automática
- **Sensor de proximidad** (simulado por mouse, integrable con Arduino)
- **Timer de activación**: 5 segundos de presencia detectada
- **Secuencia automática completa**: recorre todos los objetos sin intervención
- **Cooldown inteligente**: 5 segundos antes de reiniciar

---

## 🎮 Flujo de Funcionamiento

```
                           ┌─────────────┐
                           │    IDLE     │
                           │  Esperando  │
                           └──────┬──────┘
                                  │
                    Visitante detectado (mouse sobre vitrina)
                                  │
                                  ▼
                         ┌─────────────┐
                         │  DETECTING  │
                         │   5 seg.    │◄──── Timer visible
                         └──────┬──────┘
                                │
                        Tiempo cumplido
                                │
                                ▼
                    ┌───────────────────┐
                    │ PLAYING_NARRATIVE │
                    │   Objeto 1 🏺     │──► Luz 25% → 65%
                    └────────┬──────────┘      Audio narrativa
                             │
                    Audio termina + 2seg
                             │
                             ▼
                    ┌───────────────────┐
                    │  TRANSITIONING    │
                    │  Cambio → Obj 2   │──► Luz 1: 65% → 25%
                    └────────┬──────────┘      Luz 2: 25% → 65%
                             │
                         Repetir hasta
                        último objeto
                             │
                             ▼
                    ┌───────────────────┐
                    │    COOLDOWN       │
                    │   5 segundos      │──► Todas luces → 25%
                    └────────┬──────────┘
                             │
                    Regreso automático
                             │
                             ▼
                         [IDLE]
```

---

## 🛠️ Configuración de Objetos

### Editar `js/constants.js` - Array de objetos:

```javascript
const objetos = [
  {
    nombre: "Camisa Indígena",
    descripcion: "Ilustraciones de mapa",
    narrativa: null,
    audioFile: "Camisa Indigena con ilustraciones de mapa.mp3",
    imageFile: "camisa indigena.png",
    imagen: null,
    posX: 25,  // Posición en % (0-100)
    color: [180, 120, 80]
  },
  // ... 3 objetos totales
];
```

### Agregar Nuevos Objetos:

1. **Audio MP3**: Coloca en `assets/sounds/`
2. **Imagen PNG/JPG**: Coloca en `assets/images/`
3. **Agregar al array**: Edita `objetos` en `js/constants.js`
4. **Ajustar posX**: Distribuye entre 0-100 para espaciado visual

---

## 🎯 Mejoras Implementadas

### v2.5 - Bocinas e Indicadores (Última versión)
- ✅ Bocinas individuales en Layout 1 con LED verde
- ✅ Bocina compartida en Layouts 2-3 con LED pulsante
- ✅ Posicionamiento preciso (baseY + 22)
- ✅ Aspect ratio preservado en imágenes de objetos
- ✅ Tarimilla única en layouts compartidos

### v2.4 - LEDs Inteligentes
- ✅ LEDs posicionados dentro del vidrio
- ✅ Comportamiento basado en intensidad de iluminación
- ✅ Transiciones suaves entre estados

### v2.3 - Comportamiento Narrativo
- ✅ Detección por vitrina individual en Layout 1
- ✅ Comportamiento unificado en Layouts 2-3
- ✅ Timers independientes por vitrina

### v2.2 - UX Mejorada
- ✅ Barra de progreso compacta (lado izquierdo)
- ✅ Recuadro de estado reposicionado
- ✅ Controles agrupados visualmente

### v2.1 - Ajustes Visuales
- ✅ 3 objetos finales seleccionados
- ✅ Imágenes PNG reales integradas
- ✅ Textos en negro sobre tarimillas claras

### v2.0 - Refactorización Modular
- ✅ Código dividido en 9 módulos especializados
- ✅ Mantenibilidad mejorada
- ✅ Separación de responsabilidades

---

## 🚀 Cómo Ejecutar

### Opción 1: Live Server (VS Code)
```bash
# Instalar extensión "Live Server"
# Click derecho en index.html → "Open with Live Server"
```

### Opción 2: Python
```bash
cd VitrinaMuseo
python -m http.server 8000
# Abrir http://localhost:8000
```

### Opción 3: Node.js
```bash
npx http-server -p 8000
```

---

## 📁 Estructura del Proyecto (v2.5 - Modularizado)

```
VitrinaMuseo/
├── index.html                # Punto de entrada
├── sketch_new.js             # Sketch principal modularizado
├── style.css                 # Estilos básicos
├── README.md                 # Este archivo (consolidado)
├── js/                       # Módulos JavaScript
│   ├── constants.js          # Constantes y configuraciones
│   ├── state.js              # Máquina de estados
│   ├── audio.js              # Sistema de audio
│   ├── background.js         # Renderizado de fondo
│   ├── ui-vitrina.js         # Componentes de vitrina (vidrio, base, LEDs, bocinas)
│   ├── ui-objects.js         # Objetos, tarimillas, luces
│   ├── ui-controls.js        # Controles (volumen, layout, background)
│   ├── ui-status.js          # Indicadores de estado
│   ├── interactions.js       # Detección de proximidad
│   └── README.md             # Documentación de módulos
└── assets/
    ├── sounds/               # Narrativas de objetos
    │   ├── Camisa Indigena con ilustraciones de mapa.mp3
    │   ├── Mascara de los diablitos celebracion de diciembre .mp3
    │   └── Muñeco curandero de la cultura cuna para los enfermos.mp3
    └── images/               # Imágenes PNG de objetos
        ├── camisa indigena.png
        ├── mascara diablitos.png
        └── muneco curandero.png
```

---

## 🎯 Instrucciones de Uso

### Modo Desarrollo (Simulación):
1. **Abrir en navegador** con servidor local
2. **Mover mouse sobre la vitrina** para simular sensor de proximidad
3. **Mantener 5 segundos** sobre la vitrina para activar secuencia
4. **Observar** la iluminación secuencial y las narrativas
5. **Ajustar volumen** con el slider en la esquina inferior derecha

### Modo Producción (Sensor Real):
1. **Conectar sensor de proximidad** (ultrasónico o infrarrojo) a Arduino
2. **Modificar función `mouseMoved()`** para leer datos del sensor vía Serial
3. **Calibrar distancia** de activación según espacio del museo
4. **Instalar** en computadora conectada a pantalla y bocinas

---

## 🔧 Integración con Hardware

### Sensor de Proximidad Arduino:

```javascript
// Reemplazar mouseMoved() por lectura serial
let serial;

function setup() {
  // ... código existente
  serial = new p5.SerialPort();
  serial.open('COM3'); // Puerto del Arduino
  serial.on('data', serialEvent);
}

function serialEvent() {
  let distance = serial.read();
  if (distance < 50) { // 50cm threshold
    proximityDetected = true;
  } else {
    proximityDetected = false;
  }
}
```

### Arduino Sketch Ejemplo:

```cpp
const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  long duration, distance;
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
  
  Serial.println(distance);
  delay(100);
}
```

---

## 🎨 Personalización

### Cambiar Layout:
Usa los botones en pantalla o modifica `currentLayout` en `js/constants.js`:
```javascript
let currentLayout = LAYOUTS.INDIVIDUAL; // INDIVIDUAL, HORIZONTAL, LEVELS
```

### Tiempos de Secuencia (js/constants.js):
```javascript
const TIMINGS = {
  DETECTION_THRESHOLD: 5000,  // 5 seg. para activar
  TRANSITION_DELAY: 3000,     // 3 seg. entre objetos
  COOLDOWN_DELAY: 3000        // 3 seg. antes de reiniciar
};
```

### Intensidad de Luces (js/constants.js):
```javascript
const LIGHTING = {
  IDLE: 0.25,    // 25% en reposo
  ACTIVE: 0.85   // 85% al narrar
};
```

### Colores (js/constants.js):
```javascript
const COLORS = {
  WOOD: [139, 90, 60],
  GLASS: [200, 230, 255, 60],
  // ... etc
};
```

---

## 🤝 Cómo Contribuir

1. **Fork** el repositorio
2. Crea una **branch**: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Agregar funcionalidad'`
4. **Push**: `git push origin feature/nueva-funcionalidad`
5. Abre un **Pull Request**

---

## 📝 Arquitectura Técnica

### Máquina de Estados (5 estados)
```
IDLE → DETECTING → PLAYING_NARRATIVE → TRANSITIONING → COOLDOWN → [loop]
```

### Sistema de Iluminación
- Cada objeto tiene luz independiente con intensidad actual y objetivo
- Animación suave con `lerp(current, target, 0.05)`
- Transiciones automáticas entre objetos

### Detección de Proximidad
- **Modo desarrollo**: Mouse sobre vitrina
- **Modo producción**: Sensor físico vía serial o API

---

## 🎓 Conceptos Educativos Implementados

- **Storytelling inmersivo**: Narrativas en primera persona (objetos hablan)
- **Atención guiada**: Iluminación focal dirige la mirada del visitante
- **Secuencia no intrusiva**: Automática pero respeta el ritmo de los audios
- **Accesibilidad**: Control de volumen visible, sin interacción compleja

---

## 📊 Especificaciones Técnicas

| Característica | Valor |
|---------------|-------|
| Framework | p5.js v1.11.10 + p5.sound |
| Objetos exhibidos | 3 (Camisa, Máscara, Muñeco) |
| Layouts disponibles | 3 (Individual, Horizontal, Niveles) |
| Resolución recomendada | 1400×900 o superior |
| Formato audio | MP3 (narrativas reales) |
| Formato imágenes | PNG (con transparencia preservada) |
| Arquitectura | Modular (9 archivos JS) |
| Sensor recomendado | Ultrasónico HC-SR04 o IR |
| Rango de detección | 30-100cm (ajustable) |

---

## 📂 Assets Incluidos

### Audios (assets/sounds/)
- ✅ `Camisa Indigena con ilustraciones de mapa.mp3`
- ✅ `Mascara de los diablitos celebracion de diciembre .mp3`
- ✅ `Muñeco curandero de la cultura cuna para los enfermos.mp3`

### Imágenes (assets/images/)
- ✅ `camisa indigena.png`
- ✅ `mascara diablitos.png`
- ✅ `muneco curandero.png`

**Nota**: Las imágenes mantienen su proporción original (aspect ratio) al renderizarse.

---

## 📧 Contacto

**Repositorio:** [github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt](https://github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt) - Carpeta: `/VitrinaMuseo/`  
**Proyecto relacionado:** [Teléfono Museo](../TelefonoMuseo/README.md)  
**Issues:** [Reportar problema](https://github.com/DannieLudens/Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt/issues)

---

<div align="center">

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub ⭐**

Hecho con ❤️ para preservar y compartir la historia de Santa Fe de Antioquia

</div>
