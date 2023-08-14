import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useReadHook from "../../hooks/useReadHook";
import useModalHook from "../../hooks/useModalHook";
import { Marca } from "../../models/Marca";
import { Cliente } from "../../models/Cliente";

function ClienteCrear() {
  const { modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } = useModalHook();
  const Data = ["ID", "Clinica", "Acciones"];
  const [dataClinica, setDataClinica] = useState<undefined | string>("");
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isOk, setIsOk] = useState<string>("false");
  const navigate = useNavigate();

  const [form, setForm] = useState<Cliente>({
    id_cliente: 0,
    nombre: "",
    domicilio: "",
    ciudad: "",
    estado: "",
    colonia: "",
    cp: "",
    rfc: "",
    telefono: "",
    email: "",
    nombre_fiscal: "",
    suspendido: false,
    sucursal_origen: 0,
    num_plastico: "",
    suc_asig_plast: 0,
    fecha_asig_plast: "",
    usr_asig_plast: "",
    plastico_activo: false,
    fecha_nac: "",
    correo_factura: "",
    regimenFiscal: "",
    claveRegistroMovil: "",
    fecha_alta: "",
    fecha_act: "",
  });

  const insertCliente = () => {
    /* CREATE */

    jezaApi
      .post(
        `/Cliente?nombre=${form.nombre}&domicilio=${form.domicilio}&ciudad=${form.ciudad}&estado=${form.estado}&colonia=${form.colonia}&cp=${form.cp}&telefono=${form.telefono}&email=${form.email}&fecha_nac=${form.fecha_nac}`
      )
      .then(() => {
        alert("Cliente creado con exito");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function onDismiss(): void {
    setIsClicked(false);
    setDataClinica("");
  }

  return (
    <>
      <>
        <Row>
          <SidebarHorizontal />
        </Row>
        <br />
        <div className="container px-2 ">
          <h1> Crear Cliente </h1>
          <br />
          <FormGroup>
            <Label>Nombre</Label>
            <Input
              type="text"
              name={"nombre"}
              onChange={(e) => setForm({ ...form, nombre: String(e.target.value) })}
              defaultValue={form.nombre}
              placeholder="Ingrese el nombre del cliente"
            ></Input>
            <Label>Domicilio:</Label>
            <Input
              type="text"
              name={"domicilio"}
              onChange={(e) => setForm({ ...form, domicilio: String(e.target.value) })}
              defaultValue={form.domicilio}
              placeholder="Ingrese el Domicilio del cliente"
            ></Input>
            <Label>Ciudad:</Label>
            <Input
              type="text"
              name={"ciudad"}
              onChange={(e) => setForm({ ...form, ciudad: String(e.target.value) })}
              defaultValue={form.ciudad}
              placeholder="Ingrese la Ciudad"
            ></Input>
            <Label>estado:</Label>
            <Input
              type="text"
              name={"Estado"}
              onChange={(e) => setForm({ ...form, estado: String(e.target.value) })}
              defaultValue={form.estado}
              placeholder="Ingrese el Estado"
            ></Input>
            <Label>Colonia:</Label>
            <Input
              type="text"
              name={"colonia"}
              onChange={(e) => setForm({ ...form, colonia: String(e.target.value) })}
              defaultValue={form.colonia}
              placeholder="Ingrese la Colonia"
            ></Input>
            <Label>Codigo Postal:</Label>
            <Input
              type="text"
              name={"cp"}
              onChange={(e) => setForm({ ...form, cp: String(e.target.value) })}
              defaultValue={form.cp}
              placeholder="Ingrese el Código Postal "
            ></Input>
            <Label>Teléfono:</Label>
            <Input
              type="text"
              name={"telefono"}
              onChange={(e) => setForm({ ...form, telefono: String(e.target.value) })}
              defaultValue={form.telefono}
              placeholder="Ingrese el Número Telefonico del Cliente"
            ></Input>
            <Label>E-mail:</Label>
            <Input
              type="email"
              name={"email"}
              onChange={(e) => setForm({ ...form, email: String(e.target.value) })}
              defaultValue={form.email}
              placeholder="Ingrese el Correo Electronico del Cliente"
            ></Input>
            <Label>Fecha de nacimiento:</Label>
            <Input
              type="date"
              name={"fecha_nac"}
              onChange={(e) => setForm({ ...form, fecha_nac: String(e.target.value) })}
              defaultValue={form.fecha_nac}
            ></Input>
          </FormGroup>
          <br />
          <br />
          <div className="8bnm">
            <div>
              <Button onClick={() => insertCliente()}> Guardar </Button>
            </div>
            <br />
            <Alert color="success" isOpen={isClicked} toggle={onDismiss}>
              Usuario creado con éxito
            </Alert>
          </div>
        </div>
        <br />
      </>
    </>
  );
}

export default ClienteCrear;
