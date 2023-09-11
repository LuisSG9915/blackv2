import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit, AiFillStop, AiFillPushpin } from "react-icons/ai";
import { MdInventory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  Row,
  InputGroup,
  Container,
  Col,
  Card,
  Alert,
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
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Sucursal } from "../../models/Sucursal";
import TableSucursal from "./components/TableSucursal";
import { Cia } from "../../models/Cia";
import AlertComponent from "../../components/AlertComponent";
import { useCias } from "../../hooks/getsHooks/useCias";
// import { IoIosHome, IoIosRefresh } from "react-icons/io";
// import Button from '@mui/material/Button';
// import ButtonGroup from '@mui/material/ButtonGroup';
import { useReactToPrint } from "react-to-print";
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

function Sucursales() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_suc_view`);

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

  const [data, setData] = useState<Sucursal[]>([]);
  const { dataCias, fetchCias } = useCias();

  const [form, setForm] = useState<Sucursal>({
    sucursal: 0,
    direccion: "",
    en_linea: false,
    es_bodega: false,
    nombre: "",
    cia: 0,
    nombreCia: "",
  });

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Sucursal)[] = ["direccion", "nombre", "cia"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Sucursal) => {
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

    if (validarCampos() === true) {
      await jezaApi
        .post("/Sucursal", null, {
          params: {
            nombre: form.nombre,
            direccion: form.direccion,
            es_bodega: form.es_bodega,
            en_linea: form.en_linea,
            cia: Number(form.cia),
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Sucursal creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getSucursal();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  ///AQUI COMIENZA EL MÉTODO PUT PARA ACTUALIZACIÓN DE CAMPOS
  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Sucursal`, null, {
          params: {
            id: form.sucursal,
            cia: form.cia,
            nombre: form.nombre,
            direccion: form.direccion,
            en_linea: form.en_linea,
            es_bodega: form.es_bodega,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Sucursal actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getSucursal();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  ///AQUÍ COMIENZA EL MÉTODO DELETE

  const eliminar = async (dato: Sucursal) => {
    const permiso = await filtroSeguridad("CAT_SUC_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar la sucursal: ${dato.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Sucursal?id=${dato.sucursal}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getSucursal();
        });
      }
    });
  };

  //AQUI COMIENZA EL MÉTODO GET PARA VISUALIZAR LOS REGISTROS
  const getSucursal = () => {
    jezaApi
      .get("/Sucursal?id=%")
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
      setForm((prevState: Sucursal) => ({ ...prevState, [name]: value }));
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
    setForm({ sucursal: 0, direccion: "", en_linea: false, es_bodega: false, nombre: "", cia: 0, nombreCia: "" });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      width: 120,
      headerClassName: "custom-header",
    },
    {
      field: "nombreCia",
      headerName: "Empresa",
      width: 150,
      headerClassName: "custom-header",
      // renderCell: (params) => <span> {getCiaForeignKey(params.row.cia)} </span>,
    },

    { field: "nombre", headerName: "Sucursal", width: 170, headerClassName: "custom-header" },
    {
      field: "direccion",
      headerName: "Dirección",
      width: 550,
      headerClassName: "custom-header",
    },
    {
      field: "en_linea",
      headerName: "En línea",
      width: 150,
      headerClassName: "custom-header",
      renderCell: (params) => <span>{params.row.en_linea ? "Sí" : "No"}</span>,
    },
    {
      field: "es_bodega",
      headerName: "Es bodega",
      width: 150,
      headerClassName: "custom-header",
      renderCell: (params) => <span>{params.row.es_bodega ? "Sí" : "No"}</span>,
    },
  ];

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => eliminar(params.row)} size={23}></AiFillDelete>
      </>
    );
  };

  function DataTable() {
    const getRowId = (row: Sucursal) => row.sucursal;
    return (
      <div style={{ overflow: "auto" }}>
        <div style={{ height: "100%", display: "table", tableLayout: "fixed" }}>
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
            getRowId={getRowId}
          />
        </div>
      </div>
    );
  }

  // const getCiaForeignKey = (idTableCia: number) => {
  //   const cia = dataCias.find((cia: Cia) => cia.id === idTableCia);
  //   return cia ? cia.nombre : "Sin Compania";
  // };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Sucursales <HiBuildingStorefront size={35}></HiBuildingStorefront></h1>

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
              Crear sucursal
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

      {/* AQUÍ COMIENZA EL MODAL PARA AGREGAR SUCURSALES */}
      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar sucursal</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              {/* Debe de coincidir el inputname con el value */}
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre de sucursal:" value={form.nombre} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="direccion" labelName="Dirección de la sucursal:" value={form.direccion} />
              </Col>
              <Col md={"6"}>
                <Label>Empresa:</Label>
                <Input type="select" name="cia" id="cia" defaultValue={form.cia} onChange={handleChange}>
                  <option value="">Seleccione empresa</option>
                  {dataCias.map((cia: Cia) => (
                    <option key={cia.id} value={cia.id}>
                      {cia.nombre}
                    </option>
                  ))}
                </Input>
              </Col>

              <Col md={"2"}>
                <br />
                <label className="checkbox-container">
                  <input type="checkbox" checked={form.en_linea} onChange={handleChange} name="en_linea" />
                  <span className="checkmark"></span>
                  ¿En línea?
                </label>
              </Col>
              <Col md={"2"}>
                <br />
                <label className="checkbox-container">
                  <input type="checkbox" checked={form.es_bodega} onChange={handleChange} name="es_bodega" />
                  <span className="checkmark"></span>
                  ¿Es bodega?
                </label>
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
            <h3>Crear sucursal</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              {/* Debe de coincidir el inputname con el value */}
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre de sucursal:" value={form.nombre} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="direccion" labelName="Dirección de la sucursal:" value={form.direccion} />
              </Col>
              <Col md={"6"}>
                <Label>Empresa:</Label>
                <Input type="select" name="cia" id="cia" defaultValue={form.cia} onChange={handleChange}>
                  <option value="">Seleccione empresa</option>
                  {dataCias.map((cia: Cia) => (
                    <option key={cia.id} value={cia.id}>
                      {cia.nombre}
                    </option>
                  ))}
                </Input>
              </Col>

              <Col md={"2"}>
                <br />
                <label className="checkbox-container">
                  <input type="checkbox" checked={form.en_linea} onChange={handleChange} name="en_linea" />
                  <span className="checkmark"></span>
                  ¿En línea?
                </label>
              </Col>
              <Col md={"2"}>
                <br />
                <label className="checkbox-container">
                  <input type="checkbox" checked={form.es_bodega} onChange={handleChange} name="es_bodega" />
                  <span className="checkmark"></span>
                  ¿Es bodega?
                </label>
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar sucursal" />
          <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Sucursales;
