import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { MdInventory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Alert,
  Container,
  Col,
  Card,
  InputGroup,
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
import { Almacen } from "../../models/Almacen";
import TableAlmacen from "../../../src/screens/almacen/Components/TableAlmacen";
import AlertComponent from "../../components/AlertComponent";
import { Cia } from "../../models/Cia";
import { Sucursal } from "../../models/Sucursal";
import { useCias } from "../../hooks/getsHooks/useCias";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
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

function Almacenes() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_alm_view`);

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
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [data, setData] = useState<Almacen[]>([]);
  const [dataCia, setDataCia] = useState<Cia[]>([]);
  const [dataSucursal, setDataSucursal] = useState<Sucursal[]>([]);

  const { dataCias } = useCias();
  const { dataSucursales } = useSucursales();

  const [form, setForm] = useState<Almacen>({
    id: 0,
    cia: 0,
    sucursal: 0,
    almacen: 0,
    descripcion: "",
  });
  const [isChecked, setIsChecked] = useState(false);

  const DataTableHeader = ["Empresa", "Sucursal", "Descripción", "Número almancén", "Acciones"];

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Almacen)[] = ["cia", "sucursal", "almacen", "descripcion"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Almacen) => {
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

  // AQUÍ COMIENZA MI MÉTODO POS PARA AGREGAR ALMACENES
  // const [creado, setVisible1] = useState(false);
  // const insertar = () => {
  //   jezaApi
  //     .post("/Almacen", null, {
  //       params: {
  //         cia: Number(form.cia),
  //         sucursal: Number(form.sucursal),
  //         almacen: form.almacen,
  //         descripcion: form.descripcion,
  //       },
  //     })
  //     .then(() => {
  //       setVisible1(true);
  //     })

  //     .catch((error) => {
  //       // Handle error here
  //       console.log(error);
  //     });

  //   setTimeout(() => {
  //     setVisible1(false);
  //   }, 3000);
  // };

  // AQUÍ COMIENZA MI MÉTODO PUT PARA AGREGAR ALMACENES
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_ALMACEN_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Almacen", null, {
          params: {
            cia: form.cia,
            sucursal: form.sucursal,
            almacen: form.almacen,
            descripcion: form.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Almacén creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getAlmacen();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // AQUÉ COMIENZA MÉTODO PUT PARA ACTUALIZAR REGISTROS
  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_ALMACEN_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Almacen`, null, {
          params: {
            id: form.id,
            cia: form.cia,
            sucursal: form.sucursal,
            descripcion: form.descripcion,
            almacen: form.almacen,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Almacén actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getAlmacen();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // AQUÍ COMIENZA METODO DE ELIMINACIÓN
  // const eliminar = (dato: any) => {
  //   const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
  //   if (opcion) {
  //     jezaApi
  //       .delete(`/Almacen?id=${dato.id}`)
  //       .then(() => {
  //         setModalActualizar(false);
  //         setVisible3(true);
  //         getAlmacen();
  //         setTimeout(() => {
  //           setVisible3(false);
  //         }, 3000);
  //         console.log("a");
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // };
  const eliminar = async (dato: Almacen) => {
    const permiso = await filtroSeguridad("CAT_ALMACEN_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el almacén: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Almacen?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getAlmacen();
        });
      }
    });
  };

  const getAlmacen = () => {
    jezaApi
      .get("/Almacen?id=0")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  };

  const getCia = () => {
    jezaApi
      .get("/Cia?id=0")
      .then((response) => setDataCia(response.data))
      .catch((e) => console.log(e));
  };

  const getSucursal = () => {
    jezaApi
      .get("/Sucursal?id=0")
      .then((response) => {
        setDataSucursal(response.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getAlmacen();
    getCia();
    getSucursal();
  }, []);

  // const insertar = () => {
  //   jezaApi.post("/Medico", {}).then(() => { });
  //   setModalInsertar(false);
  // };

  /* modals */
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);

  /* alertas */
  const [actualizado, setVisible2] = useState(false);
  const [eliminado, setVisible3] = useState(false);
  const [error, setVisible4] = useState(false);

  const filtroEmail = (datoDescripcion: string) => {
    var resultado = data.filter((elemento: Almacen) => {
      if ((datoDescripcion === "" || elemento.descripcion.toLowerCase().includes(datoDescripcion.toLowerCase())) && elemento.descripcion.length > 2) {
        return elemento;
      }
    });
    setData(resultado);
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setForm((prevState: any) => ({ ...prevState, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Eliminar espacios iniciales en todos los campos de entrada de texto
    const sanitizedValue = value.trim();

    if (name === 'almacen') {
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


  // para punto y numeros 
  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === 'almacen') {
  //     // Validar si el campo es numérico
  //     if (!isNaN(value)) {
  //       setForm({ ...form, [name]: value });
  //     }
  //   } else {
  //     // Si no es el campo 'almacen', actualizar sin validación
  //     setForm({ ...form, [name]: value });
  //   }
  // };




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
    setForm({ cia: 0, sucursal: 0, almacen: 0, descripcion: "" });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      width: 200,
      headerClassName: "custom-header",
    },
    // { field: "sucursal", headerName: "ID", width: 200, headerClassName: "custom-header", },
    { field: "d_cia", headerName: "Empresa", width: 300, headerClassName: "custom-header" },
    { field: "d_sucursal", headerName: "Sucursal", width: 200, headerClassName: "custom-header" },
    {
      field: "descripcion",
      headerName: "Descripción",
      width: 300,
      headerClassName: "custom-header",
    },
    {
      field: "almacen",
      headerName: "Número de almacén",
      width: 200,
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
    return (
      <div style={{ height: 500, width: "90%" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Almacenes  <MdInventory size={30} /></h1>

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
              Crear almacén
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
      {/* AQUÍ COMIENZA MODAL INSERTAR AGREGAR ALMACÉN */}

      <Modal isOpen={modalInsertar} size="xl">
        <ModalHeader>
          <div>
            <h3>Agregar almacén</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row>
              <Col md={"6"}>
                <Label>Empresa:</Label>
                <Input type="select" name="cia" id="exampleSelect" value={form.cia} onChange={handleChange}>
                  <option value="">Selecciona empresa</option>
                  {dataCias.map((cia) => (
                    <option key={cia.id} value={cia.id}>
                      {cia.nombre}
                    </option>
                  ))}
                </Input>
                <br />
              </Col>

              <Col md={"6"} style={{ marginBottom: 10 }}>
                <Label>Sucursal:</Label>
                <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
                  <option value="">Selecciona sucursal</option>
                  {dataSucursales.map((sucursal) => (
                    <option key={sucursal.sucursal} value={sucursal.sucursal}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </Input>
              </Col>


              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripción de almacén:" value={form.descripcion} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="almacen" labelName="Número de almacén:" value={form.almacen} />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar Almacén" />
          {/* <CButton color="primary" onClick={() => {console.log(form); insertar(form);}} text="Actualizar/> */}
          <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* AQUÍ COMIENZA MODAL EDITAR ALMACÉN */}
      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar almacén</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row>
              <Col md={"6"}>
                <Label>Empresa:</Label>
                <Input type="select" name="cia" id="exampleSelect" value={form.cia} onChange={handleChange}>
                  <option value="">Selecciona empresa</option>
                  {dataCias.map((cia) => (
                    <option key={cia.id} value={cia.id}>
                      {cia.nombre}
                    </option>
                  ))}
                </Input>
                <br />
              </Col>

              <Col md={"6"} style={{ marginBottom: 10 }}>
                <Label>Sucursal:</Label>

                <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
                  <option value="">Selecciona sucursal</option>
                  {dataSucursales.map((sucursal) => (
                    <option key={sucursal.sucursal} value={sucursal.sucursal}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripción de almacén:" value={form.descripcion} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="almacen" labelName="Número de almacén:" value={form.almacen} />
              </Col>

            </Row>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Almacenes;
