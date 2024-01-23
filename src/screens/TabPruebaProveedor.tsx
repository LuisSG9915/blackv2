import React, { useState, useEffect } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Input, Label, Container, Button } from "reactstrap";
import CFormGroupInput from "../components/CFormGroupInput";
import AlertComponent from "../components/AlertComponent";
// import { jezaApi } from "../api/jezaApi";
import { Proveedor } from "../models/Proveedor";
import JezaApiService from "../api/jezaApi2";
interface Props {
  estado: string;
  actualizarModalEstado: () => void;
  form?: any;
}
function TabPruebaProveedor({ estado, actualizarModalEstado, form }: Props) {
  const { jezaApi } = JezaApiService();
  const [form2, setForm2] = useState<Proveedor>({
    id: 1,
    nombre: "",
    rfc: "",
    calle: "",
    colonia: "",
    telefono: "",
    ciudad: "",
    estado: "",
    cp: "",
    contacto: "",
    email: "",
    observaciones: "",
    nombre_fiscal: "",
    dias_financiamiento: 1,
    fecha_alta: "",
    fecha_act: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm2((prevState: any) => ({ ...prevState, [name]: value }));
    console.log({ form2 });
  };

  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    setForm2(form);
    console.log({ form2 });
  }, [form]);

  const editar = () => {
    jezaApi
      .put(`/Proveedor`, null, {
        params: {
          id: 1,
          nombre: "",
          rfc: "",
          calle: "",
          colonia: "",
          telefono: "",
          ciudad: "",
          estado: "",
          cp: "",
          contacto: "",
          email: "",
          observaciones: "",
          nombre_fiscal: "",
          dias_financiamiento: 1,
          fecha_alta: "",
          fecha_act: "",
        },
      })
      .then(() => console.log(form2));
  };

  const insertar = () => {
    jezaApi
      .post("/Proveedor", null, {
        params: {},
      })
      .then(() => { });
  };

  const [visible, setVisible] = useState(false);

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);
  return (
    <>
      <Nav tabs>
        <NavItem>
          <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
            Datos del proveedor
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
            Datos de localización
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <br />
          <Row>
            <Col md={"6"}>
              <CFormGroupInput defaultValue={form ? form.nombre : ""} handleChange={handleChange} inputName="nombre" labelName="Nombre:" />
              <CFormGroupInput defaultValue={form ? form.telefono : ""} handleChange={handleChange} inputName="telefono" labelName="Telefono:" />
              <CFormGroupInput defaultValue={form ? form.dias_financiamiento : ""} handleChange={handleChange} inputName="dias_financiamiento" labelName="Días financiamiento :" />
              <CFormGroupInput defaultValue={form ? form.observaciones : ""} handleChange={handleChange} inputName="observaciones" labelName="Observaciones:" />
            </Col>
            <Col md={"6"}>
              <CFormGroupInput defaultValue={form ? form.contacto : ""} handleChange={handleChange} inputName="contacto" labelName="Contacto:" />
              <CFormGroupInput defaultValue={form ? form.rfc : ""} handleChange={handleChange} inputName="rfc" labelName="RFC:" />
              <CFormGroupInput defaultValue={form ? form.email : ""} handleChange={handleChange} inputName="email" labelName="Email:" />
              <CFormGroupInput defaultValue={form ? form.nombre_fiscal : ""} handleChange={handleChange} inputName="nombre_fiscal" labelName="Nombre Fiscal:" />
            </Col>
          </Row>
          <br />
        </TabPane>
        <TabPane tabId="2">
          <br />
          <Row>
            <Col md={"6"}>
              <CFormGroupInput defaultValue={form ? form.calle : ""} handleChange={handleChange} inputName="calle" labelName="Calle:" />
              <CFormGroupInput defaultValue={form ? form.estado : ""} handleChange={handleChange} inputName="estado" labelName="Estado:" />
              <CFormGroupInput defaultValue={form ? form.ciudad : ""} handleChange={handleChange} inputName="ciudad" labelName="Ciudad:" />
            </Col>
            <Col md={"6"}>
              <CFormGroupInput defaultValue={form ? form.colonia : ""} handleChange={handleChange} inputName="colonia" labelName="Colonia:" />
              <CFormGroupInput defaultValue={form ? form.cp : ""} handleChange={handleChange} inputName="cp" labelName="CP:" />
            </Col>
          </Row>
        </TabPane>
        <br />
        <Button
          onClick={() => {
            actualizarModalEstado();
            editar();
          }}
          color="primary"
          style={{ marginRight: 10 }}
        >
          {estado === "insert" ? "Insertar" : "Editar"}
        </Button>
        <Button color="danger" onClick={actualizarModalEstado}>
          Salir
        </Button>
        <br />
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
      </TabContent>
    </>
  );
}

export default TabPruebaProveedor;
