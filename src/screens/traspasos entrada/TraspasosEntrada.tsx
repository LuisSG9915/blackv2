import React, { useState, useEffect, useRef } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Almacen } from "../../models/Almacen";
import { Usuario } from "../../models/Usuario";
import {
  Button,
  Col,
  Container,
  ModalFooter,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  Card,
  InputGroup,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
  ButtonGroup,
} from "reactstrap";
import { ImMoveDown } from "react-icons/im";
import { useTraspasoEntrada } from "../../hooks/getsHooks/useTraspasoEntrada";
import { TraspasoBusqueda, TraspasoGet } from "../../models/Traspaso";
import { useReactToPrint } from "react-to-print";
import { jezaApi } from "../../api/jezaApi";
import { Sucursal } from "../../models/Sucursal";
import { useTraspasoBusqueda } from "../../hooks/getsHooks/useTraspasoBusqueda";
import { AiOutlineSelect } from "react-icons/ai";
import CButton from "../../components/CButton";
import { useTraspasoEntradaSelector } from "../../hooks/getsHooks/useTraspasoEntradaSelector";
import { UserResponse } from "../../models/Home";
import Swal from "sweetalert2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useNavigate } from "react-router-dom";

import { BsDownload } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";


function TraspasosEntrada() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_TrasEntrada_view`);

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
  // const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();
  const { dataSucursales } = useSucursales();
  const [form, setForm] = useState({
    cia: 1,
    sucursal: 0,
    almacen: 0,
    descripcion: "",
    folio: "",
    f1: "",
    f2: "",
    suc_destino: "",
  });

  // useEffect(() => {
  //   const item = localStorage.getItem("userLogged");
  //   if (item !== null) {
  //     const parsedItem = JSON.parse(item);
  //     setDataUsuarios(parsedItem);
  //   }
  // }, []);
  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
    }
  }, []);

  const [fechaHoy, setFechaHoy] = useState("");

  useEffect(() => {
    const obtenerFechaHoy = () => {
      const fecha = new Date();
      const opcionesFecha = { year: "numeric", month: "numeric", day: "numeric" };
      const fechaFormateada = fecha.toLocaleDateString(undefined, opcionesFecha);
      setFechaHoy(fechaFormateada);
      console.log({ fechaFormateada });
    };

    obtenerFechaHoy();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
  const DataTableHeader = ["Clave del producto", "Descripción", "Cantidad por recibir", "Unidad de medida"];
  const DataTableHeaderBusqueda = [
    "",
    "Folio",
    "Responsable traspaso",
    "Fecha",
    "Sucursal envío",
    "Almacén envío",
    "Almacén recibido",
    "Estado envío",
  ];
  const [fechaSeleccionada, setFechaSeleccionada] = useState({
    f1: "",
    f2: "",
    suc_destino: "%",
    folio: "0",
    d_usuario: "",
    fechaTraspaso: "",
  });

  const { dataTraspasosEntradas, fetchTraspasosEntradas } = useTraspasoEntradaSelector({
    f1: fechaSeleccionada.f1,
    f2: fechaSeleccionada.f2,
    folio: fechaSeleccionada.folio,
    sucursal: dataUsuarios2 ? dataUsuarios2[0]?.sucursal : "%",
    sucursal_destino: fechaSeleccionada.suc_destino,
  });

  useEffect(() => {
    // const filtradoSucursal = dataSucursales.filter((data: Sucursal) => data.sucursal !== dataUsuarios2[0].sucursal);
    const filtradoSucursal = dataSucursales.filter((data: Sucursal) => data.sucursal);
    setFiltradoSucursales(filtradoSucursal);
  }, [dataSucursales.length > 0]);
  const [stateRecibido, setSetstateRecibido] = useState(false);
  const [informative, setInformative] = useState({
    totalClaves: 0,
    totalCantidad: 0,
    d_almacenDestino: "",
    d_almacenOrigen: "",
  });
  useEffect(() => {
    const ultimoFolio =
      dataTraspasosEntradas && dataTraspasosEntradas.length > 0
        ? dataTraspasosEntradas[dataTraspasosEntradas.length - 1].recibido
        : false;
    const sucursalOrigen =
      dataTraspasosEntradas && dataTraspasosEntradas.length > 0
        ? dataTraspasosEntradas[dataTraspasosEntradas.length - 1].suc_origen
        : 0;
    const sumaCantidades =
      dataTraspasosEntradas && dataTraspasosEntradas.length > 0
        ? dataTraspasosEntradas.reduce((total, item) => total + item.cantidad, 0)
        : [0];
    const ultimoNombreAlmOrigen =
      dataTraspasosEntradas && dataTraspasosEntradas.length > 0
        ? dataTraspasosEntradas[dataTraspasosEntradas.length - 1].nombreAlmOrigen
        : "";
    const ultimoNombreAlmDestino =
      dataTraspasosEntradas && dataTraspasosEntradas.length > 0
        ? dataTraspasosEntradas[dataTraspasosEntradas.length - 1].nombreAlmDestino
        : "";

    setSetstateRecibido(ultimoFolio);
    setFechaSeleccionada({
      ...fechaSeleccionada,
      d_usuario: dataTraspasosEntradas[0]?.usuarioRecepcion,
      fechaTraspaso: dataTraspasosEntradas[0]?.fecha.split("T")[0],
    });
    setForm({ ...form, sucursal: sucursalOrigen });
    setInformative({
      ...informative,
      totalCantidad: Number(sumaCantidades),
      totalClaves: dataTraspasosEntradas.length,
      // d_almacenOrigen: ultimoNombreAlmOrigen,
      //       d_almacenDestino: ultimoNombreAlmDestino,
    });
  }, [dataTraspasosEntradas.length > 0, dataTraspasosEntradas]);
  const InformativeInformation = () => {
    return (
      <>
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
  const InfoRow = () => {
    return (
      <>
        <Container>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1> Traspasos de entrada  <ImMoveDown size={40}></ImMoveDown></h1>

          </div>

        </Container>
        <Container>
          <Row>
            <Col md="3" style={{ marginBottom: 25 }}>
              <Label>Origen:</Label>
              <Input disabled type="select" name="sucursal" id="sucursal" value={form.sucursal} onChange={handleChange}>
                <option value=""></option>
                {filtradoSucursales.map((sucursal: Sucursal) => (
                  <option key={sucursal.sucursal} value={sucursal.sucursal}>
                    {sucursal.nombre}
                  </option>
                ))}
              </Input>
            </Col>
            {/* MODIFICAR */}
            <Col md="3">
              <Label>Fecha:</Label>
              <Input
                disabled
                type="date"
                name="fechaTraspaso"
                id="fechaTraspaso"
                value={fechaSeleccionada.fechaTraspaso}
                onChange={handleChangeFechas}
              ></Input>
            </Col>
            <Col md="4">
              <Label>Responsable de envío:</Label>
              <Input
                disabled
                type="text"
                name="d_usuario"
                id="d_usuario"
                value={fechaSeleccionada.d_usuario}
                onChange={handleChangeFechas}
              ></Input>
            </Col>
            <Col md="1">
              <Label>Folio:</Label>
              <Input disabled type="text" name="folio" id="folio" value={form.folio} onChange={handleChange}></Input>
            </Col>
          </Row>
          <Row>
            <Col md="3">
              <Label>Almacén origen:</Label>
              <Input
                disabled
                type="text"
                name="d_almacenOrigen"
                id="folio"
                value={informative.d_almacenOrigen}
                onChange={handleChange}
              ></Input>
            </Col>
            <Col md="3">
              <Label>Almacén destino:</Label>
              <Input
                disabled
                type="text"
                name="d_almacenDestino"
                id="folio"
                value={informative.d_almacenDestino}
                onChange={handleChange}
              ></Input>
            </Col>
          </Row>
          <br />
        </Container>
      </>
    );
  };
  const [filtradoSucursales, setFiltradoSucursales] = useState([]);

  const TableTraspasoEntrada = () => {
    return (
      <>
        <Table size="sm" striped={true} responsive={true} style={{ width: "100%", margin: "auto" }}>
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
            {dataTraspasosEntradas.map((dato: TraspasoGet, index) => (
              <tr key={dato.id + index}>
                <td>{dato.clave_prod}</td>
                <td>{dato.d_producto}</td>
                <td>{dato.cantidad}</td>
                <td>{dato.d_unidadmedida}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <InformativeInformation></InformativeInformation>
      </>
    );
  };

  const GroupButtons = () => {
    return (
      <>
        <Container>
          <div>

            <Button
              style={{ marginRight: 5 }}
              disabled={!recibido && dataTraspasosEntradas.length > 0 ? false : true}
              onClick={() => {
                FinalizaRecepcion();
              }}
              color="success"
            >

              Recibir
              <BsDownload size={30} />
            </Button>
            {/* <TicketPrint>
              <>
                <br />
                <InfoRow></InfoRow>
                <br />
                <TableTraspasoEntrada></TableTraspasoEntrada>
                <br />
              </>
            </TicketPrint> */}
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
      </>
    );
  };
  // const Title = () => {
  //   return (
  //     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  //       <h1> Traspasos de entrada  <ImMoveDown size={40}></ImMoveDown></h1>

  //     </div>
  //   );
  // };

  // interface TicketPrintProps {
  //   children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  // }
  // const TicketPrint: React.FC<TicketPrintProps> = ({ children }) => {
  //   const componentRef = useRef<HTMLDivElement>(null);

  //   const handlePrint = useReactToPrint({
  //     content: () => componentRef.current,
  //   });

  //   return (
  //     <div>
  //       <div style={{ display: "none" }}>
  //         <div ref={componentRef}>{children}</div>
  //       </div>
  //       {children && (
  //         <Button color="primary" onClick={handlePrint}>
  //           Imprimir
  //         </Button>
  //       )}
  //     </div>
  //   );
  // };

  const FinalizaRecepcion = async () => {
    const permiso = await filtroSeguridad("TRASP_ENTRA_REC");
    if (permiso === false) {
      return;
    }

    jezaApi
      .put("/TraspasoRecepcion", null, {
        params: {
          origen: form.sucursal /*suc origen de donde viene  */,
          folio: form.folio,
          destino: dataUsuarios2[0].sucursal /* sucdestino Mio */,
          usr: dataUsuarios2[0].id,
        },
      })
      .then((response) => {
        console.log(response);
        Swal.fire({
          icon: "success",
          text: "Sucursal actualizada con éxito",
          confirmButtonColor: "#3085d6",
        });
        setInformative({ d_almacenDestino: "", d_almacenOrigen: "", totalCantidad: 0, totalClaves: 0 });
        setForm({ ...form, folio: 0 });
        fetchTraspasosEntradas({
          folio: fechaSeleccionada.folio,
          sucursal: fechaSeleccionada.suc_destino,
          sucursal_destino: dataUsuarios2[0].sucursal,
          f1: fechaSeleccionada.f1,
          f2: fechaSeleccionada.f2,
        });
      })
      .catch((alert) => console.log(alert));
  };
  const handleChangeFechas = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFechaSeleccionada((prevState: any) => ({ ...prevState, [name]: value }));
  };
  const [dataTraspasoBusqueda2, setDataTraspasoBusqueda2] = useState<TraspasoBusqueda[]>([]);

  const getTraspasoBusqueda = async () => {
    const permiso = await filtroSeguridad("TRASP_ENTRA_GET");
    if (permiso === false) {
      return;
    }

    jezaApi
      .get(
        `/TraspasoBusqueda?folio=${Number(fechaSeleccionada.folio) === 0 ? "%" : fechaSeleccionada.folio}&sucursal=${fechaSeleccionada.suc_destino
        }&sucursal_destino=${dataUsuarios2[0]?.sucursal}&f1=${fechaSeleccionada.f1 ? fechaSeleccionada.f1 : "20230101"
        }&f2=${fechaSeleccionada.f2 ? fechaSeleccionada.f2 : "20231212"}`
      )
      .then((response) => {
        setDataTraspasoBusqueda2(response.data);
        setForm({
          ...form,
          suc_destino: fechaSeleccionada.suc_destino.toString(),
          sucursal: Number(fechaSeleccionada.suc_destino),
        });
      });
  };
  useEffect(() => {
    getTraspasoBusqueda();
  }, [fechaSeleccionada.suc_destino]);

  const [recibido, setRecibido] = useState(false);
  useEffect(() => {
    const ultimoFolio =
      dataTraspasosEntradas && dataTraspasosEntradas.length > 0
        ? dataTraspasosEntradas[dataTraspasosEntradas.length - 1].recibido
        : false;
    setRecibido(ultimoFolio);
  }, [dataTraspasosEntradas]);

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <Container className="px-2">
        {/* <Title /> */}
        <br />
        <InfoRow />
        <h4>
          {stateRecibido === true
            ? "Traspaso recibido"
            : stateRecibido === false && dataTraspasosEntradas.length > 0
              ? "Traspaso no recibido"
              : ""}{" "}
        </h4>

        <TableTraspasoEntrada />
        <br />
        <br />
      </Container>
      <GroupButtons />

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
                <Label>Sucursal origen:</Label>
                <Input
                  value={fechaSeleccionada.suc_destino}
                  type="select"
                  name="suc_destino"
                  onChange={handleChangeFechas}
                >
                  <option value={0}>Selecciona sucursal</option>
                  <option value={"%"}>Todas las sucursales</option>
                  {filtradoSucursales.map((option: Sucursal) => (
                    <option key={option.sucursal} value={Number(option.sucursal)}>
                      {option.nombre}
                    </option>
                  ))}
                </Input>
                <br />
              </Col>
              <Col md={3}>
                <Label>Folio: </Label>
                <Input type="text" onChange={handleChangeFechas} name="folio" value={fechaSeleccionada.folio}></Input>
                <br />
              </Col>
            </Row>
            <Button color="primary" onClick={() => getTraspasoBusqueda()}> Buscar </Button>
            <hr />
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    {DataTableHeaderBusqueda.map((valor) => (
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
                            console.log(traspaso);
                            setForm({
                              ...form,
                              folio: traspaso.folio.toString(),
                              suc_destino: traspaso.suc_destino.toString(),
                            });
                            setModalBusqueda(false);
                            fetchTraspasosEntradas({
                              folio: traspaso.folio,
                              sucursal_destino: dataUsuarios2[0].sucursal,
                              sucursal: fechaSeleccionada.suc_destino,
                              f1: fechaSeleccionada.f1,
                              f2: fechaSeleccionada.f2,
                            });
                            setInformative({
                              ...informative,
                              d_almacenDestino: traspaso.d_almacenDestino,
                              d_almacenOrigen: traspaso.d_almacenOrigen,
                            });
                          }}
                        ></AiOutlineSelect>
                      </td>

                      <td>{traspaso.folio}</td>
                      <td>{traspaso.usuarioTraspaso}</td>
                      <td>{traspaso.fecha.split("T")[0]}</td>
                      <td>{traspaso.d_sucOrigen}</td>
                      <td>{traspaso.d_almacenDestino}</td>
                      <td>{traspaso.d_almacenOrigen}</td>
                      <td>{traspaso.recibido ? "Recibido" : "No recibido"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Container>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" onClick={() => setModalBusqueda(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      {/* 
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
                <Input type="date" onChange={handleChange} name="fechaInicio" defaultValue={form.marca}></Input>
              </Col>
              <Col md={2}>
                <Label>Fecha final: </Label>
              </Col>
              <Col md={4}>
                <Input type="date" onChange={handleChange} name="fechaFinal" defaultValue={form.marca}></Input>
              </Col>
            </Row>
            <hr />
            <Table>
              <thead>
                <tr>
                  {DataTableHeaderBusqueda.map((valor) => (
                    <th className="" key={valor}>
                      {valor}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataTraspasoBusqueda.map((traspaso) => (
                  <tr>
                    <td>
                      <AiOutlineSelect
                        onClick={() => {
                          setForm({ ...form, suc_destino: traspaso.suc_destino, suc_origen: traspaso.suc_origen });
                          setModalBusqueda(false);
                        }}
                      ></AiOutlineSelect>
                    </td>

                    <td>{traspaso.folio}</td>
                    <td>{traspaso.d_sucDestino}</td>
                    <td>{traspaso.fecha.split("T")[0]}</td>
                    <td>{traspaso.usuarioTraspaso}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton color="danger" onClick={() => setModalBusqueda(false)} text="Cancelar" />
        </ModalFooter>
      </Modal> */}
    </>
  );
}
export default TraspasosEntrada;
