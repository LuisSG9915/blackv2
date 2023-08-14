////USANDO GITHUB 


import React, { useState, useEffect } from "react";
import { MdInventory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
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
  Button,
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
import TablePerfilesModulos from "./components/TablePerfilesModulos";
import { Perfil_Modulo } from "../../models/Perfil_Modulo";
import { usePerfiles } from "../../hooks/getsHooks/useClavePerfil";

function PerfilesModulos() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");

  const [data, setData] = useState<Perfil_Modulo[]>([]);
  const { dataPerfiles } = usePerfiles();
  const [form, setForm] = useState<Perfil_Modulo>({
    clave_perfil: 1,
    modulo: 1,
    permiso: false,
    d_perfil: "",
  });

  const navigate = useNavigate();

  const DataTableHeader = ["Clave Perfil", "Modulo", "Permisos", "Acciones"];

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const editar = (dato: Perfil_Modulo) => {
    jezaApi
      .put(`/PerfilModulo`, null, {
        params: {
          id: Number(dato.id),
          clave_perfil: Number(dato.clave_perfil),
          modulo: Number(dato.modulo),
          permiso: dato.permiso,
        },
      })
      .then((response) => {
        getPerfilModulos();
      })
      .catch((e) => console.log(e));
    setModalActualizar(false);
  };

  const getPerfilModulos = () => {
    jezaApi
      .get("PerfilModulo?id=0")
      .then((response) => setData(response.data))
      .catch((e) => console.log(e));
  };

  const getModulos = () => {
    jezaApi
      .get("PerfilModulo?id=0")
      .then((response) => setData(response.data))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getPerfilModulos();
  }, []);

  const eliminar = (dato: any) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      jezaApi.delete(`/PerfilModulo?id=${dato.id}`).then(() => {
        setModalActualizar(false);
        setTimeout(() => {
          getPerfilModulos();
        }, 1000);
      });
    }
  };

  const insertar = () => {
    jezaApi.post("/Medico", {}).then(() => { });
    setModalInsertar(false);
  };

  const filtroEmail = (datoDescripcion: any) => {
    var resultado = data.filter((elemento: Perfil_Modulo) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if (elemento.d_perfil?.toLowerCase().includes(datoDescripcion.toLowerCase())) {
        return elemento;
      }
    });
    setData(resultado);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "permiso") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: Perfil_Modulo) => ({ ...prevState, [name]: value }));
    }
    console.log(form);
  };
  const handleNav = () => {
    navigate("/UsuariosCrear");
  };
  const handleNavs = () => {
    navigate("/PerfilesModulosCrear");
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
        <Row>
          <Col>
            <Container fluid>
              <br />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1> Seguridad </h1>
                <MdInventory size={30}></MdInventory>
              </div>

              <div className="col align-self-start d-flex justify-content-center ">
                <Card className="my-2 w-100" color="white">
                  <CardHeader>Filtro</CardHeader>
                  <CardBody>
                    <Row>
                      <div className="col-sm">
                        <CardTitle tag="h5">Clave Perfil</CardTitle>
                        <CardText>
                          <Input
                            type="text"
                            onChange={(e) => {
                              setFiltroValorMedico(e.target.value);
                              if (e.target.value === "") {
                                getPerfilModulos();
                              }
                            }}
                          ></Input>
                        </CardText>
                      </div>
                      {/* <div className="col-sm">
                        <CardTitle tag="h5">Bodega</CardTitle>
                        <CardText>
                          <Input
                            type="text"
                            onChange={(e) => {
                              setFiltroValorEmail(e.target.value);
                            }}
                          />
                        </CardText>
                      </div> */}
                    </Row>
                    <br />
                    <div className="d-flex justify-content-end">
                      <CButton color="success" onClick={() => filtroEmail(filtroValorMedico)} text="Filtro" />
                    </div>
                  </CardBody>
                </Card>
              </div>
              <Container className="d-flex justify-content-end ">
                <Button onClick={handleNavs}>Crear Seguridad</Button>
              </Container>
            </Container>
            <br />
            <br />
            <TablePerfilesModulos
              DataTableHeader={DataTableHeader}
              data={data}
              eliminar={eliminar}
              mostrarModalActualizar={mostrarModalActualizar}
            ></TablePerfilesModulos>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar Seguridad</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="6" className="mb-4">
                <Label>Clave de perfil</Label>
                <Input type="select" name="clave_perfil" id="exampleSelect" value={form.clave_perfil} onChange={handleChange}>
                  {dataPerfiles.map((perfil) => (
                    <option key={perfil.clave_perfil} value={Number(perfil.clave_perfil)}>
                      {perfil.descripcion_perfil}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md="6">
                <Label>Modulo</Label>
                <Input type="select" name="modulo" id="exampleSelect" value={form.modulo} onChange={handleChange}>
                  {data.map((perfil) => (
                    <option key={perfil.modulo} value={perfil.modulo}>
                      {perfil.d_modulo}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md="6">
                <Label style={{ marginRight: 25 }}>Permiso</Label>
                <Input type="checkbox" name="permiso" checked={form.permiso} onChange={handleChange}></Input>
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
          <CButton color="primary" onClick={() => insertar()} text="Insertar" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default PerfilesModulos;
