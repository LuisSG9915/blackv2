import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Col, Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Label, Input, Container, Row, Card, Alert } from "reactstrap";

import useReadHook, { Forma, DataClinica } from "../hooks/useReadHook";
import useModalHook from "../hooks/useModalHook";

import CFormGroupInput from "../components/CFormGroupInput";
import CButton from "../components/CButton";
import { jezaApi } from "../api/jezaApi";
import SidebarHorizontal from "../components/SidebarHorizontal";
import TabPrueba from "./TabPrueba";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
function Menu() {
  const { data: data1, llamada: llamada1, setdata } = useReadHook({ url: "Clinica" });
  const { modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } = useModalHook();
  const Data = ["ID", "Clinica", "Acciones"];
  const [filtroValorClinica, setFiltroValorClinica] = useState("");
  const [dataClinica, setDataClinica] = useState<undefined | string>("");
  const [dataClinicaID, setDataClinicaID] = useState<undefined | number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isOk, setIsOk] = useState<string>("false");

  const [form, setForm] = useState<Forma>({
    id: 1,
    nombre: "",
    email: "",
    idClinica: 1,
    nombreClinica: "",
    telefono: "",
    mostrarTel: false,
  });
  const [visible, setVisible] = useState(true);

  const onDismiss2 = () => setVisible(false);
  const filtroMédico = (datoMedico: string) => {
    var resultado = data1.filter((elemento: any) => {
      if (elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase()) && elemento.nombre.length > 2) {
        return elemento;
      }
    });
    setdata(resultado);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

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

  // function onDismiss(): void {
  //   setIsClicked(false);
  //   setForm({
  //     id: 1,
  //     nombre: "",
  //     email: "",
  //     idClinica: 1,
  //     nombreClinica: "",
  //     telefono: "",
  //     mostrarTel: false,
  //   });
  //   setDataClinica("");
  // }

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <div className="container px-2 ">
        <h1> Crear Médicos </h1>
        <br />
        <div className="flex-row align-content-md-end">
          <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Medico:" value={form.nombre} />
        </div>
        <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" value={form.email} />
        <FormGroup>
          <Label for="exampleSelect">Clinica</Label>
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
        </FormGroup>
        <br />
        <br />
        <div className="8bnm">
          {/* <CButton color="success" onClick={() => insertar()} text="Crear Médico"></CButton> */}
          <div>
            <Button onClick={() => insertar2()}> Crear Médico </Button>
            {/* {isClicked && !isLoading ? <div>✅</div> : null}
              {isClicked && isLoading ? <Dots/> : null} */}
          </div>
          <br />
          <Alert color="success" isOpen={isClicked} toggle={onDismiss}>
            Médico creado con éxito
          </Alert>
        </div>
        <Alert color="success" isOpen={visible} toggle={onDismiss2}>
          Se han realizado los registros de manera correcta
        </Alert>
        <Alert color="danger" isOpen={visible} toggle={onDismiss2}>
          No se ha realizado el registro
        </Alert>
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
  );
}

export default Menu;
