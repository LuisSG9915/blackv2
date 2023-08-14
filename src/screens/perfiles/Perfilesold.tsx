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
import AlertComponent from "../../components/AlertComponent";

function Perfiles() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState<Perfil>({
    clave_perfil: 1,
    descripcion_perfil: "",
  });

  const DataTableHeader = ["perfiles", "acciones"];

  const mostrarModalActualizar = (dato: Perfil) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const editar = (dato: any) => {
    jezaApi
      .put(`/Perfil`, null, {
        params: {
          id: form.clave_perfil,
          descripcion: form.descripcion_perfil,
        },
      })
      .then(() => {
        setTimeout(() => {
          getPerfiles();
          setVisible(true);
        }, 1000);
      });
    const arreglo: any[] = [...data];
    const index = arreglo.findIndex((registro) => registro.id === dato.id);
    if (index !== -1) {
      console.log("index");
      setModalActualizar(false);
    }
  };

  const eliminar = (dato: Perfil) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.clave_perfil}`);
    if (opcion) {
      jezaApi
        .delete(`/Perfil?id=${dato.clave_perfil}`)
        .then(() => {
          setTimeout(() => {
            getPerfiles();
            setVisible(true);
          }, 1000);
          console.log("hecho");
        })
        .catch((e) => console.log(e));
    }
  };
  const getPerfiles = () => {
    jezaApi
      .get("/Perfil?id=0")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getPerfiles();
  }, []);

  const insertar = () => {
    jezaApi
      .post("/Medico", {
        clave_perfil: 1,
        descripcion_perfil: "",
      })
      .then(() => {});
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
  };
  const handleNav = () => {
    navigate("/PerfilesCrear");
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
  const [visible, setVisible] = useState(false);

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);
  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Perfiles </h1>
          <AiOutlineUser size={30} />
        </div>
        <div className="col align-self-start d-flex justify-content-center ">
          <Card className="my-2 w-100" color="white">
            <CardHeader>Filtro</CardHeader>
            <CardBody>
              <Row>
                <div className="col-sm">
                  <CardTitle tag="h5">Perfil </CardTitle>
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
                <CButton color="success" onClick={() => filtroEmail(filtroValorMedico, filtroValorEmail)} text="Filtro" />
              </div>
            </CardBody>
          </Card>
        </div>
        <br />
        <Container className="d-flex justify-content-end ">
          <CButton color="success" onClick={() => handleNav()} text="Crear perfil" />
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
            {data.map((dato: Perfil) => (
              <tr key={dato.clave_perfil}>
                <td>{dato.descripcion_perfil}</td>
                <td style={{ width: 20 }}>
                  <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(dato)} size={23}></AiFillEdit>
                  <AiFillDelete color="lightred" onClick={() => eliminar(dato)} size={23}></AiFillDelete>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
      </Container>

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar Perfiles</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <CFormGroupInput handleChange={handleChange} inputName="descripcion_perfil" labelName="Perfil:" value={form.descripcion_perfil} />
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              editar(form);
              getPerfiles();
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

export default Perfiles;
