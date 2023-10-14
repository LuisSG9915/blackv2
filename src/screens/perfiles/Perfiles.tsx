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
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { BsPersonVcard } from "react-icons/bs";

function Perfiles() {
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
  //AAA
  const getPermisoPantalla = async (userData) => {
    try {
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_cPerfiles_view`);

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
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [data, setData] = useState([]);

  const [form, setForm] = useState<Perfil>({
    clave_perfil: 1,
    descripcion_perfil: "",
  });

  const DataTableHeader = ["perfiles", "acciones"];

  const mostrarModalActualizar = (dato: Perfil) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Perfil)[] = ["descripcion_perfil"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Perfil) => {
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

  /////CREAR PERFIL
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_PERFIL_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Perfil", null, {
          params: {
            descripcion: form.descripcion_perfil,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Perfil creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getPerfiles();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  /////ACTUALIZAR PERFIL

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_PERFIL_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Perfil`, null, {
          params: {
            id: form.clave_perfil,
            descripcion: form.descripcion_perfil,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Perfil actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getPerfiles();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  /////ELIMINAR PERFIL
  const eliminar = async (dato: Perfil) => {
    const permiso = await filtroSeguridad("CAT_PERFIL_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el perfil: ${dato.descripcion_perfil}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Perfil?id=${dato.clave_perfil}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getPerfiles();
        });
      }
    });
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Eliminar espacios en blanco al principio de la cadena
    const trimmedValue = value.replace(/^\s+/g, "");
    setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
    console.log(form);
  };


  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
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

  //LIMPIEZA DE CAMPOS
  const [estado, setEstado] = useState("");

  const LimpiezaForm = () => {
    setForm({ clave_perfil: 0, descripcion_perfil: "" });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    { field: "clave_perfil", headerName: "Clave perfil", flex: 1, headerClassName: "custom-header" },
    { field: "descripcion_perfil", headerName: "Descripción", flex: 1, headerClassName: "custom-header" },
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
            getRowId={(row) => row.clave_perfil}
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
          <h1> Perfiles  <BsPersonVcard size={30}></BsPersonVcard></h1>

        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
        <br />
        <br />
        <div>
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
        </div>
        <br />
        <DataTable></DataTable>
      </Container>

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar perfil</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <CFormGroupInput handleChange={handleChange} inputName="descripcion_perfil" labelName="Descripción del perfil::" value={form.descripcion_perfil} />
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar} about="">
        <ModalHeader>
          <div>
            <h3>Crear perfil</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput
            handleChange={handleChange}
            inputName="descripcion_perfil"
            labelName="Descripción del perfil:"
            value={form.descripcion_perfil}
          />
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={() => insertar()} text="Guardar perfil" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Perfiles;
