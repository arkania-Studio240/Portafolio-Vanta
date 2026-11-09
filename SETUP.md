# Configuración pendiente

## 1. Formulario de contacto (necesario para que no dependa de mailto)
1. Crea un formulario en https://formspree.io (o un servicio compatible) y copia su URL (`https://formspree.io/f/xxxxxxx`).
2. Pégala en `FORM_ENDPOINT` al inicio de `script.js`.
3. Mientras esté vacío, el formulario sigue abriendo el correo del visitante (mailto), como antes.
Con endpoint activo se valida el correo, se muestra "Enviando…" y mensajes de éxito/error. Incluye campo anti-spam oculto.

## 2. Textos que debes definir tú (no se inventaron)
- Política de cancelación y reembolso.
- Derechos de uso de las miniaturas.
- Qué incluye y qué no incluye cada plan (más allá de lo ya publicado).
Cuando los tengas, se añaden como sección en `index.html` y en `I18N` de `script.js`.

## 3. Más trabajos
El espacio "Tu proyecto aquí" de la galería desaparece cuando añadas proyectos nuevos a `PROJECTS` (ver README). Categorías disponibles: Gaming, Minecraft, Conceptos. Para GTA o Roblox, añade la clave a `CATEGORIES` y su nombre en `I18N` al subir el primer trabajo.

## 4. Idiomas por URL
`/` (español), `/en` y `/pt`. Si cambias de dominio, actualiza las URL en `index.html`, `en/index.html`, `pt/index.html` y `sitemap.xml`.
