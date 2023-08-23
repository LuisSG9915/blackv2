import React, { useState } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import "./shopify.css";
import { Button, Container } from "reactstrap";
import axios from "axios";
import { jezaApi } from "../../api/jezaApi";
import Swal from "sweetalert2";

function ShopifySinc() {
  const [ordersJson, setOrdersJson] = useState(null);
  const [clientJson, setClientJson] = useState(null);
  const [productJson, setProductJson] = useState(null);
  const [error, setError] = useState(null);
  const [jsonString, setJsonString] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/orders");

      if (response.data) {
        setOrdersJson(response.data);
        setError(null);
        const jsonString = transformToJsonString(response.data);
        setJsonString(jsonString); // Actualiza el estado con la cadena JSON transformada
        await sendOrders(response.data);
      } else {
        setError("Los datos de órdenes no son válidos.");
      }
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      setError("Ocurrió un error al obtener las órdenes.");
    }
  };

  const sendOrders = async (ordersData) => {
    try {
      // Convierte el objeto JSON a una cadena y escapa las comillas dobles
      const jsonString = JSON.stringify(ordersData).replace(/"/g, '\\"');

      // Envuelve la cadena JSON entre comillas
      const wrappedJsonString = `"${jsonString}"`;

      // Realiza la solicitud POST con la cadena JSON envuelta en comillas como cuerpo
      await jezaApi
        .post("/ShopifyOrders", wrappedJsonString, {
          headers: {
            "Content-Type": "application/json", // Indica que el cuerpo es texto plano
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Sincronización exitosa",
            confirmButtonColor: "#3085d6",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error al enviar las órdenes a Jeza:", error);
      // Manejar errores aquí
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/clientes");

      if (response.data) {
        setClientJson(response.data);
        setError(null);
        const jsonString = transformToJsonString(response.data);
        setJsonString(jsonString); // Actualiza el estado con la cadena JSON transformada
        await sendClientes(response.data);
      } else {
        setError("Los datos de órdenes no son válidos.");
      }
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      setError("Ocurrió un error al obtener las órdenes.");
    }
  };

  const sendClientes = async (clientData) => {
    try {
      // Convierte el objeto JSON a una cadena y escapa las comillas dobles
      const jsonString = JSON.stringify(clientData).replace(/"/g, '\\"');

      // Envuelve la cadena JSON entre comillas
      const wrappedJsonString = `"${jsonString}"`;

      // Realiza la solicitud POST con la cadena JSON envuelta en comillas como cuerpo
      await jezaApi
        .post("/ShopifyClientes", wrappedJsonString, {
          headers: {
            "Content-Type": "application/json", // Indica que el cuerpo es texto plano
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Sincronización exitosa",
            confirmButtonColor: "#3085d6",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error al enviar las órdenes a Jeza:", error);
      // Manejar errores aquí
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/productos");

      if (response.data) {
        setProductJson(response.data);
        setError(null);
        const jsonString = transformToJsonString(response.data);
        setJsonString(jsonString); // Actualiza el estado con la cadena JSON transformada
        await sendProducts(response.data);
      } else {
        setError("Los datos de órdenes no son válidos.");
      }
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      setError("Ocurrió un error al obtener las órdenes.");
    }
  };

  const sendProducts = async (productsData) => {
    try {
      // Convierte el objeto JSON a una cadena y reemplaza las comillas simples por dobles
      let jsonString = JSON.stringify(productsData).replace(/'/g, '"');

      // Escapa las comillas dobles dentro de la cadena JSON
      jsonString = jsonString.replace(/"/g, '\\"');

      // Envuelve la cadena JSON entre comillas
      const wrappedJsonString = `"${jsonString}"`;

      alert(wrappedJsonString);

      // Realiza la solicitud POST con la cadena JSON envuelta en comillas como cuerpo
      //   await jezaApi
      //     .post("/ShopifyProducts", wrappedJsonString, {
      //       headers: {
      //         "Content-Type": "application/json", // Indica que el cuerpo es texto plano
      //       },
      //     })
      //     .then((response) => {
      //       Swal.fire({
      //         icon: "success",
      //         text: "Sincronización exitosa",
      //         confirmButtonColor: "#3085d6",
      //       });
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
    } catch (error) {
      console.error("Error al enviar las órdenes a Jeza:", error);
      // Manejar errores aquí
    }
  };

  function transformToJsonString(data) {
    let jsonString = JSON.stringify(data);
    jsonString = jsonString.replace(/"/g, '\\"').replace(/\\/g, "\\\\");
    return jsonString;
  }

  return (
    <>
      <SidebarHorizontal></SidebarHorizontal>
      <Container>
        <h1>Sincronización Shopify</h1>

        <div className="centrado">
          <Button color="primary" onClick={fetchOrders}>
            Órdenes
          </Button>
          <Button color="primary" onClick={fetchClientes}>
            Clientes
          </Button>
          <Button color="primary" disabled="true" onClick={fetchProduct}>
            Productos...en construccion
          </Button>
        </div>
      </Container>
      {error && <p className="error-message">{error}</p>}
      
      {/* {ordersJson && (
        <div>
          <h2>Respuesta JSON de Órdenes:</h2>
          <pre>{JSON.stringify(ordersJson, null, 2)}</pre>
        </div>
      )} */}
      {jsonString && (
        <div>
          <h2>JSON con caracteres cambiados:</h2>
          <pre>{jsonString}</pre>
        </div>
      )}
    </>
  );
}

export default ShopifySinc;
