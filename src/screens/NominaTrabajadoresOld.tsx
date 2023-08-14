import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
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
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import CButton from "../components/CButton";
import SidebarHorizontal from "../components/SidebarHorizontal";
import useReadHook, { DataClinica } from "../hooks/useReadHook";
import { useNavigate } from "react-router-dom";
import { jezaApi } from "../api/jezaApi";
import useModalHook from "../hooks/useModalHook";
import CFormGroupInput from "../components/CFormGroupInput";
import TabPrueba from "./TabPrueba";
import { Trabajador } from "../models/Trabajador";
import AlertComponent from "../components/AlertComponent";
import { useNominaPuestos } from "../hooks/getsHooks/useNominaPuestos";
import { useNominaDepartamentos } from "../hooks/getsHooks/useNominaDepartamentos";
import { useNominaEscolaridad } from "../hooks/getsHooks/useNominaEscolaridad";

function NominaTrabajadores() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [data, setData] = useState([]);

  const { dataNominaPuestos } = useNominaPuestos();
  const { dataNominaDepartamentos } = useNominaDepartamentos();
  const { dataNominaNivel } = useNominaEscolaridad();
  const navigate = useNavigate();
  const [form, setForm] = useState<Trabajador>({
    clave_empleado: "",
    status: 1,
    nombre: "",
    fecha_nacimiento: "",
    sexo: "M",
    RFC: "",
    CURP: "",
    imss: "",
    domicilio: "",
    colonia: "",
    poblacion: "",
    estado: "",
    lugar_nacimiento: "",
    codigo_postal: "",
    telefono1: "",
    telefono2: "",
    email: "",
    idDepartamento: 0,
    idPuesto: 0,
    observaciones: "",
    nivel_escolaridad: 0,
    fecha_baja: "",
    motivo_baja: 0,
    motivo_baja_especificacion: "",
    fecha_alta: "",
    fecha_cambio: "",
    d_estatus: "",
    id: 0,
    descripcion_puesto: "",
    descripcion_departamento: "",
    d_nivelEscolaridad: "",
    d_motiboBaja: "",
  });

  const getTrabajador = () => {
    jezaApi.get("/Trabajador?id=0").then((response) => {
      setData(response.data);
    });
  };
  useEffect(() => {
    getTrabajador();
  }, []);

  const DataTableHeader = ["Nombre", "Telefono", "Celular", "Email", "Departamento", "Puesto", "Acciones"];

  const mostrarModalActualizar = (dato: Trabajador) => {
    setForm(dato);
    console.log({ dato });
    setModalActualizar(true);
  };

  const editar = (dato: Trabajador) => {
    jezaApi.put(`/Medico`, {}).then(() => console.log(form));
    const arreglo: Trabajador[] = [...data];
    const index = arreglo.findIndex((registro) => registro.id === dato.id);
    if (index !== -1) {
      console.log("index");
      setModalActualizar(false);
    }
  };

  const eliminar = (dato: Trabajador) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      jezaApi.delete(`/Trabajador?id=${dato.id}`).then(() => {
        setModalActualizar(false);
        getTrabajador();
      });
    }
  };

  const insertar = () => {
    jezaApi
      .post("/Trabajador", null, {
        params: {
          clave_empleado: "aq1",
          status: 12,
          nombre: "1qq",
          fecha_nacimiento: "2023-01-01T00:00:00",
          sexo: "1",
          RFC: "RAFSACS",
          CURP: "QWERT",
          imss: "qwerty1",
          domicilio: "qwerty1",
          colonia: "qwrty1",
          poblacion: "qwert1",
          estado: "Ver1",
          lugar_nacimiento: "Xalapa1",
          codigo_postal: "91014",
          telefono1: "12344242",
          telefono2: "13141",
          email: "uis.sg9915",
          idDepartamento: 1,
          idPuesto: 1,
          observaciones: "q1",
          nivel_escolaridad: 1,
          fecha_baja: "2023-01-01T00:00:00",
          motivo_baja: "q1",
          motivo_baja_especificacion: "Baj1",
          fecha_alta: "2023-06-01T20:05:37.897",
          fecha_cambio: "2023-06-01T20:05:37.897",
        },
      })
      .then(() => {});
    setModalInsertar(false);
  };

  const filtroEmail = (datoMedico: string, datoEmail: string) => {
    var resultado = data.filter((elemento: any) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if (
        (datoEmail === "" || elemento.email.toLowerCase().includes(datoEmail.toLowerCase())) &&
        (datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) &&
        elemento.nombre.length > 2
      ) {
        return elemento;
      }
    });
    setData(resultado);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const handleNav = () => {
    navigate("/NominaTrabajadoresCrear");
  };
  const handleNavs = () => {
    navigate("/NominaTrabajadorBaja");
  };
  const handleNavss = () => {
    navigate("/NominaDepartamentos");
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

  const editarTrabajador = () => {
    const fechaHoy = new Date();

    jezaApi
      .put(`/Trabajador?id=${form.id}`, null, {
        params: {
          clave_empleado: form.clave_empleado,
          status: form.status,
          nombre: form.nombre,
          fecha_nacimiento: form.fecha_nacimiento ? form.fecha_nacimiento.split("T")[0] : null,
          sexo: form.sexo,
          RFC: form.RFC,
          CURP: form.CURP,
          imss: form.imss,
          domicilio: form.domicilio,
          colonia: form.colonia,
          poblacion: form.poblacion,
          estado: form.estado,
          lugar_nacimiento: form.lugar_nacimiento,
          codigo_postal: form.codigo_postal,
          telefono1: form.telefono1,
          telefono2: form.telefono2,
          email: form.email,
          idDepartamento: form.idDepartamento,
          idPuesto: form.idPuesto,
          observaciones: form.observaciones,
          nivel_escolaridad: form.nivel_escolaridad,
          fecha_baja: form.fecha_baja ? form.fecha_baja.split("T")[0] : null,
          motivo_baja: form.motivo_baja ? form.motivo_baja : 0,
          motivo_baja_especificacion: form.motivo_baja_especificacion,
          fecha_alta: form.fecha_alta,
          fecha_cambio: "2023-06-19",
        },
      })
      .then((r) => {
        console.log({ r });
        setVisible(true);
        getTrabajador();
        console.log("no");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Nomina de trabajadores </h1>
          <AiOutlineUser size={30}></AiOutlineUser>
        </div>
        <div className="col align-self-start d-flex justify-content-center ">
          <Card className="my-2 w-100" color="white">
            <CardHeader>Filtro</CardHeader>
            <CardBody>
              <Row>
                <div className="col-sm">
                  <CardTitle tag="h5">Nombre </CardTitle>
                  <CardText>
                    <Input
                      type="text"
                      value={filtroValorMedico}
                      onChange={(e) => {
                        setFiltroValorMedico(e.target.value);
                      }}
                    ></Input>
                  </CardText>
                </div>
                <div className="col-sm">
                  <CardTitle tag="h5">Numero de telefono</CardTitle>
                  <CardText>
                    <Input
                      type="text"
                      value={filtroValorEmail}
                      onChange={(e) => {
                        setFiltroValorEmail(e.target.value);
                      }}
                    />
                  </CardText>
                </div>
              </Row>
              <br />
              <div className="d-flex justify-content-end">
                <CButton
                  color="primary"
                  onClick={() => {
                    if (filtroValorEmail) {
                      setFiltroValorEmail("");
                      setFiltroValorMedico("");
                      getTrabajador();
                    }
                  }}
                  text="Reset"
                />
                <div style={{ marginLeft: 10 }}></div>
                <CButton color="success" onClick={() => filtroEmail(filtroValorMedico, filtroValorEmail)} text="Filtro" />
              </div>
            </CardBody>
          </Card>
        </div>
        <br />
        <Container className="d-flex justify-content-end ">
          <CButton color="success" onClick={() => handleNav()} text="Crear nomina trabajador" />
          {/* <CButton color="danger" onClick={() => handleNavs()} text="Baja Trabajador" /> */}
          {/* <CButton onClick={() => handleNavss()} text="Baja Trabajador" color={""} /> */}
        </Container>
        <br />

        <Table size="sm" striped={true} responsive={true}>
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
            {data.map((dato: Trabajador, item) => (
              <tr key={item + dato.id}>
                <td> {dato.nombre} </td>
                <td> {dato.telefono1} </td>
                <td> {dato.telefono2} </td>
                <td> {dato.email} </td>
                <td> {dato.descripcion_departamento} </td>
                <td> {dato.descripcion_puesto} </td>
                <td className="gap-5">
                  <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(dato)} size={23}></AiFillEdit>
                  <AiFillDelete color="lightred" onClick={() => eliminar(dato)} size={23}></AiFillDelete>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal isOpen={modalActualizar} size="xl" fullscreen={"md"}>
        <ModalHeader>
          <div>
            <h3>Editar Registro</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <Card body>
              {/* <TabPrueba getTrab={getTrabajador} form2={form} setForm2={setForm}></TabPrueba> */}
              <Nav tabs>
                <NavItem>
                  <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
                    Trabajador
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
                    Contacto
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")}>
                    Adicional
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={activeTab === "4" ? "active" : ""} onClick={() => toggleTab("4")}>
                    Bajas
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <br />
                <TabPane tabId="1">
                  <h3> Información del trabajador </h3>
                  <br />
                  <Row>
                    <Col sm="4">
                      <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" defaultValue={form ? form.nombre : ""} />
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="domicilio"
                        labelName="Domicilio:"
                        defaultValue={form?.domicilio ? form.domicilio : form.domicilio}
                      />
                      <Label>Sexo</Label>
                      <Input className="mb-3" type="select" onChange={handleChange} name="sexo" value={form.sexo ? form.sexo : form.sexo}>
                        <option value={"M"}>Masculino</option>
                        <option value={"F"}>Femenino</option>
                      </Input>
                      {/* <CFormGroupInput handleChange={handleChange} inputName="sexo" labelName="sexo:" defaultValue={form ? form.sexo : form.sexo} /> */}
                    </Col>
                    <Col sm="4">
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="colonia"
                        labelName="Colonia:"
                        defaultValue={form.colonia ? form.colonia : form.colonia}
                      />
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="poblacion"
                        labelName="Población:"
                        defaultValue={form.poblacion ? form.poblacion : form.poblacion}
                      />

                      <FormGroup>
                        <Label for="exampleDate">Fecha de nacimiento</Label>
                        <Input
                          id="exampleDate"
                          name="fecha_nacimiento"
                          placeholder="date placeholder"
                          type="date"
                          onChange={handleChange}
                          defaultValue={form.fecha_nacimiento ? form.fecha_nacimiento.split("T")[0] : form.fecha_nacimiento}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="4">
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="estado"
                        labelName="Estado:"
                        defaultValue={form.estado ? form.estado : form.estado}
                      />
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="lugar_nacimiento"
                        labelName="Lugar de nacimiento:"
                        defaultValue={form.lugar_nacimiento ? form.lugar_nacimiento : form.lugar_nacimiento}
                      />

                      <div className="mb-3"></div>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="codigo_postal"
                        labelName="Código Postal:"
                        value={form.codigo_postal ? form.codigo_postal : form.codigo_postal}
                      />
                    </Col>
                  </Row>
                  <br />
                </TabPane>
                <TabPane tabId="2">
                  <h3> Contacto </h3>
                  <br />
                  <Row>
                    <Col sm="6">
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="telefono1"
                        labelName="Telefono1:"
                        defaultValue={form.telefono1 ? form.telefono1 : form.telefono1}
                      />
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="telefono2"
                        labelName="Telefono2:"
                        defaultValue={form.telefono2 ? form.telefono2 : form.telefono2}
                      />
                    </Col>
                    <Col sm="6">
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="email"
                        labelName="Email:"
                        defaultValue={form.email ? form.email : form.email}
                      />
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tabId="3">
                  <h3> Adicional </h3>
                  <br />
                  <Row>
                    <Col>
                      <CFormGroupInput handleChange={handleChange} inputName="RFC" labelName="Rfc:" defaultValue={form.RFC ? form.RFC : form.RFC} />
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="CURP"
                        labelName="Curp:"
                        defaultValue={form.CURP ? form.CURP : form.CURP}
                      />
                      <CFormGroupInput handleChange={handleChange} inputName="imss" labelName="Imss:" defaultValue={form ? form.imss : ""} />
                      <Label>Departamento</Label>
                      <Input type="select" name="idDepartamento" id="exampleSelect" value={form.idDepartamento} onChange={handleChange}>
                        <option value={0}>--Selecciona una opción--</option>
                        {dataNominaDepartamentos.map((depto) => (
                          <option value={depto.id}>{depto.descripcion_departamento} </option>
                        ))}
                      </Input>
                    </Col>
                    <Col>
                      <CFormGroupInput
                        handleChange={handleChange}
                        inputName="observaciones"
                        labelName="Observaciones:"
                        defaultValue={form ? form.observaciones : ""}
                      />
                      <div style={{ marginBottom: 20 }}></div>
                      <Label>Nivel de escolaridad</Label>
                      <Input type="select" name="nivel_escolaridad" id="nivel_escolaridad" value={form.nivel_escolaridad} onChange={handleChange}>
                        <option value={0}>--Selecciona una opción--</option>
                        {dataNominaNivel.map((escolaridad) => (
                          <option value={escolaridad.id}>{escolaridad.descripcion_baja} </option>
                        ))}
                      </Input>
                      <div style={{ marginBottom: 10 }}></div>
                      <Label>Puesto</Label>
                      <Input type="select" name="idPuesto" id="exampleSelect" value={form.idPuesto} onChange={handleChange}>
                        <option value={0}>--Selecciona una opción--</option>
                        {dataNominaPuestos.map((puesto) => (
                          <option value={puesto.clave_puesto}>{puesto.descripcion_puesto}</option>
                        ))}
                      </Input>
                      <br />
                    </Col>
                  </Row>
                  <div className="d-flex "></div>
                </TabPane>
                <TabPane tabId="4">
                  <h3>Bajas</h3>
                  <br />
                  <Container>
                    <Row>
                      <Col sm="4">
                        <Label for="exampleDate">Fecha de baja</Label>
                        <Input
                          id="exampleDate"
                          name="fecha_baja"
                          placeholder="date placeholder"
                          type="date"
                          onChange={handleChange}
                          defaultValue={form.fecha_baja ? form.fecha_baja.split("T")[0] : ""}
                        />
                      </Col>
                      <Col sm="4">
                        <CFormGroupInput
                          handleChange={handleChange}
                          inputName="motivo_baja"
                          labelName="Motivo de baja:"
                          defaultValue={form ? form.motivo_baja : ""}
                        />
                      </Col>

                      <Col sm="4">
                        <CFormGroupInput
                          handleChange={handleChange}
                          inputName="motivo_baja_especificacion"
                          labelName="Especificación de motivo de baja:"
                          defaultValue={form ? form.motivo_baja_especificacion : ""}
                        />
                      </Col>
                    </Row>
                  </Container>
                </TabPane>
                <br />
                <br />
                <Button onClick={editarTrabajador}> {"Editar trabajador"} </Button>
                <br />
                <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
              </TabContent>
            </Card>
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cerrar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Insertar Personaje</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" />
          <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" />
          <CFormGroupInput handleChange={handleChange} inputName="idClinica" labelName="Id Clinica:" />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={() => insertar()} text="Insertar" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default NominaTrabajadores;
