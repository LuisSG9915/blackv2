import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Container,
  Card,
  CardHeader,
  CardBody,
  InputGroup,
  CardTitle,
  CardText,
  Input,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Col,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Asistencias } from "../../models/Asistencias";
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import "../../../css/tablaestilos.css";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { UserResponse } from "../../models/Home";
import CFormGroupInput from "../../components/CFormGroupInput";
import { BiCalendarCheck } from "react-icons/bi";
import dayjs from "dayjs";
import { Spinner } from "react-bootstrap";
function AsistenciaEmpleado() {
  const { filtroSeguridad, session } = useSeguridad();
  const [showView, setShowView] = useState(true);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  const [gpsData, setGpsData] = useState({ latitude: null, longitude: null }); // Estado para coordenadas GPS
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGpsData({ latitude, longitude });

          console.log(latitude)
          console.log(longitude)
          // Enviar coordenadas al servidor
       
        },
        (error) => {
          console.error("Error al obtener ubicación GPS:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("La geolocalización no está soportada por este navegador.");
    }
  }, []);





  const getPermisoPantalla = async (userData) => {
    try {
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=ASISTENCIA_TRABAJADOR`);

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


  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [form, setForm] = useState<Asistencias>({
    idEmpleado: 0, 	
    fecha	: "",
    // localizacion: "",
    longitud: "",
	  latitud: "",
	  mac: "",
    sucursal: 0,
  });


  // //AQUI COMIENZA MÉTODO AGREGAR SUCURSAL
  // const insertarAsistecia = async () => {
  //   const permiso = await filtroSeguridad("CAT_MARCA_ADD");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //     await jezaApi
  //       .post("/AsistenciaTrabajador", null, {
  //         params: {
  //           idEmpleado: dataUsuarios2[0]?.id,
  //           fecha: "2024-11-29 10:10:00",
  //           localizacion: "LOCALIZACIÓN DESDE FRONT",
  //           sucursal: dataUsuarios2[0]?.sucursal,
  //         },
  //       })
  //       .then((response) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Registro correcto",
  //           confirmButtonColor: "#3085d6",
  //         });
   
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Error",
  //           text: "Hubo un problema al actualizar la marca. Por favor, intenta nuevamente.",
  //           confirmButtonColor: "#d33",
  //         });
  //       });
  
 
  // };

const fechaActual = dayjs().format("YYYY-MM-DD HH:mm:ss");
console.log(fechaActual); // Ejemplo: 2024-11-29 10:10:00

const insertarAsistecia = async () => {
  const permiso = await filtroSeguridad("ASISTENCIA_TRABAJADOR");
  if (!permiso) {
    Swal.fire({
      icon: "warning",
      text: "No tienes permiso para registrar asistencias.",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  const { latitude, longitude } = gpsData; // Obtén las coordenadas desde el estado
  if (!latitude || !longitude) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo obtener la ubicación GPS. Verifica los permisos de tu navegador.",
      confirmButtonColor: "#d33",
    });
    return;
  }

  const fechaActual = dayjs().format("YYYY-MM-DD HH:mm:ss");

  setLoading(true); // Activar el spinner
  try {
    const response = await jezaApi.post("/AsistenciaTrabajador", null, {
      params: {
        idEmpleado: dataUsuarios2[0]?.id,
        fecha: fechaActual, // Fecha actual generada dinámicamente
        longitud: longitude,
        latitud: latitude,
        localizacion: "LOCALIZACIÓN DESDE FRONT",
        sucursal: dataUsuarios2[0]?.sucursal,
        mac: ".",
      },
    });

    const { codigo, mensaje } = response.data;

    Swal.fire({
      icon: codigo === 6 ? "success" : "info",
      text: mensaje || "Operación realizada.",
      confirmButtonColor: "#3085d6",
    });
  } catch (error) {
    console.error("Error al registrar la asistencia:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.mensaje || "Hubo un problema al registrar la asistencia.",
      confirmButtonColor: "#d33",
    });
  } finally {
    setLoading(false); // Desactivar el spinner
  }
};


  const [loading, setLoading] = useState(false);

const insertarAsisteciaor = async () => {
  const permiso = await filtroSeguridad("ASISTENCIA_TRABAJADOR");
  if (!permiso) {
    Swal.fire({
      icon: "warning",
      text: "No tienes permiso para registrar asistencias.",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  const fechaActual = dayjs().format("YYYY-MM-DD HH:mm:ss");

  setLoading(true); // Activar el spinner
  try {
    const response = await jezaApi.post("/AsistenciaTrabajador", null, {
      params: {
        idEmpleado: dataUsuarios2[0]?.id,
        // fecha: fechaActual, // Fecha actual generada dinámicamente
        longitud: longitude,
        latitud: latitude,
        localizacion: "LOCALIZACIÓN DESDE FRONT",
        sucursal: dataUsuarios2[0]?.sucursal,
        mac: "." ,
      },
    });

    const { codigo, mensaje } = response.data;

    Swal.fire({
      icon: codigo === 6 ? "success" : "info",
      text: mensaje || "Operación realizada.",
      confirmButtonColor: "#3085d6",
    });
  } catch (error) {
    console.error("Error al registrar la asistencia:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.mensaje || "Hubo un problema al registrar la asistencia.",
      confirmButtonColor: "#d33",
    });
  } finally {
    setLoading(false); // Desactivar el spinner
  }
};


  const obtenerIconoPorCodigo = (codigo) => {
    switch (codigo) {
      case 6: // Asistencia registrada correctamente
        return "success";
      case 2: // No se encontraron horarios
      case 4: // Salida anticipada
      case 3: // Retardo
        return "info";
      case 1: // Fecha inválida
        return "warning";
      default:
        return "error";
    }
  };
  

  


  // Redirige a la ruta "/app"
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>

        <SidebarHorizontal />
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
  <Row className="w-100 justify-content-center">
    <Col xs={12} md={8} lg={6} className="d-flex justify-content-center">
      <div className="p-4 shadow rounded bg-white text-center" style={{ width: "100%", maxWidth: "400px" }}>
        <h1 className="mb-4">
          Registro de Asistencias <BiCalendarCheck size={35} className="text-success" />
        </h1>
        <p className="text-muted">
          Presiona el botón para registrar tu asistencia de manera rápida y sencilla.
        </p>
        <div className="mt-4">
          <button
            onClick={insertarAsistecia}
            disabled={loading}
            className="btn btn-success"
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Procesando...
              </>
            ) : (
              "Registrar Asistencia"
            )}
          </button>
        </div>
      </div>
    </Col>
  </Row>
</Container>
{/*  */}
    </>
  );
}

export default AsistenciaEmpleado;
