# Image Assets

## Optional: Object Images

Si deseas reemplazar las representaciones visuales simples de los objetos por imágenes reales, coloca aquí fotografías de alta calidad:

### Formato Recomendado:
- **Tipo**: PNG (con transparencia) o JPG
- **Resolución**: 300×300 px mínimo
- **Orientación**: Cuadrada preferiblemente
- **Fondo**: Transparente (PNG) o fondo blanco limpio

### Archivos Sugeridos:
- `objeto_1_vasija.png`
- `objeto_2_pergamino.png`
- `objeto_3_espada.png`
- `objeto_4_vestido.png`
- `objeto_5_camara.png`
- `objeto_6_mascara.png`

## Implementación

Para usar imágenes reales:

1. **Cargar en preload():**
```javascript
let objetoImagenes = [];

function preload() {
  for (let i = 0; i < objetos.length; i++) {
    objetoImagenes[i] = loadImage(`assets/images/objeto_${i+1}.png`);
  }
}
```

2. **Dibujar en drawObjetos():**
```javascript
// Reemplazar las formas geométricas por:
imageMode(CENTER);
image(objetoImagenes[i], 0, 0, 80 * scaleRatio, 80 * scaleRatio);
```

## Photography Tips

- Iluminación uniforme sin sombras duras
- Fondo neutro (preferiblemente blanco o gris)
- Objeto centrado y enfocado
- Múltiples ángulos disponibles
- Post-procesamiento: recortar, ajustar niveles, eliminar fondo
