import React, { useEffect, useState, useMemo } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import {
  Row,
  Container,
  Input,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Alert,
  Label,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Col,
  Card,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import { Cliente } from "../../models/Cliente";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import CButton from "../../components/CButton";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Box, Button, ButtonGroup } from "@mui/material";
import { HiBuildingStorefront } from "react-icons/hi2";
import { BsPersonBoundingBox } from "react-icons/bs";
import Swal from "sweetalert2";
import useModalHook from "../../hooks/useModalHook";
import { UserResponse } from "../../models/Home";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Sucursal } from "../../models/Sucursal";

import { LuCalendarSearch } from "react-icons/lu";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { FaShopify } from "react-icons/fa";

import { useClienteShopify } from "../../hooks/getsHooks/useClienteShopify";
import { ShopifyCliente } from "../../models/ShopifyCliente";

function ClientesShopify() {
  const { filtroSeguridad, session } = useSeguridad();
  const [showView, setShowView] = useState(true);

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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_ShopifyCli_view`);

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

  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ dataUsuarios2 });
    }
  }, []);

  // Redirige a la ruta "/app"
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };

  const [datah, setData1] = useState<any[]>([]); // Definir el estado datah
  const historial = (id) => {
    jezaApi.get(`/Historial?cliente=${id}`).then((response) => {
      setData1(response.data);
      // Abrir o cerrar el modal cuando los datos se hayan cargado
    });
  };

  const [dataSucursal, setDataSucursal] = useState<Sucursal[]>([]);
  const { dataSucursales } = useSucursales();
  const [data, setData] = useState<Cliente[]>([]);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  ///Cliente SHOPIFY
  const [dataClieSho, setDataClieSho] = useState<ShopifyCliente[]>([]);

  /* fin de las cosas que hizo abigail */
  /* inicia alex */

  const [modalvinculoOpen, setModalvinculoOpen] = useState(false);

  const [reportesTabla2, setReportesTabla2] = useState([]);
  const [columnasTabla2, setColumnasTabla2] = useState([]);
  const [selectedName, setSelectedName] = useState(""); // Estado para almacenar el nombre seleccionado
  const [selectedId, setSelectedId] = useState(""); // Estado para almacenar el nombre seleccionado
  const [selectedIdShop, setSelectedIdShop] = useState(""); // Estado para almacenar el nombre seleccionado
  const [selectedNameShop, setSelectedNameShop] = useState(""); // Estado para almacenar el nombre seleccionado
  const [modalOpen, setModalOpen] = useState(false);
  const [trabajador, setTrabajadores] = useState([]);

  // Función para abrir el modal 'modalvinculo'
  const abrirModalvinculo = () => {
    setModalvinculoOpen(true);
  };

  // Función para cerrar el modal 'modalvinculo'
  const cerrarModalvinculo = () => {
    setModalvinculoOpen(false);
  };

  // const vinculo = (idCliente: any, nombreCliente: any, shopId: any, shopName: any) => {
  //   Swal.fire({
  //     text: `¿Desea asignar el cliente ${nombreCliente} al usuario Shopify ${shopName}?`, // Utiliza shopName aquí
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, Agregar!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       jezaApi
  //         .put(`sp_ShopifyClientesUpd?id=${shopId}&idCliente=${idCliente}`)
  //         .then(() => {
  //           Swal.fire("Registro Exitoso!", "El usuario ha sido asignado.", "success");
  //           cerrarModalvinculo();
  //           setModalOpen(!modalOpen);
  //           consulta();
  //         })
  //         .catch((error) => {
  //           console.error("Error al realizar la actualización:", error);
  //         });
  //     }
  //   });
  // };
  const vinculo = async (idCliente: any, nombreCliente: any, shopId: any, shopName: any) => {
    // Verificar el permiso antes de continuar

    const permiso = await filtroSeguridad("CAT_CLIENTSHOPIFY_UPD");
    if (permiso === false) {
      return; // Si el per
    }

    Swal.fire({
      text: `¿Desea asignar el cliente ${nombreCliente} al usuario Shopify ${shopName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Agregar!",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi
          .put(`sp_ShopifyClientesUpd?id=${shopId}&idCliente=${idCliente}`)
          .then(() => {
            Swal.fire("Registro Exitoso!", "El usuario ha sido asignado.", "success");
            cerrarModalvinculo();
            setModalOpen(!modalOpen);
            consulta();
          })
          .catch((error) => {
            console.error("Error al realizar la actualización:", error);
          });
      }
    });
    setSelectedName("");
    setSelectedId("");
  };

  const consulta = () => {
    fetch("http://cbinfo.no-ip.info:9089/sp_ShopifyClientesSel")
      .then((response) => response.json())
      .then((responseData) => {
        setReportesTabla2(responseData);

        // Construye las columnas dinámicamente a partir de la primera entrada de reportes
        // if (responseData.length > 0) {
        //   const columnKeys = Object.keys(responseData[0]);
        //   const columns = columnKeys.map((key) => ({
        //     accessorKey: key,
        //     header: key,
        //     flex: 1,
        //   }));
        //   setColumnasTabla2(columns);
        // }
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  };
  //TABLA 2
  useEffect(() => {
    consulta();
  }, []);

  const setIdShopify = (shopID: number, shopNAME: string) => {
    setSelectedIdShop(shopID);
    setSelectedNameShop(shopNAME);
    setModalOpen(true);
  };

  const columnsA: MRT_ColumnDef<CorteA>[] = useMemo(
    () => [
      {
        accessorKey: "acciones",
        header: "",
        size: 5,
        Cell: ({ row }) => (
          <AiFillEdit
            className="mr-2"
            onClick={() => {
              if (!row.original.idCliente) {
                setIdShopify(row.original.id, row.original.nombreShopify);
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Cliente vinculado",
                  text: `Este usuario ya tiene vinculado un cliente `,
                  confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
                });

                // alert("Este usuario ya tiene vinculado un cliente");
              }
            }}
            size={23}
          ></AiFillEdit>
          // <CButton
          //   color="secondary"
          //   onClick={() => {
          //     if (!row.original.idCliente) {
          //       setIdShopify(row.original.id, row.original.nombreShopify);
          //     } else {
          //       Swal.fire({
          //         icon: "error",
          //         title: "Cliente vinculado",
          //         text: `Este usuario ya tiene vinculado un cliente `,
          //         confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
          //       });

          //       // alert("Este usuario ya tiene vinculado un cliente");
          //     }
          //   }}
          //   text="  Elegir"
          //   disabled={!!row.original.idCliente}
          // ></CButton>
        ),
      },
      {
        accessorKey: "id",
        header: "Id shopify",
        size: 5,
      },
      {
        accessorKey: "nombreShopify",
        header: "Nombre shopify",
        sortDescFirst: false,
        size: 5,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 5,
      },
      {
        accessorKey: "idCliente",
        header: "Id Cliente",
        size: 5,
      },
      {
        accessorKey: "nombreCliente",
        header: "Nombre Cliente",
        size: 5,
      },
    ],
    []
  );

  useEffect(() => {
    // Dentro de useEffect, realizamos la solicitud a la API
    jezaApi
      .get("/Cliente?id=0")
      .then((response) => {
        // Cuando la solicitud sea exitosa, actualizamos el estado

        setTrabajadores(response.data);
      })
      .catch((error) => {
        // Manejo de errores
        console.error("Error al cargar los trabajadores:", error);
      });
  }, []); // El segundo argumento [] indica que este efecto se ejecuta solo una vez al montar el componente

  const handleModalSelect = async (id_cliente: number, name: string) => {
    setSelectedId(id_cliente);
    setSelectedName(name);
    cerrarModalvinculo();
  };

  // const handleModalSelect = async (id_cliente: number, name: string) => {
  //   const permiso = await filtroSeguridad("CAT_CLIENTSHOPIFY_UPD");
  //   if (permiso === false) {
  //     return; // Si el permiso es falso, se sale de la función
  //   }

  //   setSelectedId(id_cliente);
  //   setSelectedName(name);
  //   cerrarModalvinculo();

  //   // Validar si los campos están vacíos antes de limpiarlos
  //   if (!selectedName && !selectedId) {
  //     setSelectedName('');
  //     setSelectedId('');
  //   }
  // };

  const columnsTrabajador: MRT_ColumnDef<any>[] = useMemo(
    () => [
      {
        header: "Acciones",
        Cell: ({ row }) => {
          console.log(row.original);
          return <CButton color="secondary" onClick={() => handleModalSelect(row.original.id_cliente, row.original.nombre)} text="Seleccionar" />;
        },
      },
      {
        accessorKey: "id_cliente",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 100,
      },
      {
        accessorKey: "telefono",
        header: "Telefono",
        size: 100,
        Cell: ({ row }) => {
          return <p>{row.original.telefono ? row.original.telefono : "Sin telefono"}</p>;
        },
      },
      {
        accessorKey: "email",
        header: "Correo",
        size: 100,
        Cell: ({ row }) => {
          return <p>{row.original.email ? row.original.email : "Sin correo"}</p>;
        },
      },
    ],
    []
  );

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <Row>
          <Container fluid>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>
                Shopify clientes <FaShopify size={35} />
              </h1>
            </div>

            <Row>
              <div>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  {/* <Button
                    style={{ marginLeft: "auto" }}
                    color="success"
                    onClick={() => {
                      setModalInsertar(true);
                      setEstado("insert");
                      LimpiezaForm();
                    }}
                  >
                    Crear cliente
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

                <MaterialReactTable
                  columns={columnsA}
                  data={reportesTabla2} // Reemplaza "reportes1" con tus datos de la primera tabla
                  enableRowSelection={false}
                  rowSelectionCheckboxes={false}
                  initialState={{
                    density: "compact",

                    sorting: [
                      { id: "nombreShopify", desc: true }, //sort by state in ascending order by default
                    ],
                  }}
                />
              </div>
            </Row>
          </Container>
          <br />
          <br />
        </Row>
      </Container>
      <Modal isOpen={modalvinculoOpen} toggle={cerrarModalvinculo} size="lg">
        <ModalHeader toggle={cerrarModalvinculo}>
          <h3>Seleccione cliente a vincular</h3>
        </ModalHeader>
        <ModalBody>
          <MaterialReactTable
            columns={columnsTrabajador}
            data={trabajador}
            onSelect={(id_cliente, name) => handleModalSelect(id_cliente, name)} // Pasa la función de selección
            initialState={{ density: "compact" }}
          />
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              cerrarModalvinculo();
              setSelectedName("");
              setSelectedId("");
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>
      +{/* modal trabajador */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {" "}
          <h3>Seleccione cliente</h3>
        </ModalHeader>
        <ModalBody>
          <Label>Id cliente shopify:</Label>
          <Input type="text" value={selectedIdShop} disabled={true} />
          <br />
          <Label>Nombre cliente shopify:</Label>
          <Input type="text" value={selectedNameShop} disabled={true} />
          <br />
          <Label>Nombre cliente sistema: </Label>

          <InputGroup>
            <Input type="text" value={selectedName} disabled={true} />
            <CButton style={{ marginLeft: "auto" }} color="secondary" onClick={abrirModalvinculo} text="Seleccionar"></CButton>
          </InputGroup>
          <br />
          <Label>Id cliente sistema: </Label>
          <Input type="text" value={selectedId} disabled={true} />
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton
            text="Cancelar"
            color="danger"
            onClick={() => {
              setModalOpen(!modalOpen);
              setSelectedName("");
              setSelectedId("");
            }}
          />
          <CButton
            style={{ marginLeft: "auto" }}
            color="success"
            onClick={() => vinculo(selectedId, selectedName, selectedIdShop, selectedNameShop)}
            text="Vincular clientes"
          ></CButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ClientesShopify;
