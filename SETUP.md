# Configuración y despliegue

## 0. Ver la web y /admin en tu equipo (local)
Necesitas Node 18 o superior (PC: nodejs.org · Android: Termux → `pkg install nodejs`).
1. Abre una terminal dentro de la carpeta del proyecto y ejecuta `node local/server.js` (o `npm run local`).
2. Web: http://localhost:3000 · Panel: http://localhost:3000/admin · **Contraseña local: `Admin2027Go`**.
- Otra contraseña: `ADMIN_PASSWORD=OtraClave node local/server.js`. Otro puerto: `PORT=3001 node local/server.js`.
- Verlo desde otro dispositivo de tu red Wi-Fi: `node local/server.js --lan` (cualquiera en esa red podría abrir /admin si sabe la contraseña).
- Sin Redis ni Vercel: el servidor trae una base de datos de **prueba** que guarda mensajes, imágenes subidas, configuración y estadísticas en `local/data.json` (bórralo para empezar de cero). No son los datos de Vercel.
- Todo funciona igual que en producción (login, buzón, subir imágenes, formulario, icono de mensaje), salvo: el envío de correos solo ocurre si defines `BREVO_API_KEY` o `RESEND_API_KEY` (¡y entonces enviaría correos reales!), y la cookie del panel no lleva `Secure` para poder usar http://.
- **Seguridad:** la contraseña local está escrita en `local/server.js`. Esa carpeta no se despliega (`.vercelignore`, `.gitignore`), pero **no la subas a mano a GitHub ni a ningún hosting**. En Vercel la contraseña va solo en la variable `ADMIN_PASSWORD`, nunca en el código. Como la contraseña `Admin2027Go` quedó escrita en una conversación, para producción conviene usar otra distinta.

## 1. Variables de entorno (Vercel → Project → Settings → Environment Variables)
| Variable | Obligatoria | Para qué |
|---|---|---|
| `KV_REST_API_URL` y `KV_REST_API_TOKEN` (o `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`) | Sí, para panel, estadísticas y configuración | Conexión a Redis (Upstash). Se crean al añadir la integración Upstash/KV al proyecto. |
| `ADMIN_PASSWORD` | Sí, para usar `/admin` | Contraseña del panel. Usa una larga y única. |
| `BREVO_API_KEY` o `RESEND_API_KEY` | Solo para responder/enviar correos | Ver sección 3c. |
| `MAIL_FROM` | Opcional | Remitente de los correos (por defecto vantacreativestudios1@gmail.com). |
| `ADMIN_SECRET` | **Recomendada** | Texto aleatorio (32+ caracteres) para firmar la sesión del panel. Si falta, la firma depende solo de la contraseña. |
Tras cambiar variables hay que volver a desplegar. Nunca pongas estas claves en archivos del sitio.

## 2. Publicar en Vercel
1. Sube la carpeta a GitHub (sin carpetas de originales) o ejecuta `npx vercel` dentro de ella.
2. Add New → Project → Import. Framework Preset: **Other**; sin Build Command ni Output Directory.
3. Añade las variables de la sección 1 y despliega.
4. Si cambias de dominio, reemplaza `vanta-portfolio-orcin.vercel.app` en `index.html`, `es/index.html`, `pt/index.html`, `robots.txt` y `sitemap.xml`.
5. En Google Search Console envía `https://TU-DOMINIO/sitemap.xml`. No borres `googled2188803acc59117.html`.

## 3. Mensajes (buzón dentro de /admin)
- El brief de contratación y el **icono de mensaje** (botón flotante abajo a la derecha) envían a `/api/msg` y quedan en **/admin → Mensajes** (Entrada, Destacados, Archivados, Enviados, búsqueda, leído/no leído, borrar, **responder y redactar correos** desde la propia web). Requiere Redis (sección 1).
- **Conservación: 30 días.** Cada mensaje se borra solo (Redis) 30 días después de llegar; responder, destacar o archivar no alarga ese plazo. Si quieres guardar algo, cópialo antes.
- Nadie ve "enviado" si el envío falló. Límite: 5 mensajes por hora por IP, campo trampa anti-spam, bandeja de hasta 1000 mensajes (si se llena, rechaza nuevos hasta que borres).
- **No hay aviso por correo** de mensajes nuevos: el panel se refresca cada 10 s solo mientras está abierto. Si quieres aviso por correo, `FORM_ENDPOINT` (inicio de `script.js`) acepta la URL de un servicio de formularios real (p. ej. Formspree); con eso los mensajes van a ese servicio **en lugar de** al buzón. No pongas una URL de ejemplo.
- Los mensajes contienen nombre y correo de visitantes: se guardan 30 días y se borran solos (puedes borrarlos antes).

## 3c. Responder y enviar correos desde /admin
En Mensajes, abre un mensaje y escribe en "Responder", o pulsa "✎ Redactar" para un correo nuevo. El correo sale **desde el servidor** con un servicio de correo; sin configurarlo, el botón Enviar avisa de que no está configurado y no envía nada (queda "Abrir en mi correo", que usa tu app de correo). Las respuestas llevan `Reply-To: vantacreativestudios1@gmail.com`, se guardan junto al mensaje y los correos nuevos aparecen en "Enviados". Solo texto, máximo 30 correos al día.

**Opción A — Brevo (permite usar tu Gmail como remitente verificado)**
1. Crea una cuenta en Brevo → Senders → añade `vantacreativestudios1@gmail.com` y verifica con el código que te llega.
2. SMTP & API → API Keys → genera una clave.
3. En Vercel añade `BREVO_API_KEY` y vuelve a desplegar. Opcional: `MAIL_FROM` (por defecto, el Gmail anterior).

**Opción B — Resend** (exige un dominio propio verificado): `RESEND_API_KEY` y `MAIL_FROM` con una dirección de ese dominio.

⚠ Enviar "desde" una cuenta de Gmail a través de un servicio externo puede acabar en spam o ser rechazado (Gmail lo restringe). Para que tus respuestas lleguen bien, lo recomendable es un dominio propio. **No he podido probar Brevo ni Resend reales** (sin red); la integración sigue su API documentada y está probada solo con respuestas simuladas.

## 3b. Subir imágenes de trabajos
/admin → Portafolio → "Subir imagen" (por idioma). El navegador la redimensiona (1536 px y 720 px de ancho, WebP) y se guarda en Redis; el nombre `up-xxxxxxxxxx.webp` se rellena solo. Pulsa "Guardar portafolio". Usa imágenes 16:9. Mejor desde Chrome/Android (Safari no codifica WebP y la imagen puede resultar demasiado pesada). Las imágenes reemplazadas no se borran de Redis. Las miniaturas originales de `/images` siguen funcionando igual.

## 4. URLs por idioma
`/` = inglés, `/es` = español, `/pt` = portugués (Brasil). `/en` redirige a `/` (ver `vercel.json`).

## 5. Pendiente de tu decisión
Ver `AUDITORIA.md` (sección C) y `POLITICAS-BORRADOR.md`.
