import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Row, Container, Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Form, Input, Label } from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Sucursal } from "../../models/Sucursal";
import { useCias } from "../../hooks/getsHooks/useCias";
import Swal from "sweetalert2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useAnticipos } from "../../hooks/getsHooks/useAnticipo";
import { AnticipoGet } from "../../models/Anticipo";
import { UserResponse } from "../../models/Home";
import { format } from "date-fns";
import TableCliente from "../ventas/Components/TableCliente";
import { useClientes } from "../../hooks/getsHooks/useClientes";
import TableClienteAnticipos from "../ventas/Components/TableClienteAnticipos";

function Anticipo() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const { dataClientes, fetchClientes } = useClientes();
  const { dataAnticipos, fetchAnticipos } = useAnticipos();
  const [modalCliente, setModalCliente] = useState(false);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ parsedItem });
    }
  }, []);
  const [data, setData] = useState<Sucursal[]>([]);
  const { dataCias, fetchCias } = useCias();

  const [form, setForm] = useState<AnticipoGet>({
    id: 0,
    caja: 0,
    cia: 0,
    fecha: "",
    fechaMovto: "",
    idCliente: 0,
    idUsuario: 0,
    importe: 0,
    no_venta: 0,
    nombreCia: "",
    nombreSuc: "",
    nombreUsr: "",
    observaciones: "",
    referencia: "",
    sucursal: 0,
    tipoMovto: 0,
    d_cliente: "",
  });

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);
  const currentDate = new Date();

  // Formatea la fecha actual en el formato deseado (20230726)
  const formattedDate = format(currentDate, "yyyyMMdd");

  const validarCampos = () => {
    const camposRequeridos: (keyof AnticipoGet)[] = ["idCliente", "referencia", "importe", "observaciones"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof AnticipoGet) => {
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

  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .post("/Anticipo", null, {
          params: {
            cia: 26,
            sucursal: dataUsuarios2[0]?.sucursal,
            caja: 1,
            fecha: form.fechaMovto.replace(/-/g, ""),
            fechaMovto: formattedDate,
            idCliente: form.idCliente,
            idUsuario: dataUsuarios2[0]?.id,
            referencia: form.referencia,
            importe: form.importe,
            observaciones: form.observaciones,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Anticipo creada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          fetchAnticipos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  ///AQUI COMIENZA EL MÉTODO PUT PARA ACTUALIZACIÓN DE CAMPOS
  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_SUC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Anticipo`, null, {
          params: {
            id: 2,
            fechamovto: "20230725",
            observaciones: "alguna",
            referencia: "alguna",
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Anticipo actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          fetchAnticipos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  ///AQUÍ COMIENZA EL MÉTODO DELETE
  const eliminar = async (dato: AnticipoGet) => {
    const permiso = await filtroSeguridad("CAT_SUC_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el anticipo?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Anticipo?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          fetchAnticipos();
        });
      }
    });
  };

  //AQUI COMIENZA EL MÉTODO GET PARA VISUALIZAR LOS REGISTROS
  const getSucursal = () => {
    jezaApi
      .get("/Sucursal?id=0")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getSucursal();
  }, []);

  const filtroEmail = (datoMedico: string) => {
    var resultado = data.filter((elemento: any) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if ((datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.nombre.length > 2) {
        return elemento;
      }
    });
    setData(resultado);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "en_linea" || name === "es_bodega") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: AnticipoGet) => ({ ...prevState, [name]: value }));
    }
    console.log(form);
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
    setForm({ ...form, id: 0 });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 1, // Ancho flexible
      minWidth: 120, // Ancho mínimo
      headerClassName: "custom-header",
    },
    // { field: "sucursal", headerName: "ID", width: 200, headerClassName: "custom-header", },
    {
      field: "importe",
      headerName: "Importe",
      flex: 1, // Ancho flexible
      minWidth: 150, // Ancho mínimo
      width: 150,
      headerClassName: "custom-header",
    },
    {
      field: "referencia",
      headerName: "Referencia",
      flex: 1, // Ancho flexible
      minWidth: 150, // Ancho mínimo
      width: 150,
      headerClassName: "custom-header",
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 1, // Ancho flexible
      minWidth: 150, // Ancho mínimo
      width: 150,
      headerClassName: "custom-header",
    },
    {
      field: "fecha",
      headerName: "Fecha de movimientos",
      flex: 1, // Ancho flexible
      minWidth: 150, // Ancho mínimo

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
    const getRowId = (row: AnticipoGet) => row.id;
    return (
      <div className="table-responsive" style={{ height: "59%", overflow: "auto" }}>
        <div style={{ height: "100%", display: "table", tableLayout: "fixed", width: "100%" }}>
          <DataGrid
            rows={dataAnticipos}
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
  const handleOpenNewWindow = () => {
    const url = "https://www.example.com"; // Reemplaza esto con la URL que desees abrir
    const width = 600;
    const height = 500;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;

    // Open the new window
    window.open(url, "_blank", features);
  };
  const mostrarModalClienteActualizar = () => {
    setModalCliente(true);
  };
  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        {" "}
        {/* <button onClick={handleOpenNewWindow}>Open New Window</button> */}
        <Row>
          <Col>
            <Container fluid>
              <br />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1> Anticipos </h1>
                <HiBuildingStorefront size={35}></HiBuildingStorefront>
              </div>
              <br />
              <br />
              <Row>
                <div>
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
                      Crear anticipos
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
            </Container>
            <br />
            <br />
            {/* <TableSucursal dataCia={dataCias} DataTableHeader={DataTableHeader} data={data} eliminar={eliminar} mostrarModalActualizar={mostrarModalActualizar} /> */}
            <DataTable></DataTable>
          </Col>
        </Row>
      </Container>

      {/* AQUÍ COMIENZA EL MODAL PARA AGREGAR SUCURSALES */}
      <Modal isOpen={modalActualizar} size="xl">
        <ModalHeader>
          <div>
            <h3>Editar anticipo</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="fechaMovto">Fecha del anticipo</Label>
              <Input type="date" name="fechaMovto" id="fechaMovto" value={form.fechaMovto} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              {/* SELECT */}
              <Label for="idCliente">Cliente</Label>
              <Input disabled type="text" name="d_cliente" id="d_cliente" value={form.d_cliente} onChange={handleChange} />
              <Button onClick={mostrarModalClienteActualizar}>Seleccionar</Button>
            </FormGroup>
            <FormGroup>
              <Label for="referencia">Referencia</Label>
              <Input type="text" name="referencia" id="referencia" value={form.referencia} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="importe">Importe</Label>
              <Input type="number" name="importe" id="importe" value={form.importe} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="observaciones">Observaciones</Label>
              <Input type="text" name="observaciones" id="observaciones" value={form.observaciones} onChange={handleChange} />
            </FormGroup>
          </Form>{" "}
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
            <h3>Crear anticipo</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="fechaMovto">Fecha del anticipo</Label>
              <Input type="date" name="fechaMovto" id="fechaMovto" value={form.fechaMovto} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              {/* SELECT */}
              <Label for="idCliente">Cliente</Label>
              <Input disabled type="text" name="d_cliente" id="d_cliente" value={form.d_cliente} onChange={handleChange} />
              <Button onClick={mostrarModalClienteActualizar}>Seleccionar</Button>
            </FormGroup>
            <FormGroup>
              <Label for="referencia">Referencia</Label>
              <Input type="text" name="referencia" id="referencia" value={form.referencia} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="importe">Importe</Label>
              <Input type="number" name="importe" id="importe" value={form.importe} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="observaciones">Observaciones</Label>
              <Input type="text" name="observaciones" id="observaciones" value={form.observaciones} onChange={handleChange} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar anticipo" />
          <CButton
            color="danger"
            onClick={() => {
              setModalCliente(false);
              console.log(modalCliente);
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalCliente} size="md">
        <ModalHeader> Cliente </ModalHeader>
        <ModalBody>
          <TableClienteAnticipos form={form} setForm={setForm} data={dataClientes} setModalCliente={setModalCliente}></TableClienteAnticipos>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalCliente(false);
              console.log(modalCliente);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Anticipo;
