// pushNotifications.js
const PUBLIC_VAPID_KEY = "BKLJNby6VbDDy3xpm_gUPpOiBnxObwkQm07Ez2yh6Az3zjMXlkPSytIXDAmQvYssItqhs8WnggVQem1R9_KYJ94"; // Reemplaza con tu clave pública VAPID
const BACKEND_URL = "https://localhost:61118/api/notificaciones";

// Función para suscribir al usuario en pushNotifications.ts
export async function subscribeUserToPush(idRol: number, idUsuario: number, idPuesto: number, idSucursal: number) {
  if (!idRol || !idUsuario || !idPuesto || !idSucursal) {
    console.error("ID de rol, usuario, puesto o sucursal no proporcionados.");
    return;
  }
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const swRegistration = await navigator.serviceWorker.ready;

    const existingSubscription = await swRegistration.pushManager.getSubscription();
    if (existingSubscription) {
      await existingSubscription.unsubscribe();
      console.log("Suscripción previa eliminada.");
    }

    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    // await fetch("http://localhost:61118/api/notificaciones/suscribirse", {
    await fetch("https://cbinfo.no-ip.info:9111/api/notificaciones/suscribirse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        p256dh: subscription.getKey("p256dh") ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh") as ArrayBuffer))) : null,
        auth: subscription.getKey("auth") ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth") as ArrayBuffer))) : null,
        idRol: idRol ? idRol : 0, // Nuevo parámetro enviado
        idUsuario: idUsuario ? idUsuario : 0, // Nuevo parámetro enviado
        idPuesto: idPuesto ? idPuesto : 0, // Nuevo parámetro enviado
        idSucursal: idSucursal ? idSucursal : 0, // Nuevo parámetro enviado
        Base: "dbBLACK",
      }),
    });
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
