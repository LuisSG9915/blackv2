import React, { useState } from "react";
import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
import { jezaApi } from "../../api/jezaApi";
import { Cia } from "../../models/Cia";
import { Perfil } from "../../models/Perfil";
import AlertComponent from "../../components/AlertComponent";

function PerfilesCrear() {
  const { modalInsertar, setModalInsertar } = useModalHook();

  const [form, setForm] = useState<Perfil>({
    clave_perfil: 1,
    descripcion_perfil: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: Perfil) => ({ ...prevState, [name]: value }));
  };

  const insertar = () => {
    jezaApi
      .post("/Perfil", null, {
        params: {
          descripcion: form.descripcion_perfil,
        },
      })
      .then(() => setVisible(true))
      .catch((error) => console.log(error));
  };
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const onDismiss = () => setVisible(false);

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <Container className="px-2">
        <h1> Crear Perfil </h1>
        <br />
        <FormGroup>
          <Row>
            <Col md="6" className="mb-4">
              <CFormGroupInput
                handleChange={handleChange}
                inputName="descripcion_perfil"
                labelName="Descripción del perfil:"
                value={form.descripcion_perfil}
              />
            </Col>
          </Row>
        </FormGroup>
        <Button onClick={insertar}>Guardar Perfil</Button>
        <br />
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
      </Container>
    </>
  );
}

export default PerfilesCrear;
