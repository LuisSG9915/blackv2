import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Container,
  Card,
  Input,
  Table,
  Modal,
  ModalBody,
  TabPane,
  Nav,
  NavLink,
  TabContent,
  NavItem,
  ModalFooter,
  ModalHeader,
  Label,
  Col,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import useReadHook from "../../hooks/useReadHook";
import TabPerfil from "../TabPerfil";
import { Area } from "../../models/Area";
import { Clase } from "../../models/Clase";
import { Departamento } from "../../models/Departamento";
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { VscTypeHierarchy } from "react-icons/vsc";

function AreaDeptoClases() {
  const { modalActualizarArea, modalInsertarArea, setModalInsertarArea, setModalActualizarArea, cerrarModalActualizarArea, cerrarModalInsertarArea } =
    useModalHook();
  const {
    modalActualizarDepto,
    modalInsertarDepto,
    setModalInsertarDepto,
    setModalActualizarDepto,
    cerrarModalActualizarDepto,
    cerrarModalInsertarDepto,
  } = useModalHook();
  const {
    modalActualizarClase,
    modalInsertarClase,
    setModalInsertarClase,
    setModalActualizarClase,
    cerrarModalActualizarClase,
    cerrarModalInsertarClase,
  } = useModalHook();

  const [areasGet, setAreaGet] = useState<Area[]>([]);
  const [claseGet, setclaseGet] = useState<Clase[]>([]);
  const [deptoGet, setDeptoGet] = useState<Departamento[]>([]);
  const { filtroSeguridad, session } = useSeguridad();

  const [formArea, setArea] = useState<Area>({
    area: 1,
    descripcion: "",
  });

  const [formDepto, setDepto] = useState<Departamento>({
    id: 0,
    area: 0,
    depto: 0,
    descripcion: "",
  });

  const [formClase, setClase] = useState<Clase>({
    area: 1,
    depto: 1,
    descripcion: "",
  });

  const DataTableHeaderArea = ["Área", "Descripción", "Acciones"];
  const DataTableHeaderClase = ["Área", "Departamento", "Clase", "Descripción", "Acciones"];
  const DataTableHeaderDepto = ["Área", "Departamento", "Descripción", "Acciones"];

  const [formValues, setFormValues] = useState({ area: 1, clase: 1, departamento: 1 });

  const mostrarModalActualizarArea = (dato: Area) => {
    setArea(dato);
    setModalActualizarArea(true);
  };

  const mostrarModalActualizarClase = (dato: Clase) => {
    setClase(dato);
    setModalActualizarClase(true);
  };

  const mostrarModalActualizarDepto = (dato: Departamento) => {
    setDepto(dato);
    setModalActualizarDepto(true);
  };

  const handleChangeArea = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArea((prevState) => ({ ...prevState, [name]: value }));
    console.log(formArea);
  };
  const handleChangeAreaDepto = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDepto((prevState) => ({ ...prevState, [name]: value }));
    console.log(formDepto);
  };

  const handleChangeAreaDeptoClase = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClase((prevState) => ({ ...prevState, [name]: value }));
    console.log(formClase);
  };

  //VALIDACIÓN AREA ---->
  const [camposFaltantes1, setCamposFaltantes1] = useState<string[]>([]);

  const validarCampos1 = () => {
    const camposRequeridos: (keyof Area)[] = ["descripcion"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Area) => {
      const fieldValue = formArea[campo];
      if (!fieldValue || String(fieldValue).trim() === "") {
        camposVacios.push(campo);
      }
    });

    setCamposFaltantes1(camposVacios);

    if (camposVacios.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: `Los siguientes campos son requeridos: ${camposVacios.join(", ")}`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    }
    return camposVacios.length === 0;
  };

  //VALIDACIÓN DEPTO---->
  const [camposFaltantes2, setCamposFaltantes2] = useState<string[]>([]);

  const validarCampos2 = () => {
    const camposRequeridos: (keyof Departamento)[] = ["descripcion", "area"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Departamento) => {
      const fieldValue = formDepto[campo];
      if (!fieldValue || String(fieldValue).trim() === "") {
        camposVacios.push(campo);
      }
    });

    setCamposFaltantes2(camposVacios);

    if (camposVacios.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: `Los siguientes campos son requeridos: ${camposVacios.join(", ")}`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    }
    return camposVacios.length === 0;
  };

  //VALIDACIÓN CLASE---->
  const [camposFaltantes3, setCamposFaltantes3] = useState<string[]>([]);

  const validarCampos3 = () => {
    const camposRequeridos: (keyof Clase)[] = ["area", "depto", "descripcion"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Clase) => {
      const fieldValue = formClase[campo];
      if (!fieldValue || String(fieldValue).trim() === "") {
        camposVacios.push(campo);
      }
    });

    setCamposFaltantes3(camposVacios);

    if (camposVacios.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: `Los siguientes campos son requeridos: ${camposVacios.join(", ")}`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    }
    return camposVacios.length === 0;
  };

  //LIMPIEZA DE CAMPOS
  const [estado, setEstado] = useState("");

  //AQUI COMIENZA MÉTODO AGREGAR AREA
  const insertar1 = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos1());
    console.log({ formArea });
    if (validarCampos1() === true) {
      await jezaApi
        .post("/Area", null, {
          params: {
            descripcion: formArea.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Área creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertarArea(false);
          getAreas();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  //AQUI COMIENZA MÉTODO AGREGAR DEPTO
  const insertar2 = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos2());
    console.log({ formDepto });
    if (validarCampos2() === true) {
      await jezaApi
        .post("/Depto", null, {
          params: {
            area: formDepto.area,
            descripcion: formDepto.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Departamento creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertarDepto(false);
          getDepartamentos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  //AQUI COMIENZA MÉTODO AGREGAR CLASE
  const insertar3 = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos3());
    console.log({ formClase });
    if (validarCampos3() === true) {
      await jezaApi
        .post("/Clase", null, {
          params: {
            area: formClase.area,
            depto: formClase.depto,
            descripcion: formClase.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Clase creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertarClase(false);
          getClases();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const editArea = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos1() === true) {
      await jezaApi
        .put(`/Area`, null, {
          params: {
            area: formArea.area,
            descripcion: formArea.descripcion,
            fecha_alta: "2023-06-06",
            fecha_act: "2023-06-06",
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Área actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizarArea(false);
          getAreas();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const editDepto = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos2() === true) {
      await jezaApi
        .put(`/Depto?id=${formDepto.depto}&area=${Number(formDepto.area)}&descripcion=${formDepto.descripcion}`)
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Departamento actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizarDepto(false);
          getDepartamentos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const editClase = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos3() === true) {
      await jezaApi
        .put(`/Clase`, null, {
          params: {
            area: Number(formClase.area),
            depto: Number(formClase.depto),
            clase: Number(formClase.clase),
            descripcion: formClase.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Clase actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizarClase(false);
          getClases();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const eliminar1 = (dato: Area) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.area}`);
    if (opcion) {
      jezaApi.delete(`/Area?area=${dato.area}`).then((response) => {
        setModalActualizarArea(false);
        getAreas();
        alert(response.data.mensaje1);
      });
    }
  };
  const eliminar2 = (dato: Clase) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.clase}`);
    if (opcion) {
      jezaApi.delete(`/Clase?area=${dato.area}&depto=${dato.depto}&id=${dato.clase}`).then(() => {
        setModalActualizarClase(false);
        getClases();
      });
    }
  };
  const eliminar3 = (dato: Departamento) => {
    console.log(dato);
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.depto}`);
    if (opcion) {
      jezaApi.delete(`/Depto?area=${dato.area}&id=${dato.depto}`).then(() => {
        setModalActualizarDepto(false);
        getDepartamentos();
      });
    }
  };

  const getAreas = () => {
    jezaApi.get("/Area?area=0").then((response) => {
      setAreaGet(response.data);
    });
  };
  const getClases = () => {
    jezaApi.get("/Clase?area=0&id=0&depto=0").then((response) => {
      setclaseGet(response.data);
      console.log(response.data);
    });
  };
  const getDepartamentos = () => {
    jezaApi.get("/Depto?area=0&id=0").then((response) => {
      setDeptoGet(response.data);
    });
  };

  useEffect(() => {
    getAreas();
    getClases();
    getDepartamentos();

    const departamentosFiltrados = deptoGet.filter((departamento) => {
      return departamento.area === 1;
    });

    console.log(departamentosFiltrados);
  }, []);

  // const insertar = () => {
  //   jezaApi
  //     .post("/Area", null, {
  //       params: {
  //         description: "",
  //       },
  //     })
  //     .catch((e) => console.log(e));
  //   setModalInsertar(false);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState: any) => ({ ...prevState, [name]: Number(value) }));
    console.log(formValues);
  };
  const handleNav = () => {
    navigate("/AreaDeptoClasesCrear");
  };

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Redirige a la ruta "/app"
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };
  //REALIZA LA LIMPIEZA DE LOS CAMPOS AL CREAR UNA SUCURSAL

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
                <h1> Areas, Departamentos y Clases </h1>
                <VscTypeHierarchy size={30}></VscTypeHierarchy>
              </div>
            </Container>
            <br />
            {/* <br />
            <Container className="d-flex justify-content-end ">
              <CButton color="success" onClick={() => handleNav()} text="Crear secciones" />
            </Container>
            <br /> */}
            <Nav tabs>
              <NavItem>
                <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
                  Areas
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
                  Departamentos
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")}>
                  Clases
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <br />
                {/* ButtonGroup crear areas*/}
                <div>
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button
                      style={{ marginLeft: "auto" }}
                      color="success"
                      onClick={() => {
                        setModalInsertarArea(true);
                        // setEstado("insert");
                        // LimpiezaForm();
                      }}
                    >
                      Crear área
                    </Button>
                    <Button color="primary" onClick={handleRedirect}>
                      <IoIosHome size={20}></IoIosHome>
                    </Button>
                    <Button onClick={handleReload}>
                      <IoIosRefresh size={20}></IoIosRefresh>
                    </Button>
                  </ButtonGroup>
                </div>
                <br />
                <Row>
                  <Table size="sm" striped={true} responsive={true}>
                    <thead>
                      <tr>
                        {DataTableHeaderArea.map((valor) => (
                          <th className="" key={valor}>
                            {valor}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {areasGet.map((dato: Area) => (
                        <tr key={dato.area}>
                          <td>{dato.area}</td>
                          <td>{dato.descripcion}</td>
                          <td style={{ width: 20 }}>
                            <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizarArea(dato)} size={23}></AiFillEdit>
                            <AiFillDelete color="lightred" onClick={() => eliminar1(dato)} size={23}></AiFillDelete>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Row>
                <br />
              </TabPane>

              <TabPane tabId="2">
                <br />
                {/* ButtonGroup crear departamento*/}
                <div>
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button
                      style={{ marginLeft: "auto" }}
                      color="success"
                      onClick={() => {
                        setModalInsertarDepto(true);
                        // setEstado("insert");
                        // LimpiezaForm();
                      }}
                    >
                      Crear departamento
                    </Button>
                    <Button color="primary" onClick={handleRedirect}>
                      <IoIosHome size={20}></IoIosHome>
                    </Button>
                    <Button onClick={handleReload}>
                      <IoIosRefresh size={20}></IoIosRefresh>
                    </Button>
                  </ButtonGroup>
                </div>
                <br />
                <Row>
                  <Table size="sm" striped={true} responsive={true}>
                    <thead>
                      <tr>
                        {DataTableHeaderDepto.map((valor) => (
                          <th className="" key={valor}>
                            {valor}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {deptoGet.map((dato: any) => (
                        <tr key={dato.id}>
                          <td>{dato.area}</td>
                          <td>{dato.depto}</td>
                          <td>{dato.descripcion}</td>
                          <td style={{ width: 20 }}>
                            <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizarDepto(dato)} size={23}></AiFillEdit>
                            <AiFillDelete color="lightred" onClick={() => eliminar3(dato)} size={23}></AiFillDelete>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Row>
              </TabPane>

              <TabPane tabId="3">
                <br />
                {/* ButtonGroup crear clases*/}
                <div>
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button
                      style={{ marginLeft: "auto" }}
                      color="success"
                      onClick={() => {
                        setModalInsertarClase(true);
                        // setEstado("insert");
                        // LimpiezaForm();
                      }}
                    >
                      Crear clase
                    </Button>
                    <Button color="primary" onClick={handleRedirect}>
                      <IoIosHome size={20}></IoIosHome>
                    </Button>
                    <Button onClick={handleReload}>
                      <IoIosRefresh size={20}></IoIosRefresh>
                    </Button>
                  </ButtonGroup>
                </div>
                <br />
                <Row>
                  <Table size="sm" striped={true} responsive={true}>
                    <thead>
                      <tr>
                        {DataTableHeaderClase.map((valor) => (
                          <th className="" key={valor}>
                            {valor}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {claseGet.map((dato: Clase) => (
                        <tr key={dato.area}>
                          <td>{dato.area}</td>
                          <td>{dato.depto}</td>
                          <td>{dato.clase}</td>
                          <td>{dato.descripcion}</td>
                          <td style={{ width: 20 }}>
                            <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizarClase(dato)} size={23}></AiFillEdit>
                            <AiFillDelete color="lightred" onClick={() => eliminar2(dato)} size={23}></AiFillDelete>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Row>
              </TabPane>
            </TabContent>
            {/* <TableSucursal dataCia={dataCias} DataTableHeader={DataTableHeader} data={data} eliminar={eliminar} mostrarModalActualizar={mostrarModalActualizar} /> */}
            {/* <DataTable></DataTable> */}
          </Col>
        </Row>
      </Container>

      {/* ACTUALIZAR AREA */}
      <Modal isOpen={modalActualizarArea} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar áreas</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput handleChange={handleChangeArea} inputName="descripcion" labelName="descripción de Area:" value={formArea.descripcion} />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={editArea} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizarArea()} text="Cancelar" />
        </ModalFooter>
      </Modal>
      {/* ACTUALIZAR DEPARTAMENTO */}
      <Modal isOpen={modalActualizarDepto} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar departamentos</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Área:</Label>
          <Input type="select" name="area" id="area" onChange={handleChangeAreaDepto} value={formArea.area}>
            {areasGet.map((option: Area) => (
              <option key={Number(option.area)} value={Number(option.area)}>
                {option.descripcion}
              </option>
            ))}
          </Input>
          <br />
          <CFormGroupInput handleChange={handleChangeAreaDepto} inputName="descripcion" labelName="Descripción:" value={formDepto.descripcion} />
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={editDepto} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizarDepto()} text="Cancelar" />
        </ModalFooter>
      </Modal>
      {/* ACTUALIZAR CLASE */}
      <Modal isOpen={modalActualizarClase} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar clases</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Área:</Label>
          <Input type="select" name="area" id="area" onChange={handleChangeAreaDeptoClase}>
            {areasGet.map((option: Area) => (
              <option key={option.area} value={Number(option.area)}>
                {option.descripcion}
              </option>
            ))}
          </Input>
          <br />
          <Label>Departamento:</Label>
          <Input type="select" name="depto" id="depto" onChange={handleChangeAreaDeptoClase}>
            {deptoGet.map((depto) => (
              <option value={depto.depto}> {depto.descripcion} </option>
            ))}
          </Input>
          <br />
          <CFormGroupInput handleChange={handleChangeAreaDeptoClase} inputName="descripcion" labelName="Descripción:" value={formClase.descripcion} />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={editClase} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizarClase()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* MODAL CREAR AREA */}
      <Modal isOpen={modalInsertarArea}>
        <ModalHeader>
          <div>
            <h3>Crear área</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput handleChange={handleChangeArea} inputName="descripcion" labelName="Descripción de área:" value={formArea.descripcion} />
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar1} text="Guardar área" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertarArea()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* MODAL CREAR DEPARTAMENTO */}
      <Modal isOpen={modalInsertarDepto}>
        <ModalHeader>
          <div>
            <h3>Crear departamento</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Área:</Label>
          <Input type="select" name="area" id="area" onChange={handleChangeAreaDepto} value={formDepto.area}>
            {areasGet.map((option: Area) => (
              <option key={Number(option.area)} value={Number(option.area)}>
                {option.descripcion}
              </option>
            ))}
          </Input>
          <br />
          <CFormGroupInput handleChange={handleChangeAreaDepto} inputName="descripcion" labelName="Descripción:" value={formDepto.descripcion} />
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar2} text="Guardar departamento" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertarDepto()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* MODAL CREAR CLASE */}
      <Modal isOpen={modalInsertarClase}>
        <ModalHeader>
          <div>
            <h3>Crear clase</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Área:</Label>
          <Input type="select" name="area" id="area" onChange={handleChangeAreaDeptoClase}>
            {areasGet.map((option: Area) => (
              <option key={option.area} value={Number(option.area)}>
                {option.descripcion}
              </option>
            ))}
          </Input>
          <br />
          <Label>Departamento:</Label>
          <Input type="select" name="depto" id="depto" onChange={handleChangeAreaDeptoClase}>
            {deptoGet.map((depto) => (
              <option value={depto.depto}> {depto.descripcion} </option>
            ))}
          </Input>
          <br />
          <CFormGroupInput handleChange={handleChangeAreaDeptoClase} inputName="descripcion" labelName="Descripción:" value={formClase.descripcion} />
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar3} text="Guardar clase" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertarClase()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default AreaDeptoClases;
