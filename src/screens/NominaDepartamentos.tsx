import React, { useState } from "react";
import { Row, Container, Button, FormGroup } from "reactstrap";
import SidebarHorizontal from "../components/SidebarHorizontal";
import { AiOutlineUser } from "react-icons/ai";
import CFormGroupInput from "../components/CFormGroupInput";
import { Forma } from "../hooks/useReadHook";

function NominaDepartamentos() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const [form, setForm] = useState<Forma>({
    id: 1,
    nombre: "",
    email: "",
    idClinica: 1,
    nombreClinica: "",
    telefono: "",
    mostrarTel: false,
  });
  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <div className="container px-2 ">
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Nomina de departamentos </h1>
          <AiOutlineUser size={30}></AiOutlineUser>
        </div>
        <br />
        <FormGroup>
          <Row>
            {/* Debe de coincidir el inputname con el value */}
            <CFormGroupInput handleChange={handleChange} inputName="descripcion_departamento" labelName="Departamento:" value={form.nombre} />
          </Row>
          <br />
          <div className="d-flex justify-content-end">
            <Button>Registrar Departamento </Button>
          </div>
        </FormGroup>
      </div>
    </>
  );
}

export default NominaDepartamentos;
