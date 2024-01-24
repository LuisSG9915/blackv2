import React, { useState } from "react";
import { Alert, Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
// import { jezaApi } from "../../api/jezaApi";
import { Cia } from "../../models/Cia";
import AlertComponent from "../../components/AlertComponent";
import JezaApiService from "../../api/jezaApi2";

function CiasCrear() {
  const { jezaApi } = JezaApiService();
  const { modalInsertar, setModalInsertar } = useModalHook();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);

  const [form, setForm] = useState<Cia>({
    id: 1,
    cpFiscal: "",
    domicilio: "",
    nombre: "",
    regimenFiscal: "",
    rfc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: Cia) => ({ ...prevState, [name]: value }));
  };
  const onDismiss = () => setVisible(false);

  const insertar = () => {
    jezaApi
      .post("/Cia", null, {
        params: { nombre: form.nombre, rfc: form.rfc, domicilio: form.domicilio, regimenFiscal: form.regimenFiscal, cpFiscal: form.cpFiscal },
      })
      .then(() => {
        setVisible(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <Container className="px-2">
        <h1> Crear Cia </h1>
        <br />
        <FormGroup>
          <Row>
            <Col md="6">
              <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" value={form.nombre} />
            </Col>
            <Col md="6">
              <CFormGroupInput handleChange={handleChange} inputName="rfc" labelName="RFC:" value={form.rfc} />
            </Col>
            <Col md="6">
              <CFormGroupInput handleChange={handleChange} inputName="domicilio" labelName="Domicilio:" value={form.domicilio} />
            </Col>
            <Col md="6">
              <CFormGroupInput handleChange={handleChange} inputName="regimenFiscal" labelName="Regimen Fiscal:" value={form.regimenFiscal} />
            </Col>
            <Col md="6">
              <CFormGroupInput handleChange={handleChange} inputName="cpFiscal" labelName="Código Postal Fiscal:" value={form.cpFiscal} />
            </Col>
          </Row>
        </FormGroup>
        <Button onClick={insertar}>Guardar Cia</Button>
        <br />
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
      </Container>
    </>
  );
}

export default CiasCrear;
