import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit, AiFillStop, AiFillPushpin } from "react-icons/ai";
import { MdInventory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  Row,
  InputGroup,
  Container,
  Col,
  Card,
  Alert,
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
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Sucursal } from "../../models/Sucursal";
import TableSucursal from "./components/TableSucursal";
import { Cia } from "../../models/Cia";
import AlertComponent from "../../components/AlertComponent";
import { useCias } from "../../hooks/getsHooks/useCias";
// import { IoIosHome, IoIosRefresh } from "react-icons/io";
// import Button from '@mui/material/Button';
// import ButtonGroup from '@mui/material/ButtonGroup';
import { useReactToPrint } from "react-to-print";
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
import { MetasCol } from "../../models/MetasCol";
import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";
import { Trabajador } from "../../models/Trabajador";

function Metas() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();

  const [data, setData] = useState<MetasCol[]>([]);
  const { dataCias, fetchCias } = useCias();
  const { dataTrabajadores, fetchNominaTrabajadores } = useNominaTrabajadores();

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
  });

  const mostrarModalActualizar = (dato: any) => {
    setForm(dato);
    setModalActualizar(true);
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<Number[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof MetasCol)[] = ["año", "mes", "idcolabolador"];
    const camposVacios: Number[] = [];

    camposRequeridos.forEach((campo: keyof MetasCol) => {
      const fieldValue = form[campo];
      if (!fieldValue || Number(fieldValue).trim() === 0) {
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
  const insertar = async () => {
    // const permiso = await filtroSeguridad("CAT_SUC_ADD");
    // if (permiso === false) {
    //   return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    // }

    // if (validarCampos() === true) {
    await jezaApi
      .post(
        `/sp_cat_colaboradoresMetasAdd?año=${form.año}&mes=${form.mes}&idcolabolador=${form.idcolabolador}&meta1=${form.meta1}&meta2=${form.meta2}&meta3=${form.meta3}&meta4=${form.meta4}&meta5=${form.meta5}&meta6=${form.meta6}`
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
      });
    // } else {
    // }
  };

  ///AQUI COMIENZA EL MÉTODO PUT PARA ACTUALIZACIÓN DE CAMPOS
  const editar = async () => {
    // const permiso = await filtroSeguridad("CAT_SUC_UPD");
    // if (permiso === false) {
    //   return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    // }
    // if (validarCampos() === true) {
    await jezaApi
      .put(
        `/sp_cat_colaboradoresMetasUpd?id=${form.id}&año=${form.año}&mes=${form.mes}&idcolabolador=${form.idcolabolador}&meta1=${form.meta1}&meta2=${form.meta2}&meta3=${form.meta3}&meta4=${form.meta4}&meta5=${form.meta5}&meta6=${form.meta6}`
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
      });
    // } else {
    // }
  };

  ///AQUÍ COMIENZA EL MÉTODO DELETE

  const eliminar = async (dato: MetasCol) => {
    const permiso = await filtroSeguridad("CAT_SUC_DEL");
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
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
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
    });
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      width: 120,
      headerClassName: "custom-header",
    },
    {
      field: "año",
      headerName: "Año",
      width: 150,
      headerClassName: "custom-header",
      // renderCell: (params) => <span> {getCiaForeignKey(params.row.cia)} </span>,
    },

    { field: "mes", headerName: "Mes", width: 350, headerClassName: "custom-header" },
    {
      field: "idcolabolador",
      headerName: "Colaborador",
      width: 200,
      headerClassName: "custom-header",
    },
    {
      field: "meta1",
      headerName: "Meta",
      width: 150,
      headerClassName: "custom-header",
    },
    {
      field: "meta2",
      headerName: "Meta 2",
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
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1>
            {" "}
            Metas<HiBuildingStorefront size={35}></HiBuildingStorefront>
          </h1>
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
            Crear meta
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
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="mes" labelName="Mes:" value={form.mes} />
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
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta1" labelName="Meta 1:" value={form.meta1} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta2" labelName="Meta 2:" value={form.meta2} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta3" labelName="Meta 3:" value={form.meta3} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta4" labelName="Meta 4:" value={form.meta4} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta5" labelName="Meta 5:" value={form.meta5} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta6" labelName="Meta 6:" value={form.meta6} />
              </Col>
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
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta1" labelName="Meta 1:" value={form.meta1} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta2" labelName="Meta 2:" value={form.meta2} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta3" labelName="Meta 3:" value={form.meta3} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta4" labelName="Meta 4:" value={form.meta4} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta5" labelName="Meta 5:" value={form.meta5} />
              </Col>
              <Col md={"6"}>
                <CFormGroupInput handleChange={handleChange} inputName="meta6" labelName="Meta 6:" value={form.meta6} />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertar} text="Guardar meta" />
          <CButton color="danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Metas;
