import React, { useEffect, useState } from "react";
import { Row, Container, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Table, Alert, Card, CardHeader, CardBody } from "reactstrap";
import CButton from "../../components/CButton";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { jezaApi } from "../../api/jezaApi";
import { TiposdeBajas } from "../../models/TiposdeBajas";
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

function PuestoRecursosHumanos() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_PuestoRH_view`);

      if (Array.isArray(response.data) && response.data.length > 0) {
       Swal.fire("Error!", "No tiene los permisos para ver esta pantalla", "error");
        if (response.data[0].permiso === false) {
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
  const [data, setData] = useState<RecursosHumanosPuesto[]>([]); /* setear valores  */
  const [form, setForm] = useState<RecursosHumanosPuesto>({
    clave_puesto: 0,
    descripcion_puesto: "",
  });

  /* CRUD */
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();

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

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof RecursosHumanosPuesto)[] = ["descripcion_puesto"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof RecursosHumanosPuesto) => {
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
    setForm({ clave_puesto: 0, descripcion_puesto: "" });
  };

  // AQUÍ COMIENZA MI MÉTODO PUT PARA AGREGAR ALMACENES
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_PUESTO_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Puesto", null, {
          params: {
            descripcion: form.descripcion_puesto,

          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Puesto creado con éxito",
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


  // const editar = () => {
  //   jezaApi.put(`/Puesto?id=${form.clave_puesto}&descripcion=${form.descripcion_puesto}`).then(() => {
  //     alert("Registro Actualizado"); //manda alerta
  //     setModalActualizar(!modalActualizar); //cierra modal
  //     getinfo(); // refresca tabla
  //   });
  // };


  // AQUÉ COMIENZA MÉTODO PUT PARA ACTUALIZAR REGISTROS
  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_PUESTO_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Puesto`, null, {
          params: {
            id: form.clave_puesto,
            descripcion: form.descripcion_puesto,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Puesto actualizado con éxito",
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




  // Read --->  GET
  const getinfo = () => {
    jezaApi.get("/Puesto?id=0").then((response) => {
      setData(response.data);
    });
  };

  const eliminar = async (dato: RecursosHumanosPuesto) => {
    const permiso = await filtroSeguridad("CAT_PUESTO_DELS");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el puesto: ${dato.descripcion_puesto}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Puesto?id=${dato.clave_puesto}`).then(() => {
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

  useEffect(() => {
    getinfo();
  }, []);

  /* NO SE PARA QUE SIRVE PERO SE USA PARA EL MODAL  */
  // const toggleUpdateModal = (dato: RecursosHumanosPuesto) => {
  //     setModalActualizar(!modalActualizar);
  //     setForm(dato);
  // };

  const mostrarModalActualizar = (dato: RecursosHumanosPuesto) => {
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

    { field: "descripcion_puesto", headerName: "Puestos", flex: 1, headerClassName: "custom-header" },
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
            getRowId={(row) => row.clave_puesto}
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
      {/* <Row>
                <SidebarHorizontal />
            </Row>
            <br />
            <h1 >Recursos Humanos Puesto</h1>
            <br />
            <Container>
                <div>
                    <Card>
                        <CardHeader>Agregar el puesto: </CardHeader>
                        <CardBody>
                            <Input
                                type="text"
                                name={"descripcion_puesto"}
                                onChange={(e) =>
                                    setForm({ ...form, descripcion_puesto: e.target.value })
                                }
                                value={form.descripcion_puesto}
                                placeholder="Ingrese descripcion"
                            ></Input>
                            <br />
                            <Button color="success" onClick={create}>
                                Agregar
                            </Button>
                        </CardBody>
                    </Card>

                    <br />
                    <br />
                    <Container>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Puestos</th>
                                    <th >Acciones</th>
                                </tr>
                            </thead>

                            <tbody> */}

      {/* {data.map((dato: RecursosHumanosPuesto) => (
                                    <tr key={dato.clave_puesto}>
                                        {/* identificador del */}
      {/* <td align="center">{dato.descripcion_puesto}</td>

                                        <td align="center">
                                            <Button
                                                color="info"
                                                onClick={() => toggleUpdateModal(dato)}
                                            >
                                                <AiFillEdit />
                                            </Button>
                                            <Button onClick={() => eliminar(dato)}>
                                                <AiFillDelete />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </div>
            </Container> */}

      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1>Puestos recursos humanos</h1>
          <GiHumanPyramid size={30} />
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
            Crear puesto
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

      {/* MODAL INSERTAR */}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <h3> Crear puesto</h3>
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            name={"descripcion"}
            onChange={(e) => setForm({ ...form, descripcion_puesto: e.target.value })}
            value={form.descripcion_puesto}

          ></Input>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" text="Guardar puesto" onClick={insertar} />
          <CButton color="danger" text="Cancelar" onClick={cerrarModalInsertar} />
        </ModalFooter>
      </Modal>

      {/* MODAL ACTUALIZAR */}
      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <h3> Editar puesto</h3>
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            name={"descripcion"}
            onChange={(e) => setForm({ ...form, descripcion_puesto: e.target.value })}
            value={form.descripcion_puesto}

          ></Input>
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" text="Actualizar" onClick={editar} />
          <CButton color="danger" text="Cancelar" onClick={cerrarModalActualizar} />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default PuestoRecursosHumanos;
