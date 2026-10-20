# AGD Studio: seguridad y protección de datos (documento interno)

No se publica: la carpeta `docs/` está excluida en `.vercelignore`.
Este documento no sustituye el asesoramiento de un profesional jurídico.

## 1. Qué hace el sitio con los datos

- Sitio estático (HTML, CSS y JS) sin servidor propio, base de datos, cuentas de usuario ni pagos.
- El formulario de contacto no envía nada: abre la aplicación de correo del visitante (`mailto:`).
- Sin cookies, analítica ni scripts de terceros. Las tipografías y las bibliotecas (GSAP 3.12.5, Lenis 1.1.13) se sirven desde `fonts.css`, `assets/fonts/` y `vendor/`.
- Almacenamiento en el navegador: `gd-lang` (localStorage, idioma elegido) y `gd-intro` (sessionStorage, animación de carga).

**Antes de añadir analítica, píxeles, vídeos o mapas incrustados, chat o un formulario con backend:** hay que implantar un mecanismo de consentimiento que bloquee esas herramientas hasta que el visitante acepte, actualizar `privacidad.html` y ampliar la CSP de `vercel.json`.

## 2. Registro de actividades de tratamiento (borrador, art. 30 RGPD)

Una empresa de menos de 250 personas puede quedar exenta si el tratamiento es ocasional, pero la gestión de clientes no suele serlo, así que conviene mantener este registro.

| Actividad | Datos | Base jurídica | Plazo de conservación | Encargados |
|---|---|---|---|---|
| Consultas y presupuestos | Nombre, email, empresa, mensaje, teléfono | Art. 6.1.b / 6.1.f | [definir, p. ej. 12 meses] | Proveedor de correo [definir] |
| Clientes y facturación | Identificación, contacto, facturación | Art. 6.1.b / 6.1.c | Contrato + 6 años | Correo, gestoría [definir] |
| Leads de campañas para clientes | Datos de los leads del cliente | AGD actúa como **encargado** del cliente | Según contrato con el cliente | Meta, Google, CRM [definir] |
| Registros del servidor web | IP, navegador, URL | Art. 6.1.f | Según el proveedor | Alojamiento [definir] |

Las campañas de captación y el CRM que AGD Studio gestiona para inmobiliarias exigen un contrato de encargado del tratamiento (art. 28 RGPD) con cada cliente.

## 3. Solicitudes de derechos (acceso, supresión, etc.)

1. Se reciben en hello@gdcompany.com. Anotar la fecha de recepción.
2. Solo se pide verificar la identidad si hay dudas razonables. No pedir copia del DNI de forma sistemática.
3. Responder en el plazo de **1 mes**, ampliable 2 meses más si se avisa dentro del primer mes.
4. Buscar los datos en el correo, WhatsApp, el CRM y las carpetas compartidas.
5. Registrar la solicitud, la respuesta y la fecha.

## 4. Brechas de seguridad

Ejemplos: acceso indebido al correo, envío de datos a quien no corresponde, pérdida de un dispositivo.

1. Contener el incidente: cambiar contraseñas, cerrar sesiones abiertas, revocar accesos.
2. Valorar el riesgo para las personas afectadas.
3. Si hay riesgo, notificarlo a la AEPD (sede.aepd.es) **en un máximo de 72 horas** desde que se conoce.
4. Si el riesgo es alto, informar también a las personas afectadas sin dilación indebida.
5. Documentar siempre el incidente, aunque no se notifique (art. 33.5 RGPD).

## 5. Operación y copias de seguridad

- Activar la verificación en dos pasos en Vercel, el registrador del dominio, el correo, GitHub, Meta Business y Google Ads.
- El código del sitio debe estar en un repositorio propio y privado. Ahora mismo la carpeta del proyecto forma parte de un repositorio git cuya raíz es la carpeta personal del usuario, que no debe subirse nunca a un remoto.
- Copias de seguridad: el repositorio sirve de copia del sitio. Para el correo y los datos de clientes, hacer una copia periódica y probar a restaurarla al menos una vez al año.
- Tras cambiar el script en línea de `index.html`, recalcular su hash SHA-256 en la CSP de `vercel.json`; si no, el navegador lo bloqueará.
- Al actualizar GSAP o Lenis, descargar la versión exacta a `vendor/` y comprobar su hash con el que publica la CDN.
