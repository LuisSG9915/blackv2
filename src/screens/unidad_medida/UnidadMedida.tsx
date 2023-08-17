import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit, AiFillStop, AiFillPushpin } from "react-icons/ai";
import { MdInventory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Row, InputGroup, Container, Col, Input, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Label } from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Sucursal } from "../../models/Sucursal";
import { Cia } from "../../models/Cia";
import AlertComponent from "../../components/AlertComponent";
import { useCias } from "../../hooks/getsHooks/useCias";
import { useReactToPrint } from "react-to-print";
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useUnidadMedida } from "../../hooks/getsHooks/useUnidadMedida";
import { UnidadMedidaModel } from "../../models/UnidadMedidaModel";
import { TbAngle } from "react-icons/tb";

function UnidadMedida() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const { dataUnidadMedida, fetchUnidadMedida } = useUnidadMedida();
  const [data, setData] = useState<Sucursal[]>([]);
  const { dataCias, fetchCias } = useCias();

  const [form, setForm] = useState<UnidadMedidaModel>({
    id: 0,
    descripcion: "",
  });

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof UnidadMedidaModel)[] = ["descripcion"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof UnidadMedidaModel) => {
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
    const permiso = await filtroSeguridad("CAT_UNIDADMEDIDA_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/UnidadMedida", null, {
          params: {
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Unidad de medida creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          fetchUnidadMedida();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  ///AQUI COMIENZA EL MÉTODO PUT PARA ACTUALIZACIÓN DE CAMPOS
  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_UNIDADMEDIDA_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/UnidadMedida`, null, {
          params: {
            id: form.id,
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Unidad de medida actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          fetchUnidadMedida();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  ///AQUÍ COMIENZA EL MÉTODO DELETE
  const eliminar = async (dato: UnidadMedidaModel) => {
    const permiso = await filtroSeguridad("CAT_UNIDADMEDIDA_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar la unidad de medida: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/UnidadMedida?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          fetchUnidadMedida();
        });
      }
    });
  };

  //AQUI COMIENZA EL MÉTODO GET PARA VISUALIZAR LOS REGISTROS
  const getSucursal = () => {
    jezaApi
      .get("/Sucursal?id=0")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getSucursal();
  }, []);

  const filtroEmail = (datoMedico: string) => {
    var resultado = data.filter((elemento: any) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if ((datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.nombre.length > 2) {
        return elemento;
      }
    });
    setData(resultado);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "en_linea" || name === "es_bodega") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: UnidadMedidaModel) => ({ ...prevState, [name]: value }));
    }
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
    setForm({ id: 0, descripcion: "" });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      width: 120,
      headerClassName: "custom-header",
    },
    // { field: "sucursal", headerName: "ID", width: 200, headerClassName: "custom-header", },
    {
      field: "descripcion",
      headerName: "Descripción",
      width: 150,
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

  function DataTable() {
    const getRowId = (row: UnidadMedidaModel) => row.id;
    return (
      <div className="table-responsive" style={{ height: "59%", overflow: "auto" }}>
        <div style={{ height: "100%", display: "table", tableLayout: "fixed", width: "100%" }}>
          <DataGrid
            rows={dataUnidadMedida}
            columns={columns}
            hideFooter={false}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 15 },
              },
            }}
            pageSizeOptions={[5, 10]}
            getRowId={getRowId}
          />
        </div>
      </div>
    );
  }
  const handleOpenNewWindow = () => {
    const url = "https://www.example.com"; // Reemplaza esto con la URL que desees abrir
    const width = 600;
    const height = 500;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;

    // Open the new window
    window.open(url, "_blank", features);
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        {" "}
        {/* <button onClick={handleOpenNewWindow}>Open New Window</button> */}
        <Row>
          <Col>
            <Container fluid>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1> Unidad de medida </h1>
                <TbAngle size={35} />
              </div>
              <br />
              <br />
              <Row>
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
                      Crear unidad de medida
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
            {/* <TableSucursal dataCia={dataCias} DataTableHeader={DataTableHeader} data={data} eliminar={eliminar} mostrarModalActualizar={mostrarModalActualizar} /> */}
            <DataTable></DataTable>
          </Col>
        </Row>
      </Container>

      {/* AQUÍ COMIENZA EL MODAL PARA AGREGAR SUCURSALES */}
      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar unidad de medida</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md={"12"}>
                <CFormGroupInput
                  handleChange={handleChange}
                  inputName="descripcion"
                  labelName="Nombre de la unidad de medida:"
                  value={form.descripcion}
                />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* AQUÍ COMIENZA EL MODAL PARA AGREGAR SUCURSALES */}
      <Modal isOpen={modalInsertar} size="xl">
        <ModalHeader>
          <div>
            <h3>Crear unidad de medida</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md={"12"}>
                <CFormGroupInput
                  handleChange={handleChange}
                  inputName="descripcion"
                  labelName="Nombre de la unidad de medida:"
                  value={form.descripcion}
                />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar unidad de medida" />
          <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default UnidadMedida;
