import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
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
  Label,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import useReadHook, { Forma } from "../../hooks/useReadHook";
import TabPerfil from "../TabPerfil";
import { Puesto } from "../../models/Puesto";

function Puestos() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState<Puesto>({
    clave_puesto: 1,
    descripcion_puesto: "",
  });
  const getPuestos = () => {
    jezaApi.get("/Puesto?id=0").then((response) => {
      setData(response.data);
    });
  };
  useEffect(() => {
    getPuestos();
  }, []);

  const DataTableHeader = ["marcas", "acciones"];

  const mostrarModalActualizar = (dato: Forma) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const editar = (dato: Forma) => {
    jezaApi
      .put(`/Medico`, {
        id: dato.id,
        nombre: dato.nombre,
        email: dato.email,
        idClinica: dato.idClinica,
        telefono: "",
        mostrarTel: false,
      })
      .then(() => console.log(form));
    const arreglo: Forma[] = [...data];
    const index = arreglo.findIndex((registro) => registro.id === dato.id);
    if (index !== -1) {
      console.log("index");
      setModalActualizar(false);
    }
  };

  const eliminar = (dato: Forma) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      jezaApi.delete(`/Medico?idMedico=${dato.id}`).then(() => {
        setModalActualizar(false);
      });
    }
  };

  const insertar = () => {
    jezaApi.post("/Medico", {}).then(() => {});
    setModalInsertar(false);
  };

  const filtroEmail = (datoMedico: string, datoEmail: string) => {
    var resultado = data.filter((elemento: any) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if (
        (datoEmail === "" || elemento.email.toLowerCase().includes(datoEmail.toLowerCase())) &&
        (datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) &&
        elemento.nombre.length > 2
      ) {
        return elemento;
      }
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };
  const handleNav = () => {
    navigate("/PuestosCrear");
  };
  const handleNavs = () => {
    navigate("/NominaTrabajadorBaja");
  };
  const handleNavss = () => {
    navigate("/NominaDepartamentos");
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
          <h1> Puestos </h1>
          <AiOutlineUser size={30}></AiOutlineUser>
        </div>
        <div className="col align-self-start d-flex justify-content-center ">
          <Card className="my-2 w-100" color="white">
            <CardHeader>Filtro</CardHeader>
            <CardBody>
              <Row>
                <div className="col-sm">
                  <CardTitle tag="h5">Puestos </CardTitle>
                  <CardText>
                    <Input
                      type="text"
                      onChange={(e) => {
                        setFiltroValorMedico(e.target.value);
                        if (e.target.value === "") {
                        }
                      }}
                    ></Input>
                  </CardText>
                </div>
              </Row>
              <br />
              <div className="d-flex justify-content-end">
                <CButton
                  color="success"
                  onClick={() => null}
                  // onClick={() => filtroEmail(filtroValorMedico, filtroValorEmail)}
                  text="Filtro"
                />
              </div>
            </CardBody>
          </Card>
        </div>
        <br />
        <Container className="d-flex justify-content-end ">
          <CButton color="success" onClick={() => handleNav()} text="Crear puestos" />
        </Container>
        <br />
        <Table size="sm" striped={true} responsive={true} style={{ width: "30%", margin: "auto" }}>
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
            {data.map((dato: Puesto) => (
              <tr key={dato.clave_puesto}>
                <td>{dato.descripcion_puesto}</td>
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
            <Label>Puesto</Label>
            <Input defaultValue={form.descripcion_puesto}></Input>
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" onClick={() => editar(form)} text="Editar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar}>
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

export default Puestos;
