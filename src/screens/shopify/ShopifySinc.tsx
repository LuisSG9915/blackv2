import React, { useEffect, useState } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import "./shopify.css";
import { Button, Container } from "reactstrap";
import axios from "axios";
import { jezaApi } from "../../api/jezaApi";
import Swal from "sweetalert2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useNavigate } from "react-router-dom";

function ShopifySinc() {
  const { filtroSeguridad, session } = useSeguridad();
  const [showView, setShowView] = useState(true);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ parsedItem });

      // Llamar a getPermisoPantalla después de que los datos se hayan establecido
      getPermisoPantalla(parsedItem);
    }
  }, []);

  const getPermisoPantalla = async (userData) => {
    try {
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_shopSinc_view`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].permiso === false) {
          Swal.fire("Error!", "No tiene los permisos para ver esta pantalla", "error");
          setShowView(false);
          handleRedirect();
        } else {
          setShowView(true);
     
        }
      } else {
        // No se encontraron datos válidos en la respuesta.
        setShowView(false);
      }
    } catch (error) {
      console.error("Error al obtener el permiso:", error);
    }
  };

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app"); // Redirige a la ruta "/app"
  };
  const [clientJson, setClientJson] = useState(null);
  const [error, setError] = useState(null);

  const fetchClientes = async () => {
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
            const response = await axios.get("http://cbinfo.no-ip.info:9086/api/clientes");

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
            const response = await axios.get("http://cbinfo.no-ip.info:9086/api/ordenes");

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
