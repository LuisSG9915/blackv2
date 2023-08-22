import React, { useState } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import "./shopify.css";
import { Button, Container } from "reactstrap";
import axios from "axios";

function ShopifySinc() {
  const [ordersJson, setOrdersJson] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/orders"); // Obtener datos de órdenes

      if (response.data) {
        setOrdersJson(response.data);
        setError(null);

        await sendOrdersToJeza(response.data);
      } else {
        setError("Los datos de órdenes no son válidos.");
      }
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      setError("Ocurrió un error al obtener las órdenes.");
    }
  };

  const sendOrdersToJeza = async (ordersData) => {
    try {
      // Crear un objeto con la configuración de la solicitud PUT
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ json: ordersData }), // Enviar datos como objeto JSON
      };
  
      // URL de la API (actualiza con la URL correcta)
      const apiUrl = 'http://cbinfo.no-ip.info:9089/ShopifyOrders?json=';
      
      // Realizar la solicitud PUT utilizando fetch
      const response = await fetch(apiUrl, requestOptions);
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Respuesta de la API:", responseData);
      } else {
        console.error("Error en la solicitud PUT:", response.status);
        // Manejar errores de la solicitud PUT aquí
      }
    } catch (error) {
      console.error("Error al enviar las órdenes a Jeza:", error);
      // Manejar errores aquí
    }
  };

  return (
    <>
      <SidebarHorizontal></SidebarHorizontal>

      <Container>
        <h1>Sincronización Shopify</h1>

        <div className="centrado">
          <Button color="primary" onClick={fetchOrders}>
            Órdenes
          </Button>
          <Button color="primary">Clientes</Button>
          <Button color="primary">Productos</Button>
        </div>
      </Container>

      {error && <p className="error-message">{error}</p>}

      {ordersJson && (
        <div>
          <h2>Respuesta JSON de Órdenes:</h2>
          <pre>{JSON.stringify(ordersJson, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default ShopifySinc;
