import React, { useState, useEffect, useRef } from "react";
import { AiFillEdit, AiFillDelete, AiOutlineSelect } from "react-icons/ai";
import {
  Row,
  Container,
  Input,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Col,
  Button,
  Card,
  InputGroup,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { Usuario } from "../../models/Usuario";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { useAlmacen } from "../../hooks/getsHooks/useAlmacen";
import { Sucursal } from "../../models/Sucursal";
import { Almacen } from "../../models/Almacen";
import { Traspaso, TraspasoBusqueda, TraspasoGet } from "../../models/Traspaso";
import TableProductosSalidas from "./components/TableProductosSalidas";
import { useTraspaso } from "../../hooks/getsHooks/useTraspaso";
import { useReactToPrint } from "react-to-print";
import { useTraspasoBusqueda } from "../../hooks/getsHooks/useTraspasoBusqueda";
import Swal from "sweetalert2";
import { useProductos } from "../../hooks/getsHooks/useProductos";
import { UserResponse } from "../../models/Home";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useNavigate } from "react-router-dom";
import { BiTag } from "react-icons/bi"; //PARA BOTÓN NUEVO
import { BiAddToQueue } from "react-icons/bi";
import { CgPlayListCheck } from "react-icons/cg";
import { BiSearchAlt } from "react-icons/bi";
import { BiExit } from "react-icons/bi";

function TraspasoSalida() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_trasSalida_view`);

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
  const [productoSelected, setProductoSelected] = useState<String[]>([]);
  // const { dataComprasGeneral, fetchCompras } = useComprasV3(dataCompras.idProveedor, idSeleccionado);

  // useEffect(() => {
  //   const item = localStorage.getItem("userLogged");
  //   if (item !== null) {
  //     const parsedItem = JSON.parse(item);
  //     setDataUsuarios(parsedItem);
  //     console.log({ parsedItem });
  //   }
  // }, []);
  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ parsedItem });
    }
  }, []);
  const [dataUsuarios, setDataUsuarios] = useState<Usuario[]>([]);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  const { dataProductos, setDataProductos, fetchProduct } = useProductos();
  const [informative, setInformative] = useState({
    totalCantidad: 0,
    totalClaves: 0,
  });

  const [form, setForm] = useState<Traspaso>({
    cia: 2,
    sucursal: 0,
    folio: "",
    fecha: "",
    clave_prod: "",
    cantidad: "",
    costo: "",
    precio: "",
    suc_origen: 0,
    suc_destino: 0,
    usuario: "",
    id: 0,
    idProducto: "",
    almacenOrigen: 0,
    almacenDestino: 0,
  });

  const [modalResumen, setModalResumen] = useState<boolean>(false);
  const [modalResumenEdit, setModalResumenEdit] = useState<boolean>(false);
  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
  const [modalOpen3, setModalOpen3] = useState<boolean>(false);
  // const productoSelect = useState("")

  const { dataSucursales } = useSucursales();
  const { dataAlmacenes } = useAlmacen();

  const DataTableHeader = [
    "",
    "Folio",
    "Sucursal destino",
    "Fecha",
    "Responsable traspaso",
    "Almacen destino",
    "Almacen origen",
  ];
  const DataTableHeaderPrincipal = [
    "Clave producto",
    "Producto",
    "Cantidad",
    "Unidad de medida",
    "Responsable traspaso",
    "Acciones",
  ];

  const mostrarModalActualizar = (dato: Traspaso) => {
    setForm({ ...dato, suc_destino: form.suc_destino, suc_origen: form.suc_origen, sucursal: form.sucursal });
    setModalResumenEdit(true);
  };
  const { dataTraspasos, fetchTraspasos } = useTraspaso({
    sucursal: form.suc_destino,
    folio: form.folio,
    sucursal_origen: dataUsuarios2 && dataUsuarios2.length > 0 ? dataUsuarios2[0].sucursal : 0,
  });

  const postTraspasoSalida = async () => {
    const permiso = await filtroSeguridad("TRASP_SALIDA_ADD");
    if (permiso === false) {
      return;
    }
    jezaApi
      .post("/Traspaso", null, {
        params: {
          cia: dataUsuarios2[0]?.idCia,
          sucursal: dataUsuarios2 ? dataUsuarios2[0].sucursal : 0,
          clave_prod: form.clave_prod,
          costo: form.costo,
          fecha: fechaFormateada,
          folio: 0,
          cantidad: form.cantidad,
          precio: form.precio,
          suc_origen: dataUsuarios2 ? dataUsuarios2[0].sucursal : 0,
          suc_destino: form.suc_destino,
          usuario: dataUsuarios2 ? dataUsuarios2[0].id : 0,
          almacenOrigen: form.almacenOrigen,
          almacenDestino: form.almacenDestino,
        },
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          text: "Registro exitoso",
        });
        fetchTraspasos();
        setForm({ ...form, cantidad: 0, clave_prod: "", costo: 0, precio: 0, d_producto: "" });
      })
      .catch((e) => console.log(e));
  };

  const putTraspasoSalida = () => {
    jezaApi
      .put("Traspaso", null, {
        params: {
          id: form.id,
          fecha: form.fecha,
          clave_prod: form.idProducto,
          cantidad: form.cantidad,
          costo: form.costo,
          precio: form.precio,
          usuario: dataUsuarios2[0].id,
        },
      })
      .then(() => {
        fetchTraspasos();
        Swal.fire({
          icon: "success",
          text: "Actualización exitosa",
        });
      })
      .catch(() => alert("No realizado"));
  };

  const putFinalizaTraspasoSalida = async () => {
    const permiso = await filtroSeguridad("TRASP_SALIDA_FIN");
    if (permiso === false) {
      return;
    }
    jezaApi
      .put(
        `/TraspasoFinaliza?sucursal_origen=${dataUsuarios2[0].sucursal}&sucursal_destino=${form.suc_destino}&usuario=${dataUsuarios2[0].id}`
      )
      .then((response) => {
        fetchTraspasos();
        Swal.fire({
          icon: "success",
          text: "Traspaso finalizado con éxito",
          confirmButtonColor: "#3085d6",
        });
        setForm({
          cia: 0,
          sucursal: 0,
          folio: "",
          fecha: "",
          clave_prod: "",
          cantidad: "",
          costo: "",
          precio: "",
          suc_origen: 0,
          suc_destino: 0,
          usuario: "",
          id: 0,
          idProducto: "",
          almacenOrigen: 0,
          almacenDestino: 0,
        });
      })
      .catch((error) => console.log(error));
  };

  const getTraspasoBusqueda = async () => {
    const permiso = await filtroSeguridad("TRASP_SALIDA_GET");
    if (permiso === false) {
      return;
    }
    jezaApi
      .get(
        `/TraspasoBusqueda?folio=${!fechaSeleccionada.folio ? "%" : fechaSeleccionada.folio}&sucursal=${
          dataUsuarios2[0]?.sucursal
        }&sucursal_destino=${fechaSeleccionada.suc_destino === 0 ? "%" : fechaSeleccionada.suc_destino}&f1=${
          fechaSeleccionada.f1 ? fechaSeleccionada.f1 : "20230701"
        }&f2=${fechaSeleccionada.f2 ? fechaSeleccionada.f2 : "20301212"}`
      )
      .then((response) => setDataTraspasoBusqueda2(response.data));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "almacenDestino" && Number(value) === Number(form.almacenOrigen)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No puede seleccionar los mismos almacenes, favor de intentarlo de nuevo`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    } else if (name === "almacenOrigen" && Number(value) === Number(form.almacenDestino)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No puede seleccionar los mismos almacenes, favor de intentarlo de nuevo`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    } else {
      setForm((prevState: Traspaso) => ({ ...prevState, [name]: value }));
    }
  };
  const handleChangeFechas = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFechaSeleccionada((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const [fechaHoy, setFechaHoy] = useState("");
  const [fechaFormateada, setFechaFormateada] = useState("");
  useEffect(() => {
    const obtenerFechaHoy = () => {
      const fecha = new Date();
      const opcionesFecha = { year: "numeric", month: "numeric", day: "numeric" };
      const fechaFormateada = fecha.toLocaleDateString(undefined, opcionesFecha);
      setFechaHoy(fechaFormateada);
    };

    obtenerFechaHoy();
    const ejecuciónFecha = getFormattedDate();
    setFechaFormateada(ejecuciónFecha);
  }, []);

  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [filtradoAlmacen, setFiltradoAlmacen] = useState([]);
  const [filtradoAlmacenFormateada, setFiltradoAlmacenFormateada] = useState([]);
  const [filtradoSucursales, setFiltradoSucursales] = useState([]);
  // FILTRADO ALMACENES
  useEffect(() => {
    const filtrado = dataAlmacenes.filter((data: Almacen) => data.sucursal === Number(form.suc_destino));
    setFiltradoAlmacen(filtrado);
    const filtradoFormateada = dataAlmacenes.filter((data: Almacen) => data.sucursal === dataUsuarios2[0].sucursal);
    setFiltradoAlmacenFormateada(filtradoFormateada);
  }, [form.suc_destino]);

  useEffect(() => {
    const filtradoSucursal = dataSucursales.filter((data: Sucursal) => data.sucursal !== dataUsuarios2[0].sucursal);
    setFiltradoSucursales(filtradoSucursal);
  }, [dataSucursales.length > 0]);

  const eliminar = (id, desc_prod) => {
    Swal.fire({
      title: "Seguro de eliminar?",
      text: `Producto: ${desc_prod}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Traspaso?id=${id}`).then(() => {
          fetchTraspasos();
        });

        Swal.fire("Eliminado!", "El producto ha sido removido de la lista", "success");
      }
    });
  };

  const [folioDesactivado, setFolioDesactivado] = useState(false);

  useEffect(() => {
    const ultimoFolio = dataTraspasos && dataTraspasos.length > 0 ? dataTraspasos[dataTraspasos.length - 1].folio : "";
    if (dataTraspasos && ultimoFolio) {
      setFolioDesactivado(true);
    } else {
      setFolioDesactivado(false);
    }
    setForm({ ...form, folio: ultimoFolio });
  }, [dataTraspasos]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState({
    f1: "",
    f2: "",
    suc_destino: 0,
    folio: "",
  });
  const { dataTraspasoBusqueda } = useTraspasoBusqueda({
    f1: fechaSeleccionada.f1,
    f2: fechaSeleccionada.f2,
    folio: form.folio,
    sucursal: form.sucursal,
    sucursal_destino: form.suc_destino,
  });
  useEffect(() => {
    const descripciones = dataTraspasos ? dataTraspasos.map((item) => item.clave_prod) : [];
    setProductoSelected(descripciones);
    const sumaCantidades = dataTraspasos !== null ? dataTraspasos.reduce((total, item) => total + item.cantidad, 0) : 0;
    // const ultimoDatoAlmacenDestino = dataTraspasos[dataTraspasos.length - 1].almacenDestino;
    // const ultimoDatoAlmacenOrigen = dataTraspasos[dataTraspasos.length - 1].almacenOrigen;
    // setForm({...form,almacenDestino: ultimoDatoAlmacenDestino,almacenOrigen:ultimoDatoAlmacenOrigen})
    setInformative({ totalCantidad: sumaCantidades, totalClaves: dataTraspasos.length });
  }, [dataTraspasos]);
  useEffect(() => {
    getTraspasoBusqueda();
  }, [fechaSeleccionada]);
  const InfoRow = () => {
    return (
      <Row>
        {/* <Col md={9}> */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1>
            {" "}
            Traspaso de salida <BiExit size={35} />
          </h1>
        </div>
        <br />
        <Row>
          <Col md="6">
            <Label>Sucursal destino:</Label>
            <Input
              disabled={Number(form.folio) !== 0 ? true : false}
              value={form.suc_destino}
              type="select"
              name="suc_destino"
              onChange={handleChange}
            >
              <option value={0}> Escoja una sucursal</option>
              {dataSucursales.map((option: Sucursal) => (
                <option key={option.id} value={Number(option.sucursal)}>
                  {option.nombre}
                </option>
              ))}
            </Input>
          </Col>

          <Col md="6">
            <Label>Almacén destino:</Label>
            <Input
              disabled={Number(form.folio) !== 0 ? true : false}
              value={form.almacenDestino}
              type="select"
              name="almacenDestino"
              onChange={handleChange}
            >
              <option value={0}> Escoja una almacén</option>
              {filtradoAlmacen.map((option: Almacen) => (
                <option key={option.id} value={option.id}>
                  {option.descripcion}
                </option>
              ))}
            </Input>
          </Col>

          <Col md="6">
            <Label>Almacén origen:</Label>
            <Input
              disabled={Number(form.folio) !== 0 ? true : false}
              type="select"
              value={form.almacenOrigen}
              name="almacenOrigen"
              onChange={handleChange}
            >
              <option value="0"> Escoja una almacen</option>
              {filtradoAlmacenFormateada.map((option: Almacen) => (
                <option key={option.almacen} value={option.id}>
                  {option.descripcion}
                </option>
              ))}
            </Input>
          </Col>
        </Row>
      </Row>
    );
  };
  const TableSalidas = () => {
    return (
      <>
        <h4>
          {Number(form.folio) > 0
            ? "Traspaso finalizado"
            : Number(form.folio) === 0 && dataTraspasos && dataTraspasos.length > 0
            ? "Traspaso en proceso"
            : ""}
        </h4>

        <br />
        <Table size="sm" striped={true} responsive={true} style={{ width: "100%", margin: "auto" }}>
          <thead>
            <tr>
              {DataTableHeaderPrincipal.map((valor) => (
                <th className="" key={valor}>
                  {valor}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTraspasos && dataTraspasos.length > 0
              ? dataTraspasos.map((dato: TraspasoGet, index) => (
                  <tr key={dato.id + index}>
                    <td>{dato.clave_prod}</td>
                    <td>{dato.d_producto}</td>
                    <td align="center">{dato.cantidad}</td>
                    <td align="center">{dato.d_unidadmedida}</td>
                    <td>{dato.usuarioTraspaso}</td>
                    <td style={{ width: 20 }} align="center">
                      {dato.folio > 0 ? (
                        <>
                          <AiFillEdit color="grey" className="mr-2" onClick={() => null} size={23}></AiFillEdit>
                          <AiFillDelete color="grey" onClick={() => null} size={23}></AiFillDelete>
                        </>
                      ) : (
                        <>
                          <AiFillEdit
                            className="mr-2"
                            onClick={() => mostrarModalActualizar(dato)}
                            size={23}
                          ></AiFillEdit>
                          <AiFillDelete
                            color="lightred"
                            onClick={async () => {
                              const permiso = await filtroSeguridad("ELIMINAR_TRASPASO_201223");
                              if (permiso === false) {
                                return; // Si el permiso es falso o los campos no son válidos, se sale de la función
                              } else {
                                eliminar(dato.id, dato.d_producto);
                              }
                            }}
                            size={23}
                          ></AiFillDelete>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>
      </>
    );
  };
  const InformativeInformation = () => {
    return (
      // <div
      //   className="d-flex flex-column justify-content-end align-items-end"
      //   style={{ position: "fixed", bottom: "7%", right: "10%", marginRight: "20px", zIndex: 1 }}
      // >
      <>
        {/* ... otros componentes y contenido ... */}
        <UncontrolledAccordion defaultOpen="1">
          <AccordionItem>
            <AccordionHeader targetId="2">Totales</AccordionHeader>
            <AccordionBody accordionId="2">
              <table width="100%">
                <tr>
                  <th>Total de claves</th>
                  <th>Total de productos</th>
                </tr>
                <tr>
                  <td>{informative.totalClaves}</td>
                  <td>{informative.totalCantidad}</td>
                </tr>
              </table>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>
      </>
    );
  };

  const GroupButtons = () => {
    // return (
    //   <div style={{ position: "fixed", bottom: 10, width: "100%", zIndex: 9999 }}>
    //     <div style={{ justifyContent: "space-evenly", alignContent: "space-evenly", display: "flex" }}>
    //       <Button
    //         disabled={Number(form.folio) > 0 || !dataTraspasos || dataTraspasos.length === 0}
    //         onClick={() => {
    //           putFinalizaTraspasoSalida();
    //         }}
    //         color="success"
    //       >
    //         Finalizar
    //       </Button>

    //       <TicketPrint>
    //         <>
    //           <br />
    //           <InfoRow></InfoRow>
    //           <br />
    //           <TableSalidas></TableSalidas>
    //           <br />
    //         </>
    //       </TicketPrint>
    //       <Button
    //         onClick={() => {
    //           setModalBusqueda(true);
    //           getTraspasoBusqueda();
    //         }}
    //       >
    //         Búsqueda
    //       </Button>
    //     </div>
    //   </div>
    // );
    return (
      // <div style={{ position: "fixed", bottom: 10, width: "100%", zIndex: 9999 }}>
      <Container>
        <div>
          <Button
            style={{ marginRight: 5 }}
            disabled={Number(form.folio) > 0 || !dataTraspasos || dataTraspasos.length === 0}
            onClick={() => {
              putFinalizaTraspasoSalida();
            }}
            color="success"
          >
            <CgPlayListCheck size={30} />
            Finalizar
          </Button>

          <TicketPrint>
            <>
              <br />
              <InfoRow></InfoRow>
              <br />
              <TableSalidas></TableSalidas>
              <br />
            </>
          </TicketPrint>

          <Button
            color="primary"
            onClick={() => {
              setModalBusqueda(true);
              getTraspasoBusqueda();
            }}
          >
            <BiSearchAlt size={30} />
            Búsqueda
          </Button>
        </div>
      </Container>
    );
  };
  interface TicketPrintProps {
    children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  }
  const TicketPrint: React.FC<TicketPrintProps> = ({ children }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    // return (
    //   <div>
    //     <div style={{ display: "none" }}>
    //       <div ref={componentRef}>{children}</div>
    //     </div>
    //     {children && (
    //       <Button color="primary" onClick={handlePrint}>
    //         Imprimir
    //       </Button>
    //     )}
    //   </div>
    // );
  };
  const [dataTraspasoBusqueda2, setDataTraspasoBusqueda2] = useState<TraspasoBusqueda[]>([]);

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        <InfoRow></InfoRow>
        <br />
        <div className="col align-self-start d-flex justify-content-end ">
          <Button
            style={{ marginRight: 5 }}
            color="success"
            disabled={Number(form.folio) > 0 ? true : false}
            onClick={() => {
              if (
                form.suc_destino === "0" ||
                form.almacenDestino.toString() === "0" ||
                form.almacenOrigen.toString() === "0"
              ) {
                Swal.fire({
                  icon: "info",
                  title: "Atención",
                  text: "Debe completar el formulario para realizar la función",
                });
              } else {
                setForm({ ...form, cantidad: 0, clave_prod: "", costo: 0, precio: 0, d_producto: "", d_existencia: 0 });
                setModalResumen(true);
              }
            }}
          >
            <BiAddToQueue size={30} />
            Agregar
          </Button>
          <Button
            color="primary"
            disabled={Number(form.folio) === 0 ? true : false}
            onClick={() => {
              setForm({
                ...form,
                folio: 0,
                suc_destino: 0,
                suc_origen: 0,
                almacenOrigen: 0,
              });
            }}
          >
            Nuevo
            <BiTag size={30} />
          </Button>
        </div>
        <TableSalidas></TableSalidas>
        <br />
        <InformativeInformation></InformativeInformation>
      </Container>
      <br />
      <br />
      <GroupButtons></GroupButtons>

      <Modal isOpen={modalResumen} size="xl">
        <ModalHeader>
          <div>
            <h3>Ingresar traspaso</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Label>Producto:</Label>
            <Row>
              <Col>
                <Input value={form.d_producto} disabled />
              </Col>
              <Col md={2}>
                <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Label>Existencias: </Label>
                <Input name="d_existencia" value={form.d_existencia} disabled onChange={handleChange} />
              </Col>
              <Col>
                <Label>Cantidad: </Label>
                <Input
                  type="number"
                  min="1.00"
                  step="0.01"
                  name="cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                  placeholder="Cantidad"
                />
              </Col>
            </Row>
            <br />
            {/* <Label>Precio: </Label>
            <Input name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" /> */}
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="primary"
            onClick={async () => {
              const permiso = await filtroSeguridad("INGRESA_TRASPASO_201223");
              if (permiso === false) {
                return; // Si el permiso es falso o los campos no son válidos, se sale de la función
              } else {
                if (form.cantidad == 0 || form.d_producto == "") {
                  Swal.fire({
                    icon: "info",
                    title: "Atención",
                    text: "No puede dejar campos vacios, ni valores en 0",
                  });
                } else if (Number(form.d_existencia) < Number(form.cantidad)) {
                  Swal.fire({
                    icon: "info",
                    title: "Atención",
                    text: "Cantidad es mayor a existencias ",
                  });
                } else {
                  postTraspasoSalida();
                }
              }
            }}
            text="Guardar"
          />
          <CButton
            color="danger"
            onClick={() => {
              setModalResumen(false);
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalBusqueda} size="xl">
        <ModalHeader>
          <div>
            <h3>Búsqueda</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col md={3}>
                <Label>Sucursal destino:</Label>
                <Input
                  value={fechaSeleccionada.suc_destino}
                  type="select"
                  name="suc_destino"
                  onChange={handleChangeFechas}
                >
                  <option value={0}> Escoja una sucursal</option>
                  {dataSucursales.map((option: Sucursal) => (
                    <option key={option.sucursal} value={Number(option.sucursal)}>
                      {option.nombre}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md={3}>
                <Label>Fecha inicio: </Label>
                <Input type="date" onChange={handleChangeFechas} name="f1" value={fechaSeleccionada.f1}></Input>
                <br />
              </Col>
              <Col md={3}>
                <Label>Fecha final: </Label>
                <Input type="date" onChange={handleChangeFechas} name="f2" value={fechaSeleccionada.f2}></Input>
                <br />
              </Col>
              <Col md={3}>
                <Label>Folio: </Label>
                <Input
                  type="text"
                  onChange={handleChangeFechas}
                  name="folio"
                  defaultValue={fechaSeleccionada.folio}
                ></Input>
                <br />
              </Col>
              <Col md={3}>
                <Button className="align-self-end" onClick={() => getTraspasoBusqueda()} color="primary">
                  Buscar
                </Button>
              </Col>
            </Row>

            <hr />
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    {DataTableHeader.map((valor) => (
                      <th className="" key={valor}>
                        {valor}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataTraspasoBusqueda2.map((traspaso) => (
                    <tr>
                      <td>
                        <AiOutlineSelect
                          onClick={() => {
                            setForm({
                              ...form,
                              folio: traspaso.folio ? traspaso.folio : 0,
                              suc_destino: traspaso.suc_destino,
                              suc_origen: traspaso.suc_origen,
                              almacenDestino: traspaso.almacenDestino,
                              almacenOrigen: traspaso.almacenOrigen,
                            });
                            setModalBusqueda(false);
                          }}
                        ></AiOutlineSelect>
                      </td>

                      <td>{traspaso.folio}</td>
                      <td>{traspaso.d_sucDestino}</td>
                      <td>{traspaso.fecha.split("T")[0]}</td>
                      <td>{traspaso.usuarioTraspaso}</td>
                      <td>{traspaso.d_almacenDestino}</td>
                      <td>{traspaso.d_almacenOrigen}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton color="danger" onClick={() => setModalBusqueda(false)} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen3} size="lg">
        <ModalHeader></ModalHeader>
        <ModalBody style={{ maxHeight: "500px", overflowY: "auto" }}>
          <TableProductosSalidas
            productoSelected={productoSelected}
            setForm={setForm}
            form={form}
            setModalOpen2={setModalOpen3}
            sucursal={dataUsuarios2[0]?.sucursal}
            cia={dataUsuarios2[0]?.idCia}
          />
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpen3(false)} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* <Modal isOpen={modalOpen3} size="lg">
        <ModalHeader></ModalHeader>
        <ModalBody>
          <TableProductosSalidas setForm={setForm} form={form} setModalOpen2={setModalOpen3}></TableProductosSalidas>
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpen3(false)} text="Salir" />
        </ModalFooter>
      </Modal> */}

      <Modal isOpen={modalResumenEdit} size="xl">
        <ModalHeader>
          <div>
            <h3>Ingresar traspaso</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Label>Producto:</Label>
            <Row>
              <Col>
                {/* <Input disabled defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} /> */}
                <Input value={form.d_producto} disabled />
              </Col>
              <Col md={2}>
                {/* <Button onClick={() => setModalOpen3(true)}>Elegir</Button> */}
                <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
              </Col>
            </Row>
            <br />

            <Row>
              <Col>
                <Label>Existencias: </Label>
                <Input name="d_existencia" value={form.d_existencia} disabled onChange={handleChange} />
              </Col>
              <Col>
                <Label>Cantidad: </Label>
                <Input
                  type="number"
                  min="1.00"
                  step="0.01"
                  name="cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                  placeholder="Cantidad"
                />
              </Col>
            </Row>
            <br />
            {/* <Label>Precio: </Label>
            <Input name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" /> */}
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="primary"
            onClick={async () => {
              const permiso = await filtroSeguridad("EDITAR_TRASPASO_201213");
              if (permiso === false) {
                return; // Si el permiso es falso o los campos no son válidos, se sale de la función
              } else {
                putTraspasoSalida();
                setModalResumenEdit(false);
              }
            }}
            text="Guardar"
          />
          <CButton
            color="danger"
            onClick={() => {
              setModalResumenEdit(false);
              console.log(dataUsuarios);
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default TraspasoSalida;
