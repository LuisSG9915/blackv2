import React, { useState } from "react";
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
import SidebarHorizontal from "../components/SidebarHorizontal";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import CButton from "../components/CButton";
import useReadHook from "../hooks/useReadHook";
// import { jezaApi } from "../api/jezaApi";
import { useNavigate } from "react-router-dom";
import useModalHook from "../hooks/useModalHook";
import CFormGroupInput from "../components/CFormGroupInput";
import TabPrueba from "./TabPrueba";
import JezaApiService from "../api/jezaApi2";
function NominaTrabajadoresCrear() {
  const { jezaApi } = JezaApiService();
  const { data: data1, llamada: llamada1, setdata } = useReadHook({ url: "Clinica" });
  const { modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } = useModalHook();
  const Data = ["ID", "Clinica", "Acciones"];
  const [filtroValorClinica, setFiltroValorClinica] = useState("");
  const [dataClinica, setDataClinica] = useState<undefined | string>("");
  const [dataClinicaID, setDataClinicaID] = useState<undefined | number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isOk, setIsOk] = useState<string>("false");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    id: 1,
    nombre: "",
    email: "",
    idClinica: 1,
    nombreClinica: "",
    telefono: "",
    mostrarTel: false,
  });

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };
  const handleNav = () => {
    navigate("/UsuariosCrear");
  };
  const [filtroValorMedico, setFiltroValorMedico] = useState("");

  const filtroMédico = (datoMedico: string) => {
    var resultado = data1.filter((elemento: any) => {
      if (elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase()) && elemento.nombre.length > 2) {
        return elemento;
      }
    });
    setdata(resultado);
  };
  const filtroEmail = (datoMedico: string, datoEmail: string) => {
    var resultado = data1.filter((elemento: any) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if (
        (datoEmail === "" || elemento.email.toLowerCase().includes(datoEmail.toLowerCase())) &&
        (datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) &&
        elemento.nombre.length > 2
      ) {
        return elemento;
      }
    });
    setdata(resultado);
  };
  const eliminar = (dato: any) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      jezaApi.delete(`/Medico?idMedico=${dato.id}`).then(() => {
        setModalActualizar(false);
        llamada1();
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };
  const DataTableHeader = ["Usuario", "Nombre", "Celular", "Telefono", "Email", "Fecha Alta", "Fecha Actualización", "Acciones"];

  function onDismiss(): void {
    setIsClicked(false);
    setForm({
      id: 1,
      nombre: "",
      email: "",
      idClinica: 1,
      nombreClinica: "",
      telefono: "",
      mostrarTel: false,
    });
    setDataClinica("");
  }

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <div className="container px-2 ">
        <h1> Crear Nomina Trabajador </h1>
      </div>
      <Container>
        <Card body>
          <TabPrueba></TabPrueba>
        </Card>
      </Container>
      <br />
      <div className="container px-2 ">
        <br />
        <FormGroup>
          <Row>{/* Debe de coincidir el inputname con el value */}</Row>
        </FormGroup>
        <br />
        <br />
        <div className="">
          <div></div>
          <br />
          <Alert color="success" isOpen={isClicked} toggle={onDismiss}>
            Proveedor creado con éxito
          </Alert>
        </div>
      </div>
      <br />
    </>
  );
}

export default NominaTrabajadoresCrear;
