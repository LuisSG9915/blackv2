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

import { useReactToPrint } from "react-to-print";
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { MetasCol } from "../../models/MetasCol";
import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";
import { Trabajador } from "../../models/Trabajador";
import { UserResponse } from "../../models/Home";
import CurrencyInput from "react-currency-input-field";
import { HiOutlineTrophy } from "react-icons/hi2";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Sucursal } from "../../models/Sucursal";
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
function Metas() {
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

  const [data, setData] = useState<MetasCol[]>([]);
  const { dataCias, fetchCias } = useCias();
  const { dataTrabajadores, fetchNominaTrabajadores } = useNominaTrabajadores();
  const { dataSucursales } = useSucursales();
  const [form, setForm] = useState<MetasCol>({
    id: 0,
    año: 0,
    mes: 0,
    idcolabolador: 0,
    meta1: 0,
    meta2: 0,
    meta3: 0,
    meta4: 0,
    meta5: 0,
    meta6: 0,
    sucursal: 0,
  });

  const mostrarModalActualizar = (dato: MetasCol) => {
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
    const camposRequeridos: (keyof MetasCol)[] = ["año", "mes", "idcolabolador", "meta1", "meta2", "meta3", "meta4", "meta5", "sucursal"];
    const camposVacios: Number[] = [];

    camposRequeridos.forEach((campo: keyof MetasCol) => {
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

  //AQUI COMIENZA MÉTODO AGREGAR SUCURSAL
  // const insertar = async () => {
  //   const permiso = await filtroSeguridad("CAT_META_ADD");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }

  //   if (validarCampos() === true) {
  //     await jezaApi
  //       .post(
  //         `/sp_cat_colaboradoresMetasAdd?año=${form.año}&mes=${form.mes}&idcolabolador=${form.idcolabolador}&meta1=${form.meta1 ? form.meta1 : 0.00}&meta2=${form.meta2 ? form.meta2 : 0}&meta3=${form.meta3 ? form.meta3 : 0}&meta4=${form.meta4 ? form.meta4 : 0}&meta5=${form.meta5 ? form.meta5 : 0}&meta6=0`
  //       )
  //       .then((response) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Meta creada con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         setModalInsertar(false);
  //         getMetas();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //   }
  // };


  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_META_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (validarCampos() === true) {
      await jezaApi
        .post(

          `/sp_cat_colaboradoresMetasAdd?año=${form.año}&mes=${form.mes}&idcolabolador=${form.idcolabolador}&meta1=${form.meta1 ? form.meta1 : 0.00}&meta2=${form.meta2 ? form.meta2 : 0}&meta3=${form.meta3 ? form.meta3 : 0}&meta4=${form.meta4 ? form.meta4 : 0}&meta5=${form.meta5 ? form.meta5 : 0}&meta6=0&sucursal=${form.sucursal}`
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Meta creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getMetas();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Ocurrió un error al crear la meta",
            confirmButtonColor: "#d63031",
          });
        });
    } else {
      // Puedes manejar un caso específico si la validación de campos falla
    }
  };




  ///AQUI COMIENZA EL MÉTODO PUT PARA ACTUALIZACIÓN DE CAMPOS
  // const editar = async () => {
  //   if (validarCampos() === true) {
  //     await jezaApi
  //       .put(
  //         `/sp_cat_colaboradoresMetasUpd?id=${form.id}&año=${form.año}&mes=${form.mes}&idcolabolador=${form.idcolabolador}&meta1=${form.meta1}&meta2=${form.meta2}&meta3=${form.meta3}&meta4=${form.meta4}&meta5=${form.meta5}&meta6=0`
  //       )
  //       .then((response) => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Meta actualizada con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         setModalActualizar(false);
  //         getMetas();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //   }
  // };



  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_META_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (validarCampos() === true) {
      await jezaApi
        .put(
          `/sp_cat_colaboradoresMetasUpd?id=${form.id}&año=${form.año}&mes=${form.mes}&idcolabolador=${form.idcolabolador}&meta1=${form.meta1}&meta2=${form.meta2}&meta3=${form.meta3}&meta4=${form.meta4}&meta5=${form.meta5}&meta6=0&sucursal=${form.sucursal}`
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Meta actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getMetas();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Ocurrió un error al actualizar la meta",
            confirmButtonColor: "#d63031",
          });
        });
    } else {
      // Puedes manejar un caso específico si la validación de campos falla
    }
  };





  ///AQUÍ COMIENZA EL MÉTODO DELETE

  const eliminar = async (dato: MetasCol) => {
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
        jezaApi.delete(`/SP_cat_colaboradoresMetasDel?id=${dato.id}`).then(() => {
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

  //AQUI COMIENZA EL MÉTODO GET PARA VISUALIZAR LOS REGISTROS
  const getMetas = () => {
    jezaApi
      .get("/sp_cat_colaboradoresMetasSel?id=0")
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
  //   setForm((prevState: any) => ({ ...prevState, [name]: value }));
  //   console.log(form);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Eliminar espacios en blanco al principio de la cadena
    const trimmedValue = value.replace(/^\s+/g, "");
    setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
    console.log(form);
  };


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
      año: 0,
      mes: 0,
      idcolabolador: 0,
      meta1: 0,
      meta2: 0,
      meta3: 0,
      meta4: 0,
      meta5: 0,
      meta6: 0,
      sucursal: 0,
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
      field: "año",
      headerName: "Año",
      width: 100,
      headerClassName: "custom-header",
      // renderCell: (params) => <span> {getCiaForeignKey(params.row.cia)} </span>,
    },

    { field: "mes", headerName: "Mes", width: 100, headerClassName: "custom-header" },
    {
      field: "nombre",
      headerName: "Colaborador",
      width: 200,
      headerClassName: "custom-header",
    },
    {
      field: "Expr1",
      headerName: "Sucursal",
      width: 150,
      headerClassName: "custom-header",
    },
    {
      field: "meta1",
      headerName: "Cifra color",
      width: 150,
      headerClassName: "custom-header",
      renderCell: (params) => (
        <span>{params.value !== null && params.value !== undefined ? `$${parseFloat(params.value).toFixed(2)}` : '0'}</span>
      ),
    },
    {
      field: "meta4",
      headerName: "Cifra reventa",
      width: 150,
      headerClassName: "custom-header",
      // renderCell: (params) => (
      //   <span>{params.value ? `$${parseFloat(params.value).toFixed(2)}` : '0'}</span>
      // ),
      renderCell: (params) => (
        <span>{params.value !== null && params.value !== undefined ? `$${parseFloat(params.value).toFixed(2)}` : '0'}</span>
      ),

    },
    {
      field: "meta2",
      headerName: "Cifra tratamientos",
      width: 150,
      headerClassName: "custom-header",
    },
    {
      field: "meta3",
      headerName: "Cifra productos",
      width: 150,
      headerClassName: "custom-header",
    },

    {
      field: "meta5",
      headerName: "Cifra servicios",
      width: 150,
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
  const handleValueChange = (fieldName: string, value: string | undefined) => {
    console.log(value);
    if (value === undefined) {
      setForm((prevForm) => ({
        ...prevForm,
        [fieldName]: 0, // Actualizar el valor correspondiente en el estado del formulario
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [fieldName]: value, // Actualizar el valor correspondiente en el estado del formulario
      }));
    }
  };
  function DataTable() {
    const getRowId = (row: MetasCol) => row.id;
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
      {showView ? (
        <>
          <Container>
            <br />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

              <h1> Metas <HiOutlineTrophy size={30} /></h1>
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
                  Crear meta
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
                <h3>Editar meta</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Row>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="año" labelName="Año:" value={form.año} />

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
                  {/* 
                  <Col md={"6"} style={{ marginBottom: 10 }}>
                    <Label>Sucursal:</Label>
                    <select
                      name="sucursal"
                      id="exampleSelect"
                      value={form.sucursal}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona sucursal</option>
                      {dataSucursales.map((sucursal) => (
                        <option key={sucursal.sucursal} value={sucursal.sucursal}>
                          {sucursal.nombre}
                        </option>
                      ))}
                    </select>
                  </Col> */}

                  <Col md={"6"}>
                    <Label>Trabajadores:</Label>
                    <Input type="select" name="idcolabolador" id="idcolabolador" defaultValue={form.idcolabolador} onChange={handleChange} disabled={true} // suponiendo que 'modoEdicion' es una variable que indica si estás en modo de edición
                    >
                      <option value="">Selecciona empresa</option>
                      {dataTrabajadores.map((colaborador: Trabajador) => (
                        <option key={colaborador.id} value={colaborador.id}>
                          {colaborador.nombre}
                        </option>
                      ))}
                    </Input>
                    <br />
                  </Col>
                  <Col md={"6"}>
                    <label> Cifra color:</label>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="meta1"
                      placeholder="Introducir un número"
                      value={form.meta1 ? form.meta1 : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("meta1", value)}
                    />
                    {/* <CFormGroupInput handleChange={handleChange} inputName="meta1" placeholder="$" value={form.meta1} /> */}
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta2" labelName="Cifra tratamientos:" value={form.meta2} />
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta3" labelName="Cifra productos:" value={form.meta3} />
                  </Col>
                  <Col md={"6"}>
                    {/* <CFormGroupInput handleChange={handleChange} inputName="meta4" labelName="Meta reventa:" placeholder="$" value={form.meta4} /> */}
                    <label> Cifra reventa:</label>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="meta4"
                      placeholder="Introducir un número"
                      value={form.meta4}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("meta4", value)}
                    />

                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta5" labelName="Cifra Servicios:" value={form.meta5} />
                  </Col>
                  {/* <Col md={"6"}>
                    <CFormGroupInput
                      handleChange={handleChange}
                      inputName="meta6"
                      labelName="Meta reventa:"
                      value={form.meta6}
                    />
                  </Col> */}
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
                <h3>Crear meta</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Row>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="año" labelName="Año:" value={form.año} />
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="mes" labelName="Mes:" value={form.mes} />
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
                    <Label>Trabajadores:</Label>
                    <Input type="select" name="idcolabolador" id="idcolabolador" defaultValue={form.idcolabolador} onChange={handleChange}>
                      <option value="">Selecciona empresa</option>
                      {dataTrabajadores.map((colaborador: Trabajador) => (
                        <option key={colaborador.id} value={colaborador.id}>
                          {colaborador.nombre}
                        </option>
                      ))}
                    </Input>
                    <br />
                  </Col>

                  <Col md={"6"}>
                    <label> Cifra color:</label>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="meta1"
                      placeholder="Introducir un número"
                      value={form.meta1}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("meta1", value)}
                    />
                    {/* <CFormGroupInput handleChange={handleChange} inputName="meta1" placeholder="$" value={form.meta1} /> */}
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta2" labelName="Cifra tratamientos:" value={form.meta2} />
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta3" labelName="Cifra productos:" value={form.meta3} />
                  </Col>
                  <Col md={"6"}>
                    {/* <CFormGroupInput handleChange={handleChange} inputName="meta4" labelName="Meta reventa:" placeholder="$" value={form.meta4} /> */}
                    <label> Cifra reventa:</label>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="meta4"
                      placeholder="Introducir un número"
                      value={form.meta4 ? form.meta4 : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("meta4", value)}
                    />

                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta5" labelName="Cifra Servicios:" value={form.meta5} />
                  </Col>
                  {/* <Col md={"6"}>
                    <CFormGroupInput
                      handleChange={handleChange}
                      inputName="meta6"
                      labelName="Meta reventa:"
                      value={form.meta6}
                    />
                  </Col> */}
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

export default Metas;
