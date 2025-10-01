# 📂 Organización de Proyectos - Museo Juan del Corral

## 🎯 Estructura Recomendada

```
📁 Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt/
│
├── 📂 .github/                    ← Configuración del repositorio
│   ├── copilot-instructions.md
│   └── ORGANIZACION_PROYECTOS.md
├── 📂 TelefonoMuseo/              ← Proyecto principal
│   ├── sketch.js                  (Sistema de llamadas interactivas)
│   ├── index.html
│   ├── style.css
│   ├── README.md
│   └── assets/
│       ├── sounds/
│       │   ├── pickup_phone.mp3
│       │   ├── hangup_phone.mp3
│       │   ├── error_call_phone.mp3
│       │   └── personajes/
│       │       ├── Per_1_*.mp3
│       │       ├── Per_2_*.mp3
│       │       └── ...
│       └── images/
│           ├── persona_rostro.png
│           └── persona_mano.png
│
└── 📂 VitrinaMuseo/               ← Proyecto nuevo ✨
    ├── sketch.js                  (Sistema de vitrina automática)
    ├── index.html
    ├── style.css
    ├── README.md
    └── assets/
        ├── sounds/
        │   ├── objeto_1_narrativa.mp3
        │   ├── objeto_2_narrativa.mp3
        │   └── ...
        └── images/
            ├── objeto_1.png
            └── ...
```

---

## 🔄 Pasos para Reorganizar

### 1. Cerrar VS Code completamente
```
Archivo → Cerrar Carpeta (o salir de VS Code)
```

### 2. Renombrar carpeta del teléfono
```powershell
# EN CASO DE NECESITAR RENOMBRAR (YA REALIZADO):
cd "C:\Users\ardil\OneDrive\Documents\GitHub"
Rename-Item "Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt" "Taller_6_ProyectoVoces"
# Y luego crear subcarpetas TelefonoMuseo/ y VitrinaMuseo/
```

O simplemente:
- Click derecho en la carpeta `Taller_6_ProyectoTelefonoMuseo`
- Renombrar → `TelefonoMuseo`

### 3. Verificar carpeta VitrinaMuseo
La carpeta `VitrinaMuseo` ya fue creada con todos los archivos base.

### 4. Abrir ambos proyectos en VS Code
```
Archivo → Abrir Carpeta → Seleccionar "Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt"
```

Esto abrirá la carpeta principal como workspace con ambos proyectos visibles (TelefonoMuseo/ y VitrinaMuseo/).

---

## 🎭 Diferencias Entre Proyectos

| Aspecto | 📞 TelefonoMuseo | 🏛️ VitrinaMuseo |
|---------|------------------|------------------|
| **Interacción** | Activa (usuario marca) | Pasiva (sensor automático) |
| **Estados** | 10 estados complejos | 5 estados simples |
| **Audio** | 4 personajes × 5 audios | 1-6 objetos × 1 audio |
| **Hardware** | Solo mouse/touch | Sensor de proximidad |
| **Flujo** | Usuario decide opciones | Secuencia predeterminada |
| **Duración** | Variable (usuario controla) | Fija (~2-5 minutos) |
| **Visual** | Teléfono interactivo | Vitrina con iluminación |

---

## 🚀 Comandos Útiles

### Ejecutar Teléfono:
```bash
cd "C:\Users\ardil\OneDrive\Documents\GitHub\Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt\TelefonoMuseo"
python -m http.server 8000
# Abrir: http://localhost:8000
```

### Ejecutar Vitrina:
```bash
cd "C:\Users\ardil\OneDrive\Documents\GitHub\Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt\VitrinaMuseo"
python -m http.server 8001  # Puerto diferente
# Abrir: http://localhost:8001
```

### Ejecutar ambos simultáneamente:
```powershell
# Terminal 1 (PowerShell):
cd "C:\Users\ardil\OneDrive\Documents\GitHub\Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt\TelefonoMuseo" ; python -m http.server 8000

# Terminal 2 (nueva terminal):
cd "C:\Users\ardil\OneDrive\Documents\GitHub\Taller_6_Proyecto_TelefonoMuseo_JDC_SantaFeDeAnt\VitrinaMuseo" ; python -m http.server 8001
```

---

## 📝 Contexto Compartido

Ambos proyectos comparten:
- ✅ Mismo museo (Juan del Corral)
- ✅ Misma tecnología base (p5.js + p5.sound)
- ✅ Mismo objetivo (experiencias museográficas inmersivas)
- ✅ Mismo equipo de desarrollo (Taller 6)
- ✅ Mismo estilo de narrativas (personificación de objetos/personajes)

Pero son **proyectos independientes** que pueden desarrollarse en paralelo sin conflictos.

---

## 🎯 Próximos Pasos

### Para TelefonoMuseo:
- [x] Sistema de estilos duales (botones/rotatorio)
- [x] 4 personajes completos
- [ ] 5to personaje (audio pendiente)
- [ ] Pruebas en museo

### Para VitrinaMuseo:
- [x] Estructura base creada
- [x] Sistema de estados implementado
- [x] Iluminación dinámica funcional
- [ ] Grabar narrativas de objetos (1-6)
- [ ] Integrar sensor físico
- [ ] Reemplazar placeholders visuales con fotos reales
- [ ] Pruebas en museo

---

## 💡 Recomendaciones

1. **Trabaja un proyecto a la vez** para evitar confusión
2. **Commits separados** para cada proyecto
3. **README actualizado** en ambos proyectos
4. **Documentación clara** de diferencias
5. **Reutilizar aprendizajes** entre proyectos (pero no código)

---

## 🤝 Colaboración

Si trabajas en equipo:
- **Teléfono**: Persona A
- **Vitrina**: Persona B
- **Reuniones**: Compartir avances y soluciones

O trabaja alternadamente:
- **Lunes-Miércoles**: Teléfono
- **Jueves-Viernes**: Vitrina

---

Creado: Octubre 2025  
Última actualización: 01/10/2025
