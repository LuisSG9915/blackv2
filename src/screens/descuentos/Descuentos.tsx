import React, { useState, useEffect } from "react";
import { AiFillMinusSquare, AiFillEdit, AiFillDelete } from "react-icons/ai";
import {
  Row,
  Container,
  Card,
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
  InputGroup,
} from "reactstrap";
import CButton from "../../components/CButton";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useReadHook, { DataClinica } from "../../hooks/useReadHook";
import { useNavigate } from "react-router-dom";
import { jezaApi } from "../../api/jezaApi";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
import TabPerfil from "../TabPerfil";
import { Perfil } from "../../models/Perfil";
import { Descuento } from "../../models/Descuento";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Button, ButtonGroup } from "@mui/material";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Swal from "sweetalert2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import axios from "axios";

function Descuentos() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [filtroValorEmail, setFiltroValorEmail] = useState("");
  const [data, setData] = useState([]);

  const [form, setForm] = useState<Descuento>({
    id: 0,
    descripcion: "",
    min_descto: 0.0,
    max_descto: 0.0,
  });

  const DataTableHeader = ["Descripción", "Minimo descuento", "Máximo descuento", "Acciones"];
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Descuento)[] = ["descripcion", "min_descto", "min_descto"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Descuento) => {
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

  const mostrarModalActualizar = (dato: Descuento) => {
    setForm(dato);
    setModalActualizar(true);
  };
  // const ejecucion = async () => {
  //   await axios
  //     .get("http://cbinfo.no-ip.info:8011/api/movil/Cliente?id=00007")
  //     .then(() => alert("a"))
  //     .catch(() => alert("e"));
  // };
  // useEffect(() => {
  //   ejecucion();
  // }, []);
  const editar = async (dato: any) => {
    const permiso = await filtroSeguridad("CAT_DESCUENTO_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Tipodescuento`, null, {
          params: {
            id: form.id,
            descripcion: form.descripcion,
            min_descto: Number(form.min_descto),
            max_descto: Number(form.max_descto),
          },
        })

        .then(() => getDescuento())
        .catch((e) => console.log(e));
      const arreglo: any[] = [...data];
      const index = arreglo.findIndex((registro) => registro.id === dato.id);
      if (index !== -1) {
        console.log("index");
        setModalActualizar(false);
      }
      Swal.fire({
        icon: "success",
        text: "Sucursal actualizada con éxito",
        confirmButtonColor: "#3085d6",
      });
    } else {
    }
  };

  const eliminar = async (dato: any) => {
    const permiso = await filtroSeguridad("CAT_DESCUENTO_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el registro: ${dato.descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Tipodescuento?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getDescuento();
        });
      }
    });
  };
  const getDescuento = () => {
    jezaApi
      .get("/Tipodescuento?id=0")
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getDescuento();
  }, []);

  const filtroEmail = (datoMedico: string, datoEmail: string) => {
    // var resultado = data.filter((elemento: any) => {
    //   // Aplica la lógica del filtro solo si hay valores en los inputs
    //   if (
    //     (datoEmail === "" || elemento.email.toLowerCase().includes(datoEmail.toLowerCase())) &&
    //     (datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) &&
    //     elemento.nombre.length > 2
    //   ) {
    //     return elemento;
    //   }
    // });
    // setData(resultado);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params) => (
        <>
          <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row as Descuento)} size={23}></AiFillEdit>
          <AiFillDelete color="lightred" onClick={() => eliminar(params.row as Descuento)} size={23}></AiFillDelete>
        </>
      ),
    },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    { field: "min_descto", headerName: "Minimo descuento", flex: 1 },
    { field: "max_descto", headerName: "Máximo descuento", flex: 1 },
  ];

  const rows: GridRowsProp = data.map((dato) => ({
    id: dato.id,
    descripcion: dato.descripcion,
    min_descto: dato.min_descto,
    max_descto: dato.max_descto,
  }));

  // Redirige a la ruta "/app"
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };

  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_DESCUENTO_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Tipodescuento", null, {
          params: {
            descripcion: form.descripcion,
            min_descto: form.min_descto,
            max_descto: form.max_descto,
          },
        })
        .then(() => {
          Swal.fire({
            icon: "success",
            text: "Descuento creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getDescuento();
        });
    } else {
    }
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "", gap: 10 }}>
          <h1> Descuentos autorizados </h1>
          <AiFillMinusSquare size={30} />
        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
        <br />
        <Container className="d-flex  ">
          <Row>
            <div>
              {/* <InputGroup style={{ width: "300px", marginLeft: "auto" }}>
                <Input
                  placeholder="Buscar por sucursal..."
                  type="text"
                  onChange={(e) => {
                    setFiltroValorMedico(e.target.value);
                    if (e.target.value === "") {
                      getSucursal();
                    }
                  }}
                />
                <CButton color="secondary" onClick={() => filtroEmail(filtroValorMedico)} text="Buscar" />
              </InputGroup> */}
              <br />
              <br />

              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button
                  style={{ marginLeft: "auto" }}
                  color="success"
                  onClick={() => {
                    setModalInsertar(true);
                    // setEstado("insert");
                    // LimpiezaForm();
                  }}
                >
                  Crear descuento
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
          {/* <CButton color="success" onClick={() => handleNav()} text="Crear descuento autorizado" /> */}
        </Container>
        <br />
        <br />

        <div style={{ height: 400, width: "100%", tableLayout: "fixed" }}>
          <DataGrid rows={rows} columns={columns} />
        </div>
      </Container>

      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div>
            <h3>Editar descuento</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripción:" defaultValue={form.descripcion} />
            <CFormGroupInput handleChange={handleChange} inputName="min_descto" labelName="Minimo de descuento:" defaultValue={form.min_descto} />
            <CFormGroupInput handleChange={handleChange} inputName="max_descto" labelName="Máximo de descuento:" defaultValue={form.max_descto} />
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              editar(form);
              getDescuento();
            }}
            text="Actualizar"
          />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar} about="">
        <ModalHeader>
          <div>
            <h3>Crear descuento</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName=" Descripción:" />
            <CFormGroupInput handleChange={handleChange} inputName="min_descto" labelName=" Minimo descuento:" />
            <CFormGroupInput handleChange={handleChange} inputName="max_descto" labelName=" Máximo descuento:" />
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={() => insertar()} text="Guardar descuento"></CButton>
          <CButton color="danger" onClick={() => setModalInsertar(false)} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Descuentos;
