import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { MdInventory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Row, Container, Col, Card, InputGroup, Alert, Input, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import TableCias from "./Components/TableCias";
import { Cia } from "../../models/Cia";
import AlertComponent from "../../components/AlertComponent";
import { Link } from "react-router-dom"; // Si estás utilizando React Router
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";

function Cias() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [data, setData] = useState<Cia[]>([]);
  const [form, setForm] = useState<Cia>({
    id: 0,
    nombre: "",
    rfc: "",
    domicilio: "",
    regimenFiscal: "",
    cpFiscal: "",
  });

  // const DataTableHeader = ["Empresa", "Domicilio", "Código postal", "Régimen fiscal", "RFC", "Acciones"];
  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Cia)[] = ["nombre", "rfc", "domicilio", "regimenFiscal", "cpFiscal"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Cia) => {
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

  const [creado, setVisible1] = useState(false);

  // const insertar = () => {
  //   jezaApi
  //     .post("/Cia", null, {
  //       params: {
  //         nombre: form.nombre,
  //         rfc: form.rfc,
  //         domicilio: form.domicilio,
  //         regimenFiscal: form.regimenFiscal,
  //         cpFiscal: form.cpFiscal },
  //     })
  //     .then(() => {
  //       setVisible1(true);
  //       setModalInsertar(false)
  //       getCias();
  //     })

  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   setTimeout(() => {
  //     setVisible1(false);
  //   }, 3000);

  // };

  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_EMPRE_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Cia", null, {
          params: {
            nombre: form.nombre,
            rfc: form.rfc,
            domicilio: form.domicilio,
            regimenFiscal: form.regimenFiscal,
            cpFiscal: form.cpFiscal,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Empresa creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getCias();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_EMPRE_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Cia`, null, {
          params: {
            id: form.id,
            nombre: form.nombre,
            rfc: form.rfc,
            domicilio: form.domicilio,
            regimenFiscal: form.regimenFiscal,
            cpFiscal: form.cpFiscal,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Empresa actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getCias();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };
  // const eliminar = (dato: Cia) => {
  //   const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
  //   if (opcion) {
  //     jezaApi
  //       .delete(`/Cia?id=${dato.id}`)
  //       .then((response) => {
  //         console.log(response);
  //         setVisible3(true);
  //         getCias();
  //         setTimeout(() => {
  //           setVisible3(false);
  //         }, 3000);
  //       })
  //       .catch(() => setVisible4(true))
  //   }
  // };

  const eliminar = async (dato: Cia) => {
    const permiso = await filtroSeguridad("CAT_EMPRE_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar la empresa: ${dato.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Cia?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getCias();
        });
      }
    });
  };

  const getCias = () => {
    jezaApi
      .get("/Cia?id=0")
      .then((response) => setData(response.data))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getCias();
  }, []);

  const filtroEmail = (datoDescripcion: string) => {
    var resultado = data.filter((elemento: Cia) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if (
        (datoDescripcion === "" || elemento.nombre.toLowerCase().includes(datoDescripcion.toLowerCase())) &&
        // (datoMedico === "" || elemento.almacen.toLowerCase().includes(datoMedico.toLowerCase())) &&
        elemento.nombre.length > 2
      ) {
        return elemento;
      }
    });
    setData(resultado);
  };

  const LimpiezaForm = () => {
    setForm({ id: 1, nombre: "", rfc: "", domicilio: "", regimenFiscal: "", cpFiscal: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };
  // Crear empresa
  // const handleNavs = () => {
  //   navigate("/CiasCrear");
  // };

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleReload = () => {
    window.location.reload(); // Recargar la página actual
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
    { field: "rfc", headerName: "RFC", width: 250, headerClassName: "custom-header" },
    {
      field: "domicilio",
      headerName: "Domicilio",
      width: 250,
      headerClassName: "custom-header",
    },
    {
      field: "regimenFiscal",
      headerName: "Régimen fiscal",
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

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app"); // Redirige a la ruta "/app"
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Empresas </h1>
          <BsBuildingAdd size={30}></BsBuildingAdd>
        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
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
            Crear empresa
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

      {/*  AQUÍ EMPIEZA EL MODAL CREAR EMPRESA */}
      <Modal isOpen={modalInsertar} size="xl">
        <ModalHeader>
          <div>
            <h3>Crear empresa</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" value={form.nombre} />
              </Col>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="rfc" labelName="RFC:" value={form.rfc} />
              </Col>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="domicilio" labelName="Domicilio:" value={form.domicilio} />
              </Col>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="regimenFiscal" labelName="Régimen fiscal:" value={form.regimenFiscal} />
              </Col>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="cpFiscal" labelName="Código postal:" value={form.cpFiscal} />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" text="Guardar empresa" onClick={insertar} />
          <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      {/*  AQUÍ EMPIEZA EL MODAL CREAR ACTUALIZAR */}

      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar empresa</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" value={form.nombre} />
              </Col>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="rfc" labelName="RFC:" value={form.rfc} />
              </Col>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="domicilio" labelName="Domicilio:" value={form.domicilio} />
              </Col>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="regimenFiscal" labelName="Régimen fiscal:" value={form.regimenFiscal} />
              </Col>
              <Col md="6">
                <CFormGroupInput handleChange={handleChange} inputName="cpFiscal" labelName="Código postal:" value={form.cpFiscal} />
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

export default Cias;
