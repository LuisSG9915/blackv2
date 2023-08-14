import React, { useState, useEffect } from "react";
import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
import { jezaApi } from "../../api/jezaApi";
import { useNavigate } from "react-router-dom";
import { Almacen } from "../../models/Almacen";
import { Cia } from "../../models/Cia";
import { Sucursal } from "../../models/Sucursal";
import AlertComponent from "../../components/AlertComponent";
import { useCias } from "../../hooks/getsHooks/useCias";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";

function AlmacenCrear() {
  const { dataCias } = useCias();
  const { dataSucursales } = useSucursales();
  const [form, setForm] = useState<Almacen>({
    cia: 1,
    sucursal: 0,
    almacen: 0,
    descripcion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: Almacen) => ({ ...prevState, [name]: value }));
  };

  const insertar = () => {
    jezaApi
      .post("/Almacen", null, {
        params: {
          cia: Number(form.cia),
          sucursal: Number(form.sucursal),
          almacen: form.almacen,
          descripcion: form.descripcion,
        },
      })
      .then(() => {
        setVisible(true);
      })
      .catch((error) => {
        // Handle error here
        console.log(error);
      });
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
        <h1> Crear Almacen </h1>
        <br />
        <FormGroup>
          <Row>
            <Col md="6" className="mb-4">
              <Label>Cia</Label>
              <Input type="select" name="cia" id="exampleSelect" value={form.cia} onChange={handleChange}>
                <option value="">Selecciona compañia</option>
                {dataCias.map((cia) => (
                  <option key={cia.id} value={cia.id}>
                    {cia.nombre}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md="6">
              <Label>Sucursal</Label>
              <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
                <option value="">Selecciona sucursal</option>
                {dataSucursales.map((sucursal) => (
                  <option key={sucursal.sucursal} value={sucursal.sucursal}>
                    {sucursal.nombre}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md="6">
              <CFormGroupInput handleChange={handleChange} inputName="almacen" labelName="Almacen:" value={form.almacen} />
            </Col>
            <Col md="6">
              <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripcion:" value={form.descripcion} />
            </Col>
          </Row>
        </FormGroup>
        <Button onClick={insertar}>Guardar almacen</Button>
        <br />
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
      </Container>
    </>
  );
}

export default AlmacenCrear;
