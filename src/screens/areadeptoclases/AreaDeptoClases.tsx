import React, { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Container,
  Input,
  Modal,
  ModalBody,
  TabPane,
  Nav,
  NavLink,
  TabContent,
  NavItem,
  ModalFooter,
  ModalHeader,
  Label,
  Col,
  FormGroup,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Area } from "../../models/Area";
import { Clase } from "../../models/Clase";
import { Departamento } from "../../models/Departamento";
import Swal from "sweetalert2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { VscTypeHierarchy } from "react-icons/vsc";
import { useAreas } from "../../hooks/getsHooks/useAreas";
import { useDeptos } from "../../hooks/getsHooks/useDeptos";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { UserResponse } from "../../models/Home";

function AreaDeptoClases() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_area_dep_clas_view`);

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
  const { modalActualizarArea, modalInsertarArea, setModalInsertarArea, setModalActualizarArea, cerrarModalActualizarArea, cerrarModalInsertarArea } =
    useModalHook();
  const {
    modalActualizarDepto,
    modalInsertarDepto,
    setModalInsertarDepto,
    setModalActualizarDepto,
    cerrarModalActualizarDepto,
    cerrarModalInsertarDepto,
  } = useModalHook();
  const {
    modalActualizarClase,
    modalInsertarClase,
    setModalInsertarClase,
    setModalActualizarClase,
    cerrarModalActualizarClase,
    cerrarModalInsertarClase,
  } = useModalHook();

  const { dataDeptos } = useDeptos();

  const [deptoGet, setDeptoGet] = useState<Departamento[]>([]);
  const [areasGet, setAreaGet] = useState<Area[]>([]);
  const [claseGet, setclaseGet] = useState<Clase[]>([]);

  const { filtroSeguridad, session } = useSeguridad();

  const [formArea, setArea] = useState<Area>({
    id: 0,
    area: 0,
    descripcion: "",
  });

  const [formDepto, setDepto] = useState<Departamento>({
    id: 0,
    area: 0,
    d_area: "",
    depto: 0,
    descripcion: "",
  });

  const [formClase, setClase] = useState<Clase>({
    id: 0,
    clase: 0,
    area: 0,
    d_area: "",
    depto: 0,
    d_depto: "",
    descripcion: "",
  });

  const mostrarModalActualizarArea = (dato: Area) => {
    setArea(dato);
    setModalActualizarArea(true);
  };

  const mostrarModalActualizarClase = (dato: Clase) => {
    setClase(dato);
    setModalActualizarClase(true);
  };

  const mostrarModalActualizarDepto = (dato: Departamento) => {
    setDepto(dato);
    setModalActualizarDepto(true);
  };

  ///handle con espacio
  const handleChangeArea = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Eliminar espacios en blanco al principio de la cadena
    const trimmedValue = value.replace(/^\s+/g, "");
    setArea((prevState) => ({ ...prevState, [name]: trimmedValue }));
  };

  const handleChangeAreaDepto = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Eliminar espacios en blanco al principio de la cadena
    const trimmedValue = value.replace(/^\s+/g, "");
    setDepto((prevState) => ({ ...prevState, [name]: trimmedValue }));
  };

  const handleChangeAreaDeptoClase = (e) => {
    const { name, value } = e.target;

    // Si el campo que cambió es "area" y su valor es vacío, reinicia el valor de "depto" a vacío
    if (name === "area" && value === "") {
      setClase({ ...formClase, area: "", depto: "" });
    } else {
      // Si no, actualiza el estado formClase con el nuevo valor del campo}
      const trimmedValue = value.replace(/^\s+/g, "");
      //setClase({ ...formClase, [name]: value });
      setClase((prevState) => ({ ...prevState, [name]: trimmedValue }));
    }
  };

  //VALIDACIÓN AREA ---->
  const [camposFaltantes1, setCamposFaltantes1] = useState<string[]>([]);

  const validarCampos1 = () => {
    const camposRequeridos: (keyof Area)[] = ["descripcion"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Area) => {
      const fieldValue = formArea[campo];
      if (!fieldValue || String(fieldValue).trim() === "") {
        camposVacios.push(campo);
      }
    });

    setCamposFaltantes1(camposVacios);

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

  ////CAMPOS VACIOS AREAS
  const LimpiezaFormArea = () => {
    setArea({ id: 0, area: 0, descripcion: "" });
  };

  //VALIDACIÓN DEPTO---->
  const [camposFaltantes2, setCamposFaltantes2] = useState<string[]>([]);

  const validarCampos2 = () => {
    const camposRequeridos: (keyof Departamento)[] = ["descripcion", "area"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Departamento) => {
      const fieldValue = formDepto[campo];
      if (!fieldValue || String(fieldValue).trim() === "") {
        camposVacios.push(campo);
      }
    });

    setCamposFaltantes2(camposVacios);

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

  ////CAMPOS VACIOS DEPTOS
  const LimpiezaFormDepto = () => {
    setDepto({ id: 0, area: 0, d_area: "", depto: 0, descripcion: "" });
  };

  //VALIDACIÓN CLASE---->
  const [camposFaltantes3, setCamposFaltantes3] = useState<string[]>([]);

  const validarCampos3 = () => {
    const camposRequeridos: (keyof Clase)[] = ["area", "depto", "descripcion"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Clase) => {
      const fieldValue = formClase[campo];
      if (!fieldValue || String(fieldValue).trim() === "") {
        camposVacios.push(campo);
      }
    });

    setCamposFaltantes3(camposVacios);

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
  const [estado3, setEstado3] = useState("");

  ////CAMPOS VACIOS clases
  const LimpiezaFormClase = () => {
    setClase({ id: 0, clase: 0, d_area: "", area: 0, depto: 0, d_depto: "", descripcion: "" });
  };

  //AQUI COMIENZA MÉTODO AGREGAR AREA
  const insertar1 = async () => {
    const permiso = await filtroSeguridad("CAT_AREA-ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos1() === true) {
      await jezaApi
        .post("/Area", null, {
          params: {
            descripcion: formArea.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Área creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertarArea(false);
          getAreas();
        })
        .catch((error) => {
          console.log(error);
          // Muestra una alerta de error al usuario
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al crear el área. Por favor, intenta nuevamente.",
            confirmButtonColor: "#d33",
          });

        });
    } else {
    }
  };

  //AQUI COMIENZA MÉTODO AGREGAR DEPTO
  const insertar2 = async () => {
    const permiso = await filtroSeguridad("CAT_DEPTOS_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos2() === true) {
      await jezaApi
        .post("/Depto", null, {
          params: {
            area: formDepto.area,
            descripcion: formDepto.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Departamento creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertarDepto(false);
          getDepartamentos();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al crear el departamento. Por favor, intenta nuevamente.",
            confirmButtonColor: "#d33",
          });
        });
    } else {
    }
  };

  //AQUI COMIENZA MÉTODO AGREGAR CLASE
  const insertar3 = async () => {
    const permiso = await filtroSeguridad("CAT_CLASES_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos3() === true) {
      await jezaApi
        .post("/Clase", null, {
          params: {
            area: formClase.area,
            depto: formClase.depto,
            descripcion: formClase.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Clase creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertarClase(false);
          getClases();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al crear la clase. Por favor, intenta nuevamente.",
            confirmButtonColor: "#d33",
          });
        });
    } else {
    }
  };

  const editArea = async () => {
    const fechaHoy = new Date();
    const permiso = await filtroSeguridad("CAT_AREA_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos1() === true) {
      await jezaApi
        .put(`/Area2`, null, {
          params: {
            area: formArea.area,
            descripcion: formArea.descripcion,
            fecha_alta: fechaHoy,
            fecha_act: fechaHoy,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Área actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizarArea(false);
          getAreas();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al actualizar el área. Por favor, intenta nuevamente.",
            confirmButtonColor: "#d33",
          });
        });
    } else {
    }
  };

  const editDepto = async () => {
    const permiso = await filtroSeguridad("CAT_DEPTOS_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos2() === true) {
      await jezaApi
        .put(`/Depto?id=${formDepto.depto}&area=${formDepto.area}&descripcion=${formDepto.descripcion}`)
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Departamento actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizarDepto(false);
          getDepartamentos();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al actualizar el departamento. Por favor, intenta nuevamente.",
            confirmButtonColor: "#d33",
          });
        });
    } else {
    }
  };

  const editClase = async () => {
    const permiso = await filtroSeguridad("CAT_CLASES_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos3() === true) {
      await jezaApi
        .put(`/Clase`, null, {
          params: {
            id: formClase.id,
            area: formClase.area,
            depto: formClase.depto,
            clase: formClase.clase,
            descripcion: formClase.descripcion,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Clase actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizarClase(false);
          getClases();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al actualizar el departamento. Por favor, intenta nuevamente.",
            confirmButtonColor: "#d33",
          });

        });
    } else {
    }
  };

  // const eliminar1 = async (dato: Area) => {
  //   const permiso = await filtroSeguridad("CAT_AREA_DEL");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   Swal.fire({
  //     title: "ADVERTENCIA",
  //     text: `¿Está seguro que desea eliminar la el área: ${dato.descripcion}?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Sí, eliminar",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       jezaApi.delete(`/Area?area=${dato.area}`).then(() => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Registro eliminado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         getAreas();
  //       });
  //     }
  //   });
  // };

  const eliminar1 = async (dato: Area) => {
    const permiso = await filtroSeguridad("CAT_AREA_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el área: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Area?area=${dato.area}`)
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Registro eliminado con éxito",
              confirmButtonColor: "#3085d6",
            });
            getAreas();
          })
          .catch((error) => {
            console.error(error); // Imprime el error en la consola para fines de depuración

            // Muestra una alerta de error al usuario
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al eliminar el área. Por favor, intenta nuevamente.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };

  // const eliminar2 = async (dato: Clase) => {
  //   const permiso = await filtroSeguridad("CAT_CLASES_DEL");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   Swal.fire({
  //     title: "ADVERTENCIA",
  //     text: `¿Está seguro que desea eliminar la clase: ${dato.descripcion}?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Sí, eliminar",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       jezaApi.delete(`/Clase?area=${dato.area}&depto=${dato.depto}&id=${dato.clase}`).then(() => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Registro eliminado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         getClases();
  //       });
  //     }
  //   });
  // };

  const eliminar2 = async (dato: Clase) => {
    const permiso = await filtroSeguridad("CAT_CLASES_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar la clase: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Clase?area=${dato.area}&depto=${dato.depto}&id=${dato.clase}`)
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Registro eliminado con éxito",
              confirmButtonColor: "#3085d6",
            });
            getClases();
          })
          .catch((error) => {
            console.error(error); // Imprime el error en la consola para fines de depuración

            // Muestra una alerta de error al usuario
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al eliminar la clase. Por favor, intenta nuevamente.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };


  // ELIMINAR DEPARTAMENTO
  // const eliminar3 = async (dato: Departamento) => {
  //   const permiso = await filtroSeguridad("CAT_DEPTOS_DEL");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
  //   }
  //   Swal.fire({
  //     title: "ADVERTENCIA",
  //     text: `¿Está seguro que desea eliminar la el departamento: ${dato.descripcion}?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Sí, eliminar",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       jezaApi.delete(`/Depto?area=${dato.area}&id=${dato.depto}`).then(() => {
  //         Swal.fire({
  //           icon: "success",
  //           text: "Registro eliminado con éxito",
  //           confirmButtonColor: "#3085d6",
  //         });
  //         getDepartamentos();
  //       });
  //     }
  //   });
  // };

  const eliminar3 = async (dato: Departamento) => {
    const permiso = await filtroSeguridad("CAT_DEPTOS_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el departamento: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Depto?area=${dato.area}&id=${dato.depto}`)
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Registro eliminado con éxito",
              confirmButtonColor: "#3085d6",
            });
            getDepartamentos();
          })
          .catch((error) => {
            console.error(error); // Imprime el error en la consola para fines de depuración

            // Muestra una alerta de error al usuario
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al eliminar el departamento. Por favor, intenta nuevamente.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };



  const getAreas = () => {
    jezaApi.get("/Area?area=0").then((response) => {
      setAreaGet(response.data);
    });
  };
  const getClases = () => {
    jezaApi.get("/Clase?area=0&id=0&depto=0").then((response) => {
      setclaseGet(response.data);
      console.log(response.data);
    });
  };
  const getDepartamentos = () => {
    jezaApi.get("/Depto?area=0&id=0").then((response) => {
      setDeptoGet(response.data);
    });
  };

  useEffect(() => {
    getAreas();
    getClases();
    getDepartamentos();
  }, []);

  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) setActiveTab(tab);
    getAreas();
    getClases();
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

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE AREAS
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    // { field: "area", headerName: "Área", flex: 1, headerClassName: "custom-header" },
    { field: "descripcion", headerName: "Áreas", flex: 1, headerClassName: "custom-header" },
  ];

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizarArea(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => eliminar1(params.row)} size={23}></AiFillDelete>
      </>
    );
  };

  function DataTable() {
    return (
      <div style={{ height: 600, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={areasGet}
            columns={columns}
            getRowId={(row) => row.area}
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

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE DEPARTAMENTOS
  const columns2: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito2 params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },
    { field: "d_area", headerName: "Áreas descripción", flex: 1, headerClassName: "custom-header" },
    { field: "descripcion", headerName: "Departamentos", flex: 1, headerClassName: "custom-header" },
  ];

  const ComponentChiquito2 = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizarDepto(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => eliminar3(params.row)} size={23}></AiFillDelete>
      </>
    );
  };

  function DataTableDepto() {
    return (
      <div style={{ height: 600, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={deptoGet}
            columns={columns2}
            getRowId={(row) => row.depto}
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

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE DEPART
  const columns3: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito3 params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },
    { field: "d_area", headerName: "Áreas descripción", flex: 1, headerClassName: "custom-header" },
    { field: "d_depto", headerName: "Departamentos descripción", flex: 1, headerClassName: "custom-header" },
    { field: "descripcion", headerName: "Clases", flex: 1, headerClassName: "custom-header" },
  ];

  const ComponentChiquito3 = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizarClase(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => eliminar2(params.row)} size={23}></AiFillDelete>
      </>
    );
  };

  function DataTableClase() {
    return (
      <div style={{ height: 600, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={claseGet}
            columns={columns3}
            getRowId={(row) => row.clase}
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
          <Col>
            <Container fluid>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1>
                  {" "}
                  Áreas, Departamentos y Clases <VscTypeHierarchy size={30}></VscTypeHierarchy>
                </h1>
              </div>
            </Container>

            <br />
            <Nav tabs>
              <NavItem>
                <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
                  Áreas
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
                  Departamentos
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")}>
                  Clases
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <br />
                {/* ButtonGroup crear areas*/}
                <div>
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button
                      style={{ marginLeft: "auto" }}
                      color="success"
                      onClick={() => {
                        setModalInsertarArea(true);
                        setEstado("insert");
                        LimpiezaFormArea();
                      }}
                    >
                      Crear área
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

                <Row>
                  <br />
                  <DataTable></DataTable>
                </Row>
                <br />
              </TabPane>

              <TabPane tabId="2">
                <br />
                {/* ButtonGroup crear departamento*/}
                <div>
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button
                      style={{ marginLeft: "auto" }}
                      color="success"
                      onClick={() => {
                        setModalInsertarDepto(true);
                        LimpiezaFormDepto();
                      }}
                    >
                      Crear departamento
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
                <DataTableDepto></DataTableDepto>
                <br />
              </TabPane>

              <TabPane tabId="3">
                <br />
                {/* ButtonGroup crear clases*/}
                <div>
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button
                      style={{ marginLeft: "auto" }}
                      color="success"
                      onClick={() => {
                        setModalInsertarClase(true);
                        setEstado3("insert");
                        LimpiezaFormClase();
                      }}
                    >
                      Crear clase
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
                <DataTableClase></DataTableClase>
                <br />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>

      {/* ACTUALIZAR AREA */}
      <Modal isOpen={modalActualizarArea} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar áreas</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput handleChange={handleChangeArea} inputName="descripcion" labelName="descripción de área:" value={formArea.descripcion} minlength={1} maxlength={35} />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={editArea} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizarArea()} text="Cancelar" />
        </ModalFooter>
      </Modal>
      {/* ACTUALIZAR DEPARTAMENTO */}
      <Modal isOpen={modalActualizarDepto} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar departamentos</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Área:</Label>
          <Input type="select" name="area" id="area" onChange={handleChangeAreaDepto} value={formDepto.area} >
            <option value="">--Seleccione área--</option>
            {areasGet.map((option) => (
              <option key={option.area} value={option.area}>
                {option.descripcion}
              </option>
            ))}
          </Input>
          <br />
          <CFormGroupInput
            handleChange={(e) => handleChangeAreaDepto(e)} // Puedes usar handleChangeAreaDepto directamente
            inputName="descripcion"
            labelName="Descripción:"
            value={formDepto.descripcion}
          />
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={editDepto} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizarDepto()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* ACTUALIZAR CLASE */}
      <Modal isOpen={modalActualizarClase} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar clases</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="area">Área:</Label>
            <Input type="select" name="area" id="exampleSelect" value={formClase.area} onChange={handleChangeAreaDeptoClase}>
              <option value="">--Seleccione área--</option>
              {areasGet.map((area: Area) => (
                <option key={Number(area.area)} value={Number(area.area)}>
                  {area.descripcion}
                </option>
              ))}
            </Input>
          </FormGroup>
          <br />
          <FormGroup>
            <Label for="departamento">Departamento:</Label>
            <Input type="select" name="depto" id="exampleSelect" value={formClase.depto} onChange={handleChangeAreaDeptoClase}>
              <option value="">--Seleccione un departamento--</option>
              {deptoGet
                .filter((depto: Departamento) => Number(depto.area) === Number(formClase.area))
                .map((depto: Departamento) => (
                  <option key={Number(depto.depto)} value={Number(depto.depto)}>
                    {depto.descripcion}
                  </option>
                ))}
            </Input>
          </FormGroup>
          <br />
          <CFormGroupInput handleChange={handleChangeAreaDeptoClase} inputName="descripcion" labelName="Descripción:" value={formClase.descripcion} minlength={1} maxlength={35} />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={editClase} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizarClase()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* MODAL CREAR AREA */}
      <Modal isOpen={modalInsertarArea}>
        <ModalHeader>
          <div>
            <h3>Crear área</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput handleChange={handleChangeArea} inputName="descripcion" labelName="Descripción de área:" value={formArea.descripcion} minlength={1} maxlength={35} />
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar1} text="Guardar área" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertarArea()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* MODAL CREAR DEPARTAMENTO */}
      <Modal isOpen={modalInsertarDepto}>
        <ModalHeader>
          <div>
            <h3>Crear departamento</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Área:</Label>
          <Input type="select" name="area" id="area" onChange={handleChangeAreaDepto} value={formDepto.area}>
            <option value="">--Seleccione área--</option>
            {areasGet.map((option: Area) => (
              <option key={Number(option.area)} value={Number(option.area)}>
                {option.descripcion}
              </option>
            ))}
          </Input>
          <br />
          <CFormGroupInput handleChange={handleChangeAreaDepto} inputName="descripcion" labelName="Descripción:" value={formDepto.descripcion} minlength={1} maxlength={35} />
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar2} text="Guardar departamento" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertarDepto()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/* MODAL CREAR CLASE */}
      <Modal isOpen={modalInsertarClase}>
        <ModalHeader>
          <div>
            <h3>Crear clase</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="area">Área:</Label>
            <Input type="select" name="area" id="exampleSelect" value={formClase.area} onChange={handleChangeAreaDeptoClase}>
              <option value="">--Seleccione área--</option>
              {areasGet.map((area) => (
                <option value={area.area}>{area.descripcion}</option>
              ))}{" "}
            </Input>
          </FormGroup>
          <br />
          <FormGroup>
            <Label for="departamento">Departamento:</Label>
            <Input type="select" name="depto" id="exampleSelect" value={formClase.depto} onChange={handleChangeAreaDeptoClase}>
              <option value="">--Seleccione un departamento--</option>
              {deptoGet
                .filter((depto: Departamento) => Number(depto.area) === Number(formClase.area))
                .map((depto) => (
                  <option value={depto.depto}>{depto.descripcion}</option>
                ))}{" "}
            </Input>
          </FormGroup>
          <br />
          <CFormGroupInput handleChange={handleChangeAreaDeptoClase} inputName="descripcion" labelName="Descripción:" value={formClase.descripcion} minlength={1} maxlength={35} />
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar3} text="Guardar clase" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertarClase()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default AreaDeptoClases;
