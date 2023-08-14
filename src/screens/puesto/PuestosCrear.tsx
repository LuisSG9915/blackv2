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
import { Puesto } from "../../models/Puesto";

function PuestosCrear() {
  const { setModalInsertar, setModalActualizar } = useModalHook();
  const [dataClinica, setDataClinica] = useState<undefined | string>("");
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const navigate = useNavigate();

  const [puesto, setPuesto] = useState<Puesto>({
    descripcion: "",
  });
  const mostrarModalActualizar = (dato: Puesto) => {
    setPuesto(dato);
    setModalActualizar(true);
  };
  const handleNav = () => {
    navigate("/UsuariosCrear");
  };
  const [filtroValorMedico, setFiltroValorMedico] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPuesto((prevState) => ({ ...prevState, [name]: value }));
  };
  const DataTableHeader = ["Usuario", "Nombre", "Celular", "Telefono", "Email", "Fecha Alta", "Fecha Actualización", "Acciones"];

  const insertar2 = () => {
    setIsClicked(true);
    jezaApi
      .post("/Puesto", null, {
        params: {
          descripcion: puesto.descripcion,
        },
      })
      .then(() => {})
      .catch((e) => {});
    setModalInsertar(false);
  };

  function onDismiss(): void {
    setIsClicked(false);
    setPuesto({
      descripcion: "",
    });
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
          <h1> Crear Puestos </h1>
          <br />
          <FormGroup>
            <Row>
              {/* Debe de coincidir el inputname con el value */}
              <Col md={"12"}>
                <CFormGroupInput
                  handleChange={handleChange}
                  inputName="descripcion"
                  labelName="Puestos:"
                  // value={}
                />
              </Col>
            </Row>
          </FormGroup>
          <br />
          <br />
          <div className="8bnm">
            <div>
              <Button onClick={() => insertar2()}> Crear Puestos </Button>
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

export default PuestosCrear;
