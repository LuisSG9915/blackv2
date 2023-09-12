import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
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
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import CButton from "../components/CButton";
import SidebarHorizontal from "../components/SideBarHorizontal";
import useReadHook, { DataClinica } from "../hooks/useReadHook";
import { useNavigate } from "react-router-dom";
import { jezaApi } from "../api/jezaApi";
import useModalHook from "../hooks/useModalHook";
import CFormGroupInput from "../components/CFormGroupInput";
import TabPrueba from "./TabPrueba";
import { Trabajador } from "../models/Trabajador";
import AlertComponent from "../components/AlertComponent";
import { useNominaPuestos } from "../hooks/getsHooks/useNominaPuestos";
import { useNominaDepartamentos } from "../hooks/getsHooks/useNominaDepartamentos";
import { useNominaEscolaridad } from "../hooks/getsHooks/useNominaEscolaridad";
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../hooks/getsHooks/useSeguridad";
import { useBajas } from "../hooks/getsHooks/useBajas";
import { useEstatus } from "../hooks/getsHooks/useEstatus";

function NominaTrabajadores() {
  const { filtroSeguridad, session } = useSeguridad();

  const [showView, setShowView] = useState(true);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ parsedItem });

      // Llamar a getPermisoPantalla después de que los datos se hayan establecido
      getPermisoPantalla(parsedItem);
    }
  }, []);

  const getPermisoPantalla = async (userData) => {
    try {
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_catTrab_view`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].permiso === false) {
          Swal.fire("Error!", "No tiene los permisos para ver esta pantalla", "error");
          setShowView(false);
          handleRedirect();
        } else {
          setShowView(true);
        }
      } else {
        // No se encontraron datos válidos en la respuesta.
        setShowView(false);
      }
    } catch (error) {
      console.error("Error al obtener el permiso:", error);
    }
  };

  const {
    modalActualizar,
    modalInsertar,
    setModalInsertar,
    setModalActualizar,
    cerrarModalActualizar,
    cerrarModalInsertar,
    mostrarModalInsertar,
  } = useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [data, setData] = useState([]);
  const fechaHoy = new Date();

  const { dataNominaPuestos } = useNominaPuestos();
  const { dataNominaDepartamentos } = useNominaDepartamentos();
  const { dataNominaNivel } = useNominaEscolaridad();
  const { dataBajas } = useBajas();
  const { dataEstatus } = useEstatus();

  const [form, setForm] = useState<Trabajador>({
    id: 0,
    clave_empleado: "",
    status: 0,
    nombre: "",
    fecha_nacimiento: "",
    sexo: "",
    RFC: "",
    CURP: "",
    imss: "",
    domicilio: "",
    colonia: "",
    poblacion: "",
    estado: "",
    lugar_nacimiento: "",
    codigo_postal: "",
    telefono1: "",
    telefono2: "",
    email: "",
    idDepartamento: 0,
    idPuesto: 0,
    observaciones: "",
    nivel_escolaridad: 0,
    fecha_baja: "",
    motivo_baja: 0,
    motivo_baja_especificacion: "",
    clave_perfil: 0,
    fecha_alta: "",
    fecha_cambio: "",
    password: "",
    nombreAgenda: "",
    aliasTickets: "",

    // d_estatus: "",
    // descripcion_puesto: "",
    // descripcion_departamento: "", ///descripcion
    // d_nivelEscolaridad: "",
    // d_motiboBaja: "",
  });

  const getTrabajador = () => {
    jezaApi.get("/Trabajador?id=0").then((response) => {
      setData(response.data);
    });
  };
  useEffect(() => {
    getTrabajador();
  }, []);

  const mostrarModalActualizar = (dato: Trabajador) => {
    setForm(dato);
    console.log({ dato });
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Trabajador)[] = [
      "clave_empleado",
      "status",
      "nombre",
      "fecha_nacimiento",
      "sexo",
      "RFC",
      "CURP",
      "imss",
      "domicilio",
      "colonia",
      "poblacion",
      "estado",
      "lugar_nacimiento",
      "CURP",
      "codigo_postal",
      "telefono1",
      "telefono2",
      "email",
      "idDepartamento",
      "idPuesto",
      "observaciones",
      "nivel_escolaridad",
      "clave_perfil",
      "password",
      "nombreAgenda",
      "aliasTickets",
    ];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Trabajador) => {
      const fieldValue = form[campo];
      if (!fieldValue || String(fieldValue).trim() === "") {
        camposVacios.push(campo);
      }
    });

    setCamposFaltantes(camposVacios);

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

  // const insertar = () => {
  //   jezaApi
  //     .post("/Trabajador", null, {
  //       params: {
  //         clave_empleado: "aq1",
  //         status: 12,
  //         nombre: "1qq",
  //         fecha_nacimiento: "2023-01-01T00:00:00",
  //         sexo: "1",
  //         RFC: "RAFSACS",
  //         CURP: "QWERT",
  //         imss: "qwerty1",
  //         domicilio: "qwerty1",
  //         colonia: "qwrty1",
  //         poblacion: "qwert1",
  //         estado: "Ver1",
  //         lugar_nacimiento: "Xalapa1",
  //         codigo_postal: "91014",
  //         telefono1: "12344242",
  //         telefono2: "13141",
  //         email: "uis.sg9915",
  //         idDepartamento: 1,
  //         idPuesto: 1,
  //         observaciones: "q1",
  //         nivel_escolaridad: 1,
  //         fecha_baja: "2023-01-01T00:00:00",
  //         motivo_baja: "q1",
  //         motivo_baja_especificacion: "Baj1",
  //         fecha_alta: "2023-06-01T20:05:37.897",
  //         fecha_cambio: "2023-06-01T20:05:37.897",
  //       },
  //     })
  //     .then(() => { });
  //   setModalInsertar(false);
  // };

  // const insertar = () => {

  //   console.log({ form });
  //   jezaApi
  //     .post("/Trabajador", null, {
  //       params: {

  //         clave_empleado: form.clave_empleado,
  //         status: form.status,
  //         nombre: form.nombre,
  //         fecha_nacimiento: form.fecha_nacimiento,
  //         sexo: form.sexo,
  //         RFC: form.RFC,
  //         CURP: form.CURP,
  //         imss: form.imss,
  //         domicilio: form.domicilio,
  //         colonia: form.colonia,
  //         poblacion: form.poblacion,
  //         estado: form.estado,
  //         lugar_nacimiento: form.lugar_nacimiento,
  //         codigo_postal: form.codigo_postal,
  //         telefono1: form.telefono1,
  //         telefono2: form.telefono2,
  //         email: form.email,
  //         idDepartamento: form.idDepartamento,
  //         idPuesto: form.idPuesto,
  //         observaciones: form.observaciones,
  //         nivel_escolaridad: form.nivel_escolaridad,
  //         fecha_baja: form.fecha_baja,
  //         motivo_baja: form.motivo_baja,
  //         motivo_baja_especificacion: form.motivo_baja_especificacion,
  //         fecha_alta: fechaHoy,
  //         fecha_cambio: fechaHoy,
  //         clave_perfil: form.clave_perfil,
  //         password: form.password,
  //         nombreAgenda: form.nombreAgenda,
  //         aliasTickets: form.aliasTickets,
  //       },
  //     })
  //     .then((response) => {
  //       setVisible(true);
  //       console.log("hecho");
  //       getTrabajador();
  //     })
  //     .catch((e) => {
  //       console.log("no");
  //       console.log(e);
  //     });
  // };

  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_TRABAJADORES_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Trabajador", null, {
          params: {
            clave_empleado: form.clave_empleado,
            status: form.status,
            nombre: form.nombre,
            fecha_nacimiento: form.fecha_nacimiento,
            sexo: form.sexo,
            RFC: form.RFC,
            CURP: form.CURP,
            imss: form.imss,
            domicilio: form.domicilio,
            colonia: form.colonia,
            poblacion: form.poblacion,
            estado: form.estado,
            lugar_nacimiento: form.lugar_nacimiento,
            codigo_postal: form.codigo_postal,
            telefono1: form.telefono1,
            telefono2: form.telefono2,
            email: form.email,
            idDepartamento: form.idDepartamento,
            idPuesto: form.idPuesto,
            observaciones: form.observaciones,
            nivel_escolaridad: form.nivel_escolaridad,
            // fecha_baja: form.fecha_baja,
            // motivo_baja: form.motivo_baja ? form.motivo_baja : 0,
            // motivo_baja_especificacion: form.motivo_baja_especificacion ? form.motivo_baja_especificacion : ".",
            fecha_baja: "2023-08-12",
            motivo_baja: 0,
            motivo_baja_especificacion: "...",
            fecha_alta: fechaHoy,
            fecha_cambio: fechaHoy,
            clave_perfil: form.clave_perfil,
            password: form.password,
            nombreAgenda: form.nombreAgenda,
            aliasTickets: form.aliasTickets,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Trabajador creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getTrabajador();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // const editar = () => {
  //   const fechaHoy = new Date();

  //   jezaApi
  //     .put(`/Trabajador?id=${form.id}`, null, {
  //       params: {

  //         id: form.id,
  //         clave_empleado: form.clave_empleado,
  //         status: form.status,
  //         nombre: form.nombre,
  //         fecha_nacimiento: form.fecha_nacimiento,
  //         sexo: form.sexo,
  //         RFC: form.RFC,
  //         CURP: form.CURP,
  //         imss: form.imss,
  //         domicilio: form.domicilio,
  //         colonia: form.colonia,
  //         poblacion: form.poblacion,
  //         estado: form.estado,
  //         lugar_nacimiento: form.lugar_nacimiento,
  //         codigo_postal: form.codigo_postal,
  //         telefono1: form.telefono1,
  //         telefono2: form.telefono2,
  //         email: form.email,
  //         idDepartamento: form.idDepartamento,
  //         idPuesto: form.idPuesto,
  //         observaciones: form.observaciones,
  //         nivel_escolaridad: form.nivel_escolaridad,
  //         fecha_baja: form.fecha_baja,
  //         motivo_baja: form.motivo_baja,
  //         motivo_baja_especificacion: form.motivo_baja_especificacion,
  //         fecha_alta: form.fecha_alta,
  //         fecha_cambio: fechaHoy,
  //         clave_perfil: form.clave_perfil,
  //         password: form.password,
  //         nombreAgenda: form.nombreAgenda,
  //         aliasTickets: form.aliasTickets,

  //       },
  //     })
  //     .then((r) => {
  //       console.log({ r });
  //       setVisible(true);
  //       getTrabajador();
  //       console.log("no");
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  // Redirige a la ruta "/app"
  const editar = async () => {
    const fechaHoy = new Date();
    const permiso = await filtroSeguridad("CAT_TRABAJADORES_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Trabajador`, null, {
          params: {
            id: form.id,
            clave_empleado: form.clave_empleado,
            status: form.status,
            nombre: form.nombre,
            fecha_nacimiento: form.fecha_nacimiento,
            sexo: form.sexo,
            RFC: form.RFC,
            CURP: form.CURP,
            imss: form.imss,
            domicilio: form.domicilio,
            colonia: form.colonia,
            poblacion: form.poblacion,
            estado: form.estado,
            lugar_nacimiento: form.lugar_nacimiento,
            codigo_postal: form.codigo_postal,
            telefono1: form.telefono1,
            telefono2: form.telefono2,
            email: form.email,
            idDepartamento: form.idDepartamento,
            idPuesto: form.idPuesto,
            observaciones: form.observaciones,
            nivel_escolaridad: form.nivel_escolaridad,
            fecha_baja: form.fecha_baja ? form.fecha_baja : "2023-08-12",
            motivo_baja: form.motivo_baja ? form.motivo_baja : 0,
            motivo_baja_especificacion: form.motivo_baja_especificacion ? form.motivo_baja_especificacion : "...",
            fecha_alta: form.fecha_alta,
            fecha_cambio: fechaHoy,
            clave_perfil: form.clave_perfil,
            password: form.password,
            nombreAgenda: form.nombreAgenda,
            aliasTickets: form.aliasTickets,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Trabajador actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getTrabajador();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // const eliminar = (dato: Trabajador) => {
  //   const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
  //   if (opcion) {
  //     jezaApi.delete(`/Trabajador?id=${dato.id}`).then(() => {
  //       setModalActualizar(false);
  //       getTrabajador();
  //     });
  //   }
  // };

  const eliminar = async (dato: Trabajador) => {
    const permiso = await filtroSeguridad("CAT_TRABAJADORES_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el trabajador: ${dato.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Trabajador?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getTrabajador();
        });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const [activeTab1, setActiveTab1] = useState("1");

  const toggleTab1 = (tab: React.SetStateAction<string>) => {
    if (activeTab1 !== tab) {
      setActiveTab1(tab);
    }
  };

  const [visible, setVisible] = useState(false);

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };

  const LimpiezaForm = () => {
    setForm({
      id: 0,
      clave_empleado: "",
      status: 0,
      nombre: "",
      fecha_nacimiento: "",
      sexo: "",
      RFC: "",
      CURP: "",
      imss: "",
      domicilio: "",
      colonia: "",
      poblacion: "",
      estado: "",
      lugar_nacimiento: "",
      codigo_postal: "",
      telefono1: "",
      telefono2: "",
      email: "",
      idDepartamento: 0,
      idPuesto: 0,
      observaciones: "",
      nivel_escolaridad: 0,
      fecha_baja: "",
      motivo_baja: 0,
      motivo_baja_especificacion: "",
      clave_perfil: 0,
      fecha_alta: "",
      fecha_cambio: "",
      password: "",
      nombreAgenda: "",
      aliasTickets: "",
    });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    { field: "nombre", headerName: "Nombre", flex: 1, headerClassName: "custom-header" },
    { field: "telefono1", headerName: "Teléfono", flex: 1, headerClassName: "custom-header" },
    { field: "telefono2", headerName: "Celular", flex: 1, headerClassName: "custom-header" },
    { field: "email", headerName: "Email", flex: 1, headerClassName: "custom-header" },
    { field: "descripcion_puesto", headerName: "Puesto", flex: 1, headerClassName: "custom-header" },
  ];

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => eliminar(params.row)} size={23}></AiFillDelete>
        {/* <AiFillDelete color="lightred" onClick={() => console.log(params.row.id)} size={23}></AiFillDelete> */}
      </>
    );
  };

  function DataTable() {
    return (
      <div style={{ height: 600, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id}
            hideFooter={false}
            initialState={{
              pagination: {
                paginationModel: { page: 2, pageSize: 30 },
              },
            }}
            pageSizeOptions={[0, 10]}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      {showView ? (
        <>
          <Container>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1> Catálago trabajadores </h1>
              <AiOutlineUser size={30}></AiOutlineUser>
            </div>
            <div className="col align-self-start d-flex justify-content-center "></div>
            <br />
            <br />
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button
                style={{ marginLeft: "auto" }}
                color="success"
                onClick={() => {
                  setModalInsertar(true);
                  setEstado("insert");
                  LimpiezaForm();
                }}
              >
                Crear trabajador
              </Button>

              <Button color="primary" onClick={handleRedirect}>
                <IoIosHome size={20}></IoIosHome>
              </Button>
              <Button onClick={handleReload}>
                <IoIosRefresh size={20}></IoIosRefresh>
              </Button>
            </ButtonGroup>

            <br />
            <br />
            <br />
            <DataTable></DataTable>
          </Container>
          {/* CREAR TRABAJADOR  */}
          <Modal isOpen={modalInsertar} size="xl" fullscreen={"md"}>
            <ModalHeader>
              <div>
                <h3>Crear trabajador</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <Container>
                <Card body>
                  {/* <TabPrueba getTrab={getTrabajador} form2={form} setForm2={setForm}></TabPrueba> */}
                  <Nav tabs>
                    <NavItem>
                      <NavLink className={activeTab1 === "1" ? "active" : ""} onClick={() => toggleTab1("1")}>
                        Trabajador
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={activeTab1 === "2" ? "active" : ""} onClick={() => toggleTab1("2")}>
                        Contacto
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={activeTab1 === "3" ? "active" : ""} onClick={() => toggleTab1("3")}>
                        Adicional
                      </NavLink>
                    </NavItem>
                    {/* <NavItem>
                  <NavLink className={activeTab === "4" ? "active" : ""} onClick={() => toggleTab("4")}>
                    Bajas
                  </NavLink>
                </NavItem> */}
                  </Nav>
                  <TabContent activeTab={activeTab1}>
                    <br />
                    <TabPane tabId="1">
                      <Row>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="nombre"
                            labelName="Nombre:"
                            defaultValue={form ? form.nombre : ""}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="domicilio"
                            labelName="Domicilio:"
                            defaultValue={form?.domicilio ? form.domicilio : form.domicilio}
                          />
                        </Col>

                        <Col sm="6">
                          <Label>Sexo:</Label>
                          <Input
                            className="mb-3"
                            type="select"
                            onChange={handleChange}
                            name="sexo"
                            value={form.sexo ? form.sexo : form.sexo}
                          >
                            <option>--Selecciona el sexo--</option>
                            <option value={"M"}>Masculino</option>
                            <option value={"F"}>Femenino</option>
                          </Input>
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="colonia"
                            labelName="Colonia:"
                            defaultValue={form.colonia ? form.colonia : form.colonia}
                          />
                        </Col>

                        <Col sm="6">
                          <Label for="exampleDate">Fecha de nacimiento:</Label>
                          <Input
                            id="exampleDate"
                            name="fecha_nacimiento"
                            placeholder="date placeholder"
                            type="date"
                            onChange={handleChange}
                            defaultValue={
                              form.fecha_nacimiento ? form.fecha_nacimiento.split("T")[0] : form.fecha_nacimiento
                            }
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="poblacion"
                            labelName="Población:"
                            defaultValue={form.poblacion ? form.poblacion : form.poblacion}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="lugar_nacimiento"
                            labelName="Lugar de nacimiento:"
                            defaultValue={form.lugar_nacimiento ? form.lugar_nacimiento : form.lugar_nacimiento}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="estado"
                            labelName="Estado:"
                            defaultValue={form.estado ? form.estado : form.estado}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="clave_empleado"
                            labelName="Clave empleado:"
                            defaultValue={form.clave_empleado ? form.clave_empleado : form.clave_empleado}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="codigo_postal"
                            labelName="Código postal:"
                            value={form.codigo_postal ? form.codigo_postal : form.codigo_postal}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="clave_perfil"
                            labelName="Clave perfil:"
                            defaultValue={form.clave_perfil ? form.clave_perfil : form.clave_perfil}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="password"
                            labelName="Password:"
                            defaultValue={form.password ? form.password : form.password}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="nombreAgenda"
                            labelName="Nombre de agenda:"
                            defaultValue={form.nombreAgenda ? form.nombreAgenda : form.nombreAgenda}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="aliasTickets"
                            labelName="Alias en el tiket:"
                            defaultValue={form.aliasTickets ? form.aliasTickets : form.aliasTickets}
                          />
                        </Col>
                      </Row>
                      <br />
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="telefono1"
                            labelName="Teléfono:"
                            defaultValue={form.telefono1 ? form.telefono1 : form.telefono1}
                          />
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="telefono2"
                            labelName="Celular:"
                            defaultValue={form.telefono2 ? form.telefono2 : form.telefono2}
                          />
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="email"
                            labelName="Email:"
                            defaultValue={form.email ? form.email : form.email}
                          />
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="3">
                      <Row>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="RFC"
                            labelName="RFC:"
                            defaultValue={form.RFC ? form.RFC : form.RFC}
                          />
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="CURP"
                            labelName="CURP:"
                            defaultValue={form.CURP ? form.CURP : form.CURP}
                          />
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="imss"
                            labelName="IMSS:"
                            defaultValue={form ? form.imss : ""}
                          />
                        </Col>
                        <Col sm="6">
                          <Label>Departamento:</Label>
                          <Input
                            type="select"
                            name="idDepartamento"
                            id="exampleSelect"
                            value={form.idDepartamento}
                            onChange={handleChange}
                          >
                            <option value={0}>--Selecciona una opción--</option>
                            {dataNominaDepartamentos.map((depto) => (
                              <option value={depto.id}>{depto.descripcion_departamento} </option>
                            ))}
                          </Input>
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="observaciones"
                            labelName="Observaciones:"
                            defaultValue={form ? form.observaciones : ""}
                          />
                        </Col>

                        <Col sm="6">
                          <Label>Nivel de escolaridad:</Label>
                          <Input
                            type="select"
                            name="nivel_escolaridad"
                            id="exampleSelect"
                            value={form.nivel_escolaridad}
                            onChange={handleChange}
                          >
                            <option value={0}>--Selecciona una opción--</option>
                            {dataNominaNivel.map((escolaridad) => (
                              <option value={escolaridad.id}>{escolaridad.descripcion} </option>
                            ))}
                          </Input>
                        </Col>

                        <Col sm="6">
                          <Label>Puesto:</Label>
                          <Input
                            type="select"
                            name="idPuesto"
                            id="exampleSelect"
                            value={form.idPuesto}
                            onChange={handleChange}
                          >
                            <option value={0}>--Selecciona una opción--</option>
                            {dataNominaPuestos.map((puesto) => (
                              <option value={puesto.clave_puesto}>{puesto.descripcion_puesto}</option>
                            ))}
                          </Input>
                        </Col>

                        <Col sm="6">
                          <Label>Estatus:</Label>
                          <Input
                            type="select"
                            name="status"
                            id="exampleSelect"
                            value={form.status}
                            onChange={handleChange}
                          >
                            <option value={0}>--Selecciona un estatus--</option>
                            {dataEstatus.map((estatus) => (
                              <option value={estatus.id}>{estatus.descripcion_baja} </option>
                            ))}
                          </Input>
                        </Col>
                      </Row>
                    </TabPane>

                    {/* 
                <TabPane tabId="4">
                  <Container>
                    <Row>
                      <Col sm="6">
                        <Label for="exampleDate">Fecha de baja:</Label>
                        <Input
                          id="exampleDate"
                          name="fecha_baja"
                          type="date"
                          onChange={handleChange}
                          defaultValue={form.fecha_baja ? form.fecha_baja.split("T")[0] : ""}
                        />
                        <br />
                      </Col>
                      <Col sm="6">
                        <Label>Motivo de baja:</Label>
                        <Input type="select" name="motivo_baja" id="exampleSelect" value={form.motivo_baja} onChange={handleChange}>
                          <option value={0}>--Selecciona un motivo de baja--</option>
                          {dataBajas.map((baja) => (
                            <option value={baja.id}>{baja.descripcion_baja} </option>
                          ))}
                        </Input>
                      </Col>


                      <Col sm="8">
                        <CFormGroupInput
                          handleChange={handleChange}
                          inputName="motivo_baja_especificacion"
                          labelName="Especificación de motivo de baja:"
                          defaultValue={form.motivo_baja_especificacion}
                        />
                      </Col>
                    </Row>
                  </Container>
                </TabPane> */}
                    <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
                  </TabContent>
                </Card>
              </Container>
            </ModalBody>
            <ModalFooter>
              <CButton color="success" onClick={insertar} text="Guardar trabajador" />
              <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
            </ModalFooter>
          </Modal>
          {/*  ACTUALIZAR TRABAJADOR */}
          <Modal isOpen={modalActualizar} size="xl" fullscreen={"md"}>
            <ModalHeader>
              <div>
                <h3>Editar trabajador</h3>
              </div>
            </ModalHeader>
            <ModalBody>
              <Container>
                <Card body>
                  {/* <TabPrueba getTrab={getTrabajador} form2={form} setForm2={setForm}></TabPrueba> */}
                  <Nav tabs>
                    <NavItem>
                      <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
                        Trabajador
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
                        Contacto
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")}>
                        Adicional
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={activeTab === "4" ? "active" : ""} onClick={() => toggleTab("4")}>
                        Bajas
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <br />
                    <TabPane tabId="1">
                      <Row>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="nombre"
                            labelName="Nombre:"
                            defaultValue={form ? form.nombre : ""}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="domicilio"
                            labelName="Domicilio:"
                            defaultValue={form?.domicilio ? form.domicilio : form.domicilio}
                          />
                        </Col>

                        <Col sm="6">
                          <Label>Sexo:</Label>
                          <Input
                            className="mb-3"
                            type="select"
                            onChange={handleChange}
                            name="sexo"
                            value={form.sexo ? form.sexo : form.sexo}
                          >
                            <option>--Selecciona una opción--</option>
                            <option value={"M"}>Masculino</option>
                            <option value={"F"}>Femenino</option>
                          </Input>
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="colonia"
                            labelName="Colonia:"
                            defaultValue={form.colonia ? form.colonia : form.colonia}
                          />
                        </Col>

                        <Col sm="6">
                          <Label for="exampleDate">Fecha de nacimiento:</Label>
                          <Input
                            id="exampleDate"
                            name="fecha_nacimiento"
                            placeholder="date placeholder"
                            type="date"
                            onChange={handleChange}
                            defaultValue={
                              form.fecha_nacimiento ? form.fecha_nacimiento.split("T")[0] : form.fecha_nacimiento
                            }
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="poblacion"
                            labelName="Población:"
                            defaultValue={form.poblacion ? form.poblacion : form.poblacion}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="lugar_nacimiento"
                            labelName="Lugar de nacimiento:"
                            defaultValue={form.lugar_nacimiento ? form.lugar_nacimiento : form.lugar_nacimiento}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="estado"
                            labelName="Estado:"
                            defaultValue={form.estado ? form.estado : form.estado}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="clave_empleado"
                            labelName="Clave empleado:"
                            defaultValue={form.clave_empleado ? form.clave_empleado : form.clave_empleado}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="codigo_postal"
                            labelName="Código postal:"
                            value={form.codigo_postal ? form.codigo_postal : form.codigo_postal}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="clave_perfil"
                            labelName="Clave perfil:"
                            defaultValue={form.clave_perfil ? form.clave_perfil : form.clave_perfil}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="password"
                            labelName="Password:"
                            defaultValue={form.password ? form.password : form.password}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="nombreAgenda"
                            labelName="Nombre de agenda:"
                            defaultValue={form.nombreAgenda ? form.nombreAgenda : form.nombreAgenda}
                          />
                        </Col>

                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="aliasTickets"
                            labelName="Alias en el tiket:"
                            defaultValue={form.aliasTickets ? form.aliasTickets : form.aliasTickets}
                          />
                        </Col>
                      </Row>
                      <br />
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="telefono1"
                            labelName="Teléfono:"
                            defaultValue={form.telefono1 ? form.telefono1 : form.telefono1}
                          />
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="telefono2"
                            labelName="Celular:"
                            defaultValue={form.telefono2 ? form.telefono2 : form.telefono2}
                          />
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="email"
                            labelName="Email:"
                            defaultValue={form.email ? form.email : form.email}
                          />
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="3">
                      <Row>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="RFC"
                            labelName="RFC:"
                            defaultValue={form.RFC ? form.RFC : form.RFC}
                          />
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="CURP"
                            labelName="CURP:"
                            defaultValue={form.CURP ? form.CURP : form.CURP}
                          />
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="imss"
                            labelName="IMSS:"
                            defaultValue={form ? form.imss : ""}
                          />
                        </Col>
                        <Col sm="6">
                          <Label>Departamento:</Label>
                          <Input
                            type="select"
                            name="idDepartamento"
                            id="exampleSelect"
                            value={form.idDepartamento}
                            onChange={handleChange}
                          >
                            <option value={0}>--Selecciona una opción--</option>
                            {dataNominaDepartamentos.map((depto) => (
                              <option value={depto.id}>{depto.descripcion_departamento} </option>
                            ))}
                          </Input>
                        </Col>
                        <Col sm="6">
                          <CFormGroupInput
                            handleChange={handleChange}
                            inputName="observaciones"
                            labelName="Observaciones:"
                            defaultValue={form ? form.observaciones : ""}
                          />
                        </Col>

                        <Col sm="6">
                          <Label>Nivel de escolaridad:</Label>
                          <Input
                            type="select"
                            name="nivel_escolaridad"
                            id="exampleSelect"
                            value={form.nivel_escolaridad}
                            onChange={handleChange}
                          >
                            <option value={0}>--Selecciona una opción--</option>
                            {dataNominaNivel.map((escolaridad) => (
                              <option value={escolaridad.id}>{escolaridad.descripcion} </option>
                            ))}
                          </Input>
                        </Col>

                        <Col sm="6">
                          <Label>Puesto:</Label>
                          <Input
                            type="select"
                            name="idPuesto"
                            id="exampleSelect"
                            value={form.idPuesto}
                            onChange={handleChange}
                          >
                            <option value={0}>--Selecciona una opción--</option>
                            {dataNominaPuestos.map((puesto) => (
                              <option value={puesto.clave_puesto}>{puesto.descripcion_puesto}</option>
                            ))}
                          </Input>
                        </Col>

                        <Col sm="6">
                          <Label>Estatus:</Label>
                          <Input
                            type="select"
                            name="status"
                            id="exampleSelect"
                            value={form.status}
                            onChange={handleChange}
                          >
                            <option value={0}>--Selecciona un estatus--</option>
                            {dataEstatus.map((estatus) => (
                              <option value={estatus.id}>{estatus.descripcion_baja} </option>
                            ))}
                          </Input>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="4">
                      <Container>
                        <Row>
                          <Col sm="6">
                            <Label for="exampleDate">Fecha de baja:</Label>
                            <Input
                              id="exampleDate"
                              name="fecha_baja"
                              type="date"
                              onChange={handleChange}
                              defaultValue={form.fecha_baja ? form.fecha_baja.split("T")[0] : ""}
                            />
                            <br />
                          </Col>
                          <Col sm="6">
                            <Label>Motivo de baja:</Label>
                            <Input
                              type="select"
                              name="motivo_baja"
                              id="exampleSelect"
                              value={form.motivo_baja}
                              onChange={handleChange}
                            >
                              <option value={0}>--Selecciona un motivo de baja--</option>
                              {dataBajas.map((baja) => (
                                <option value={baja.id}>{baja.descripcion_baja} </option>
                              ))}
                            </Input>
                          </Col>

                          <Col sm="8">
                            <CFormGroupInput
                              handleChange={handleChange}
                              inputName="motivo_baja_especificacion"
                              labelName="Especificación de motivo de baja:"
                              defaultValue={form.motivo_baja_especificacion}
                            />
                          </Col>
                        </Row>
                      </Container>
                    </TabPane>
                    <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
                  </TabContent>
                </Card>
              </Container>
            </ModalBody>

            <ModalFooter>
              <CButton color="primary" onClick={() => editar()} text="Actualizar" />
              <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
            </ModalFooter>
          </Modal>
        </>
      ) : null}
    </>
  );
}

export default NominaTrabajadores;

//0PUT ANTIGUO  clave_empleado: form.clave_empleado,
// status: form.status,
// nombre: form.nombre,
// fecha_nacimiento: form.fecha_nacimiento ? form.fecha_nacimiento.split("T")[0] : null,
// sexo: form.sexo,
// RFC: form.RFC,
// CURP: form.CURP,
// imss: form.imss,
// domicilio: form.domicilio,
// colonia: form.colonia,
// poblacion: form.poblacion,
// estado: form.estado,
// lugar_nacimiento: form.lugar_nacimiento,
// codigo_postal: form.codigo_postal,
// telefono1: form.telefono1,
// telefono2: form.telefono2,
// email: form.email,
// idDepartamento: form.idDepartamento,
// idPuesto: form.idPuesto,
// observaciones: form.observaciones,
// nivel_escolaridad: form.nivel_escolaridad,
// fecha_baja: form.fecha_baja ? form.fecha_baja.split("T")[0] : null,
// motivo_baja: form.motivo_baja ? form.motivo_baja : 0,
// motivo_baja_especificacion: form.motivo_baja_especificacion,
// fecha_alta: form.fecha_alta,
// fecha_cambio: "2023-06-19",
