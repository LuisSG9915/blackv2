import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import {
  Row,
  Container,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Input,
  Table,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import CButton from "../../components/CButton";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useReadHook, { DataClinica } from "../../hooks/useReadHook";
import { useNavigate } from "react-router-dom";
import { jezaApi } from "../../api/jezaApi";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
import TabPerfil from "../TabPerfil";
import { Perfil } from "../../models/Perfil";
import { Descuento } from "../../models/Descuento";

function Descuentos() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState<Descuento>({
    id: 0,
    descripcion: "",
    min_descto: 0.0,
    max_descto: 0.0,
  });

  const DataTableHeader = ["Descripción", "Minimo descuento", "Máximo descuento", "Acciones"];

  const mostrarModalActualizar = (dato: Descuento) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const editar = (dato: any) => {
    jezaApi
      .put(`/Tipodescuento`, null, {
        params: {
          id: form.id,
          descripcion: form.descripcion,
          min_descto: Number(form.min_descto),
          max_descto: Number(form.max_descto),
        },
      })

      .then(() => getDescuento())
      .catch((e) => console.log(e));
    const arreglo: any[] = [...data];
    const index = arreglo.findIndex((registro) => registro.id === dato.id);
    if (index !== -1) {
      console.log("index");
      setModalActualizar(false);
    }
  };

  const eliminar = (dato: any) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      jezaApi.delete(`/Tipodescuento?id=${dato.id}`).then(() => {
        console.log("realizado");
        getDescuento();
        setModalActualizar(false);
      });
    }
  };
  const getDescuento = () => {
    jezaApi
      .get("/Tipodescuento?id=0")
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getDescuento();
  }, []);

  const insertar = () => {
    jezaApi
      .post("/Tipodescuento", null, {
        params: {
          descripcion: "",
          min_descto: 0.0,
          max_descto: 0.0,
        },
      })
      .then(() => {
        console.log("Realizado");
      });
    setModalInsertar(false);
  };

  const filtroEmail = (datoMedico: string, datoEmail: string) => {
    // var resultado = data.filter((elemento: any) => {
    //   // Aplica la lógica del filtro solo si hay valores en los inputs
    //   if (
    //     (datoEmail === "" || elemento.email.toLowerCase().includes(datoEmail.toLowerCase())) &&
    //     (datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) &&
    //     elemento.nombre.length > 2
    //   ) {
    //     return elemento;
    //   }
    // });
    // setData(resultado);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };
  const handleNav = () => {
    navigate("/CrearDescuento");
  };

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Descuentos Autorizados </h1>
          <AiOutlineUser size={30} />
        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
        <br />
        <Container className="d-flex justify-content-end ">
          <CButton color="success" onClick={() => handleNav()} text="Crear descuento autorizado" />
        </Container>
        <br />

        <Table size="sm" striped={true} responsive={true} style={{ width: "100%", margin: "auto" }}>
          <thead>
            <tr>
              {DataTableHeader.map((valor) => (
                <th className="" key={valor}>
                  {valor}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((dato: Descuento) => (
              <tr key={dato.descripcion}>
                <td>{dato.descripcion}</td>
                <td>{dato.min_descto}</td>
                <td>{dato.max_descto}</td>
                <td style={{ width: 20 }}>
                  <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(dato)} size={23}></AiFillEdit>
                  <AiFillDelete color="lightred" onClick={() => eliminar(dato)} size={23}></AiFillDelete>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar Registro</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripción:" defaultValue={form.descripcion} />
            <CFormGroupInput handleChange={handleChange} inputName="min_descto" labelName="Minimo de descuento:" defaultValue={form.min_descto} />
            <CFormGroupInput handleChange={handleChange} inputName="max_descto" labelName="Máximo de descuento:" defaultValue={form.max_descto} />
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              editar(form);
              getDescuento();
            }}
            text="Editar"
          />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar} about="">
        <ModalHeader>
          <div>
            <h3>Insertar Personaje</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" />
          <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" />
          <CFormGroupInput handleChange={handleChange} inputName="idClinica" labelName="Id Clinica:" />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={() => insertar()} text="Insertar" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Descuentos;
