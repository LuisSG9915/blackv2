import React, { useEffect, useState } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import { Row, Container, Input, Table, Modal, ModalBody, ModalFooter, ModalHeader, Alert, Label, InputGroup } from "reactstrap";
// import { jezaApi } from "../../api/jezaApi";
import SidebarHorizontal from "../../components/SidebarHorizontal";

import { Cliente } from "../../models/Cliente";
import { DataGrid } from "@mui/x-data-grid";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import CButton from "../../components/CButton";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import { HiBuildingStorefront } from "react-icons/hi2";
import { BsPersonBoundingBox } from "react-icons/bs";
import Swal from "sweetalert2";
import JezaApiService from "../../api/jezaApi2";

function Clientes() {
  const { jezaApi } = JezaApiService();
  const { filtroSeguridad, session } = useSeguridad();
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [form, setForm] = useState<Cliente>({
    id_cliente: 0,
    nombre: "",
    domicilio: "",
    ciudad: "",
    estado: "",
    colonia: "",
    cp: "",
    rfc: "",
    telefono: "",
    email: "",
    nombre_fiscal: "",
    suspendido: false,
    sucursal_origen: 0,
    num_plastico: "",
    suc_asig_plast: 0,
    fecha_asig_plast: "",
    usr_asig_plast: "",
    plastico_activo: false,
    fecha_nac: "",
    correo_factura: "",
    regimenFiscal: "",
    claveRegistroMovil: "",
    fecha_alta: "",
    fecha_act: "",
  });

  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);
  const validarCampos = () => {
    const camposRequeridos: (keyof Cliente)[] = ["nombre", "domicilio", "ciudad", "estado", "colonia", "cp", "telefono", "email", "fecha_nac"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Cliente) => {
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

  const [data, setData] = useState<Cliente[]>([]);
  const insertCliente = async () => {
    /* CREATE */
    const permiso = await filtroSeguridad("CAT_CLIENT_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post(
          `/Cliente?nombre=${form.nombre}&domicilio=${form.domicilio}&ciudad=${form.ciudad}&estado=${form.estado}&colonia=${form.colonia}&cp=${form.cp}&telefono=${form.telefono}&email=${form.email}&fecha_nac=${form.fecha_nac}`
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Cliente creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          toggleCreateModal(); // Cerrar modal después de guardar
          getCliente();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  /* get */
  const getCliente = () => {
    jezaApi.get("/Cliente?id=0").then((response) => {
      setData(response.data);
    });
  };

  /* update */
  const updateCliente = async (dato: Cliente) => {
    const permiso = await filtroSeguridad("CAT_CLIENT_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(dato);

    // jezaApi
    //   // Cliente?id_cliente={id_cliente}&nombre={nombre}&domicilio={domicilio}&ciudad={ciudad}&estado={estado}&colonia={colonia}&cp={cp}&rfc={rfc}&telefono={telefono}&email={email}&nombre_fiscal={nombre_fiscal}&suspendido={suspendido}&sucursal_origen={sucursal_origen}&num_plastico={num_plastico}&suc_asig_plast={suc_asig_plast}&fecha_asig_plast={fecha_asig_plast}&usr_asig_plast={usr_asig_plast}&plastico_activo={plastico_activo}&fecha_nac={fecha_nac}&correo_factura={correo_factura}&regimenFiscal={regimenFiscal}&claveRegistroMovil={claveRegistroMovil}
    //   .put(
    //     `/Cliente?nombre=${dato.nombre}&domicilio=${dato.domicilio}&ciudad=${dato.ciudad}&estado=${dato.estado}&colonia=${dato.colonia}&cp=${dato.cp}&rfc=${dato.rfc}&telefono=${dato.telefono}&email=${dato.email}&nombre_fiscal=${dato.nombre_fiscal}&suspendido=${dato.suspendido}&sucursal_origen=${dato.sucursal_origen}&num_plastico=${dato.num_plastico}&suc_asig_plast=${dato.suc_asig_plast}&fecha_asig_plast=${dato.fecha_asig_plast}&usr_asig_plast=${dato.usr_asig_plast}&plastico_activo=${dato.plastico_activo}&fecha_nac=${dato.fecha_nac}&correo_factura=${dato.correo_factura}&regimenFiscal=${dato.regimenFiscal}&claveRegistroMovil=${dato.claveRegistroMovil}`
    //   )

    alert("aqui esta el error");
    //  .then((response) => {
    //  .then((response) => {
    //   setVisible2(true);
    //   getCliente();
    //   setModalUpdate(!modalUpdate);
    //   setTimeout(() => {
    //     setVisible2(false);
    //   }, 3000);
    //   // Cerrar modal después de guardar
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  const deletePaquetesConversion = async (dato: Cliente) => {
    const permiso = await filtroSeguridad("CAT_CLIENT_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    /* DELETE */
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el registro de : ${dato.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Cliente?id=${dato.id_cliente}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getCliente();
        });
      }
    });
  };

  useEffect(() => {
    getCliente();
  }, []);

  /* modals */
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);

  /* DETALLE */

  const [detalleRowData, setDetalleRowData] = useState(null);

  const toggleCreateModal = () => {
    setForm({
      // Restablecer el estado del formulario
      id_cliente: 0,
      nombre: "",
      domicilio: "",
      ciudad: "",
      estado: "",
      colonia: "",
      cp: "",
      rfc: "",
      telefono: "",
      email: "",
      nombre_fiscal: "",
      suspendido: false,
      sucursal_origen: 0,
      num_plastico: "",
      suc_asig_plast: 0,
      fecha_asig_plast: "",
      usr_asig_plast: "",
      plastico_activo: false,
      fecha_nac: "",
      correo_factura: "",
      regimenFiscal: "",
      claveRegistroMovil: "",
      fecha_alta: "",
      fecha_act: "",
    });
    setModalCreate(!modalCreate);
  };

  const toggleUpdateModal = (dato: any) => {
    if (dato && dato.nombre) {
      setForm(dato);
      console.log("Datos del cliente seleccionado:", dato);
    } else {
      console.error("Error: Datos del cliente seleccionado inválidos.");
    }
    setModalUpdate(!modalUpdate);
  };

  const toggleDetalleModal = async (idCliente: number) => {
    const permiso = await filtroSeguridad("CAT_CLIENTE_VIEW");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    // Buscar los datos correspondientes al idCliente en tu fuente de datos
    const rowData = data.find((dato) => dato.id_cliente === idCliente);

    // Actualizar el estado del modal y los datos del "row" seleccionado
    setModalDetalle(!modalDetalle);
    setDetalleRowData(rowData);
  };

  /* alertas */
  const [creado, setVisible1] = useState(false);
  const [actualizado, setVisible2] = useState(false);
  const [eliminado, setVisible3] = useState(false);
  const [error, setVisible4] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // const filtroEmail = (datoMedico: string) => {
  //   var resultado = data.filter((elemento: any) => {
  //     // Aplica la lógica del filtro solo si hay valores en los inputs
  //     if (
  //       (datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) &&
  //       elemento.nombre.length > 2
  //     ) {
  //       return elemento;
  //     }
  //   });
  //   setData(resultado);
  // };

  function ClienteDataGrid({ data, toggleDetalleModal, toggleUpdateModal, deletePaquetesConversion }) {
    const columns = [
      {
        field: "acciones",
        headerName: "Acción",
        flex: 1,
        renderCell: (params: { row: { id_cliente: any } }) => (
          <div>
            <AiFillEye className="mr-2" onClick={() => toggleDetalleModal(params.row.id_cliente)} size={23}></AiFillEye>

            <AiFillEdit className="mr-2" onClick={() => toggleUpdateModal(params.row)} size={23}></AiFillEdit>

            <AiFillDelete color="lightred" onClick={() => deletePaquetesConversion(params.row)} size={23}></AiFillDelete>
          </div>
        ),
      },
      { field: "nombre", headerName: "Nombre", flex: 1 },
      { field: "telefono", headerName: "Teléfono", flex: 1 },
      { field: "sucursal_origen", headerName: "Sucursal alta", flex: 1 },
      {
        field: "fecha_alta",
        headerName: "Fecha alta",
        flex: 1,
        valueGetter: (params: { row: { fecha_alta: string | number | Date } }) => new Date(params.row.fecha_alta).toLocaleDateString(),
      },
      {
        field: "plastico_activo",
        headerName: "Cuenta activa",
        flex: 1,
        renderCell: (params: { row: { plastico_activo: any } }) => (params.row.plastico_activo ? <>&#10004;</> : <>&#10008;</>),
      },
    ];

    const rows = data.map((dato: { id_cliente: any }) => ({ id: dato.id_cliente, ...dato }));

    return (
      <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />
      </div>
    );
  }

  // Redirige a la ruta "/app"
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Clientes </h1>
          <BsPersonBoundingBox size={35}></BsPersonBoundingBox>
        </div>

        <Row>
          <div>
            {/* <InputGroup style={{ width: "300px", marginLeft: "auto" }}>
              <Input
                placeholder="Buscar por sucursal..."
                type="text"
                onChange={(e) => {
                  setFiltroValorMedico(e.target.value);
                  if (e.target.value === "") {
                    // getSucursal();
                  }
                }}
              />
              <CButton color="secondary" onClick={() => filtroEmail(filtroValorMedico)} text="Buscar" />
            </InputGroup> */}
            <br />
            <br />

            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button style={{ marginLeft: "auto" }} color="success" onClick={toggleCreateModal}>
                Crear cliente
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
        <br />
        <br />
        <div style={{ flex: 1 }}>
          <ClienteDataGrid
            data={data}
            toggleDetalleModal={toggleDetalleModal} // Fixed: use the provided function
            toggleUpdateModal={toggleUpdateModal} // Fixed: use the provided function
            deletePaquetesConversion={deletePaquetesConversion} // Fixed: use the provided function
          />
        </div>
      </Container>

      {/* Modals */}
      {/* create */}
      <Modal isOpen={modalCreate} toggle={toggleCreateModal} size="lg">
        <ModalHeader toggle={toggleCreateModal}>Registro</ModalHeader>
        <ModalBody>
          {/* parte */}
          <div className="row">
            <div className="col-md-6">
              <Label>Nombre</Label>
              <Input type="text" name={"nombre"} onChange={(e) => setForm({ ...form, nombre: String(e.target.value) })} defaultValue={form.nombre} />
              <Label>Domicilio:</Label>
              <Input
                type="text"
                name={"domicilio"}
                onChange={(e) => setForm({ ...form, domicilio: String(e.target.value) })}
                defaultValue={form.domicilio}
              />
              <Label>Ciudad:</Label>
              <Input type="text" name={"ciudad"} onChange={(e) => setForm({ ...form, ciudad: String(e.target.value) })} defaultValue={form.ciudad} />
              <Label>Estado:</Label>
              <Input type="text" name={"Estado"} onChange={(e) => setForm({ ...form, estado: String(e.target.value) })} defaultValue={form.estado} />
            </div>
            <div className="col-md-6">
              <Label>Colonia:</Label>
              <Input
                type="text"
                name={"colonia"}
                onChange={(e) => setForm({ ...form, colonia: String(e.target.value) })}
                defaultValue={form.colonia}
              />
              <Label>Código postal:</Label>
              <Input type="text" name={"cp"} onChange={(e) => setForm({ ...form, cp: String(e.target.value) })} defaultValue={form.cp} />
              <Label>Teléfono:</Label>
              <Input
                type="text"
                name={"telefono"}
                onChange={(e) => setForm({ ...form, telefono: String(e.target.value) })}
                defaultValue={form.telefono}
              />
              <Label>E-mail:</Label>
              <Input type="email" name={"email"} onChange={(e) => setForm({ ...form, email: String(e.target.value) })} defaultValue={form.email} />
              <Label>Fecha de nacimiento:</Label>
              <Input
                type="date"
                name={"fecha_nac"}
                onChange={(e) => setForm({ ...form, fecha_nac: String(e.target.value) })}
                defaultValue={form.fecha_nac}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertCliente} text="Guardar"></CButton>{" "}
          <CButton color="danger" onClick={toggleCreateModal} text="Cancelar"></CButton>
        </ModalFooter>
      </Modal>

      {/* modal para update */}
      <Modal isOpen={modalUpdate} toggle={toggleUpdateModal} fullscreen={true}>
        <ModalHeader toggle={toggleUpdateModal}>Editar Registro</ModalHeader>
        <ModalBody>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                onChange={(e) => setForm({ ...form, nombre: String(e.target.value) })}
                defaultValue={form.nombre}
                placeholder="Ingrese el nombre del cliente"
              />
            </div>
            <div>
              <Label>Domicilio</Label>
              <Input
                type="text"
                name="domicilio"
                onChange={(e) => setForm({ ...form, domicilio: String(e.target.value) })}
                defaultValue={form.domicilio}
                placeholder="Ingrese el domicilio del cliente"
              />
            </div>
            <div>
              <Label>Ciudad</Label>
              <Input
                type="text"
                name="ciudad"
                onChange={(e) => setForm({ ...form, ciudad: String(e.target.value) })}
                defaultValue={form.ciudad}
                placeholder="Ingrese la ciudad del cliente"
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Input
                type="text"
                name="estado"
                onChange={(e) => setForm({ ...form, estado: String(e.target.value) })}
                defaultValue={form.estado}
                placeholder="Ingrese el estado del cliente"
              />
            </div>
            <div>
              <Label>Colonia</Label>
              <Input
                type="text"
                name="colonia"
                onChange={(e) => setForm({ ...form, colonia: String(e.target.value) })}
                defaultValue={form.colonia}
                placeholder="Ingrese la colonia del cliente"
              />
            </div>
            <div>
              <Label>Código Postal</Label>
              <Input
                type="text"
                name="cp"
                onChange={(e) => setForm({ ...form, cp: String(e.target.value) })}
                defaultValue={form.cp}
                placeholder="Ingrese el código postal del cliente"
              />
            </div>
            <div>
              <Label>RFC</Label>
              <Input
                type="text"
                name="rfc"
                onChange={(e) => setForm({ ...form, rfc: String(e.target.value) })}
                defaultValue={form.rfc}
                placeholder="Ingrese el RFC del cliente"
              />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input
                type="text"
                name="telefono"
                onChange={(e) => setForm({ ...form, telefono: String(e.target.value) })}
                defaultValue={form.telefono}
                placeholder="Ingrese el teléfono del cliente"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="text"
                name="email"
                onChange={(e) => setForm({ ...form, email: String(e.target.value) })}
                defaultValue={form.email}
                placeholder="Ingrese el email del cliente"
              />
            </div>
            <div>
              <Label>Nombre Fiscal</Label>
              <Input
                type="text"
                name="nombre_fiscal"
                onChange={(e) => setForm({ ...form, nombre_fiscal: String(e.target.value) })}
                defaultValue={form.nombre_fiscal}
                placeholder="Ingrese el nombre fiscal del cliente"
              />
            </div>
            <div>
              <Label>Suspendido</Label>
              <Input
                type="checkbox"
                name="suspendido"
                onChange={(e) => setForm({ ...form, suspendido: e.target.checked })}
                checked={form.suspendido}
                placeholder="Ingrese el estado de suspensión del cliente"
              />
            </div>
            <div>
              <Label>Sucursal Origen</Label>
              <Input
                type="number"
                name="sucursal_origen"
                onChange={(e) => setForm({ ...form, sucursal_origen: parseInt(e.target.value) })}
                defaultValue={form.sucursal_origen}
                placeholder="Ingrese la sucursal de origen del cliente"
              />
            </div>
            <div>
              <Label>Número de Plástico</Label>
              <Input
                type="text"
                name="num_plastico"
                onChange={(e) => setForm({ ...form, num_plastico: String(e.target.value) })}
                defaultValue={form.num_plastico}
                placeholder="Ingrese el número de plástico del cliente"
              />
            </div>

            <div>
              <Label>Sucursal Asignada al Plástico</Label>
              <Input
                type="number"
                name="suc_asig_plast"
                onChange={(e) => setForm({ ...form, suc_asig_plast: parseInt(e.target.value) })}
                defaultValue={form.suc_asig_plast}
                placeholder="Ingrese la sucursal asignada al plástico del cliente"
              />
            </div>
            <div>
              <Label>Fecha de Asignación del Plástico</Label>
              <Input
                type="text"
                name="fecha_asig_plast"
                onChange={(e) => setForm({ ...form, fecha_asig_plast: String(e.target.value) })}
                defaultValue={form.fecha_asig_plast}
                placeholder="Ingrese la fecha de asignación del plástico del cliente"
              />
            </div>
            <div>
              <Label>Usuario de Asignación del Plástico</Label>
              <Input
                type="text"
                name="usr_asig_plast"
                onChange={(e) => setForm({ ...form, usr_asig_plast: String(e.target.value) })}
                defaultValue={form.usr_asig_plast}
                placeholder="Ingrese el usuario de asignación del plástico del cliente"
              />
            </div>
            <div>
              <Label>Plástico Activo</Label>
              <Input
                type="checkbox"
                name="plastico_activo"
                onChange={(e) => setForm({ ...form, plastico_activo: e.target.checked })}
                checked={form.plastico_activo}
                placeholder="Ingrese el estado del plástico del cliente"
              />
            </div>
            <div>
              <Label>Fecha de Nacimiento</Label>
              <Input
                type="text"
                name="fecha_nac"
                onChange={(e) => setForm({ ...form, fecha_nac: String(e.target.value) })}
                defaultValue={form.fecha_nac}
                placeholder="Ingrese la fecha de nacimiento del cliente"
              />
            </div>
            <div>
              <Label>Correo de Facturación</Label>
              <Input
                type="text"
                name="correo_factura"
                onChange={(e) => setForm({ ...form, correo_factura: String(e.target.value) })}
                defaultValue={form.correo_factura}
                placeholder="Ingrese el correo de facturación del cliente"
              />
            </div>
            <div>
              <Label>Regimen Fiscal</Label>
              <Input
                type="text"
                name="regimenFiscal"
                onChange={(e) => setForm({ ...form, regimenFiscal: String(e.target.value) })}
                defaultValue={form.regimenFiscal}
                placeholder="Ingrese el régimen fiscal del cliente"
              />
            </div>
            <div>
              <Label>Clave de Registro Móvil</Label>
              <Input
                type="text"
                name="claveRegistroMovil"
                onChange={(e) => setForm({ ...form, claveRegistroMovil: String(e.target.value) })}
                defaultValue={form.claveRegistroMovil}
                placeholder="Ingrese la clave de registro móvil del cliente"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={() => updateCliente(form)} text="Guardar"></CButton>{" "}
          <CButton color="secondary" onClick={toggleUpdateModal} text="Cancelar"></CButton>
        </ModalFooter>
      </Modal>
      {/* modal para Detalles */}
      {/* modal para Detalles */}
      <Modal isOpen={modalDetalle} toggle={toggleDetalleModal} fullscreen={true}>
        <ModalHeader toggle={toggleDetalleModal}>Detalles del Cliente</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col">
              <p>
                <strong>Nombre:</strong> {detalleRowData && detalleRowData.nombre}
              </p>
              <p>
                <strong>Teléfono:</strong> {detalleRowData && detalleRowData.telefono}
              </p>
              <p>
                <strong>Domicilio:</strong> {detalleRowData && detalleRowData.domicilio}
              </p>
              <p>
                <strong>Email:</strong> {detalleRowData && detalleRowData.email}
              </p>
              <p>
                <strong>Ciudad:</strong> {detalleRowData && detalleRowData.ciudad}
              </p>
              <p>
                <strong>Estado:</strong> {detalleRowData && detalleRowData.estado}
              </p>
              <p>
                <strong>Colonia:</strong> {detalleRowData && detalleRowData.colonia}
              </p>
              <p>
                <strong>Código Postal:</strong> {detalleRowData && detalleRowData.cp}
              </p>
            </div>
            <div className="col">
              <p>
                <strong>Sucursal Alta:</strong> {detalleRowData && detalleRowData.sucursal_origen}
              </p>
              <p>
                <strong>Fecha Alta:</strong> {detalleRowData && new Date(detalleRowData.fecha_alta).toLocaleDateString()}
              </p>
              <p>
                <strong>Cuenta Activa:</strong> {detalleRowData && (detalleRowData.plastico_activo ? "Sí" : "No")}
              </p>
              <p>
                <strong>RFC:</strong> {detalleRowData && detalleRowData.rfc}
              </p>
              <p>
                <strong>Nombre Fiscal:</strong> {detalleRowData && detalleRowData.nombre_fiscal}
              </p>
              <p>
                <strong>Número de Plástico:</strong> {detalleRowData && detalleRowData.num_plastico}
              </p>
              <p>
                <strong>Sucursal Asignada al Plástico:</strong> {detalleRowData && detalleRowData.suc_asig_plast}
              </p>
              <p>
                <strong>Fecha de Asignación del Plástico:</strong> {detalleRowData && new Date(detalleRowData.fecha_asig_plast).toLocaleDateString()}
              </p>
              <p>
                <strong>Usuario de Asignación del Plástico:</strong> {detalleRowData && detalleRowData.usr_asig_plast}
              </p>
              <p>
                <strong>Fecha de Nacimiento:</strong> {detalleRowData && new Date(detalleRowData.fecha_nac).toLocaleDateString()}
              </p>
              <p>
                <strong>Correo de Facturación:</strong> {detalleRowData && detalleRowData.correo_factura}
              </p>
              <p>
                <strong>Regimen Fiscal:</strong> {detalleRowData && detalleRowData.regimenFiscal}
              </p>
              <p>
                <strong>Clave de Registro Móvil:</strong> {detalleRowData && detalleRowData.claveRegistroMovil}
              </p>
              <p>
                <strong>Suspendido:</strong> {detalleRowData && (detalleRowData.suspendido ? "Sí" : "No")}
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={toggleDetalleModal}>
            Cerrar
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Clientes;
