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
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import SidebarHorizontal from "../../components/SideBarHorizontal";
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

import { LuCalendarSearch } from "react-icons/lu";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { FaShopify } from "react-icons/fa";

import { useClienteShopify } from "../../hooks/getsHooks/useClienteShopify";
import { ShopifyCliente } from "../../models/ShopifyCliente";

function ClientesShopify() {
  const { filtroSeguridad, session } = useSeguridad();
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
  const [data, setData] = useState<Cliente[]>([]);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  ///Cliente SHOPIFY
  const [dataClieSho, setDataClieSho] = useState<ShopifyCliente[]>([]);

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

    ////gggg
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
    /* CREATE */
    const permiso = await filtroSeguridad("CAT_CLIENT_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post(
          `/Cliente?nombre=${form.nombre}&domicilio=${form.domicilio}&ciudad=${form.ciudad}&estado=${form.estado}&colonia=${form.colonia}&cp=${form.cp}&telefono=${form.telefono}&email=${form.email}&fecha_nac=${form.fecha_nac}`
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Cliente creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false); // Cerrar modal después de guardar
          getCliente();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const editar = async () => {
    const fechaHoy = new Date();
    const permiso = await filtroSeguridad("CAT_CLIENT_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos1() === true) {
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
            rfc: form.rfc,
            telefono: form.telefono,
            email: form.email,
            nombre_fiscal: form.nombre_fiscal,
            suspendido: false,
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
        });
    } else {
    }
  };

  const eliminar = async (dato: Cliente) => {
    const permiso = await filtroSeguridad("CAT_CLIENT_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    /* DELETE */
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el registro de : ${dato.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Cliente?id=${dato.id_cliente}`).then(() => {
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

  /* get */
  const getCliente = () => {
    jezaApi.get("/Cliente?id=0").then((response) => {
      setData(response.data);
    });
  };

  useEffect(() => {
    getCliente();
  }, []);

  const mostrarModalActualizar = (dato: Cliente) => {
    setForm(dato);
    setModalActualizar(true);
  };

  // const mostrarModalDetalle = (dato: Cliente) => {
  //   setForm(dato);
  //   setModalDetalle(true);
  // };

  // /* DETALLE */
  // const [modalDetalle, setModalDetalle] = useState(false);

  // const toggleDetalleModal = async (idCliente: number) => {
  //   const permiso = await filtroSeguridad("CAT_CLIENTE_VIEW");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   // Buscar los datos correspondientes al idCliente en tu fuente de datos
  //   const rowData = data.find((dato) => dato.id_cliente === idCliente);

  //   // Actualizar el estado del modal y los datos del "row" seleccionado
  //   setModalDetalle(!modalDetalle);
  //   setDetalleRowData(data);
  // };

  // State for the modal visibility
  const [modalDetalle, setModalDetalle] = useState(false);

  // Function to toggle the modal visibility
  const toggleModalDetalle = () => {
    setModalDetalle(!modalDetalle);
  };

  const mostrarModalDetalle = (dato: Cliente) => {
    setModalDetalle(true);
    historial(dato.id_cliente);
    setClienteSeleccionado(dato);
  };

  // const mostrarModalDetalle = async (dato: Cliente) => {
  //   const permiso = await filtroSeguridad("CAT_CLIENTE_VIEW");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso, se sale de la función
  //   }
  //   setClienteSeleccionado(dato);
  //   setModalDetalle(true);
  // };

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
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "plastico_activo" || name === "suspendido") {
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
        <AiFillDelete color="lightred" onClick={() => eliminar(params.row)} size={23}></AiFillDelete>
        {/* <AiFillDelete color="lightred" onClick={() => console.log(params.row.id)} size={23}></AiFillDelete> */}
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
  const [selectedId, setSelectedId] = useState<number>(0);

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
        Cell: ({ row }) => (
          <LuCalendarSearch
            size={23}
            onClick={() => {
              console.log(row.original);
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
          />
        ),
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
    []
  );

  const columnsclientes: MRT_ColumnDef<Cliente>[] = useMemo(
    () => [
      {
        accessorKey: "acciones",
        header: "Acción",
        size: 100,
        Cell: ({ cell }) => (
          <>
            {/* <AiFillEye className="mr-2" onClick={() => mostrarModalDetalle(cell.row.original)} size={23} /> */}
            <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(cell.row.original)} size={23}></AiFillEdit>
            {/* <AiFillDelete color="lightred" onClick={() => eliminar(cell.row.original)} size={23} /> */}
          </>
        ),
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 100,
      },
      {
        accessorKey: "telefono",
        header: "Teléfono",
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
    []
  );

  /* fin de las cosas que hizo abigail */
  /* inicia alex */

  const [reportesTabla2, setReportesTabla2] = useState([]);
  const [columnasTabla2, setColumnasTabla2] = useState([]);
  const [selectedName, setSelectedName] = useState(""); // Estado para almacenar el nombre seleccionado
  const [modalOpen, setModalOpen] = useState(false);
  const [trabajador, setTrabajadores] = useState([]);

  const vinculo = (idCliente: any, nombreCliente: any, shopId: any, shopName: any) => {
    Swal.fire({
      text: `¿Desea asignar el cliente ${nombreCliente} al usuario Shopify ${shopName}?`, // Utiliza shopName aquí
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Agregar!",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi
          .put(`sp_ShopifyClientesUpd?id=${shopId}&idCliente=${idCliente}`)
          .then(() => {
            Swal.fire("Registro Exitoso!", "El usuario ha sido asignado.", "success");
          })
          .catch((error) => {
            console.error("Error al realizar la actualización:", error);
          });
      }
    });
  };

  //TABLA 2
  useEffect(() => {
    // Realiza la solicitud GET a la API para la Tabla 2
    fetch("https://cbinfo.no-ip.info:9089/sp_ShopifyClientesSel")
      .then((response) => response.json())
      .then((responseData) => {
        setReportesTabla2(responseData);

        // Construye las columnas dinámicamente a partir de la primera entrada de reportes
        // if (responseData.length > 0) {
        //   const columnKeys = Object.keys(responseData[0]);
        //   const columns = columnKeys.map((key) => ({
        //     accessorKey: key,
        //     header: key,
        //     flex: 1,
        //   }));
        //   setColumnasTabla2(columns);
        // }
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);

  const [shopifyId, setShopifyId] = useState<number>(0);
  const [shopifyName, setShopifyName] = useState<string>("");

  const setIdShopify = (shopID: number, shopNAME: string) => {
    setShopifyId(shopID);
    setShopifyName(shopNAME);
    setModalOpen(true);
  };

  const columnsA: MRT_ColumnDef<CorteA>[] = useMemo(
    () => [
      {
        accessorKey: "acciones",
        header: "Acciones",
        size: 5,
        Cell: ({ row }) => (
          <CButton color="secondary" onClick={() => setIdShopify(row.original.id, row.original.nombreShopify)} text="  Elegir"></CButton>
        ),
      },
      {
        accessorKey: "id",
        header: "Id shopify",
        size: 5,
      },
      {
        accessorKey: "nombreShopify",
        header: "Nombre shopify",
        sortDescFirst: false,
        size: 5,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 5,
      },
      {
        accessorKey: "idCliente",
        header: "Id Cliente",
        size: 5,
      },
      {
        accessorKey: "nombreCliente",
        header: "Nombre Cliente",
        size: 5,
      },
    ],
    []
  );

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
    setSelectedId(id_cliente ? id_cliente : 0);
    setSelectedName(name);
    setModalOpen(false);

    // Aquí esperamos a que se resuelva la promesa en vinculo antes de continuar
    await vinculo(id_cliente, name, shopifyId, shopifyName);

    // Después de que se complete la función vinculo, puedes realizar acciones adicionales si es necesario
    // ...
  };
  const columnsTrabajador = useMemo<MRT_ColumnDef<Trabajador>[]>(
    () => [
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
      {
        header: "Acciones",
        Cell: ({ row }) => {
          console.log(row.original);
          return (
            <Button size="sm" onClick={() => handleModalSelect(row.original.id_cliente, row.original.nombre)}>
              seleccionar
            </Button>
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
        <Row>
          <Container fluid>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>
                Shopify clientes <FaShopify size={35} />
              </h1>
            </div>

            <Row>
              <div>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  {/* <Button
                    style={{ marginLeft: "auto" }}
                    color="success"
                    onClick={() => {
                      setModalInsertar(true);
                      setEstado("insert");
                      LimpiezaForm();
                    }}
                  >
                    Crear cliente
                  </Button> */}

                  <Button color="primary" onClick={handleRedirect}>
                    <IoIosHome size={20}></IoIosHome>
                  </Button>
                  <Button onClick={handleReload}>
                    <IoIosRefresh size={20}></IoIosRefresh>
                  </Button>
                </ButtonGroup>
                <br />
                <br />

                <MaterialReactTable
                  columns={columnsA}
                  data={reportesTabla2} // Reemplaza "reportes1" con tus datos de la primera tabla
                  enableRowSelection={false}
                  rowSelectionCheckboxes={false}
                  initialState={{
                    density: "compact",

                    sorting: [
                      { id: "nombreShopify", desc: true }, //sort by state in ascending order by default
                    ],
                  }}
                />
                {/* <MaterialReactTable columns={columnsclientes} data={data} initialState={{ density: "compact" }} /> */}
              </div>
            </Row>
          </Container>
          <br />
          <br />
        </Row>
      </Container>

      {/* <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Clientes <BsPersonBoundingBox size={35} /></h1>

        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
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
            Crear cliente
          </Button>

          <Button color="primary" onClick={handleRedirect}>
            <IoIosHome size={20}></IoIosHome>
          </Button>
          <Button onClick={handleReload}>
            <IoIosRefresh size={20}></IoIosRefresh>
          </Button>
        </ButtonGroup>

        <br />
        <br />
        <div>

          <MaterialReactTable columns={columnsclientes} data={data} initialState={{ density: "compact" }} />
        </div>


        <br /> */}
      {/* <DataTable></DataTable> */}

      {/* 
      </Container> */}

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
              <Label>Nombre:</Label>
              <Input type="text" name={"nombre"} onChange={(e) => setForm({ ...form, nombre: String(e.target.value) })} defaultValue={form.nombre} />
              <br />
            </Col>

            <Col sm="6">
              <Label>Domicilio:</Label>
              <Input
                type="text"
                name={"domicilio"}
                onChange={(e) => setForm({ ...form, domicilio: String(e.target.value) })}
                defaultValue={form.domicilio}
              />
              <br />
            </Col>
            <Col sm="6">
              <Label>Ciudad:</Label>
              <Input type="text" name={"ciudad"} onChange={(e) => setForm({ ...form, ciudad: String(e.target.value) })} defaultValue={form.ciudad} />
              <br />
            </Col>
            <Col sm="6">
              <Label>Estado:</Label>
              <Input type="text" name={"Estado"} onChange={(e) => setForm({ ...form, estado: String(e.target.value) })} defaultValue={form.estado} />
              <br />
            </Col>
            <Col sm="6">
              <Label>Colonia:</Label>
              <Input
                type="text"
                name={"colonia"}
                onChange={(e) => setForm({ ...form, colonia: String(e.target.value) })}
                defaultValue={form.colonia}
              />
              <br />
            </Col>
            <Col sm="6">
              <Label>Código postal:</Label>
              <Input type="text" name={"cp"} onChange={(e) => setForm({ ...form, cp: String(e.target.value) })} defaultValue={form.cp} />
              <br />
            </Col>
            <Col sm="6">
              <Label>Teléfono:</Label>
              <Input
                type="text"
                name={"telefono"}
                onChange={(e) => setForm({ ...form, telefono: String(e.target.value) })}
                defaultValue={form.telefono}
              />
              <br />
            </Col>
            <Col sm="6">
              <Label>E-mail:</Label>
              <Input type="email" name={"email"} onChange={(e) => setForm({ ...form, email: String(e.target.value) })} defaultValue={form.email} />
              <br />
            </Col>

            <Col sm="6">
              <Label>Fecha de nacimiento:</Label>
              <Input
                type="date"
                name={"fecha_nac"}
                onChange={(e) => setForm({ ...form, fecha_nac: String(e.target.value) })}
                defaultValue={form.fecha_nac}
              />
              <br />
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
                      <Label>Nombre:</Label>
                      <Input
                        type="text"
                        name={"nombre"}
                        onChange={(e) => setForm({ ...form, nombre: String(e.target.value) })}
                        defaultValue={form.nombre}
                      />
                      <br />
                    </Col>
                    <Col sm="6">
                      <Label for="exampleDate">Fecha de nacimiento:</Label>
                      <Input
                        id="exampleDate"
                        name="fecha_nac"
                        type="date"
                        onChange={handleChange}
                        defaultValue={form.fecha_nac ? form.fecha_nac.split("T")[0] : form.fecha_nac}
                      />
                    </Col>

                    <Col sm="6">
                      <Label>Domicilio:</Label>
                      <Input
                        type="text"
                        name={"domicilio"}
                        onChange={(e) => setForm({ ...form, domicilio: String(e.target.value) })}
                        defaultValue={form.domicilio}
                      />
                      <br />
                    </Col>

                    <Col sm="6">
                      <Label>Ciudad:</Label>
                      <Input
                        type="text"
                        name={"ciudad"}
                        onChange={(e) => setForm({ ...form, ciudad: String(e.target.value) })}
                        defaultValue={form.ciudad}
                      />
                      <br />
                    </Col>

                    <Col sm="6">
                      <Label>Estado:</Label>
                      <Input
                        type="text"
                        name={"Estado"}
                        onChange={(e) => setForm({ ...form, estado: String(e.target.value) })}
                        defaultValue={form.estado}
                      />
                      <br />
                    </Col>

                    <Col sm="6">
                      <Label>Colonia:</Label>
                      <Input
                        type="text"
                        name={"colonia"}
                        onChange={(e) => setForm({ ...form, colonia: String(e.target.value) })}
                        defaultValue={form.colonia}
                      />
                      <br />
                    </Col>

                    <Col sm="6">
                      <Label>Código postal:</Label>
                      <Input type="text" name={"cp"} onChange={(e) => setForm({ ...form, cp: String(e.target.value) })} defaultValue={form.cp} />
                      <br />
                    </Col>
                    <Col sm="6">
                      <Label>RFC:</Label>
                      <Input type="text" name="rfc" onChange={(e) => setForm({ ...form, rfc: String(e.target.value) })} defaultValue={form.rfc} />
                      <br />
                    </Col>
                  </Row>
                  <br />
                </TabPane>

                <TabPane tabId="2">
                  <Row>
                    <Col sm="6">
                      <Label>Teléfono:</Label>
                      <Input
                        type="text"
                        name={"telefono"}
                        onChange={(e) => setForm({ ...form, telefono: String(e.target.value) })}
                        defaultValue={form.telefono}
                      />
                      <br />
                    </Col>

                    <Col sm="6">
                      <Label>E-mail:</Label>
                      <Input
                        type="email"
                        name={"email"}
                        onChange={(e) => setForm({ ...form, email: String(e.target.value) })}
                        defaultValue={form.email}
                      />
                      <br />
                    </Col>
                    <Col sm="6">
                      <Label>Correo de facturación:</Label>
                      <Input
                        type="text"
                        name="correo_factura"
                        onChange={(e) => setForm({ ...form, correo_factura: String(e.target.value) })}
                        defaultValue={form.correo_factura}
                      />
                      <br />
                    </Col>
                    <Col sm="6">
                      <Label>Regimen fiscal:</Label>
                      <Input
                        type="text"
                        name="regimenFiscal"
                        onChange={(e) => setForm({ ...form, regimenFiscal: String(e.target.value) })}
                        defaultValue={form.regimenFiscal}
                      />
                      <br />
                    </Col>
                    <Col sm="6">
                      <Label>Nombre fiscal:</Label>
                      <Input
                        type="text"
                        name="nombre_fiscal"
                        onChange={(e) => setForm({ ...form, nombre_fiscal: String(e.target.value) })}
                        defaultValue={form.nombre_fiscal}
                      />
                      <br />
                    </Col>

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
                          <strong>Fecha de nacimiento:</strong> {clienteSeleccionado.fecha_nac}
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
                </tr>
              </thead>
              <tbody>
                {historialDetalle.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Insumo}</td>
                    <td>{item.Cant}</td>
                    <td>$ 10.00</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div>
              <p style={{ textAlign: "left" }}>
                <strong>Total: $20.00</strong>
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

      {/* modal trabajador */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}></ModalHeader>
        <ModalBody>
          <h1 onClick={() => alert(shopifyId)}>Seleccione cliente</h1>
          {/* <Input type="text" value={selectedName} /> */}

          <MaterialReactTable
            columns={columnsTrabajador}
            data={trabajador}
            onSelect={(id_cliente, name) => handleModalSelect(id_cliente, name)} // Pasa la función de selección
            initialState={{ density: "compact" }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setModalOpen(!modalOpen)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ClientesShopify;
