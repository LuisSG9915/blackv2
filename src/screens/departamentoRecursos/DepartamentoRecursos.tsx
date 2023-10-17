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
import SidebarHorizontal from "../../components/SideBarHorizontal";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { jezaApi } from "../../api/jezaApi";
import { RecursosDepartamento } from "../../models/RecursosDepartamento";
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
import useModalHook from "../../hooks/useModalHook";
import CButton from "../../components/CButton";
import { useNavigate } from "react-router-dom";
import { Md6FtApart } from "react-icons/md";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import CFormGroupInput from "../../components/CFormGroupInput";
import { UserResponse } from "../../models/Home";
function DepartamentoRecursos() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_DeptoRecurso_view`);

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
  const [data, setData] = useState<RecursosDepartamento[]>([]); /* setear valores  */

  const { dataSucursales } = useSucursales();
  const [form, setForm] = useState<RecursosDepartamento>({
    id: 0,
    descripcion_departamento: "",
    idSucursal: 0,
  });
  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof RecursosDepartamento)[] = ["descripcion_departamento"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof RecursosDepartamento) => {
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

  // Create ----> POST
  // const insertar = () => {

  //     jezaApi.post(`/NominaDepartamento?descripcion=${form.descripcion_departamento}&idSucursal=${form.idSucursal}`).then(() => {
  //         alert("registro cargado"); //manda alerta
  //         getinfo();// refresca tabla
  //     });
  // };

  //AQUI COMIENZA MÉTODO AGREGAR TIPO BAJA
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_DEPTORH_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/NominaDepartamento", null, {
          params: {
            descripcion_departamento: form.descripcion_departamento,
            idSucursal: dataUsuarios2[0]?.sucursal,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Departamento creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getinfo();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // // Update ---> PUT
  // const update = () => {
  //     jezaApi
  //         .put(`/NominaDepartamentos?id=${form.id}&descripcion_departamento=${form.descripcion_departamento}&idsuc=${form.idSucursal}`)
  //         .then(() => {
  //             alert("Registro Actualizado"); //manda alerta
  //             setModalActualizar(!modalActualizar); //cierra modal
  //             getinfo();// refresca tabla
  //         });
  // };

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_DEPTORH_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/NominaDepartamentos`, null, {
          params: {
            id: form.id,
            descripcion_departamento: form.descripcion_departamento,
            idsuc: form.idSucursal,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Departamento actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getinfo();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // Delete ----> DELETE
  // const eliminar = (dato: RecursosDepartamento) => {
  //     const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento`);
  //     if (opcion) {
  //         jezaApi.delete(`/NominaDepartamentos?id=${dato.id}`).then(() => {
  //             alert("Registro Eliminado");
  //             getinfo();//refresca tabla
  //         });
  //     }
  // };

  const eliminar = async (dato: RecursosDepartamento) => {
    const permiso = await filtroSeguridad("CAT_DEPTORH_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el departamento: ${dato.descripcion_departamento}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/NominaDepartamentos?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getinfo();
        });
      }
    });
  };

  // Read --->  GET
  const getinfo = () => {
    jezaApi.get(`/NominaDepartamentos?id=%&idcia=%&idsuc=${dataUsuarios2[0]?.sucursal}`).then((response) => {
      setData(response.data);
    });
  };
  useEffect(() => {
    getinfo();
  }, [dataUsuarios2[0]?.sucursal]);

  /* Modal */
  const [modalUpdate, setModalUpdate] = useState(false); /* definimos el usestate del modal */

  /* NO SE PARA QUE SIRVE PERO SE USA PARA EL MODAL */
  const mostrarModalActualizar = (dato: RecursosDepartamento) => {
    setModalActualizar(true);
    setForm(dato);
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Eliminar espacios en blanco al principio de la cadena
    const trimmedValue = value.replace(/^\s+/g, "");
    setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
    console.log(form);
  };


  const LimpiezaForm = () => {
    setForm({ id: 0, descripcion_departamento: "", idSucursal: 0 });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    { field: "descripcion_departamento", headerName: "Departamento", flex: 1, headerClassName: "custom-header" },
    { field: "nombreCia", headerName: "Empresa", flex: 1, headerClassName: "custom-header" },
    { field: "nombreSuc", headerName: "Sucursal", flex: 1, headerClassName: "custom-header" },
    // { field: "nombre", headerName: "Sucursal", flex: 1, headerClassName: "custom-header" },
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
          <h1>Tipos de departamentos <Md6FtApart size={30} /></h1>

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
        <br />
        <br />
        <DataTable></DataTable>
      </Container>

      {/* SANTOS ME DIJO QUE LOS MODALS LOS PUSIERA ABAJO */}
      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <h3> Editar tipo departamento</h3>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput
            handleChange={handleChange}
            inputName="descripcion_departamento"
            labelName="Descripción del departamento:"
            value={form.descripcion_departamento}
          />

          {/* <Input
            type="text"
            name={"descripcion"}
            onChange={(e) => setForm({ ...form, descripcion_departamento: e.target.value })}
            value={form.descripcion_departamento}
          ></Input> */}
        </ModalBody>
        <ModalFooter>
          <CButton text="Actualizar" color="primary" onClick={editar} />
          <CButton text="Cancelar" color="danger" onClick={cerrarModalActualizar} />
        </ModalFooter>
      </Modal>

      {/* SANTOS ME DIJO QUE LOS MODALS LOS PUSIERA ABAJO */}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <h3>Crear tipo departamento</h3>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput
            handleChange={handleChange}
            inputName="descripcion_departamento"
            labelName="Descripción del departamento:"
            value={form.descripcion_departamento}
          />
          {/* <Input
            type="text"
            name={"descripcion"}
            onChange={(e) => setForm({ ...form, descripcion_departamento: e.target.value })}
            value={form.descripcion_departamento}
          ></Input> */}
        </ModalBody>
        <ModalFooter>
          <CButton text="Guardar departamento" color="success" onClick={insertar} />
          <CButton text="Cancelar" color="danger" onClick={cerrarModalInsertar} />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DepartamentoRecursos;
