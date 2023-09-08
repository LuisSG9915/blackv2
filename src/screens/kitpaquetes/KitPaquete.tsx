import React, { useState, useEffect, useMemo } from "react";
import { FcPlus } from "react-icons/fc";
import { Button } from "reactstrap";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { ImGift } from "react-icons/im";
import { Row, Container, Input, Table, Modal, ModalBody, ModalFooter, ModalHeader, Label, Col } from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { useProductos } from "../../hooks/getsHooks/useProductos";
import { Producto } from "../../models/Producto";
import { Kit } from "../../models/Kit";
import { usePaquetesKits } from "../../hooks/getsHooks/usePaquetesKits";
//NUEVAS IMPOTACIONES
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";

function KitPaquete() {
  const { filtroSeguridad, session } = useSeguridad();
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const { dataProductos } = useProductos();
  const [formKit, setFormKit] = useState<Kit>({
    cantidad: 0,
    idInsumo: 0,
    idProducto: 0,
    d_insumo: "",
    d_kit: "",
    id: 0,
    costo: 0.0,
    importe: 0.0,
  });

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
  const [arregloInsumo, setArregloInsumo] = useState<any>([]);

  const refreshArregloInsumo = () => {
    const idInsumo = dataPaquetesKits.map((item) => item.idInsumo);
    setArregloInsumo(idInsumo ? idInsumo : []);
  };
  const [filteredData, setFilteredData] = useState([]);
  const [modalKit, setModalKit] = useState(false);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [filteredDataFalse, setFilteredDataFalse] = useState([]);

  const DataTableHeaderkit = ["Acciones", "Producto", "Cantidad", "Costo", "Importe"];

  const mostrarModalActualizar = (dato: Producto) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_KIT_UPD");
    if (permiso === false) {
      return;
    }
    if (validarCampos() === true) {
      await jezaApi
        .put(`/Kit`, null, {
          params: {
            id: formKit.id,
            idProducto: formKit.idProducto,
            idInsumo: formKit.idInsumo,
            cantidad: formKit.cantidad,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Kit actualizado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalActualizar(false);
          fetchPaquetesKits();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const eliminar = async (dato: Kit) => {
    const permiso = await filtroSeguridad("CAT_KIT_DEL");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el insumo: ${dato.d_insumo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Kit?id=${dato.id}`).then(() => {
          Swal.fire({
            icon: "success",
            text: "Registro eliminado con éxito",
            confirmButtonColor: "#3085d6",
          });
          fetchPaquetesKits();
        });
      }
    });
  };

  //VALIDACIÓN---->
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);

  const validarCampos = () => {
    const camposRequeridos: (keyof Kit)[] = ["cantidad"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Kit) => {
      const fieldValue = formKit[campo];
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
    const permiso = await filtroSeguridad("CAT_KIT_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post("/Kit", null, {
          params: {
            idProducto: form.id,
            idInsumo: formKit.id,
            cantidad: Number(formKit.cantidad),
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Kit creao con éxito",
            confirmButtonColor: "#3085d6",
          });
          setModalInsertar(false);
          fetchPaquetesKits();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
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
  }, [dataProductos]);

  const [isInsumoSelected, setIsInsumoSelected] = useState(false);

  const handleInsumoButtonClick = () => {
    setIsInsumoSelected(!isInsumoSelected);
  };

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
    {
      field: "precio",
      headerName: "Precio",
      flex: 1,
      headerClassName: "custom-header",
      renderCell: (params) => {
        return (
          <p style={{ textAlign: "center" }}>
            {params.row.precio.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN", // Cambiamos a pesos mexicanos (MXN)
            })}
          </p>
        );
      },
    },
  ];

  const arregloKit = useMemo(() => {
    return dataPaquetesKits.map((item) => item.idInsumo);
  }, [dataPaquetesKits]);

  const [flagKit, setFlagKit] = useState(false);

  //TABLA COMPONENETE GRANDE
  const columnsKIT: MRT_ColumnDef<Producto>[] = useMemo(
    () => [
      {
        accessorKey: "clave_prod",
        header: "Clave producto",
        size: 100,
      },
      {
        accessorKey: "descripcion",
        header: "Descripción",
        size: 100,
      },
      {
        header: "Nueva Acción",
        size: 100,
        Cell: ({ cell }) => (
          <ComponentInsumos
            params={{
              row: {
                id: cell.row.original.id,
                descripcion: cell.row.original.descripcion,
              },
            }}
            arregloKit={arregloKit}
            flagKit={flagKit}
            setModalInsert={setModalInsert}
            setFormKit={setFormKit}
            setModalKit={setModalKit}
            formKit={formKit}
          />
        ),
      },
    ],
    [arregloKit, flagKit, setModalInsert, setFormKit, setModalKit, formKit]
  );

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <FcPlus className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={30}></FcPlus>
      </>
    );
  };
  const ComponentInsumos = ({
    params,
    arregloKit,
    flagKit,
    setModalInsert,
    setFormKit,
    setModalKit,
    formKit,
  }: {
    params: any;
    arregloKit: any[];
    flagKit: boolean;
    setModalInsert: Function;
    setFormKit: Function;
    setModalKit: Function;
    formKit: any;
  }) => {
    return (
      <>
        <FcPlus
          className="mr-2"
          onClick={() => {
            if (!arregloKit.includes(params.row.id)) {
              if (flagKit) {
                setModalInsert(true);
                setFormKit(params.row);
              } else {
                setFormKit({ ...formKit, idInsumo: params.row.id, d_insumo: params.row.descripcion });
                setModalKit(false);
              }
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: `Producto repetido, favor de intentarlo nuevamente`,
                confirmButtonColor: "#3085d6",
              });
            }
          }}
          size={30}
        ></FcPlus>
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

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };

  const handleReload = () => {
    window.location.reload();
  };

  const [totalImporte, setTotalImporte] = useState(0);

  // Calcula la suma de los importes
  const calcularTotalImporte = () => {
    const suma = dataPaquetesKits.reduce((accumulator, item) => accumulator + item.importe, 0);
    return suma;
  };

  // Actualiza el total de importe cuando cambia el arreglo de datos
  useEffect(() => {
    const sumaTotal = calcularTotalImporte();
    setTotalImporte(sumaTotal);
  }, [dataPaquetesKits]);

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
          <Button color="primary" onClick={handleRedirect}>
            <IoIosHome size={20}></IoIosHome>
          </Button>
          <Button color="primary" onClick={handleReload}>
            <IoIosRefresh size={20}></IoIosRefresh>
          </Button>
        </ButtonGroup>

        <br />
        <br />
        <br />
        <DataTable></DataTable>
      </Container>

      <Modal isOpen={modalActualizar} size="lg" fullscreen={"lg"}>
        <ModalHeader>
          <div onClick={() => console.log(arregloKit)}>
            <h3>Catálogo Kit</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Table size="sm" responsive={true} style={{ width: "100%", margin: "auto" }}>
              <thead>
                <tr>
                  <th>Clave producto:</th>
                  <th>Producto:</th>
                  <th>Precio:</th>
                  <th>Agregar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Input onChange={handleChange} name="clave_prod" defaultValue={form.clave_prod} disabled></Input>
                  </td>
                  <td>
                    <Input onChange={handleChange} name="descripcion" defaultValue={form.descripcion} disabled></Input>
                  </td>
                  <td>
                    <Input
                      onChange={handleChange}
                      name="precio"
                      value={form.precio.toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN", // Cambiamos a pesos mexicanos (MXN)
                      })}
                      disabled
                    ></Input>
                  </td>

                  <td>
                    <FcPlus
                      className="center"
                      size={35}
                      color="success"
                      onClick={() => {
                        refreshArregloInsumo();
                        setEstado("insert");
                        setFlagKit(true);
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
                    <td className="gap-5">
                      <AiFillEdit
                        className="mr-2"
                        onClick={() => {
                          setModalEdit(true);
                          setFormKit(falsos);
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
                    {/* <td>{falsos.id}</td> */}
                    <td>{falsos.d_insumo}</td>
                    <td>{falsos.cantidad}</td>
                    <td>
                      {falsos.costo.toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN", // Cambiamos a pesos mexicanos (MXN)
                      })}
                    </td>
                    <td>
                      {falsos.importe.toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN", // Cambiamos a pesos mexicanos (MXN)
                      })}
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <br />
            <br />
            <div>
              <p style={{ textAlign: "right" }}>
                <strong>
                  Total paquete:{" "}
                  {totalImporte.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN", // Cambiamos a pesos mexicanos (MXN)
                  })}
                </strong>
              </p>
            </div>
          </Container>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={() => cerrarModalActualizar()} text="Aceptar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalKit} size="lg">
        <ModalHeader>
          <div onClick={() => console.log(arregloKit)}>
            <h3>Seleccionar insumos</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <MaterialReactTable columns={columnsKIT} data={filteredDataFalse} initialState={{ density: "compact" }} />
          {/* <DataGrid rows={filteredDataFalse} columns={columnsInsumos} /> */}
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
          <Input disabled type="select" name="idProducto" onChange={handleChange}>
            {filteredData.map((producto: Producto) => (
              <option value={producto.id}>{producto.descripcion}</option>
            ))}
          </Input>
          <br />
          <Row>
            <Col xs={11}>
              <Label> Insumo: </Label>
              <Input value={formKit.idInsumo} disabled name="idInsumo" onChange={handleChange} type="select">
                {filteredDataFalse.map((producto: Producto) => (
                  <option value={producto.id}>{producto.descripcion}</option>
                ))}
              </Input>
            </Col>
            <Col xs={1} className="d-flex align-items-end justify-content-end">
              <Button
                onClick={() => {
                  setFlagKit(false);
                  setModalKit(true);
                }}
              >
                Elegir{" "}
              </Button>
            </Col>
          </Row>
          <br />
          <Label> Cantidad:</Label>
          <Input defaultValue={formKit.cantidad} name="cantidad" type="number" onChange={handleChange}></Input>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              editar();
              setModalEdit(true);
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
