import React, { useState, useEffect } from "react";
import { FcPlus } from "react-icons/fc";

import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { ImGift } from "react-icons/im";
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Col,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Marca } from "../../models/Marca";
import { useProductos } from "../../hooks/getsHooks/useProductos";
import { Producto } from "../../models/Producto";
import { Kit } from "../../models/Kit";
import { usePaquetesKits } from "../../hooks/getsHooks/usePaquetesKits";
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
import { useNavigate } from "react-router-dom";

function KitPaquete() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const { dataProductos } = useProductos();
  const [formKit, setFormKit] = useState<any>({
    cantidad: 1,
    idInsumo: 1,
    idProducto: 1,
    d_insumo: "",
    d_kit: "",
    id: 0,
  });
  // const [form, setForm] = useState<Producto>({
  //   fecha_act: "",
  //   fecha_alta: "",
  //   id: 0,
  //   clave_prod: "string",
  //   descripcion: "string",
  //   descripcion_corta: "string",
  //   sucursal_origen: 0,
  //   idMarca: 0,
  //   area: 0,
  //   depto: 0,
  //   clase: 0,
  //   observacion: "string",
  //   inventariable: false,
  //   controlado: false,
  //   es_fraccion: false,
  //   obsoleto: false,
  //   es_insumo: false,
  //   es_servicio: false,
  //   es_producto: false,
  //   es_kit: false,
  //   tasa_iva: 0,
  //   tasa_ieps: 0,
  //   costo_unitario: 0,
  //   precio: 0,
  //   unidad_paq: 0,
  //   unidad_paq_traspaso: 0,
  //   promocion: false,
  //   porcentaje_promocion: 0,
  //   precio_promocion: 0,
  //   fecha_inicio: "string",
  //   fecha_final: "string",
  //   unidad_medida: 0,
  //   clave_prov: 0,
  //   tiempo: 0,
  //   comision: 0,
  //   productoLibre: false,
  //   d_area: "",
  //   d_clase: "",
  //   d_depto: "",
  //   d_proveedor: "",
  //   marca: "",
  // });

  const [form, setForm] = useState<Producto>({
    fecha_act: "",
    fecha_alta: "",
    id: 0,
    clave_prod: "string",
    descripcion: "string",
    descripcion_corta: "string",
    sucursal_origen: 0,
    idMarca: 0,
    area: 0,
    depto: 0,
    clase: 0,
    observacion: "string",
    inventariable: false,
    controlado: false,
    es_fraccion: false,
    obsoleto: false,
    es_insumo: false,
    es_servicio: false,
    es_producto: false,
    es_kit: false,
    tasa_iva: 0,
    tasa_ieps: 0,
    costo_unitario: 0.0,
    precio: 0,
    unidad_paq: 0,
    unidad_paq_traspaso: 0,
    promocion: false,
    porcentaje_promocion: 0,
    precio_promocion: 0,
    fecha_inicio: "string",
    fecha_final: "string",
    unidad_medida: 0,
    clave_prov: 0,
    tiempo: 0,
    comision: 0,
    productoLibre: false,
    d_area: "",
    d_clase: "",
    d_depto: "",
    d_proveedor: "",
    marca: "",
    d_unidadMedida: "",
  });

  const { dataPaquetesKits, fetchPaquetesKits } = usePaquetesKits(form);

  const [filteredData, setFilteredData] = useState([]);
  const [modalKit, setModalKit] = useState(false);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [filteredDataFalse, setFilteredDataFalse] = useState([]);

  const [filtroValorMedico, setFiltroValorMedico] = useState("");

  const [datos, setDatos] = useState([]);

  const DataTableHeader = ["Clave", "Descripción", "Costo", "Acciones"];
  const DataTableHeaderkit = ["Clave", "Producto", "Cantidad", "Acciones"];
  const DataInsumoHeader = ["Clave", "Producto", "Acciones"];

  const mostrarModalActualizar = (dato: Producto) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const editar = () => {
    jezaApi
      .put(`/Kit`, null, {
        params: {
          id: formKit.id,
          idProducto: formKit.idProducto,
          idInsumo: formKit.idInsumo,
          cantidad: formKit.cantidad,
        },
      })
      .then(() => {
        console.log("realizado");
        fetchPaquetesKits();
      })
      .catch((e) => console.log(e));
  };
  const eliminar = (dato: any) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el insumo: ${dato.id}`);
    if (opcion) {
      jezaApi.delete(`/Kit?id=${dato.id}`).then(() => {
        // setModalActualizar(false);
        fetchPaquetesKits();
      });
    }
  };
  const insertar = () => {
    jezaApi
      .post("/Kit", null, {
        params: {
          idProducto: form.id,
          idInsumo: formKit.id,
          cantidad: Number(formKit.cantidad),
        },
      })
      .then(() => {
        fetchPaquetesKits();
        console.log("realizado");
      })
      .catch((e) => console.log(e));
    setModalInsertar(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "es_insumo") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setFormKit((prevState: any) => ({ ...prevState, [name]: value }));
    }
    console.log(formKit);
  };

  useEffect(() => {
    const filtered = dataProductos.filter((item: Producto) => item.es_kit === true);
    setFilteredData(filtered);

    const filteredFalse = dataProductos.filter((item: Producto) => item.es_kit === false);
    setFilteredDataFalse(filteredFalse);
    console.log(filteredDataFalse);
  }, [dataProductos]);

  const [isInsumoSelected, setIsInsumoSelected] = useState(false);

  const handleInsumoButtonClick = () => {
    setIsInsumoSelected(!isInsumoSelected);
  };

  // // Redirige a la ruta "/app"
  // const navigate = useNavigate();
  // const handleRedirect = () => {
  //   navigate("/app");
  // };
  // Recargar la página actual

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    { field: "clave_prod", headerName: "Clave producto", flex: 1, headerClassName: "custom-header" },
    { field: "descripcion", headerName: "Descripción", flex: 1, headerClassName: "custom-header" },
    { field: "costo_unitario", headerName: "Precio", flex: 1, headerClassName: "custom-header" },
  ];

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <FcPlus className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={30}></FcPlus>
        {/* <AiFillDelete color="lightred" onClick={() => eliminar(params.row)} size={23}></AiFillDelete> */}
        {/* <AiFillDelete color="lightred" onClick={() => console.log(params.row.id)} size={23}></AiFillDelete> */}
      </>
    );
  };

  function DataTable() {
    return (
      <div style={{ height: 300, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={filteredData}
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

  // const LimpiezaForm = () => {
  //   setForm({ cia: 0, sucursal: 0, almacen: 0, descripcion: "" });
  // };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Paquetes y kit de descarga</h1>
          <ImGift size={30}></ImGift>
        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
        <br />
        <br />
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          {/* <Button
            style={{ marginLeft: "auto" }}
            color="success"
            onClick={() => {
              setModalInsertar(true);
              // setEstado("insert");
              // LimpiezaForm();
            }}
          >
            Crear kit
          </Button> */}

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

      <Modal isOpen={modalActualizar} size="md" fullscreen={"md"}>
        <ModalHeader>
          <div>
            <h3>Catálogo Kit</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Table size="sm" responsive={true} style={{ width: "100%", margin: "auto" }}>
              <thead>
                <tr>
                  <th>Clave:</th>
                  <th>Producto:</th>
                  <th>Agregar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Input onChange={handleChange} name="marca" defaultValue={form.clave_prod} disabled></Input>
                  </td>
                  <td>
                    <Input onChange={handleChange} name="marca" defaultValue={form.descripcion} disabled></Input>
                  </td>
                  <td>
                    {" "}
                    <FcPlus
                      className="center"
                      size={35}
                      color="success"
                      onClick={() => {
                        setModalKit(true);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
            <br />
            <h5>Insumos agregados al kit: </h5>
            <br />
            <Table size="sm" responsive={true} style={{ width: "100%", margin: "auto" }}>
              <thead>
                <tr>
                  {DataTableHeaderkit.map((valor) => (
                    <th className="" key={valor}>
                      {valor}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataPaquetesKits.map((falsos: Kit) => (
                  <tr>
                    <td>{falsos.id}</td>
                    <td>{falsos.d_insumo}</td>
                    <td>{falsos.cantidad}</td>
                    <td className="gap-5">
                      <AiFillEdit
                        className="mr-2"
                        onClick={() => {
                          setModalEdit(true);
                          setFormKit(falsos);
                          console.log({ falsos });
                        }}
                        size={23}
                      ></AiFillEdit>
                      <AiFillDelete
                        color="lightred"
                        onClick={() => {
                          eliminar(falsos);
                        }}
                        size={23}
                      ></AiFillDelete>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalKit} size="lg">
        <ModalHeader>
          <div>
            <h3>Seleccionar insumos</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Table size="sm" striped={true} responsive={true} style={{ width: "100%", margin: "auto" }}>
            <thead>
              <tr>
                {DataInsumoHeader.map((valor) => (
                  <th className="" key={valor}>
                    {valor}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDataFalse.map((falsos: Producto) => (
                <tr>
                  <td>{falsos.clave_prod}</td>
                  <td>{falsos.descripcion}</td>

                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setModalInsert(true);
                        setFormKit(falsos);
                      }}
                    >
                      Seleccionar
                    </button>
                  </td>
                  {/* <td>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="es_insumo"
                        checked={form.es_insumo}
                        defaultChecked={true}
                        onClick={() => {
                          setModalInsert(true);
                          setFormKit(falsos);
                        }}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <CButton color="btn btn-danger" onClick={() => setModalKit(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsert} size="lg">
        <ModalHeader>
          <div>
            <h3>Agregar insumos</h3>
            {/* <h3>Agregar insumos: {formKit.descripcion}</h3> */}
          </div>
        </ModalHeader>
        <ModalBody>
          <Label> Producto kit:</Label>
          <Input defaultValue={form.descripcion} disabled></Input>
          <br />
          <Label> Insumo agregado: </Label>
          <Input defaultValue={formKit.descripcion} disabled></Input>
          <br />
          <Label> Cantidad: </Label>
          <Input name="cantidad" type="number" onChange={handleChange}></Input>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="success"
            onClick={() => {
              insertar();
              setModalInsert(false);
              setModalKit(false);
            }}
            text="Agregar insumos al kit"
          />
          <CButton color="btn btn-danger" onClick={() => setModalInsert(false)} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit} size="lg">
        <ModalHeader>
          <div>
            <h3>Editar insumo</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label> Producto kit: </Label>
          <Input type="select" name="idProducto" onChange={handleChange}>
            {filteredData.map((producto: Producto) => (
              <option value={producto.id}>{producto.descripcion}</option>
            ))}
          </Input>
          <br />
          <Label> Insumo: </Label>
          <Input name="idInsumo" onChange={handleChange} type="select">
            {filteredDataFalse.map((producto: Producto) => (
              <option value={producto.id}>{producto.descripcion}</option>
            ))}
          </Input>
          <br />
          <Label> Cantidad:</Label>
          <Input defaultValue={formKit.cantidad} name="cantidad" type="number" onChange={handleChange}></Input>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              editar();
              setModalEdit(false);
              setModalKit(false);
            }}
            text="Actualizar"
          />
          <CButton
            color="btn btn-danger"
            onClick={() => {
              setModalEdit(false);
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Crear kit</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <CFormGroupInput handleChange={handleChange} inputName="nombre" labelName="Nombre:" />
          <CFormGroupInput handleChange={handleChange} inputName="email" labelName="Email:" />
          <CFormGroupInput handleChange={handleChange} inputName="idClinica" labelName="Id Clinica:" />
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={() => insertar()} text="Insertar" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default KitPaquete;
