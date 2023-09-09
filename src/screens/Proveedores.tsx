import React, { useState } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import CButton from "../components/CButton";
import SidebarHorizontal from "../components/SidebarHorizontal";
import { useNavigate } from "react-router-dom";
import { jezaApi } from "../api/jezaApi";
import useModalHook from "../hooks/useModalHook";
import CFormGroupInput from "../components/CFormGroupInput";
import { useProveedor } from "../hooks/getsHooks/useProveedor";
import { Proveedor } from "../models/Proveedor";
import AlertComponent from "../components/AlertComponent";
//NUEVAS IMPORTACIONES
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import useSeguridad from "../hooks/getsHooks/useSeguridad";

function Proveedores() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [estado, setEstado] = useState("");
  const { dataProveedores, setProveedores, fetchProveedores } = useProveedor();
  const [form, setForm] = useState<Proveedor>({
    id: 1,
    nombre: "",
    rfc: "",
    calle: "",
    colonia: "",
    telefono: "",
    ciudad: "",
    estado: "",
    cp: "",
    contacto: "",
    email: "",
    observaciones: "",
    nombre_fiscal: "",
    dias_financiamiento: 0,
    fecha_alta: "",
    fecha_act: "",
  });

  const mostrarModalActualizar = (dato: Proveedor) => {
    setForm(dato);
    setModalActualizar(true);
  };
  const actualizarModalEstado = () => {
    if (estado === "insert") {
      setModalInsertar(!modalInsertar);
      setTimeout(() => {
        fetchProveedores();
      }, 3000);
    } else {
      setModalActualizar(!modalActualizar);
      setTimeout(() => {
        fetchProveedores();
      }, 3000);
    }
  };

  const eliminar = async (dato: Proveedor) => {
    const permiso = await filtroSeguridad("CAT_PROVEEDOR_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar al proveedor ${dato.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Proveedor?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          fetchProveedores();
        });
      }
    });
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Proveedor)[] = [
      "nombre",
      "rfc",
      "calle",
      "colonia",
      "telefono",
      "ciudad",
      "estado",
      "cp",
      "contacto",
      "email",
      "observaciones",
      "nombre_fiscal",
      "dias_financiamiento",
    ];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Proveedor) => {
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

  const insertar = async () => {
    const fechaHoy = new Date();
    const permiso = await filtroSeguridad("CAT_PROVEEDOR_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Proveedor", null, {
          params: {
            nombre: form.nombre,
            rfc: form.rfc,
            calle: form.calle,
            colonia: form.colonia,
            telefono: form.telefono,
            ciudad: form.ciudad,
            estado: form.estado,
            cp: form.cp,
            contacto: form.contacto,
            email: form.email,
            observaciones: form.observaciones,
            nombrefiscal: form.nombre_fiscal,
            dias_financiamiento: Number(form.dias_financiamiento),
            fecha_alta: fechaHoy,
            fecha_act: fechaHoy,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Proveedor creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          fetchProveedores();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const editar = async () => {
    const fechaHoy = new Date();
    const permiso = await filtroSeguridad("CAT_PROVEEDOR_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Proveedor`, null, {
          params: {
            id: form.id,
            nombre: form.nombre,
            rfc: form.rfc,
            calle: form.calle,
            colonia: form.colonia,
            telefono: form.telefono,
            ciudad: form.ciudad,
            estado: form.estado,
            cp: form.cp,
            contacto: form.contacto,
            email: form.email,
            observaciones: form.observaciones,
            nombrefiscal: form.nombre_fiscal,
            dias_financiamiento: form.dias_financiamiento,
            fecha_alta: form.fecha_alta,
            fecha_act: fechaHoy,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Proveedor actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          fetchProveedores();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // const editar = () => {
  //   jezaApi
  //     .put(`/Proveedor`, null, {
  //       params: {
  //         id: form.id,
  //         nombre: form.nombre,
  //         rfc: form.rfc,
  //         calle: form.calle,
  //         colonia: form.colonia,
  //         telefono: form.telefono,
  //         ciudad: form.ciudad,
  //         estado: form.estado,
  //         cp: form.cp,
  //         contacto: form.contacto,
  //         email: form.email,
  //         observaciones: form.observaciones,
  //         nombrefiscal: form.nombre_fiscal,
  //         dias_financiamiento: form.dias_financiamiento,
  //         fecha_alta: form.fecha_alta,
  //         fecha_act: form.fecha_act,
  //       },
  //     })
  //     .then(() => {
  //       setVisible2(false);
  //       fetchProveedores()
  //       setTimeout(() => {
  //         setVisible2(false);
  //       }, 3000);
  //       // Cerrar modal después de guardar
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const filtroEmail = (datoMedico: string) => {
    var resultado = dataProveedores.filter((elemento: any) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if ((datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.nombre.length > 2) {
        return elemento;
      }
    });
    setProveedores(resultado);
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setForm((prevState: any) => ({ ...prevState, [name]: value }));
  //   console.log(form);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dias_financiamiento') {
      // Eliminar caracteres no numéricos usando una expresión regular
      const numericValue = value.replace(/[^0-9]/g, '');
      setForm({ ...form, [name]: numericValue });
    } else {
      // Si no es el campo 'almacen', actualizar sin validación
      setForm({ ...form, [name]: value });
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
    setForm({
      calle: "",
      ciudad: "",
      colonia: "",
      contacto: "",
      cp: "",
      dias_financiamiento: 0,
      email: "",
      estado: "",
      fecha_act: "",
      fecha_alta: "",
      id: 0,
      nombre: "",
      nombre_fiscal: "",
      observaciones: "",
      rfc: "",
      telefono: "",
    });
  };

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      width: 130,
      headerClassName: "custom-header",
    },
    // { field: "id", headerName: "ID", width: 200, headerClassName: "custom-header", },
    { field: "nombre", headerName: "Nombre", width: 250, headerClassName: "custom-header" },
    { field: "telefono", headerName: "Teléfono", width: 250, headerClassName: "custom-header" },
    {
      field: "contacto",
      headerName: "Contacto",
      width: 250,
      headerClassName: "custom-header",
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
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
            rows={dataProveedores}
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
  /* alertas */
  const [creado, setVisible1] = useState(false);
  const [actualizado, setVisible2] = useState(false);
  const [eliminado, setVisible3] = useState(false);
  const [error, setVisible4] = useState(false);

  return (
    <>
      <Row>
        <SidebarHorizontal />

      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Proveedores  <AiOutlineUser size={30}></AiOutlineUser></h1>

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
              Crear proveedor
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

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <h3>Editar registro</h3>
        </ModalHeader>
        <ModalBody>
          <Card body>
            <Nav tabs>
              <NavItem>
                <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
                  Datos del proveedor
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
                  Datos de localización
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <br />
                <Row>
                  <Col md={"6"}>
                    <CFormGroupInput value={form.nombre} handleChange={handleChange} inputName="nombre" labelName="Nombre:" />
                    <CFormGroupInput value={form.telefono} handleChange={handleChange} inputName="telefono" labelName="Teléfono:" />
                    <CFormGroupInput
                      type="number"
                      value={form.dias_financiamiento}
                      handleChange={handleChange}
                      inputName="dias_financiamiento"
                      labelName="Días financiamiento :"
                    />
                    <CFormGroupInput
                      value={form.observaciones}
                      handleChange={handleChange}
                      inputName="observaciones"
                      labelName="Observaciones:"
                    />
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput value={form.contacto} handleChange={handleChange} inputName="contacto" labelName="Contacto:" />
                    <CFormGroupInput value={form.rfc} handleChange={handleChange} inputName="rfc" labelName="RFC:" />
                    <CFormGroupInput value={form.email} handleChange={handleChange} inputName="email" labelName="Email:" />
                    <CFormGroupInput
                      value={form.nombre_fiscal}
                      handleChange={handleChange}
                      inputName="nombre_fiscal"
                      labelName="Nombre fiscal:"
                    />
                  </Col>
                </Row>
                <br />
              </TabPane>
              <TabPane tabId="2">
                <br />
                <Row>
                  <Col md={"6"}>
                    {/* <CFormGroupInput value={form ? form.calle : ""} handleChange={handleChange} inputName="calle" labelName="Calle:" /> */}
                    <CFormGroupInput value={form.calle} handleChange={handleChange} inputName="calle" labelName="Calle:" />
                    <CFormGroupInput value={form.estado} handleChange={handleChange} inputName="estado" labelName="Estado:" />
                    <CFormGroupInput value={form.ciudad} handleChange={handleChange} inputName="ciudad" labelName="Ciudad:" />
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput value={form.colonia} handleChange={handleChange} inputName="colonia" labelName="Colonia:" />
                    <CFormGroupInput value={form.cp} handleChange={handleChange} inputName="cp" labelName="CP:" />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
            {/* <TabPruebaProveedor form={form} actualizarModalEstado={actualizarModalEstado} estado={estado}></TabPruebaProveedor> */}
          </Card>
        </ModalBody>
        <ModalFooter>
          <CButton
            onClick={() => {
              editar();
            }}
            color="primary"
            text="Actualizar"
          />

          <CButton color="danger" onClick={() => setModalActualizar(false)} text="Cancelar" />

        </ModalFooter>

      </Modal>

      <Modal isOpen={modalInsertar} size="xl">
        <ModalHeader>
          <h3>Crear proveedor</h3>
          {/* insertar */}
        </ModalHeader>
        <ModalBody>
          <Nav tabs>
            <NavItem>
              <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
                Datos del proveedor
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
                Datos de localización
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <br />
              <Row>
                <Col md={"6"}>
                  <CFormGroupInput value={form.nombre} handleChange={handleChange} inputName="nombre" labelName="Nombre:" />
                  <CFormGroupInput value={form.telefono} handleChange={handleChange} inputName="telefono" labelName="Teléfono:" />
                  <CFormGroupInput
                    type="number"
                    value={form.dias_financiamiento}
                    handleChange={handleChange}
                    inputName="dias_financiamiento"
                    labelName="Días financiamiento :"
                  />
                  <CFormGroupInput
                    value={form.observaciones}
                    handleChange={handleChange}
                    inputName="observaciones"
                    labelName="Observaciones:"
                  />
                </Col>
                <Col md={"6"}>
                  <CFormGroupInput value={form.contacto} handleChange={handleChange} inputName="contacto" labelName="Contacto:" />
                  <CFormGroupInput value={form.rfc} handleChange={handleChange} inputName="rfc" labelName="RFC:" />
                  <CFormGroupInput value={form.email} handleChange={handleChange} inputName="email" labelName="Email:" />
                  <CFormGroupInput
                    value={form.nombre_fiscal}
                    handleChange={handleChange}
                    inputName="nombre_fiscal"
                    labelName="Nombre fiscal:"
                  />
                </Col>
              </Row>
              <br />
            </TabPane>
            <TabPane tabId="2">
              <br />
              <Row>
                <Col md={"6"}>
                  {/* <CFormGroupInput value={form ? form.calle : ""} handleChange={handleChange} inputName="calle" labelName="Calle:" /> */}
                  <CFormGroupInput value={form.calle} handleChange={handleChange} inputName="calle" labelName="Calle:" />
                  <CFormGroupInput value={form.estado} handleChange={handleChange} inputName="estado" labelName="Estado:" />
                  <CFormGroupInput value={form.ciudad} handleChange={handleChange} inputName="ciudad" labelName="Ciudad:" />
                </Col>
                <Col md={"6"}>
                  <CFormGroupInput value={form.colonia} handleChange={handleChange} inputName="colonia" labelName="Colonia:" />
                  <CFormGroupInput value={form.cp} handleChange={handleChange} inputName="cp" labelName="CP:" />
                </Col>
              </Row>
            </TabPane>

          </TabContent>
          {/* <TabPruebaProveedor actualizarModalEstado={actualizarModalEstado} estado={estado}></TabPruebaProveedor> */}
        </ModalBody>
        <ModalFooter>

          <CButton color="success" onClick={insertar} text="Guardar proveedor" />
          <CButton color="danger" onClick={actualizarModalEstado} text="Cancelar" />

        </ModalFooter>
      </Modal>
    </>
  );
}

export default Proveedores;
