import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete, AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Container,
  Col,
  Card,
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
import SidebarHorizontal from "../../components/SidebarHorizontal";
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
import "../../../css/reportes.css";
import { Button, ButtonGroup } from "@mui/material";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import Swal from "sweetalert2";

function Productos() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar } = useModalHook();
  const { dataProductos, fetchProduct, setDataProductos } = useProductos();

  const { dataMarcas } = useMarcas();

  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");

  const { dataAreas } = useAreas();
  const { dataDeptos } = useDeptos();
  const { dataClases } = useClases();
  const { dataProveedores } = useProveedor();

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 150; // Number of items to display per page
  const totalItems = dataProductos.length; // Total number of items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToDisplay = dataProductos.slice(startIndex, endIndex);

  const [data, setData] = useState<ProdSustituto[]>([]); /* setear valores  */

  const [productoSustitutoForm, setProductoSustitutoForm] = useState<ProdSustituto>({
    clave_real: "",
    id_Producto: 0,
    d_Producto: "",
  });

  const [productoSustitutoFormTemporal, setProductoSustitutoFormTemporal] = useState<any>({
    clave_real: "",
    id_Producto: 0,
    d_Producto: "",
  });

  const DataTableHeader = ["Id", "Descripcion", "Marca", "Costo", "Precio", "Inv", "Producto", "Servicio", "Acciones"];

  const mostrarModalActualizar = (dato: Producto) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const mostrarModalUpdate = (dato: Producto, id: number) => {
    setProductoSustitutoForm({ id_Producto: dato.id, d_Producto: dato.descripcion });
    console.log({ dato });
    setModalUpdate(true);
    getProductoSustito(id);
  };

  const editar = (dato: any) => {
    jezaApi
      .put(`/Producto`, null, {
        params: {
          id: form.id,
          clave_prod: form.clave_prod,
          descripcion: form.descripcion,
          descripcion_corta: form.descripcion_corta,
          sucursal_origen: form.sucursal_origen,
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
          fecha_inicio: form.fecha_inicio,
          fecha_final: form.fecha_final,
          unidad_medida: Number(form.unidad_medida),
          clave_prov: Number(form.clave_prov),
          tiempo: Number(form.tiempo),
          comision: Number(form.comision),
          productoLibre: form.productoLibre,
          fecha_act: "2023-05-30T18:38:35",
          fecha_alta: "2023-05-30T18:38:35",
        },
      })
      .then(() => {
        setVisible(true);
        console.log("realizado");
        fetchProduct();
        setTimeout(() => {
          setVisible(false);
        }, 3000);
      })
      .then((e) => console.log(e));
    setModalActualizar(false);
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

  const insertar = () => {
    jezaApi.post("/Medico", {}).then(() => {});
    setModalInsertar(false);
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

  // Update ---> PUT PRODUCTO SUSTITUTO
  const updateProductoSustito = () => {
    jezaApi
      .put(
        `ProductoSustituto?id=${productoSustitutoForm.id}&id_Producto=${productoSustitutoForm.id_Producto}&clave_real=${productoSustitutoForm.clave_real}`
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          text: "Registro realizado con éxito",
          confirmButtonColor: "#3085d6",
        });
        setModalUpdate(!modalUpdate); //cierra modal
      });
  };

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

  // LEER INFORMACIÓN ---> GET PRODUCTO SUSTITUTO
  const getProductoSustito = (idProductoSustito: number) => {
    jezaApi.get(`ProductoSustituto?id=${idProductoSustito}`).then((response) => {
      setData(response.data);
      const filteredData = response.data.filter((item) => item.id_Producto === idProductoSustito);
      setProductoSustitutoFormTemporal(filteredData);
      console.log({ response });
    });
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

  const columns: CustomColumnDef[] = [
    {
      id: "actions",
      header: "Acciones",
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
          <MdProductionQuantityLimits
            className="mr-2"
            onClick={() => {
              mostrarModalUpdate(row.original, row.original.id);
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
    { id: "costo_unitario", header: "Costo Unitario", accessorFn: (row) => row.costo_unitario, size: 5 },
    { id: "precio", header: "Precio", accessorFn: (row) => row.precio, size: 5 },
    { id: "inventariable", header: "Inventariable", accessorFn: (row) => row.inventariable, size: 5 },
    { id: "es_producto", header: "Es Producto", accessorFn: (row) => row.es_producto, size: 5 },
    { id: "es_servicio", header: "Es Servicio", accessorFn: (row) => row.es_servicio, size: 5 },
  ];
  // const columns = [
  //   {
  //     accessorKey: "id",
  //     header: "ID",
  //     width: undefined,
  //   },
  //   {
  //     accessorKey: "descripcion",
  //     header: "Descripcion",
  //     width: undefined,
  //   },
  //   {
  //     accessorKey: "marca",
  //     header: "Marca",
  //     width: undefined,
  //   },

  //   {
  //     accessorKey: "costo_unitario",
  //     header: "Costo unitario",
  //     width: undefined,
  //   },

  //   {
  //     accessorKey: "precio",
  //     header: "Precio",
  //     width: undefined,
  //   },
  //   {
  //     accessorKey: "inventariable",
  //     header: "Inventariable",
  //     width: undefined,
  //   },
  //   {
  //     accessorKey: "es_producto",
  //     header: "Es producto",
  //     width: undefined,
  //   },
  //   {
  //     accessorKey: "es_servicio",
  //     header: "Es servicio",
  //     width: undefined,
  //   },

  //   // Agrega más columnas aquí con sus respectivos anchos
  // ];

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
              <br />
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
                      handleNav();
                    }}
                  >
                    Crear sucursal
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
              <MaterialReactTable columns={columns} data={itemsToDisplay} initialState={{ density: "compact" }} />
            </div>
          </Col>
        </Row>
      </Container>
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
                    Datos Comerciales
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
                      <Label>Area:</Label>
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
                      <CFormGroupInput handleChange={handleChange} inputName="observacion" labelName="Observación:" value={form.unidad_medida} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <h3> Marca producto: </h3>
                  <br />
                  <Row>
                    <Col sm="6">
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange} name="inventariable" checked={form.inventariable} />
                        <span className="checkmark"></span>
                        ¿Inventariable?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.controlado} onChange={handleChange} name="controlado" />
                        <span className="checkmark"></span>
                        Controlado
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.es_producto} onChange={handleChange} name="es_producto" />
                        <span className="checkmark"></span>
                        ¿Es producto?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.es_servicio} onChange={handleChange} name="es_servicio" />
                        <span className="checkmark"></span>
                        ¿Es servicio?
                      </label>
                    </Col>
                    <Col sm="6">
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange} name="es_fraccion" checked={form.es_fraccion} />
                        <span className="checkmark"></span>
                        ¿Es fracción?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange} name="obsoleto" checked={form.obsoleto} />
                        <span className="checkmark"></span>
                        Obsoleto
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" onChange={handleChange} name="es_insumo" checked={form.es_insumo} />
                        <span className="checkmark"></span>
                        ¿Es insumo?
                      </label>
                      <br />
                      <br />
                      <label className="checkbox-container">
                        <input type="checkbox" checked={form.es_kit} onChange={handleChange} name="es_kit" />
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
                      <CFormGroupInput type="number" handleChange={handleChange} inputName="tasa_iva" labelName="Tasa iva,:" value={form.tasa_iva} />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
                        inputName="costo_unitario"
                        labelName="Costo unitario:"
                        value={form.costo_unitario}
                      />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
                        inputName="unidad_medida"
                        labelName="Unidad medida:"
                        value={form.unidad_medida}
                      />
                    </Col>
                    <Col sm="6">
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
                        inputName="tasa_ieps"
                        labelName="Tasa ieps:"
                        value={form.tasa_ieps}
                      />
                      <CFormGroupInput type="number" handleChange={handleChange} inputName="precio" labelName="Precio:" value={form.precio} />
                      <CFormGroupInput
                        type="number"
                        handleChange={handleChange}
                        inputName="unidad_paq"
                        labelName="Unidad paquete:"
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
                        <Label> Fecha Inicio: </Label>
                        <Input
                          style={{ marginBottom: 15 }}
                          type="datetime-local"
                          onChange={handleChange}
                          inputName="fecha_inicio"
                          value={form.fecha_inicio}
                        />
                        <Label> Fecha Final: </Label>
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
          <CButton color="success" onClick={() => editar(form)} text="Cancelar" />

          <CButton
            color="danger"
            onClick={() => {
              cerrarModalActualizar();
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>
      {/* ACTUALIZAR PRODUCTO SUSTITUTO */}
      <Modal isOpen={modalUpdate}>
        {
          productoSustitutoFormTemporal > 0 ? (
            <ModalHeader>
              <h3>Editar producto sustituto: </h3>
            </ModalHeader>
          ) : (
            <ModalHeader>
              <h3>Crear producto sustituto: </h3>
            </ModalHeader>
          )

          // <ModalHeader>Crear producto sustituto {productoSustitutoForm.d_Producto} </ModalHeader>
        }
        <ModalBody>
          <span style={{ color: "grey", fontWeight: "initial", fontSize: "1.1em" }}>{productoSustitutoForm.d_Producto}</span>
          <br />
          <br />
          <Label> Clave real: </Label>
          <Input
            type="text"
            name={"descripcion"}
            onChange={(e) => setProductoSustitutoForm({ ...productoSustitutoForm, clave_real: e.target.value })}
            value={productoSustitutoForm.clave_real}
            placeholder="Clave real"
          ></Input>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={handleActionProductoSustituo} text="Guardar" />

          <CButton color="danger" onClick={() => setModalUpdate(false)} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Productos;
