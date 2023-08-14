import React, { useState } from "react";
import { Button, Col, FormGroup, Row } from "reactstrap";
import SidebarHorizontal from "../components/SidebarHorizontal";
import CFormGroupInput from "../components/CFormGroupInput";
import { Forma } from "../hooks/useReadHook";

function NominaTrabajadorBaja() {
  const [form, setForm] = useState<Forma>({
    id: 1,
    nombre: "",
    email: "",
    idClinica: 1,
    nombreClinica: "",
    telefono: "",
    mostrarTel: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };
  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <div className="container px-2 ">
        <h1> Baja trabajador </h1>
        <br />
        <FormGroup>
          <Row>
            {/* Debe de coincidir el inputname con el value */}
            <CFormGroupInput handleChange={handleChange} inputName="descripcion_baja" labelName="Causa de Baja:" value={form.nombre} />
          </Row>
          <br />
          <div className="d-flex justify-content-end">
            <Button>Registrar Causa </Button>
          </div>
        </FormGroup>
      </div>
    </>
  );
}

export default NominaTrabajadorBaja;
