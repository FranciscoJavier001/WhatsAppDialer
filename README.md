# WhatsApp Dialer Pro

PWA para abrir chats de WhatsApp desde un teclado numérico. El número, el país y los ajustes del mensaje se guardan en el almacenamiento local de la instalación o del navegador.

## Desarrollo local

```sh
npm ci
npm run dev
```

Abre la URL que imprime Vite. Ejecuta `npm test` para comprobar la normalización, el almacenamiento y los enlaces. Para verificar el manifiesto y el modo sin conexión, ejecuta `npm run build` y después `npm run preview`. Carga primero la aplicación en línea para que el service worker instale la caché.

## Vercel e instalación en iPhone

Sube el código a GitHub e importa el repositorio en Vercel. Usa el preset **Vite**, el comando `npm run build` y el directorio de salida `dist`. La aplicación utiliza HTTPS para habilitar la instalación y el acceso al portapapeles.

Abre el enlace de Vercel en Safari, selecciona **Compartir → Agregar a pantalla de inicio** y activa **Abrir como app web** si Safari muestra esa opción. Si el navegador restringe el portapapeles, mantén pulsado el campo del número y usa **Pegar**. La interfaz sigue disponible sin conexión después de cargarla por primera vez. La apertura del chat requiere acceso a WhatsApp.

## Comprobación en iPhone

1. Instala la PWA y escribe cinco dígitos. Cambia de aplicación, bloquea y desbloquea el teléfono, cierra la PWA y vuelve a abrirla. Comprueba que conserva los cinco dígitos en cada caso.
2. Borra un dígito con **Borrar** y vacía el número con **X**. Comprueba que se conservan el país y el mensaje. Pega un número nacional, uno internacional y texto sin número.
3. Con un número válido de prueba, toca **Copiar** y verifica el prefijo. Abre el chat primero con un mensaje activado y después con el mensaje desactivado. Regresa a la PWA y comprueba que conserva el número.
4. Gira el teléfono y vuelve a vertical. Si el sistema permite el giro, aparece el aviso en horizontal. Comprueba que el número se conserva.
5. Despliega una nueva compilación en el mismo dominio, abre la PWA con conexión y vuelve a cargarla. Comprueba que recupera el número, el país y los ajustes después de actualizar el service worker.
