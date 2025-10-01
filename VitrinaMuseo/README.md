# 🏛️ Vitrina Interactiva - Museo Juan del Corral

<div align="center">

![p5.js](https://img.shields.io/badge/p5.js-v1.11.10-ED225D?logo=p5.js&logoColor=white)
![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

**Sistema de narrativas secuenciales automáticas con iluminación dinámica**

[Demo](#) • [Documentación](#características) • [Proyecto Teléfono](../TelefonoMuseo/README.md)

</div>

---

## 📖 Sobre el Proyecto

Experiencia museográfica interactiva de **vitrina inteligente** desarrollada para el **Museo Juan del Corral** en Santa Fe de Antioquia, Colombia. El sistema detecta la presencia de visitantes mediante sensores de proximidad y automáticamente reproduce narrativas secuenciales de 1-6 objetos, acompañadas de iluminación dinámica que guía la atención del visitante.

### 🎯 Contexto Académico

Proyecto de **Taller 6 para la Experiencia de Usuario en Museos**  
📚 Universidad Pontificia Bolivariana - Ingeniería en Diseño de Entretenimiento Digital  
👥 Equipo multidisciplinario enfocado en tecnologías interactivas para museos

---

## ✨ Características

### 🎨 Sistema Visual
- **Vitrina de museo realista** con marco de madera y vidrio reflectante
- **1-6 objetos históricos** configurables con representación visual
- **Iluminación dinámica por objeto**:
  - 25% intensidad en reposo
  - 65% intensidad al narrar (iluminación focal)
- **Transiciones suaves** entre narrativas con animaciones lerp
- **Indicador de sensor de proximidad** visual
- **Bocina superior** con LED de actividad
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

### Editar `sketch.js` líneas 17-52:

```javascript
const objetos = [
  {
    nombre: "Vasija Colonial",
    descripcion: "Cerámica del siglo XVIII",
    narrativa: null, // Se carga en preload()
    posX: 15,  // Posición en % (0-100)
    color: [180, 120, 80] // RGB del objeto
  },
  // ... hasta 6 objetos
];
```

### Agregar Audios:

Coloca archivos MP3 en `assets/sounds/` con el formato:
- `objeto_1_narrativa.mp3`
- `objeto_2_narrativa.mp3`
- `objeto_3_narrativa.mp3`
- ...

**Descomenta la línea 61** en `preload()` para cargar audios reales:
```javascript
objetos[i].narrativa = loadSound(audioPath);
```

### Reemplazar Representación Visual:

Para usar imágenes reales de los objetos:
1. Coloca imágenes PNG/JPG en `assets/images/`
2. Carga en `preload()`: `objetoImagen = loadImage('assets/images/objeto.png')`
3. Reemplaza el código de dibujo en `drawObjetos()` (línea 246+)

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

## 📁 Estructura del Proyecto

```
VitrinaMuseo/
├── index.html                # Punto de entrada
├── sketch.js                 # Lógica principal (~650 líneas)
├── style.css                 # Estilos básicos
├── README.md                 # Este archivo
└── assets/
    ├── sounds/               # Narrativas de objetos
    │   ├── objeto_1_narrativa.mp3
    │   ├── objeto_2_narrativa.mp3
    │   └── ...
    └── images/               # Imágenes de objetos (opcional)
        ├── objeto_1.png
        └── ...
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

### Tiempos de Secuencia:

```javascript
// En líneas 13-15
const DETECTION_THRESHOLD = 5000; // 5 seg. para activar
const TRANSITION_DELAY = 2000;    // 2 seg. entre objetos
const COOLDOWN_DELAY = 5000;      // 5 seg. antes de reiniciar
```

### Intensidad de Luces:

```javascript
// En líneas 58-59
const LIGHT_IDLE = 0.25;   // 25% en reposo
const LIGHT_ACTIVE = 0.65; // 65% al narrar
```

### Número de Objetos:

Simplemente agrega/quita elementos del array `objetos` (líneas 17-52). El sistema se ajusta automáticamente.

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
| Objetos soportados | 1-6 configurable |
| Resolución recomendada | 1400×900 o superior |
| Formato audio | MP3 (narrativas) |
| Sensor recomendado | Ultrasónico HC-SR04 o IR |
| Rango de detección | 30-100cm (ajustable) |

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
