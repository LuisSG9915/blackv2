import React, { useEffect, useState } from "react";
import { Row, Container, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Table, Alert } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { jezaApi } from "../../api/jezaApi";
import { GastoCategoria } from "../../models/GastoCategoria";
import useModalHook from "../../hooks/useModalHook";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
//NUEVAS IMPORTACIONES
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CButton from "../../components/CButton";
import { Sucursal } from "../../models/Sucursal";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Cia } from "../../models/Cia";
import AlertComponent from "../../components/AlertComponent";
import { useCias } from "../../hooks/getsHooks/useCias";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
function CategoriaGastos() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_cat_gasto_view`);

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
  /* modals */
  /* Funcion que se usa en el modal de editar o actualizar el paquete*/
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();

  const { dataCias, fetchCias } = useCias();

  const [form, setForm] = useState<GastoCategoria>({
    id: 0,
    cia: 0,
    id_gasto: 0,
    descripcion: "",
  });

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  // AQUI COMIENZA MI MÉTODO POST PARA AGREGAR CATEGORIAS
  const [data, setData] = useState<GastoCategoria[]>([]);

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof GastoCategoria)[] = ["cia", "descripcion"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof GastoCategoria) => {
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

  // const insertCategoGast=>o = ()  {
  //   console.log({ form });
  //   jezaApi
  //     .post(`/Categoria`, null, {
  //       params: {
  //         cia: Number(form.cia),
  //         id_gasto: 0,
  //         descripcion: form.descripcion,
  //       },
  //     })
  //     .then(() => {
  //       setVisible1(true);
  //       getCategoriaGasto();
  //       toggleCreateModal(); // Cerrar modal después de guardar
  //       setTimeout(() => {
  //         setVisible1(false);
  //       }, 3000);
  //       console.log("ejecutado");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_GASTOS_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Categoria", null, {
          params: {
            cia: form.cia,
            id_gasto: 0,
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Categoría creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getCategoriaGasto();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const getCategoriaGasto = () => {
    jezaApi.get("/Categoria?id=0").then((response) => {
      setData(response.data);
    });
  };
  // const { dataProductos } = useProductos();

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_GASTOS_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Categoria`, null, {
          params: {
            id: form.id,
            cia: form.cia,
            id_gasto: form.id_gasto,
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Categoría actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getCategoriaGasto();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // const updateCategoriaGasto = (dato: GastoCategoria) => {
  //   console.log({ dato });
  //   jezaApi
  //     .put(`/Categoria`, null, {
  //       params: {
  //         id: form.id,
  //         cia: Number(form.cia),
  //         id_gasto: 0,
  //         descripcion: form.descripcion,
  //       },
  //     })
  //     .then((response) => {
  //       setVisible2(true);
  //       getCategoriaGasto();
  //       setModalActualizar(!modalActualizar);
  //       setTimeout(() => {
  //         setVisible2(false);
  //       }, 3000);
  //       // Cerrar modal después de guardar
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const eliminar = async (dato: GastoCategoria) => {
    const permiso = await filtroSeguridad("CAT_GASTOS_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar la categoría: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Categoria?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getCategoriaGasto();
        });
      }
    });
  };

  useEffect(() => {
    getCategoriaGasto();
    fetchCias();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "en_linea" || name === "es_bodega") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: GastoCategoria) => ({ ...prevState, [name]: value }));
    }
  };

  const toggleCreateModal = () => {
    setForm({
      // Restablecer el estado del formulario
      id: 0,
      cia: 0,
      id_gasto: 0,
      descripcion: "",
    });
    setModalInsertar(!modalInsertar);
  };

  const toggleUpdateModal = (dato: any) => {
    setModalActualizar(!modalActualizar);
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

  //REALIZA LA LIMPIEZA DE LOS CAMPOS AL CREAR UNA SUCURSAL
  const LimpiezaForm = () => {
    setForm({ id: 0, cia: 0, id_gasto: 0, descripcion: "" });
  };

  /* alertas */
  const [creado, setVisible1] = useState(false);
  const [actualizado, setVisible2] = useState(false);
  const [eliminado, setVisible3] = useState(false);
  const [error, setVisible4] = useState(false);

  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      width: 130,
      headerClassName: "custom-header",
    },
    // { field: "id", headerName: "ID", width: 200, headerClassName: "custom-header", },
    {
      field: "cia",
      headerName: "Empresa",
      width: 300,
      headerClassName: "custom-header",
      renderCell: (params) => <span> {getCiaForeignKey(params.row.cia)} </span>,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      width: 300,
      headerClassName: "custom-header",
    },
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

  const getCiaForeignKey = (idTableCia: number) => {
    const cia = dataCias.find((cia: Cia) => cia.id === idTableCia);
    return cia ? cia.nombre : "Sin Compania";
  };

  function DataTable() {
    return (
      <div style={{ height: 400, width: "90%" }}>
        <div style={{ height: "100%", width: "80vw" }}>
          <DataGrid
            rows={data}
            columns={columns}
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
        <Row>
          <Container fluid>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>Categoría de gastos <GiReceiveMoney size={35}></GiReceiveMoney></h1>

            </div>

            <Row>
              <div>
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
                    Crear categoría
                  </Button>

                  <Button color="primary" onClick={handleRedirect}>
                    <IoIosHome size={20}></IoIosHome>
                  </Button>
                  <Button onClick={handleReload}>
                    <IoIosRefresh size={20}></IoIosRefresh>
                  </Button>
                </ButtonGroup>
              </div>
            </Row>
          </Container>
          <br />
          <br />
        </Row>
      </Container>
      <br />
      <br />
      <Container>
        <DataTable></DataTable>
      </Container>

      <Modal isOpen={modalInsertar} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}><h3>Crear categoría</h3></ModalHeader>
        <ModalBody>
          <Label>Empresa:</Label>
          <Input type="select" name="cia" id="cia" defaultValue={form.cia} onChange={handleChange}>
            <option value="">--Selecciona una empresa--</option>

            {dataCias.map((cia: Cia) => (
              <option key={cia.id} value={cia.id}>
                {cia.nombre}
              </option>
            ))}
          </Input>
          <br />
          <Label>Descripción:</Label>
          <Input
            type="text"
            name="cantidad"
            defaultValue={form.descripcion}
            onChange={(e) => {
              setForm({ ...form, descripcion: e.target.value });
              console.log(form);
            }}
            min="1"

          />

        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertar} text=" Guardar categoría" />
          <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* AQUI COMIENZA EL MODAL PARA ACTUALIZAR */}
      <Modal isOpen={modalActualizar} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}><h3>Editar categoría</h3></ModalHeader>
        <ModalBody>
          <Label>Empresa:</Label>
          <Input type="select" name="cia" id="cia" defaultValue={form.cia} onChange={handleChange}>
            <option value="">--Selecciona una empresa--</option>
            {dataCias.map((cia: Cia) => (
              <option key={cia.id} value={cia.id}>
                {cia.nombre}
              </option>
            ))}
          </Input>

          <br />
          <Label>Descripción:</Label>
          <Input
            type="text"
            name="cantidad"
            defaultValue={form.descripcion}
            onChange={(e) => {
              setForm({ ...form, descripcion: e.target.value });
              console.log(form);
            }}
            min="1"

          />

        </ModalBody>

        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default CategoriaGastos;
