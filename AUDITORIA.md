# Auditoría VANTA Creative Studios — 14/11/2026

Copia del proyecto original conservada aparte (`vanta-portfolio-ORIGINAL.zip`). No se eliminó ningún trabajo, imagen ni función.

## A. Terminado y verificado (probado)
**Precios y textos**
- La FAQ tenía "$15" escrito para Multilingüe en ES/EN/PT (el código lo sustituía al mostrarlo; el panel no tiene campo para ese precio). Ahora usa un marcador `{price}` y muestra USD 12 (oferta hasta el 30/11/2026) o USD 17. Comprobado en las 3 páginas: tarjetas $5 / $12 / $25 y FAQ sin $15.
- Los plazos decían "48 h" / "72 h" como compromiso; ahora dicen "unas 48 h" / "unas 72 h" (aproximado, como en tu encargo).

**Formulario**
- Nuevos campos: enlace del video, tipo de contenido, referencias visuales; canal de YouTube separado; correo obligatorio y validado.
- Campo trampa anti-spam, bloqueo de doble envío, estado "Enviando…", mensajes accesibles (`role=status`/`alert`) en lugar de `alert()`.
- Sin servicio configurado: abre el correo con el brief escrito y avisa; **no dice "enviado"**. Con servicio simulado: éxito solo con respuesta 2xx; con error 500 muestra error, nunca éxito.

**Seguridad (API)**
- Login del panel: si Redis falla, ya no se salta el límite de intentos (responde 503).
- `/api/track`: límite de 300 peticiones por IP cada 10 min (antes cualquiera podía inflar estadísticas y llenar Redis).
- `/api/config`: los enlaces de pago solo aceptan `paypal.com` / `paypal.me` por https (antes cualquier https).
- `vercel.json`: añadida cabecera HSTS. `robots.txt`: `Disallow: /api/`.
- Comprobado con Redis simulado: 401 sin sesión, cookie HttpOnly+Secure+SameSite=Strict, cookie manipulada rechazada, bloqueo tras 8 intentos, enlaces no-PayPal y `javascript:` descartados, bots ignorados.

**SEO / documentación**
- `og:title` y `twitter:title` de la página inglesa estaban en español → corregidos.
- Documentación contradictoria corregida (README.txt decía que las imágenes llevan marca de agua; SETUP.md hablaba de `/en` y `en/index.html`, que no existen: `/en` redirige a `/`).

**Pruebas realizadas** (Chromium móvil 390 px sobre servidor local + pruebas de API con Redis simulado): carga de `/`, `/es/`, `/pt/` sin errores de JS; sin scroll horizontal; cambio manual de idioma y persistencia; visor de miniaturas (abrir, flecha, Esc); 15 pruebas de API; 6 casos del formulario. Sintaxis de todos los `.js` y `vercel.json` válida. Sin enlaces locales rotos en `src`/`href` simples.

**Ronda 2 — buzón, icono de mensaje e imágenes (probado)**
- `api/msg.js` + pestaña **Mensajes** en /admin: bandeja tipo correo con Entrada/Destacados/Archivados, búsqueda, leído/no leído, borrar, responder y redactar (ver Ronda 3). El texto de los mensajes se escapa (probado: un `<img onerror>` no se ejecuta).
- El brief de contratación (ahora con enlace del video, tipo de contenido y referencias) y el **icono de mensaje flotante** (diálogo accesible) envían a ese buzón. Validación, honeypot, 5 mensajes/h por IP, sin doble envío y sin "éxito" si falla.
- `api/img.js` + "Subir imagen" en Portafolio: redimensiona en el navegador a WebP (completa + miniatura), solo acepta WebP/JPEG/PNG por firma (SVG rechazado), caché larga. Las imágenes subidas se ven en tarjetas y visor.
- **Ronda 3**: los mensajes se **borran solos a los 30 días** (decisión tuya; editar un mensaje no alarga el plazo) y desde /admin se puede **responder** (la respuesta queda guardada junto al mensaje), **redactar** correos nuevos (carpeta Enviados) y enviarlos por correo con Brevo o Resend. Máx. 30 al día, solo texto, asunto sin saltos de línea, un solo destinatario; si falla el proveedor no se guarda como respondido; sin proveedor configurado avisa y no finge el envío; el refresco automático no borra lo que escribes.
- **Ronda 4 — /admin en local**: `local/server.js` (sin dependencias) sirve la web, la API y /admin en tu equipo con una base de datos de prueba (`local/data.json`). Contraseña local `Admin2027Go` (cambiable con `ADMIN_PASSWORD`). Solo escucha en localhost salvo que uses `--lan`; el acceso a la base falsa exige un token aleatorio por sesión; `local/` queda fuera de despliegues (`.vercelignore`/`.gitignore`). La cookie del panel solo omite `Secure` cuando `LOCAL_DEV` está activo (solo lo activa ese servidor). Probado de punta a punta en Chromium: acceso con clave correcta/incorrecta, sesión tras recargar, mensaje por el icono y brief llegan a la bandeja, respuesta sin proveedor avisa, imagen subida se ve en el sitio, datos persisten al reiniciar.
- Corregido de paso: el aviso del admin decía que los cambios tardan ~10 s; en Vercel pueden tardar hasta ~40 s por la caché pública de `/api/config`.
- Pruebas (todas pasan): 32 de API con Redis y correo simulados, 40 de interfaz (sitio y panel en Chromium móvil) y 33 de regresión.

## B. Implementado, necesita configuración externa
- Formulario: pegar la URL real de tu servicio en `FORM_ENDPOINT` (SETUP.md §3). Hasta entonces funciona por correo.
- **Envío de correo**: configura `BREVO_API_KEY` (o `RESEND_API_KEY`) según SETUP.md §3c. Probado solo con servicios simulados; con Gmail como remitente puede ir a spam.
- Buzón e imágenes: necesitan Redis real y no se han probado contra Upstash/Vercel reales (la subida usa ~0,9 MB por petición, cerca del límite de 1 MB de algunos planes de Upstash).
- Variables de entorno: Redis, `ADMIN_PASSWORD` y, recomendada, `ADMIN_SECRET` (SETUP.md §1).

## C. Decisiones tuyas antes de publicar
- Todas las políticas (cancelación, reembolso, derechos de uso, archivos editables, etc.): `POLITICAS-BORRADOR.md`. No están en la web.
- Frases actuales que son promesas comerciales: "si la vista previa no es lo que necesitas, no pagas"; "archivos editables bajo petición"; "resolución 1920×1080" (las imágenes publicadas miden 1280×720 o 1536×864).
- Imágenes sin usar en `images/`: `gta-*` (3 + miniaturas) y `quien-eres-es.jpg`. WATERMARKS.md dice que la miniatura de GTA V se eliminó, pero los archivos siguen en el ZIP. No las toqué. GTA es propiedad de terceros: conviene decidir si se quedan, y no están publicadas.
- Si la URL `/es` o `/pt` debe mandar sobre el idioma guardado (hoy la URL manda).

## D. No hecho o no verificado
- **No hecho**: textos del bloque "Sobre VANTA", ficha ampliada por proyecto (concepto, objetivo, decisiones, resultado) y etiqueta de tipo (personal/concepto/cliente/experimental): no conozco el contenido real y no lo inventé. Tampoco las columnas "qué incluye / qué no incluye" por paquete ni la sección de políticas (dependen de C). Visor: ya tenía pestañas, teclado y flechas; no lo rediseñé ni añadí comparación visual.
- **No verificado**: el servidor local contra Android/Termux real (probado en Linux);  enlaces de PayPal (sin red aquí), panel `/admin` en navegador (solo su API), Android real, Lighthouse/rendimiento, contraste y lector de pantalla, envío real del formulario, Redis real.
- **Limitaciones del buzón/imágenes**: sin aviso por correo de mensajes nuevos; el visitante no tiene cuenta, así que las respuestas salen por correo, no dentro de la web; botón "Abrir en mi correo" no probado en navegador (abre una app externa); sin adjuntos en los mensajes; sin biblioteca ni borrado de imágenes subidas; la regla de caché de `vercel.json` para `/api/img` no está probada en Vercel real.
- **Pendiente técnico**: el HTML estático de las 3 páginas trae el texto en español y se traduce con JS (buscadores sin JS ven español en EN/PT); no hay CSP (requiere pruebas en navegador); `ADMIN_SECRET` no es obligatorio en el código.
