import React, { useEffect, useState } from "react";
import { AiFillEdit, AiFillDelete, AiOutlineUser } from "react-icons/ai";
import {
  Row,
  Container,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Input,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
  Label,
} from "reactstrap";
import CButton from "../components/CButton";
import CFormGroupInput from "../components/CFormGroupInput";
import SidebarHorizontal from "../components/SidebarHorizontal";
import useReadHook, { DataClinica } from "../hooks/useReadHook";
import { useNavigate } from "react-router-dom";
import { jezaApi } from "../api/jezaApi";
import useModalHook from "../hooks/useModalHook";
import { Usuario } from "../models/Usuario";
import AlertComponent from "../components/AlertComponent";
import { Perfil } from "../models/Perfil";

function Usuarios() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [data, setData] = useState([]);
  const [dataText, setDataText] = useState("");
  const [dataPerfil, setDataPerfil] = useState<Perfil[]>([]);
  const navigate = useNavigate();
  const [form, setForm] = useState<Usuario>({
    id: 0,
    usuario: "",
    clave_perfil: 1,
    password: "",
    nombre: "",
    celular: "",
    telefono: "",
    email: "",
  });

  const DataTableHeader = ["Usuario", "Clave Perfil", "Nombre", "Celular", "Telefono", "Email", "Acciones"];

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const editar = (dato: Usuario) => {
    jezaApi
      .put(`/Usuario`, null, {
        params: {
          id: dato.id,
          usuario: dato.usuario,
          clave_perfil: dato.clave_perfil,
          password: dato.password,
          nombre: dato.nombre,
          celular: dato.celular,
          telefono: dato.telefono,
          email: dato.email,
          fecha_alta: "2023-06-03",
          fecha_act: "2023-06-03",
        },
      })
      .then((response) => {
        setTimeout(() => {
          getUsuario();
          setVisible(true);
          setDataText(response.data.mensaje1);
        }, 1000);
      })
      .catch((e) => console.log(e));
    setModalActualizar(false);
  };
  const getUsuario = () => {
    jezaApi.get("/Usuario?id=0").then((response) => {
      setData(response.data);
      console.log({ data });
    });
  };
  const getPerfiles = () => {
    jezaApi.get("/Perfil?id=0").then((response) => {
      setDataPerfil(response.data);
    });
  };

  useEffect(() => {
    getUsuario();
    getPerfiles();
  }, []);

  const eliminar = (dato: any) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      jezaApi
        .delete(`/Usuario?id=${dato.id}`)
        .then((response) => {
          setModalActualizar(false);
          setDataText(response.data.mensaje1);
          console.log(response.data.mensaje1);
          setTimeout(() => {
            getUsuario();
            setVisible(true);
          }, 1000);
        })
        .catch((e) => console.log(e));
    }
  };

  const handleFiltro = (datoUsuario: string, datoCelular: string) => {
    var resultado = data.filter((elemento: Usuario) => {
      if (
        (datoCelular === "" || elemento.celular.toLowerCase().includes(datoCelular.toLowerCase())) &&
        (datoUsuario === "" || elemento.usuario.toLowerCase().includes(datoUsuario.toLowerCase())) &&
        elemento.nombre.length > 2
      ) {
        return elemento;
      }
    });
    setData(resultado);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: Usuario) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const handleNav = () => {
    navigate("/UsuariosCrear");
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
        <Row>
          <Col>
            <Container fluid>
              <br />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1> Usuarios </h1>
                <AiOutlineUser size={30} />
              </div>
              <div className="col align-self-start d-flex justify-content-center ">
                <Card className="my-2 w-100" color="white">
                  <CardHeader>Filtro</CardHeader>
                  <CardBody>
                    <Row>
                      <div className="col-sm">
                        <CardTitle tag="h5">Nombre de usuario</CardTitle>
                        <CardText>
                          <Input
                            type="text"
                            onChange={(e) => {
                              setFiltroValorMedico(e.target.value);
                              if (e.target.value === "") {
                                getUsuario();
                              }
                            }}
                          ></Input>
                        </CardText>
                      </div>
                      <div className="col-sm">
                        <CardTitle tag="h5">Numero Celular</CardTitle>
                        <CardText>
                          <Input
                            type="text"
                            onChange={(e) => {
                              setFiltroValorEmail(e.target.value);
                              if (e.target.value === "") {
                                getUsuario();
                              }
                            }}
                          />
                        </CardText>
                      </div>
                    </Row>
                    <br />
                    <div className="d-flex justify-content-end">
                      <CButton color="success" onClick={() => handleFiltro(filtroValorMedico, filtroValorEmail)} text="Filtro" />
                    </div>
                  </CardBody>
                </Card>
              </div>
              <br />
              <Container className="d-flex justify-content-end ">
                <CButton color="success" onClick={() => handleNav()} text="Crear usuario" />
              </Container>
            </Container>
            <br />

            <Table size="sm" striped={true} responsive={"sm"}>
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
                {data.map((dato: Usuario) => (
                  <tr key={dato.clave_perfil}>
                    <td>{dato.usuario}</td>
                    <td>{dato.d_perfil}</td>
                    <td>{dato.nombre}</td>
                    <td>{dato.celular}</td>
                    <td>{dato.telefono}</td>
                    <td>{dato.email}</td>
                    <td className="gap-5">
                      <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(dato)} size={23}></AiFillEdit>
                      <AiFillDelete color="lightred" onClick={() => eliminar(dato)} size={23}></AiFillDelete>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} text={dataText} />
      </Container>

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar Usuarios</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="usuario" labelName="Usuario:" defaultValue={form.usuario} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput
                  handleChange={handleChange}
                  inputName="password"
                  labelName="Contraseña:"
                  defaultValue={form.password}
                  type="password"
                />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" defaultValue={form.nombre} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="celular" labelName="Celular:" defaultValue={form.celular} />
              </Col>
              <Col md={"6"}>
                <Label>Rol de usuario</Label>
                <Input type="select" name="clave_perfil" id="depto" onChange={handleChange} value={form.clave_perfil}>
                  {dataPerfil.map((perfil) => (
                    <option value={perfil.clave_perfil}> {perfil.descripcion_perfil} </option>
                  ))}
                </Input>
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="telefono" labelName="Telefono:" defaultValue={form.telefono} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" defaultValue={form.email} />
              </Col>
            </Row>
          </FormGroup>
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
          <CButton color="primary" onClick={() => null} text="Insertar" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Usuarios;
