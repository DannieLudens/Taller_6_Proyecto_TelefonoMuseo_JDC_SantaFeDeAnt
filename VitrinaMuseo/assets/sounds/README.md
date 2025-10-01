# Audio Files for Vitrina Interactiva

## Required Files

Place your MP3 narrative files in this directory with the following names:

### Narrativas de Objetos:
- `objeto_1_narrativa.mp3` - Narrativa del primer objeto (Vasija Colonial)
- `objeto_2_narrativa.mp3` - Narrativa del segundo objeto (Pergamino Antiguo)
- `objeto_3_narrativa.mp3` - Narrativa del tercer objeto (Espada Colonial)
- `objeto_4_narrativa.mp3` - Narrativa del cuarto objeto (Vestido de Época)
- `objeto_5_narrativa.mp3` - Narrativa del quinto objeto (Cámara Antigua)
- `objeto_6_narrativa.mp3` - Narrativa del sexto objeto (Máscara Teatral)

## Audio Guidelines

### Formato:
- **Tipo**: MP3
- **Bitrate**: 128-192 kbps recomendado
- **Frecuencia**: 44.1 kHz
- **Canales**: Mono o Stereo

### Duración Recomendada:
- **Mínimo**: 15 segundos
- **Óptimo**: 30-45 segundos
- **Máximo**: 60 segundos

### Estilo Narrativo:
- **Primera persona**: El objeto cuenta su propia historia
- **Tono**: Conversacional, accesible
- **Ritmo**: Pausado, claro
- **Ejemplo**: "Soy una vasija colonial del siglo XVIII. Fui creada por manos expertas en el valle de Santa Fe..."

## Placeholder Audio

Mientras tanto, el sistema usa audio simulado de 3 segundos para pruebas.

Para activar los audios reales:
1. Coloca tus archivos MP3 aquí
2. Descomenta la línea 61 en `sketch.js`:
   ```javascript
   objetos[i].narrativa = loadSound(audioPath);
   ```
3. Comenta la línea 64-70 (placeholder)

## Recording Tips

- Usa un micrófono de buena calidad
- Graba en ambiente silencioso
- Normaliza el volumen
- Elimina silencios al inicio/final
- Considera agregar música de fondo sutil (opcional)
