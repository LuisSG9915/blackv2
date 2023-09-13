import React, { useState, useEffect } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Input, Label, Container, Button, FormGroup } from "reactstrap";
import { jezaApi } from "../api/jezaApi";
import CFormGroupInput from "../components/CFormGroupInput";
import { Trabajador } from "../models/Trabajador";
import AlertComponent from "../components/AlertComponent";
import useAlerts from "../hooks/useAlerts";
import { useNominaPuestos } from "../hooks/getsHooks/useNominaPuestos";
import { useNominaDepartamentos } from "../hooks/getsHooks/useNominaDepartamentos";
import { useNominaEscolaridad } from "../hooks/getsHooks/useNominaEscolaridad";

interface props {
  form2?: Trabajador;
  setForm2?: React.Dispatch<React.SetStateAction<Trabajador>>;
  getTrabajador?: () => void;
}

function TabPrueba({ form2, getTrabajador }: props) {
  const [visible, setVisible] = useState(false);

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);

  const { dataNominaPuestos } = useNominaPuestos();
  const { dataNominaDepartamentos } = useNominaDepartamentos({ cia: 0 });
  const { dataNominaNivel } = useNominaEscolaridad();
  const [form, setForm] = useState<Trabajador>({
    clave_empleado: "",
    status: 1,
    nombre: "",
    fecha_nacimiento: "",
    sexo: "",
    RFC: "",
    CURP: "",
    imss: "",
    domicilio: "",
    colonia: "",
    poblacion: "",
    estado: "",
    lugar_nacimiento: "",
    codigo_postal: "",
    telefono1: "",
    telefono2: "",
    email: "",
    idDepartamento: 0,
    idPuesto: 0,
    observaciones: "",
    nivel_escolaridad: 0,
    fecha_baja: "",
    motivo_baja: 0,
    motivo_baja_especificacion: "",
    fecha_alta: "",
    fecha_cambio: "",
    d_estatus: "",
    id: 0,
    descripcion_puesto: "",
    descripcion_departamento: "",
    d_nivelEscolaridad: "",
    d_motiboBaja: "",
  });
  useEffect(() => {
    if (form2) {
      setForm(form2);
      console.log({ form });
    }
  }, [form2]);

  const insertar = () => {
    const fechaHoy = new Date();
    console.log({ form });
    jezaApi
      .post("/Trabajador", null, {
        params: {
          clave_empleado: "1",
          status: form.status,
          nombre: form.nombre,
          fecha_nacimiento: form.fecha_nacimiento,
          sexo: "M",
          RFC: form.RFC,
          CURP: form.CURP,
          imss: form.imss,
          domicilio: form.domicilio,
          colonia: form.colonia,
          poblacion: form.poblacion,
          estado: form.estado,
          lugar_nacimiento: form.lugar_nacimiento,
          codigo_postal: form.codigo_postal,
          telefono1: form.telefono1,
          telefono2: form.telefono2,
          email: form.email,
          idDepartamento: Number(form.idDepartamento),
          idPuesto: Number(form.idPuesto),
          observaciones: form.observaciones,
          nivel_escolaridad: Number(form.nivel_escolaridad),
          fecha_baja: form.fecha_baja,
          motivo_baja: form.motivo_baja,
          motivo_baja_especificacion: form.motivo_baja_especificacion,
          fecha_alta: fechaHoy,
          fecha_cambio: fechaHoy,
        },
      })
      .then((response) => {
        setVisible(true);
        console.log("hecho");
        getTrabajador();
      })
      .catch((e) => {
        console.log("no");
        console.log(e);
      });
  };
  const editar = () => {
    const fechaHoy = new Date();

    console.log(form.id);
    jezaApi
      .put(`/Trabajador?id=${form.id}`, null, {
        params: {
          clave_empleado: "112",
          status: form.status,
          nombre: form.nombre,
          fecha_nacimiento: form.fecha_nacimiento.split("T")[0],
          sexo: form.sexo,
          RFC: form.RFC,
          CURP: form.CURP,
          imss: form.imss,
          domicilio: form.domicilio,
          colonia: form.colonia,
          poblacion: form.poblacion,
          estado: form.estado,
          lugar_nacimiento: form.lugar_nacimiento,
          codigo_postal: form.codigo_postal,
          telefono1: form.telefono1,
          telefono2: form.telefono2,
          email: form.email,
          idDepartamento: form.idDepartamento,
          idPuesto: form.idPuesto,
          observaciones: form.observaciones,
          nivel_escolaridad: form.nivel_escolaridad,
          fecha_baja: form.fecha_baja.split("T")[0],
          motivo_baja: form.motivo_baja,
          motivo_baja_especificacion: form.motivo_baja_especificacion,
          fecha_alta: form.fecha_alta,
          fecha_cambio: fechaHoy,
        },
      })
      .then(() => {
        setVisible(true);
        getTrabajador();
        console.log("no");
      })
      .catch((e) => {
        console.log(e);
        console.log("no");
      });
  };
  const accion = () => {
    if (form2) {
      editar();
      console.log("a");
    } else {
      insertar();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <Nav tabs>
        <NavItem>
          <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
            Trabajador
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
            Contacto
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")}>
            Adicional
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === "4" ? "active" : ""} onClick={() => toggleTab("4")}>
            Bajas
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <br />
        <TabPane tabId="1">
          <h3> Información del trabajador </h3>
          <br />
          <Row>
            <Col sm="4">
              <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" defaultValue={form ? form.nombre : ""} />
              <CFormGroupInput
                handleChange={handleChange}
                inputName="domicilio"
                labelName="Domicilio:"
                defaultValue={form?.domicilio ? form.domicilio : form.domicilio}
              />
              <Label>Sexo</Label>
              <Input className="mb-3" type="select" onChange={handleChange} name="sexo" value={form.sexo ? form.sexo : form.sexo}>
                <option value={"M"}>Masculino</option>
                <option value={"F"}>Femenino</option>
              </Input>
              {/* <CFormGroupInput handleChange={handleChange} inputName="sexo" labelName="sexo:" defaultValue={form ? form.sexo : form.sexo} /> */}
            </Col>
            <Col sm="4">
              <CFormGroupInput
                handleChange={handleChange}
                inputName="colonia"
                labelName="Colonia:"
                defaultValue={form.colonia ? form.colonia : form.colonia}
              />
              <CFormGroupInput
                handleChange={handleChange}
                inputName="poblacion"
                labelName="Población:"
                defaultValue={form.poblacion ? form.poblacion : form.poblacion}
              />

              <FormGroup>
                <Label for="exampleDate">Fecha de nacimiento</Label>
                <Input
                  id="exampleDate"
                  name="fecha_nacimiento"
                  placeholder="date placeholder"
                  type="date"
                  onChange={handleChange}
                  defaultValue={form.fecha_nacimiento ? form.fecha_nacimiento : form.fecha_nacimiento}
                />
              </FormGroup>
            </Col>
            <Col sm="4">
              <CFormGroupInput
                handleChange={handleChange}
                inputName="estado"
                labelName="Estado:"
                defaultValue={form.estado ? form.estado : form.estado}
              />
              <CFormGroupInput
                handleChange={handleChange}
                inputName="lugar_nacimiento"
                labelName="Lugar de nacimiento:"
                defaultValue={form.lugar_nacimiento ? form.lugar_nacimiento : form.lugar_nacimiento}
              />

              <div className="mb-3"></div>
              <CFormGroupInput
                handleChange={handleChange}
                inputName="codigo_postal"
                labelName="Código Postal:"
                value={form.codigo_postal ? form.codigo_postal : form.codigo_postal}
              />
            </Col>
          </Row>
          <br />
        </TabPane>
        <TabPane tabId="2">
          <h3> Contacto </h3>
          <br />
          <Row>
            <Col sm="6">
              <CFormGroupInput
                handleChange={handleChange}
                inputName="telefono1"
                labelName="Telefono1:"
                defaultValue={form.telefono1 ? form.telefono1 : form.telefono1}
              />
              <CFormGroupInput
                handleChange={handleChange}
                inputName="telefono2"
                labelName="Telefono2:"
                defaultValue={form.telefono2 ? form.telefono2 : form.telefono2}
              />
            </Col>
            <Col sm="6">
              <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" defaultValue={form.email ? form.email : form.email} />
            </Col>
          </Row>
        </TabPane>

        <TabPane tabId="3">
          <h3> Adicional </h3>
          <br />
          <Row>
            <Col>
              <CFormGroupInput handleChange={handleChange} inputName="RFC" labelName="Rfc:" defaultValue={form.RFC ? form.RFC : form.RFC} />
              <CFormGroupInput handleChange={handleChange} inputName="CURP" labelName="Curp:" defaultValue={form.CURP ? form.CURP : form.CURP} />
              <CFormGroupInput handleChange={handleChange} inputName="imss" labelName="Imss:" defaultValue={form ? form.imss : ""} />
              <Label>Departamento</Label>
              <Input type="select" name="idDepartamento" id="exampleSelect" value={form.idDepartamento} onChange={handleChange}>
                <option value={0}>--Selecciona una opción--</option>
                {dataNominaDepartamentos.map((depto) => (
                  <option value={depto.id}>{depto.descripcion_departamento} </option>
                ))}
              </Input>
            </Col>
            <Col>
              <CFormGroupInput
                handleChange={handleChange}
                inputName="observaciones"
                labelName="Observaciones:"
                defaultValue={form ? form.observaciones : ""}
              />
              <div style={{ marginBottom: 20 }}></div>
              <Label>Nivel de escolaridad</Label>
              <Input type="select" name="nivel_escolaridad" id="nivel_escolaridad" value={form.nivel_escolaridad} onChange={handleChange}>
                <option value={0}>--Selecciona una opción--</option>
                {dataNominaNivel.map((escolaridad) => (
                  <option value={escolaridad.id}>{escolaridad.descripcion_baja} </option>
                ))}
              </Input>
              <div style={{ marginBottom: 10 }}></div>
              <Label>Puesto</Label>
              <Input type="select" name="idPuesto" id="exampleSelect" value={form.idPuesto} onChange={handleChange}>
                <option value={0}>--Selecciona una opción--</option>
                {dataNominaPuestos.map((puesto) => (
                  <option value={puesto.clave_puesto}>{puesto.descripcion_puesto}</option>
                ))}
              </Input>
              <br />
            </Col>
          </Row>
          <div className="d-flex "></div>
        </TabPane>
        <TabPane tabId="4">
          <h3>Bajas</h3>
          <br />
          <Container>
            <Row>
              <Col sm="4">
                <Label for="exampleDate">Fecha de baja</Label>
                <Input
                  id="exampleDate"
                  name="fecha_baja"
                  placeholder="date placeholder"
                  type="date"
                  onChange={handleChange}
                  defaultValue={form ? form.fecha_baja : ""}
                />
              </Col>
              <Col sm="4">
                <CFormGroupInput
                  handleChange={handleChange}
                  inputName="motivo_baja"
                  labelName="Motivo de baja:"
                  defaultValue={form ? form.motivo_baja : ""}
                />
              </Col>

              <Col sm="4">
                <CFormGroupInput
                  handleChange={handleChange}
                  inputName="motivo_baja_especificacion"
                  labelName="Especificación de motivo de baja:"
                  defaultValue={form ? form.motivo_baja_especificacion : ""}
                />
              </Col>
            </Row>
          </Container>
        </TabPane>
        <br />
        <br />
        <Button onClick={accion}> {form ? "Editar Nomina Trabajador" : "Crear Nomina Trabajador"} </Button>
        <br />
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
      </TabContent>
    </>
  );
}

export default TabPrueba;
