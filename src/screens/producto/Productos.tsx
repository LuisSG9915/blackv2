import React, { useState, useEffect } from "react";
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

function Productos() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar } = useModalHook();
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

  const create = () => {
    jezaApi.post(`ProductoSustituto?id_Producto=${form.id}&clave_real=${ProductoSustitutoForm.clave_real}`).then(() => {
      alert("registro cargado"); //manda alerta
      getinfo(); // refresca tabla
    });
  };

  const getinfo = () => {
    jezaApi.get(`Sustituto?idProducto=${form.id}`).then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  };

  const eliminarSustituto = (dato: ProdSustituto) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento`);
    if (opcion) {
      jezaApi.delete(`/ProductoSustituto?id=${dato.id}`).then(() => {
        alert("Registro Eliminado");
        getinfo(); //refresca tabla
      });
    }
  };

  const DataTableHeader = ["Id", "Descripcion", "Marca", "Costo", "Precio", "Inv", "Producto", "Servicio", "Acciones"];

  const mostrarModalActualizar = (dato: Producto) => {
    setForm(dato);
    setModalActualizar(true);
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
    const camposRequeridos: (keyof Producto)[] = ["clave_prod", "descripcion", "descripcion_corta", "idMarca", "area", "depto", "clase"];
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

  // AQUÍ COMIENZA MI MÉTODO PUT PARA AGREGAR ALMACENES
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_ALMACEN_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Producto", null, {
          params: {
            clave_prod: form.clave_prod,
            descripcion: form.descripcion,
            descripcion_corta: form.descripcion_corta,
            sucursal_origen: 21,
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
            unidad_paq: form.unidad_paq,
            unidad_paq_traspaso: form.unidad_paq_traspaso,
            promocion: form.promocion,
            porcentaje_promocion: form.porcentaje_promocion,
            precio_promocion: form.precio_promocion,
            fecha_inicio: "2023-08-03",
            fecha_final: "2023-08-03",
            unidad_medida: form.unidad_medida,
            clave_prov: form.clave_prov,
            tiempo: form.tiempo,
            comision: form.comision,
            productoLibre: form.productoLibre,
            fecha_act: "2023-05-30",
            fecha_alta: "2023-05-30",
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Producto creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          fetchProduct();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
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

  // AQUÉ COMIENZA MÉTODO PUT PARA ACTUALIZAR REGISTROS
  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_ALMACEN_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Producto`, null, {
          params: {
            id: form.id,
            clave_prod: form.clave_prod,
            descripcion: form.descripcion,
            descripcion_corta: form.descripcion_corta,
            sucursal_origen: 21,
            idMarca: Number(form.idMarca),
            area: Number(form.area),
            depto: Number(form.depto),
            clase: Number(form.clase),
            observacion: form.observacion,
            inventariable: form.inventariable,
            controlado: form.controlado,
            es_fraccion: form.es_fraccion,
            obsoleto: form.obsoleto,
            es_insumo: form.es_insumo,
            es_servicio: form.es_servicio,
            es_producto: form.es_producto,
            es_kit: form.es_kit,
            tasa_iva: Number(form.tasa_ieps),
            tasa_ieps: Number(form.tasa_ieps),
            costo_unitario: Number(form.costo_unitario),
            precio: Number(form.precio),
            unidad_paq: Number(form.unidad_paq),
            unidad_paq_traspaso: Number(form.unidad_paq_traspaso),
            promocion: false,
            porcentaje_promocion: Number(form.porcentaje_promocion),
            precio_promocion: Number(form.precio_promocion),
            fecha_inicio: form.fecha_inicio ? form.fecha_inicio : "2023-01-01",
            fecha_final: form.fecha_final ? form.fecha_final : "2023-01-01",
            unidad_medida: Number(form.unidad_medida),
            clave_prov: Number(form.clave_prov),
            tiempo: Number(form.tiempo),
            comision: Number(form.comision),
            productoLibre: form.productoLibre,
            fecha_act: "2023-05-30T18:38:35",
            fecha_alta: "2023-05-30T18:38:35",
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Producto actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          fetchProduct();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
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
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Producto?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          fetchProduct();
        });
      }
    });
  };

  // Update ---> POS PRODUCTO SUSTITUTOS
  const createProductoSustito = () => {
    jezaApi.post(`ProductoSustituto?id_Producto=${productoSustitutoForm.id_Producto}&clave_real=${productoSustitutoForm.clave_real}`).then(() => {
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
    { id: "costo_unitario", header: "Costo unitario", accessorFn: (row) => row.costo_unitario, size: 5 },
    { id: "precio", header: "Precio", accessorFn: (row) => row.precio, size: 5 },
    { id: "inventariable", header: "Inventariable", accessorFn: (row) => row.inventariable, size: 5 },
    { id: "es_producto", header: "Es producto", accessorFn: (row) => row.es_producto, size: 5 },
    { id: "es_servicio", header: "Es servicio", accessorFn: (row) => row.es_servicio, size: 5 },
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
                <h1> Productos </h1>
                <AiOutlineShoppingCart size={30}></AiOutlineShoppingCart>
              </div>

              <br />
              <br />
              <Container className="d-flex ">
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  <Button
                    style={{ marginLeft: "auto" }}
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
              </Container>
              <br />
              <br />
            </Container>
            <br />
            <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />

            <div style={{ width: "100%" }}>
              <MaterialReactTable columns={columns} data={dataProductos} initialState={{ density: "compact" }} />
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
                        <option value={0}>-Selecciona Area-</option>
                        {dataAreas.map((area) => (
                          <option value={area.area}>{area.descripcion}</option>
                        ))}
                      </Input>
                      <br />

                      <Label>Departamento:</Label>
                      <Input type="select" name="depto" id="exampleSelect" value={form.depto} onChange={handleChange}>
                        <option value={0}>-Selecciona departamento-</option>
                        {dataDeptosFiltrado.map((depto: Departamento) => (
                          <option value={depto.depto}>{depto.descripcion}</option>
                        ))}
                      </Input>
                      <br />
                      <Label>Clase:</Label>
                      <Input type="select" name="clase" id="exampleSelect" value={form.clase} onChange={handleChange}>
                        <option value={0}>-Selecciona Clase-</option>
                        {dataClasesFiltrado.map((depto: Clase) => (
                          <option value={depto.clase}>{depto.descripcion}</option>
                        ))}
                      </Input>
                      <br />
                      <Label>Marca:</Label>
                      <Input type="select" name="idMarca" id="exampleSelect" value={form.idMarca} onChange={handleChange}>
                        <option value={0}>-Selecciona marca-</option>
                        {dataMarcas.map((marca) => (
                          <option value={marca.id}>{marca.marca}</option>
                        ))}
                      </Input>

                      <div style={{ paddingBottom: 25 }}></div>
                      <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripción:" value={form.descripcion} />
                      <div style={{ paddingBottom: 0 }}></div>
                      <CFormGroupInput handleChange={handleChange} inputName="clave_prod" labelName="Clave producto:" value={form.clave_prod} />
                    </Col>
                    <Col>
                      <CFormGroupInput handleChange={handleChange} inputName="tiempo" labelName="Tiempo:" type="number" />
                      <CFormGroupInput handleChange={handleChange} inputName="comision" labelName="Comisión:" type="number" />
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
                        <option value={0}>--Selecciona el proveedor--</option>
                        {dataProveedores.map((proveedor) => (
                          <option value={proveedor.id}>{proveedor.nombre}</option>
                        ))}
                      </Input>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="descripcion_corta"
                        labelName="Descripción corta:"
                        value={form.descripcion_corta}
                      />

                      <CFormGroupInput handleChange={handleChange} inputName="observacion" labelName="Observación:" value={form.observacion} />
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
                        <input type="checkbox" onChange={handleChange2} name="inventariable" checked={form.inventariable} disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Inventariable?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.controlado} onChange={handleChange2} name="controlado" disabled={isDisabled} />
                        <span className="checkmark"></span>
                        Controlado
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.es_producto} onChange={handleChange2} name="es_producto" disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Es producto?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.es_servicio} onChange={handleChange2} name="es_servicio" disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Es servicio?
                      </label>
                    </Col>
                    <Col sm="6">
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange2} name="es_fraccion" checked={form.es_fraccion} disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Es fracción?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange2} name="obsoleto" checked={form.obsoleto} disabled={isDisabled} />
                        <span className="checkmark"></span>
                        Obsoleto
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange2} name="es_insumo" checked={form.es_insumo} disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Es insumo?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.es_kit} onChange={handleChange2} name="es_kit" disabled={isDisabled} />
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
                      <CFormGroupInput type="number" handleChange={handleChange} inputName="tasa_iva" labelName="Tasa IVA:" />
                      <CFormGroupInput type="number" handleChange={handleChange} inputName="costo_unitario" labelName="Costo unitario:" />

                      <Label>Unidad de medida:</Label>
                      <Input type="select" name="unidad_medida" id="exampleSelect" value={form.unidad_medida} onChange={handleChange}>
                        <option value={0}>-Selecciona unida medida-</option>
                        {dataUnidadMedida.map((medida: UnidadMedidaModel) => (
                          <option value={medida.id}>{medida.descripcion}</option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm="6">
                      <CFormGroupInput type="number" handleChange={handleChange} inputName="tasa_ieps" labelName="Tasa IEPS:" />
                      <CFormGroupInput type="number" handleChange={handleChange} inputName="precio" labelName="Precio:" />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
                        inputName="unidad_paq"
                        labelName="Unidad paquete compra:"
                        value={form.unidad_paq}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
                        inputName="unidad_paq_traspaso"
                        labelName="Unidad paquete traspaso:"
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
                        <CFormGroupInput type="number" handleChange={handleChange} inputName="precio_promocion" labelName="Precio promoción:" />
                        <CFormGroupInput
                          type="number"
                          handleChange={handleChange}
                          inputName="porcentaje_promocion"
                          labelName="Porcentaje promoción:"
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
                        <Input type="datetime-local" onChange={handleChange} name="fecha_final" defaultValue={form.fecha_final} />
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
              </Nav>
              <TabContent activeTab={activeTab}>
                <br />
                <TabPane tabId="1">
                  <Row>
                    <Col>
                      <Label>Área:</Label>
                      <Input type="select" name="area" id="exampleSelect" value={form.area} onChange={handleChange}>
                        <option value={0}>-Selecciona Area-</option>
                        {dataAreas.map((area) => (
                          <option value={area.area}>{area.descripcion}</option>
                        ))}
                      </Input>
                      <br />
                      <Label>Clase:</Label>
                      <Input type="select" name="clase" id="exampleSelect" value={form.clase} onChange={handleChange}>
                        <option value={0}>-Selecciona Clase-</option>
                        {dataClasesFiltrado.map((depto: Clase) => (
                          <option value={depto.clase}>{depto.descripcion}</option>
                        ))}
                      </Input>
                      <div style={{ paddingBottom: 25 }}></div>
                      <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripción:" value={form.descripcion} />
                      <div style={{ paddingBottom: 0 }}></div>
                      <CFormGroupInput handleChange={handleChange} inputName="clave_prod" labelName="Clave Producto:" value={form.clave_prod} />
                      <CFormGroupInput handleChange={handleChange} inputName="tiempo" labelName="Tiempo:" value={form.tiempo} type="number" />
                      <CFormGroupInput handleChange={handleChange} inputName="comision" labelName="Comisión:" value={form.comision} type="number" />
                    </Col>

                    <Col>
                      <Label>Departamento:</Label>
                      <Input type="select" name="depto" id="exampleSelect" value={form.depto} onChange={handleChange}>
                        <option value={0}>-Selecciona departamento-</option>
                        {dataDeptosFiltrado.map((depto: Departamento) => (
                          <option value={depto.depto}>{depto.descripcion}</option>
                        ))}
                      </Input>
                      <br />
                      <Label>Marca:</Label>
                      <Input type="select" name="idMarca" id="exampleSelect" value={form.idMarca} onChange={handleChange}>
                        <option value={0}>-Selecciona Marca-</option>
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
                        <option value={0}>--Selecciona el proveedor--</option>
                        {dataProveedores.map((proveedor: Proveedor) => (
                          <option value={proveedor.id}> {proveedor.nombre} </option>
                        ))}
                      </Input>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="descripcion_corta"
                        labelName="Descripción corta:"
                        value={form.descripcion_corta}
                      />
                      <CFormGroupInput handleChange={handleChange} inputName="observacion" labelName="Observación:" value={form.observacion} />
                      <Label>Unidad de medida:</Label>
                      <Input type="select" name="unidad_medida" id="exampleSelect" value={form.unidad_medida} onChange={handleChange}>
                        <option value={0}>-Selecciona unida medida-</option>
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
                        <input type="checkbox" onChange={handleChange2} name="inventariable" checked={form.inventariable} disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Inventariable?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.controlado} onChange={handleChange2} name="controlado" disabled={isDisabled} />
                        <span className="checkmark"></span>
                        Controlado
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.es_producto} onChange={handleChange2} name="es_producto" disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Es producto?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.es_servicio} onChange={handleChange2} name="es_servicio" disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Es servicio?
                      </label>
                    </Col>
                    <Col sm="6">
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange2} name="es_fraccion" checked={form.es_fraccion} disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Es fracción?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange2} name="obsoleto" checked={form.obsoleto} disabled={isDisabled} />
                        <span className="checkmark"></span>
                        Obsoleto
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange2} name="es_insumo" checked={form.es_insumo} disabled={isDisabled} />
                        <span className="checkmark"></span>
                        ¿Es insumo?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.es_kit} onChange={handleChange2} name="es_kit" disabled={isDisabled} />
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
                      <CFormGroupInput type="number" handleChange={handleChange} inputName="tasa_iva" labelName="Tasa IVA:" value={form.tasa_iva} />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
                        inputName="costo_unitario"
                        labelName="Costo unitario:"
                        value={form.costo_unitario}
                      />
                    </Col>
                    <Col sm="6">
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
                        inputName="tasa_ieps"
                        labelName="Tasa IEPS:"
                        value={form.tasa_ieps}
                      />
                      <CFormGroupInput type="number" handleChange={handleChange} inputName="precio" labelName="Precio:" value={form.precio} />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
                        inputName="unidad_paq"
                        labelName="Unidad paquete compra:"
                        value={form.unidad_paq}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
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
                          handleChange={handleChange}
                          inputName="precio_promocion"
                          labelName="Precio promoción:"
                          value={form.precio_promocion}
                        />
                        <CFormGroupInput
                          type="number"
                          handleChange={handleChange}
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
                        <Input type="datetime-local" onChange={handleChange} inputName="fecha_final" value={form.fecha_final} />
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
          <CButton color="primary" onClick={editar} text="Actualizar producto" />

          <CButton
            color="danger"
            onClick={() => {
              cerrarModalActualizar();
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
                      onChange={(e) => setProductoSustitutoForm({ ...ProductoSustitutoForm, clave_real: e.target.value })}
                      value={ProductoSustitutoForm.clave_real}
                      placeholder="Ingrese clave real"
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
                      <th>Claves producto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* a partir de aqui se van a mostrar los registros de la base */}
                    {data.map((dato: ProdSustituto) => (
                      <tr key={dato.id}>
                        <td> {dato.id_Producto}</td>
                        <td align="center">{dato.clave_real}</td>
                        <td align="center">
                          <AiFillDelete color="lightred" onClick={() => eliminarSustituto(dato)} size={23}></AiFillDelete>
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
    </>
  );
}

export default Productos;
