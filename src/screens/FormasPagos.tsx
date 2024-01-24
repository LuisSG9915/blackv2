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
// import { jezaApi } from "../api/jezaApi";
import CFormGroupInput from "../components/CFormGroupInput";
import SidebarHorizontal from "../components/SidebarHorizontal";
import useModalHook from "../hooks/useModalHook";
import useReadHook from "../hooks/useReadHook";
import { Marca } from "../models/Marca";
import axios from "axios";
import { FormaPago } from "../models/FormaPago";
import { useSucursales } from "../hooks/getsHooks/useSucursales";
import { Sucursal } from "../models/Sucursal";
import JezaApiService from "../api/jezaApi2";

function FormasPago() {
  const { jezaApi } = JezaApiService();
  const { data: data1, llamada: llamada1, setdata } = useReadHook({ url: "Clinica" });
  const { setModalActualizar } = useModalHook();

  const { dataSucursales } = useSucursales();

  const [dataClinica, setDataClinica] = useState<undefined | string>("");
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [formaPago, setFormaPago] = useState<FormaPago>({
    sucursal: 1,
    tipo: 1,
    descripcion: "",
    grupo_operacion: 1,
    tarjeta: false,
  });

  const eliminar = (dato: Marca) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.descripcion}`);
    if (opcion) {
      jezaApi.delete(`/Medico?idMedico=${dato.descripcion}`).then(() => {
        setModalActualizar(false);
        llamada1();
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      newValue = target.checked;
    }

    setFormaPago((prevState) => ({ ...prevState, [name]: newValue }));
    console.log(formaPago);
  };

  const insertar2 = () => {
    axios
      .post("http://cbinfo.no-ip.info:9089/FormaPago", null, {
        params: {
          sucursal: Number(formaPago.sucursal),
          tipo: Number(formaPago.tipo),
          descripcion: formaPago.descripcion,
          grupo_operacion: Number(formaPago.grupo_operacion),
          tarjeta: formaPago.tarjeta,
        },
      })
      .then((r) => alert(r.data.mensaje1))
      .catch();
    console.log("Insertar2");
  };

  return (
    <>
      <>
        <Row>
          <SidebarHorizontal />
        </Row>
        <br />
        <div className="container px-2 ">
          <h1> Crear Forma Pago </h1>
          <br />
          <FormGroup>
            <Row>
              {/* Debe de coincidir el inputname con el value */}
              <Col md={"12"}>
                <Label>Sucursal</Label>
                <Input type="select" name="sucursal" id="exampleSelect" onChange={handleChange}>
                  {dataSucursales.map((sucursal: Sucursal) => (
                    <option key={sucursal.sucursal} value={sucursal.sucursal}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </Input>
                <br />
                <CFormGroupInput handleChange={handleChange} inputName="tipo" labelName="Tipo:" />
                <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripcion:" />
                <CFormGroupInput handleChange={handleChange} inputName="grupo_operacion" labelName="Grupo Operacion:" />
                <Label>Tarjeta</Label>
                <Input style={{ marginLeft: 10 }} name={"tarjeta"} type={"checkbox"} onChange={handleChange}></Input>
                {/* <CFormGroupInput handleChange={handleChange} inputName="tarjeta" labelName="Tarjeta:" type="checkbox" /> */}
              </Col>
            </Row>
          </FormGroup>
          <br />
          <br />
          <div className="8bnm">
            <div>
              <Button onClick={insertar2}> Crear Forma Pago </Button>
            </div>
            <br />
          </div>
        </div>
        <br />
      </>
    </>
  );
}

export default FormasPago;
