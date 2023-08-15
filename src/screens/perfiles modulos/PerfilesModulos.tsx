// ////USANDO GITHUB

// import React, { useState, useEffect } from "react";
// import { MdInventory } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import {
//   Row,
//   Container,
//   Col,
//   Card,
//   CardHeader,
//   CardBody,
//   CardTitle,
//   CardText,
//   Input,
//   Table,
//   Button,
//   FormGroup,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
//   Label,
// } from "reactstrap";
// import { jezaApi } from "../../api/jezaApi";
// import CButton from "../../components/CButton";
// import CFormGroupInput from "../../components/CFormGroupInput";
// import SidebarHorizontal from "../../components/SidebarHorizontal";
// import useModalHook from "../../hooks/useModalHook";
// import TablePerfilesModulos from "./components/TablePerfilesModulos";
// import { Perfil_Modulo } from "../../models/Perfil_Modulo";
// import { usePerfiles } from "../../hooks/getsHooks/useClavePerfil";

// function PerfilesModulos() {
//   const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
//     useModalHook();
//   const [filtroValorMedico, setFiltroValorMedico] = useState("");

//   const [data, setData] = useState<Perfil_Modulo[]>([]);
//   const { dataPerfiles } = usePerfiles();
//   const [form, setForm] = useState<Perfil_Modulo>({
//     clave_perfil: 1,
//     modulo: 1,
//     permiso: false,
//     d_perfil: "",
//   });

//   const navigate = useNavigate();

//   const DataTableHeader = ["Clave Perfil", "Modulo", "Permisos", "Acciones"];

//   const mostrarModalActualizar = (dato: any) => {
//     setForm(dato);
//     setModalActualizar(true);
//   };

//   const editar = (dato: Perfil_Modulo) => {
//     jezaApi
//       .put(`/PerfilModulo`, null, {
//         params: {
//           id: Number(dato.id),
//           clave_perfil: Number(dato.clave_perfil),
//           modulo: Number(dato.modulo),
//           permiso: dato.permiso,
//         },
//       })
//       .then((response) => {
//         getPerfilModulos();
//       })
//       .catch((e) => console.log(e));
//     setModalActualizar(false);
//   };

//   const getPerfilModulos = () => {
//     jezaApi
//       .get("PerfilModulo?id=0")
//       .then((response) => setData(response.data))
//       .catch((e) => console.log(e));
//   };

//   const getModulos = () => {
//     jezaApi
//       .get("PerfilModulo?id=0")
//       .then((response) => setData(response.data))
//       .catch((e) => console.log(e));
//   };

//   useEffect(() => {
//     getPerfilModulos();
//   }, []);

//   const eliminar = (dato: any) => {
//     const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
//     if (opcion) {
//       jezaApi.delete(`/PerfilModulo?id=${dato.id}`).then(() => {
//         setModalActualizar(false);
//         setTimeout(() => {
//           getPerfilModulos();
//         }, 1000);
//       });
//     }
//   };

//   const insertar = () => {
//     jezaApi.post("/Medico", {}).then(() => { });
//     setModalInsertar(false);
//   };

//   const filtroEmail = (datoDescripcion: any) => {
//     var resultado = data.filter((elemento: Perfil_Modulo) => {
//       // Aplica la lógica del filtro solo si hay valores en los inputs
//       if (elemento.d_perfil?.toLowerCase().includes(datoDescripcion.toLowerCase())) {
//         return elemento;
//       }
//     });
//     setData(resultado);
//   };
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;
//     if (name === "permiso") {
//       setForm((prevState) => ({ ...prevState, [name]: checked }));
//     } else {
//       setForm((prevState: Perfil_Modulo) => ({ ...prevState, [name]: value }));
//     }
//     console.log(form);
//   };
//   const handleNav = () => {
//     navigate("/UsuariosCrear");
//   };
//   const handleNavs = () => {
//     navigate("/PerfilesModulosCrear");
//   };
//   const [isSidebarVisible, setSidebarVisible] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarVisible(!isSidebarVisible);
//   };
//   return (
//     <>
//       <Row>
//         <SidebarHorizontal />
//       </Row>
//       <Container>
//         <Row>
//           <Col>
//             <Container fluid>
//               <br />
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <h1> Seguridad </h1>
//                 <MdInventory size={30}></MdInventory>
//               </div>

//               <div className="col align-self-start d-flex justify-content-center ">
//                 <Card className="my-2 w-100" color="white">
//                   <CardHeader>Filtro</CardHeader>
//                   <CardBody>
//                     <Row>
//                       <div className="col-sm">
//                         <CardTitle tag="h5">Clave Perfil</CardTitle>
//                         <CardText>
//                           <Input
//                             type="text"
//                             onChange={(e) => {
//                               setFiltroValorMedico(e.target.value);
//                               if (e.target.value === "") {
//                                 getPerfilModulos();
//                               }
//                             }}
//                           ></Input>
//                         </CardText>
//                       </div>
//                       {/* <div className="col-sm">
//                         <CardTitle tag="h5">Bodega</CardTitle>
//                         <CardText>
//                           <Input
//                             type="text"
//                             onChange={(e) => {
//                               setFiltroValorEmail(e.target.value);
//                             }}
//                           />
//                         </CardText>
//                       </div> */}
//                     </Row>
//                     <br />
//                     <div className="d-flex justify-content-end">
//                       <CButton color="success" onClick={() => filtroEmail(filtroValorMedico)} text="Filtro" />
//                     </div>
//                   </CardBody>
//                 </Card>
//               </div>
//               <Container className="d-flex justify-content-end ">
//                 <Button onClick={handleNavs}>Crear Seguridad</Button>
//               </Container>
//             </Container>
//             <br />
//             <br />
//             <TablePerfilesModulos
//               DataTableHeader={DataTableHeader}
//               data={data}
//               eliminar={eliminar}
//               mostrarModalActualizar={mostrarModalActualizar}
//             ></TablePerfilesModulos>
//           </Col>
//         </Row>
//       </Container>

//       <Modal isOpen={modalActualizar} size="xl">
//         <ModalHeader>
//           <div>
//             <h3>Editar Seguridad</h3>
//           </div>
//         </ModalHeader>

//         <ModalBody>
//           <FormGroup>
//             <Row>
//               <Col md="6" className="mb-4">
//                 <Label>Clave de perfil</Label>
//                 <Input type="select" name="clave_perfil" id="exampleSelect" value={form.clave_perfil} onChange={handleChange}>
//                   {dataPerfiles.map((perfil) => (
//                     <option key={perfil.clave_perfil} value={Number(perfil.clave_perfil)}>
//                       {perfil.descripcion_perfil}
//                     </option>
//                   ))}
//                 </Input>
//               </Col>
//               <Col md="6">
//                 <Label>Modulo</Label>
//                 <Input type="select" name="modulo" id="exampleSelect" value={form.modulo} onChange={handleChange}>
//                   {data.map((perfil) => (
//                     <option key={perfil.modulo} value={perfil.modulo}>
//                       {perfil.d_modulo}
//                     </option>
//                   ))}
//                 </Input>
//               </Col>
//               <Col md="6">
//                 <Label style={{ marginRight: 25 }}>Permiso</Label>
//                 <Input type="checkbox" name="permiso" checked={form.permiso} onChange={handleChange}></Input>
//               </Col>
//             </Row>
//           </FormGroup>
//         </ModalBody>

//         <ModalFooter>
//           <CButton color="primary" onClick={() => editar(form)} text="Editar" />
//           <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalInsertar}>
//         <ModalHeader>
//           <div>
//             <h3>Insertar Personaje</h3>
//           </div>
//         </ModalHeader>
//         <ModalBody>
//           <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" />
//           <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" />
//           <CFormGroupInput handleChange={handleChange} inputName="idClinica" labelName="Id Clinica:" />
//         </ModalBody>
//         <ModalFooter>
//           <CButton color="primary" onClick={() => insertar()} text="Insertar" />
//           <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
//         </ModalFooter>
//       </Modal>
//     </>
//   );
// }

// export default PerfilesModulos;


import React, { useState, useEffect } from "react";
import { MdInventory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Row, Container, Col, Card, CardHeader, CardBody, CardTitle, CardText, Input, Table, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Label } from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import TablePerfilesModulos from "./components/TablePerfilesModulos";
import { Perfil_Modulo } from "../../models/Perfil_Modulo";
import { usePerfiles } from "../../hooks/getsHooks/useClavePerfil";
///NUEVAS IMPORTACIONES 
import { useModulos } from "../../hooks/getsHooks/useModulos";
import { Modulo } from "../../models/Modulo";
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
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
// import { GrSecures } from "react-icons/gr";


function PerfilesModulos() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } = useModalHook();
  const { filtroSeguridad, session } = useSeguridad();
  const { dataModulos } = useModulos();
  const [data, setData] = useState<Perfil_Modulo[]>([]);
  const { dataPerfiles } = usePerfiles();
  const [form, setForm] = useState<Perfil_Modulo>({
    clave_perfil: 1,
    modulo: 1,
    permiso: false,
    d_perfil: "",
  });

  const DataTableHeader = ["Clave Perfil", "Modulo", "Permisos", "Acciones"];

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Perfil_Modulo)[] = ["clave_perfil", "modulo"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Perfil_Modulo) => {
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



  ////////MÓDULO AGREGAR SEGURIDAD
  // const [visible, setVisible] = useState(false);
  // const [dataText, setDataText] = useState("");

  // const insertar = () => {
  //   jezaApi
  //     .post("/PerfilModulo", null, {
  //       params: {
  //         clave_perfil: Number(form.clave_perfil),
  //         modulo: Number(form.modulo),
  //         permiso: form.permiso,
  //       },
  //     })
  //     .then((response) => {
  //       setVisible(true);
  //       setDataText(response.data.mensaje1);
  //       setModalInsertar(false);
  //     })
  //     .catch((error) => {
  //       // Handle error here
  //       console.log(error);
  //     });
  // };

  ////////MODULO EDITAR SEGURIDAD 

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
        .post("/PerfilModulo", null, {
          params: {
            clave_perfil: Number(form.clave_perfil),
            modulo: Number(form.modulo),
            permiso: form.permiso,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Permiso creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getPerfilModulos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  // const editar = (dato: Perfil_Modulo) => {
  //   jezaApi
  //     .put(`/PerfilModulo`, null, {
  //       params: {
  //         id: Number(dato.id),
  //         clave_perfil: Number(dato.clave_perfil),
  //         modulo: Number(dato.modulo),
  //         permiso: dato.permiso,
  //       },
  //     })
  //     .then((response) => {
  //       getPerfilModulos();
  //     })
  //     .catch((e) => console.log(e));
  //   setModalActualizar(false);
  // };

  ////////MÓDULO ELIMINAR SEGURIDAD

  ///AQUI COMIENZA EL MÉTODO PUT PARA ACTUALIZACIÓN DE CAMPOS
  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/PerfilModulo`, null, {
          params: {
            id: form.id,
            clave_perfil: form.clave_perfil,
            modulo: form.modulo,
            permiso: form.permiso,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Permiso actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getPerfilModulos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };


  // const eliminar = (dato: any) => {
  //   const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
  //   if (opcion) {
  //     jezaApi.delete(`/PerfilModulo?id=${dato.id}`).then(() => {
  //       setModalActualizar(false);
  //       setTimeout(() => {
  //         getPerfilModulos();
  //       }, 1000);
  //     });
  //   }
  // };
  const eliminar = async (dato: Perfil_Modulo) => {
    const permiso = await filtroSeguridad("CAT_SUC_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el perfil ${dato.d_perfil} con la seguridad en el módulo: ${dato.d_modulo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/PerfilModulo?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getPerfilModulos();
        });
      }
    });
  };

  const getPerfilModulos = () => {
    jezaApi
      .get("PerfilModulo?id=0")
      .then((response) => setData(response.data))
      .catch((e) => console.log(e));
  };

  const getModulos = () => {
    jezaApi
      .get("PerfilModulo?id=0")
      .then((response) => setData(response.data))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getPerfilModulos();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "permiso") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: Perfil_Modulo) => ({ ...prevState, [name]: value }));
    }
    console.log(form);
  };

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
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
    setForm({ id: 0, clave_perfil: 0, modulo: 0, permiso: false });
  };


  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    { field: "clave_perfil", headerName: "Clave perfil", flex: 1, headerClassName: "custom-header" },
    { field: "d_perfil", headerName: "Perfil", flex: 1, headerClassName: "custom-header" },
    {
      field: "modulo", headerName: "Módulo", flex: 1, headerClassName: "custom-header",
      renderCell: (params) => <span> {getSeguridadForeignKey(params.row.id)} </span>,
    },
    {
      field: "Permisos",
      renderCell: (params) => <ComponentPermiso params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

  ];

  const ComponentPermiso = ({ params }: { params: any }) => {
    return (
      <>
        <input type="checkbox" checked={params.row} disabled />

      </>
    );
  };

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => eliminar(params.row)} size={23}></AiFillDelete>
      </>
    );
  };


  const getSeguridadForeignKey = (idTableSeguridad: number) => {
    const modulo = data.find((modulo: Perfil_Modulo) => modulo.id === idTableSeguridad);
    return modulo ? modulo.d_modulo : "Sin seguridad";
  };


  function DataTable() {
    return (
      <div style={{ height: 800, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id}
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
          <h1>Seguridad</h1>
          {/* <GrSecures size={30} /> */}

        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
        <br />
        <br />
        <br />
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
            Crear seguridad
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

      </Container>


      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar seguridad</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="6" className="mb-4">
                <Label>Perfil:</Label>
                <Input type="select" name="clave_perfil" id="exampleSelect" value={form.clave_perfil} onChange={handleChange}>
                  <option value={0}>--Selecciona una opción--</option>
                  {dataPerfiles.map((perfil) => (
                    <option key={perfil.clave_perfil} value={Number(perfil.clave_perfil)}>
                      {perfil.descripcion_perfil}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md="6">
                <Label>Módulo:</Label>
                <Input type="select" name="modulo" id="exampleSelect" value={form.modulo} onChange={handleChange}>
                  <option value={0}>--Selecciona una opción--</option>
                  {data.map((perfil) => (
                    <option key={perfil.modulo} value={perfil.modulo}>
                      {perfil.d_modulo}
                    </option>
                  ))}
                </Input>
                <br />
              </Col>

              <Col md="12">
                <Label style={{ marginRight: 25 }}>Asignar permiso</Label>
                <Input type="checkbox" name="permiso" onChange={handleChange}></Input>
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" onClick={() => editar(form)} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Crear permiso</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container className="px-2">
            <FormGroup>
              <Row>
                <Col md="12" className="mb-4">
                  <Label>Perfil: </Label>
                  <Input type="select" name="clave_perfil" id="clave_perfil" value={form.clave_perfil} onChange={handleChange}>
                    <option value={0}>--Selecciona una opción--</option>
                    {dataPerfiles.map((perfil) => (
                      <option key={perfil.clave_perfil} value={Number(perfil.clave_perfil)}>
                        {perfil.descripcion_perfil}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col md="12">
                  <Label>Módulo:</Label>
                  <Input type="select" name="modulo" id="exampleSelect" value={form.modulo} onChange={handleChange}>
                    <option value={0}>--Selecciona una opción--</option>
                    {dataModulos.map((modulo: Modulo) => (
                      <option key={modulo.id} value={Number(modulo.id)}>
                        {modulo.descripcion}
                      </option>
                    ))}
                  </Input>
                  <br />
                </Col>
                <Col md="12">
                  <Label style={{ marginRight: 25 }}>Asignar permiso</Label>
                  <Input type="checkbox" name="permiso" onChange={handleChange}></Input>
                </Col>
              </Row>
            </FormGroup>
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={() => insertar()} text="Guardar permiso" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default PerfilesModulos;
