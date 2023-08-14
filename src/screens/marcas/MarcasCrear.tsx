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

function MarcasCrear() {
  const { modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } = useModalHook();
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [marca, setMarca] = useState<Marca>({
    id: 0,
    descripcion: "",
  });

  const eliminar = (dato: Marca) => {
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
      .post("/Marca", null, {
        params: {
          descripcion: marca.descripcion,
        },
      })
      .then((response) => {
        console.log("a");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <>
        <Row>
          <SidebarHorizontal />
        </Row>
        <br />
        <div className="container px-2 ">
          <h1> Crear Marca </h1>
          <br />
          <FormGroup>
            <Row>
              {/* Debe de coincidir el inputname con el value */}
              <Col md={"12"}>
                <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Marca descripcion:" />
              </Col>
            </Row>
          </FormGroup>
          <br />
          <br />
          <div className="8bnm">
            <div>
              <Button onClick={() => insertar2()}> Crear Marca </Button>
            </div>
            <br />
          </div>
        </div>
        <br />
      </>
    </>
  );
}

export default MarcasCrear;
