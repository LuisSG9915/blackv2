const express = require("express");
const cors = require("cors"); // Importa el middleware CORS
const axios = require("axios");

const app = express();
const port = 3001; // Puerto de tu servidor

// Configura el middleware CORS para permitir solicitudes desde http://localhost:5173
const corsOptions = {
  origin: "http://localhost:5173", // Cambia esto al origen de tu aplicación de React
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Reemplaza '*' con el dominio de tu aplicación frontend si es específico.
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta para obtener órdenes desde Shopify
app.get("/api/orders", async (req, res) => {
//   try {
//     // Aquí realiza la solicitud a la API de Shopify y procesa los datos
//     // Puedes usar Axios o cualquier otra biblioteca que prefieras para hacer la solicitud

//     // Ejemplo de solicitud a Shopify usando Axios:
//     const shopifyApiUrl = "https://tnbmx.myshopify.com/admin/api/2023-07/orders.json";
//     const apiKey = "5c80a75296888fb5ec0003eefefdd29a";
//     const password = "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";
    
//     const response = await axios.get(shopifyApiUrl, {
//       headers: {
//         Authorization: `Basic ${Buffer.from(apiKey + ":" + password).toString("base64")}`,
//       },
//     });
    
//     const data = response.data;

//     // Devuelve los datos de Shopify como respuesta
//     res.json(data);
//   } catch (error) {
//     console.error("Error al obtener órdenes desde Shopify:", error);
//     res.status(500).json({ error: "Error al obtener órdenes desde Shopify" });
//   }


// Ruta para obtener las órdenes de Shopify
app.get('/api/orders', async (req, res) => {
  try {
    const response = await axios.get('https://tnbmx.myshopify.com/admin/api/2023-07/orders.json', {
      headers: {
        'X-Shopify-Access-Token': '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',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes de Shopify' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});