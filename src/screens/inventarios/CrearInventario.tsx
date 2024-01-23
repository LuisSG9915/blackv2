import React, { useState } from "react";
import useReadHook, { Forma } from "../../hooks/useReadHook";
import { useNavigate } from "react-router-dom";
import useModalHook from "../../hooks/useModalHook";
// import { jezaApi } from "../../api/jezaApi";
import { Row, FormGroup, Col, Button, Alert, Container, Card, Modal, ModalHeader, ModalBody, Input, Table, ModalFooter, Label } from "reactstrap";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import TabPrueba from "../TabPrueba";
import JezaApiService from "../../api/jezaApi2";

function CrearInventario() {
  const { jezaApi } = JezaApiService();
  const { data: data1, llamada: llamada1, setdata } = useReadHook({ url: "Clinica" });
  const { modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } = useModalHook();
  const Data = ["ID", "Clinica", "Acciones"];
  const [filtroValorClinica, setFiltroValorClinica] = useState("");
  const [dataClinica, setDataClinica] = useState<undefined | string>("");
  const [dataClinicaID, setDataClinicaID] = useState<undefined | number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isOk, setIsOk] = useState<string>("false");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState<Forma>({
    id: 1,
    nombre: "",
    email: "",
    idClinica: 1,
    nombreClinica: "",
    telefono: "",
    mostrarTel: false,
  });
  const mostrarModalActualizar = (dato: Forma) => {
    setForm(dato);
    setModalActualizar(true);
  };
  const handleNav = () => {
    navigate("/UsuariosCrear");
  };
  const [filtroValorMedico, setFiltroValorMedico] = useState("");

  const filtroMédico = (datoMedico: string) => {
    var resultado = data1.filter((elemento: any) => {
      if (elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase()) && elemento.nombre.length > 2) {
        return elemento;
      }
    });
    setdata(resultado);
  };
  const filtroEmail = (datoMedico: string, datoEmail: string) => {
    var resultado = data1.filter((elemento: any) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if (
        (datoEmail === "" || elemento.email.toLowerCase().includes(datoEmail.toLowerCase())) &&
        (datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) &&
        elemento.nombre.length > 2
      ) {
        return elemento;
      }
    });
    setdata(resultado);
  };
  const eliminar = (dato: Forma) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      jezaApi.delete(`/Medico?idMedico=${dato.id}`).then(() => {
        setModalActualizar(false);
        llamada1();
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };
  const DataTableHeader = ["Usuario", "Nombre", "Celular", "Telefono", "Email", "Fecha Alta", "Fecha Actualización", "Acciones"];

  // const insertar = () => {
  //   jezaApi
  //     .post("/Medico", {
  //       nombre: form.nombre,
  //       email: form.email,
  //       idClinica: dataClinicaID,
  //       telefono: "",
  //       mostrarTel: false,
  //     })
  //     .then(() => {
  //       llamada1();
  //     });
  //   setModalInsertar(false);
  // };
  const insertar2 = () => {
    if (form.nombre === "" || form.email === "") {
      console.log("nada");
      setIsOk("no");
    } else {
      setIsClicked(true);
      setIsLoading(true);
      jezaApi
        .post("/Medico", {
          nombre: form.nombre,
          email: form.email,
          idClinica: dataClinicaID,
          telefono: "",
          mostrarTel: false,
        })
        .then(() => {
          llamada1();
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          setIsOk("si");
        });
      setModalInsertar(false);
    }
  };

  function onDismiss(): void {
    setIsClicked(false);
    setForm({
      id: 1,
      nombre: "",
      email: "",
      idClinica: 1,
      nombreClinica: "",
      telefono: "",
      mostrarTel: false,
    });
    setDataClinica("");
  }

  return (
    <>
      <>
        <Row>
          <SidebarHorizontal />
        </Row>
        <br />
        <div className="container px-2 ">
          <h1> Crear Inventario </h1>
          <br />
          <FormGroup>
            <Label for="exampleSelect">Sucursal</Label>
            <Row className="align-items-center">
              <Col sm={"9"} m={"8"} lg={"10"} xs>
                <Input className="" id="idClinica" name="select" type="text" value={dataClinica}></Input>
              </Col>
              <Col>
                <Button className="" color="success" onClick={() => mostrarModalInsertar()}>
                  Seleccionar Clinica
                </Button>
              </Col>
            </Row>
            <Label>Almacen</Label>
            <Input value={""}></Input>

            <Label for="exampleSelect">Fecha Movimiento</Label>
            <Row className="align-items-center">
              <Col sm={"9"} m={"8"} lg={"10"} xs>
                <Input className="" id="idClinica" name="select" type="text" value={dataClinica}></Input>
              </Col>
              <Col>
                <Button className="" color="success" onClick={() => mostrarModalInsertar()}>
                  Seleccionar Fecha Mov
                </Button>
              </Col>
            </Row>

            <Label for="exampleSelect">Folio Movto</Label>
            <Row className="align-items-center">
              <Col sm={"9"} m={"8"} lg={"10"} xs>
                <Input className="" id="idClinica" name="select" type="text" value={dataClinica}></Input>
              </Col>
              <Col>
                <Button className="" color="success" onClick={() => mostrarModalInsertar()}>
                  Seleccionar Movto
                </Button>
              </Col>
            </Row>

            <Label>Cantidad Entrada</Label>
            <Input value={""}></Input>
            <Label>Cantidad Salida</Label>
            <Input value={""}></Input>
          </FormGroup>
          <br />
          <br />
          <div className="8bnm">
            {/* <CButton color="success" onClick={() => insertar()} text="Crear Médico"></CButton> */}
            <div>
              <Button onClick={() => insertar2()}> Crear Usuario </Button>
              {/* {isClicked && !isLoading ? <div>✅</div> : null}
              {isClicked && isLoading ? <Dots/> : null} */}
            </div>
            <br />
            <Alert color="success" isOpen={isClicked} toggle={onDismiss}>
              Usuario creado con éxito
            </Alert>
          </div>
        </div>
        <br />
        <Container>
          <Card body>
            <TabPrueba></TabPrueba>
          </Card>
        </Container>
        <Modal isOpen={modalInsertar} size={"xl"} fade hover>
          <ModalHeader>
            <div>
              <h3>Selecciona Médico</h3>
            </div>
            <br />
            <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cerrar ventana" />
            <br />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Container>
                <label> Nombre Clinica </label>
                <Input
                  type="text"
                  onChange={(e) => {
                    setFiltroValorClinica(e.target.value);
                  }}
                ></Input>
              </Container>
              <br />

              <CButton color="success" onClick={() => filtroMédico(filtroValorClinica)} text="Filtro"></CButton>
              <br />
              <Table responsive striped>
                <thead>
                  <tr>
                    {Data.map((valor) => (
                      <th key={valor}>{valor}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data1.map((dato: Forma) => (
                    <tr key={dato.id}>
                      <td>{dato.id}</td>
                      <td>{dato.nombre}</td>
                      <td>
                        <CButton
                          color="success"
                          onClick={() => {
                            setDataClinica(dato.nombre);
                            setDataClinicaID(dato.id);
                            cerrarModalInsertar();
                          }}
                          text="Seleccionar"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </FormGroup>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </>
    </>
  );
}

export default CrearInventario;
