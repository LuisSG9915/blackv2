import React, { useEffect, useState } from "react";
import { Row, Container, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Table, Alert, Card, CardHeader, CardBody } from "reactstrap";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { jezaApi } from "../../api/jezaApi";
import { NivelEscolaridad } from "../../models/NivelEscolaridad";
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useNavigate } from "react-router-dom";
import useModalHook from "../../hooks/useModalHook";
import CButton from "../../components/CButton";
import { TbSchool } from "react-icons/tb";

function NivelEscolar() {
  const [data, setData] = useState<NivelEscolaridad[]>([]); /* setear valores  */
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const { filtroSeguridad, session } = useSeguridad();
  const [form, setForm] = useState<NivelEscolaridad>({
    id: 0,
    descripcion: "",
  });

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof NivelEscolaridad)[] = ["descripcion"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof NivelEscolaridad) => {
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
  // const create = () => {
  //   if (form.descripcion === "") {
  //     return;
  //   }
  //   jezaApi.post(`/Nominanivel?descripcion=${form.descripcion}`).then(() => {
  //     alert("registro cargado"); //manda alerta
  //     getNivelEsc(); // refresca tabla
  //   });
  // };

  //AQUI COMIENZA MÉTODO AGREGAR TIPO BAJA
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_ESCOLARIDAD_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Nominanivel", null, {
          params: {
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Nivel de escolaridad creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getNivelEsc();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // Update ---> PUT
  // const update = () => {
  //   jezaApi.put(`/Nominanivel?id=${form.id}&descripcion=${form.descripcion}`).then(() => {
  //     alert("Registro Actualizado"); //manda alerta
  //     setModalActualizar(!modalActualizar); //cierra modal
  //     getNivelEsc(); // refresca tabla
  //   });
  // };

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_ESCOLARIDAD_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Nominanivel`, null, {
          params: {
            id: form.id,
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Nivel de escolaridad actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getNivelEsc();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // Read --->  GET
  const getNivelEsc = () => {
    jezaApi.get("/Nominanivel?id=%").then((response) => {
      setData(response.data);
    });
  };

  // Delete ----> DELETE
  // const eliminar = (dato: NivelEscolaridad) => {
  //   const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento`);
  //   if (opcion) {
  //     jezaApi.delete(`/Nominanivel?id=${dato.id}`).then(() => {
  //       alert("Registro Eliminado");
  //       getNivelEsc(); //refresca tabla
  //     });
  //   }
  // };

  ///AQUÍ COMIENZA EL MÉTODO DELETE

  const eliminar = async (dato: NivelEscolaridad) => {
    const permiso = await filtroSeguridad("CAT_ESCOLRIDAD_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar nivel de escolaridad: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Nominanivel?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getNivelEsc();
        });
      }
    });
  };

  useEffect(() => {
    getNivelEsc();
  }, []);

  /* NO SE PARA QUE SIRVE PERO SE USA PARA EL MODAL */
  const mostrarModalActualizar = (dato: NivelEscolaridad) => {
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

  const LimpiezaForm = () => {
    setForm({ id: 0, descripcion: "" });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },
    // { field: "id", headerName: "id", flex: 1, headerClassName: "custom-header" },
    { field: "descripcion", headerName: "Nivel de escolaridad", flex: 1, headerClassName: "custom-header" },
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
      <div style={{ height: 300, width: "100%" }}>
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
          <h1>Nivel de escolaridad</h1>
          <TbSchool size={40} />
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
            Crear nivel de escolaridad
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

      {/* MODAL AGREGAR NIVEL ESCOLAR*/}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <h3>Crear nivel de escolaridad</h3>
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            name={"descripcion"}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            value={form.descripcion}
          ></Input>
        </ModalBody>
        <ModalFooter>
          <CButton text="Guardar nivel de escolaridad" color="success" onClick={insertar} />
          <CButton text="Cancelar" color="danger" onClick={() => cerrarModalInsertar()} />
        </ModalFooter>
      </Modal>

      {/* SANTOS ME DIJO QUE LOS MODALS LOS PUSIERA ABAJO */}
      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <h3>Editar nivel de escolaridad</h3>
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            name={"descripcion"}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            value={form.descripcion}
          ></Input>
        </ModalBody>
        <ModalFooter>
          <CButton text="Actualizar" color="primary" onClick={editar} />
          <CButton text="Cancelar" color="danger" onClick={() => cerrarModalActualizar()} />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default NivelEscolar;
