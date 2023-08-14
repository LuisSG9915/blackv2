import React, { useState, useEffect } from "react";
import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import CButton from "../../components/CButton";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
import { jezaApi } from "../../api/jezaApi";
import { useNavigate } from "react-router-dom";
import { Sucursal } from "../../models/Sucursal";
import { Cia } from "../../models/Cia";
import AlertComponent from "../../components/AlertComponent";
import { useCias } from "../../hooks/getsHooks/useCias";

function SucursalesCrear() {
  const { modalInsertar, setModalInsertar } = useModalHook();
  const [dataCia, setDataCia] = useState([]);
  const navigate = useNavigate();
  const { dataCias } = useCias();
  const [form, setForm] = useState<Sucursal>({
    sucursal: 1,
    direccion: "",
    en_linea: false,
    es_bodega: false,
    nombre: "",
    cia: 1,
  });
  const getCia = () => {
    jezaApi
      .get("/Cia?id=0")
      .then((response) => setDataCia(response.data))
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getCia();
  }, []);
  const [visible, setVisible] = useState(false);

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name);
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "en_linea" || name === "es_bodega") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: Sucursal) => ({ ...prevState, [name]: value }));
    }
    console.log(form);
  };

  const insertar = () => {
    jezaApi
      .post("/Sucursal", null, {
        params: {
          nombre: form.nombre,
          direccion: form.direccion,
          es_bodega: form.es_bodega,
          en_linea: form.en_linea,
          cia: Number(form.cia),
        },
      })
      .then(() => {
        setVisible(true);
      })
      .catch((error) => {
        setVisible(true);
        setError(true);
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
        <h1> Sucursales Crear </h1>
        <br />
        <FormGroup>
          <Row>
            <Col md="6">
              <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" value={form.nombre} />
            </Col>
            <Col md="6">
              <CFormGroupInput handleChange={handleChange} inputName="direccion" labelName="Dirección:" value={form.direccion} type="text" />
            </Col>
            <Col md="6" style={{ marginBottom: 25 }}>
              <Label>Cia</Label>
              <Input type="select" name="cia" id="cia" defaultValue={form.cia} onChange={handleChange}>
                <option value="">Escoja la compañia</option>
                {dataCias.map((cia: Cia) => (
                  <option key={cia.id} value={cia.id}>
                    {cia.nombre}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md="6">
              <br />
              <Label className="checkbox-container">
                <Input type="checkbox" checked={form.en_linea} onChange={handleChange} name="en_linea" />
                <span className="checkmark"></span>
                ¿En Linea?
              </Label>
            </Col>
            <Col md="6">
              <Label className="checkbox-container">
                <Input type="checkbox" checked={form.es_bodega} onChange={handleChange} name="es_bodega" />
                <span className="checkmark"></span>
                ¿Es bodega?
              </Label>
            </Col>
          </Row>
        </FormGroup>
        <Button onClick={insertar}>Guardar sucursal</Button>
        <br />
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
      </Container>
    </>
  );
}

export default SucursalesCrear;
