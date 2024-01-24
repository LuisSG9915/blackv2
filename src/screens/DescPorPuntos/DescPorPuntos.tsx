import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
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
  Label,
} from "reactstrap";
import CButton from "../../components/CButton";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { useNavigate } from "react-router-dom";
// import { jezaApi } from "../../api/jezaApi";
import useModalHook from "../../hooks/useModalHook";
import { DescPorPunto } from "../../models/DescPorPunto";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Sucursal } from "../../models/Sucursal";
import { useFormasPagos } from "../../hooks/getsHooks/useFormasPagos";
import { FormaPago } from "../../models/FormaPago";
import { useAreas } from "../../hooks/getsHooks/useAreas";
import { useDeptos } from "../../hooks/getsHooks/useDeptos";
import { Departamento } from "../../models/Departamento";
import { useCias } from "../../hooks/getsHooks/useCias";
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { ImGift } from "react-icons/im";
import { Cia } from "../../models/Cia";
import { UserResponse } from "../../models/Home";
import JezaApiService from "../../api/jezaApi2";

function DescPorPuntos() {
  const { jezaApi } = JezaApiService();
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_DescPorPuntos_view`);

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

  const {
    modalActualizar,
    modalInsertar,
    setModalInsertar,
    setModalActualizar,
    cerrarModalActualizar,
    cerrarModalInsertar,
    mostrarModalInsertar,
  } = useModalHook();

  const [data, setData] = useState([]);
  const [dataDeptosFiltrado, setDataDeptosFiltrado] = useState<Departamento[]>([]);
  const { dataCias } = useCias();
  const { dataSucursales } = useSucursales();
  const { dataFormasPagos } = useFormasPagos();
  const { dataAreas } = useAreas();
  const { dataDeptos } = useDeptos();
  const [dataCia, setDataCia] = useState<Cia[]>([]);

  const [form, setForm] = useState<DescPorPunto>({
    id: 0,
    cia: 0,
    area: 0,
    depto: 0,
    forma_pago: 0,
    sucursal: 0,
    porcentaje_puntos: 0,
  });

  const DataTableHeader = ["Sucursal", "Area", "Departamento", "Forma de pago", "Porcentaje", "acciones"];

  const mostrarModalActualizar = (dato: DescPorPunto) => {
    setForm(dato);
    setModalActualizar(true);
  };

  // const editar = (dato: any) => {
  //   jezaApi
  //     .put(`/DeptosPuntos`, null, {
  //       /* <-----------------------------------------------------------------------------------------API EDITAR */
  //       params: {
  //         id: form.id,
  //         cia: form.cia,
  //         area: form.area,
  //         depto: form.depto,
  //         forma_pago: form.forma_pago,
  //         sucursal: form.sucursal,
  //         porcentaje_puntos: form.porcentaje_puntos,
  //       },
  //     })
  //     .then(() => {
  //       getDesucentos();
  //     })
  //     .catch((e) => console.log(e));
  //   const arreglo: any[] = [...data];
  //   const index = arreglo.findIndex((registro) => registro.id === dato.id);
  //   if (index !== -1) {
  //     console.log("index");
  //     setModalActualizar(false);
  //   }
  // };

  // const eliminar = (dato: DescPorPunto) => {
  //   console.log(dato);
  //   const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
  //   if (opcion) {
  //     jezaApi.delete(`/DeptosPuntos?id=${dato.id}`).then(() => {
  //       setModalActualizar(false);
  //       getDesucentos();
  //     });
  //   }
  // };

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_PUNTOSDESC_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/DeptosPuntos`, null, {
          params: {
            id: form.ID,
            cia: form.cia,
            sucursal: form.sucursal,
            area: form.area,
            depto: form.depto,
            forma_pago: form.forma_pago,
            porcentaje_puntos: form.porcentaje_puntos,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Descuento actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          getDesucentos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const getDesucentos = () => {
    jezaApi
      .get("/DeptosPuntos?id=0")
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getDesucentos();
  }, []);

  // const insertar = () => {
  //   jezaApi
  //     .post("/DeptosPuntos", null, {
  //       params: {
  //         cia: form.cia,
  //         area: form.area,
  //         depto: form.depto,
  //         forma_pago: form.forma_pago,
  //         sucursal: form.sucursal,
  //         porcentaje_puntos: form.porcentaje_puntos,
  //       },
  //     })
  //     .then((r) => {
  //       console.log("exitoso");
  //       console.log(r);
  //     })
  //     .catch((e) => console.log(e));
  //   setModalInsertar(false);
  // };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof DescPorPunto)[] = ["sucursal", "area", "depto", "forma_pago", "porcentaje_puntos"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof DescPorPunto) => {
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

  // AQUÍ COMIENZA MI MÉTODO PUT PARA AGREGAR ALMACENES
  const insertar = async () => {
    const permiso = await filtroSeguridad("CAT_PUNTOSDESC_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/DeptosPuntos", null, {
          params: {
            cia: form.cia,
            area: form.area,
            depto: form.depto,
            forma_pago: form.forma_pago,
            sucursal: form.sucursal,
            porcentaje_puntos: form.porcentaje_puntos,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Descuento por puntos creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          getDesucentos();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const eliminar = async (dato: DescPorPunto) => {
    const permiso = await filtroSeguridad("CAT_PUNTOSDESC_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el descuento: ${dato.porcentaje_puntos}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/DeptosPuntos?id=${dato.ID}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          getDesucentos();
        });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const quePedo = dataDeptos.filter((data) => data.area === Number(form.area));
    setDataDeptosFiltrado(quePedo);
    console.log({ dataDeptosFiltrado });
  }, [form.area]);

  // Redirige a la ruta "/app"
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    { field: "cia", headerName: "Empresa", flex: 1, headerClassName: "custom-header" },
    { field: "sucursal", headerName: "Sucursal", flex: 1, headerClassName: "custom-header" },
    { field: "area", headerName: "Área", flex: 1, headerClassName: "custom-header" },
    { field: "depto", headerName: "Departamento", flex: 1, headerClassName: "custom-header" },
    { field: "forma_pago", headerName: "Forma de pago", flex: 1, headerClassName: "custom-header" },
    { field: "porcentaje_puntos", headerName: "Porcentaje ", flex: 1, headerClassName: "custom-header" },
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
      <div style={{ height: 300, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.ID}
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
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Puntos y recompensas</h1>
          <ImGift size={30} />
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
              // setEstado("insert");
              // LimpiezaForm();
            }}
          >
            Crear recompensa
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

      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div>
            <h3>Editar recompensa</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Empresa:</Label>
            <Input type="select" name="cia" id="exampleSelect" value={form.cia} onChange={handleChange}>
              <option value="">Selecciona empresa</option>
              {dataCias.map((cia) => (
                <option key={cia.id} value={cia.id}>
                  {cia.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Sucursal:</Label>
            <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
              <option value="">Seleccione sucursal</option>
              {dataSucursales.map((sucursal) => (
                <option key={sucursal.sucursal} value={sucursal.sucursal}>
                  {sucursal.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="area">Área:</Label>
            <Input type="select" name="area" id="exampleSelect" value={form.area} onChange={handleChange}>
              <option value={0}>Seleccione un área</option>
              {dataAreas.map((area) => (
                <option value={area.area}>{area.descripcion}</option>
              ))}{" "}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="departamento">Departamento:</Label>
            <Input type="select" name="depto" id="exampleSelect" value={form.depto} onChange={handleChange}>
              <option value={0}>Seleccione un departamento</option>
              {dataDeptosFiltrado.map((depto) => (
                <option value={depto.depto}>{depto.descripcion}</option>
              ))}{" "}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="formaPago">Forma de pago:</Label>
            <Input type="select" name="forma_pago" id="exampleSelect" value={form.forma_pago} onChange={handleChange}>
              <option value={0}>Seleccione un departamento</option>
              {dataFormasPagos.map((formaPago: FormaPago) => (
                <option value={formaPago.tipo}> {formaPago.descripcion} </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="Porcentaje">Porcentaje:</Label>
            <Input
              type="number"
              name="porcentaje_puntos"
              id="exampleSelect"
              value={form.porcentaje_puntos}
              onChange={handleChange}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar" />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Crear recompensa</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Empresa:</Label>
            <Input type="select" name="cia" id="exampleSelect" value={form.cia} onChange={handleChange}>
              <option value="">Selecciona empresa</option>
              {dataCias.map((cia) => (
                <option key={cia.id} value={cia.id}>
                  {cia.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Sucursal:</Label>
            <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
              <option value="">Seleccione sucursal</option>
              {dataSucursales.map((sucursal) => (
                <option key={sucursal.sucursal} value={sucursal.sucursal}>
                  {sucursal.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="area">Área:</Label>
            <Input type="select" name="area" id="exampleSelect" value={form.area} onChange={handleChange}>
              <option value={0}>Seleccione un área</option>
              {dataAreas.map((area) => (
                <option value={area.area}>{area.descripcion}</option>
              ))}{" "}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="departamento">Departamento:</Label>
            <Input type="select" name="depto" id="exampleSelect" value={form.depto} onChange={handleChange}>
              <option value={0}>Seleccione un departamento</option>
              {dataDeptosFiltrado.map((depto) => (
                <option value={depto.depto}>{depto.descripcion}</option>
              ))}{" "}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="formaPago">Forma de pago:</Label>
            <Input type="select" name="forma_pago" id="exampleSelect" value={form.forma_pago} onChange={handleChange}>
              <option value={0}>Seleccione un departamento</option>
              {dataFormasPagos.map((formaPago: FormaPago) => (
                <option value={formaPago.tipo}> {formaPago.descripcion} </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="Porcentaje">Porcentaje:</Label>
            <Input
              type="number"
              name="porcentaje_puntos"
              id="exampleSelect"
              value={form.porcentaje_puntos}
              onChange={handleChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar recompensa" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DescPorPuntos;
