import React, { useEffect, useState } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import "./shopify.css";
import { Button, Container } from "reactstrap";
import axios from "axios";
import { jezaApi } from "../../api/jezaApi";
import Swal from "sweetalert2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";

function ShopifySinc() {
  const [ordersJson, setOrdersJson] = useState(null);
  const [clientJson, setClientJson] = useState(null);
  const [productJson, setProductJson] = useState(null);
  const [error, setError] = useState(null);
  const [jsonString, setJsonString] = useState("");

  const fetchClientes = async () => {
    // const permiso = await filtroSeguridad("sinc_cliente");
    // if (permiso === false) {
    //   return;
    // }

    try {
      // Mostrar SweetAlert de carga
      const loadingAlert = Swal.fire({
        title: "Sincronizando...",
        allowOutsideClick: false, // Evita que el usuario cierre la alerta
        showConfirmButton: false, // Oculta el botón de confirmación
        timerProgressBar: true, // Muestra la barra de progreso de tiempo
        didOpen: () => {
          Swal.showLoading();
          setTimeout(async () => {
            const response = await axios.get("http://localhost:3001/api/clientes");

            if (response.data) {
              // Ocultar SweetAlert de carga y mostrar el mensaje de éxito
              Swal.fire({
                title: "¡Sincronización exitosa!",
                icon: "success",
              });
              setClientJson(response.data);
              setError(null);
            } else {
              setError("Los datos de clientes no son válidos.");
            }
          }, 3000); // Cambiar el tiempo según tus necesidades
        },
      });
    } catch (error) {
      // Mostrar un mensaje de error
      console.error("Error al obtener los clientes:", error);
      setError("Ocurrió un error al obtener los clientes.");
    }
  };

  const fetchOrdenes = async () => {
    // const permiso = await filtroSeguridad("sinc_orden");
    // if (permiso === false) {
    //   return;
    // }
    try {
      // Mostrar SweetAlert de carga
      const loadingAlert = Swal.fire({
        title: "Sincronizando...",
        allowOutsideClick: false, // Evita que el usuario cierre la alerta
        showConfirmButton: false, // Oculta el botón de confirmación
        timerProgressBar: true, // Muestra la barra de progreso de tiempo
        didOpen: () => {
          Swal.showLoading();
          setTimeout(async () => {
            const response = await axios.get("http://localhost:3001/api/ordenes");

            if (response.data) {
              // Ocultar SweetAlert de carga y mostrar el mensaje de éxito
              Swal.fire({
                title: "¡Sincronización exitosa!",
                icon: "success",
              });
              setClientJson(response.data);
              setError(null);
            } else {
              setError("Los datos de clientes no son válidos.");
            }
          }, 3000); // Cambiar el tiempo según tus necesidades
        },
      });
    } catch (error) {
      // Mostrar un mensaje de error
      console.error("Error al obtener los clientes:", error);
      setError("Ocurrió un error al obtener los clientes.");
    }
  };

  return (
    <>
      <SidebarHorizontal></SidebarHorizontal>
      <Container>
        <h1>Sincronización Shopify</h1>

        <div className="centrado">
          <Button color="primary" onClick={() => fetchOrdenes()}>
            Órdenes
          </Button>
          <Button color="primary" onClick={() => fetchClientes()}>
            Clientes
          </Button>

          <Button color="primary" disabled="true" /* onClick={fetchProduct} */>
            Productos
          </Button>
        </div>
      </Container>
    </>
  );
}

export default ShopifySinc;
