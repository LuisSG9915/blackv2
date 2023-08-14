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

  const [marca, setMarca] = useState<Cliente>({
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
    sucursal_origen: 1,
    num_plastico: "",
    suc_asig_plast: 1,
    fecha_asig_plast: "",
    usr_asig_plast: "",
    plastico_activo: true,
    fecha_nac: "",
    correo_factura: "",
    regimenFiscal: "",
    claveRegistroMovil: "",
  });

  const eliminar = (dato: any) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.descripcion}`);
    if (opcion) {
      jezaApi.delete(`/Medico?idMedico=${dato.descripcion}`).then(() => {
        setModalActualizar(false);
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMarca((prevState) => ({ ...prevState, [name]: value }));
  };
  const DataTableHeader = ["Usuario", "Nombre", "Celular", "Telefono", "Email", "Fecha Alta", "Fecha Actualización", "Acciones"];

  const insertar2 = () => {
    setIsClicked(true);
    jezaApi
      .post("/Cliente", null, {
        params: {
          nombre: "1",
          domicilio: "1",
          ciudad: "1",
          estado: "1",
          colonia: "1",
          cp: "1",
          rfc: "1",
          telefono: "1",
          email: "1",
          nombre_fiscal: "1",
          suspendido: false,
          sucursal_origen: 1,
          num_plastico: "1",
          suc_asig_plast: 1,
          fecha_asig_plast: "2023-06-02",
          usr_asig_plast: "1",
          plastico_activo: true,
          fecha_nac: "1",
          correo_factura: "1",
          regimenFiscal: "1",
          claveRegistroMovil: "1",
        },
      })
      .then(() => console.log("ejecutada"))
      .catch((e) => {
        console.log(e);
      });
    setModalInsertar(false);
  };

  function onDismiss(): void {
    setIsClicked(false);
    setMarca({});
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
            <Row>
              {/* Debe de coincidir el inputname con el value */}
              <Col md={"12"}>
                <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Nombre del cliente:" />
              </Col>
            </Row>
          </FormGroup>
          <br />
          <br />
          <div className="8bnm">
            <div>
              <Button onClick={() => insertar2()}> Guardar </Button>
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
