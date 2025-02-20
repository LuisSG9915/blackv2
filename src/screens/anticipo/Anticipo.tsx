import React, { useState, useEffect, useMemo } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";

import {
  Row,
  Container,
  Col,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Input,
  Label,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
  InputGroup,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Sucursal } from "../../models/Sucursal";
import { useCias } from "../../hooks/getsHooks/useCias";
import Swal from "sweetalert2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useAnticipos } from "../../hooks/getsHooks/useAnticipo";
import { AnticipoGet } from "../../models/Anticipo";
import { UserResponse } from "../../models/Home";
import { format } from "date-fns";
import TableCliente from "../ventas/Components/TableCliente";
import { useClientes } from "../../hooks/getsHooks/useClientes";
import TableClienteAnticipos from "../ventas/Components/TableClienteAnticipos";
import { FormaPago } from "../../models/FormaPago";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { useFormasPagos } from "../../hooks/getsHooks/useFormasPagos";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
function Anticipo() {
  const { filtroSeguridad, session } = useSeguridad();
  const [showView, setShowView] = useState(true);

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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_Anticipos_view`);

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
  const { dataClientes, fetchClientes } = useClientes();
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  const { dataAnticipos, fetchAnticipos } = useAnticipos({ cia: dataUsuarios2[0]?.cia });
  const [modalCliente, setModalCliente] = useState(false);
  const [descripcionReporte, setDescripcionReporte] = useState("Seleccione un reporte");
  const [trabajador, setTrabajadores] = useState([]);
  const [modalOpenCli, setModalOpenCli] = useState(false);
  const [selectedName, setSelectedName] = useState(""); // Estado para almacenar el nombre seleccionado
  const [selectedIdC, setSelectedIdC] = useState(""); // Estado para almacenar el nombre seleccionado
  useEffect(() => {
    // Dentro de useEffect, realizamos la solicitud a la API
    jezaApi
      .get("/Cliente?id=0")
      .then((response) => {
        // Cuando la solicitud sea exitosa, actualizamos el estado
        setTrabajadores(response.data);
      })
      .catch((error) => {
        // Manejo de errores
        console.error("Error al cargar los trabajadores:", error);
      });
  }, []); // El segundo argumento [] indica que este efecto se ejecuta solo una vez al montar el componente

  const handleModalSelect = async (id_cliente: number, name: string) => {
    setSelectedIdC(id_cliente);
    setFormulario({
      ...formulario,
      cliente: id_cliente, // O formulario.cliente: name si deseas guardar el nombre
    });
    setSelectedName(name);
    cerrarModal();
  };

  const columnsTrabajador: MRT_ColumnDef<any>[] = useMemo(
    () => [
      {
        header: "Acciones",
        Cell: ({ row }) => {
          console.log(row.original);
          return <CButton color="secondary" text="Seleccionar" onClick={() => handleModalSelect(row.original.id_cliente, row.original.nombre)} />;
        },
      },
      {
        accessorKey: "id_cliente",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 100,
      },
    ],
    []
  );

  // Función para abrir el modal
  const abrirModal = () => {
    setModalOpenCli(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalOpenCli(false);
  };

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ parsedItem });
    }
  }, []);
  const [data, setData] = useState<Sucursal[]>([]);

  const [dataPago, setDataPago] = useState<FormaPago[]>([]);
  const [reportes, setReportes] = useState([]);
  const { dataCias, fetchCias } = useCias();
  const { dataSucursales, fetchSucursales } = useSucursales();
  const [idActualizar, setIdActualizar] = useState(null);
  const [formulario, setFormulario] = useState({
    reporte: "",
    fechaInicial: "",
    fechaFinal: "",
    sucursal: "",
    compania: "",
    cliente: "",
    almacen: "",
    tipoMovimiento: "",
    proveedor: "",
    estilista: "",
    metodoPago: "",
    empresa: "",
    sucursalDestino: "",
    almacenDestino: "",
  });

  const [formPago, setFormPago] = useState<FormaPago>({
    id: 0,
    descripcion: "",
    grupo_operacion: 0,
    sucursal: 0,
    nombreSuc: "",
    tarjeta: false,
    tipo: 0,
  });

  const [form, setForm] = useState<AnticipoGet>({
    id: 0,
    caja: 0,
    cia: 0,
    fecha: "",
    fechaMovto: "",
    idCliente: 0,
    idUsuario: 0,
    importe: 0,
    no_venta: 0,
    nombreCia: "",
    nombreSuc: "",
    nombreUsr: "",
    observaciones: "",
    referencia: "",
    sucursal: 0,
    tipoMovto: 0,
    d_cliente: "",
    idformaPago: 0,
  });

  const mostrarModalActualizar = (dato: any) => {
    setIdActualizar(dato.id);
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);
  const currentDate = new Date();

  // Formatea la fecha actual en el formato deseado (20230726)
  const formattedDate = format(currentDate, "yyyyMMdd");

  const validarCampos = () => {
    const camposRequeridos: (keyof AnticipoGet)[] = ["idCliente", "importe", "observaciones", "fechaMovto"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof AnticipoGet) => {
      const fieldValue = form[campo];
      if (!fieldValue || String(fieldValue).trim() === "") {
        camposVacios.push(campo);
      }
    });

    setCamposFaltantes(camposVacios);

    if (camposVacios.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: `Los siguientes campos son requeridos: ${camposVacios.join(", ")}`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    }
    return camposVacios.length === 0;
  };

  //LIMPIEZA DE CAMPOS
  const [estado, setEstado] = useState("");
  const limpiezaFormAnticipos = () => {
    setForm({
      ...form,
      fechaMovto: "",
      d_cliente: "",
      id: 0,
      referencia: "",
      importe: 0,
      observaciones: "",
    });
  };
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_ANT_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .post("/Anticipo", null, {
          params: {
            cia: dataUsuarios2[0]?.idCia,
            sucursal: dataUsuarios2[0]?.sucursal,
            caja: 1,
            fecha: form.fechaMovto.replace(/-/g, ""),
            no_venta: 0,
            fechaMovto: formattedDate,
            idCliente: form.idCliente,
            idUsuario: dataUsuarios2[0]?.id,
            tipoMovto: 2,
            referencia: form.referencia,
            id_formaPago: formPago.id,
            importe: form.importe * -1,
            observaciones: form.observaciones,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Anticipo creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          fetchAnticipos();
          ejecutaPeticion(formulario.reporte);
          limpiezaFormAnticipos();
          // LIMPIEZA DE CAMPOS . ... . . . . . . .. . .
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const editar = async (id) => {
    if (!id) {
      return;
    }

    const permiso = await filtroSeguridad("CAT_ANT_UPD");
    if (permiso === false) {
      return;
    }

    if (validarCampos() === true) {
      await jezaApi
        .put(`/Anticipo?id=${id}&fechamovto=${formattedDate}&referencia=${form.referencia}&observaciones=${form.observaciones}`)
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Anticipo actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          fetchAnticipos();
          ejecutaPeticion(formulario.reporte);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // Mostrar mensajes de validación si es necesario
    }
  };

  // const eliminar = async (id) => {
  //   // Recibe el id como parámetro
  //   const permiso = await filtroSeguridad("CAT_ANT_DEL");
  //   if (permiso === false || !id) {
  //     return;
  //   }

  //   Swal.fire({
  //     title: "ADVERTENCIA",
  //     text: `¿Está seguro que desea eliminar el anticipo? ${id}`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Sí, eliminar",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       jezaApi.delete(`/Anticipo?id=${id}`).then(() => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Registro eliminado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         ejecutaPeticion(formulario.reporte);
  //       });
  //     }
  //   });
  // };

  const eliminar = async (id) => {
    // Recibe el id como parámetro
    const permiso = await filtroSeguridad("CAT_ANT_DEL");

    if (permiso === false || !id) {
      return;
    }

    try {
      const result = await Swal.fire({
        title: "ADVERTENCIA",
        text: `¿Está seguro que desea eliminar el anticipo? ${id}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      });

      if (result.isConfirmed) {
        await jezaApi.delete(`/Anticipo?id=${id}`);

        Swal.fire({
          icon: "success",
          text: "Registro eliminado con éxito",
          confirmButtonColor: "#3085d6",
        });

        ejecutaPeticion(formulario.reporte);
      } else {
        // El usuario canceló la eliminación
        // Puedes manejar este caso si es necesario
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al eliminar el anticipo. Por favor, inténtalo de nuevo.",
        confirmButtonColor: "#d33",
      });
    }
  };

  //AQUÍ COMIENZA EL MÉTODO GET PARA VISUALIZAR LOS REGISTROS
  const getFormaPago = () => {
    jezaApi.get("/FormaPago?id=%").then((response) => {
      setDataPago(response.data); // Aquí se actualiza el estado dataPago con los datos de la API
    });
  };
  useEffect(() => {
    getFormaPago();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prevState: AnticipoGet) => ({ ...prevState, [name]: value }));

    console.log(form);
  };

  const [disabledReferencia, setdisabledReferencia] = useState(false);
  // const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedId = parseInt(event.target.value);
  //   const selectedFormaPago = dataPago.find((formapago) => formapago.id === selectedId);
  //   if (selectedFormaPago) {
  //     setFormPago(selectedFormaPago);
  //   }
  //   if (selectedFormaPago?.tipo == 1) {
  //     setdisabledReferencia(true);
  //   } else {
  //     setdisabledReferencia(false);
  //   }
  // };
  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = event.target.value;

    if (selectedId === "") {
      // Mostrar una alerta de SweetAlert2 indicando que debe seleccionar una forma de pago válida
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, selecciona una forma de pago válida.",
      });
    } else {
      const selectedFormaPago = dataPago.find((formapago) => formapago.id === parseInt(selectedId, 10));
      if (selectedFormaPago) {
        setFormPago(selectedFormaPago);
      }
      if (selectedFormaPago?.tipo === 1) {
        setdisabledReferencia(true);
        // Si la forma de pago tiene tipo 1, también podrías limpiar el campo de referencia
        setForm({ ...form, referencia: "" });
      } else {
        setdisabledReferencia(false);
      }
    }
  };

  const handleChange3 = (event) => {
    const { name, value } = event.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
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
  //REALIZA LA LIMPIEZA DE LOS CAMPOS AL CREAR UNA SUCURSAL

  const LimpiezaForm = () => {
    setForm({ ...form, id: 0, idCliente: 0, referencia: "", importe: 0, observaciones: "", fechaMovto: "" });
  };

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => eliminar(params.row)} size={23}></AiFillDelete>
        {/* <AiFillDelete color="lightred" onClick={() => console.log(params.row.id)} size={23}></AiFillDelete> */}
      </>
    );
  };

  function DataTable() {
    const getRowId = (row: AnticipoGet) => row.id;
    return (
      <div className="table-responsive" style={{ height: "59%", overflow: "auto" }}>
        <div style={{ height: "100%", display: "table", tableLayout: "fixed", width: "100%" }}>
          <DataGrid
            rows={dataAnticipos}
            columns={columns}
            hideFooter={false}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 15 },
              },
            }}
            pageSizeOptions={[5, 10]}
            getRowId={getRowId}
          />
        </div>
      </div>
    );
  }
  const handleOpenNewWindow = () => {
    const url = "https://www.example.com"; // Reemplaza esto con la URL que desees abrir
    const width = 600;
    const height = 500;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;

    // Open the new window
    window.open(url, "_blank", features);
  };
  const mostrarModalClienteActualizar = () => {
    setModalCliente(true);
  };

  const columnasTabla = [
    {
      accessorKey: "acciones",
      header: "Acción",
      isVisible: true,
      Cell: ({ row }) => (
        <>
          <AiFillEdit
            className="mr-2"
            onClick={() => {
              setIdActualizar(row.original.id); // Establece el id a actualizar
              mostrarModalActualizar(row.original); // Abre el modal
            }}
            size={23}
          ></AiFillEdit>
          <AiFillDelete
            color="lightred"
            onClick={() => eliminar(row.original.id)} // Pasa el id como parámetro
            size={23}
          ></AiFillDelete>
        </>
      ),
    },

    {
      accessorKey: "id",
      header: "ID",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "nombreCia",
      header: "Empresa",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "nombreSuc",
      header: "Sucursal",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "caja",
      header: "Caja",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "no_venta",
      header: "No.Venta",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "fechaMovto",
      header: "Fecha de movimiento",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "nombreCliente",
      header: "Cliente",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "nombreUsr",
      header: "Usuario",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "descMovto",
      header: "Motivo",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "referencia",
      header: "Referencia",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "descFormaPago",
      header: "Forma de pago",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "importe",
      header: "Importe",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "observaciones",
      header: "Observaciones",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    // Agrega más objetos para cada columna que desees mostrar
  ];

  const [tablaData, setTablaData] = useState({
    data: [],
    columns: [],
  });

  const ejecutaPeticion = async (reporte) => {
    const permiso = await filtroSeguridad("CAT_ANT_SEL");
    if (permiso === false) {
      return;
    }

    // Copiamos el formulario actual para no modificar el estado original
    const formData = { ...formulario };

    // Reemplazamos los campos vacíos con '%'
    for (const campo in formData) {
      if (formData[campo] === "") {
        formData[campo] = "%";
      }
    }

    const fechaInicialFormateada = obtenerFechaSinGuiones(formData.fechaInicial);
    const fechaFinalFormateada = obtenerFechaSinGuiones(formData.fechaFinal);

    const queryString = `/Anticipo?id=%&idcia=${dataUsuarios2[0]?.cia ? dataUsuarios2[0]?.cia : "%"}&idsuc=${
      formData.sucursal
    }&idnoVenta=%&idCliente=${formData.cliente}&idtipoMovto=%&idformaPago=%&f1=${fechaInicialFormateada}&f2=${fechaFinalFormateada}`;

    jezaApi
      .get(queryString)
      .then((response) => response.data)
      .then((responseData) => {
        // Buscar el objeto que corresponde al valor seleccionado en el input select
        const selectedReporte = data.find((item) => item.metodoApi === reporte);

        if (selectedReporte) {
          // Si se encuentra el objeto, actualizar la descripción en el estado
          setDescripcionReporte(selectedReporte.descripcion);
        } else {
          // Si no se encuentra el objeto, mostrar el mensaje predeterminado
          setDescripcionReporte("Seleccione un reporte");
        }
        setReportes(responseData);
        setTablaData({
          data: responseData,
          columns: responseData.length > 0 ? Object.keys(responseData[0]) : [],
        });
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  };

  const obtenerFechaSinGuiones = (fechaISO8601) => {
    // La fechaISO8601 viene en formato "yyyy-mm-dd"
    // Utilizamos slice para obtener partes de la cadena y luego las concatenamos
    return fechaISO8601.slice(0, 4) + fechaISO8601.slice(5, 7) + fechaISO8601.slice(8, 10);
  };
  const [formasPagosFiltradas, setFormasPagosFiltradas] = useState<FormaPago[]>([]);
  useEffect(() => {
    const formasPagosFiltradas = dataPago.filter((formaPago) => formaPago.sucursal === dataUsuarios2[0]?.sucursal);
    setFormasPagosFiltradas(formasPagosFiltradas);
  }, [dataPago]);

  const [clientJson, setClientJson] = useState(null);
  const [error, setError] = useState(null);

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
            const response = await axios.get("https://cbinfo.no-ip.info:9086/api/ordenes");

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
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <Row>
          <Col>
            <Container fluid>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1>
                  {" "}
                  Anticipos <HiBuildingStorefront size={35}></HiBuildingStorefront>{" "}
                </h1>
              </div>
              <br />
              <Row>
                <div>
                  <br />
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button
                      style={{ marginLeft: "auto" }}
                      color="success"
                      onClick={() => {
                        setModalInsertar(true);
                        setEstado("insert");
                        LimpiezaForm();
                      }}
                    >
                      Crear anticipos
                    </Button>

                    <Button color="primary" onClick={handleRedirect}>
                      <IoIosHome size={20}></IoIosHome>
                    </Button>
                    <Button onClick={handleReload}>
                      <IoIosRefresh size={20}></IoIosRefresh>
                    </Button>
                  </ButtonGroup>
                </div>
              </Row>
            </Container>
            <br />
            <br />
            <UncontrolledAccordion defaultOpen="1">
              <AccordionItem>
                <AccordionHeader targetId="1">Consulta de anticipos</AccordionHeader>
                <AccordionBody accordionId="1">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}></div>
                  <br />
                  <Row>
                    <Col sm="6">
                      <Label>Clientes:</Label>
                      <InputGroup>
                        <Input
                          type="text"
                          name="cliente"
                          value={selectedName} // Usamos selectedId si formulario.cliente está vacío
                          // bsSize="sm"
                          placeholder="Ingrese el cliente"
                        />
                        <CButton color="secondary" text="Seleccionar" onClick={abrirModal}></CButton>
                      </InputGroup>
                      <br />
                    </Col>

                    <Col sm="3">
                      <Label>Fecha inicial:</Label>
                      <Input type="date" name="fechaInicial" value={formulario.fechaInicial} onChange={handleChange3} bsSize="sm" />
                    </Col>

                    <Col sm="3">
                      <Label>Fecha final:</Label>
                      <Input type="date" name="fechaFinal" value={formulario.fechaFinal} onChange={handleChange3} bsSize="sm" />
                    </Col>

                    <Col sm="3">
                      <Label>Sucursal:</Label>
                      <Input type="select" name="sucursal" value={formulario.sucursal} onChange={handleChange3} bsSize="sm">
                        <option value={""}>Seleccione la sucursal</option>

                        {dataSucursales.map((item) => (
                          <option value={item.sucursal}>{item.nombre}</option>
                        ))}
                      </Input>
                    </Col>

                    <Col sm="3">
                      <Label>Empresa:</Label>
                      <Input type="select" name="empresa" value={formulario.empresa} onChange={handleChange3} bsSize="sm">
                        <option value="">Seleccione la empresa</option>

                        {dataCias.map((item) => (
                          <option value={item.id}>{item.nombre}</option>
                        ))}
                      </Input>
                      <br />
                    </Col>
                  </Row>
                  <br />
                  <Col sm="6">
                    <CButton color="primary" text="Consultar" onClick={() => ejecutaPeticion(formulario.reporte)}></CButton>
                    {/* <Button color="primary" onClick={() => fetchOrdenes()}>
                      Órdenes
                    </Button> */}
                  </Col>
                </AccordionBody>
              </AccordionItem>
            </UncontrolledAccordion>
            {/* <TableSucursal dataCia={dataCias} DataTableHeader={DataTableHeader} data={data} eliminar={eliminar} mostrarModalActualizar={mostrarModalActualizar} /> */}
            <MaterialReactTable
              columns={columnasTabla}
              data={tablaData.data}
              enableRowSelection={false}
              rowSelectionCheckboxes={false}
              initialState={{ density: "compact" }}
            />
          </Col>
        </Row>
      </Container>

      {/* AQUÍ COMIENZA EL MODAL PARA AGREGAR SUCURSALES */}
      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar anticipo </h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="referencia">Referencia:</Label>
              <Input type="text" name="referencia" id="referencia" value={form.referencia} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label for="observaciones">Observaciones:</Label>
              <Input type="text" name="observaciones" id="observaciones" value={form.observaciones} onChange={handleChange} />
            </FormGroup>
          </Form>{" "}
        </ModalBody>

        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => editar(idActualizar)} // Pasa el id como parámetro
            text="Actualizar"
          />
          <CButton
            color="danger"
            onClick={() => {
              cerrarModalActualizar();
              limpiezaFormAnticipos();
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>

      {/* AQUÍ COMIENZA EL MODAL PARA AGREGAR SUCURSALES */}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Crear anticipo</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="fechaMovto">Fecha del anticipo:</Label>
              <Input type="date" name="fechaMovto" id="fechaMovto" value={form.fechaMovto} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              {/* SELECT */}
              <Label for="idCliente">Cliente:</Label>
              <InputGroup>
                <Input disabled type="text" name="d_cliente" id="d_cliente" value={form.d_cliente} onChange={handleChange} />
                <CButton color="secondary" text="Seleccionar" onClick={mostrarModalClienteActualizar}></CButton>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Forma de pago:</Label>
              <Input type="select" name="id" id="id" value={formPago.id} onChange={handleChange1}>
                <option value={""}>Selecciona forma de pago</option>
                {formasPagosFiltradas.map((formapago: FormaPago) => (
                  <option key={formapago.id} value={formapago.id}>
                    {formapago.descripcion}
                  </option>
                ))}
              </Input>
            </FormGroup>
            {!disabledReferencia ? (
              <FormGroup>
                <Label for="referencia">Referencia:</Label>
                <Input type="text" name="referencia" id="referencia" value={form.referencia} onChange={handleChange} />
              </FormGroup>
            ) : null}
            <FormGroup>
              <Label for="importe">Importe:</Label>
              <Input type="number" name="importe" id="importe" value={form.importe} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="observaciones">Observaciones:</Label>
              <Input type="text" name="observaciones" id="observaciones" value={form.observaciones} onChange={handleChange} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar anticipo" />
          <CButton
            color="danger"
            onClick={() => {
              setModalInsertar(false);
              limpiezaFormAnticipos();
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalCliente} size="lg">
        <ModalHeader>
          <h3>Seleccione cliente</h3>{" "}
        </ModalHeader>
        <ModalBody>
          <TableClienteAnticipos form={form} setForm={setForm} data={dataClientes} setModalCliente={setModalCliente}></TableClienteAnticipos>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalCliente(false);
              console.log(modalCliente);
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalOpenCli} toggle={cerrarModal}>
        <ModalHeader toggle={cerrarModal}>
          <h3>Seleccione cliente</h3>
        </ModalHeader>
        <ModalBody>
          <MaterialReactTable
            columns={columnsTrabajador}
            data={trabajador}
            onSelect={(id_cliente, name) => handleModalSelect(id_cliente, name)} // Pasa la función de selección
            initialState={{ density: "compact" }}
          />
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={cerrarModal} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Anticipo;
