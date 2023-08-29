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
  const {
    modalActualizar,
    modalInsertar,
    setModalInsertar,
    setModalActualizar,
    cerrarModalActualizar,
    cerrarModalInsertar,
    mostrarModalInsertar,
  } = useModalHook();

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

  const vinculo = (idCliente: any, nombreCliente: any, shopId: any, shopName: any) => {
    Swal.fire({
      text: `¿Desea asignar el cliente ${nombreCliente} al usuario Shopify ${shopName}?`, // Utiliza shopName aquí
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
          })
          .catch((error) => {
            console.error("Error al realizar la actualización:", error);
          });
      }
    });
  };

  //TABLA 2
  useEffect(() => {
    // Realiza la solicitud GET a la API para la Tabla 2
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
  }, []);

  const [shopifyId, setShopifyId] = useState<number>(0);
  const [shopifyName, setShopifyName] = useState<string>("");

  const setIdShopify = (shopID: number, shopNAME: string) => {
    setSelectedIdShop(shopID);
    setSelectedNameShop(shopNAME);
    setModalOpen(true);
  };

  const columnsA: MRT_ColumnDef<CorteA>[] = useMemo(
    () => [
      {
        accessorKey: "acciones",
        header: "Acciones",
        size: 5,
        Cell: ({ row }) => (
          <CButton
            color="secondary"
            onClick={() => setIdShopify(row.original.id, row.original.nombreShopify)}
            text="  Elegir"
          ></CButton>
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
  const columnsTrabajador: MRT_ColumnDef<any>[] = useMemo(
    () => [
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
        header: "Acciones",
        Cell: ({ row }) => {
          console.log(row.original);
          return (
            <Button size="sm" onClick={() => handleModalSelect(row.original.id_cliente, row.original.nombre)}>
              seleccionar
            </Button>
          );
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
                {/* <MaterialReactTable columns={columnsclientes} data={data} initialState={{ density: "compact" }} /> */}
              </div>
            </Row>
          </Container>
          <br />
          <br />
        </Row>
      </Container>
      <Modal isOpen={modalvinculoOpen} toggle={cerrarModalvinculo}>
        <ModalHeader toggle={cerrarModalvinculo}>Modal de Vínculo</ModalHeader>
        <ModalBody>
          <MaterialReactTable
            columns={columnsTrabajador}
            data={trabajador}
            onSelect={(id_cliente, name) => handleModalSelect(id_cliente, name)} // Pasa la función de selección
            initialState={{ density: "compact" }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={cerrarModalvinculo}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* modal trabajador */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}></ModalHeader>
        <ModalBody>
          <h1>Seleccione cliente</h1>

          <Label>ID Cliente shopify</Label>
          <Input type="text" value={selectedIdShop} disabled="disabled" />
          <Label>Nombre Cliente shopify</Label>
          <Input type="text" value={selectedNameShop} disabled="disabled" />

          <Label>ID Cliente Sistema</Label>
          <Input type="text" value={selectedId} />
          <Label>Nombre Cliente Sistema</Label>
          <ButtonGroup>
            <Input type="text" value={selectedName} />
            <CButton
              style={{ marginLeft: "auto" }}
              color="secondary"
              onClick={abrirModalvinculo}
              text="Seleccionar"
            ></CButton>
            <CButton
              style={{ marginLeft: "auto" }}
              color="success"
              onClick={() => vinculo(selectedIdShop, selectedNameShop, selectedId, selectedName)}
              text="Vincular"
            ></CButton>
          </ButtonGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setModalOpen(!modalOpen)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ClientesShopify;
