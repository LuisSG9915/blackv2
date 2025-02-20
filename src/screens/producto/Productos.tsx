import React, { useState, useEffect, useMemo } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete, AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Container,
  Col,
  Card,
  InputGroup,
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Pagination,
  PaginationItem,
  PaginationLink,
  Alert,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Producto } from "../../models/Producto";
import { useProductos } from "../../hooks/getsHooks/useProductos";
import { useMarcas } from "../../hooks/getsHooks/useMarcas";
import { Marca } from "../../models/Marca";
import AlertComponent from "../../components/AlertComponent";
import { useAreas } from "../../hooks/getsHooks/useAreas";
import { useDeptos } from "../../hooks/getsHooks/useDeptos";
import { Departamento } from "../../models/Departamento";
import { useClases } from "../../hooks/getsHooks/useClases";
import { Clase } from "../../models/Clase";
import { ProdSustituto } from "../../models/ProdSustituto";
import { MdProductionQuantityLimits } from "react-icons/md";
import { useProveedor } from "../../hooks/getsHooks/useProveedor";
import { Proveedor } from "../../models/Proveedor";
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from "material-react-table";
import { Button, ButtonGroup } from "@mui/material";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import Swal from "sweetalert2";
import { useUnidadMedida } from "../../hooks/getsHooks/useUnidadMedida";
import { UnidadMedidaModel } from "../../models/UnidadMedidaModel";
import { ReagendaProd } from "../../models/ReagendaProd";
import { UserResponse } from "../../models/Home";

function Productos() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_Productos_view`);

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
  } = useModalHook();
  const { dataProductos, fetchProduct, setDataProductos } = useProductos();

  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");

  const { dataAreas } = useAreas();
  const { dataDeptos } = useDeptos();
  const { dataClases } = useClases();
  const { dataUnidadMedida } = useUnidadMedida();
  const { dataProveedores } = useProveedor();
  const { dataMarcas } = useMarcas();

  const [dataDeptosFiltrado, setDataDeptosFiltrado] = useState<Departamento[]>([]);
  const [dataClasesFiltrado, setDataClasesFiltrado] = useState<Clase[]>([]);

  const navigate = useNavigate();
  const [form, setForm] = useState<Producto>({
    fecha_act: "",
    fecha_alta: "",
    id: 0,
    clave_prod: "string",
    descripcion: "string",
    descripcion_corta: "string",
    sucursal_origen: 0,
    idMarca: 0,
    area: 0,
    depto: 0,
    clase: 0,
    observacion: "string",
    inventariable: false,
    controlado: false,
    es_fraccion: false,
    obsoleto: false,
    es_insumo: false,
    es_servicio: false,
    es_producto: false,
    es_kit: false,
    // inventariable: true, // Establecer a 'true' para que esté seleccionado inicialmente
    // controlado: false,
    // es_producto: false,
    // es_servicio: false,
    // es_fraccion: false,
    // obsoleto: false,
    // es_insumo: false,
    // es_kit: false,
    tasa_iva: 0,
    tasa_ieps: 0,
    costo_unitario: 0.0,
    precio: 0,
    unidad_paq: 0,
    unidad_paq_traspaso: 0,
    promocion: false,
    porcentaje_promocion: 0,
    precio_promocion: 0,
    fecha_inicio: "string",
    fecha_final: "string",
    unidad_medida: 0,
    clave_prov: 0,
    tiempo: 0,
    comision: 0,
    productoLibre: false,
    d_area: "",
    d_clase: "",
    d_depto: "",
    d_proveedor: "",
    marca: "",
    d_unidadMedida: "",
  });

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // const handleChange2 = (event) => {
  //   const { name, checked } = event.target;

  //   // Si la casilla "es_kit" se activa, desactiva todas las demás y bloquea los campos
  //   if (name === "es_kit") {
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       inventariable: false,
  //       controlado: false,
  //       es_producto: false,
  //       es_servicio: false,
  //       es_fraccion: false,
  //       obsoleto: false,
  //       es_insumo: false,
  //       [name]: checked, // Mantenemos "es_kit" activada
  //     }));
  //     // setIsDisabled(true); // Bloquear los campos
  //   } else {
  //     // Para las demás casillas, actualiza normalmente y desbloquea los campos
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       [name]: checked,
  //       es_kit: false, // Si se activa cualquier otra casilla, desactiva "es_kit"
  //     }));
  //     // setIsDisabled(false); // Desbloquear los campos
  //   }

  //   // Si la casilla "es_kit" se activa, desactiva todas las demás y bloquea los campos
  //   if (name === "es_servicio") {
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       inventariable: false,
  //       controlado: false,
  //       es_producto: false,
  //       es_kit: false,
  //       // es_servicio: false,
  //       es_fraccion: false,
  //       obsoleto: false,
  //       es_insumo: false,
  //       [name]: checked, // Mantenemos "es_kit" activada
  //     }));
  //     // setIsDisabled(true); // Bloquear los campos
  //   } else {
  //     // Para las demás casillas, actualiza normalmente y desbloquea los campos
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       [name]: checked,
  //       es_servicio: false, // Si se activa cualquier otra casilla, desactiva "es_kit"
  //     }));
  //     // setIsDisabled(false); // Desbloquear los campos
  //   }

  // };

  const handleChange2 = (event) => {
    const { name, checked } = event.target;

    if (name === "es_servicio" && checked) {
      setForm((prevForm) => ({
        ...prevForm,
        inventariable: false,
        controlado: false,
        es_insumo: false,
        es_producto: false,
        es_kit: false,
        es_servicio: true,
        es_fraccion: false,
        obsoleto: false,
      }));
    } else if (name === "es_kit" && checked) {
      setForm((prevForm) => ({
        ...prevForm,
        inventariable: false,
        controlado: false,
        es_insumo: false,
        es_producto: false,
        es_kit: true,
        es_servicio: false,
        es_fraccion: false,
        obsoleto: false,
      }));
    } else {
      switch (name) {
        case "inventariable":
          setForm((prevForm) => ({
            ...prevForm,
            inventariable: checked,
            controlado: checked ? true : prevForm.controlado,
            es_insumo: checked ? true : prevForm.es_insumo,
            es_producto: checked ? true : prevForm.es_producto,
            es_servicio: false,
            es_kit: false,
          }));
          break;

        case "controlado":
          setForm((prevForm) => ({
            ...prevForm,
            inventariable: true,
            controlado: checked,
            es_producto: checked ? false : prevForm.es_producto,
            es_servicio: false,
            es_kit: false,
            es_insumo: checked ? false : prevForm.es_insumo,
          }));
          break;

        case "es_insumo":
          setForm((prevForm) => ({
            ...prevForm,
            inventariable: true,
            controlado: checked ? true : prevForm.controlado,
            es_insumo: checked,
            es_producto: false,
            es_servicio: false,
            es_kit: false,
          }));
          break;

        case "es_producto":
          setForm((prevForm) => ({
            ...prevForm,
            inventariable: true,
            controlado: checked ? true : prevForm.controlado,
            es_insumo: false,
            es_producto: checked,
            es_servicio: false,
            es_kit: false,
          }));
          break;

        default:
          setForm((prevForm) => ({
            ...prevForm,
            [name]: checked,
            es_kit: false,
            es_servicio: false,
          }));
          break;
      }
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 150; // Number of items to display per page
  const totalItems = dataProductos.length; // Total number of items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToDisplay = dataProductos.slice(startIndex, endIndex);

  const [data, setData] = useState<ProdSustituto[]>([]); /* setear valores  */
  const [ProductoSustitutoForm, setProductoSustitutoForm] = useState<ProdSustituto>({
    id: 0,
    clave_real: "",
    id_Producto: 0,
    d_Producto: "",
  });


  const [showSeguimientoTab, setShowSeguimientoTab] = useState(false);
  const [data2, setData2] = useState<ReagendaProd[]>([]);
  const [data3, setData3] = useState<ReagendaProd[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await jezaApi.get(`/sp_catSeguimientoProdSel2?idProducto=0`);
        setData3(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);


  const [ProdReaForm, setProdReaForm] = useState<ReagendaProd>({
    id: 0,
    id_producto: 0,
    txtAsunto: "",
    txtMensaje: "",
    txtAsuntoRe: "",
    txtMensajeRe: "",
    dias_seguimiento: 0,
    dias_reagendado: 0,
  });
  useEffect(() => {
    if (modalActualizar && form.id) {
      jezaApi.get(`/sp_catSeguimientoProdSel2?idProducto=${form.id}`)
        .then((response) => {
          const data = response.data;
          if (data.length > 0) {
            const seguimientoData = data[0];
            setProdReaForm({
              id: seguimientoData.id,
              id_producto: seguimientoData.id_producto,
              txtAsunto: seguimientoData.txtAsunto,
              txtMensajeRe: seguimientoData.txtMensajeRe,
              txtAsuntoRe: seguimientoData.txtAsuntoRe,
              txtMensaje: seguimientoData.txtMensaje,
              dias_seguimiento: seguimientoData.dias_seguimiento,
              dias_reagendado: seguimientoData.dias_reagendado,
            });
          } else {
            setProdReaForm({
              id: 0,
              id_producto: 0,
              txtAsunto: "",
              txtMensaje: "",
              txtAsuntoRe: "",
              txtMensajeRe: "",
              dias_seguimiento: 0,
              dias_reagendado: 0,
            });
          }
          setData2(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [modalActualizar, form.id]);

  const create2 = async () => {
    // const permiso = await filtroSeguridad("CAT_CLAVEREAL_ADD");
    // if (permiso === false) {
    //   return;
    // }

    // if (validarCampos1() === true) {
    await jezaApi
      .post("/sp_UpsertProducto", null, {
        params: {
          id: form.id,
          id_producto: form.id,
          txtAsunto: ProdReaForm.txtAsunto,
          txtMensaje: ProdReaForm.txtMensaje,
          txtAsuntoRe: ProdReaForm.txtAsuntoRe,
          txtMensajeRe: ProdReaForm.txtMensajeRe,
          dias_seguimiento: ProdReaForm.dias_seguimiento,
          dias_reagendado: ProdReaForm.dias_reagendado,
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          text: "Registro realizado con éxito",
          confirmButtonColor: "#3085d6",
        });

        getinfoSegProd();
      })
      .catch((error) => {
        console.log(error);
      });
    // }
  };


  const eliminarRe = async (dato: ReagendaProd) => {
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el registro?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/catSeguimientoProdDel?id_producto=${form.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getinfoSegProd(); // Asegúrate de que esta función actualice correctamente los datos.
          setProdReaForm({
            id: 0,
            id_producto: 0,
            txtAsunto: "",
            txtMensaje: "",
            txtAsuntoRe: "",
            txtMensajeRe: "",
            dias_seguimiento: 0,
            dias_reagendado: 0,
          });
      
        }).catch((error) => {
          console.error("Error deleting data:", error);
          Swal.fire({
            icon: "error",
            text: "Hubo un error al eliminar el registro.",
            confirmButtonColor: "#3085d6",
          });
        });
      }
    });
  };


  const getinfoSegProd = () => {
    jezaApi.get(`sp_catSeguimientoProdSel?idProducto=${form.id}`).then((response) => {
      setData2(response.data);
      console.log(response.data);
    });
  };
  const [modalOpenCli, setModalOpenCli] = useState(false);
  const [selectedIdC, setSelectedIdC] = useState(0);
  const [selectedName, setSelectedName] = useState(""); // Estado para almacenar el nombre seleccionados

  const handleModalSelect1 = (id: number, name: string) => {
    setSelectedIdC(id);
    setSelectedName(name);
    cerrarModal();
  };

  const handleModalSelect = (selectedRecord) => {
    setProdReaForm({
      id: selectedRecord.id,
      id_producto: selectedRecord.id_producto,
      txtAsunto: selectedRecord.txtAsunto,
      txtMensaje: selectedRecord.txtMensaje,
      txtAsuntoRe: selectedRecord.txtAsuntoRe,
      txtMensajeRe: selectedRecord.txtMensajeRe,
      dias_seguimiento: selectedRecord.dias_seguimiento,
      dias_reagendado: selectedRecord.dias_reagendado,
    });
    cerrarModal();
  };
  
  // Función para abrir el modal
  const abrirModal = () => {
    setModalOpenCli(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalOpenCli(false);
  };

  const columnsReaProd: MRT_ColumnDef<ReagendaProd>[] = useMemo(
    () => [
      {
              accessorKey: "d_producto",
              header: "Producto",
              size: 60,
            },
            {
              accessorKey: "txtAsunto",
              header: "Asunto",
              size: 60,
            },
            {
              accessorKey: "txtMensaje",
              header: "txtMensaje",
              size: 60,
            },
            {
              accessorKey: "dias_seguimiento",
              header: "Días Seg",
              size: 60,
            },
            {
              accessorKey: "dias_reagendado",
              header: "Días Reag.",
              size: 60,
            },
            {
              accessorKey: "txtAsuntoRe",
              header: "txtAsuntoRe",
              size: 60,
            },
            {
              accessorKey: "txtMensajeRe",
              header: "txtMensajeRe",
              size: 60,
            },


      {
        header: "Acciones",
        Cell: ({ row }) => {
          const record = row.original;
          return (
            <CButton text="Seleccionar" color="secondary" onClick={() => handleModalSelect(record)} />
          );
        },
        size: 40,
      },
    ],
    []
  );
  
  // const columnsReaProd: MRT_ColumnDef<ReagendaProd>[] = useMemo(
  //   () => [

  //     {
  //       accessorKey: "d_producto",
  //       header: "Producto",
  //       size: 60,
  //     },
  //     {
  //       accessorKey: "txtAsunto",
  //       header: "Asunto",
  //       size: 60,
  //     },
  //     {
  //       accessorKey: "dias_seguimiento",
  //       header: "Días Seg",
  //       size: 60,
  //     },
  //     {
  //       accessorKey: "dias_reagendado",
  //       header: "Días Reag.",
  //       size: 60,
  //     },
  //     {
  //       header: "Acciones",

  //       Cell: ({ row }) => {
  //         console.log(row.original);
  //         return (
  //           <CButton text="Seleccionar" color="secondary" onClick={() => handleModalSelect(row.original.id, row.original.nombre)} />
  //         );
  //       },
  //       size: 40,
  //     },
  //   ],
  //   []
  // );

  const fetchProduct2 = async () => {
    try {
      const response = await jezaApi.get(`/producto?id=${form.id}&descripcion=%&verinventariable=0&esServicio=2&esInsumo=2&obsoleto=2&marca=%&cia=21&sucursal=26`);
      setDataProductos(response.data);

      // Asumiendo que deseas verificar el primer producto en el arreglo para determinar la visibilidad de la pestaña Seguimiento
      if (response.data.length > 0) {
        setShowSeguimientoTab(response.data[0].es_servicio);
      }

    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const cerrarModalActualizar2 = () => {
    setModalActualizar(false);
    // Restablecer estado relacionado con la pestaña "Seguimiento"
    setActiveTab("1"); // Poner la pestaña activa en la primera pestaña por defecto
    setProdReaForm({ // Limpiar los datos de seguimiento
      dias_seguimiento: 0,
      dias_reagendado: 0,
      txtAsunto: "",
      txtMensaje: "",
    });
  };

  useEffect(() => {
    fetchProduct();
  }, []); // Ejecuta fetchProduct solo una vez al cargar el componente

  useEffect(() => {
    setShowSeguimientoTab(form.es_servicio);
  }, [form.es_servicio]);

  const validarCampos1 = () => {
    // Aquí agregamos validaciones para los campos requeridos
    if (!ProductoSustitutoForm.clave_real) {
      Swal.fire({
        icon: "error",
        text: "El campo de clave real está vacío. Por favor, ingresa una clave.",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }

    // Aquí puedes agregar más validaciones para otros campos si es necesario

    return true; // Todos los campos están validados correctamente
  };

  const create = async () => {
    const permiso = await filtroSeguridad("CAT_CLAVEREAL_ADD");
    if (permiso === false) {
      return;
    }

    if (validarCampos1() === true) {
      if (dataProductos.some((elemento) => elemento.clave_prod === ProductoSustitutoForm.clave_real.trim())) {
        // alert("CLAVE REPETIDA")
        Swal.fire({
          icon: "error",
          text: "Clave real repetida, no puedes usar la misma clave de otro producto.",
          confirmButtonColor: "#3085d6",
        });
        return;
      } else if (data.some((elemento) => elemento.clave_real === ProductoSustitutoForm.clave_real.trim())) {
        Swal.fire({
          icon: "error",
          text: "Clave ya registrada.",
          confirmButtonColor: "#3085d6",
        });
        return;
      }
      await jezaApi
        .post("/ProductoSustituto", null, {
          params: {
            id_Producto: form.id,
            clave_real: ProductoSustitutoForm.clave_real,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Clave real creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          // Limpiar el campo después del éxito
          ProductoSustitutoForm.clave_real = "";

          getinfo();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getinfo = () => {
    jezaApi.get(`Sustituto?idProducto=${form.id}`).then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  };







  // const eliminarSustituto = (dato: ProdSustituto) => {
  //   const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento`);
  //   if (opcion) {
  //     jezaApi.delete(`/ProductoSustituto?id=${dato.id}`).then(() => {
  //       alert("Registro Eliminado");
  //       getinfo(); //refresca tabla
  //     });
  //   }
  // };

  const eliminarSustituto = async (dato: ProdSustituto) => {
    const permiso = await filtroSeguridad("CAT_CLAVEREAL_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar la clave: ${dato.clave_real}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/ProductoSustituto?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getinfo();
        });
      }
    });
  };

  const DataTableHeader = ["Id", "Descripcion", "Marca", "Costo", "Precio", "Inv", "Producto", "Servicio", "Acciones"];

  const mostrarModalActualizar = (dato: Producto) => {
    setForm(dato);
    setModalActualizar(true);
    setShowSeguimientoTab(form.es_servicio);
  };

  // const mostrarModalUpdate = (dato: Producto, id: number) => {
  //   setProductoSustitutoForm({ id_Producto: dato.id, d_Producto: dato.descripcion });
  //   console.log({ dato });
  //   setModalUpdate(true);
  //   getProductoSustito(id);
  // };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Producto)[] = [
      "clave_prod",
      "descripcion",
      "descripcion_corta",
      "idMarca",
      "area",
      "depto",
      "clase",
      "observacion",
      "clave_prov",
      "tiempo",
      "tasa_iva",
      "costo_unitario",
      "unidad_medida",
      "tasa_ieps",
      "unidad_paq",
      "unidad_paq_traspaso",
      "comision",
      "precio",

    ];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Producto) => {
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

  // // AQUÍ COMIENZA MI MÉTODO PUT PARA AGREGAR ALMACENES
  // const insertar = async () => {
  //   const fechaHoy = new Date();
  //   const permiso = await filtroSeguridad("CAT_PROD_ADD");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   console.log(validarCampos());
  //   console.log({ form });
  //   if (validarCampos() === true) {
  //     await jezaApi
  //       .post("/Producto", null, {
  //         params: {
  //           clave_prod: form.clave_prod,
  //           descripcion: form.descripcion,
  //           descripcion_corta: form.descripcion_corta,
  //           sucursal_origen: dataUsuarios2[0]?.sucursal,
  //           idMarca: form.idMarca,
  //           area: form.area,
  //           depto: form.depto,
  //           clase: form.clase,
  //           observacion: form.observacion,
  //           inventariable: form.inventariable,
  //           controlado: form.controlado,
  //           es_fraccion: form.es_fraccion,
  //           obsoleto: form.obsoleto,
  //           es_insumo: form.es_insumo,
  //           es_servicio: form.es_servicio,
  //           es_producto: form.es_producto,
  //           es_kit: form.es_kit,
  //           tasa_iva: form.tasa_iva,
  //           tasa_ieps: form.tasa_ieps,
  //           costo_unitario: form.costo_unitario,
  //           precio: form.precio,
  //           unidad_paq: form.unidad_paq ? form.unidad_paq : 0,
  //           unidad_paq_traspaso: form.unidad_paq_traspaso ? form.unidad_paq_traspaso : 0,
  //           promocion: form.promocion ? form.promocion : 0,
  //           porcentaje_promocion: form.porcentaje_promocion ? form.porcentaje_promocion : 0,
  //           precio_promocion: form.precio_promocion ? form.precio_promocion : 0,
  //           fecha_inicio: "2023-08-03",
  //           fecha_final: "2023-08-03",
  //           unidad_medida: form.unidad_medida,
  //           clave_prov: form.clave_prov,
  //           tiempo: form.tiempo,
  //           comision: form.comision,
  //           productoLibre: form.productoLibre ? form.productoLibre : false,
  //           fecha_act: fechaHoy,
  //           fecha_alta: fechaHoy,
  //         },
  //       })
  //       .then((response) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Producto creada con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         setModalInsertar(false);
  //         fetchProduct();
  //       })
  //       .catch((error) => {
  //         console.log(error);

  //       });
  //   } else {
  //   }
  // };

  const insertar = async () => {
    const fechaHoy = new Date();
    const permiso = await filtroSeguridad("CAT_PROD_ADD");

    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (validarCampos() === true) {
      try {
        const response = await jezaApi.post("/Producto", null, {
          params: {
            clave_prod: form.clave_prod,
            descripcion: form.descripcion,
            descripcion_corta: form.descripcion_corta,
            sucursal_origen: dataUsuarios2[0]?.sucursal,
            idMarca: form.idMarca,
            area: form.area,
            depto: form.depto,
            clase: form.clase,
            observacion: form.observacion,
            inventariable: form.inventariable,
            controlado: form.controlado,
            es_fraccion: form.es_fraccion,
            obsoleto: form.obsoleto,
            es_insumo: form.es_insumo,
            es_servicio: form.es_servicio,
            es_producto: form.es_producto,
            es_kit: form.es_kit,
            tasa_iva: form.tasa_iva,
            tasa_ieps: form.tasa_ieps,
            costo_unitario: form.costo_unitario,
            precio: form.precio,
            unidad_paq: form.unidad_paq ? form.unidad_paq : 0,
            unidad_paq_traspaso: form.unidad_paq_traspaso ? form.unidad_paq_traspaso : 0,
            promocion: false,
            porcentaje_promocion: form.porcentaje_promocion ? form.porcentaje_promocion : 0,
            precio_promocion: form.precio_promocion ? form.precio_promocion : 0,
            fecha_inicio: form.fecha_inicio ? form.fecha_inicio : "2023-08-03",
            fecha_final: form.fecha_final ? form.fecha_final : "2023-08-03",
            unidad_medida: form.unidad_medida,
            clave_prov: form.clave_prov,
            tiempo: form.tiempo,
            comision: form.comision,
            productoLibre: false,
            fecha_act: fechaHoy,
            fecha_alta: fechaHoy,
          },
        });

        Swal.fire({
          icon: "success",
          text: "Producto creada con éxito",
          confirmButtonColor: "#3085d6",
        });

        setModalInsertar(false);
        fetchProduct();
      } catch (error) {
        console.error(error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al crear el producto. Por favor, inténtalo de nuevo.",
          confirmButtonColor: "#d33",
        });
      }
    } else {
      // Manejar el caso donde los campos no son válidos
    }
  };

  const LimpiezaForm = () => {
    setForm({
      id: 0,
      fecha_act: "",
      fecha_alta: "",
      clave_prod: "",
      descripcion: "",
      descripcion_corta: "",
      sucursal_origen: 0,
      idMarca: 0,
      area: 0,
      depto: 0,
      clase: 0,
      observacion: "",
      inventariable: false,
      controlado: false,
      es_fraccion: false,
      obsoleto: false,
      es_insumo: false,
      es_servicio: false,
      es_producto: false,
      es_kit: false,
      tasa_iva: 0,
      tasa_ieps: 0,
      costo_unitario: 0.0,
      precio: 0,
      unidad_paq: 0,
      unidad_paq_traspaso: 0,
      promocion: false,
      porcentaje_promocion: 0,
      precio_promocion: 0,
      fecha_inicio: "",
      fecha_final: "",
      unidad_medida: 0,
      clave_prov: 0,
      tiempo: 0,
      comision: 0,
      productoLibre: false,
      d_area: "",
      d_clase: "",
      d_depto: "",
      d_proveedor: "",
      marca: "",
      d_unidadMedida: "",
    });
  };

  // // AQUÉ COMIENZA MÉTODO PUT PARA ACTUALIZAR REGISTROS
  // const editar = async () => {
  //   const fechaHoy = new Date();
  //   const permiso = await filtroSeguridad("CAT_ALMACEN_UPD");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   if (validarCampos() === true) {
  //     await jezaApi
  //       .put(`/Producto`, null, {
  //         params: {
  //           id: form.id,
  //           clave_prod: form.clave_prod,
  //           descripcion: form.descripcion,
  //           descripcion_corta: form.descripcion_corta,
  //           sucursal_origen: form.sucursal_origen,
  //           idMarca: form.idMarca,
  //           area: form.area,
  //           depto: form.depto,
  //           clase: form.clase,
  //           observacion: form.observacion,
  //           inventariable: form.inventariable,
  //           controlado: form.controlado,
  //           es_fraccion: form.es_fraccion,
  //           obsoleto: form.obsoleto,
  //           es_insumo: form.es_insumo,
  //           es_servicio: form.es_servicio,
  //           es_producto: form.es_producto,
  //           es_kit: form.es_kit,
  //           tasa_iva: form.tasa_ieps,
  //           tasa_ieps: form.tasa_ieps,
  //           costo_unitario: form.costo_unitario,
  //           precio: form.precio,
  //           unidad_paq: form.unidad_paq,
  //           unidad_paq_traspaso: form.unidad_paq_traspaso,
  //           promocion: false,
  //           porcentaje_promocion: form.porcentaje_promocion,
  //           precio_promocion: form.precio_promocion,
  //           fecha_inicio: form.fecha_inicio ? form.fecha_inicio : "2023-01-01",
  //           fecha_final: form.fecha_final ? form.fecha_final : "2023-01-01",
  //           unidad_medida: form.unidad_medida,
  //           clave_prov: form.clave_prov,
  //           tiempo: form.tiempo,
  //           comision: form.comision,
  //           productoLibre: form.productoLibre,
  //           fecha_act: fechaHoy,
  //           fecha_alta: form.fecha_alta,
  //         },
  //       })
  //       .then((response) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Producto actualizado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         setModalActualizar(false);
  //         fetchProduct();
  //       })
  //       .catch((error) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "ERROR al actualizar",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         // console.log(error);

  //       });
  //   } else {
  //   }
  // };


  const editar = async () => {
    const fechaHoy = new Date();
    const permiso = await filtroSeguridad("CAT_PROD_UPD");

    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (validarCampos() === true) {
      try {
        const response = await jezaApi.put(`/Producto`, null, {
          params: {
            id: form.id,
            clave_prod: form.clave_prod,
            descripcion: form.descripcion,
            descripcion_corta: form.descripcion_corta,
            sucursal_origen: form.sucursal_origen,
            idMarca: form.idMarca,
            area: form.area,
            depto: form.depto,
            clase: form.clase,
            observacion: form.observacion,
            inventariable: form.inventariable,
            controlado: form.controlado,
            es_fraccion: form.es_fraccion,
            obsoleto: form.obsoleto,
            es_insumo: form.es_insumo,
            es_servicio: form.es_servicio,
            es_producto: form.es_producto,
            es_kit: form.es_kit,
            tasa_iva: form.tasa_ieps,
            tasa_ieps: form.tasa_ieps,
            costo_unitario: form.costo_unitario,
            precio: form.precio,
            unidad_paq: form.unidad_paq,
            unidad_paq_traspaso: form.unidad_paq_traspaso,
            promocion: form.promocion,
            porcentaje_promocion: form.porcentaje_promocion,
            precio_promocion: form.precio_promocion,
            fecha_inicio: form.fecha_inicio ? form.fecha_inicio : "2023-01-01",
            fecha_final: form.fecha_final ? form.fecha_final : "2023-01-01",
            unidad_medida: form.unidad_medida,
            clave_prov: form.clave_prov,
            tiempo: form.tiempo,
            comision: form.comision,
            productoLibre: form.productoLibre,
            fecha_act: fechaHoy,
            fecha_alta: form.fecha_alta,
          },
        });

        Swal.fire({
          icon: "success",
          text: "Producto actualizado con éxito",
          confirmButtonColor: "#3085d6",
        });

        setModalActualizar(false);
        fetchProduct();
      } catch (error) {
        console.error(error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al actualizar el producto. Por favor, inténtalo de nuevo.",
          confirmButtonColor: "#d33",
        });
      }
    } else {
      // Manejar el caso donde los campos no son válidos
    }
  };

  const eliminar = async (dato: Producto) => {
    const permiso = await filtroSeguridad("CAT_PROD_DEL");

    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el producto: ${dato.descripcion_corta}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await jezaApi.delete(`/Producto?id=${dato.id}`);

          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });

          setModalActualizar(false);
          fetchProduct();
        } catch (error) {
          console.error(error);

          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al eliminar el producto. Por favor, inténtalo de nuevo.",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };


  // const eliminar = async (dato: Producto) => {
  //   const permiso = await filtroSeguridad("CAT_PROD_DEL");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   Swal.fire({
  //     title: "ADVERTENCIA",
  //     text: `¿Está seguro que desea eliminar el producto: ${dato.descripcion_corta}?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Sí, eliminar",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       jezaApi.delete(`/Producto?id=${dato.id}`).then(() => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Registro eliminado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         setModalActualizar(false);
  //         fetchProduct();
  //       });
  //     }
  //   });
  // };

  // Update ---> POS PRODUCTO SUSTITUTOS
  const createProductoSustito = () => {
    jezaApi
      .post(
        `ProductoSustituto?id_Producto=${ProductoSustitutoForm.id_Producto}&clave_real=${ProductoSustitutoForm.clave_real}`
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          text: "Registro realizado con éxito",
          confirmButtonColor: "#3085d6",
        });
      });
  };

  // // Update ---> PUT PRODUCTO SUSTITUTO
  // const updateProductoSustito = () => {
  //   jezaApi
  //     .put(
  //       `ProductoSustituto?id=${productoSustitutoForm.id}&id_Producto=${productoSustitutoForm.id_Producto}&clave_real=${productoSustitutoForm.clave_real}`
  //     )
  //     .then(() => {
  //       Swal.fire({
  //         icon: "success",
  //         text: "Registro realizado con éxito",
  //         confirmButtonColor: "#3085d6",
  //       });
  //       setModalUpdate(!modalUpdate); //cierra modal
  //     });
  // };

  const handleActionProductoSustituo = async () => {
    const permiso = await filtroSeguridad("CAT_PROD_SUS");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (data.length > 0) {
      updateProductoSustito();
    } else {
      createProductoSustito();
    }
  };

  const [modalUpdate, setModalUpdate] = useState(false); /* definimos el usestate del modal */

  /* NO SE PARA QUE SIRVE PERO SE USA PARA EL MODAL */
  const toggleUpdateModal = (dato: ProdSustituto) => {
    setModalUpdate(!modalUpdate);
    setForm(dato);
  };

  const filtroEmail = (datoMedico: string, datoEmail: string) => {
    var resultado = dataProductos.filter((elemento: Producto) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if (
        (datoMedico === "" || elemento.descripcion.toLowerCase().includes(datoMedico.toLowerCase())) &&
        (datoEmail === "" || elemento.marca.toLowerCase().includes(datoEmail.toLowerCase())) &&
        elemento.descripcion.length > 2
      ) {
        return elemento;
      }
    });
    setDataProductos(resultado);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (
      name === "inventariable" ||
      name === "controlado" ||
      name === "es_fraccion" ||
      name === "obsoleto" ||
      name === "es_insumo" ||
      name === "es_producto" ||
      name === "es_servicio" ||
      name === "es_kit" ||
      name === "promocion"
    ) {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: Producto) => ({ ...prevState, [name]: value }));
    }
    console.log(form);
  };

  // const handleChange1 = (e) => {
  //   const { name, value } = e.target;
  //   // Eliminar espacios en blanco al principio de la cadena
  //   const trimmedValue = value.replace(/^\s+/g, "");
  //   setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
  //   console.log(form);
  //   // Eliminar espacios iniciales en todos los campos de entrada de texto
  //   const sanitizedValue = value.trim();
  //   if (name === 'precio' || 'costo_unitario' || 'comision' || 'tasa_iva' || 'tiempo' || 'tasa_ieps' || 'unidad_paq' || 'unidad_paq_traspaso' || 'precio_promocion' || 'porcentaje_promocion') {
  //     // Eliminar caracteres no numéricos
  //     const numericValue = sanitizedValue.replace(/[^0-9]/g, '');
  //     setForm({ ...form, [name]: numericValue });
  //   }
  //   // else {
  //   //   // Actualizar el valor sin validación en otros campos
  //   //   const trimmedValue = value.replace(/^\s+/g, "");
  //   //   setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
  //   //   console.log(form);
  //   // }
  // };

  const handleChange1 = (e) => {
    const { name, value } = e.target;

    // Verificar si el campo es 'min_descto' o 'max_descto'
    if (
      name === 'precio' ||
      name === 'costo_unitario' ||
      name === 'tasa_ieps' ||
      name === 'comision' ||
      name === 'tasa_iva' ||
      name === 'precio_promocion' ||
      name === 'porcentaje_promocion') {
      // Restricciones para 'min_descto' y 'max_descto'
      const numericValue = value.replace(/[^0-9.]/g, '');

      // Verificar si ya hay un punto en el valor
      if (numericValue.indexOf('.') === -1 || numericValue.lastIndexOf('.') === numericValue.indexOf('.')) {
        setForm((prevState) => ({ ...prevState, [name]: numericValue }));
      }
    } else {
      // Permitir la entrada de espacios solo después de que se haya ingresado al menos un carácter
      if (value.length === 0 || /^\s*$/.test(value)) {
        setForm((prevState) => ({ ...prevState, [name]: '' }));
      } else {
        setForm((prevState) => ({ ...prevState, [name]: value }));
      }
    }
  };

  const handleChange3 = (e) => {
    const { name, value } = e.target;

    // Eliminar espacios iniciales en todos los campos de entrada de texto
    const sanitizedValue = value.trim();

    if (name === 'tiempo' || name === 'unidad_paq' || name === 'unidad_paq_traspaso') {
      // Eliminar caracteres no numéricos
      const numericValue = sanitizedValue.replace(/[^0-9]/g, '');
      setForm({ ...form, [name]: numericValue });
    } else {
      // Actualizar el valor sin validación en otros campos
      const trimmedValue = value.replace(/^\s+/g, "");
      setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
      console.log(form);
    }
  };

  const handleSeguiProd = (e) => {
    const { name, value } = e.target;

    // Eliminar espacios iniciales en todos los campos de entrada de texto
    const sanitizedValue1 = value.trim();

    if (name === 'dias_seguimiento' || name === 'dias_reagendado') {
      // Eliminar caracteres no numéricos
      const numericValue1 = sanitizedValue1.replace(/[^0-9]/g, '');
      setProdReaForm({ ...ProdReaForm, [name]: numericValue1 });
    } else {
      // Actualizar el valor sin validación en otros campos
      const trimmedValue1 = value.replace(/^\s+/g, "");
      setProdReaForm((prevState) => ({ ...prevState, [name]: trimmedValue1 }));
      console.log(ProdReaForm);
    }
  };


  const handleNav = () => {
    navigate("/ProductosCrear");
  };
  const handleNavSustituto = () => {
    navigate("/ProductoSustituto");
  };
  const handleNavs = () => {
    navigate("/UsuariosPrueba");
  };
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };


  const toggleModalActualizar = () => {
    setModalActualizar(!modalActualizar);
    // Aquí puedes ajustar setShowSeguimientoTab basado en form.es_servicio
    setShowSeguimientoTab(form.es_servicio);
  };


  const [visible, setVisible] = useState(false);

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);

  useEffect(() => {
    const quePedo = dataDeptos.filter((data) => data.area === Number(form.area));
    setDataDeptosFiltrado(quePedo);
    console.log({ dataDeptosFiltrado });
  }, [form.area]);

  useEffect(() => {
    const quePedo = dataClases.filter((data) => data.depto === Number(form.depto));
    setDataClasesFiltrado(quePedo);
    console.log({ dataClasesFiltrado });
  }, [form.depto]);

  interface CustomColumnDef extends MRT_ColumnDef {
    customWidth?: number;
  }

  const [modalSustituto, setIsOpenSustituto] = useState(false);

  const toggleModalSustituto = () => {
    setIsOpenSustituto(!modalSustituto);
    getinfo();
  };

  const limpiarCampoSustituto = () => {
    setProductoSustitutoForm({ ...ProductoSustitutoForm, clave_real: "" });
  };

  const columns: CustomColumnDef[] = [
    {
      id: "actions",
      header: "Acción",
      accessorFn: (row) => row.actions,
      Cell: ({ row }: { row: MRT_Row }) => (
        <>
          <AiFillEdit
            className="mr-2"
            onClick={() => {
              mostrarModalActualizar(row.original);
              console.log(row.original);
            }}
            size={23}
          />

          <AiFillDelete onClick={() => eliminar(row.original)} size={23} />
        </>
      ),
      size: 50, // Ajustar el ancho según lo necesites
    },
    { id: "id", header: "ID", accessorFn: (row) => row.id, size: 5 },
    { id: "descripcion", header: "Descripción", accessorFn: (row) => row.descripcion, size: 350 },
    { id: "marca", header: "Marca", accessorFn: (row) => row.marca, size: 50 },
    {
      id: "costo_unitario",
      header: "Costo unitario",
      Cell: ({ cell }) => (
        <span>
          ${cell.getValue<number>().toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
      accessorFn: (row) => row.costo_unitario,
      size: 5,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    // { id: "precio", header: "Precio", accessorFn: (row) => row.precio, size: 5 },

    {
      accessorKey: "precio",
      header: "Precio",
      Cell: ({ cell }) => (
        <span>
          ${cell.getValue<number>().toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },

    {
      id: "es_insumo",
      header: "Es insumo",
      Cell: ({ row }) => {
        if (row.original.es_insumo === true) {
          return <Input type="checkbox" disabled="disabled" checked="checked" />;
        } else {
          return <Input type="checkbox" disabled="disabled" />;
        }
      },
      accessorFn: (row) => row.es_insumo,
      size: 5,
    },
    {
      id: "es_producto",
      header: "Es producto",
      Cell: ({ row }) => {
        if (row.original.es_producto === true) {
          return <Input type="checkbox" disabled="disabled" checked="checked" />;
        } else {
          return <Input type="checkbox" disabled="disabled" />;
        }
      },
      accessorFn: (row) => row.es_producto,
      size: 5,
    },
    {
      id: "es_servicio",
      header: "Es servicio",
      Cell: ({ row }) => {
        if (row.original.es_servicio === true) {
          return <Input type="checkbox" disabled="disabled" checked="checked" />;
        } else {
          return <Input type="checkbox" disabled="disabled" />;
        }
      },
      accessorFn: (row) => row.es_servicio,
      size: 5,
    },
  ];

  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
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
                <h1> Productos <AiOutlineShoppingCart size={30}></AiOutlineShoppingCart></h1>

              </div>

              <br />
              <br />

              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button
                  color="success"
                  onClick={() => {
                    setModalInsertar(true);
                    setEstado("insert");
                    LimpiezaForm();
                    // handleNav();
                  }}
                >
                  Crear producto
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
            </Container>
            <br />
            <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />

            <div style={{ width: "100%" }}>
              <MaterialReactTable
                enableSorting
                columns={columns}
                data={dataProductos}
                initialState={{ density: "compact", sorting: [{ id: "descripcion", desc: false }] }}
              />
            </div>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modalInsertar} size="xl">
        <ModalHeader>
          <div>
            <h3>Crear producto</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Card body>
            <>
              <Nav tabs>
                <NavItem>
                  <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
                    Datos
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
                    Marca producto
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")}>
                    Info de producto
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "4" ? "active" : ""} onClick={() => toggleTab("4")}>
                    Promociones
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <br />
                <TabPane tabId="1">
                  <Row>
                    <Col>
                      <Label>Área:</Label>
                      <Input type="select" name="area" id="exampleSelect" value={form.area} onChange={handleChange}>
                        <option value={""}>-Selecciona Area-</option>
                        {dataAreas.map((area) => (
                          <option value={area.area}>{area.descripcion}</option>
                        ))}
                      </Input>
                      <br />

                      <Label>Departamento:</Label>
                      <Input type="select" name="depto" id="exampleSelect" value={form.depto} onChange={handleChange}>
                        <option value={""}>-Selecciona departamento-</option>
                        {dataDeptosFiltrado.map((depto: Departamento) => (
                          <option value={depto.depto}>{depto.descripcion}</option>
                        ))}
                      </Input>
                      <br />
                      <Label>Clase:</Label>
                      <Input type="select" name="clase" id="exampleSelect" value={form.clase} onChange={handleChange}>
                        <option value={""}>-Selecciona Clase-</option>
                        {dataClasesFiltrado.map((depto: Clase) => (
                          <option value={depto.clase}>{depto.descripcion}</option>
                        ))}
                      </Input>
                      <br />
                      <Label>Marca:</Label>
                      <Input
                        type="select"
                        name="idMarca"
                        id="exampleSelect"
                        value={form.idMarca}
                        onChange={handleChange}
                      >
                        <option value={""}>-Selecciona marca-</option>
                        {dataMarcas.map((marca) => (
                          <option value={marca.id}>{marca.marca}</option>
                        ))}
                      </Input>

                      <div style={{ paddingBottom: 25 }}></div>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="descripcion"
                        labelName="Descripción:"
                        value={form.descripcion}
                        minlength={1} maxlength={199}
                      />
                      <div style={{ paddingBottom: 0 }}></div>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="clave_prod"
                        labelName="Clave producto:"
                        value={form.clave_prod}
                        minlength={1} maxlength={30}
                      />
                    </Col>
                    <Col>
                      <CFormGroupInput
                        handleChange={handleChange3}
                        inputName="tiempo"
                        labelName="Tiempo:"
                        type="number"
                        minlength={1} maxlength={30}
                      />
                      <CFormGroupInput
                        handleChange={handleChange1}
                        inputName="comision"
                        labelName="Comisión:"
                        type="number"
                        minlength={1} maxlength={100}
                      />
                      <br />
                      <Label>Proveedor:</Label>
                      <Input
                        type="select"
                        name="clave_prov"
                        id="exampleSelect"
                        value={form.clave_prov}
                        onChange={handleChange}
                        style={{ marginBottom: 17 }}
                      >
                        <option value={""}>--Selecciona el proveedor--</option>
                        {dataProveedores.map((proveedor) => (
                          <option value={proveedor.id}>{proveedor.nombre}</option>
                        ))}
                      </Input>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="descripcion_corta"
                        labelName="Descripción corta:"
                        value={form.descripcion_corta}
                        minlength={1} maxlength={199}

                      />

                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="observacion"
                        labelName="Observación:"
                        value={form.observacion}
                        minlength={1} maxlength={500}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <br />
                  <Row>
                    <Col sm="6">
                      {/* <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={handleChange2}
                          name="inventariable"
                          checked={form.inventariable}
                        />
                        <span className="checkmark"></span>
                        ¿Inventariable?
                      </label> */}
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={handleChange2}
                          name="inventariable"
                          checked={form.inventariable}
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Inventariable?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={form.controlado}
                          onChange={handleChange2}
                          name="controlado"
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        Controlado
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={form.es_producto}
                          onChange={handleChange2}
                          name="es_producto"
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es producto?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={form.es_servicio}
                          onChange={handleChange2}
                          name="es_servicio"
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es servicio?
                      </label>
                    </Col>
                    <Col sm="6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={handleChange2}
                          name="es_fraccion"
                          checked={form.es_fraccion}
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es fracción?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={handleChange2}
                          name="obsoleto"
                          checked={form.obsoleto}
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        Obsoleto
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={handleChange2}
                          name="es_insumo"
                          checked={form.es_insumo}
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es insumo?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={form.es_kit}
                          onChange={handleChange2}
                          name="es_kit"
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es kit?
                      </label>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <br />
                  <Row>
                    <Col sm="6">
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange1}
                        inputName="tasa_iva"
                        labelName="Tasa IVA:"
                        minlength={1} maxlength={100}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange1}
                        inputName="costo_unitario"
                        labelName="Costo unitario:"
                        minlength={1} maxlength={100}
                      />

                      <Label>Unidad de medida:</Label>
                      <Input
                        type="select"
                        name="unidad_medida"
                        id="exampleSelect"
                        value={form.unidad_medida}
                        onChange={handleChange}
                      >
                        <option value={""}>-Selecciona unida medida-</option>
                        {dataUnidadMedida.map((medida: UnidadMedidaModel) => (
                          <option value={medida.id}>{medida.descripcion}</option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm="6">
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange1}
                        inputName="tasa_ieps"
                        labelName="Tasa IEPS:"
                        minlength={1} maxlength={100}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange1}
                        inputName="precio"
                        labelName="Precio:"
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange3}
                        inputName="unidad_paq"
                        labelName="Unidad paquete compra:"
                        value={form.unidad_paq}
                        minlength={1} maxlength={100}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange3}
                        inputName="unidad_paq_traspaso"
                        labelName="Unidad paquete traspaso:"
                        minlength={1} maxlength={100}
                      />
                    </Col>
                  </Row>
                  <br />
                </TabPane>
                <TabPane tabId="4">
                  <br />
                  <Container>
                    <Row>
                      <Col sm="6">
                        <CFormGroupInput
                          type="number"
                          handleChange={handleChange1}
                          inputName="precio_promocion"
                          labelName="Precio promoción:"
                          minlength={1} maxlength={100}
                        />
                        <CFormGroupInput
                          type="number"
                          handleChange={handleChange1}
                          inputName="porcentaje_promocion"
                          labelName="Porcentaje promoción:"
                          minlength={1} maxlength={100}
                        />
                        <label className="checkbox-container">
                          <input type="checkbox" checked={form.promocion} onChange={handleChange} name="promocion" />
                          <span className="checkmark"></span>
                          ¿Es promoción?
                        </label>
                      </Col>
                      <Col sm="6">
                        <Label> Fecha inicio:</Label>
                        <Input
                          style={{ marginBottom: 15 }}
                          type="datetime-local"
                          onChange={handleChange}
                          name="fecha_inicio"
                          defaultValue={form.fecha_inicio}
                        />
                        <Label> Fecha final: </Label>
                        <Input
                          type="datetime-local"
                          onChange={handleChange}
                          name="fecha_final"
                          defaultValue={form.fecha_final}
                        />
                        {/* <CFormGroupInput handleChange={handleChange} inputName="fecha_inicio" labelName="Fecha inicio:" value={form.fecha_inicio} />
                        <CFormGroupInput handleChange={handleChange} inputName="fecha_final" labelName="Fecha final:" value={form.fecha_final} /> */}
                      </Col>
                    </Row>
                  </Container>
                </TabPane>
                <br />
                <br />
              </TabContent>
            </>
          </Card>
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar producto" />

          <CButton
            color="danger"
            onClick={() => {
              cerrarModalInsertar();
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>
              <span style={{ color: "black", fontWeight: "initial", fontSize: "1.1em" }}>{form.descripcion}</span>
            </h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Card body>
            <>
              <Nav tabs>
                <NavItem>
                  <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
                    Datos comerciales
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
                    Tipo producto/servicio
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")}>
                    Costos y precios
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "4" ? "active" : ""} onClick={() => toggleTab("4")}>
                    Promociones
                  </NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink className={activeTab === "5" ? "active" : ""} onClick={() => toggleTab("5")}>
                    Seguimiento
                  </NavLink>
                </NavItem> */}
                {showSeguimientoTab && (
                  <NavItem>
                    <NavLink className={activeTab === "5" ? "active" : ""} onClick={() => toggleTab("5")}>
                      Seguimiento
                    </NavLink>
                  </NavItem>
                )}
              </Nav>

              <TabContent activeTab={activeTab}>
                <br />
                <TabPane tabId="1">
                  <Row>
                    <Col>
                      <Label>Área:</Label>
                      <Input type="select" name="area" id="exampleSelect" value={form.area} onChange={handleChange}>
                        <option value={""}>-Selecciona Area-</option>
                        {dataAreas.map((area) => (
                          <option value={area.area}>{area.descripcion}</option>
                        ))}
                      </Input>
                      <br />
                      <Label>Clase:</Label>
                      <Input type="select" name="clase" id="exampleSelect" value={form.clase} onChange={handleChange}>
                        <option value={""}>-Selecciona Clase-</option>
                        {dataClasesFiltrado.map((depto: Clase) => (
                          <option value={depto.clase}>{depto.descripcion}</option>
                        ))}
                      </Input>
                      <div style={{ paddingBottom: 25 }}></div>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="descripcion"
                        labelName="Descripción:"
                        value={form.descripcion}
                        minlength={1} maxlength={199}
                      />
                      <div style={{ paddingBottom: 0 }}></div>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="clave_prod"
                        labelName="Clave Producto:"
                        value={form.clave_prod}
                        minlength={1} maxlength={30}
                      />
                      <CFormGroupInput
                        handleChange={handleChange3}
                        inputName="tiempo"
                        labelName="Tiempo:"
                        value={form.tiempo}
                        type="number"
                      />
                      <CFormGroupInput
                        handleChange={handleChange1}
                        inputName="comision"
                        labelName="Comisión:"
                        value={form.comision}
                        type="number"
                      />
                    </Col>

                    <Col>
                      <Label>Departamento:</Label>
                      <Input type="select" name="depto" id="exampleSelect" value={form.depto} onChange={handleChange}>
                        <option value={""}>-Selecciona departamento-</option>
                        {dataDeptosFiltrado.map((depto: Departamento) => (
                          <option value={depto.depto}>{depto.descripcion}</option>
                        ))}
                      </Input>
                      <br />
                      <Label>Marca:</Label>
                      <Input
                        type="select"
                        name="idMarca"
                        id="exampleSelect"
                        value={form.idMarca}
                        onChange={handleChange}
                      >
                        <option value={""}>-Selecciona Marca-</option>
                        {dataMarcas.map((marca) => (
                          <option value={marca.id}>{marca.marca}</option>
                        ))}
                      </Input>
                      <br />
                      <Label>Proveedor:</Label>
                      <Input
                        type="select"
                        name="clave_prov"
                        id="exampleSelect"
                        value={form.clave_prov}
                        onChange={handleChange}
                        style={{ marginBottom: 17 }}
                      >
                        <option value={""}>--Selecciona el proveedor--</option>
                        {dataProveedores.map((proveedor: Proveedor) => (
                          <option value={proveedor.id}> {proveedor.nombre} </option>
                        ))}
                      </Input>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="descripcion_corta"
                        labelName="Descripción corta:"
                        value={form.descripcion_corta}
                        minlength={1} maxlength={30}
                      />
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="observacion"
                        labelName="Observación:"
                        value={form.observacion}
                        minlength={1} maxlength={500}
                      />
                      <Label>Unidad de medida:</Label>
                      <Input
                        type="select"
                        name="unidad_medida"
                        id="exampleSelect"
                        value={form.unidad_medida}
                        onChange={handleChange}
                      >
                        <option value={""}>-Selecciona unida medida-</option>
                        {dataUnidadMedida.map((medida: UnidadMedidaModel) => (
                          <option value={medida.id}>{medida.descripcion}</option>
                        ))}
                      </Input>
                      <br />
                      {/* <Col > */}
                      <CButton color="success" onClick={toggleModalSustituto} text="Crear producto sustituto" />
                      {/* </Col> */}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <h3> Marca producto: </h3>
                  <br />
                  <Row>
                    <Col sm="6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={handleChange2}
                          name="inventariable"
                          checked={form.inventariable}
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Inventariable?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={form.controlado}
                          onChange={handleChange2}
                          name="controlado"
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        Controlado
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={form.es_producto}
                          onChange={handleChange2}
                          name="es_producto"
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es producto?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={form.es_servicio}
                          onChange={handleChange2}
                          name="es_servicio"
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es servicio?
                      </label>
                    </Col>
                    <Col sm="6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={handleChange2}
                          name="es_fraccion"
                          checked={form.es_fraccion}
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es fracción?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={handleChange2}
                          name="obsoleto"
                          checked={form.obsoleto}
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        Obsoleto
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={handleChange2}
                          name="es_insumo"
                          checked={form.es_insumo}
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es insumo?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={form.es_kit}
                          onChange={handleChange2}
                          name="es_kit"
                          disabled={isDisabled}
                        />
                        <span className="checkmark"></span>
                        ¿Es kit?
                      </label>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <h3> Costos y precios: </h3>
                  <br />
                  <Row>
                    <Col sm="6">
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange1}
                        inputName="tasa_iva"
                        labelName="Tasa IVA:"
                        value={form.tasa_iva}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange1}
                        inputName="costo_unitario"
                        labelName="Costo unitario:"
                        value={form.costo_unitario}
                      />
                    </Col>
                    <Col sm="6">
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange1}
                        inputName="tasa_ieps"
                        labelName="Tasa IEPS:"
                        value={form.tasa_ieps}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange1}
                        inputName="precio"
                        labelName="Precio:"
                        value={form.precio}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange3}
                        inputName="unidad_paq"
                        labelName="Unidad paquete compra:"
                        value={form.unidad_paq}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange3}
                        inputName="unidad_paq_traspaso"
                        labelName="Unidad paquete traspaso:"
                        value={form.unidad_paq_traspaso}
                      />
                    </Col>
                  </Row>
                  <br />
                </TabPane>
                <TabPane tabId="4">
                  <h3>Promociones</h3>
                  <br />
                  <Container>
                    <Row>
                      <Col sm="6">
                        <CFormGroupInput
                          type="number"
                          handleChange={handleChange1}
                          inputName="precio_promocion"
                          labelName="Precio promoción:"
                          value={form.precio_promocion}
                        />
                        <CFormGroupInput
                          type="number"
                          handleChange={handleChange1}
                          inputName="porcentaje_promocion"
                          labelName="Porcentaje promoción:"
                          value={form.porcentaje_promocion}
                        />
                        <label className="checkbox-container">
                          <input type="checkbox" checked={form.promocion} onChange={handleChange} name="promocion" />
                          <span className="checkmark"></span>
                          ¿Es promocion?
                        </label>
                      </Col>
                      <Col sm="6">
                        <Label> Fecha inicio: </Label>
                        <Input
                          style={{ marginBottom: 15 }}
                          type="datetime-local"
                          onChange={handleChange}
                          inputName="fecha_inicio"
                          value={form.fecha_inicio}
                        />
                        <Label> Fecha final: </Label>
                        <Input
                          type="datetime-local"
                          onChange={handleChange}
                          inputName="fecha_final"
                          value={form.fecha_final}
                        />
                      </Col>
                    </Row>
                  </Container>
                </TabPane>
                {showSeguimientoTab && (
                  <TabPane tabId="5">
                    <h3>Seguimiento de servicios</h3>
                    <br />
                    <Container>
                      <Row>
                        {/* <Col sm="9">
                          <CFormGroupInput
                            type="number"
                            disabled="true"
                            handleChange={handleSeguiProd}
                            inputName="id_producto"
                            labelName="Servicio:"
                            value={form.id}
                          />
                        </Col> */}
                        <Col sm="9">
                          <CFormGroupInput
                            type="textarea"
                            handleChange={handleSeguiProd}
                            inputName="txtAsunto"
                            labelName="Asunto Seguimiento:"
                            value={ProdReaForm.txtAsunto}
                            minlength={1} maxlength={255}
                          />
                       
                        </Col>
                        <Col sm="3">
                          <Alert color="primary">
                            Agregue el asunto del correo.
                          </Alert>
                        </Col>
                        <Col sm="9">
                          <CFormGroupInput
                            type="textarea"
                            handleChange={handleSeguiProd}
                            inputName="txtMensaje"
                            labelName="Mensaje Seguimiento:"
                            value={ProdReaForm.txtMensaje}
                          />
                        </Col>
                        <Col sm="3">
                          <Alert color="primary" size={2}>
                            Agregue el Mensaje del correo.
                          </Alert>
                        </Col>
                        <Col sm="9">
                          <CFormGroupInput
                            type="textarea"
                            handleChange={handleSeguiProd}
                            inputName="txtAsuntoRe"
                            labelName="Asunto Reagendado:"
                            value={ProdReaForm.txtAsuntoRe}
                            minlength={1} maxlength={255}
                          />
                        </Col>
                        <Col sm="3">
                          <Alert color="primary">
                            Agregue el asunto de reagendado.
                          </Alert>
                        </Col>
                        <Col sm="9">
                          <CFormGroupInput
                            type="textarea"
                            handleChange={handleSeguiProd}
                            inputName="txtMensajeRe"
                            labelName="Mensaje Reagendado:"
                            value={ProdReaForm.txtMensajeRe}
                          />
                        </Col>
                        <Col sm="3">
                          <Alert color="primary" size={2}>
                            Agregue el Mensaje de reagendado del correo.
                          </Alert>
                        </Col>
                        <Col sm="2"> <br /><p>Días seguimiento:</p></Col>
                        <Col sm="7">
                          <CFormGroupInput
                            type="number"
                            handleChange={handleSeguiProd}
                            inputName="dias_seguimiento"
                            labelName=""
                            value={ProdReaForm.dias_seguimiento}
                          />
                        </Col>
                        <Col sm="3">
                          <br />
                          <Alert color="primary" size={2}>
                            Días para el segumiento
                          </Alert>
                        </Col>
                        
                        <Col sm="2"> <br /><p> Días reagendado: </p></Col>
                        <Col sm="7">
                          <CFormGroupInput
                            type="number"
                            handleChange={handleSeguiProd}
                            inputName="dias_reagendado"
                            value={ProdReaForm.dias_reagendado}
                            labelName=""
                          />
                        </Col>
                        <Col sm="3">
                          <br />
                          <Alert color="primary" size={2}>
                            Dias sugerencia reagendado.
                          </Alert>
                        </Col>
                        <Col sm="5">
                          <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <CButton color="info" onClick={create2} text="Guardar seguimiento" />

                            <CButton text="Clonar desde" color="success" onClick={abrirModal} />

                            <CButton color="danger" onClick={() => eliminarRe(ProdReaForm)} text="Eliminar" />
                          </ButtonGroup>
                        </Col>
                        
                      </Row>
                    </Container>
                  </TabPane>
                )}

              </TabContent>
            </>
          </Card>
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar producto" />

          <CButton
            color="danger"
            onClick={() => {
              cerrarModalActualizar2();
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>

      {/* MODAL SUSTITUTO */}
      <Modal isOpen={modalSustituto} toggle={toggleModalSustituto} size="lg">
        <ModalHeader toggle={toggleModalSustituto}>
          <span style={{ color: "grey", fontWeight: "initial", fontSize: "1.1em" }}>{form.descripcion}</span>
        </ModalHeader>
        <ModalBody>
          <Container>
            <div>
              <Container>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <h3> Crear producto sustituto </h3>
                </div>
                <br />
                <Row>
                  <InputGroup style={{ width: "300px", marginLeft: "auto" }}>
                    <Input
                      type="text"
                      name={"clavereal"}
                      onChange={(e) =>
                        setProductoSustitutoForm({ ...ProductoSustitutoForm, clave_real: e.target.value })
                      }
                      value={ProductoSustitutoForm.clave_real}
                      placeholder="Ingrese una clave "
                    ></Input>
                    <CButton
                      text="Agregar"
                      color="success"
                      onClick={() => {
                        create();
                        limpiarCampoSustituto();
                      }}
                    />
                  </InputGroup>
                </Row>
              </Container>

              <br />
              <br />
              <Container>
                <Table>
                  <thead>
                    <tr>
                      <th>Clave producto</th>
                      <th>Clave real</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* a partir de aqui se van a mostrar los registros de la base */}
                    {data.map((dato: ProdSustituto) => (
                      <tr key={dato.id}>
                        <td> {dato.id_Producto}</td>
                        <td>{dato.clave_real}</td>
                        <td align="center">
                          <AiFillDelete
                            color="lightred"
                            onClick={() => eliminarSustituto(dato)}
                            size={23}
                          ></AiFillDelete>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>
            </div>
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton
            text="Cancelar"
            color="danger"
            onClick={() => {
              toggleModalSustituto();
              setData([]);
            }}
          />
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalOpenCli} toggle={cerrarModal} size="xl">
        <ModalHeader toggle={cerrarModal}><h2>Clonar servicio</h2></ModalHeader>
        <ModalBody>
          {/* <MaterialReactTable
            columns={columnsReaProd}
            data={data2}
            onSelect={(idProducto, d_producto) => handleModalSelect(idProducto, d_producto)} // Pasa la función de selección
            initialState={{ density: "compact" }}
          /> */}
          <MaterialReactTable
          columns={columnsReaProd}
          data={data3}
          initialState={{ density: "compact" }}
          getRowId={(row) => row.id}
          renderRowActions={({ row }) => (
            <CButton
              text="Seleccionar"
              color="secondary"
              onClick={() => handleModalSelect(row.original)}
            />
          )}
        />
        </ModalBody>
        <ModalFooter>
          <CButton text="Cerrar" color="danger" onClick={cerrarModal} />
          {/* Cerrar
              </Button> */}
        </ModalFooter>
      </Modal>

    </>
  );
}

export default Productos;
