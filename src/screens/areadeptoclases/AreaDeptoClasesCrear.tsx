import React, { useState, useEffect } from "react";
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
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import useReadHook from "../../hooks/useReadHook";
import TabPruebaProductos from "../TabPruebaProductos";
import CFormGroupInput from "../../components/CFormGroupInput";
import CButton from "../../components/CButton";
import { Area } from "../../models/Area";
import { Departamento } from "../../models/Departamento";
import { Clase } from "../../models/Clase";

function AreaDeptoClasesCrear() {
  const { data: data1, llamada: llamada1, setdata } = useReadHook({ url: "Clinica" });
  const { modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } = useModalHook();
  const Data = ["ID", "Clinica", "Acciones"];
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const navigate = useNavigate();
  const [areasGet, setAreaGet] = useState<Area[]>([]);
  const [claseGet, setclaseGet] = useState<Clase[]>([]);
  const [deptoGet, setDeptoGet] = useState<Departamento[]>([]);
  const [area, setArea] = useState<Area>({
    area: 1,
    descripcion: "",
  });

  const [depto, setDepto] = useState<Departamento>({
    area: 1,
    depto: 1,
    descripcion: "",
  });

  const [clase, setClase] = useState<Clase>({
    area: 1,
    depto: 1,
    descripcion: "",
  });

  const insertar = () => {
    if (seccion == 1) {
      try {
        jezaApi.post("/Area", null, { params: { descripcion: area.descripcion } }).then(() => console.log("a"));
        setModalInsertar(false);
      } catch (error) {
        console.error(error);
      }
    }
    if (seccion == 2) {
      try {
        jezaApi.post("/Depto", null, { params: { area: depto.area, descripcion: depto.descripcion } }).then(() => console.log("a"));
        setModalInsertar(false);
      } catch (error) {
        console.error(error);
      }
    }
    if (seccion == 3) {
      try {
        jezaApi
          .post("/Clase", null, {
            params: { area: Number(clase.area), depto: Number(clase.depto), descripcion: clase.descripcion },
          })
          .then(() => console.log("clase ejecutada"));
        setModalInsertar(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const eliminar = (dato: Area) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.area}`);
    if (opcion) {
      jezaApi.delete(`/Medico?idMedico=${dato.area}`).then(() => {
        setModalActualizar(false);
        llamada1();
      });
    }
  };
  const handleChangeArea = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArea((prevState) => ({ ...prevState, [name]: value }));
    console.log({ area });
  };
  const handleChangeAreaDepto = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDepto((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangeAreaDeptoClase = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClase((prevState) => ({ ...prevState, [name]: value }));
    console.log(clase);
  };

  const getAreas = () => {
    jezaApi.get("/Area?area=0").then((response) => {
      setAreaGet(response.data);
    });
  };
  useEffect(() => {
    getAreas();
  }, []);

  const [seccion, setSeccion] = useState(1);

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <div className="container px-2 ">
        <br />
        <h1> Crear Areas Departamentos o Clases </h1>
        <br />
        <Row>
          <Col className="d-flex justify-content-center mb-2">
            <Button onClick={() => setSeccion(1)} className="mr-5">
              Area
            </Button>
            <Button onClick={() => setSeccion(2)} className="mr-5">
              Departamento
            </Button>
            <Button onClick={() => setSeccion(3)} className="mr-5">
              Clases
            </Button>
          </Col>
        </Row>
        <br />
        {seccion == 1 ? (
          <Card body>
            <h4> Area </h4>
            <CFormGroupInput handleChange={handleChangeArea} inputName="descripcion" labelName="descripción:" />
            <br />
          </Card>
        ) : seccion == 2 ? (
          <Card body>
            <h4> Departamento </h4>
            <Label>Area</Label>
            <Input type="select" name="area" id="area" onChange={handleChangeAreaDepto}>
              {areasGet.map((option: Area) => (
                <option key={option.area} value={option.area}>
                  {option.descripcion}
                </option>
              ))}
            </Input>
            <br />
            <CFormGroupInput handleChange={handleChangeAreaDepto} inputName="descripcion" labelName="descripción:" />
            <br />
          </Card>
        ) : (
          <Card body>
            <h4> Clases </h4>
            <Label>Area</Label>
            <Input type="select" name="area" id="area" onChange={handleChangeAreaDeptoClase}>
              {areasGet.map((option: Area) => (
                <option key={option.area} value={option.area}>
                  {option.descripcion}
                </option>
              ))}
            </Input>
            <br />
            <Label>Deparamento</Label>
            <Input type="select" name="depto" id="depto" onChange={handleChangeAreaDeptoClase}>
              <option value="">--Selecciona una opción--</option>
              <option value={1}>Deparamento 1</option>
              <option value={2}>Deparamento 2</option>
              <option value={3}>Deparamento 3</option>
            </Input>
            <br />
            <CFormGroupInput handleChange={handleChangeAreaDeptoClase} inputName="descripcion" labelName="descripción:" />
          </Card>
        )}

        <br />
        <CButton color="success" onClick={insertar} text={seccion == 1 ? "Crear Area" : seccion == 2 ? "Crear Departamentos" : "Crear Clases"} />
      </div>
    </>
  );
}

export default AreaDeptoClasesCrear;
