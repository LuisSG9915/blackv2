import React, { useState, useEffect, useRef } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { Sucursal } from "../../models/Sucursal";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Almacen } from "../../models/Almacen";
import { Usuario } from "../../models/Usuario";
import {
  Button,
  Col,
  Container,
  FormGroup,
  ModalBody,
  InputGroup,
  ModalHeader,
  Modal,
  Input,
  ModalFooter,
  Label,
  Row,
  Table,
  Card,
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Spinner,
} from "reactstrap";
import { AiOutlineUser, AiFillEdit, AiFillDelete, AiOutlineSelect } from "react-icons/ai";
import { BsScrewdriver } from "react-icons/bs";
import TableProductosMovimientos from "./components/TableProductosMovimientos";
import { MovimientoResponse } from "../../models/MovimientoDiversoModel";
import { useAlmacen } from "../../hooks/getsHooks/useAlmacen";
import { useMovimientos } from "../../hooks/getsHooks/useMovimientos";
import { Movimiento } from "../../models/Movimiento";
import { useAjuste } from "../../hooks/getsHooks/useAjuste";
import { jezaApi } from "../../api/jezaApi";
import { useAjusteBusqueda } from "../../hooks/getsHooks/useAjusteBusqueda";
import { UserResponse } from "../../models/Home";
import Swal from "sweetalert2";
import { BiAddToQueue } from "react-icons/bi"; //PARA BOTÓN AGREGAR
import { BiSearchAlt } from "react-icons/bi"; //PARA BOTÓN BUSQUEDA
import { CgPlayListCheck } from "react-icons/cg"; //PARA BOTÓN FINALIZAR
import { BiTag } from "react-icons/bi"; //PARA BOTÓN NUEVO
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useNavigate } from "react-router-dom";

// VscNewFile

function MovimientoDiversos() {
  const { filtroSeguridad, session } = useSeguridad();

  const [showView, setShowView] = useState(true);

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      // Llamar a getPermisoPantalla después de que los datos se hayan establecido
      getPermisoPantalla(parsedItem);
    }
  }, []);

  const getPermisoPantalla = async (userData) => {
    try {
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_ajustDiversos_view`);

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

  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  const { dataAlmacenes } = useAlmacen();
  const { dataMovimientos } = useMovimientos();
  const [formFechas, setFormFechas] = useState({
    f1: "",
    f2: "",
  });
  const { dataAjustesBusquedas, fetchAjustesBusquedas } = useAjusteBusqueda({
    f1: formFechas.f1,
    f2: formFechas.f2,
    sucursal: dataUsuarios2[0]?.sucursal,
  });

  // SE MAPEA LA DATA Y EL SET DE USEGENTLEMANCONTEXT QUE VIENE DE MI CONTEXT
  const [form, setform] = useState<Movimiento>({
    cia: 26,
    sucursal: 21,
    folio: 0,
    fecha: "",
    clave_prod: 0,
    tipo_movto: 0,
    cantidad_entrada: 0,
    cantidad_salida: 0,
    costo: 0,
    precio: 0,
    usuario: 0,
    almacen: 0,
    observacion: "",
    d_existencia: 0,
  });

  const { dataAjustes, fetchAjustes, setAjustes } = useAjuste({ folio: form.folio, sucursal: dataUsuarios2[0]?.sucursal });

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
    }
  }, []);

  useEffect(() => {
    const obtenerFechaHoy = () => {
      const fecha = new Date();
      const opcionesFecha = { year: "numeric", month: "numeric", day: "numeric" };
      const fechaFormateada = fecha.toLocaleDateString(undefined, opcionesFecha);
    };

    obtenerFechaHoy();
  }, []);
  const [deshabiliteadoExistencia, setDeshabiliteadoExistencia] = useState(false);
  const [deshabiliteadoSalida, setDeshabiliteadoSalida] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setform((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };
  const handleChangeFecha = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "f2") {
      let [year2, month2, day2] = value.split("-");
      month2 = String(Number(month2) + 1).padStart(2, "0");
      let f2_modificada = [year2, month2, day2].join("-");

      console.log("Fecha 1 modificada:", f2_modificada);
      setFormFechas((prevState: any) => ({ ...prevState, ["f2"]: f2_modificada }));
    } else {
      setFormFechas((prevState: any) => ({ ...prevState, [name]: value }));
    }
    console.log(formFechas);
  };

  const [modalResumen, setModalResumen] = useState<boolean>(false);
  const [modalResumenEditar, setModalResumenEditar] = useState<boolean>(false);
  const [modalProductos, setModalProductos] = useState<boolean>(false);
  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
  const DataTableHeader = ["Acción", "Folio", "Tipo de movimiento", "Número de items", "Responsable de ajuste", "Estado"];
  const [filtradoAlmacenFormateada, setFiltradoAlmacenFormateada] = useState([]);

  useEffect(() => {
    const filtradoFormateada = dataAlmacenes.filter((data: Almacen) => data.sucursal === dataUsuarios2[0]?.sucursal);
    setFiltradoAlmacenFormateada(filtradoFormateada);
  }, [dataAlmacenes.length > 0]);

  const postMovimiento = async () => {
    const permiso = await filtroSeguridad("AJUSTE_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(form);
    jezaApi
      .post("/Ajuste", null, {
        params: {
          cia: dataUsuarios2[0]?.idCia,
          sucursal: dataUsuarios2[0]?.sucursal,
          folio: 0,
          fecha: new Date(),
          clave_prod: form.clave_prod,
          tipo_movto: form.tipo_movto,
          cantidad_entrada: form.cantidad_entrada ? form.cantidad_entrada : 0,
          cantidad_salida: form.cantidad_salida ? form.cantidad_salida : 0,
          costo: form.costo,
          precio: form.precio,
          usuario: dataUsuarios2[0].id,
          almacen: form.almacen,
          observacion: form.observacion,
        },
      })
      .then((response) => {
        Swal.fire("¡Ajuste realizado!", `${response.data[0].mensaje1}`, "success");
        fetchAjustes();
      });
  };
  const eliminar = async (dato: MovimientoResponse) => {
    const permiso = await filtroSeguridad("AJUSTE_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "Seguro de eliminar?",
      text: `Producto: ${dato.d_producto}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Ajuste?id=${dato.id}`).then(() => {
          fetchAjustes();
        });

        Swal.fire("Eliminado!", "El producto ha sido removido de la lista", "success");
      }
    });
  };
  const putMovimiento = async () => {
    const permiso = await filtroSeguridad("AJUSTE_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    jezaApi

      .put("/Ajuste", null, {
        params: {
          id: form.id,
          cantidad_entrada: form.cantidad_entrada ? form.cantidad_entrada : 0,
          cantidad_salida: form.cantidad_salida ? form.cantidad_salida : 0,
        },
      })
      .then((response) => {
        console.log(response);
        Swal.fire("¡Ajuste modificado!", ``, "success");
        setTimeout(() => {
          fetchAjustes();
        }, 1500);
      })
      .catch((e) => console.log(e));
  };
  const putFinalizado = async () => {
    const permiso = await filtroSeguridad("AJUSTE_FIN");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    jezaApi
      .put(`/AjusteFinaliza?suc=${dataUsuarios2[0].sucursal}&tipo_movto=${form.tipo_movto}&usuario=${dataUsuarios2[0].id}`)
      .then((response) => {
        Swal.fire("¡Ajuste finalizado!", `Finalizado`, "success");
        fetchAjustes();
      })
      .catch(() => {
        Swal.fire("Error!", "No puede finalizar una venta sin registros", "error");
        fetchAjustes();
      });
  };

  const clean = () => {
    setform({ ...form, d_producto: "", cantidad_entrada: 0, cantidad_salida: 0, d_existencia: 0 });
  };
  const cleanData = () => {
    setform({
      ...form,
      almacen: 0,
      cantidad_entrada: 0,
      cantidad_salida: 0,
      cia: 0,
      clave_prod: 0,
      costo: 0,
      d_existencia: 0,
      d_producto: "",
      fecha: "",
      folio: "",
      id: 0,
      observacion: "",
      precio: 0,
      sucursal: 0,
      tipo_movto: 0,
      usuario: 0,
    });
  };
  const [loadingController, setLoadingController] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      // cleanData();
      setLoadingController(false);
    }, 900);
    // console.log('Este código se ejecutará una vez al montar el componente.');

    // Puedes realizar cualquier tarea que necesites aquí
    // Por ejemplo, hacer una llamada a una API o inicializar algún estado
  }, []); // El array de dependencias está vacío

  useEffect(() => {
    // if (Number(form.cantidad_salida) > 0) {
    if (Number(form.cantidad_salida) > 0) {
      setDeshabiliteadoExistencia(true);
    } else if (Number(form.cantidad_entrada) > 0) {
      setDeshabiliteadoSalida(true);
    } else if (Number(form.cantidad_entrada) === 0) {
      setDeshabiliteadoSalida(false);
      setDeshabiliteadoExistencia(false);
    }
  }, [form.cantidad_entrada || form.cantidad_salida]);
  const [validaciónAlmacen, setValidaciónAlmacen] = useState(false);
  useEffect(() => {
    const ultimoAlmacen = dataAjustes && dataAjustes.length > 0 ? dataAjustes[dataAjustes.length - 1].almacen : 0;
    const ultimoObservación = dataAjustes && dataAjustes.length > 0 ? dataAjustes[dataAjustes.length - 1].observaciones : "";
    const ultimoMovimiento = dataAjustes && dataAjustes.length > 0 ? dataAjustes[dataAjustes.length - 1].tipo_movto : "";
    const ultimaFecha = dataAjustes && dataAjustes.length > 0 ? dataAjustes[dataAjustes.length - 1].fecha.split("T")[0] : "";
    const ultimoEstado = dataAjustes && dataAjustes.length > 0 ? dataAjustes[dataAjustes.length - 1].finalizado : false;
    const ultimoResponsable = dataAjustes && dataAjustes.length > 0 ? dataAjustes[dataAjustes.length - 1].nombreUsuario : "";
    setUsuarioResponsable(ultimoResponsable);
    setEstados(ultimoEstado);
    if (dataAjustes.length > 0) {
      setValidaciónAlmacen(true);
    } else {
      setValidaciónAlmacen(false);
    }
    setform({
      ...form,
      almacen: ultimoAlmacen,
      observacion: ultimoObservación,
      tipo_movto: ultimoMovimiento,
      fecha: ultimaFecha,
    });
  }, [dataAjustes]);

  const [estados, setEstados] = useState(false);

  const [usuarioResponsable, setUsuarioResponsable] = useState("");
  const [informative, setInformative] = useState({
    totalCantidadEntrada: 0,
    totalCantidadSalida: 0,
    totalClaves: 0,
  });
  useEffect(() => {
    const sumaCantidadesEntradas = dataAjustes.reduce((total, item) => total + item.cantidad_entrada, 0);
    const sumaCantidadesSalidas = dataAjustes.reduce((total, item) => total + item.cantidad_salida, 0);
    setInformative({
      totalCantidadEntrada: sumaCantidadesEntradas,
      totalCantidadSalida: sumaCantidadesSalidas,
      totalClaves: dataAjustes.length,
    });
  }, [dataAjustes]);

  const [productoSelected, setProductoSelected] = useState<number[]>([]);
  useEffect(() => {
    const descripciones = dataAjustes ? dataAjustes.map((item) => item.clave_prod) : [];
    setProductoSelected(descripciones);
  }, [dataAjustes]);

  const InformativeInformation = () => {
    return (
      <div
      // className="d-flex flex-column justify-content-end align-items-end"
      // style={{ position: "fixed", bottom: "3%", right: "1%", marginRight: "20px", zIndex: 1 }}
      >
        {/* <Card className="p-2" style={{ maxWidth: "400px" }}>
          <h6>{<strong>Total de entradas: {informative.totalCantidadEntrada}</strong>}</h6>
          <h6>{<strong> Total de salidas: {informative.totalCantidadSalida}</strong>}</h6>
          <h6>{<strong> Total de claves: {informative.totalClaves}</strong>}</h6>
        </Card> */}
        <UncontrolledAccordion defaultOpen="1">
          <AccordionItem>
            <AccordionHeader targetId="1">
              {" "}
              <strong>Totales</strong>
            </AccordionHeader>
            <AccordionBody accordionId="1">
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: "33.33%" }}>Total de entradas</th>
                    <th style={{ width: "33.33%" }}>Total de salidas</th>
                    <th style={{ width: "33.33%" }}>Total de claves</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ width: "33.33%" }}>{informative.totalCantidadEntrada}</td>
                    <td style={{ width: "33.33%" }}>{informative.totalCantidadSalida}</td>
                    <td style={{ width: "33.33%" }}>{informative.totalClaves}</td>
                  </tr>
                </tbody>
              </table>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>
      </div>
    );
  };

  const handleOpenModal = () => {
    // Limpia las fechas y los datos de la consulta anterior al abrir el modal
    setFormFechas({ f1: "", f2: "" });

    setModalBusqueda(true);
  };

  const handleCloseModal = () => {
    // Limpia las fechas cuando se cierra el modal
    setFormFechas({ f1: "", f2: "" });

    setModalBusqueda(false);
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      {loadingController ? (
        <div className="text-center">
          <Spinner>Loading...</Spinner>
        </div>
      ) : (
        // loadingController ? <h1>LOADING</h1> :
        <>
          <br />
          <Container className="px-2">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>
                {" "}
                Ajustes diversos <BsScrewdriver size={30}></BsScrewdriver>
              </h1>
              {/* <BsScrewdriver size={30}></BsScrewdriver> */}
            </div>
            <FormGroup>
              <Container></Container>
              <br />
              <Container>
                <Row>
                  <Col md="3" style={{ marginBottom: 0 }}>
                    <Label>Tipo de movimiento:</Label>
                    <Input
                      disabled={estados}
                      type="select"
                      name="tipo_movto"
                      id="tipo_movto"
                      value={form.tipo_movto}
                      onChange={handleChange}
                      bsSize="sm"
                    >
                      <option value="">Selecciona tipo de movimiento</option>
                      {dataMovimientos.map((mov) => (
                        <option key={mov.tipo_movto} value={mov.tipo_movto}>
                          {mov.descripcion}
                        </option>
                      ))}
                    </Input>
                    <br />
                  </Col>

                  <Col md="3" style={{ marginBottom: 0 }}>
                    <Label>Almacén:</Label>
                    <Input
                      disabled={validaciónAlmacen}
                      type="select"
                      name="almacen"
                      id="almacen"
                      value={form.almacen}
                      onChange={handleChange}
                      bsSize="sm"
                    >
                      <option value="">Selecciona el almacén</option>
                      {filtradoAlmacenFormateada.map((sucursal: any) => (
                        <option key={sucursal.id} value={sucursal.id}>
                          {sucursal.descripcion}
                        </option>
                      ))}
                    </Input>
                    <br />
                  </Col>

                  <Col md="3">
                    <Label>Fecha:</Label>
                    <Input disabled={true} type="date" onChange={handleChange} name="fecha" value={form.fecha} bsSize="sm" />
                    <br />
                  </Col>
                  <Col md="3">
                    <Label>Folio:</Label>
                    <Input disabled type="text" name="folio" id="folio" value={form.folio} onChange={handleChange} bsSize="sm"></Input>
                    <br />
                  </Col>
                  <Col md="6">
                    <Label>Observaciones:</Label>
                    <Input
                      disabled={estados}
                      type="text"
                      name="observacion"
                      id="observacion"
                      value={form.observacion}
                      onChange={handleChange}
                      bsSize="sm"
                    ></Input>
                    <br />
                  </Col>
                  <Col md="6">
                    <Label>Responsable:</Label>
                    <Input
                      disabled
                      type="text"
                      name="usuarioResponsable"
                      id="usuarioResponsable"
                      value={usuarioResponsable}
                      onChange={handleChange}
                      bsSize="sm"
                    ></Input>
                    <br />
                  </Col>
                </Row>
              </Container>
              <br />
              <Container>
                <Row>
                  <div className="col align-self-start d-flex justify-content-end ">
                    <Button
                      color="success"
                      disabled={estados}
                      onClick={() => {
                        if (form.tipo_movto.toString() === "0" || form.almacen.toString() === "0" || form.observacion === "") {
                          Swal.fire({
                            icon: "info",
                            title: "Atención",
                            text: "Debe completar el formulario para realizar la función o no ingresar valores en 0",
                          });
                        } else {
                          setModalResumen(true);
                        }
                      }}
                      style={{ marginRight: 5 }}
                    >
                      <BiAddToQueue size={30} />
                      Agregar
                    </Button>

                    <Button
                      color="primary"
                      disabled={dataAjustes.length > 0 && Number(form.folio) == 0}
                      onClick={() => {
                        setform({
                          cia: dataUsuarios2[0]?.idCia,
                          sucursal: dataUsuarios2[0]?.sucursal,
                          folio: "",
                          fecha: "",
                          clave_prod: 0,
                          tipo_movto: 0,
                          cantidad_entrada: 0,
                          cantidad_salida: 0,
                          costo: 0,
                          precio: 0,
                          usuario: 0,
                          almacen: 0,
                          observacion: "",
                        });
                      }}
                    >
                      Nuevo
                      <BiTag size={30} />
                    </Button>
                  </div>
                  <div className="table-responsive">
                    <br />
                    <Table size="sm" bordered={true} striped={true} responsive={"sm"}>
                      <thead>
                        <tr>
                          <th>Clave</th>
                          <th>Descripción</th>
                          <th style={{ textAlign: "center" }}>Cantidad</th>
                          {/* <th style={{ textAlign: "center" }}> Unidad de medida</th> */}
                          <th> Acciones</th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th style={{ marginBottom: "10px" }}>
                            <div className="row">
                              <div className="col-6" style={{ textAlign: "center" }}>
                                E
                              </div>
                              <div className="col-6" style={{ textAlign: "center" }}>
                                S
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataAjustes.map((ajuste) => (
                          <tr>
                            <td>{ajuste.clave_prod} </td>
                            <td>{ajuste.d_producto} </td>
                            <td style={{ marginBottom: "10px" }}>
                              <div className="row">
                                <div className="col-6" style={{ textAlign: "center" }}>
                                  {ajuste.cantidad_entrada}
                                </div>
                                <div className="col-6" style={{ textAlign: "center" }}>
                                  {ajuste.cantidad_salida}
                                </div>
                              </div>
                            </td>
                            <td className="gap-5">
                              <AiFillEdit
                                color={ajuste.finalizado ? "grey" : "black"}
                                className="mr-2"
                                onClick={() => {
                                  if (ajuste.finalizado) {
                                    null;
                                  } else {
                                    setModalResumenEditar(true);
                                    setform({ ...ajuste, d_existencia: ajuste.existencia });
                                  }
                                }}
                                size={23}
                              ></AiFillEdit>
                              <AiFillDelete
                                color={ajuste.finalizado ? "grey" : "black"}
                                onClick={() => {
                                  if (ajuste.finalizado) {
                                    null;
                                  } else {
                                    eliminar(ajuste);
                                  }
                                }}
                                size={23}
                              ></AiFillDelete>
                            </td>{" "}
                            <td> </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Row>
              </Container>
            </FormGroup>
            <InformativeInformation></InformativeInformation>
            <br />
            <br />
          </Container>
          <Container>
            <Button style={{ marginRight: 5 }} onClick={putFinalizado} color="success" disabled={dataAjustes.length === 0 || estados}>
              <CgPlayListCheck size={30} />
              Finalizar
            </Button>
            <Button
              color="primary"
              onClick={() => {
                handleOpenModal();
                fetchAjustesBusquedas();
              }}
            >
              <BiSearchAlt size={30} />
              Busqueda
            </Button>
          </Container>
          <div style={{ position: "fixed", bottom: 20, width: "100%" }}></div>
        </>
      )}

      <Modal isOpen={modalResumen} size="xl">
        <ModalHeader>
          <div>
            <h3>Realizar ajuste de producto</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Label>Producto:</Label>
            <InputGroup>
              <Input disabled value={form.d_producto} placeholder="Seleccionar producto" />
              <Button onClick={() => setModalProductos(true)}>Elegir</Button>
            </InputGroup>
            <br />
            <Row>
              <br />
              <br />
              <Col>
                <Label>Cantidad en existencias: </Label>
                <Input disabled onChange={handleChange} value={form.d_existencia} name="d_existencia" />
              </Col>
              <Col>
                <Label>Cantidad entrada:</Label>
                <Input type="number" disabled={deshabiliteadoExistencia} onChange={handleChange} name="cantidad_entrada" placeholder="Cantidad" />
              </Col>
              <Col>
                <Label>Cantidad salida: </Label>
                <Input type="number" disabled={deshabiliteadoSalida} onChange={handleChange} name="cantidad_salida" placeholder="Cantidad salida" />
              </Col>
            </Row>
            <br />
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => {
              const cantidadSalida = form.cantidad_salida ? form.cantidad_salida : 0;
              const cantidadEntrada = form.cantidad_entrada ? form.cantidad_entrada : 0;
              if ((!form.cantidad_entrada && !form.cantidad_salida) || !form.clave_prod || !form.d_producto) {
                Swal.fire({
                  icon: "info",
                  title: "Atención",
                  text: "Debe completar el formulario para realizar la función",
                });
              } else {
                if (Number(form.d_existencia) + Number(cantidadEntrada) <= 0 && cantidadEntrada > 0) {
                  Swal.fire({
                    icon: "info",
                    title: "Atención",
                    text: "La cantidad en existencias no alcanza",
                  });
                } else if (Number(form?.d_existencia) - cantidadSalida < 0 && cantidadSalida > 0) {
                  Swal.fire({
                    icon: "info",
                    title: "Atención",
                    text: "La cantidad en existencias no alcanza",
                  });
                } else if (cantidadSalida < 0 || cantidadEntrada < 0) {
                  Swal.fire({
                    icon: "info",
                    title: "Atención",
                    text: "No se pueden ingresar valores negativos en los campos, favor de verificar",
                  });
                } else {
                  setModalResumen(false);
                  postMovimiento();
                  clean();
                }
              }
            }}
          >
            Agregar
          </Button>
          <Button
            color="danger"
            onClick={() => {
              setModalResumen(false);
              clean();
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/* MODAL DE BUSQUEDA */}
      <Modal isOpen={modalBusqueda} size="xl">
        <ModalHeader>
          <div>
            <h3>Búsqueda</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col md={2}>
                <Label>Fecha inicio: </Label>
              </Col>
              <Col md={4}>
                <Input type="date" onChange={handleChangeFecha} name="f1" value={formFechas.f1}></Input>
              </Col>
              <Col md={2}>
                <Label>Fecha final: </Label>
              </Col>
              <Col md={4}>
                <Input type="date" onChange={handleChangeFecha} name="f2" value={formFechas.f2}></Input>
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
                  {dataAjustesBusquedas
                    ? dataAjustesBusquedas.map((ajuste) => (
                        <tr>
                          <td>
                            <AiOutlineSelect
                              onClick={() => {
                                setform({
                                  ...form,
                                  folio: Number(ajuste.folio),
                                  tipo_movto: ajuste.tipo_movto,
                                  fecha: ajuste.fecha.split("T")[0],
                                });
                                setModalBusqueda(false);
                                console.log(ajuste);
                              }}
                            ></AiOutlineSelect>
                          </td>
                          <td>{ajuste.folio}</td>
                          <td>{ajuste.descripcion}</td>
                          <td>{ajuste.items}</td>
                          <td>{ajuste.nombreUsuario}</td>
                          <td>{ajuste.finalizado == true ? "Finalizado" : "En proceso"}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </Table>
            </div>
          </Container>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" onClick={handleCloseModal}>
            {/* <Button color="danger" onClick={() => setModalBusqueda(false)}> */}
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalProductos} size="lg" toggle={() => setModalProductos(false)}>
        <ModalHeader></ModalHeader>
        <ModalBody>
          <TableProductosMovimientos
            sucursal={dataUsuarios2[0]?.sucursal}
            productoSelected={productoSelected}
            form={form}
            setform={setform}
            setModalOpen2={setModalProductos}
            almacenId={form.almacen}
            cia={dataUsuarios2[0]?.cia}
          ></TableProductosMovimientos>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => setModalProductos(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalResumenEditar} size="xl">
        <ModalHeader>
          <div>
            <h3>Realizar ajuste de producto</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Label>Producto:</Label>
            <Row>
              {/* // SE MANDA A LLAMAR EL dataMovimientosContext que importamos y que consume del context para que pueda seleccionarse */}
              <InputGroup>
                <Input disabled value={form.d_producto} placeholder="Seleccionar producto" />
                <Button onClick={() => setModalProductos(true)}>Elegir</Button>
              </InputGroup>

              <div>
                <br />
                <Label>Cantidad en existencias</Label>
                <Input disabled={true} value={form.d_existencia}></Input>
                <br />
                <Row>
                  <Col>
                    <Label>Cantidad entrada:</Label>
                    <Input
                      disabled={deshabiliteadoExistencia}
                      value={form.cantidad_entrada}
                      onChange={handleChange}
                      name="cantidad_entrada"
                      placeholder="Cantidad"
                      type="number"
                    />
                  </Col>
                  <Col>
                    <Label>Cantidad salida: </Label>
                    <Input
                      disabled={deshabiliteadoSalida}
                      value={form.cantidad_salida}
                      onChange={handleChange}
                      name="cantidad_salida"
                      placeholder="Cantidad salida"
                      type="number"
                    />
                  </Col>
                </Row>
                <br />
              </div>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => {
              if (form.cantidad_salida > form.d_existencia) {
                Swal.fire("", "No se puede ingresar una cantidad de salida mayor a la existente", "info");
              } else if (form.cantidad_salida < 0 || form.cantidad_entrada < 0) {
                Swal.fire({
                  icon: "info",
                  title: "Atención",
                  text: "No se pueden ingresar valores negativos en los campos, favor de verificar",
                });
              } else {
                setModalResumenEditar(false);
                putMovimiento();
                clean();
              }

              // // setModalResumenEditar(false);
              // //putMovimiento();
              // clean();
            }}
          >
            Agregar
          </Button>
          <Button
            color="danger"
            onClick={() => {
              setModalResumenEditar(false);
              clean();
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default MovimientoDiversos;
