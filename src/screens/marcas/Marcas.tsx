import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Container,
  Card,
  CardHeader,
  CardBody,
  InputGroup,
  CardTitle,
  CardText,
  Input,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Marca } from "../../models/Marca";
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
import { AiFillTags } from "react-icons/ai";

function Marcas() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [form, setForm] = useState<Marca>({
    id: 1,
    marca: "",
    descripcion: "",
  });
  const [datos, setDatos] = useState([]);
  const DataTableHeader = ["marcas", "acciones"];

  //AL NO TENER UN USESTATE DE MARCA AGREGO MI DATA PARA CONSUMIR MIS
  //DATOS EN MI COMPONENTE TABLA
  const [data, setData] = useState<Marca[]>([]);

  const mostrarModalActualizar = (dato: Marca) => {
    // Assuming 'dato.marca' is of type 'string | undefined'
    setForm({ ...dato, descripcion: dato.marca !== undefined ? dato.marca : "" });
    console.log(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Marca)[] = ["descripcion"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Marca) => {
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

  //AQUI COMIENZA MÉTODO AGREGAR SUCURSAL
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Marca", null, {
          params: {
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Marca creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getMarca();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  //AQUÍ COMIENZA EL MÉTODO ACTUALIZAR

  ///AQUI COMIENZA EL MÉTODO PUT PARA ACTUALIZACIÓN DE CAMPOS
  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/marca`, null, {
          params: {
            id: form.id,
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Marca actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getMarca();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  //AQUÍ COMIENZA EL MÉTODO ELIMINAR

  const eliminar = async (dato: Marca) => {
    const permiso = await filtroSeguridad("CAT_SUC_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar la marca: ${dato.marca}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Marca?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getMarca();
        });
      }
    });
  };

  const getMarca = () => {
    jezaApi.get("/Marca?id=0").then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  };
  useEffect(() => {
    getMarca();
  }, []);

  // const filtroEmail = (datoMedico: string) => {
  //   var resultado = datos.filter((elemento: Marca) => {
  //     // Aplica la lógica del filtro solo si hay valores en los inputs
  //     if (elemento.descripcion && (datoMedico === "" || elemento.descripcion.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.descripcion.length > 1) {
  //       return elemento;
  //     }
  //   });
  //   setData(resultado);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: Marca) => ({ ...prevState, [name]: value }));
    console.log(form);
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
    setForm({ id: 0, marca: "", descripcion: "" });
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

    { field: "marca", headerName: "Marca", width: 1000, headerClassName: "custom-header" },
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
      <div style={{ height: 300, width: "90%" }}>
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
              <h1> Marcas </h1>
              <AiFillTags size={35}></AiFillTags>
            </div>

            <br />
            <br />
            <Row>
              <div>
                {/* <InputGroup style={{ width: "300px", marginLeft: "auto" }}>
                  <Input
                    placeholder="Buscar por sucursal..."
                    type="text"
                    onChange={(e) => {
                      setFiltroValorMedico(e.target.value);
                      if (e.target.value === "") {
                        getMarca();
                      }
                    }}
                  />
                  <CButton color="secondary" onClick={() => filtroEmail(filtroValorMedico)} text="Buscar" />
                </InputGroup> */}
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
                    Crear marca
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
              </div>
            </Row>
          </Container>
          <br />
          <br />
        </Row>
      </Container>

      {/* AQUÍ COMIENZA MODAL AGREGAR UNA MARCA */}
      <Modal isOpen={modalInsertar} size="xl">
        <ModalHeader>
          <div>
            <h3>Crear marca</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Marca descripción:" />
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar marca" />
          <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* AQUÍ COMIENZA MODAL ACTUALIZAR UNA MARCA */}
      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar registro</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Label>Marca descripción: </Label>
            <Input onChange={handleChange} name="descripcion" defaultValue={form.descripcion}></Input>
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Marcas;
