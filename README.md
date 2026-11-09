# VANTA Creative Studios — sitio web

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni paso de compilación). Portafolio de miniaturas para YouTube en español, inglés y portugués (Brasil).

## Estructura

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página única (HTML estático en español + datos estructurados SEO) |
| `styles.css` | Estilos (tema oscuro, glass UI, responsive) |
| `script.js` | Idiomas, galería, vista ampliada, planes, formulario |
| `splash.js` | Intro de bienvenida (una vez por visita, se puede saltar) |
| `images/` | Miniaturas en tamaño completo (1280×720 o 1536×864) y `images/thumbs/` (720×405) |
| `images/og-cover.jpg` | Imagen al compartir el enlace en redes |
| `robots.txt`, `sitemap.xml` | SEO |
| `vercel.json` | Cabeceras de seguridad y caché para Vercel |
| `googled2188803acc59117.html` | Verificación de Google Search Console (no borrar) |
| `WATERMARKS.md` | Estado de las marcas de agua de las miniaturas |

## Idiomas

- Detecta el idioma del dispositivo (español, inglés, portugués). Si no es compatible, usa **español**.
- El selector ES/EN/PT está siempre visible y cambia el idioma sin recargar; la elección se guarda.
- Cada miniatura se muestra en el idioma elegido. Si no existe esa versión, se muestra la original (`original` del proyecto, o la primera imagen de la lista).
- Los textos dentro de las imágenes no se traducen automáticamente.

## Agregar un proyecto

1. Copia las imágenes a `images/` (1536×864 recomendado) y una copia de 720×405 en `images/thumbs/`, con el mismo nombre.
2. Añade un objeto a `PROJECTS` en `script.js` (id, categoría, títulos por idioma e `images` por idioma).
3. Añade la URL de la imagen en `sitemap.xml` si quieres que Google la indexe.

Nueva categoría: agrégala a `CATEGORIES` y su nombre en cada idioma de `I18N`.

## Planes y pagos

Los precios están en `PRICES` y los enlaces de PayPal en `PAY_LINKS` (inicio de `script.js`). Los textos de cada plan están en `I18N`, clave `packs`.

## Marcas de agua

Las miniaturas de `images/` ya no llevan marca de agua. Detalle en `WATERMARKS.md`.

## Publicar en Vercel

1. Sube la carpeta a un repositorio de GitHub (o usa Vercel CLI: `npx vercel` dentro de la carpeta).
2. En vercel.com: **Add New → Project → Import** el repositorio.
3. Configuración: **Framework Preset: Other**, sin Build Command y sin Output Directory (déjalos vacíos). **Deploy**.
4. Si usas otro dominio que `vanta-portfolio-orcin.vercel.app`, reemplaza esa URL en `index.html` (canonical, `og:`, JSON-LD), `robots.txt` y `sitemap.xml`.
5. En Google Search Console envía `https://TU-DOMINIO/sitemap.xml`.

No subas carpetas con originales (`originals-private/`).

## Revisión antes de publicar

- Abre la web en móvil y escritorio, cambia de idioma y abre una miniatura (pestañas *Tamaño completo / En YouTube / Tamaños pequeños*).
- Prueba los botones de PayPal, el enlace de correo y el copiado del usuario de Discord.
- Comprueba que el enlace de Reddit abre tu perfil.
