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
import { CifrasSucursal } from "../../models/CifrasSucursal";
import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";
import { Trabajador } from "../../models/Trabajador";
import { UserResponse } from "../../models/Home";
import CurrencyInput from "react-currency-input-field";
import { HiOutlineTrophy } from "react-icons/hi2";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Sucursal } from "../../models/Sucursal";
function CifraSucursal() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_cifrasuc_view`);

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

  const [data, setData] = useState<CifrasSucursal[]>([]);
  const { dataCias, fetchCias } = useCias();
  const { dataTrabajadores, fetchNominaTrabajadores } = useNominaTrabajadores();
  const { dataSucursales } = useSucursales();
  const [form, setForm] = useState<CifrasSucursal>({
    id: 0,
    año: 0,
    mes: 0,
    sucursal: 0,
    meta1: 0,
    meta2: 0,
    meta3: 0,
    meta4: 0,
    meta5: 0,
    meta6: 0,
  });

  const mostrarModalActualizar = (dato: CifrasSucursal) => {
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
    const camposRequeridos: (keyof CifrasSucursal)[] = ["año", "mes", "meta1", "meta2", "meta3", "meta4", "meta5", "sucursal"];
    const camposVacios: Number[] = [];

    camposRequeridos.forEach((campo: keyof CifrasSucursal) => {
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
    const permiso = await filtroSeguridad("CAT_CIFRASUC_ADD");
    if (permiso === false) {
      return;
    }

    if (validarCampos() === true) {
      // Verificar si ya existe una meta para el colaborador en el mismo mes y año
      const metaExistente = data.find(
        (meta) =>
          meta.sucursal === Number(form.sucursal) &&
          meta.año === Number(form.año) &&
          meta.mes === Number(form.mes)
      );

      if (metaExistente) {
        Swal.fire({
          icon: "error",
          text: "Ya existe una cifra para esta sucursal en el mismo mes y año",
          confirmButtonColor: "#d63031",
        });
      } else {
        // Continuar con la inserción si no hay conflictos
        try {
          await jezaApi.post(`/sp_cat_ciasMetasAdd?año=${form.año}&mes=${form.mes}&sucursal=${form.sucursal}&meta1=${form.meta1 ? form.meta1 : 0.00}&meta2=${form.meta2 ? form.meta2 : 0}&meta3=${form.meta3 ? form.meta3 : 0}&meta4=${form.meta4 ? form.meta4 : 0}&meta5=${form.meta5 ? form.meta5 : 0}&meta6=0`);

          Swal.fire({
            icon: "success",
            text: "Cifra creada con éxito",
            confirmButtonColor: "#3085d6",
          });

          // Actualizar la lista de metas después de la inserción
          getMetas();
          setModalInsertar(false);
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            text: "Ocurrió un error al actualizar la cifra; comuníquese con sistemas.",
            confirmButtonColor: "#d63031",
          });
        }
      }
    } else {
      // Puedes manejar un caso específico si la validación de campos falla
    }
  };


  const insertar2 = async () => {
    const permiso = await filtroSeguridad("CAT_CIFRASUC_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (validarCampos() === true) {
      await jezaApi
        .post(


          `/sp_cat_ciasMetasAdd?año=${form.año}&mes=${form.mes}&sucursal=${form.sucursal}&meta1=${form.meta1 ? form.meta1 : 0.00}&meta2=${form.meta2 ? form.meta2 : 0}&meta3=${form.meta3 ? form.meta3 : 0}&meta4=${form.meta4 ? form.meta4 : 0}&meta5=${form.meta5 ? form.meta5 : 0}&meta6=0`
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Cifra creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getMetas();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Ocurrió un error al actualizar la cifra; comuníquese con sistemas.",
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
    const permiso = await filtroSeguridad("CAT_CIFRASUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (validarCampos()) {
      const nuevaMeta = {
        sucursal: Number(form.sucursal),
        año: Number(form.año),
        mes: Number(form.mes),
        meta1: Number(form.meta1),
        meta2: Number(form.meta2),
        meta3: Number(form.meta3),
        meta4: Number(form.meta4),
        meta5: Number(form.meta5),
        meta6: Number(form.meta6),
      };

      // Verificar si ya existe una meta en el mismo mes y año para el mismo usuario
      const metaExistenteEnMismoMesAño = data.find(
        (meta) =>
          meta.sucursal === nuevaMeta.sucursal &&
          meta.año === nuevaMeta.año &&
          meta.mes === nuevaMeta.mes
      );

      if (metaExistenteEnMismoMesAño && metaExistenteEnMismoMesAño.id !== form.id) {
        // Ya existe una meta para el mismo usuario en el mismo mes y año (y no es la misma que estamos editando)
        Swal.fire({
          icon: "error",
          text: "Ya existe una cifra para esta sucursal en el mismo mes y año",
          confirmButtonColor: "#d63031",
        });
      } else {
        // No hay duplicados, proceder con la actualización
        await jezaApi
          .put(
            `/sp_cat_ciasMetasUpd?id=${form.id}&año=${form.año}&mes=${form.mes}&sucursal=${form.sucursal}&meta1=${form.meta1}&meta2=${form.meta2}&meta3=${form.meta3}&meta4=${form.meta4}&meta5=${form.meta5}&meta6=0`
          )
          .then((response) => {
            Swal.fire({
              icon: "success",
              text: "Cifra actualizada con éxito",
              confirmButtonColor: "#3085d6",
            });
            setModalActualizar(false);
            getMetas();
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              icon: "error",
              text: "Ocurrió un error al actualizar la cifra; comuníquese con sistemas.",
              confirmButtonColor: "#d63031",
            });
          });
      }
    } else {
      // Puedes manejar un caso específico si la validación de campos falla
    }
  };


  const editar2 = async () => {
    const permiso = await filtroSeguridad("CAT_CIFRASUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (validarCampos() === true) {
      await jezaApi
        .put(

          `/sp_cat_ciasMetasUpd?id=${form.id}&año=${form.año}&mes=${form.mes}&sucursal=${form.sucursal}&meta1=${form.meta1}&meta2=${form.meta2}&meta3=${form.meta3}&meta4=${form.meta4}&meta5=${form.meta5}&meta6=0`
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Cifra actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getMetas();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: "Ocurrió un error al actualizar la cifra, comuniquese con sistemas",
            confirmButtonColor: "#d63031",
          });
        });
    } else {
      // Puedes manejar un caso específico si la validación de campos falla
    }
  };





  ///AQUÍ COMIENZA EL MÉTODO DELETE

  const eliminar1 = async (dato: CifrasSucursal) => {
    const permiso = await filtroSeguridad("CAT_CIFRASUC_DEL");
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
        jezaApi.delete(`/sp_cat_ciasMetasDel?id=${dato.id}`).then(() => {
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

  const eliminar = async (dato: CifrasSucursal) => {
    const permiso = await filtroSeguridad("CAT_CIFRASUC_DEL");
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
          await jezaApi.delete(`/sp_cat_ciasMetasDel?id=${dato.id}`);
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
      .get("/sp_cat_ciasMetasSel?id=%")
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
    if (name === 'meta5' || 'meta3' || 'meta4' || 'año' || 'mes') {
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

  // const trabajadoresDisponibles = dataTrabajadores.filter((trabajador: Trabajador) => {
  //   // Filtra los trabajadores que no están en las metas existentes
  //   return !data.some((meta: MetasCol) => meta.idcolabolador === trabajador.id);
  // });


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
      width: 80,
      headerClassName: "custom-header",
      // renderCell: (params) => <span> {getCiaForeignKey(params.row.cia)} </span>,
    },

    { field: "mes", headerName: "Mes", width: 80, headerClassName: "custom-header" },
    {
      field: "nombre",
      headerName: "Sucursal",
      width: 180,
      headerClassName: "custom-header",
    },
    // {
    //   field: "sucursal",
    //   headerName: "Sucursal",
    //   width: 150,
    //   headerClassName: "custom-header",
    // },
    {
      field: "meta1",
      headerName: "Cifra servicios",
      width: 120,
      headerClassName: "custom-header",
      renderCell: (params) => (
        <span>{params.value !== null && params.value !== undefined ? `$${parseFloat(params.value).toFixed(2)}` : '0'}</span>
      ),
    },
    {
      field: "meta2",
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
      field: "meta3",
      headerName: "Cifra color",
      width: 150,
      headerClassName: "custom-header",
    },
    {
      field: "meta4",
      headerName: "Cifra productos",
      width: 150,
      headerClassName: "custom-header",
    },

    {
      field: "meta5",
      headerName: "Cifra tratamientos",
      width: 120,

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
        [fieldName]: '0', // Actualizar el valor correspondiente en el estado del formulario
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
  //   const getRowId = (row: CifrasSucursal) => row.id;
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

              <h1> Cifras sucursal<HiOutlineTrophy size={30} /></h1>
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
                  Crear cifras
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
                <h3>Editar cifras</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Row>
                  <Col md={"6"}>
                    {/* <CFormGroupInput handleChange={handleChange} inputName="año" labelName="Año:" value={form.año} /> */}
                    <Label>Año:</Label>
                    <Input className="mb-3" type="select" onChange={handleChange} name="año" value={Number(form.año)}>
                      <option value="">--Selecciona el año--</option>
                      <option value={2023}>2023</option>
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                      <option value={2027}>2027</option>
                      <option value={2028}>2028</option>
                      <option value={2029}>2029</option>
                      <option value={2030}>2030</option>
                    </Input>
                  </Col>
                  <Col md={"6"}>
                    <Label>Mes:</Label>
                    <Input className="mb-3" type="select" onChange={handleChange} name="mes" value={Number(form.mes)}>
                      <option value="">--Selecciona el mes--</option>
                      <option value={1}>Enero</option>
                      <option value={2}>Febrero</option>
                      <option value={3}>Marzo</option>
                      <option value={4}>Abril</option>
                      <option value={5}>Mayo</option>
                      <option value={6}>Junio</option>
                      <option value={7}>Julio</option>
                      <option value={8}>Agosto</option>
                      <option value={9}>Septiembre</option>
                      <option value={10}>Octubre</option>
                      <option value={11}>Noviembre</option>
                      <option value={12}>Diciembre</option>
                    </Input>
                  </Col>

                  <Col md={"6"} style={{ marginBottom: 10 }}>
                    <Label>Sucursal:</Label>
                    <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
                      <option value="">--Selecciona sucursal--</option>
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
                  {/* <Col md={"6"}>
                    <Label>Trabajadores:</Label>
                    <Input type="select" name="idcolabolador" id="idcolabolador" defaultValue={form.idcolabolador} onChange={handleChange} disabled={true} // suponiendo que 'modoEdicion' es una variable que indica si estás en modo de edición
                    >
                      <option value="">--Selecciona empresa--</option>
                      {dataTrabajadores.map((colaborador: Trabajador) => (
                        <option key={colaborador.id} value={colaborador.id}>
                          {colaborador.nombre}
                        </option>
                      ))}
                    </Input> */}
                  {/* <br />
                </Col> */}
                  <br />
                  <Col md={"6"}>
                    <label> Cifra servicios:</label>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="meta1"
                      placeholder="Introducir un número"
                      value={form.meta1}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("meta1", value)}
                    />
                    <br />
                  </Col>
                  <Col md={"6"}>
                    <label> Cifra reventa:</label>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="meta2"
                      placeholder="Introducir un número"
                      value={form.meta2 ? form.meta2 : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("meta2", value)}
                    />

                    {/* <CFormGroupInput handleChange={handleChange} inputName="meta1" placeholder="$" value={form.meta1} /> */}
                  </Col>

                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta3" labelName="Cifra color:" value={form.meta3} minlength={15} maxlength={15} />

                  </Col>

                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta4" labelName="Cifra productos:" value={form.meta4} minlength={15} maxlength={15} />

                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta5" labelName="Cifra tratamientos:" value={form.meta5} minlength={15} maxlength={15} />

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
                <h3>Crear cifras</h3>
              </div>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Row>
                  {/* <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="año" labelName="Año:" value={form.año} />
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="mes" labelName="Mes:" value={form.mes} />
                  </Col> */}
                  <Col md={"6"}>
                    {/* <CFormGroupInput handleChange={handleChange} inputName="año" labelName="Año:" value={form.año} /> */}
                    <Label>Año:</Label>
                    <Input className="mb-3" type="select" onChange={handleChange} name="año" value={Number(form.año)}>
                      <option value="">--Selecciona el año--</option>
                      <option value={2023}>2023</option>
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                      <option value={2027}>2027</option>
                      <option value={2028}>2028</option>
                      <option value={2029}>2029</option>
                      <option value={2030}>2030</option>
                    </Input>
                  </Col>
                  <Col md={"6"}>
                    <Label>Mes:</Label>
                    <Input className="mb-3" type="select" onChange={handleChange} name="mes" value={Number(form.mes)}>
                      <option value="">--Selecciona el mes--</option>
                      <option value={1}>Enero</option>
                      <option value={2}>Febrero</option>
                      <option value={3}>Marzo</option>
                      <option value={4}>Abril</option>
                      <option value={5}>Mayo</option>
                      <option value={6}>Junio</option>
                      <option value={7}>Julio</option>
                      <option value={8}>Agosto</option>
                      <option value={9}>Septiembre</option>
                      <option value={10}>Octubre</option>
                      <option value={11}>Noviembre</option>
                      <option value={12}>Diciembre</option>
                    </Input>
                  </Col>
                  <Col md={"6"} style={{ marginBottom: 10 }}>
                    <Label>Sucursal:</Label>
                    <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
                      <option value="">--Selecciona sucursal--</option>
                      {dataSucursales.map((sucursal) => (
                        <option key={sucursal.sucursal} value={sucursal.sucursal}>
                          {sucursal.nombre}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  {/* <Col md={"6"}>
                    <Label>Trabajadores:</Label>
                    <Input type="select" name="idcolabolador" id="idcolabolador" defaultValue={form.idcolabolador} onChange={handleChange}>
                      <option value="">Selecciona empresa</option>
                      {dataTrabajadores.map((colaborador: Trabajador) => (
                        <option key={colaborador.id} value={colaborador.id}>
                          {colaborador.nombre}
                        </option>
                      ))}
                    </Input>
                  
                  </Col> */}
                  {/* 
                  <Col md={"6"}>
                    <Label>Trabajadores:</Label>
                    <Input
                      type="select"
                      name="idcolabolador"
                      id="idcolabolador"
                      defaultValue={form.idcolabolador}
                      onChange={handleChange}>
                      <option value="">--Selecciona trabajador--</option>
                      {trabajadoresDisponibles.map((colaborador: Trabajador) => (
                        <option key={colaborador.id} value={colaborador.id}>
                          {colaborador.nombre}
                        </option>
                      ))}
                    </Input>
                  </Col> */}

                  <Col md={"6"}>
                    <label> Cifra servicios:</label>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="meta1"
                      placeholder="Introducir un número"
                      value={form.meta1}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("meta1", value)}
                    />
                  </Col>

                  <Col md={"6"}>
                    <label> Cifra reventa:</label>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="meta2"
                      placeholder="Introducir un número"
                      value={form.meta2 ? form.meta2 : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("meta2", value)}
                    />
                    {/* <CFormGroupInput handleChange={handleChange} inputName="meta1" placeholder="$" value={form.meta1} /> */}
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta3" labelName="Cifra color:" value={form.meta3} minlength={15} maxlength={15} />
                  </Col>

                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta4" labelName="Cifra productos:" value={form.meta4} minlength={15} maxlength={15} />
                  </Col>
                  <Col md={"6"}>
                    <CFormGroupInput handleChange={handleChange} inputName="meta5" labelName="Cifra tratamientos:" value={form.meta5} minlength={15} maxlength={15} />
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
      ) : null
      }
    </>
  );
}

export default CifraSucursal;
