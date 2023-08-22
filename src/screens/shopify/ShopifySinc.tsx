import React, { useState } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import "./shopify.css";
import { Button, Container } from "reactstrap";
import axios from "axios";
import { jezaApi } from "../../api/jezaApi";

function ShopifySinc() {
  const [ordersJson, setOrdersJson] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/orders"); // Obtener datos de órdenes

      // Verificar si response.data es válido antes de enviarlo
      if (response.data) {
        // Convertir los datos de órdenes a una cadena JSON y agregar comillas al inicio y al final
        const ordersJsonString = `'${JSON.stringify(response.data)}'`;

        // Realizar la solicitud PUT con los datos de órdenes
        const apicb = await jezaApi.put(`/ShopifyOrders?Json=${encodeURIComponent(ordersJsonString)}`);
        console.log("Respuesta de jezaApi.put:", apicb.data);

        setOrdersJson(response.data); // Actualizar el estado con los datos de órdenes recibidos
        setError(null);
      } else {
        setError("Los datos de órdenes no son válidos.");
      }
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      setError("Ocurrió un error al obtener las órdenes.");
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

      {ordersJson && <div>{/* <pre>{JSON.stringify(ordersJson, null, 2)}</pre> */}</div>}
    </>
  );
}

export default ShopifySinc;

//   // Función para obtener las órdenes de Shopify
//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/orders");
//       // Ruta de tu servidor backend
//       setOrdersJson(response.data);
//       setError(null);

//       const apicb = await jezaApi.put(`/ShopifyOrders?Json=${ordersJson}`);
//       console.log("Respuesta de jezaApi.put:", apicb.data);

//     } catch (error) {
//       console.error("Error al obtener las órdenes:", error);
//       setError("Ocurrió un error al obtener las órdenes.");
//     }
//   };
