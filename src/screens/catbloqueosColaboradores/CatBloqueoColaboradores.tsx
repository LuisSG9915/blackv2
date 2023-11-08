import React, { useEffect, useState } from "react";
import {
  Row,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Table,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import CButton from "../../components/CButton";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { jezaApi } from "../../api/jezaApi";
import { TipoBloqueoColaborador } from "../../models/TipoBloqueoColaborador";
import { RecursosHumanosPuesto } from "../../models/RecursosHumanosPuesto";
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
import { GiHumanPyramid } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
import { UserResponse } from "../../models/Home";

function CatBloqueoColaboradores() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=PANTALLA_CAT_TIPO_BLOQUEO`);

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
  const [data, setData] = useState<TipoBloqueoColaborador[]>([]); /* setear valores  */
  const [form, setForm] = useState<TipoBloqueoColaborador>({
    id: 0,
    descripcion: "",
    idEstatusAgenda: 0,
  });

  /* CRUD */
  const {
    modalActualizar,
    modalInsertar,
    setModalInsertar,
    setModalActualizar,
    cerrarModalActualizar,
    cerrarModalInsertar,
    mostrarModalInsertar,
  } = useModalHook();

  // Create ----> POST
  // const insertar = () => {
  //   if (form.descripcion_puesto === "") {
  //     return;
  //   }
  //   jezaApi.post(`/Puesto?descripcion=${form.descripcion_puesto}`).then(() => {
  //     alert("registro cargado"); //manda alerta
  //     getinfo(); // refresca tabla
  //   });
  // };

  // Update ---> PUT

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   // Eliminar espacios en blanco al principio de la cadena
  //   const trimmedValue = value.replace(/^\s+/g, "");
  //   setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
  //   console.log(form);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Eliminar espacios iniciales en todos los campos de entrada de texto
    const sanitizedValue = value.trim();

    if (name === 'idEstatusAgenda') {
      // Eliminar caracteres no numéricos
      const numericValue = sanitizedValue.replace(/[^0-9]/g, '');
      setForm({ ...form, [name]: numericValue });
    } else {
      // Actualizar el valor sin validación en otros campos
      const trimmedValue = value.replace(/^\s+/g, "");
      setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
      console.log(form);
    }
  };


  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof TipoBloqueoColaborador)[] = ["descripcion", "idEstatusAgenda"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof TipoBloqueoColaborador) => {
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

  const LimpiezaForm = () => {
    setForm({ id: 0, idEstatusAgenda: 0, descripcion: "" });
  };

  // AQUÍ COMIENZA MI MÉTODO PUT PARA AGREGAR ALMACENES
  // const insertar = async () => {
  //   const permiso = await filtroSeguridad("CAT_TIPOBLOQUEO_ADD");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   console.log(validarCampos());
  //   console.log({ form });
  //   if (validarCampos() === true) {
  //     await jezaApi
  //       .post("/sp_cat_tiposBloqueosAdd", null, {
  //         params: {
  //           descripcion: form.descripcion,
  //           idEstatusAgenda: form.idEstatusAgenda,
  //         },
  //       })
  //       .then((response) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Tipo de bloqueo creado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         setModalInsertar(false);
  //         getinfo();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //   }
  // };
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_TIPOBLOQUEO_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (validarCampos() === true) {
      try {
        await jezaApi.post("/sp_cat_tiposBloqueosAdd", null, {
          params: {
            descripcion: form.descripcion,
            idEstatusAgenda: form.idEstatusAgenda,
          },
        });

        Swal.fire({
          icon: "success",
          text: "Tipo de bloqueo creado con éxito",
          confirmButtonColor: "#3085d6",
        });

        setModalInsertar(false);
        getinfo();
      } catch (error) {
        console.log(error);
        // Muestra una alerta al usuario indicando que hubo un error al crear el tipo de bloqueo
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al crear el tipo de bloqueo, favor de comunicarse con sistemas",
          confirmButtonColor: "#d33",
        });
      }
    } else {
      // Manejo de la lógica si la validación de campos falla
    }
  };



  // const editar = () => {
  //   jezaApi.put(`/Puesto?id=${form.clave_puesto}&descripcion=${form.descripcion_puesto}`).then(() => {
  //     alert("Registro Actualizado"); //manda alerta
  //     setModalActualizar(!modalActualizar); //cierra modal
  //     getinfo(); // refresca tabla
  //   });
  // };

  // AQUÉ COMIENZA MÉTODO PUT PARA ACTUALIZAR REGISTROS
  // const editar = async () => {
  //   const permiso = await filtroSeguridad("CAT_PUESTO_UPD");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   if (validarCampos() === true) {
  //     await jezaApi
  //       .put(`/sp_cat_tiposBloqueosUpd`, null, {
  //         params: {
  //           id: form.id,
  //           descripcion: form.descripcion,
  //           idEstatusAgenda: form.idEstatusAgenda,
  //         },
  //       })
  //       .then((response) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Tipo de bloqueo actualizado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         setModalActualizar(false);
  //         getinfo();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //   }
  // };

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_TIPOBLOQUEO_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      try {
        await jezaApi.put(`/sp_cat_tiposBloqueosUpd`, null, {
          params: {
            id: form.id,
            descripcion: form.descripcion,
            idEstatusAgenda: form.idEstatusAgenda,
          },
        });

        Swal.fire({
          icon: "success",
          text: "Tipo de bloqueo actualizado con éxito",
          confirmButtonColor: "#3085d6",
        });

        setModalActualizar(false);
        getinfo();
      } catch (error) {
        console.log(error);
        // Aquí puedes mostrar una alerta con el mensaje de error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al actualizar el tipo de bloqueo, favor de comunicarse con sistemas",
          confirmButtonColor: "#d33",
        });
      }
    } else {
      // Manejo de la lógica si la validación de campos falla
    }
  };


  // Read --->  GET
  const getinfo = () => {

    jezaApi.get("/sp_detalle_bloqueosColaboradoresSel?id=%").then((response) => {
      setData(response.data);
    });
  };

  // const eliminar = async (dato: TipoBloqueoColaborador) => {
  //   const permiso = await filtroSeguridad("CAT_TIPOBLOQUEO_DEL");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   Swal.fire({
  //     title: "ADVERTENCIA",
  //     text: `¿Está seguro que desea eliminar el puesto: ${dato.descripcion}?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Sí, eliminar",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       jezaApi.delete(`/sp_cat_tiposBloqueosDel?id=${dato.id}`).then(() => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Registro eliminado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         getinfo();
  //       });
  //     }
  //   });
  // };

  const eliminar = async (dato: TipoBloqueoColaborador) => {
    const permiso = await filtroSeguridad("CAT_TIPOBLOQUEO_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el puesto: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await jezaApi.delete(`/sp_cat_tiposBloqueosDel?id=${dato.id}`);
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getinfo();
        } catch (error) {
          console.log(error);
          // Muestra una alerta al usuario indicando que hubo un error al intentar eliminar el registro
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al eliminar el registro, favor de comunicarse con sistemas",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  useEffect(() => {
    getinfo();
  }, []);

  /* NO SE PARA QUE SIRVE PERO SE USA PARA EL MODAL  */
  // const toggleUpdateModal = (dato: RecursosHumanosPuesto) => {
  //     setModalActualizar(!modalActualizar);
  //     setForm(dato);
  // };

  const mostrarModalActualizar = (dato: TipoBloqueoColaborador) => {
    setForm(dato);
    setModalActualizar(true);
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

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    { field: "descripcion", headerName: "Tipo blloqueo", flex: 1, headerClassName: "custom-header" },
    { field: "idEstatusAgenda", headerName: "Estatus agenda", flex: 1, headerClassName: "custom-header" },
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
      <div style={{ height: 500, width: "100%" }}>
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
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1>Tipos de bloqueos para colaboradores <GiHumanPyramid size={30} /></h1>

        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
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
              Crear tipo de bloqueo
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
        <br />
        <br />
        <DataTable></DataTable>
      </Container>

      {/* MODAL INSERTAR */}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <h3> Crear tipo de bloqueo</h3>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput
            handleChange={handleChange}
            inputName="descripcion"
            labelName="Descripción tipo de bloqueo:"
            value={form.descripcion}
            minlength={5} maxlength={49}
          />
          <CFormGroupInput
            handleChange={handleChange}
            inputName="idEstatusAgenda"
            labelName="Estatus agenda No# :"
            value={form.idEstatusAgenda}
            minlength={1} maxlength={6}
          />

        </ModalBody>
        <ModalFooter>
          <CButton color="success" text="Guardar tipo de bloqueo" onClick={insertar} />
          <CButton color="danger" text="Cancelar" onClick={cerrarModalInsertar} />
        </ModalFooter>
      </Modal>

      {/* MODAL ACTUALIZAR */}
      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <h3> Editar tipo de bloqueo</h3>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput
            handleChange={handleChange}
            inputName="descripcion"
            labelName="Descripción tipo de bloqueo:"
            value={form.descripcion}
            minlength={5} maxlength={49}
          />
          <CFormGroupInput
            handleChange={handleChange}
            inputName="idEstatusAgenda"
            labelName="Estatus agenda No# :"
            value={form.idEstatusAgenda}
            minlength={1} maxlength={6}
          />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" text="Actualizar" onClick={editar} />
          <CButton color="danger" text="Cancelar" onClick={cerrarModalActualizar} />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default CatBloqueoColaboradores;
