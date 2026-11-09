# VANTA Creative Studios — Portfolio de miniaturas

Portafolio web de VANTA Creative Studios para mostrar diseños de miniaturas de YouTube.

## Contenido del proyecto

- `index.html`: estructura principal del sitio.
- `styles.css`: estilos y diseño visual.
- `script.js`: comportamiento, traducciones y listado de proyectos.
- `images/`: imágenes completas utilizadas por el sitio.
- `images/thumbs/`: versiones optimizadas para las tarjetas del portafolio.

## Idiomas

El sitio puede seleccionar el idioma según la configuración del dispositivo/navegador. Cada proyecto debe tener la imagen correspondiente al idioma disponible.

Idiomas incluidos en los recursos actuales:
- Español
- Inglés
- Portugués

## Correo de contacto

**vantacreativestudios1@gmail.com**

## Cómo publicar el portafolio

1. Mantén juntos `index.html`, `styles.css`, `script.js` y la carpeta `images/`.
2. Sube esos archivos a tu servicio de alojamiento web.
3. Abre la dirección publicada y comprueba que las imágenes y los estilos carguen correctamente.

## Cómo agregar una miniatura

1. Coloca la imagen final dentro de `images/`.
2. Crea una versión optimizada de aproximadamente `720 × 405 px` y guárdala en `images/thumbs/` con el mismo nombre.
3. Agrega el proyecto al listado `PROJECTS` de `script.js`.
4. Comprueba que el proyecto tenga título, categoría, descripción e imágenes para los idiomas disponibles, según la estructura usada por el código.

## Cómo agregar una categoría o idioma

- Para agregar una categoría, actualiza `CATEGORIES` y las traducciones correspondientes dentro de `I18N` en `script.js`.
- Para agregar un idioma, añade sus textos a `I18N` y prepara las imágenes localizadas que necesiten los proyectos.

## Recomendaciones

- Conserva los nombres de archivo tal como aparecen en `script.js`.
- No elimines las carpetas de imágenes.
- Optimiza las imágenes para que el sitio cargue rápido en celulares.
- Antes de publicar cambios, prueba el portafolio en Android y en una pantalla de escritorio.
