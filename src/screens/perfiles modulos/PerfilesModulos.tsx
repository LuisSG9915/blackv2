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
import SidebarHorizontal from "../../components/SideBarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import TablePerfilesModulos from "./components/TablePerfilesModulos";
import { Perfil_Modulo } from "../../models/Perfil_Modulo";
import { usePerfiles } from "../../hooks/getsHooks/useClavePerfil";
///NUEVAS IMPORTACIONES
import { useModulos } from "../../hooks/getsHooks/useModulos";
import { Modulo } from "../../models/Modulo";
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { AiFillTags } from "react-icons/ai";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
// import { GrSecures } from "react-icons/gr";

function PerfilesModulos() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const { filtroSeguridad, session } = useSeguridad();
  const { dataModulos } = useModulos();
  const [data, setData] = useState<Perfil_Modulo[]>([]);
  const { dataPerfiles } = usePerfiles();
  const [form, setForm] = useState<Perfil_Modulo>({
    clave_perfil: 1,
    modulo: 1,
    permiso: false,
    d_perfil: "",
  });

  const DataTableHeader = ["Clave Perfil", "Modulo", "Permisos", "Acciones"];

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Perfil_Modulo)[] = ["clave_perfil", "modulo"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Perfil_Modulo) => {
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

  ////////MÓDULO AGREGAR SEGURIDAD

  ////////MODULO EDITAR SEGURIDAD

  // const insertar = async () => {
  //   const permiso = await filtroSeguridad("CAT_SEG_ADD");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }

  //   console.log(validarCampos());
  //   console.log({ form });
  //   if (validarCampos() === true) {
  //     // Verificar si el registro ya existe en la tabla
  //     const registroExistente = data.find(
  //       (registro) => registro.clave_perfil === form.clave_perfil && registro.modulo === form.modulo
  //     );

  //     if (registroExistente) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Registro duplicado",
  //         text: "El registro ya existe en la tabla.",
  //         confirmButtonColor: "#3085d6",
  //       });
  //       return;
  //     }

  //     await jezaApi
  //       .post("/PerfilModulo", null, {
  //         params: {
  //           clave_perfil: Number(form.clave_perfil),
  //           modulo: Number(form.modulo),
  //           permiso: form.permiso,
  //         },
  //       })
  //       .then((response) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Permiso creado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         setModalInsertar(false);
  //         getPerfilModulos();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //   }
  // };

  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_SEG_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (!validarCampos()) {
      return; // Si los campos no son válidos, se sale de la función
    }

    // Verificar si el registro ya existe en la tabla
    const registroExistente = data.find((registro) => registro.clave_perfil === form.clave_perfil && registro.modulo === form.modulo);

    if (registroExistente) {
      Swal.fire({
        icon: "error",
        title: "Registro duplicado",
        text: "El registro ya existe en la tabla.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Insertar el registro si no existe duplicado
    await jezaApi
      .post("/PerfilModulo", null, {
        params: {
          clave_perfil: Number(form.clave_perfil),
          modulo: Number(form.modulo),
          permiso: form.permiso,
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          text: "Permiso creado con éxito",
          confirmButtonColor: "#3085d6",
        });
        setModalInsertar(false);
        getPerfilModulos();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////MÓDULO ELIMINAR SEGURIDAD

  ///AQUI COMIENZA EL MÉTODO PUT PARA ACTUALIZACIÓN DE CAMPOS
  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_SEG_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/PerfilModulo`, null, {
          params: {
            id: form.id,
            clave_perfil: form.clave_perfil,
            modulo: form.modulo,
            permiso: form.permiso,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Permiso actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getPerfilModulos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const eliminar = async (dato: Perfil_Modulo) => {
    const permiso = await filtroSeguridad("CAT_SEG_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el perfil ${dato.d_perfil} con la seguridad en el módulo: ${dato.d_modulo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/PerfilModulo?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getPerfilModulos();
        });
      }
    });
  };

  const getPerfilModulos = async () => {
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

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
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

  const LimpiezaForm = () => {
    setForm({ id: 0, clave_perfil: 0, modulo: 0, permiso: false });
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
    { field: "d_perfil", headerName: "Perfil", flex: 1, headerClassName: "custom-header" },
    {
      field: "d_modulo",
      headerName: "Módulo",
      flex: 1,
      headerClassName: "custom-header",
      renderCell: (params) => <span> {getSeguridadForeignKey(params.row.id)} </span>,
    },
    {
      field: "Permisos",
      renderCell: (params) => <ComponentPermiso params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },
  ];

  const ComponentPermiso = ({ params }: { params: any }) => {
    return (
      <>
        <input type="checkbox" checked={params.row.permiso} disabled />
      </>
    );
  };

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => eliminar(params.row)} size={23}></AiFillDelete>
      </>
    );
  };

  const getSeguridadForeignKey = (idTableSeguridad: number) => {
    const modulo = data.find((modulo: Perfil_Modulo) => modulo.id === idTableSeguridad);
    return modulo ? modulo.d_modulo : "Sin seguridad";
  };

  function DataTable() {
    return (
      <div style={{ height: 800, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id}
            hideFooter={false}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 15 },
              },
            }}
            pageSizeOptions={[5, 10]}
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
          <h1>Seguridad</h1>
          {/* <GrSecures size={30} /> */}
        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
        <br />
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
            Crear seguridad
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
            <h3>Editar seguridad</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="6" className="mb-4">
                <Label>Perfil:</Label>
                <Input type="select" name="clave_perfil" id="exampleSelect" value={form.clave_perfil} onChange={handleChange}>
                  {dataPerfiles.map((perfil) => (
                    <option key={perfil.clave_perfil} value={Number(perfil.clave_perfil)}>
                      {perfil.descripcion_perfil}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md="6">
                <Label>Módulo:</Label>
                <Input type="select" name="modulo" id="exampleSelect" value={form.modulo} onChange={handleChange}>
                  <option value={0}>--Selecciona una opción--</option>
                  {data.map((perfil) => (
                    <option key={perfil.modulo} value={perfil.modulo}>
                      {perfil.d_modulo}
                    </option>
                  ))}
                </Input>
                <br />
              </Col>

              <Col md="12">
                <Label style={{ marginRight: 25 }}>Asignar permiso</Label>
                <Input type="checkbox" name="permiso" checked={form.permiso} onChange={handleChange}></Input>
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
            <h3>Crear permiso</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container className="px-2">
            <FormGroup>
              <Row>
                <Col md="12" className="mb-4">
                  <Label>Perfil: </Label>
                  <Input type="select" name="clave_perfil" id="clave_perfil" value={form.clave_perfil} onChange={handleChange}>
                    <option value={0}>--Selecciona una opción--</option>
                    {dataPerfiles.map((perfil) => (
                      <option key={perfil.clave_perfil} value={Number(perfil.clave_perfil)}>
                        {perfil.descripcion_perfil}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col md="12">
                  <Label>Módulo:</Label>
                  <Input type="select" name="modulo" id="exampleSelect" value={form.modulo} onChange={handleChange}>
                    <option value={0}>--Selecciona una opción--</option>
                    {dataModulos.map((modulo: Modulo) => (
                      <option key={modulo.id} value={Number(modulo.id)}>
                        {modulo.descripcion}
                      </option>
                    ))}
                  </Input>
                  <br />
                </Col>
                <Col md="12">
                  <Label style={{ marginRight: 25 }}>Asignar permiso</Label>
                  <Input type="checkbox" name="permiso" onChange={handleChange}></Input>
                </Col>
              </Row>
            </FormGroup>
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={() => insertar()} text="Guardar permiso" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default PerfilesModulos;
