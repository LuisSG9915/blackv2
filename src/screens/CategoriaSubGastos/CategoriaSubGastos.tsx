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
import { Cia } from "../../models/Cia";
import AlertComponent from "../../components/AlertComponent";
import { useCias } from "../../hooks/getsHooks/useCias";
import { GastoCategoriaSub } from "../../models/GastoCategoriaSub";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
function CategoriaSubGastos() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_cat_s_gasto_view`);

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

  // AQUI COMIENZA MI MÉTODO POST PARA AGREGAR CATEGORIAS
  const [dataG, setDataG] = useState<GastoCategoria[]>([]);
  const [formG, setFormG] = useState<GastoCategoria>({
    id: 1,
    cia: 1,
    id_gasto: 1,
    descripcion: "",
  });

  // AQUI COMIENZA MI MÉTODO POST PARA AGREGAR CATEGORIAS
  const [data, setData] = useState<GastoCategoriaSub[]>([]);
  const [form, setForm] = useState<GastoCategoriaSub>({
    id: 1,
    cia: 1,
    id_gasto: 1,
    id_subgasto: 1,
    descripcion: "",
  });

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof GastoCategoriaSub)[] = ["cia", "descripcion", "id_gasto", "id_subgasto"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof GastoCategoriaSub) => {
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
    const permiso = await filtroSeguridad("CAT_SUB_GASTO_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/SubCategoria", null, {
          params: {
            cia: Number(form.cia),
            id_gasto: Number(formG.id_gasto),
            id_subgasto: Number(form.id_subgasto),
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Subcategoría creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getCategoriaSubGastos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const getCategoriaSubGastos = () => {
    jezaApi.get("/SubCategoria?id=0").then((response) => {
      setData(response.data);
      console.log(response.data);
      console.log("-----------------------");
    });
  };
  const getCategoriaGasto = () => {
    jezaApi.get("/Categoria?id=0").then((response) => {
      setDataG(response.data);
    });
  };
  // const { dataProductos } = useProductos();

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_SUB_GASTO_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/SubCategoria`, null, {
          params: {
            id: Number(form.id),
            cia: Number(form.cia),
            id_gasto: Number(formG.id_gasto),
            id_subgasto: Number(form.id_subgasto),
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Subcategoría actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getCategoriaSubGastos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const eliminar = async (dato: GastoCategoriaSub) => {
    const permiso = await filtroSeguridad("CAT_SUB_GASTO_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar la subcategoría: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/SubCategoria?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getCategoriaSubGastos();
        });
      }
    });
  };

  useEffect(() => {
    getCategoriaSubGastos();
    fetchCias();
    getCategoriaGasto();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "en_linea" || name === "es_bodega") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: GastoCategoriaSub) => ({ ...prevState, [name]: value }));
    }
  };

  const toggleCreateModal = () => {
    setForm({
      // Restablecer el estado del formulario
      id: 1,
      cia: 1,
      id_gasto: 1,
      id_subgasto: 1,
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
    setForm({ id: 0, cia: 0, id_gasto: 1, id_subgasto: 0, descripcion: "" });
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
      field: "Gas",
      headerName: "Gasto",
      width: 300,
      headerClassName: "custom-header",
      renderCell: (params) => <span> {getGastoCategoriaForeignKey(params.row.id_gasto)} </span>,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      width: 400,
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

  const getGastoCategoriaForeignKey = (idTableGasto: number) => {
    console.log({ dataG });
    const Gas = dataG.find((Gas: GastoCategoria) => Gas.id_gasto === idTableGasto);
    return Gas ? Gas.descripcion : "Sin categoría";
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
            <br />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>Subcategorías de gastos</h1>
              <GiPayMoney size={35}></GiPayMoney>
            </div>
            <br />
            <br />
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
                    Crear Subcategoría
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
        <ModalHeader toggle={toggleCreateModal}>Crear categoría</ModalHeader>
        <ModalBody>
          <Label>Empresa:</Label>
          <Input type="select" name="cia" id="cia" defaultValue={form.cia} onChange={handleChange}>
            <option value="">Selecciona empresa</option>
            {dataCias.map((cia: Cia) => (
              <option key={cia.id} value={cia.id}>
                {cia.nombre}
              </option>
            ))}
          </Input>
          <br />
          <Label>Gasto: </Label>
          <Input
            type="select"
            name="id_gasto"
            onChange={(e) => setFormG({ ...formG, id_gasto: parseInt(e.target.value) })}
            defaultValue={formG.id_gasto}
          >
            <option value="">Selecciona categoría de gasto</option>
            {dataG.map((gasto: GastoCategoria) => (
              <option value={gasto.id_gasto}>{gasto.descripcion}</option>
            ))}
          </Input>
          <br />
          <Label>Id subgasto:</Label>
          <Input
            type="number"
            name="id_subgasto"
            defaultValue={form.id_subgasto}
            onChange={(e) => {
              setForm({ ...form, id_subgasto: Number(e.target.value) });
              console.log(form);
            }}
            min="1"
          />
          <br />
          <Label>Descripción:</Label>
          <Input
            type="text"
            name="descripcion"
            defaultValue={form.descripcion}
            onChange={(e) => {
              setForm({ ...form, descripcion: e.target.value });
              console.log(form);
            }}
            min="1"
          />
          <br />
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertar} text=" Guardar Subcategoría" />
          <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* AQUI COMIENZA EL MODAL PARA ACTUALIZAR */}
      <Modal isOpen={modalActualizar} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>Editar categoría</ModalHeader>
        <ModalBody>
          <Label>Empresa:</Label>
          <Input type="select" name="cia" id="cia" defaultValue={form.cia} onChange={handleChange}>
            <option value="">Selecciona sucursal</option>
            {dataCias.map((cia: Cia) => (
              <option key={cia.id} value={cia.id}>
                {cia.nombre}
              </option>
            ))}
          </Input>
          <br />
          <Label>Gasto: </Label>
          <Input
            type="select"
            name="id_gasto"
            onChange={(e) => setFormG({ ...formG, id_gasto: parseInt(e.target.value) })}
            defaultValue={formG.id_gasto}
          >
            <option value="">Selecciona categoría de gasto</option>
            {dataG.map((gasto: GastoCategoria) => (
              <option value={gasto.id_gasto}>{gasto.descripcion}</option>
            ))}
          </Input>
          <br />
          <Label>Id subgasto:</Label>
          <Input
            type="number"
            name="id_subgasto"
            defaultValue={form.id_subgasto}
            onChange={(e) => {
              setForm({ ...form, id_subgasto: Number(e.target.value) });
              console.log(form);
            }}
            min="1"
          />
          <br />
          <Label>Descripción:</Label>
          <Input
            type="text"
            name="descripcion"
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

export default CategoriaSubGastos;
