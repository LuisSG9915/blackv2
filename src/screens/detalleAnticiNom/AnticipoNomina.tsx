import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Row, Container, Col, Input, InputGroup, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Label } from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { useCias } from "../../hooks/getsHooks/useCias";
import { useMetasCol } from "../../hooks/getsHooks/useMetasCol";
import { useReactToPrint } from "react-to-print";
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { NominaAnticipo } from "../../models/NominaAnticipo";
import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";
import { Trabajador } from "../../models/Trabajador";
import { UserResponse } from "../../models/Home";
import CurrencyInput from "react-currency-input-field";
import { HiOutlineTrophy } from "react-icons/hi2";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { useAnticipoNomina } from "../../hooks/getsHooks/useAnticipoNomina";
import { Sucursal } from "../../models/Sucursal";
function AnticipoNomina() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_meta_view`);

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
  const [data, setData] = useState<NominaAnticipo[]>([]);
  const { dataCias, fetchCias } = useCias();
  const { dataTrabajadores, fetchNominaTrabajadores } = useNominaTrabajadores();
  const { dataAnticipoNomina, fetchAnticipoNomina } = useAnticipoNomina();

  const { dataSucursales } = useSucursales();
  // const { dataNominaAnticipo } = useNominaAnticipo();
  const [form, setForm] = useState<NominaAnticipo>({
    id: 0,
    fecha: "",
    idEmpleado: 0,
    d_empleado: "",
    monto: 0,
    usr_autoriza: 0,
    d_usr: "",
    observaciones: "",
  });

  const mostrarModalActualizar = (dato: NominaAnticipo) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const [selectedWorkers, setSelectedWorkers] = useState<Trabajador[]>([]);

  // const mostrarModalActualizar = (dato: TiposdeBajas) => {
  //   setModalActualizar(true);
  //   setForm(dato);
  // };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<Number[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof NominaAnticipo)[] = ["fecha", "idEmpleado", "monto", "observaciones"];
    const camposVacios: Number[] = [];

    camposRequeridos.forEach((campo: keyof NominaAnticipo) => {
      const fieldValue = form[campo];
      if (!fieldValue) {
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
    const permiso = await filtroSeguridad("CREAR_ANT_NOMINA");
    if (permiso === false) {
      return;
    }
    if (validarCampos() === true) {
      try {
        // Consultar el sueldo del empleado
        const response = await jezaApi.get(`/sp_SueldosNominaSel?id=${form.idEmpleado}`);
        console.log('Response data:', response.data); // Para verificar la estructura de la respuesta

        // Asegurarse de que la respuesta contiene datos
        if (response.data.length === 0) {
          Swal.fire({
            icon: "error",
            text: "No se encontró el sueldo del empleado",
            confirmButtonColor: "#d63031",
          });
          return;
        }

        // Acceder al primer elemento del array para obtener el sueldo
        const sueldoBase = response.data[0].sueldo;

        // Validar que el monto no exceda el sueldo base
        if (Number(form.monto) > Number(sueldoBase)) {
          Swal.fire({
            icon: "error",
            text: "El monto del anticipo no puede exceder el sueldo base del empleado",
            confirmButtonColor: "#d63031",
          });
          return;
        }

        // Continuar con la inserción si no hay conflictos
        await jezaApi.post(`/sp_detalleAnticipoNomAdd?fecha=${form.fecha}&idEmpleado=${form.idEmpleado}&monto=${Number(form.monto)}&usr_autoriza=${dataUsuarios2[0]?.id}&observaciones=${form.observaciones}`);

        Swal.fire({
          icon: "success",
          text: "Anticipo a nómina creado con éxito",
          confirmButtonColor: "#3085d6",
        });

        // Actualizar la lista de metas después de la inserción
        getMetas();
        setModalInsertar(false);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: "error",
          text: "Ocurrió un error al crear la meta, comuníquese con sistemas",
          confirmButtonColor: "#d63031",
        });
      }
    } else {
    }
  };

  // const insertar = async () => {
  //   const permiso = await filtroSeguridad("CAT_META_ADD");
  //   if (permiso === false) {
  //     return;
  //   }

  //   const responseSueldos = await jezaApi.get(`/sp_SueldosNominaSel?id=${form.id}`);
  //     // Verifica si el colaborador específico está en la respuesta
  //     const colaboradorEspecifico = responseSueldos.data.find(colaborador => colaborador.id === form.idEmpleado);


  //   try {
  //     await jezaApi.post(`/sp_detalleAnticipoNomAdd?fecha=${form.fecha}&idEmpleado=${form.idEmpleado}&monto=${form.monto}&usr_autoriza=${dataUsuarios2[0]?.id}&observaciones=${form.observaciones}`);

  //     Swal.fire({
  //       icon: "success",
  //       text: "Anticipo a nómina creado con éxito",
  //       confirmButtonColor: "#3085d6",
  //     });

  //     // Actualizar la lista de metas después de la inserción
  //     getMetas();
  //     setModalInsertar(false);
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire({
  //       icon: "error",
  //       text: "Ocurrió un error al crear la meta, comuníquese con sistemas",
  //       confirmButtonColor: "#d63031",
  //     });
  //   }
  // };


  const editar2 = async () => {
    const permiso = await filtroSeguridad("CAT_META_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }


    await jezaApi
      .put(
        `/sp_detalleAnticipoNomUpd?id=${form.id}&fecha=${form.fecha}&idEmpleado=${form.idEmpleado}&monto=${form.monto}&usr_autoriza=${dataUsuarios2[0]?.id}&observaciones=${form.observaciones}`
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          text: "Registro actualizado con éxito",
          confirmButtonColor: "#3085d6",
        });
        setModalActualizar(false);
        getMetas();
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          text: "Ocurrió un error al actualizar la meta, comuníquese con sistemas",
          confirmButtonColor: "#d63031",
        });
      });

    // } else {
    //   // Puedes manejar un caso específico si la validación de campos falla
    // }
  };



  const editar = async () => {
    const permiso = await filtroSeguridad("EDITAR_ANT_NOMINA");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      try {
        // Consultar el sueldo del empleado
        const response = await jezaApi.get(`/sp_SueldosNominaSel?id=${form.idEmpleado}`);
        console.log('Response data:', response.data); // Para verificar la estructura de la respuesta

        // Asegurarse de que la respuesta contiene datos
        if (response.data.length === 0) {
          Swal.fire({
            icon: "error",
            text: "No se encontró el sueldo del empleado",
            confirmButtonColor: "#d63031",
          });
          return;
        }

        // Acceder al primer elemento del array para obtener el sueldo
        const sueldoBase = response.data[0].sueldo;

        // Validar que el monto no exceda el sueldo base
        if (Number(form.monto) > Number(sueldoBase)) {
          Swal.fire({
            icon: "error",
            text: "El monto del anticipo no puede exceder el sueldo base del empleado",
            confirmButtonColor: "#d63031",
          });
          return;
        }

        // Continuar con la inserción si no hay conflictos
        await jezaApi
          .put(
            `/sp_detalleAnticipoNomUpd?id=${form.id}&fecha=${form.fecha}&idEmpleado=${form.idEmpleado}&monto=${Number(form.monto)}&usr_autoriza=${dataUsuarios2[0]?.id}&observaciones=${form.observaciones}`
          )

        Swal.fire({
          icon: "success",
          text: "Anticipo actualizado con éxito",
          confirmButtonColor: "#3085d6",
        });

        // Actualizar la lista de metas después de la inserción
        setModalActualizar(false);
        getMetas();
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: "error",
          text: "Ocurrió un error al crear la meta, comuníquese con sistemas",
          confirmButtonColor: "#d63031",
        });
      }
    } else {
    }
  };









  ///AQUÍ COMIENZA EL MÉTODO DELETE

  const eliminar1 = async (dato: NominaAnticipo) => {
    const permiso = await filtroSeguridad("CAT_META_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar esté registro?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/sp_detalleAnticipoNomDel?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getMetas();
        });
      }
    });
  };

  const eliminar = async (dato: NominaAnticipo) => {
    const permiso = await filtroSeguridad("ELIMINA_ANTICIPO_NOMIMA");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar esté registro?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await jezaApi.delete(`/sp_detalleAnticipoNomDel?id=${dato.id}`);
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getMetas();
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Ocurrió un error al eliminar el registro, comuniquese con sistemas",
            confirmButtonColor: "#d63031",
          });
        }
      }
    });
  };

  //AQUI COMIENZA EL MÉTODO GET PARA VISUALIZAR LOS REGISTROS
  const getMetas = () => {
    jezaApi
      .get("/sp_detalleAnticipoNomSel?id=0")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getMetas();
  }, []);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   // Eliminar espacios en blanco al principio de la cadena
  //   const trimmedValue = value.replace(/^\s+/g, "");
  //   setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
  //   console.log(form);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Eliminar espacios en blanco al principio de la cadena
    const trimmedValue = value.replace(/^\s+/g, "");
    setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
    console.log(form);
    // Eliminar espacios iniciales en todos los campos de entrada de texto
    const sanitizedValue = value.trim();
    if (name === "meta5" || "meta3" || "meta2" || "año" || "mes") {
      // Eliminar caracteres no numéricos
      const numericValue = sanitizedValue.replace(/[^0-9]/g, "");
      setForm({ ...form, [name]: numericValue });
    } else {
      // Actualizar el valor sin validación en otros campos
      const trimmedValue = value.replace(/^\s+/g, "");
      setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
      console.log(form);
    }
  };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Eliminar espacios en blanco al principio de la cadena
    const trimmedValue = value.replace(/^\s+/g, "");
    setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
    console.log(form.fecha);
    console.log(form);
  };


  const trabajadoresDisponibles = dataTrabajadores.filter((trabajador: Trabajador) => {
    // Filtra los trabajadores que no están en las metas existentes
    return !data.some((meta: NominaAnticipo) => meta.idcolabolador === trabajador.id);
  });

  // Asegúrate de que la función setForm actualiza el estado correctamente
  // Este console.log no reflejará los cambios inmediatamente debido a la naturaleza asincrónica de setForm
  console.log(form);

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
      id: 0,
      fecha: "",
      idEmpleado: 0,
      monto: 0,
      usr_autoriza: 0,
      observaciones: "",

    });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      width: 100,
      headerClassName: "custom-header",
    },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 200,
      headerClassName: "custom-header",
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = params.value ? date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "d_empleado",
      headerName: "Colaborador",
      width: 200,
      headerClassName: "custom-header",
    },
    {
      field: "d_usr",
      headerName: "Usuario registra",
      width: 150,
      headerClassName: "custom-header",
    },
    {
      field: "monto",
      headerName: "Cifra Monto",
      width: 180,
      headerClassName: "custom-header",
      renderCell: (params) => <span>{params.value !== null && params.value !== undefined ? `$${parseFloat(params.value).toFixed(2)}` : "0"}</span>,
    },
    {
      field: "sueldo",
      headerName: "Sueldo",
      width: 180,
      headerClassName: "custom-header",
      renderCell: (params) => <span>{params.value !== null && params.value !== undefined ? `$${parseFloat(params.value).toFixed(2)}` : "0"}</span>,
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      width: 400,
      headerClassName: "custom-header",
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

  // const handleValueChange = (fieldName: string, value: string | undefined) => {
  //   console.log(value);
  //   if (value === undefined) {
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       [fieldName]: 0, // Actualizar el valor correspondiente en el estado del formulario
  //     }));
  //   } else {
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       [fieldName]: value, // Actualizar el valor correspondiente en el estado del formulario
  //     }));
  //   }
  // };

  const handleValueChange = (fieldName: string, value: string | undefined) => {
    console.log(value);
    const maxLength = 15; // Definir la longitud máxima permitida, en este caso, 10 caracteres
    if (value === undefined) {
      setForm((prevForm) => ({
        ...prevForm,
        [fieldName]: 0, // Actualizar el valor correspondiente en el estado del formulario
        [fieldName]: "0", // Actualizar el valor correspondiente en el estado del formulario
      }));
    } else {
      if (value.length > maxLength) {
        value = value.slice(0, maxLength); // Cortar el valor si supera la longitud máxima
      }
      setForm((prevForm) => ({
        ...prevForm,
        [fieldName]: value, // Actualizar el valor correspondiente en el estado del formulario
      }));
    }
  };

  // function DataTable() {
  //   const getRowId = (row: NominaAnticipo) => row.id;
  //   return (
  //     <div style={{ overflow: "auto" }}>
  //       <div style={{ height: "100%", display: "table", tableLayout: "fixed" }}>
  //         <DataGrid
  //           rows={data}
  //           columns={columns}
  //           hideFooter={false}
  //           initialState={{
  //             pagination: {
  //               paginationModel: { page: 0, pageSize: 15 },
  //             },
  //           }}
  //           pageSizeOptions={[5, 10]}
  //           getRowId={getRowId}
  //         />
  //       </div>
  //     </div>
  //   );
  // }


  function DataTable() {
    return (
      <div style={{ height: 600, width: "90%" }}>
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





  // const getCiaForeignKey = (idTableCia: number) => {
  //   const cia = dataCias.find((cia: Cia) => cia.id === idTableCia);
  //   return cia ? cia.nombre : "Sin Compania";
  // };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      {showView ? (
        <>
          <Container>
            <br />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>
                {" "}
                Anticipo nómina
                {/* <HiOutlineTrophy size={30} /> */}
              </h1>
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
                  Crear anticipo nómina
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
            <Container>
              <DataTable></DataTable>
            </Container>
          </Container>

          {/* AQUÍ COMIENZA EL MODAL PARA AGREGAR SUCURSALES */}
          <Modal isOpen={modalActualizar} size="xl">
            <ModalHeader>
              <div>
                <h3>Editar anticipo nómina</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <Row>
                <Col sm="6">
                  <Label for="exampleDate">Fecha:</Label>
                  <Input
                    id="exampleDate"
                    name="fecha"
                    placeholder="date placeholder"
                    type="date"
                    onChange={handleChange2}
                    defaultValue={form.fecha ? form.fecha.split("T")[0] : form.fecha}
                  />
                </Col>

                <Col md={"6"}>
                  <Label>Colaborador:</Label>
                  <Input
                    type="select"
                    name="idEmpleado"
                    id="idEmpleado"
                    defaultValue={form.idEmpleado}
                    onChange={handleChange}
                    disabled={true} // suponiendo que 'modoEdicion' es una variable que indica si estás en modo de edición
                  >
                    <option value="">--Selecciona empresa--</option>
                    {dataTrabajadores.map((colaborador: Trabajador) => (
                      <option key={colaborador.id} value={colaborador.id}>
                        {colaborador.nombre}
                      </option>
                    ))}
                  </Input>
                  <br />
                </Col>
                <Col md={"3"}>
                  <label> Monto:</label>
                  <CurrencyInput
                    className="custom-currency-input"
                    prefix="$"
                    name="monto"
                    placeholder="Introducir un número"
                    value={form.monto ? form.monto : 0}
                    decimalsLimit={2}
                    onValueChange={(value) => handleValueChange("monto", value)}
                  />
                </Col>

                <Col sm="9">
                  <CFormGroupInput handleChange={handleChange2} inputName="observaciones" labelName="Observaciones:" value={form.observaciones} minlength={1} maxlength={190} />
                </Col>
              </Row>
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
                <h3>Crear anticipo nómina</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Row>
                  <Col sm="6">
                    <CFormGroupInput
                      type="date"
                      handleChange={handleChange2}
                      inputName="fecha"
                      labelName="Fecha:"
                      value={form.fecha}
                    />
                  </Col>

                  <Col md={"6"}>
                    <Label>Colaborador:</Label>
                    <Input
                      type="select"
                      name="idEmpleado"
                      id="idEmpleado"
                      defaultValue={form.idEmpleado}
                      onChange={handleChange}
                      disabled={false} // suponiendo que 'modoEdicion' es una variable que indica si estás en modo de edición
                    >
                      <option value="">--Selecciona empresa--</option>
                      {dataTrabajadores.map((colaborador: Trabajador) => (
                        <option key={colaborador.id} value={colaborador.id}>
                          {colaborador.nombre}
                        </option>
                      ))}
                    </Input>
                    <br />
                  </Col>
                  <Col md={"3"}>
                    <label> Monto:</label>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="monto"
                      placeholder="Introducir un número"
                      value={form.monto ? form.monto : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("monto", value)}
                    />
                  </Col>
                  <Col sm="9">
                    <CFormGroupInput handleChange={handleChange2} inputName="observaciones" labelName="Observaciones:" value={form.observaciones} minlength={1} maxlength={190} />
                  </Col>
                </Row>
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <CButton color="success" onClick={insertar} text="Guardar cifras" />
              <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
            </ModalFooter>
          </Modal>
        </>
      ) : null}
    </>
  );
}

export default AnticipoNomina;
