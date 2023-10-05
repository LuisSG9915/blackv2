import React, { useState, useEffect, useMemo } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Container,
  Card,
  InputGroup,
  Alert,
  CardHeader,
  CardBody,
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
  Button,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Marca } from "../../models/Marca";
import { ImCancelCircle } from "react-icons/im";
import { Cancelacion } from "../../models/Cancelacion";
import { useCancelaciones } from "../../hooks/getsHooks/useCancelaciones";
import { TiCancel } from "react-icons/ti";
import { Usuario } from "../../models/Usuario";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import { UserResponse } from "../../models/Home";
import Swal from "sweetalert2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
function CancelacionVentas() {
  const { filtroSeguridad, session } = useSeguridad();
  const [showView, setShowView] = useState(true);
  // const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_cancelacionV_view`);

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

  const handleRedirect = () => {
    navigate("/app"); // Redirige a la ruta "/app"
  };

  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [dataUsuarios, setDataUsuarios] = useState<Usuario[]>([]);

  const navigate = useNavigate();
  const [form, setForm] = useState<Cancelacion>({
    No_venta: 0,
    Sucursal: 0,
    nombre: "",
    Total: 0,
    Estatus: "",
  });
  const [datos, setDatos] = useState([]);
  const [noVentaForm, setNoVentaForm] = useState("");

  const DataTableHeader = ["No. Venta", "Cliente", "Total Venta", "Estado", "Acciones"];

  // const mostrarModalActualizar = (dato: Marca) => {
  //   setForm(dato);
  //   console.log(dato);
  //   setModalActualizar(true);
  // };

  /* alertas */
  const [eliminado, setVisible3] = useState(false);

  const deleteVenta = (dato: Cancelacion) => {
    const idsCanceladas = dataCancelaciones.filter((item: Cancelacion) => item.Estatus === "Cancelada").map((item: Cancelacion) => item.No_venta);

    if (idsCanceladas.includes(Number(dato.No_venta))) {
      Swal.fire({
        icon: "info",
        text: "Venta ya está cancelada",
        confirmButtonColor: "#3085d6",
      });
    } else {
      Swal.fire({
        title: "ADVERTENCIA",
        text: `¿Está seguro que desea eliminar la venta No# : ${dato.No_venta}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          jezaApi
            .delete(`/VentaDia?no_venta=${dato.No_venta}&suc=${dataUsuarios2[0]?.sucursal}`)
            .then((response) => {
              setVisible3(true);
              fetchCancelaciones();
              setModalActualizar(false);
            })
            .catch((error) => {
              console.log(error);
            });

          setTimeout(() => {
            setVisible3(false);
          }, 3000);
        }
      });
    }
  };

  const getCancelacionesVtas = () => {
    jezaApi.get("/VentasDia?id=0").then((response) => {
      setDatos(response.data);
    });
  };

  useEffect(() => {
    getCancelacionesVtas();
  }, []);

  const filtroEmail = (datoMedico: string) => {
    var resultado = datos.filter((elemento: Marca) => {
      if (elemento.marca && (datoMedico === "" || elemento.marca.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.marca.length > 1) {
        return elemento;
      }
    });
    setDatos(resultado);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: Cancelacion) => ({ ...prevState, [name]: value }));
    console.log(form);
  };
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
    }
  }, []);
  const { dataCancelaciones, fetchCancelaciones } = useCancelaciones({ sucursal: dataUsuarios2[0]?.sucursal });
  const [fechaHoy, setFechaHoy] = useState("");
  useEffect(() => {
    const obtenerFechaHoy = () => {
      const fecha = new Date();
      const opcionesFecha = { year: "numeric", month: "numeric", day: "numeric" };
      const fechaFormateada = fecha.toLocaleDateString(undefined, opcionesFecha);
      setFechaHoy(fechaFormateada);
    };

    obtenerFechaHoy();
  }, []);

  // useEffect(() => {
  //   const item = localStorage.getItem("userLogged");
  //   if (item !== null) {
  //     const parsedItem = JSON.parse(item);
  //     setDataUsuarios(parsedItem);
  //   }
  // }, []);

  const columns: MRT_ColumnDef<Cancelacion>[] = useMemo(
    () => [
      {
        accessorKey: "acciones",
        header: "Acción",
        size: 100,
        Cell: ({ cell }) => (
          <>
            {cell.row.original.Estatus === "Pagada" ? (
              <AiFillDelete color="lightred" onClick={() => deleteVenta(cell.row.original)} size={23} />
            ) : (
              <TiCancel
                size={23}
                color="grey"
                onClick={() => {
                  Swal.fire({
                    icon: "info",
                    text: "Venta ya está cancelada",
                    confirmButtonColor: "#3085d6",
                  });
                }}
              />
            )}
          </>
        ),
      },

      {
        accessorKey: "No_venta",
        header: "No. venta",
        size: 5,
      },
      {
        accessorKey: "nombre",
        header: "Cliente",
        size: 5,
      },
      {
        accessorKey: "Total",
        header: "Total venta",

        Cell: ({ cell }) => <p>${cell.getValue<number>().toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>,
        muiTableBodyCellProps: {
          align: "right",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        size: 1,
      },
      {
        accessorKey: "Estatus",
        header: "Estado",
        size: 150,
        Cell: ({ cell }) => {
          const status = cell.row.original.Estatus;
          const statusLength = status.length;
          const padding = "0.25rem";
          const width = `calc(${Math.max(10, statusLength)}ch + ${padding})`;

          return (
            <Box
              component="span"
              sx={(theme) => ({
                backgroundColor: cell.row.original.Estatus === "Cancelada" ? "red" : "green", // Pintamos de verde si no está cancelada
                borderRadius: "0.25rem",
                color: "#fff",
                p: "0.25rem",
                display: "block",
                textAlign: "center", // Centramos el contenido de la celda
                width: width, // Ajustamos el ancho del Box en función de la longitud del texto y el padding
              })}
            >
              {status} {/* Utilizamos el texto del estado */}
            </Box>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <Alert color="success" isOpen={eliminado} toggle={() => setVisible3(false)}>
          Venta cancelada con éxito....
        </Alert>
        <br />
        <Row md={8}>
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1> Cancelación de la venta  <ImCancelCircle size={30}></ImCancelCircle></h1>

            </div>
          </Col>
        </Row>
        <br />
        <br />
        <MaterialReactTable columns={columns} data={dataCancelaciones} initialState={{ density: "compact" }} />
      </Container>
    </>
  );
}

export default CancelacionVentas;
