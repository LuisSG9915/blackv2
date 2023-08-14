import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Container,
  Card,
  InputGroup,
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
import useReadHook from "../../hooks/useReadHook";
import TabPerfil from "../TabPerfil";
import { FormaPago } from "../../models/FormaPago";
import { Sucursal } from "../../models/Sucursal";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
// NUEVAS IMPORTACIONES
import Swal from "sweetalert2";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { GrCreditCard } from "react-icons/gr";

function TipoFormasPago() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [data, setData] = useState([]);
  const { dataSucursales } = useSucursales();
  const [form, setForm] = useState<FormaPago>({
    id: 0,
    descripcion: "",
    grupo_operacion: 0,
    sucursal: 0,
    nombreSuc: "",
    tarjeta: false,
    tipo: 0,
  });
  const getFormaPago = () => {
    /* <--------------------------------------------------GET */
    jezaApi.get("/FormaPago?id=%").then((response) => {
      setData(response.data);
    });
  };
  useEffect(() => {
    getFormaPago();
  }, []);

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof FormaPago)[] = ["descripcion", "grupo_operacion", "sucursal", "tipo"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof FormaPago) => {
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
  // AQUÍ COMIENZA EL MÉTODO POS PARA AGREGAR FORMAS DE PAGO
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_FORMA_PAGO_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/FormaPago", null, {
          params: {
            sucursal: Number(form.sucursal),
            tipo: Number(form.tipo),
            descripcion: form.descripcion,
            grupo_operacion: Number(form.grupo_operacion),
            tarjeta: form.tarjeta,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Forma de pago creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getFormaPago();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // AQUÍ COMIENZA EL MÉTODO PUT ACTUALIZAR FORMA DE PAGO

  // const editar = (dato: FormaPago) => {
  //   jezaApi
  //     .put(`/FormaPago?
  //     id=${dato.id}&
  //     sucursal=${dato.sucursal}&
  //     tipo=${dato.tipo}&
  //     descripcion=${dato.descripcion}&
  //     grupo_operacion=${dato.grupo_operacion}&
  //     tarjeta=${dato.tarjeta}`)
  //     .then((response) => {
  //       console.log(response)
  //       if (response.data.codigo === 2) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Campos vacíos",
  //           text: `${response.data.mensaje1}`,
  //           confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
  //         });
  //       } else {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Forma de pago creada con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         getFormaPago();
  //         cerrarModalActualizar();
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_FORMA_PAGO_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/FormaPago`, null, {
          params: {
            id: form.id,
            sucursal: form.sucursal,
            tipo: form.tipo,
            descripcion: form.descripcion,
            grupo_operacion: form.grupo_operacion,
            tarjeta: form.tarjeta,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Forma de pago actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getFormaPago();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const eliminar = async (dato: FormaPago) => {
    const permiso = await filtroSeguridad("CAT_FORMA_PAGO_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar la forma de pago: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/FormaPago?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getFormaPago();
        });
      }
    });
  };

  const filtroEmail = (datoMedico: string) => {
    var resultado = data.filter((elemento: FormaPago) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if ((datoMedico === "" || elemento.descripcion.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.descripcion.length > 2)
        return elemento;
    });
    setData(resultado);
  };
  // const filtroEmail = (datoMedico: string) => {
  //   var resultado = data.filter((elemento: FormaPago) => {
  //     // Aplica la lógica del filtro solo si hay valores en los inputs
  //     if (
  //       (datoMedico === "" ||
  //         elemento.descripcion.toLowerCase().includes(datoMedico.toLowerCase()) ||
  //         elemento.sucursal.toString().includes(datoMedico) ||
  //         elemento.tipo.toString().includes(datoMedico) ||
  //         elemento.grupo_operacion.toString().includes(datoMedico)) &&
  //       elemento.descripcion.length > 2
  //     )
  //       return elemento;
  //   });
  //   setData(resultado);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: FormaPago) => ({ ...prevState, [name]: value }));
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "tarjeta") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
      console.log(form);
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
    setForm({ id: 0, descripcion: "", grupo_operacion: 0, sucursal: 0, tarjeta: false, tipo: 0, nombreSuc: "" });
  };

  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      width: 130,
      headerClassName: "custom-header",
    },
    // { field: "id", headerName: "ID", width: 200, headerClassName: "custom-header", },
    {
      field: "nombreCia",
      headerName: "Empresa",
      width: 200,
      headerClassName: "custom-header",
      // renderCell: (params) => <span> {getSucursalForeignKey(params.row.sucursal)} </span>,
    },
    {
      field: "nombreSuc",
      headerName: "Sucursal",
      width: 200,
      headerClassName: "custom-header",
      // renderCell: (params) => <span> {getSucursalForeignKey(params.row.sucursal)} </span>,
    },
    { field: "tipo", headerName: "Tipo", width: 200, headerClassName: "custom-header" },
    {
      field: "descripcion",
      headerName: "Descripción",
      width: 200,
      headerClassName: "custom-header",
    },
    {
      field: "grupo_operacion",
      headerName: "Grupo de operación",
      width: 200,
      headerClassName: "custom-header",
    },
    {
      field: "tarjeta",
      headerName: "Tarjeta",
      width: 200,
      headerClassName: "custom-header",
      renderCell: (params) => <span>{params.row.tarjeta ? "Sí" : "No"}</span>,
    },
    // {
    //   field: "es_bodega",
    //   headerName: "Es Bodega",
    //   width: 150,
    //   headerClassName: "custom-header",
    //   renderCell: (params) => (
    //     <span>{params.row.es_bodega ? <HiBuildingStorefront size={20} /> : <AiFillDelete />}</span>
    //   ),
    // },
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

  // const getSucursalForeignKey = (idTableCia: number) => {
  //   const suc = dataSucursales.find((suc: Sucursal) => suc.sucursal === idTableCia);
  //   return suc ? suc.nombre : "Sin sucursal";
  // };

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
        {/* alertas */}
        {/* <Alert color="info" isOpen={actualizado} toggle={() => setVisible2(false)}>
          Registro modificado con éxito....
        </Alert> */}

        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Formas de pago </h1>
          <GrCreditCard size={30}></GrCreditCard>
        </div>

        <br />
        <br />
        <br />
        <div>
          <Row>
            <div>
              {/* <InputGroup style={{ width: "300px", marginLeft: "auto" }}>
                <Input
                  placeholder="Buscar por descripción..."
                  type="text"
                  onChange={(e) => {
                    setFiltroValorMedico(e.target.value);
                    if (e.target.value === "") {
                      getFormaPago();
                    }
                  }}
                ></Input>
                <CButton color="secondary" onClick={() => filtroEmail(filtroValorMedico)} text=" Buscar" />
              </InputGroup>

              <br />
              <br /> */}

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
                  Crear forma de pago
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
        </div>
        <br />
        <br />
        <DataTable></DataTable>
      </Container>

      {/* AQUI COMIENZA EL MODAL CREAR FORMA DE PAGO */}

      <Modal isOpen={modalInsertar} size="xl">
        <ModalHeader>
          <div>
            <h3>Crear forma de pago</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <Label>Sucursal:</Label>
            <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
              <option value="">Selecciona sucursal</option>
              {dataSucursales.map((sucursal: Sucursal) => (
                <option key={sucursal.sucursal} value={sucursal.sucursal}>
                  {sucursal.nombre}
                </option>
              ))}
            </Input>
            <br />
            <CFormGroupInput handleChange={handleChange} inputName="tipo" labelName="Tipo:" value={form.tipo} />
            <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripción:" value={form.descripcion} />
            <CFormGroupInput handleChange={handleChange} inputName="grupo_operacion" labelName="Grupo operación:" value={form.grupo_operacion} />
            <Label>Tarjeta:</Label>
            <Input style={{ marginLeft: 10 }} name={"tarjeta"} type={"checkbox"} onChange={handleChange} checked={form.tarjeta}></Input>
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar forma de pago" />
          <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* AQUÍ COMIENZA MODAL EDITAR FORMA DE PAGO */}

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar forma de pago</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <Label>Sucursal:</Label>
            <Input type="select" name="sucursal" id="sucursal" value={form.sucursal} onChange={handleChange}>
              <option value="">Selecciona sucursal</option>
              {dataSucursales.map((sucursal: Sucursal) => (
                <option key={sucursal.sucursal} value={sucursal.sucursal}>
                  {sucursal.nombre}
                </option>
              ))}
            </Input>
            <br />
            <CFormGroupInput handleChange={handleChange} inputName="tipo" labelName="Tipo:" value={form.tipo} />
            <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripción:" value={form.descripcion} />
            <CFormGroupInput handleChange={handleChange} inputName="grupo_operacion" labelName="Grupo operación:" value={form.grupo_operacion} />
            <Label>Tarjeta:</Label>
            <Input style={{ marginLeft: 10 }} name={"tarjeta"} type={"checkbox"} onChange={handleChange} checked={form.tarjeta}></Input>
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

export default TipoFormasPago;
