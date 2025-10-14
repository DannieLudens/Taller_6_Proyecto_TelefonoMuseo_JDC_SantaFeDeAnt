# 🏛️ Experiencias Interactivas - Museo Juan del Corral

<div align="center">

![p5.js](https://img.shields.io/badge/p5.js-v1.11.10-ED225D?logo=p5.js&logoColor=white)
![Estado](https://img.shields.io/badge/Estado-Producci%C3%B3n-success)
![Museos](https://img.shields.io/badge/Museos-Tecnolog%C3%ADa%20Interactiva-blue)

**Tecnologías interactivas para preservar y compartir el patrimonio cultural de Santa Fe de Antioquia**

</div>

---

## 🎯 Descripción

Colección de **experiencias museográficas interactivas** desarrolladas para el **Museo Juan del Corral** en Santa Fe de Antioquia, Colombia. Cada proyecto utiliza tecnología web moderna para crear conexiones emocionales entre visitantes y la historia local.

### 📱 Proyectos Incluidos

| Proyecto | Estado | Descripción | Tipo de Interacción |
|----------|--------|-------------|-------------------|
| **[📞 TelefonoMuseo](TelefonoMuseo/)** | ✅ **Producción** | Teléfono vintage 1980s para "llamar" a personajes históricos (4 disponibles) | **Activa** - Usuario marca números 4 dígitos |
| **[🏛️ VitrinaMuseo](VitrinaMuseo/)** | ✅ **v2.5 Stable** | Vitrina inteligente con narrativas automáticas (3 objetos patrimoniales) | **Pasiva** - Sensor de proximidad |

---

## 🚀 Inicio Rápido

### Opción 1: Teléfono Interactivo (Listo para usar)
```bash
cd TelefonoMuseo
python -m http.server 8000
# Abrir: http://localhost:8000
```

### Opción 2: Vitrina Automática (En desarrollo)
```bash
cd VitrinaMuseo  
python -m http.server 8001
# Abrir: http://localhost:8001
```

---

## 🏫 Contexto Académico

**Taller 6 - Experiencia de Usuario en Museos**  
Universidad Pontificia Bolivariana  
Ingeniería en Diseño de Entretenimiento Digital

### 🎭 Objetivos
- Preservar el patrimonio cultural de Santa Fe de Antioquia
- Crear experiencias inmersivas con tecnología accesible
- Facilitar conexiones emocionales entre visitantes e historia local
- Innovar en museografía digital interactiva

---

## 📚 Documentación Completa

### 📞 Proyecto Teléfono Museo
- **[README Principal](TelefonoMuseo/README.md)**: Documentación completa del sistema
- **Características**:
  - Teléfono vintage estilo 1980s (color crema)
  - 4 personajes históricos con audio real
  - Sistema de marcado con tonos DTMF
  - Menú de opciones por personaje (3 temas cada uno)
  - Auricular móvil con cable espiral
  - Imágenes de persona interactuando

### 🏛️ Proyecto Vitrina Museo  
- **[README Principal](VitrinaMuseo/README.md)**: Documentación actualizada v2.5
- **[Documentación Histórica](VitrinaMuseo/docs/)**: Registro de versiones y cambios
- **Características**:
  - 3 layouts intercambiables (Individual, Horizontal, Niveles)
  - 3 objetos patrimoniales con imágenes PNG reales
  - Sistema de iluminación LED dinámico
  - Bocinas con indicadores LED verdes
  - Narrativas automáticas por objeto
  - Arquitectura modular (9 módulos JS)

---

## 🛠️ Tecnologías

### Frontend
- **p5.js v1.11.10**: Framework de gráficos y animación
- **p5.sound**: Síntesis de audio (DTMF) y reproducción de archivos
- **HTML5 + CSS3**: Estructura e interfaz responsive
- **JavaScript (ES6+)**: Lógica de aplicación

### Assets
- **Audio MP3**: Narrativas auténticas grabadas profesionalmente
- **Imágenes PNG**: Fotografías de objetos patrimoniales y personas
- **Fuentes del sistema**: Sin dependencias externas de tipografía

### Herramientas
- **Git/GitHub**: Control de versiones
- **VS Code**: Entorno de desarrollo
- **Live Server**: Servidor local para desarrollo
- **Arquitectura modular**: Separación de responsabilidades (Vitrina: 9 módulos, Teléfono: monolítico funcional)

---

## 📂 Estructura del Repositorio

```
Taller_6_ProyectoVoces/
├── README.md                    # Este archivo
├── .github/
│   └── copilot-instructions.md  # Instrucciones para desarrollo con IA
├── TelefonoMuseo/               # 📞 Proyecto 1
│   ├── README.md
│   ├── index.html
│   ├── sketch.js               # ~1400 líneas, monolítico
│   ├── style.css
│   ├── assets/
│   │   ├── sounds/
│   │   │   ├── pickup_phone.mp3, hangup_phone.mp3, error_call_phone.mp3
│   │   │   └── personajes/     # 4 personajes × 6 audios = 24 MP3
│   │   └── images/
│   │       ├── persona_rostro.png
│   │       └── persona_mano.png
│   └── backup/                 # Versiones anteriores
│
└── VitrinaMuseo/               # 🏛️ Proyecto 2
    ├── README.md               # Consolidado v2.5
    ├── index.html
    ├── sketch_new.js           # Orquestador principal
    ├── style.css
    ├── js/                     # Arquitectura modular
    │   ├── constants.js        # Configuraciones y constantes
    │   ├── state.js            # Máquina de estados
    │   ├── audio.js            # Sistema de audio
    │   ├── background.js       # Renderizado de fondo
    │   ├── ui-vitrina.js       # Vitrinas, vidrio, LEDs, bocinas
    │   ├── ui-objects.js       # Objetos, tarimillas, luces
    │   ├── ui-controls.js      # Controles de UI
    │   ├── ui-status.js        # Indicadores de estado
    │   ├── interactions.js     # Detección de proximidad
    │   └── README.md           # Documentación de módulos
    ├── docs/                   # Documentación histórica
    │   ├── README.md           # Índice de versiones
    │   └── [7 archivos .md]    # Cambios v2.0 → v2.5
    └── assets/
        ├── sounds/             # 3 narrativas MP3
        └── images/             # 3 imágenes PNG de objetos
```

---

## 🎓 Créditos y Contexto

**Institución**: Universidad Pontificia Bolivariana  
**Programa**: Ingeniería en Diseño de Entretenimiento Digital  
**Curso**: Taller 6 - Experiencia de Usuario en Museos  
**Cliente**: Museo Juan del Corral, Santa Fe de Antioquia, Colombia  
**Año**: 2024-2025

### 🎯 Objetivos de Aprendizaje
- Diseño de experiencias interactivas para espacios culturales
- Integración de tecnología web en contextos museográficos
- Narrativa digital e historias inmersivas
- Diseño centrado en el usuario para públicos diversos
- Preservación y difusión del patrimonio cultural

---

<div align="center">

**🌟 Preservando la historia de Santa Fe de Antioquia con tecnología interactiva 🌟**

[🔗 Ver Proyectos](#-proyectos-incluidos) • [📖 Documentación](#-documentación-completa) • [🚀 Ejecutar](#-inicio-rápido)

</div>