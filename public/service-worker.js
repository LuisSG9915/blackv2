// service-worker.js
self.addEventListener("push", function (event) {
  console.log("Evento push recibido en el Service Worker");

  if (event.data) {
    const data = event.data.json();
    console.log("Datos de la notificación:", data);
    if (data.silent) {
      // Procesar notificación silenciosa, por ejemplo, registrar datos
      console.log("Notificación silenciosa recibida:", data);
      return;
    }
    const options = {
      body: data.body,
      data: { url: data.url }, // Aquí pasas el link
      icon: "/icon.png", // Asegúrate de que esta ruta esté correcta
      badge: "/badge-icon.png", // Opcional
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options).catch((err) => {
        console.error("Error al mostrar la notificación:", err);
      })
    );
  } else {
    console.log("No se recibió ningún dato en el evento push");
  }
});

// self.addEventListener('notificationclick', function (event) {
//   event.notification.close(); // Cierra la notificación
//   // Redirige al link proporcionado en el payload
//   if (event.notification.data && event.notification.data.url) {
//     const baseUrl = self.location.origin; // Obtiene la URL base del Service Worker
//     const targetUrl = new URL(event.notification.data.url, baseUrl).href; // Convierte a URL absoluta

//     event.waitUntil(
//         clients.openWindow(targetUrl)
//     );
// }
//  else {
//     console.log('No se proporcionó una URL en los datos de la notificación');
// }
// });
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  console.log("RESPUESTA");

  if (event.action === "reply") {
    const userResponse = prompt("Por favor, ingresa tu respuesta:");
    console.log("RESPUESTA2");
    if (userResponse) {
      event.waitUntil(
        fetch("/api/respuesta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notificacionId: event.notification.data.id,
            respuesta: userResponse,
          }),
        })
      );
    }
  } else if (event.action === "dismiss") {
    console.log("El usuario ignoró la notificación.");
  }
});

self.addEventListener("pushsubscriptionchange", function (event) {
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options).then(function (newSubscription) {
      // Registrar la nueva suscripción en el servidor
      fetch("/api/notificaciones/suscribirse", {
        method: "POST",
        body: JSON.stringify(newSubscription),
        headers: {
          "Content-Type": "application/json",
        },
      });
    })
  );
});
