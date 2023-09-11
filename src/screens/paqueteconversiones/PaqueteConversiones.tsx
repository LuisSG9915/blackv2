import React, { useEffect, useState } from "react";
import { Row, Container, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Button, Col } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { AiFillDelete, AiFillEdit, AiOutlineBgColors } from "react-icons/ai";
import { jezaApi } from "../../api/jezaApi";
import { Paquete_conversion } from "../../models/Paquete_conversion";
import { useProductos } from "../../hooks/getsHooks/useProductos";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import ButtonGroup from "@mui/material/ButtonGroup";
import CButton from "../../components/CButton";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import Swal from "sweetalert2";

function PaqueteConversiones() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_PaqCon_view`);

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
  const [form, setForm] = useState<Paquete_conversion>({
    id: 0,
    idPaquete: 0,
    idPieza: 0,
    Cantidad: 0.0, // Número decimal
    d_paquete: "",
    d_pieza: "",
  });

  const [data, setData] = useState<Paquete_conversion[]>([]);
  const insertPaqueteConversion = () => {
    /* CREATE */
    // Validar que idPaquete y idPieza no sean iguales
    if (form.id === form.idPieza) {
      console.log("Error: idPaquete e idPieza no pueden ser iguales");
      toggleCreateModal(); // Cerrar modal después de guardar
      setVisible4(true);
      setTimeout(() => {
        setVisible4(false);
      }, 3000);

      return;
    }

    jezaApi
      .post(`/PaquetePieza?idPaquete=${form.idPaquete}&idPieza=${form.idPieza}&cantidad=${form.Cantidad}`)
      .then(() => {
        setVisible1(true);
        getPaqueteConversion();
        toggleCreateModal(); // Cerrar modal después de guardar
        setTimeout(() => {
          setVisible1(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* get */
  const getPaqueteConversion = () => {
    jezaApi.get("/PaquetePieza?id=0").then((response) => {
      setData(response.data);
    });
  };
  const { dataProductos } = useProductos();

  /* update */
  const updatePaqueteConversion = (dato: Paquete_conversion) => {
    console.log(dato);
    if (dato.idPaquete === dato.idPieza) {
      console.log("Error: idPaquete e idPieza no pueden ser iguales");
      setModalUpdate(!modalUpdate);
      setVisible4(true);
      setTimeout(() => {
        setVisible4(false);
      }, 3000);

      return;
    }
    jezaApi
      .put(`/PaquetePieza?id=${dato.id}&idPaquete=${dato.idPaquete}&idPieza=${dato.idPieza}&cantidad=${dato.Cantidad}`)
      .then((response) => {
        setVisible2(true);
        getPaqueteConversion();
        setModalUpdate(!modalUpdate);
        setTimeout(() => {
          setVisible2(false);
        }, 3000);
        // Cerrar modal después de guardar
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePaquetesConversion = (dato: Paquete_conversion) => {
    /* DELETE */
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento`);
    if (opcion) {
      jezaApi.delete(`/PaquetePieza?id=${dato.id}`).then(() => {
        setVisible3(true);
        getPaqueteConversion();
        setTimeout(() => {
          setVisible3(false);
        }, 3000);
      });
    }
  };

  useEffect(() => {
    getPaqueteConversion();
  }, []);

  /* modals */
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalProduct, setModalProduct] = useState(false);

  const toggleCreateModal = () => {
    setForm({
      id: 0,
      idPaquete: 0,
      idPieza: 0,
      Cantidad: 0,
      d_paquete: "",
      d_pieza: "",
    });
    setModalCreate(!modalCreate);
  };

  const toggleUpdateModal = (dato: any) => {
    setModalUpdate(!modalUpdate);
    setForm(dato);
  };
  const toggleProductModal = () => {
    setModalProduct(!modalProduct);
    // setForm(dato);
  };

  /* alertas */
  const [creado, setVisible1] = useState(false);
  const [actualizado, setVisible2] = useState(false);
  const [eliminado, setVisible3] = useState(false);
  const [error, setVisible4] = useState(false);
  const [productType, setProductType] = useState({
    idPaquete: false,
    idPieza: false,
    stateCreate: false,
  });
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

    { field: "d_paquete", headerName: "Paquete", flex: 1, headerClassName: "custom-header" },
    { field: "d_pieza", headerName: "Pieza", flex: 1, headerClassName: "custom-header" },
    { field: "Cantidad", headerName: "Cantidad", flex: 1, headerClassName: "custom-header" },
  ];

  const columnasTablaProduct = [
    {
      accessorKey: "acciones",
      header: "Acción",
      isVisible: true,
      Cell: ({ row }) => <ComponentProduct params={row} />,
    },
    {
      accessorKey: "descripcion",
      header: "Producto",
      isVisible: true,
    },
  ];
  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => toggleUpdateModal(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => deletePaquetesConversion(params.row)} size={23}></AiFillDelete>
      </>
    );
  };
  const ComponentProduct = ({ params }: { params: any }) => {
    return (
      <>
        <Button
          onClick={() => {
            setModalProduct(false);
            if (productType.stateCreate === true) {
              if (productType.idPaquete === true) {
                setForm({ ...form, idPaquete: params.original.id });
              } else {
                setForm({ ...form, idPieza: params.original.id });
              }
            } else {
              if (productType.idPaquete === true) {
                setForm({ ...form, idPaquete: params.original.id });
              } else {
                setForm({ ...form, idPieza: params.original.id });
              }
            }
          }}
        >
          Elegir
        </Button>
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
            getRowId={(row) => row.idPaquete}
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
          <h1>Paquetes y conversiones</h1>
          <AiOutlineBgColors size={30} />
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
              setForm({ id: 0, idPaquete: 0, idPieza: 0, Cantidad: 0, d_paquete: "", d_pieza: "" });
              setModalCreate(true);
            }}
          >
            Crear conversión
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
        <DataTable></DataTable>
      </Container>

      {/* Modals */}
      {/* create */}
      <Modal isOpen={modalCreate} toggle={toggleCreateModal} size="lg">
        <ModalHeader toggle={toggleCreateModal}>Crear paquete conversión</ModalHeader>

        <ModalBody>
          <Row>
            <Col xs={11}>
              <Label>Paquete: </Label>
              <Input type="select" value={form.idPaquete ? form.idPaquete : 0} disabled className="select">
                {dataProductos.map((producto) => (
                  <>
                    <option value={0}>Seleccione</option>
                    <option value={producto.id}>{producto.descripcion}</option>
                  </>
                ))}
              </Input>
            </Col>
            <Col xs={1} className="d-flex align-items-end justify-content-end">
              <Button
                onClick={() => {
                  toggleProductModal();
                  setProductType({ ...productType, idPaquete: true, idPieza: false, stateCreate: true });
                }}
              >
                Elegir
              </Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={11}>
              <Label> Pieza: </Label>
              <Input type="select" value={form.idPieza ? form.idPieza : 0} disabled className="select">
                {dataProductos.map((producto) => (
                  <>
                    <option value={0}>Seleccione</option>
                    <option value={producto.id}>{producto.descripcion}</option>
                  </>
                ))}
              </Input>
            </Col>
            <Col xs={1} className="d-flex align-items-end justify-content-end">
              <Button
                onClick={() => {
                  toggleProductModal();
                  setProductType({ ...productType, idPaquete: false, idPieza: true, stateCreate: true });
                }}
              >
                Elegir
              </Button>
            </Col>
          </Row>

          <br />
          <Label>Cantidad por unidad:</Label>
          <Input
            type="number"
            name="cantidad"
            value={form.Cantidad}
            onChange={(e) => {
              const value = parseFloat(e.target.value); // Convertir a número decimal
              setForm({ ...form, Cantidad: value });
            }}
            min="0.01" // Valor mínimo permitido
            step="0.01" // Precisión decimal
            placeholder="Ingrese la cantidad de producto por unidad"
          />
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertPaqueteConversion} text="Guardar paquete conversión" />
          <CButton color="danger" onClick={toggleCreateModal} text="Cancelar" />
        </ModalFooter>
      </Modal>
      {/* modal para update */}
      <Modal isOpen={modalUpdate} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>Editar paquete conversión</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={10}>
              <Label>Paquete:</Label>
              <Input
                disabled
                type="select"
                name="idPaquete"
                className="select"
                value={form.idPaquete ? form.idPaquete : 0}
              >
                {dataProductos.map((producto) => (
                  <option value={producto.id}>{producto.descripcion}</option>
                ))}
              </Input>
            </Col>
            <Col xs={2} className="d-flex align-items-end justify-content-end">
              <Button
                onClick={() => {
                  setModalProduct(true);
                  setProductType({ ...form, idPaquete: true, stateCreate: false, idPieza: false });
                }}
              >
                Elegir
              </Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={10}>
              <Label>Pieza:</Label>
              <Input disabled type="select" name="idPieza" className="select" value={form.idPieza ? form.idPieza : 0}>
                {dataProductos.map((producto) => (
                  <option value={producto.id}>{producto.descripcion}</option>
                ))}
              </Input>
            </Col>
            <Col xs={2} className="d-flex align-items-end justify-content-end">
              <Button
                onClick={() => {
                  setModalProduct(true);
                  setProductType({ ...form, idPaquete: false, stateCreate: false, idPieza: true });
                }}
              >
                Elegir
              </Button>
            </Col>
          </Row>
          <br />
          <Label>Cantidad por unidad:</Label>
          <Input
            type="number"
            name="cantidad"
            value={form.Cantidad}
            onChange={(e) => {
              const value = parseFloat(e.target.value); // Convertir a número decimal
              setForm({ ...form, Cantidad: value });
            }}
            min="0.01" // Valor mínimo permitido
            step="0.01" // Precisión decimal
            placeholder="Ingrese la cantidad de producto por unidad"
          />
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" text="Actualizar" onClick={() => updatePaqueteConversion(form)} />
          <CButton color="danger" text="Cancelar" onClick={() => setModalUpdate(false)} />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalProduct} toggle={toggleProductModal} size="lg">
        <ModalHeader toggle={toggleProductModal}>Escoje producto</ModalHeader>
        <ModalBody>
          {/* <DataGrid columns={columnProduct} rows={dataProductos}></DataGrid> */}
          <MaterialReactTable
            columns={columnasTablaProduct}
            data={dataProductos}
            initialState={{ density: "compact" }}
          ></MaterialReactTable>
        </ModalBody>

        <ModalFooter>
          <CButton color="danger" text="Salir" onClick={() => setModalUpdate(false)} />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default PaqueteConversiones;
