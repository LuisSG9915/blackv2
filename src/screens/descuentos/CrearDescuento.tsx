import React, { useState } from "react";
import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
import { jezaApi } from "../../api/jezaApi";
import { Cia } from "../../models/Cia";
import { Perfil } from "../../models/Perfil";
import { Descuento } from "../../models/Descuento";

function CrearDescuento() {
  const { modalInsertar, setModalInsertar } = useModalHook();

  const [form, setForm] = useState<Descuento>({
    id: 0,
    descripcion: "",
    min_descto: 0.0,
    max_descto: 0.0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: Descuento) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const insertar = () => {
    jezaApi
      .post("/Tipodescuento", null, {
        params: {
          descripcion: form.descripcion,
          min_descto: form.min_descto,
          max_descto: form.max_descto,
        },
      })
      .then(() => {
        console.log("Realizado");
      });
    setModalInsertar(false);
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <Container className="px-2">
        <h1> Crear Descuento Autorizado </h1>
        <br />
        <FormGroup>
          <Row>
            <Col md="6" className="mb-4">
              <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName=" Descripción:" />
              <CFormGroupInput handleChange={handleChange} inputName="min_descto" labelName=" Minimo descuento:" />
              <CFormGroupInput handleChange={handleChange} inputName="max_descto" labelName=" Máximo descuento:" />
            </Col>
          </Row>
        </FormGroup>
        <Button onClick={insertar}>Guardar Descuento</Button>
      </Container>
    </>
  );
}

export default CrearDescuento;
