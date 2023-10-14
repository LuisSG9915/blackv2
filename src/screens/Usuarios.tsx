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
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../hooks/getsHooks/useSeguridad";

function Usuarios() {

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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_usuarios_view`);

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



  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const { filtroSeguridad, session } = useSeguridad();

  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [data, setData] = useState([]);
  const [dataText, setDataText] = useState("");
  const [dataPerfil, setDataPerfil] = useState<Perfil[]>([]);
  const [form, setForm] = useState<Usuario>({
    id: 0,
    usuario: "",
    clave_perfil: 0,
    password: "",
    nombre: "",
    celular: "",
    telefono: "",
    email: "",
    fecha_alta: "",
    fecha_act: "",
  });

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Usuario)[] = ["usuario", "clave_perfil", "password", "nombre", "celular", "telefono", "email"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Usuario) => {
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

  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_EMPRE_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Usuario", null, {
          params: {
            usuario: form.usuario,
            clave_perfil: form.clave_perfil,
            password: form.password,
            nombre: form.nombre,
            celular: form.celular,
            telefono: form.telefono,
            email: form.email,
            fecha_alta: "2023-07-31",
            fecha_act: "2023-07-31",
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Usuario creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getUsuario();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
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

  // Redirige a la ruta "/app"
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
      usuario: "",
      clave_perfil: 0,
      password: "",
      nombre: "",
      celular: "",
      telefono: "",
      email: "",
      fecha_alta: "",
      fecha_act: "",
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

    { field: "usuario", headerName: "Usuario", flex: 1, headerClassName: "custom-header" },
    { field: "d_perfil", headerName: "Clave perfil", flex: 1, headerClassName: "custom-header" },
    { field: "nombre", headerName: "Nombre", flex: 1, headerClassName: "custom-header" },
    { field: "telefono", headerName: "Celular", flex: 1, headerClassName: "custom-header" },
    { field: "email", headerName: "Email", flex: 1, headerClassName: "custom-header" },
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
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1>Usuarios</h1>
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
            Crear usuario
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

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar usuarios</h3>
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
                <br />
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
          <CButton color="primary" onClick={() => editar(form)} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Crear usuario</h3>
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
                <br />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="telefono" labelName="Teléfono:" defaultValue={form.telefono} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" defaultValue={form.email} />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar usuario" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Usuarios;
