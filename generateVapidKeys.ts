import * as webpush from 'web-push';

const vapidKeys = webpush.generateVAPIDKeys();

console.log('Clave Pública:', vapidKeys.publicKey);
console.log('Clave Privada:', vapidKeys.privateKey);
