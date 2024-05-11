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
import { RespuestaClie } from "../../models/RespuestaClie";
import { useRespuesta } from "../../hooks/getsHooks/useRespuesta";
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
import { clientesAgendado } from "../../models/clientesAgendado";
import { clientesAgendadoAct } from "../../models/clientesAgendadoAct";
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
import { FcCalendar } from "react-icons/fc";
import Select from "react-select";
import { useProductosFiltradoExistenciaProductoAlm } from "../../hooks/getsHooks/useProductosFiltradoExistenciaProductoAlm";
import { useUsuarios } from "../../hooks/getsHooks/useUsuarios";
import { MdOutlineEditCalendar } from "react-icons/md";
import { TfiAgenda } from "react-icons/tfi";
import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";
import { Usuario } from "../models/Usuario";

import axios from "axios";
function Reagendado() {
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

  const {
    modalActualizar,
    modalInsertar,
    setModalInsertar,
    setModalActualizar,
    cerrarModalActualizar,
    cerrarModalInsertar,
    mostrarModalInsertar,
  } = useModalHook();
  const { dataClientes, fetchClientes } = useClientes();
  const [dataUsuarios2, setDataUsuarios2] = useState<Usuario[]>([]);
  const { dataAnticipos, fetchAnticipos } = useAnticipos({ cia: dataUsuarios2[0]?.cia });
  const [modalCliente, setModalCliente] = useState(false);
  const [descripcionReporte, setDescripcionReporte] = useState("Seleccione un reporte");
  const [trabajador, setTrabajadores] = useState([]);
  const [modalOpenCli, setModalOpenCli] = useState(false);
  const [selectedName, setSelectedName] = useState(""); // Estado para almacenar el nombre seleccionado
  const [selectedIdC, setSelectedIdC] = useState(""); // Estado para almacenar el nombre seleccionado
  const { dataUsuarios, fetchUsuarios } = useUsuarios();
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

  const handleChange3 = (event) => {
    const { name, value } = event.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };
  // const handleChange5 = (event) => {
  //   const { name, value } = event.target;

  //   // Actualiza el estado del formulario con la fecha seleccionada
  //   setForm({
  //     ...form,
  //     [name]: value,
  //   });

  //   // Calcula el rango de días si ambas fechas están seleccionadas
  //   if (form.d1 && form.d2) {
  //     const startDate = new Date(form.d1);
  //     const endDate = new Date(form.d2);

  //     // Calcula la diferencia en milisegundos
  //     const differenceInTime = endDate.getTime() - startDate.getTime();

  //     // Convierte la diferencia de milisegundos a días
  //     const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  //     // Agrega 1 porque el rango inclusivo debe incluir el día inicial y final
  //     const daysInRange = differenceInDays + 1;

  //     // Actualiza el estado del formulario con el rango de días calculado
  //     setForm({
  //       ...form,
  //       dayRange: daysInRange,
  //     });
  //   }
  // };
  const handleChange5 = (event) => {
    const { name, value } = event.target;

    // Extrae el día de la fecha seleccionada y conviértelo a un entero
    const selectedDay = parseInt(value.split("-")[2], 10); // Obtiene el día de la fecha en formato "yyyy-mm-dd"

    // Actualiza el estado del formulario con el día seleccionado
    setForm({
      ...form,
      [name]: selectedDay, // Asigna el día seleccionado a form.d1 o form.d2 según corresponda
    });
  };





  const columnsTrabajador: MRT_ColumnDef<any>[] = useMemo(
    () => [
      {
        header: "Acciones",
        Cell: ({ row }) => {
          console.log(row.original);
          return (
            <CButton
              color="secondary"
              text="Seleccionar"
              onClick={() => handleModalSelect(row.original.id_cliente, row.original.nombre)}
            />
          );
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

  const { dataRespuesta, fetchRespuesta } = useRespuesta();

  const { dataSucursales, fetchSucursales } = useSucursales();
  const [idActualizar, setIdActualizar] = useState(null);
  const [formulario, setFormulario] = useState({
    reporte: "",
    fechaInicial: "",
    fechaFinal: "",
    sucursal: "",
    claveProd: "",
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


  const [form, setForm] = useState<clientesAgendado>({
    suc: 0,
    d1: 0,
    d2: 0,
    usuario: 0,
  });

  const [form1, setForm1] = useState<clientesAgendadoAct>({
    id: 0,
    llamada1: false,
    llamada2: false,
    llamada3: false,
    idRespuesta: 0,
    observaciones: "",
    idUsuarioSeguimiento: 0,
  });

  const mostrarModalActualizar = (dato: any) => {
    setIdActualizar(dato.id);
    setForm1(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);
  const currentDate = new Date();

  // Formatea la fecha actual en el formato deseado (20230726)
  const formattedDate = format(currentDate, "yyyyMMdd");

  const validarCampos = () => {
    const camposRequeridos: (keyof clientesAgendado)[] = ["suc", "d1", "d2"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof clientesAgendado) => {
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
      suc: 0,
      d1: 0,
      d2: 0,
    });
  };
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_ANT_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .post("/sp_detalleSeguimiento", null, {
          params: {
            suc: form.suc,
            d1: form.d1,
            d2: form.d2,
            usuario: dataUsuarios2[0]?.id,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Registros creados con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          limpiezaFormAnticipos();
          // LIMPIEZA DE CAMPOS . ... . . . . . . .. . .
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    // if (validarCampos() === true) {
    await jezaApi
      .put(`/clienteReagendadoAct`, null, {
        params: {
          id: form1.id,
          llamada1: form1.llamada1,
          llamada2: form1.llamada2,
          llamada3: form1.llamada3,
          idRespuesta: form1.idRespuesta,
          idUsuarioSeguimiento: dataUsuarios2[0]?.id,
          observaciones: form1.observaciones,

        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          text: "Cliente actualizado con éxito",
          confirmButtonColor: "#3085d6",
        });
        setModalActualizar(false);

      })
      .catch((error) => {
        console.log(error);
      });
    // } else {
    // }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "llamada1" || name === "llamada2" || name === "llamada3") {
      setForm1((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm1((prevState: RespuestaClie) => ({ ...prevState, [name]: value }));
    }
  };


  const [disabledReferencia, setdisabledReferencia] = useState(false);


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

  const handleChange4 = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prevState: clientesAgendado) => ({ ...prevState, [name]: value }));

    console.log(form);
  };



  const [form3, setForm3] = useState<Usuario[]>([]);

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

  const { dataProductos4 } = useProductosFiltradoExistenciaProductoAlm({
    almacen: 71,
    cia: 1,
    descripcion: "%",
    idCliente: 26296,
    insumo: 0,
    inventariable: 0,
    obsoleto: 0,
    servicio: 2,
    sucursal: 21,
  });

  const optionsProductos = [
    { value: "", label: "--Selecciona un Producto--" },
    ...dataProductos4.map((item) => ({
      value: String(item.id),
      label: item.descripcion,
    })),
  ];

  const { dataTrabajadores } = useNominaTrabajadores();
  const dataFiltrada = dataTrabajadores.filter(estilista => estilista.status !== 2);
  const optionsEstilista = [
    { value: "", label: "--Selecciona un Estilista--" },
    ...dataFiltrada.map((item) => ({
      value: Number(item.id),
      label: item.nombre,
    })),
  ];

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
            size={35}
          ></AiFillEdit>
          <MdOutlineEditCalendar size={35}
            onClick={() => {

              // window.open = `http://cbinfo.no-ip.info:9085/?idRec=${dataUsuarios2[0].id}&suc=${dataUsuarios2[0].d_sucursal}&idSuc=${dataUsuarios2[0].sucursal}`;
              window.open(`http://cbinfo.no-ip.info:9085/?idRec=${dataUsuarios2[0].id}&suc=${dataUsuarios2[0].d_sucursal}&idSuc=${dataUsuarios2[0].sucursal}`, '_blank');

            }}
          >
          </MdOutlineEditCalendar >

          {/* <AiFillDelete
            color="lightred"
            onClick={() => eliminar(row.original.id)} // Pasa el id como parámetro
            size={23}
          ></AiFillDelete> */}
        </>
      ),
    },

    // {
    //   accessorKey: "id",
    //   header: "ID",
    //   isVisible: true,
    //   // Puedes agregar más propiedades de configuración aquí si es necesario
    // },

    {
      accessorKey: "fechaVisita",
      header: "Fecha última visita",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "nombre",
      header: "Sucursal",
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
      accessorKey: "nombreServicio",
      header: "Servicio",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "telefono",
      header: "Telefono/Instragram",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "nombreEstilista",
      header: "Estilista",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "fechaProximaCitaNormal",
      header: "Próxima cita",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "observaciones",
      header: "Observaciones",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "llamada1",
      header: "Llamada 1",
      isVisible: true,
      Cell: ({ row }) => {
        if (row.original.llamada1 === true) {
          return <Input type="checkbox" disabled="disabled" checked="checked" />;
        } else {
          return <Input type="checkbox" disabled="disabled" />;
        }
      },
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "llamada2",
      header: "Llamada 2",
      isVisible: true,
      Cell: ({ row }) => {
        if (row.original.llamada2 === true) {
          return <Input type="checkbox" disabled="disabled" checked="checked" />;
        } else {
          return <Input type="checkbox" disabled="disabled" />;
        }
      },
    },
    {
      accessorKey: "llamada3",
      header: "Llamada 3",
      isVisible: true,
      Cell: ({ row }) => {
        if (row.original.llamada3 === true) {
          return <Input type="checkbox" disabled="disabled" checked="checked" />;
        } else {
          return <Input type="checkbox" disabled="disabled" />;
        }
      },
    },
    {
      accessorKey: "dRespuesta",
      header: "Respuesta",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "fechaNuevaCita",
      header: "Fecha nueva cita",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "ServicioNuevaCita",
      header: "Nueva cita",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "dUsurioAltaSeguimiento",
      header: "Usr. Alta Seguiento",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    {
      accessorKey: "dUsurioSeguimiento",
      header: "Contacto",
      isVisible: true,
      // Puedes agregar más propiedades de configuración aquí si es necesario
    },
    // Agrega más objetos para cada columna que desees mostrar
  ];

  const [tablaData, setTablaData] = useState({
    data: [],
    columns: [],
  });

  const formatDate = (day) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${month}-${formattedDay}`;
  };

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

    const queryString = `/sp_repoDetalleSeguimiento?f1=${fechaInicialFormateada}&f2=${fechaFinalFormateada}&cliente=%&estilista=${formData.estilista
      }&claveProd=${formData.claveProd
      }&suc=${formData.sucursal
      }`;

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



  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <Row>
          <Col>
            <Container fluid>
              <br />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1>
                  {" "}
                  Reagendado de clientes <TfiAgenda size={35}></TfiAgenda>{" "}
                </h1>
              </div>
              <Row>
                <div>
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button
                      style={{ marginLeft: "auto" }}
                      color="secondary"
                      onClick={() => {
                        setModalInsertar(true);
                        setEstado("insert");
                        LimpiezaForm();
                      }}
                    >
                      Agregar registros
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
                <AccordionHeader targetId="1">Consulta de clientes</AccordionHeader>
                <AccordionBody accordionId="1">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}></div>
                  <br />
                  <Row>

                    <Col sm="3">
                      <Label>Fecha inicial:</Label>
                      <Input
                        type="date"
                        name="fechaInicial"
                        value={formulario.fechaInicial}
                        onChange={handleChange3}
                        bsSize="sm"
                      />
                    </Col>

                    <Col sm="3">
                      <Label>Fecha final:</Label>
                      <Input
                        type="date"
                        name="fechaFinal"
                        value={formulario.fechaFinal}
                        onChange={handleChange3}
                        bsSize="sm"
                      />
                    </Col>

                    <Col sm="3">
                      <Label>Estilista:</Label>
                      <Select
                        menuPlacement="top"
                        name="estilista"
                        options={optionsEstilista}
                        value={optionsEstilista.find((option) => option.value === formulario.estilista)}
                        onChange={(selectedOption) => {
                          // Aquí actualizas el valor en el estado form
                          setFormulario((prevState) => ({
                            ...prevState,
                            estilista: selectedOption ? selectedOption.value : "", // 0 u otro valor predeterminado
                          }));
                        }}
                        placeholder="--Selecciona una opción--"
                      />
                    </Col>

                    <Col sm="3">
                      <Label>Sucursal:</Label>
                      <Input
                        type="select"
                        name="sucursal"
                        value={formulario.suc}
                        onChange={handleChange3}
                        bsSize="sm"
                      >
                        <option value={""}>Seleccione la sucursal</option>

                        {dataSucursales.map((item) => (
                          <option value={item.sucursal}>{item.nombre}</option>
                        ))}
                      </Input>
                    </Col>

                    <Col sm="3">
                      <div>
                        <Label>Servicio:</Label>
                        <Select
                          menuPlacement="top"
                          // styles={{ placeholder }}
                          name="claveProd"
                          options={optionsProductos}
                          value={optionsProductos.find((option) => option.value === formulario.claveProd)}
                          onChange={(selectedOption) => {
                            // Aquí actualizas el valor en el estado form
                            setFormulario((prevState) => ({
                              ...prevState,
                              claveProd: selectedOption ? selectedOption.value : "", // 0 u otro valor predeterminado
                            }));
                          }}
                          placeholder="--Selecciona una opción--"
                        />
                      </div>
                    </Col>
                    <Col sm="6">
                      <Label>Cliente:</Label>
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


                  </Row>
                  <br />
                  <Col sm="6">
                    <CButton
                      color="primary"
                      text="Consultar"
                      onClick={() => ejecutaPeticion(formulario.reporte)}
                    ></CButton>
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

      <Modal isOpen={modalActualizar} size="lg">
        <ModalHeader>
          <div>
            <h3>Reagendar cliente</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              {/* Debe de coincidir el inputname con el value */}

              <Col md={"2"}>
                <br />
                <label className="checkbox-container">
                  <input type="checkbox" checked={form1.llamada1} onChange={handleChange} name="llamada1" />
                  <span className="checkmark"></span>
                  Llamada 1
                </label>
              </Col>
              <Col md={"2"}>
                <br />
                <label className="checkbox-container">
                  <input type="checkbox" checked={form1.llamada2} onChange={handleChange} name="llamada2" />
                  <span className="checkmark"></span>
                  Llamada 2
                </label>
              </Col>
              <Col md={"2"}>
                <br />
                <label className="checkbox-container">
                  <input type="checkbox" checked={form1.llamada3} onChange={handleChange} name="llamada3" />
                  <span className="checkmark"></span>
                  Llamada 3
                </label>
              </Col>
              <Col md={"6"}>
                <Label>Respuesta:</Label>
                <Input type="select" name="idRespuesta" id="idRespuesta" defaultValue={form1.idRespuesta} onChange={handleChange}>
                  <option value="">Seleccione respuesta del cliente</option>
                  {dataRespuesta.map((respuesta: RespuestaClie) => (
                    <option key={respuesta.id} value={respuesta.id}>
                      {respuesta.respuestaCliente}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md={"12"}>
                <CFormGroupInput handleChange={handleChange} inputName="observaciones" labelName="Observaciones:" value={form1.observaciones} />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* AQUÍ COMIENZA EL MODAL PARA AGREGAR SUCURSALES */}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Añadir registros</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Sucursal:</Label>
              <Input type="select" name="suc" value={form.suc} onChange={handleChange4} bsSize="sm">
                <option value={""}>Seleccione la sucursal</option>
                {dataSucursales.map((item) => (
                  <option value={item.sucursal}>{item.nombre}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Fecha inicial:</Label>
              <Input
                type="date"
                name="d1"
                value={form.d1 ? formatDate(form.d1) : ''}
                onChange={handleChange5}
                bsSize="sm"
              />
            </FormGroup>

            <FormGroup>
              <Label>Fecha final:</Label>
              <Input
                type="date"
                name="d2"
                value={form.d2 ? formatDate(form.d2) : ''}
                onChange={handleChange5}
                bsSize="sm"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Actualizar" />
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
          <TableClienteAnticipos
            form={form}
            setForm={setForm}
            data={dataClientes}
            setModalCliente={setModalCliente}
          ></TableClienteAnticipos>
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

export default Reagendado;



