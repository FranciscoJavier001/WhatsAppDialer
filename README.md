# WumApp

**Contacta sin guardar**

Marcador web gratuito para abrir un chat de WhatsApp sin añadir el número a tus contactos. WumApp es una aplicación independiente, no afiliada a WhatsApp ni a Meta.

## Usar el marcador

1. Selecciona el país y escribe un número. También puedes pegar un número internacional con su prefijo.
2. Si quieres preparar un mensaje, escríbelo y activa **Usar mensaje personalizado** en **Ajustes**.
3. Selecciona **Abrir WhatsApp**. Allí puedes revisar el mensaje y enviarlo cuando quieras.

Puedes copiar el número internacional, borrar el último carácter o vaciar el campo con **Borrar todo**. El navegador puede pedir permiso para acceder al portapapeles.

## Instalar en el teléfono

Abre primero el marcador en la dirección HTTPS del sitio.

- **iPhone**. Abre el marcador en Safari, toca **Compartir → Agregar a pantalla de inicio**, activa **Abrir como app web** si aparece y toca **Agregar**. [Guía de Apple](https://support.apple.com/es-mx/guide/iphone/iphea86e5236/ios)
- **Android**. Abre el marcador en Chrome y elige **Más → Instalar y crear acceso directo → Instalar**. El nombre de la opción puede variar según la versión. [Guía de Chrome](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=es-419)

Tras completar la primera carga en línea, el marcador puede abrirse sin conexión. Abrir el enlace al chat requiere acceso a WhatsApp.

## Privacidad

El navegador conserva localmente el número, el país y los ajustes del mensaje. Al abrir WhatsApp, el enlace lleva el número y, si lo activaste, el texto del mensaje. No hay cuenta, publicidad ni código de analítica en el marcador. Consulta la [política de privacidad](privacidad.html).

## Desarrollo y publicación

Usa Node.js 22 o 24 LTS y npm. Para trabajar en local o verificar la compilación:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Publica el contenido completo de `dist/` en la raíz de un sitio estático con HTTPS. Si usas Vercel, selecciona el preset Vite, el comando de compilación `npm run build` y el directorio de salida `dist`. No requiere claves ni variables de entorno.

- `/` abre el marcador y es la dirección desde la que se instala.
- `/bienvenida.html` explica el uso y la instalación.
- `/privacidad.html` contiene la política de privacidad.

Sirve `sw.js`, el manifiesto y las páginas HTML con revalidación de caché. Los archivos con hash en `assets/` pueden conservarse durante más tiempo. Mantén el mismo origen e identificador del manifiesto en las actualizaciones para conservar el acceso al almacenamiento local.

## Comprobar antes de publicar

1. Abre las tres páginas en la URL HTTPS y revisa que carguen desde un teléfono. Instala el marcador en Safari de iPhone y Chrome de Android.
2. Prueba **Copiar** y **Pegar** con permiso concedido y denegado, así como la escritura táctil y con teclado físico.
3. Escribe un número y un mensaje de prueba. Cierra y vuelve a abrir el marcador. Comprueba que conserva los datos.
4. Prueba una segunda compilación en el mismo dominio. Abre la PWA con conexión, vuelve a cargarla y verifica que mantiene los datos. Comprueba que el marcador abre en modo avión después de la primera carga.
