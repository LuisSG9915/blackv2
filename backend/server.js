const express = require("express");
const cors = require("cors"); // Importa el middleware CORS
const axios = require("axios");

const app = express();
const port = 3001; // Puerto de tu servidor

// Configura el middleware CORS para permitir solicitudes desde http://127.0.0.1:5173
const corsOptions = {
  
  origin:"http://localhost:5173" // oficina
    //origin: "http://127.0.0.1:5173", // casa alex
};

app.use(cors(corsOptions));

// Ruta para obtener órdenes desde Shopify
app.get("/api/orders", async (req, res) => {
  try {
    // Aquí realiza la solicitud a la API de Shopify y procesa los datos
    // Puedes usar Axios o cualquier otra biblioteca que prefieras para hacer la solicitud

    // Ejemplo de solicitud a Shopify usando Axios:
    const shopifyApiUrl = "https://tnbmx.myshopify.com/admin/api/2023-07/orders.json?limit=250&sort_by=created_at&order=desc";
    const apiKey = "5c80a75296888fb5ec0003eefefdd29a";
    const password = "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";
    
    const response = await axios.get(shopifyApiUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey + ":" + password).toString("base64")}`,
      },
    });
    
    const data = response.data;

    // Devuelve los datos de Shopify como respuesta
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes de Shopify' });
  }
});

app.get("/api/clientes", async (req, res) => {
  try {
    // Aquí realiza la solicitud a la API de Shopify y procesa los datos
    // Puedes usar Axios o cualquier otra biblioteca que prefieras para hacer la solicitud

    // Ejemplo de solicitud a Shopify usando Axios:
   
    const shopifyApiUrl = "https://tnbmx.myshopify.com/admin/api/2023-07/customers.json?limit=250&sort_by=created_at&order=desc";
    const apiKey = "5c80a75296888fb5ec0003eefefdd29a";
    const password = "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";
    
    const response = await axios.get(shopifyApiUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey + ":" + password).toString("base64")}`,
      },
    });
    
    const data = response.data;

    // Devuelve los datos de Shopify como respuesta
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes de Shopify' });
  }
});
app.get("/api/productos", async (req, res) => {
  try {
    // Aquí realiza la solicitud a la API de Shopify y procesa los datos
    // Puedes usar Axios o cualquier otra biblioteca que prefieras para hacer la solicitud

    // Ejemplo de solicitud a Shopify usando Axios:
   
    const shopifyApiUrl = "https://tnbmx.myshopify.com/admin/api/2023-07/producs.json";
    const apiKey = "5c80a75296888fb5ec0003eefefdd29a";
    const password = "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";
    
    const response = await axios.get(shopifyApiUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey + ":" + password).toString("base64")}`,
      },
    });
    
    const data = response.data;

    // Devuelve los datos de Shopify como respuesta
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes de Shopify' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
