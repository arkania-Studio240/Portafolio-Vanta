# Configuración y despliegue

## 1. Variables de entorno (Vercel → Project → Settings → Environment Variables)
| Variable | Obligatoria | Para qué |
|---|---|---|
| `KV_REST_API_URL` y `KV_REST_API_TOKEN` (o `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`) | Sí, para panel, estadísticas y configuración | Conexión a Redis (Upstash). Se crean al añadir la integración Upstash/KV al proyecto. |
| `ADMIN_PASSWORD` | Sí, para usar `/admin` | Contraseña del panel. Usa una larga y única. |
| `ADMIN_SECRET` | **Recomendada** | Texto aleatorio (32+ caracteres) para firmar la sesión del panel. Si falta, la firma depende solo de la contraseña. |
Tras cambiar variables hay que volver a desplegar. Nunca pongas estas claves en archivos del sitio.

## 2. Publicar en Vercel
1. Sube la carpeta a GitHub (sin carpetas de originales) o ejecuta `npx vercel` dentro de ella.
2. Add New → Project → Import. Framework Preset: **Other**; sin Build Command ni Output Directory.
3. Añade las variables de la sección 1 y despliega.
4. Si cambias de dominio, reemplaza `vanta-portfolio-orcin.vercel.app` en `index.html`, `es/index.html`, `pt/index.html`, `robots.txt` y `sitemap.xml`.
5. En Google Search Console envía `https://TU-DOMINIO/sitemap.xml`. No borres `googled2188803acc59117.html`.

## 3. Mensajes (buzón dentro de /admin)
- El brief de contratación y el **icono de mensaje** (botón flotante abajo a la derecha) envían a `/api/msg` y quedan en **/admin → Mensajes** (Entrada, Destacados, Archivados, búsqueda, leído/no leído, borrar, "Responder por correo"). Requiere Redis (sección 1).
- Nadie ve "enviado" si el envío falló. Límite: 5 mensajes por hora por IP, campo trampa anti-spam, bandeja de hasta 1000 mensajes (si se llena, rechaza nuevos hasta que borres).
- **No hay aviso por correo** de mensajes nuevos: el panel se refresca cada 10 s solo mientras está abierto. Si quieres aviso por correo, `FORM_ENDPOINT` (inicio de `script.js`) acepta la URL de un servicio de formularios real (p. ej. Formspree); con eso los mensajes van a ese servicio **en lugar de** al buzón. No pongas una URL de ejemplo.
- Los mensajes contienen nombre y correo de visitantes: se guardan hasta que los borres (ver `POLITICAS-BORRADOR.md`).

## 3b. Subir imágenes de trabajos
/admin → Portafolio → "Subir imagen" (por idioma). El navegador la redimensiona (1536 px y 720 px de ancho, WebP) y se guarda en Redis; el nombre `up-xxxxxxxxxx.webp` se rellena solo. Pulsa "Guardar portafolio". Usa imágenes 16:9. Mejor desde Chrome/Android (Safari no codifica WebP y la imagen puede resultar demasiado pesada). Las imágenes reemplazadas no se borran de Redis. Las miniaturas originales de `/images` siguen funcionando igual.

## 4. URLs por idioma
`/` = inglés, `/es` = español, `/pt` = portugués (Brasil). `/en` redirige a `/` (ver `vercel.json`).

## 5. Pendiente de tu decisión
Ver `AUDITORIA.md` (sección C) y `POLITICAS-BORRADOR.md`.
