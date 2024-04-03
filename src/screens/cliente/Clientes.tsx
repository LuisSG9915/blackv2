import React, { useEffect, useState, useMemo } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import {
  Row,
  Container,
  Input,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Alert,
  Label,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import CFormGroupInput from "../../components/CFormGroupInput";
import { Cliente } from "../../models/Cliente";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import CButton from "../../components/CButton";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import { HiBuildingStorefront } from "react-icons/hi2";
import { BsPersonBoundingBox } from "react-icons/bs";
import Swal from "sweetalert2";
import useModalHook from "../../hooks/useModalHook";
import { UserResponse } from "../../models/Home";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Sucursal } from "../../models/Sucursal";
import { useCitaFutura } from "../../hooks/getsHooks/useCitaFutura";
import { useAnticipoValidar } from "../../hooks/getsHooks/useAnticipoValidar";
import { LuCalendarSearch } from "react-icons/lu";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Venta } from "../../models/Venta";
import { FaShoppingCart, FaUser } from "react-icons/fa";

// import { Cliente } from "../ventas/Components/TableClientesProceso";

function Clientes() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_cli_view`);

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

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ dataUsuarios2 });
    }
  }, []);

  const [dataSucursal, setDataSucursal] = useState<Sucursal[]>([]);
  const { dataSucursales } = useSucursales();
  const { dataCitaFutura } = useCitaFutura();
  const { dataAnticiposVal } = useAnticipoValidar();
  const [data, setData] = useState<Cliente[]>([]);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  const [form, setForm] = useState<Cliente>({
    id_cliente: 0,
    nombre: "",
    domicilio: "",
    ciudad: "",
    estado: "",
    colonia: "",
    cp: "",
    rfc: "",
    telefono: "",
    email: "",
    nombre_fiscal: "",
    suspendido: false,
    sucursal_origen: 0,
    num_plastico: "",
    suc_asig_plast: 0,
    fecha_asig_plast: "",
    usr_asig_plast: "",
    plastico_activo: false,
    fecha_nac: "",
    correo_factura: "",
    regimenFiscal: "",
    claveRegistroMovil: "",
    fecha_alta: "",
    fecha_act: "",
    redsocial1: "",
    redsocial2: "",
    redsocial3: "",
    recibirCorreo : false,
  });

  const [dataTemporal, setDataTemporal] = useState<Venta>({
    id: 0,
    Sucursal: 0,
    Fecha: "",
    Caja: 1,
    No_venta: 1,
    Clave_prod: 1,
    Cant_producto: 1,
    Precio: 0,
    Precio_base: 0,
    Cve_cliente: 0,
    Tasa_iva: 0.16,
    ieps: 0,
    Observacion: "",
    Descuento: 0,
    Clave_Descuento: 0,
    Usuario: 0,
    Credito: false,
    Corte: 1,
    Corte_parcial: 1,
    Costo: 1,
    cancelada: false,
    idEstilista: 0,
    folio_estilista: 1,
    hora: 8,
    tiempo: 1,
    terminado: false,
    validadoServicio: false,
    Cia: 0,
    cliente: "",
    d_estilista: "",
    d_producto: "",
    d_existencia: "",
    estilista: "",
    producto: "",
    formaPago: 0,
    idestilistaAux: 0,
    idRecepcionista: 0,
  });

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const [activeTab1, setActiveTab1] = useState("1");

  const toggleTab1 = (tab: React.SetStateAction<string>) => {
    if (activeTab1 !== tab) {
      setActiveTab1(tab);
    }
  };
  //AAAa
  const [visible, setVisible] = useState(false);

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Cliente)[] = ["nombre", "domicilio", "ciudad", "estado", "colonia", "cp", "telefono", "email", "fecha_nac"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Cliente) => {
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

  //VALIDACIÓN ACTUALIZACIÓN---->
  const [camposFaltantes1, setCamposFaltantes1] = useState<string[]>([]);

  const validarCampos1 = () => {
    const camposRequeridos: (keyof Cliente)[] = [
      "nombre",
      "domicilio",
      "ciudad",
      "estado",
      "colonia",
      "cp",
      "telefono",
      "email",
      "fecha_nac",
      "rfc",
      "regimenFiscal",
      "nombre_fiscal",
      "correo_factura",
    ];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Cliente) => {
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

  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_CLIENT_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
      if (!regexCorreo.test(form.email)) {
        Swal.fire({
          icon: "error",
          text: "Por favor, ingrese un correo electrónico válido",
        });
        return;
      }
      await jezaApi
        .post("/Cliente", null, {
          params: {
            nombre: form.nombre,
            domicilio: form.domicilio,
            ciudad: form.ciudad ? form.ciudad : "...",
            estado: form.estado ? form.estado : "...",
            colonia: form.colonia ? form.redsocial1 : "...",
            cp: form.cp ? form.cp : "...",
            telefono: form.telefono,
            email: form.email,
            fecha_nac: form.fecha_nac,
            redsocial1: form.redsocial1 ? form.redsocial1 : "...",
            redsocial2: "...",
            redsocial3: "...",
            sucOrigen: dataUsuarios2[0]?.sucursal,
            recibirCorreo : form.recibirCorreo,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Cliente creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getCliente();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Hubo un error al crear el cliente. Por favor, inténtalo de nuevo. Verifique la longitud de sus caracteres",
            confirmButtonColor: "#d33",
          });
        });
    } else {
    }
  };


  // const insertar1 = async () => {
  //   /* CREATE */
  //   const permiso = await filtroSeguridad("CAT_CLIENT_ADD");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   console.log(validarCampos());
  //   console.log({ form });
  //   if (validarCampos() === true) {
  //     await jezaApi
  //       .post(
  //         // `/Cliente?nombre=${form.nombre}&domicilio=${form.domicilio}&ciudad=${form.ciudad}&estado=${form.estado}&colonia=${form.colonia}&cp=${form.cp}&telefono=${form.telefono}&email=${form.email}&fecha_nac=${form.fecha_nac}`
  //         // `/ Cliente?nombre=${form.nombre}&domicilio=${form.domicilio}&ciudad=${form.ciudad}&estado=${form.estado}&colonia=${form.colonia}&cp=${form.cp}&telefono=${form.telefono}&email=${form.email}&fecha_nac=${form.fecha_nac}&redsocial1=${form.redsocial1}&redsocial2="..."&redsocial3="..."`
  //         `/ Cliente?nombre=${form.nombre}&domicilio=${form.domicilio}&ciudad=${form.ciudad}&estado=${form.estado}&colonia=${form.colonia}&cp=${form.cp}&telefono=${form.telefono}&email=${form.email}&fecha_nac=${form.fecha_nac}&redsocial1=${form.redsocial1}&redsocial2="..."&redsocial3="..."&sucOrigen=${dataUsuarios2[0]?.sucursal}`
  //       )
  //       .then((response) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Cliente creado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         setModalInsertar(false); // Cerrar modal después de guardar
  //         getCliente();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //   }
  // };

  const editar = async () => {
    const fechaHoy = new Date();
    const permiso = await filtroSeguridad("CAT_CLIENT_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos1() === true) {
      const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
      if (!regexCorreo.test(form.email)) {
        Swal.fire({
          icon: "error",
          text: "Por favor, ingrese un correo electrónico válido",
        });
        return;
      }
      const estatusSuspendido = form.suspendido === true;

      // Verifica si el trabajador tiene citas futuras
      const clienteSuspAnticipo = dataAnticiposVal.some(suspendido => Number(suspendido.idCliente) === Number(form.id_cliente));

      const clienteCitafutura = dataCitaFutura.some(cita => Number(cita.idCliente) === Number(form.id_cliente));
      // Si el estatus está cambiando a 2 y hay citas futuras, muestra un mensaje de error
      // if (estatusSuspendido && clienteSuspAnticipo) {
      if (estatusSuspendido && (clienteSuspAnticipo || clienteCitafutura)) {
        Swal.fire({
          icon: 'error',
          text: 'No se puede cambiar el estatus a suspendido, el cliente cuenta con anticipos o citas futuras.',
          confirmButtonColor: '#d33',
        });
        return;
      }
      await jezaApi
        .put(`/Cliente`, null, {
          params: {
            id_cliente: form.id_cliente,
            nombre: form.nombre,
            domicilio: form.domicilio,
            ciudad: form.ciudad,
            estado: form.estado,
            colonia: form.colonia,
            cp: form.cp,
            rfc: form.rfc ? form.rfc : "...",
            telefono: form.telefono,
            email: form.email,
            nombre_fiscal: form.nombre_fiscal,
            suspendido: form.suspendido,
            sucursal_origen: dataUsuarios2[0]?.sucursal,
            num_plastico: form.num_plastico ? form.num_plastico : "...",
            suc_asig_plast: form.suc_asig_plast ? form.suc_asig_plast : 0,
            fecha_asig_plast: "2023-01-01",
            usr_asig_plast: dataUsuarios2[0]?.id,
            plastico_activo: false,
            fecha_nac: form.fecha_nac,
            correo_factura: form.correo_factura,
            regimenFiscal: form.regimenFiscal,
            claveRegistroMovil: form.claveRegistroMovil ? form.claveRegistroMovil : "...",
            fecha_alta: fechaHoy,
            fecha_act: fechaHoy,
            rs1: form.redSocial1 ? form.redSocial1 : "...",
            rs2: "...",
            rs3: "...",
            recibirCorreo : form.recibirCorreo,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Cliente actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getCliente();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Hubo un error al crear el cliente. Por favor, inténtalo de nuevo. Verifique la longitud de sus caracteres",
            confirmButtonColor: "#d33",
          });
        });
    } else {
    }
  };

  // const permiso_elimina = async (dato: any) => {
  //   const permiso = await filtroSeguridad("CAT_CLIENT_DEL");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   } else {
  //     eliminar();
  //   }
  // };

  const eliminar2 = (id, nombre) => {
    /* DELETE */
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el registro de : ${nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Cliente?id=${id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getCliente();
        });
      }
    });
  };

  const eliminar = async (id, nombre) => {
    const permiso = await filtroSeguridad("cat_cli_del");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    setTimeout(() => {
      Swal.fire({
        title: "ADVERTENCIA",
        text: `¿Está seguro que desea eliminar el cliente: ${nombre}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          jezaApi.delete(`/Cliente?id=${id}`).then(() => {
            Swal.fire({
              icon: "success",
              text: "Registro eliminado con éxito",
              confirmButtonColor: "#3085d6",
            });
            getCliente();
          });
        }
      });
    }, 1000);
  };

  /* get */
  const getCliente = () => {
    jezaApi.get("/Cliente2?id=0").then((response) => {
      setData(response.data);
    });
  };

  useEffect(() => {
    getCliente();
  }, []);

  const mostrarModalActualizar = (dato: Cliente) => {
    setForm({ ...dato, fecha_nac: dato.fecha_nac ? dato.fecha_nac.split("T")[0] : "" });
    setModalActualizar(true);
  };

  // State for the modal visibility
  const [modalDetalle, setModalDetalle] = useState(false);

  // Function to toggle the modal visibility
  const toggleModalDetalle = () => {
    setModalDetalle(!modalDetalle);
  };

  const mostrarModalDetalle = (dato: Cliente) => {
    setModalDetalle(true);
    historial(dato.id_cliente);
    historialcitaFutura(dato.id_cliente);
    setClienteSeleccionado(dato);
  };

  // const [datah1, setData1] = useState<any[]>([]); // Definir el estado datah
  const [modalOpen, setModalOpenH] = useState(false);

  const toggleModalHistorialFutura = () => {
    setModalOpenH(!modalOpen);
  };

  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const [detalleRowData, setDetalleRowData] = useState(null);

  const LimpiezaForm = () => {
    setForm({
      id_cliente: 0,
      nombre: "",
      domicilio: "",
      ciudad: "",
      estado: "",
      colonia: "",
      cp: "",
      rfc: "",
      telefono: "",
      email: "",
      nombre_fiscal: "",
      suspendido: false,
      sucursal_origen: 0,
      num_plastico: "",
      suc_asig_plast: 0,
      fecha_asig_plast: "",
      usr_asig_plast: "",
      plastico_activo: false,
      fecha_nac: "",
      correo_factura: "",
      regimenFiscal: "",
      claveRegistroMovil: "",
      fecha_alta: "",
      fecha_act: "",
      redsocial1: "",
      redsocial2: "",
      redsocial3: "",
      recibirCorreo : false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Eliminar espacios en blanco al principio de la cadena
    const trimmedValue = value.replace(/^\s+/g, "");
    setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
    console.log(form.fecha_nac);
    console.log(form);
  };

  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "suspendido" || name === "recibirCorreo" ) {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: Cliente) => ({ ...prevState, [name]: value }));
    }
  };


  //LIMPIEZA DE CAMPOS
  const [estado, setEstado] = useState("");

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      width: 200,
      headerClassName: "custom-header",
    },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "telefono", headerName: "Teléfono", flex: 1 },
    { field: "sucursal_origen", headerName: "Sucursal alta", flex: 1 },
    {
      field: "fecha_alta",
      headerName: "Fecha alta",
      flex: 1,
      valueGetter: (params: { row: { fecha_alta: string | number | Date } }) => new Date(params.row.fecha_alta).toLocaleDateString(),
    },
    {
      field: "plastico_activo",
      headerName: "Cuenta activa",
      flex: 1,
      renderCell: (params: { row: { plastico_activo: any } }) => (params.row.plastico_activo ? <>&#10004;</> : <>&#10008;</>),
    },
  ];

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEye className="mr-2" onClick={() => mostrarModalDetalle(params.row)} size={23} />
        {/* <AiFillEye className="mr-2" onClick={() => toggleModalDetalle(params.row.id_cliente)} size={23}></AiFillEye> */}
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={23}></AiFillEdit>
        {/* <AiFillDelete color="lightred" onClick={() => permiso_elimina(params.row)} size={23}></AiFillDelete> */}
        {/* <AiFillDelete color="lightred" onClick={() => eliminar(params.row)} size={23}></AiFillDelete> */}
        <AiFillDelete
          onClick={() => {
            eliminar(params.row);
            console.log(params.row);
          }}
          size={23}
        />
      </>
    );
  };

  function DataTable() {
    return (
      <div style={{ height: 600, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id_cliente}
            hideFooter={false}
            initialState={{
              pagination: {
                paginationModel: { page: 2, pageSize: 30 },
              },
            }}
            pageSizeOptions={[0, 10]}
          />
        </div>
      </div>
    );
  }

  // Redirige a la ruta "/app"
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };

  // Función para formatear la fecha
  function formatDate(dateString: string) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(dateString).toLocaleDateString("es-ES", options);
    return formattedDate;
  }

  const [datah3, setData3] = useState<any[]>([]); // Definir el estado datah
  const historialcitaFutura = (id) => {
    jezaApi.get(`/sp_detalleCitasFuturasSel?Cliente=${id}`).then((response) => {
      console.log(response.data);
      setData3(response.data);
      // Abrir o cerrar el modal cuando los datos se hayan cargado
    });
  };

  const [datah, setData1] = useState<any[]>([]); // Definir el estado datah
  const historial = (id) => {
    jezaApi.get(`/Historial?cliente=${id}`).then((response) => {
      setData1(response.data);
      // Abrir o cerrar el modal cuando los datos se hayan cargado
    });
  };

  const [historialDetalle, setHistorialDetalle] = useState<any[]>([]); // Definir historialDetalle como una variable local, no un estado del componente
  const [flagDetalles, setFlagDetalles] = useState(false);
  const [paramsDetalles, setParamsDetalles] = useState({
    sucursal: 0,
    numVenta: 0,
    idProducto: 0,
    clave: 0,
    Cve_cliente: 0,
    fecha: "",
  });

  const [totalImportes, setTotalImportes] = useState(0);

  // Cuando cambia historialDetalle, recalcula el total de importes
  useEffect(() => {
    const total = historialDetalle.reduce((accumulator, item) => {
      const importe = parseFloat(item.importe);
      return accumulator + importe;
    }, 0);
    setTotalImportes(total);
  }, [historialDetalle]);

  const loadHistorialDetalle = async (cveCliente: number, noVenta: number, idProducto: number, idSucursal: number) => {
    await jezaApi
      .get(`/HistorialDetalle?suc=${idSucursal}&cliente=${cveCliente}&venta=${noVenta}&serv=${idProducto}`)
      .then((response) => {
        // Verifica los datos de respuesta en la consola para asegurarte que sean correctos
        console.log(response.data);
        // Asigna los datos de respuesta a la variable local historialDetalle
        handleOpenModal();
        setHistorialDetalle(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setIsModalOpen(!isModalOpen);
    // loadHistorialDetalle(  )
  };
  // useEffect(() => {

  // }, [])

  const cHistorial = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: "Acciones",
        Cell: ({ row }) => {
          let icono;
          let isDisabled = false; // Por defecto, el botón no está deshabilitado

          // Analizar la clave para determinar si es un producto o un servicio
          if (row.original.Clave.endsWith("P")) {
            // Si la clave termina con "P", se trata de un producto
            icono = <FaShoppingCart size={23} />;
            isDisabled = true; // Marcar el botón como deshabilitado para productos
          } else if (row.original.Clave.endsWith("S")) {
            // Si la clave termina con "S", se trata de un servicio
            icono = <FaUser size={23} />;
          } else {
            // Si no coincide con ninguna de las anteriores, se usa un icono predeterminado
            icono = <LuCalendarSearch size={23} />;
          }

          return (
            <div>
              <button
                disabled={isDisabled} // Establecer la propiedad disabled según isDisabled
                onClick={() => {
                  loadHistorialDetalle(row.original.Cve_cliente, row.original.NumVenta, row.original.idProducto, row.original.sucursal);
                  setParamsDetalles({
                    Cve_cliente: row.original.Cve_cliente,
                    idProducto: row.original.idProducto,
                    numVenta: row.original.NumVenta,
                    sucursal: row.original.NombreSuc,
                    clave: row.original.id,
                    fecha: row.original.Fecha,
                  });
                  setIsModalOpen(true);
                }}
              >
                {icono}
              </button>
            </div>
          );
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },

      {
        accessorKey: "Cve_cliente",
        header: "Cliente",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "NumVenta",
        header: "NumVenta",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "NombreSuc",
        header: "Sucursal",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Fecha",
        header: "Fecha",
        flex: 1,
        size: 1,
        Cell: ({ cell }) => {
          const fecha = new Date(cell.getValue()); // Obtener la fecha como objeto Date
          const dia = fecha.getDate().toString().padStart(2, "0"); // Obtener el día con dos dígitos
          const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Obtener el mes con dos dígitos (los meses en JavaScript son base 0)
          const anio = fecha.getFullYear().toString(); // Obtener el año con cuatro dígitos

          return <span>{`${dia}/${mes}/${anio}`}</span>;
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Clave",
        header: "Clave",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Producto_Servicio",
        header: "Producto/Servicio",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Cantidad",
        header: "Cantidad",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Precio",
        header: "Precio",
        flex: 1,
        Cell: ({ cell }) => <span>${cell.getValue<number>().toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
        muiTableBodyCellProps: {
          align: "right",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        size: 1,
      },
      {
        accessorKey: "Estilista",
        header: "Estilista",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Descuento",
        header: "Descuento",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Forma_pago",
        header: "Forma de pago",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
    ],
    [session]
  );



  const columnsclientes: MRT_ColumnDef<Cliente>[] = useMemo(
    () => [
      {
        accessorKey: "acciones",
        header: "Acción",
        size: 100,
        Cell: ({ cell }) => (
          <>
            <AiFillEye className="mr-2" onClick={() => mostrarModalDetalle(cell.row.original)} size={23} />
            <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(cell.row.original)} size={23}></AiFillEdit>
            {/* <AiFillDelete color="lightred" onClick={() => eliminar()} size={23} /> */}
            <AiFillDelete
              color="lightred"
              // onClick={() => alert(cell.row.original.id_cliente + "---" + cell.row.original.nombre)}
              onClick={() => {
                // const permiso = await filtroSeguridad("cat_cli_del");
                // if (permiso === false) {
                //   return; // Si el permiso es falso o los campos no son válidos, se sale de la función
                // } else {
                // }
                eliminar(cell.row.original.id_cliente, cell.row.original.nombre);
              }}
              size={23}
            ></AiFillDelete>
          </>
        ),
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 100,
      },
      {
        accessorKey: "domicilio",
        header: "Domicilio",
        size: 100,
      },
      {
        accessorKey: "telefono",
        header: "Teléfono",
        size: 100,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 100,
      },
      {
        accessorKey: "suspendido",
        header: "Vigencia",
        size: 50,
        Cell: ({ row }) => {
          if (row.original.suspendido === true) {
            return <span>SUSPENDIDO</span>
          } else {
            return <span>VIGENTE</span>
          }
        },
        accessorFn: (row) => row.supendido,
      },
      {
        accessorKey: "redSocial1",
        header: "Instagram",
        size: 100,
      },
      {
        accessorKey: "fecha_alta",
        header: "Fecha alta",
        size: 100,
        Cell: ({ cell }) => {
          const fechaCompleta = cell.row.original.fecha_alta;
          const fecha = fechaCompleta.split("T")[0]; // Obtener solo la parte de la fecha

          return <span>{fecha}</span>;
        },
      },
    ],
    [session]
  );

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <Row>
          <Container fluid>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>
                {" "}
                Clientes <BsPersonBoundingBox size={35} />
              </h1>
            </div>
            <br />
            <br />
            <Row>
              <div>
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
                    Crear cliente
                  </Button>

                  <Button color="primary" onClick={handleRedirect}>
                    <IoIosHome size={20}></IoIosHome>
                  </Button>
                  <Button onClick={handleReload}>
                    <IoIosRefresh size={20}></IoIosRefresh>
                  </Button>
                </ButtonGroup>
              </div>
              <br />
              <br />
              <MaterialReactTable columns={columnsclientes} data={data} initialState={{ density: "compact" }} />
            </Row>
          </Container>
          <br />
          <br />
        </Row>
      </Container>

      {/* Modals */}
      {/* create */}
      <Modal isOpen={modalInsertar} size="lg">
        <ModalHeader>
          <h3>Crear cliente</h3>
        </ModalHeader>
        <ModalBody>
          {/* parte */}
          <Row>
            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" value={form.nombre} minlength={1} maxlength={190} />
            </Col>
            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="domicilio" labelName="Domicilio:" value={form.domicilio} minlength={1} maxlength={190} />
            </Col>
            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="ciudad" labelName="Ciudad:" value={form.ciudad} minlength={1} maxlength={190} />
            </Col>
            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="estado" labelName="Estado:" value={form.estado} minlength={1} maxlength={190} />
            </Col>
            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="colonia" labelName="Colonia:" value={form.colonia} minlength={1} maxlength={190} />
            </Col>
            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="cp" labelName="Código postal:" value={form.cp} minlength={1} maxlength={100} />
            </Col>
            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="telefono" labelName="Teléfono:" value={form.telefono} minlength={1} maxlength={100} />
            </Col>

            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" value={form.email} minlength={1} maxlength={199} />
            </Col>

            <Col sm="6">
              <CFormGroupInput
                type="date"
                handleChange={handleChange}
                inputName="fecha_nac"
                labelName="Fecha de nacimiento:"
                value={form.fecha_nac}
              />
            </Col>

            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="redsocial1" labelName="Instagram:" value={form.redsocial1} minlength={1} maxlength={199} />
            </Col>
            <Col sm="6">
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.recibirCorreo} onChange={handleChange1} name="recibirCorreo" />
                        <span className="checkmark"></span>
                        No recibir correos
                      </label>
                    </Col>

          </Row>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar cliente"></CButton>{" "}
          <CButton color="danger" onClick={cerrarModalInsertar} text="Cancelar"></CButton>
        </ModalFooter>
      </Modal>

      {/* modal para update  tab */}
      <Modal isOpen={modalActualizar} size="lg">
        <ModalHeader>
          <h3>Editar cliente</h3>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Card body>
              {/* <TabPrueba getTrab={getTrabajador} form2={form} setForm2={setForm}></TabPrueba> */}
              <Nav tabs>
                <NavItem>
                  <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
                    Datos personales
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
                    Datos adicionales
                  </NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")}>
                    Datos plástico
                  </NavLink>
                </NavItem> */}
              </Nav>

              <TabContent activeTab={activeTab}>
                <br />
                <TabPane tabId="1">
                  <Row>
                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" value={form.nombre} minlength={1} maxlength={190} />
                    </Col>
                    <Col sm="6">
                      <CFormGroupInput
                        type="date"
                        handleChange={handleChange}
                        inputName="fecha_nac"
                        labelName="Fecha de nacimiento:"
                        value={form.fecha_nac}
                      />
                    </Col>

                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="domicilio" labelName="Domicilio:" value={form.domicilio} minlength={1} maxlength={190} />
                    </Col>

                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="ciudad" labelName="Ciudad:" value={form.ciudad} minlength={1} maxlength={190} />
                    </Col>

                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="estado" labelName="Estado:" value={form.estado} minlength={1} maxlength={190} />
                    </Col>

                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="colonia" labelName="Colonia:" value={form.colonia} minlength={1} maxlength={190} />
                    </Col>

                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="cp" labelName="Código postal:" value={form.cp} minlength={1} maxlength={100} />
                    </Col>

                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="rfc" labelName="RFC:" value={form.rfc} minlength={1} maxlength={199} />
                    </Col>
                  </Row>
                  <br />
                </TabPane>

                <TabPane tabId="2">
                  <Row>
                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="telefono" labelName="Teléfono:" value={form.telefono} minlength={1} maxlength={100} />
                    </Col>

                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" value={form.email} minlength={1} maxlength={199} />
                    </Col>

                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="redSocial1" labelName="Instagram:" value={form.redSocial1} minlength={1} maxlength={199} />
                    </Col>

                    <Col sm="6">
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="correo_factura"
                        labelName="Correo de facturación:"
                        value={form.correo_factura}
                        minlength={1} maxlength={199}
                      />
                    </Col>
                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="regimenFiscal" labelName="Regimen fiscal:" value={form.regimenFiscal} minlength={1} maxlength={199} />
                    </Col>
                    <Col sm="6">
                      <CFormGroupInput handleChange={handleChange} inputName="nombre_fiscal" labelName="Nombre fiscal:" value={form.nombre_fiscal} minlength={1} maxlength={199} />
                    </Col>

                    <Col sm="6">
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.suspendido} onChange={handleChange1} name="suspendido" />
                        <span className="checkmark"></span>
                        Suspendido
                      </label>
                    </Col>

                    <Col sm="6">
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.recibirCorreo} onChange={handleChange1} name="recibirCorreo" />
                        <span className="checkmark"></span>
                        No recibir correos
                      </label>
                    </Col>
                    <br />


                    {/* <Col sm="6">
                      <Label>Sucursal origen:</Label>
                      <Input type="select" name="sucursal_origen" id="exampleSelect" value={form.sucursal_origen} onChange={handleChange}>
                        <option value="">Selecciona sucursal</option>
                        {dataSucursales.map((sucursal) => (
                          <option key={sucursal.sucursal} value={sucursal.sucursal}>
                            {sucursal.nombre}
                          </option>
                        ))}
                      </Input>



                      <br />
                    </Col> */}
                  </Row>
                </TabPane>
                {/* 
                <TabPane tabId="3">
                  <Row>
                    <Col sm="6">
                      <Label>Número de plástico:</Label>
                      <Input
                        type="text"
                        name="num_plastico"
                        onChange={(e) => setForm({ ...form, num_plastico: String(e.target.value) })}
                        defaultValue={form.num_plastico}
                      />

                      <br />
                    </Col>
                    <Col sm="6">
                      <Label>Sucursal asignada al plástico:</Label>
                      <Input type="select" name="suc_asig_plast" id="exampleSelect" value={form.suc_asig_plast} onChange={handleChange}>
                        <option value="">Selecciona sucursal</option>
                        {dataSucursales.map((sucursal) => (
                          <option key={sucursal.sucursal} value={sucursal.sucursal}>
                            {sucursal.nombre}
                          </option>
                        ))}
                      </Input>
                      <br />
                    </Col>
                    <Col sm="6"> */}
                {/* <Label>Fecha de asignación del plástico:</Label>
                      <Input
                        type="date"
                        name="fecha_asig_plast"
                        onChange={(e) => setForm({ ...form, fecha_asig_plast: String(e.target.value) })}
                        defaultValue={form.fecha_asig_plast}

                      /> */}

                {/* <Label for="exampleDate">Fecha de asignación del plástico:</Label>
                      <Input
                        id="exampleDate"
                        name="fecha_asig_plast"
                        type="date"
                        onChange={handleChange}
                        defaultValue={form.fecha_asig_plast ? form.fecha_asig_plast.split("T")[0] : form.fecha_asig_plast}
                      />

                      <br />
                    </Col> */}

                {/* <Col sm="6">
                      <Label>Usuario de asignación del plástico:</Label>
                      <Input
                        type="text"
                        name="usr_asig_plast"
                        onChange={(e) => setForm({ ...form, usr_asig_plast: String(e.target.value) })}
                        defaultValue={form.usr_asig_plast}

                      />
                      <br />
                    </Col> */}

                {/* <Col sm="6">
                      <Label>Clave de registro móvil:</Label>
                      <Input
                        type="text"
                        name="claveRegistroMovil"
                        onChange={(e) => setForm({ ...form, claveRegistroMovil: String(e.target.value) })}
                        defaultValue={form.claveRegistroMovil}
                      />
                      <br />
                    </Col>

                    <Col sm="6">
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.plastico_activo} onChange={handleChange} name="plastico_activo" />
                        <span className="checkmark"></span>
                        Plástico Activo
                      </label>
                      <br />
                    </Col>

                    <Col sm="6">
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.suspendido} onChange={handleChange} name="suspendido" />
                        <span className="checkmark"></span>
                        Suspendido
                      </label>
                      <br />
                    </Col>
                  </Row>
                </TabPane> */}
                {/* <AlertComponent error={error} onDismiss={onDismiss} visible={visible} /> */}
              </TabContent>
            </Card>
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar" />
          <CButton color="danger" onClick={cerrarModalActualizar} text="Cancelar"></CButton>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDetalle} size="lg">
        <ModalHeader>Detalles del cliente</ModalHeader>
        <ModalBody>
          {clienteSeleccionado && (
            <Container>
              <Card body>
                {/* <TabPrueba getTrab={getTrabajador} form2={form} setForm2={setForm}></TabPrueba> */}
                <Nav tabs>
                  <NavItem>
                    <NavLink className={activeTab1 === "1" ? "active" : ""} onClick={() => toggleTab1("1")}>
                      Datos personales
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={activeTab1 === "2" ? "active" : ""} onClick={() => toggleTab1("2")}>
                      Datos adicionales
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={activeTab1 === "3" ? "active" : ""} onClick={() => toggleTab1("3")}>
                      Historial del cliente
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab1}>
                  <br />
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="6">
                        <p>
                          <strong>Nombre:</strong> {clienteSeleccionado.nombre}
                        </p>
                        <p>
                          <strong>Domicilio:</strong> {clienteSeleccionado.domicilio}
                        </p>
                        <p>
                          <strong>Sucursal origen:</strong> {clienteSeleccionado.sucursal_origen}
                        </p>
                        <p>
                          <strong>Fecha de nacimiento:</strong> {formatDate(clienteSeleccionado.fecha_nac)}
                          {/* <strong>Fecha de nacimiento:</strong> {clienteSeleccionado.fecha_nac} */}
                        </p>
                        <p>
                          <strong>Ciudad:</strong> {clienteSeleccionado.ciudad}
                        </p>
                      </Col>

                      <Col sm="6">
                        <p>
                          <strong>Estado:</strong> {clienteSeleccionado.estado}
                        </p>
                        <p>
                          <strong>Colonia:</strong> {clienteSeleccionado.colonia}
                        </p>
                        <p>
                          <strong>Código Postal:</strong> {clienteSeleccionado.cp}
                        </p>
                      </Col>
                    </Row>
                    <br />
                  </TabPane>

                  <TabPane tabId="2">
                    <Row>
                      <Col sm="6">
                        <p>
                          <strong>Teléfono:</strong> {clienteSeleccionado.telefono}
                        </p>
                        <p>
                          <strong>Email:</strong> {clienteSeleccionado.email}
                        </p>
                        <p>
                          <strong>Correo de facturación:</strong> {clienteSeleccionado.correo_factura}
                        </p>
                      </Col>

                      <Col sm="6">
                        <p>
                          <strong>Nombre fiscal:</strong> {clienteSeleccionado.nombre_fiscal}
                        </p>
                        <p>
                          <strong>Regimen fiscal:</strong> {clienteSeleccionado.regimenFiscal}
                        </p>
                      </Col>
                    </Row>
                  </TabPane>

                  <TabPane tabId="3">
                    <Row>
                      <MaterialReactTable
                        columns={cHistorial}
                        data={datah}
                        initialState={{
                          pagination: {
                            pageSize: 5,
                            pageIndex: 0,
                          },
                          density: "compact",
                        }}
                      // renderDetailPanel={renderDetailPanel} // Pasar la función renderDetailPanel como prop
                      />
                    </Row>
                    <br />
                    <div>
                      <Card style={{ maxWidth: "100%", height: "auto" }}>
                        <CardBody>
                          <h3>Historial citas futuras</h3>
                          <br />
                          <div>
                            <Table hover className="table-responsive">
                              <thead>
                                <tr>
                                  <th>Fecha</th>
                                  <th>Hora</th>
                                  <th>Sucursal</th>
                                  <th>Servicio</th>
                                  <th>Estilista</th>
                                  <th>Usuario</th>
                                  <th>Feha alta cita</th>
                                  {/* Agrega más encabezados según tus datos */}
                                </tr>
                              </thead>
                              <tbody>
                                {datah3.map((itemf, indexf) => (
                                  <tr key={indexf}>
                                    <td>{itemf.fechaCita.split("T")[0]}</td>
                                    <td>{itemf.hora}</td>
                                    <td>{itemf.nombreSuc}</td>
                                    <td>{itemf.Servicio}</td>
                                    <td>{itemf.Estilista}</td>
                                    <td>{itemf.nombreUsrRegistra}</td>
                                    <td>{itemf.fechaAlta.split("T")[0]}</td>
                                    {/* Agrega más celdas según tus datos */}
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    <br />
                  </TabPane>
                </TabContent>
              </Card>
            </Container>
          )}

          {/* 

          {clienteSeleccionado && (
            <div>
              <p><strong>Nombre:</strong> {clienteSeleccionado.nombre}</p>
              <p><strong>Teléfono:</strong> {clienteSeleccionado.telefono}</p>
              <p><strong>Domicilio:</strong> {clienteSeleccionado.domicilio}</p>
              <p><strong>Email:</strong> {clienteSeleccionado.email}</p>
              <p><strong>Ciudad:</strong> {clienteSeleccionado.ciudad}</p>
              <p><strong>Estado:</strong> {clienteSeleccionado.estado}</p>
              <p><strong>Colonia:</strong> {clienteSeleccionado.colonia}</p>
              <p><strong>Código Postal:</strong> {clienteSeleccionado.cp}</p>

        
            </div>
          )} */}
        </ModalBody>
        <ModalFooter>
          <CButton text="Cerrar" color="danger" onClick={() => setModalDetalle(false)} />
        </ModalFooter>
      </Modal>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} size="lg">
        <ModalHeader toggle={handleCloseModal}>Historial detalle</ModalHeader>
        <ModalBody>
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <Table>
              <thead>
                <tr>
                  <th>
                    <p>
                      <strong>Fecha:</strong> {paramsDetalles.fecha.split("T")[0]}
                    </p>
                  </th>
                  <th>
                    <p>
                      <strong>No. Venta: </strong>
                      {paramsDetalles.numVenta}
                    </p>
                  </th>
                  <th>
                    <p>
                      <strong>Sucursal:</strong> {paramsDetalles.sucursal}
                    </p>
                  </th>
                </tr>
              </thead>
            </Table>
            <Table>
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                {historialDetalle.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Insumo}</td>
                    <td>{item.Cant}</td>
                    <td>{item.precio}</td>
                    <td>{item.importe}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div>
              <p style={{ textAlign: "left" }}>
                <strong>Total: ${totalImportes.toFixed(2)}</strong>
              </p>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Modal for showing client details */}
      {/* <Modal isOpen={modalDetalle} toggle={toggleModalDetalle} size="lg">
        <ModalHeader toggle={toggleModalDetalle}>Detalles del Cliente</ModalHeader>
        <ModalBody> */}
      {/* Display the client details */}
      {/* <p><strong>Nombre:</strong> {form.nombre}</p>
          <p><strong>Teléfono:</strong> {form.telefono}</p>
          <p><strong>Domicilio:</strong> {form.domicilio}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Ciudad:</strong> {form.ciudad}</p>
          <p><strong>Estado:</strong> {form.estado}</p>
          <p><strong>Colonia:</strong> {form.colonia}</p>
          <p><strong>Código Postal:</strong> {form.cp}</p> */}
      {/* ... (display other details here) */}
      {/* </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModalDetalle}>Cerrar</Button>
        </ModalFooter>
      </Modal> */}

      {/* modal para Detalles */}
      {/* <Modal isOpen={modalDetalle} fullscreen={true}>
        <ModalHeader >Detalles del Cliente</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col">
              <p>
                <strong>Nombre:</strong> {form.nombre}
              </p>
              <p>
                <strong>Teléfono:</strong> {form.telefono}
              </p>
              <p>
                <strong>Domicilio:</strong> {form.domicilio}
              </p>
              <p>
                <strong>Email:</strong> {form.email}
              </p>
              <p>
                <strong>Ciudad:</strong> {form.ciudad}
              </p>
              <p>
                <strong>Estado:</strong> {form.estado}
              </p>
              <p>
                <strong>Colonia:</strong> {form.colonia}
              </p>
              <p>
                <strong>Código Postal:</strong> {form.cp}
              </p>
            </div>
            <div className="col">
              <p>
                <strong>Sucursal Alta:</strong> {form.sucursal_origen}
              </p>
              <p>
                <strong>Fecha Alta:</strong>{" "}
                {form.fecha_alta}
              </p>
              <p>
                <strong>Cuenta Activa:</strong> {form.plastico_activo ? "Sí" : "No"}
              </p>
              <p>
                <strong>RFC:</strong> {form.rfc}
              </p>
              <p>
                <strong>Nombre Fiscal:</strong> {form.nombre_fiscal}
              </p>
              <p>
                <strong>Número de Plástico:</strong> {form.num_plastico}
              </p>
              <p>
                <strong>Sucursal Asignada al Plástico:</strong> {form.suc_asig_plast}
              </p>
              <p>
                <strong>Fecha de Asignación del Plástico:</strong>{" "}
                {form.fecha_asig_plast}
              </p>
              <p>
                <strong>Usuario de Asignación del Plástico:</strong> {form.usr_asig_plast}
              </p>
              <p>
                <strong>Fecha de Nacimiento:</strong>{" "}
                {form.fecha_nac}
              </p>
              <p>
                <strong>Correo de Facturación:</strong> {form.correo_factura}
              </p>
              <p>
                <strong>Regimen Fiscal:</strong> {form.regimenFiscal}
              </p>
              <p>
                <strong>Clave de Registro Móvil:</strong> {form.claveRegistroMovil}
              </p>
              <p>
                <strong>Suspendido:</strong> {form.suspendido ? "Sí" : "No"}
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={cerrarModalDetalle}>
            Cerrar
          </Button>{" "}
        </ModalFooter>
      </Modal> */}
    </>
  );
}

export default Clientes;
