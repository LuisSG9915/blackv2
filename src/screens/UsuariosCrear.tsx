import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import SidebarHorizontal from "../components/SidebarHorizontal";
import CButton from "../components/CButton";
import useReadHook from "../hooks/useReadHook";
import JezaApiService from "../api/jezaApi2";
import { useNavigate } from "react-router-dom";
import useModalHook from "../hooks/useModalHook";
import CFormGroupInput from "../components/CFormGroupInput";
import { Usuario } from "../models/Usuario";
import { Perfil } from "../models/Perfil";

function UsuariosCrear() {
  const { jezaApi } = JezaApiService();

  const { modalInsertar, setModalActualizar, cerrarModalInsertar } = useModalHook();
  const Data = ["ID", "Clinica", "Acciones"];

  const [filtroValorClinica, setFiltroValorClinica] = useState("");
  const [data, setData] = useState([]);
  const [dataRoles, setDataRoles] = useState([]);
  const [visible, setVisible] = useState(false);

  const onDismiss = () => setVisible(false);
  const [form, setForm] = useState<Usuario>({
    celular: "",
    clave_perfil: 0,
    email: "",
    nombre: "",
    password: "",
    telefono: "",
    usuario: "",
  });

  const filtroMédico = (datoMedico: string) => {
    var resultado = data.filter((elemento: any) => {
      if (elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase()) && elemento.nombre.length > 2) {
        return elemento;
      }
    });
    setData(resultado);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const insertar = () => {
    jezaApi
      .post("/Usuario", null, {
        params: {
          usuario: form.usuario,
          clave_perfil: form.clave_perfil,
          password: form.password,
          nombre: form.nombre,
          celular: form.celular,
          telefono: form.telefono,
          email: form.email,
          fecha_alta: "2023-06-03",
          fecha_act: "2023-06-03",
        },
      })
      .then((response) => {
        setVisible(true);
        console.log(response);
      })
      .catch((e) => console.log(e));
  };

  const getRoles = () => {
    jezaApi.get("/Perfil?id=0").then((response) => {
      setDataRoles(response.data);
      console.log({ data });
    });
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <>
      <>
        <Row>
          <SidebarHorizontal />
        </Row>
        <br />
        <div className="container px-2 ">
          <h1> Crear Usuario </h1>
          <br />
          <FormGroup>
            <Row>
              {/* Debe de coincidir el inputname con el value */}
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="usuario" labelName="Usuario:" />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="password" labelName="Contraseña:" type="password" />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" />
              </Col>
              <Col md={"6"}>
                <Label>Rol de usuario</Label>
                <Input type="select" name="clave_perfil" id="clave_perfil" onChange={handleChange}>
                  <option value={0}>seleccione</option>
                  {dataRoles.map((perfil: Perfil) => (
                    <option value={perfil.clave_perfil}>{perfil.descripcion_perfil}</option>
                  ))}
                </Input>
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="celular" labelName="Celular:" />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="telefono" labelName="Telefono:" />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" />
              </Col>
            </Row>
            <Button onClick={insertar}>Guardar</Button>
            <Alert color="success" isOpen={visible} toggle={onDismiss}>
              Usuario creado con exito
            </Alert>
          </FormGroup>
          <br />
          <br />
          <div className="8bnm">
            <br />
          </div>
        </div>
        <br />
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
                  {data.map((dato: any) => (
                    <tr key={dato.id}>
                      <td>{dato.id}</td>
                      <td>{dato.nombre}</td>
                      <td>
                        <CButton
                          color="success"
                          onClick={() => {
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

export default UsuariosCrear;
