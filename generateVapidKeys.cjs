"use strict";
exports.__esModule = true;
var webpush = require("web-push");
var vapidKeys = webpush.generateVAPIDKeys();
console.log('Clave Pública:', vapidKeys.publicKey);
console.log('Clave Privada:', vapidKeys.privateKey);
