import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";

import CButton from "../../components/CButton";
import TableEstilistas from "./Components/TableEstilistas";
import { useGentlemanContext } from "./context/VentasContext";
import TableProductos from "./Components/TableProductos";
import TableClientesProceso from "./Components/TableClientesProceso";
import TableCliente from "./Components/TableCliente";
import ModalActualizarLayout from "../../layout/ModalActualizarLayout";
import { useClientes } from "../../hooks/getsHooks/useClientes";
import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";
import { jezaApi } from "../../api/jezaApi";
import { Usuario } from "../../models/Usuario";
import { Venta } from "../../models/Venta";
import { useVentasV2 } from "../../hooks/getsHooks/useVentasV2";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { GrStakeholder } from "react-icons/gr";
import TableInsumosGenerales from "./Components/TableInsumosGenerales";
import { useInsumosProductos } from "../../hooks/getsHooks/useInsumoProducto";
import { VentaInsumo } from "../../models/VentaInsumo";
import { useDescuentos } from "../../hooks/getsHooks/useClientesProceso copy";
import { UserResponse } from "../../models/Home";
import Swal from "sweetalert2";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { AnticipoGet } from "../../models/Anticipo";
import { useAnticipoVentas } from "../../hooks/getsHooks/useAnticipoVentas";
interface TicketPrintProps {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}
const Ventas = () => {
  const { modalActualizar, setModalActualizar, cerrarModalActualizar } = useModalHook();

  const [modalOpenVenta, setModalOpen] = useState<boolean>(false);
  const [modalOpen2, setModalOpen2] = useState<boolean>(false);
  const [modalOpen3, setModalOpen3] = useState<boolean>(false);
  const [modalOpenPago, setModalOpenPago] = useState<boolean>(false);
  const [modalOpenInsumos, setModalOpenInsumos] = useState<boolean>(false);
  const [modalOpenInsumosSelect, setModalOpenInsumosSelect] = useState<boolean>(false);
  const [modalEditInsumo, setModalEditInsumo] = useState<boolean>(false);
  const [modalClientesProceso, setModalClientesProceso] = useState<boolean>(false);
  const [modalCliente, setModalCliente] = useState<boolean>(false);
  const [modalTicket, setModalTicket] = useState<boolean>(false);
  const [modalTicketEstilista, setModalTicketEstilista] = useState<boolean>(false);
  const [modalAnticipo, setModalAnticipo] = useState<boolean>(false);
  const [modalEstilistaSelector, setModalEstilistaSelector] = useState<boolean>(false);

  const [total, setTotal] = useState<number>(0);
  const [tiempo, setTiempo] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [estilistaProceso, setEstilistaProceso] = useState([
    {
      d_estilista: "",
      User: 0,
      No_venta: 0,
      Cve_cliente: 0,
    },
  ]);
  const [fechaVieja, setFechaVieja] = useState("");

  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  const { dataClientes } = useClientes();
  const { dataTrabajadores } = useNominaTrabajadores();
  const { dataDescuentos } = useDescuentos();

  const [form, setForm] = useState<Usuario[]>([]);
  const [datoTicket, setDatoTicket] = useState([]);
  const [datoTicketEstilista, setDatoTicketEstilista] = useState([]);
  const [datoVentaSeleccionado, setDatoVentaSeleccionado] = useState<any>({
    Caja: 1,
    Cant_producto: 1,
    Cia: 26,
    Clave_Descuento: 0,
    Clave_prod: 5426,
    Corte: 1,
    Corte_parcial: 1,
    Costo: 1,
    Cve_cliente: 24,
    Descuento: 0,
    Fecha: "2023-06-14T08:10:57.817",
    No_venta: 0,
    No_venta_original: 0,
    Observacion: "x",
    Precio: 0,
    Precio_base: 0,
    Sucursal: 21,
    Tasa_iva: 0.16,
    User: 54,
    cancelada: false,
    d_cliente: "LUIS ALBERTO",
    d_estilista: null,
    d_producto: "OXIDANTE CREMA 20 VOL. frasco 1l",
    d_sucursal: "Barrio",
    folio_estilista: "0",
    hora: "2023-06-14T08:10:57.817",
    id: 0,
    no_venta2: 0,
    terminado: false,
    tiempo: 0,
    validadoServicio: false,
  });

  const [formInsumo, setFormInsumo] = useState<VentaInsumo>({
    id: 0,
    id_insumo: 0,
    id_venta: 0,
    cantidad: 0,
    fechaAlta: "",
    unidadMedida: "",
    d_insumo: "",
  });

  const [selectedID2, setSelectedID] = useState(0);
  const { datoInsumosProducto, fetchInsumosProducto } = useInsumosProductos({ idVenta: selectedID2 });

  const [formPago, setFormPago] = useState({
    efectivo: 0,
    tc: 0,
    anticipos: 0,
    totalPago: 0,
    cambioCliente: 0,
  });
  const [formAnticipo, setFormAnticipo] = useState<AnticipoGet>({
    caja: 0,
    cia: 0,
    fecha: "",
    fechaMovto: "",
    id: 0,
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

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      try {
        const parsedItem = JSON.parse(item);
        setForm(parsedItem);
      } catch (error) {
        // Handle the error appropriately, e.g., log it or show an error message to the user.
        console.error("Error parsing JSON from localStorage:", error);
      }
    }
  }, []);

  const onDismiss = () => {
    setVisible(false);
  };

  const datosInicialesArreglo = [
    {
      id: 4,
      Cia: 2,
      Sucursal: 1,
      Fecha: "2023-06-13T00:00:00",
      Caja: 1,
      No_venta: 0,
      no_venta2: 0,
      Clave_prod: 5425,
      Cant_producto: 1,
      idEstilista: 0,
      Precio: 0.0,
      Cve_cliente: 6,
      Tasa_iva: 0.16,
      Observacion: "x",
      Descuento: 0.0,
      Clave_Descuento: 0,
      User: 55,
      Corte: 1,
      Corte_parcial: 1,
      Costo: 1.0,
      Precio_base: 0.0,
      No_venta_original: 0,
      cancelada: false,
      folio_estilista: 0,
      // hora: "2023-06-13T00:00:00",
      hora: 8,
      tiempo: 0,
      terminado: false,
      validadoServicio: false,
      ieps: 0,
      Usuario: 0,
      Credito: false,
    },
  ];

  const [data, setdata] = useState<Venta[]>([]);
  useEffect(() => {
    setdata(datosInicialesArreglo);
  }, []);

  const TableDataHeader = ["Estilista", "Producto/Servicio", "Cantidad", "Precio", "Descuento", "Importe", "Hora", "Tiempo", "Acciones"];
  const TableDataHeaderInsumo = ["Insumo", "Cantidad", "Unidad de medida", "Acciones"];
  const TabñeDataHeaderEstilistaProceso = ["Estilista", ""];

  const mostrarModalActualizar = (dato: Venta) => {
    setDataTemporal(dato);
    setModalActualizar(true);
  };

  const cambios = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "hora") {
      const partesHora = value.split(":");
      const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
      const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
      let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut
      setDataTemporal((prev) => ({ ...prev, [name]: horaInt }));
    } else {
      setDataTemporal((prev) => ({ ...prev, [name]: value }));
    }
  };
  const cambiosPagos = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormPago((prev) => ({ ...prev, [name]: value }));
  };
  const cambiosInsumos = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormInsumo((prev) => ({ ...prev, [name]: value }));
    console.log(formInsumo);
  };

  useEffect(() => {
    const totalCobro = Number(formPago.anticipos) + Number(formPago.efectivo) + Number(formPago.tc);
    const totalCambio = Number(totalCobro) - Number(total);
    setFormPago((prev) => ({ ...prev, totalPago: totalCobro, cambioCliente: Number(totalCambio.toFixed(2)) }));
  }, [formPago.anticipos, formPago.efectivo, formPago.tc]);

  const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();

  useEffect(() => {
    const importeFinal = Number(dataTemporal.Precio) - Number(dataTemporal.Precio) * Number(dataTemporal.Descuento);
    if (dataTemporal.Descuento > 0) {
      setDataTemporal((prev) => ({ ...prev, Precio_base: importeFinal }));
    } else {
      setDataTemporal((prev) => ({ ...prev, Precio_base: dataTemporal.Precio }));
    }
    console.log({ dataTemporal });
  }, [dataTemporal.Descuento]);

  const generarOpcionesDeTiempo = () => {
    const opciones = [];
    for (let hora = 8; hora < 20; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horaFormateada = hora.toString().padStart(2, "0");
        const minutoFormateado = minuto.toString().padStart(2, "0");
        const tiempo = `${horaFormateada}:${minutoFormateado}`;
        opciones.push(
          <option key={tiempo} value={tiempo}>
            {tiempo}
          </option>
        );
      }
    }
    return opciones;
  };
  // const getinsumo = async (dato: Venta) => {
  //   await jezaApi.get(`/VentaInsumo?id_venta=${datoVentaSeleccionado.id}`).then((response) => {
  //     setDatoInsumo(response.data);
  //     console.log(response);
  //   });
  // };

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
    }
  }, []);

  const insertar = async () => {
    const today2 = new Date();
    const today = new Date();
    const horaTempora = dataTemporal.hora;
    today.setHours(Math.floor(horaTempora));
    today.setMinutes((horaTempora % 1) * 60);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const horaDateTime = today.toISOString();

    try {
      await jezaApi
        .post("/Venta", null, {
          params: {
            id: 0,
            Cia: 26,
            Sucursal: dataUsuarios2[0]?.sucursal,
            Fecha: today2,
            Caja: 1,
            No_venta: 0,
            no_venta2: 0,
            Clave_prod: dataTemporal.Clave_prod,
            Cant_producto: dataTemporal.Cant_producto,
            Cve_cliente: dataTemporal.Cve_cliente,
            Tasa_iva: "0.16",
            Observacion: dataTemporal.Observacion,
            Descuento: dataTemporal.Descuento,
            Clave_Descuento: dataTemporal.Clave_Descuento,
            // usuario: form[0].id,
            usuario: dataTemporal.idEstilista,
            Corte: 1,
            Corte_parcial: 1,
            Costo: 1,
            Precio: dataTemporal.Precio_base === 0 ? dataTemporal.Precio : dataTemporal.Precio_base,
            Precio_base: dataTemporal.Precio,
            No_venta_original: 0,
            cancelada: false,
            folio_estilista: 0,
            hora: horaDateTime,
            tiempo: dataTemporal.tiempo,
            terminado: false,
            validadoServicio: false,
            ieps: "0",
            Credito: false,
            idEstilista: dataTemporal.idEstilista,
          },
        })
        .then(() => {
          console.log("realizado");
          setVisible(true);
          setTimeout(() => {
            setVisible(false);
          }, 3000);
        });
    } catch (error) {
      console.error(error);
    }
  };
  // TODO Add this function
  const insertarPago = () => {
    jezaApi.post("/VentaPago", null, {
      params: {},
    });
  };

  const createInsumoTrue = () => {
    jezaApi.post("insumo", null, { params: { id_venta: datoVentaSeleccionado.id, id_insumo: 1, cantidad: 1 } });
  };

  const createInsumo = () => {
    console.log({ formPago });
    jezaApi
      .post("/VentaPago", null, {
        params: {
          cliente: dataTemporal.Cve_cliente,
          suc: dataUsuarios2[0]?.sucursal,
          total: total,
          efectivo: formPago.efectivo,
          tc: formPago.tc,
          anticipos: formPago.anticipos,
        },
      })
      .then((response) => {
        console.log(response);
        setDatoTicket(response.data);
      });
  };

  const deleteVenta = async (dato: Venta): Promise<void> => {
    if (dato.Observacion === "SERV") {
      const opcion = window.confirm(`¿Está seguro de eliminar esta venta? Al eliminar esta venta se eliminarán los insumos relacionados `);
      console.log(dato.id);
      if (opcion) {
        try {
          await jezaApi.delete(`/Venta?id=${dato.id}`).then((response) => console.log(response));
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento `);
      console.log(dato.id);
      if (opcion) {
        try {
          await jezaApi.delete(`/Venta?id=${dato.id}`).then((response) => console.log(response));
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  const deleteInsumo = async (dato: VentaInsumo): Promise<void> => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      try {
        await jezaApi.delete(`/VentaInsumo?id=${dato.id}`).then(() => fetchInsumosProducto());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editInsumo = () => {
    jezaApi
      .put("/VentaInsumo", null, {
        params: {
          id: Number(formInsumo.id),
          cantidad: Number(formInsumo.cantidad),
        },
      })
      .then((response) => console.log(response));
  };

  const { dataVentas, fetchVentas } = useVentasV2({ idCliente: dataTemporal, sucursal: dataUsuarios2[0]?.sucursal });

  const [fechaHoy, setFechaHoy] = useState("");

  useEffect(() => {
    const obtenerFechaHoy = () => {
      const fecha = new Date();
      const opcionesFecha = { year: "numeric", month: "numeric", day: "numeric" };
      const fechaFormateada = fecha.toLocaleDateString(undefined, opcionesFecha);
      setFechaHoy(fechaFormateada);
    };

    obtenerFechaHoy();
  }, []);

  const obtenerHoraFormateada = (hora: any) => {
    const fecha = new Date(hora);
    const horaFormateada = fecha.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    return horaFormateada;
  };

  useEffect(() => {
    setTotal(dataVentas.reduce((total, objeto) => total + (objeto.Precio ?? 0), 0));
    setTiempo(dataVentas.reduce((total, objeto) => total + (objeto.tiempo ?? 0), 0));
  }, [dataVentas]);

  const TicketPrint: React.FC<TicketPrintProps> = ({ children }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    return (
      <div>
        <div ref={componentRef}>{children}</div>
        <button onClick={handlePrint}>Imprimir ticket</button>
      </div>
    );
  };

  useEffect(() => {
    const dates = dataVentas.map((item) => new Date(item.hora));
    const oldestDate = new Date(Math.min.apply(null, dates));
    const year = oldestDate.getFullYear();
    const month = String(oldestDate.getMonth() + 1).padStart(2, "0"); // El mes comienza desde 0, por lo que se le suma 1
    const day = String(oldestDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setFechaVieja(formattedDate);
    // ESTILISTAS EN PROCESO...
    const estilistasUnicos = dataVentas.reduce((listaEstilistas, estilista) => {
      const { d_estilista, User, No_venta, Cve_cliente, Observacion } = estilista;
      if (
        Observacion === "SERV" &&
        !listaEstilistas.some(
          (item) => item.d_estilista === d_estilista && item.User === User && item.No_venta === No_venta && item.Cve_cliente === Cve_cliente
        )
      ) {
        listaEstilistas.push({ d_estilista, User, No_venta, Cve_cliente });
      }
      return listaEstilistas;
    }, []);
    setEstilistaProceso(estilistasUnicos);
  }, [dataVentas]);

  const postEstilistaTicket = (dato: any) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19);
    console.log(formattedDate);
    jezaApi
      .get(
        `/TicketInsumosEstilsta?cia=2&sucursal=21&f1=${fechaVieja}&f2=${formattedDate}&estilista=${dato.User}&cte=${dato.Cve_cliente}&noVenta=${dato.No_venta}`
      )
      .then((response) => {
        setDatoTicketEstilista(response.data);
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const [productoSelected, setProductoSelected] = useState<number[]>([]);
  useEffect(() => {
    const descripciones = dataVentas ? dataVentas.map((item) => item.Clave_prod) : [];
    setProductoSelected(descripciones);
    console.log(descripciones);
  }, [dataVentas]);

  const endVenta = () => {
    jezaApi.put(`/VentaCierre?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1`).then(() => {
      Swal.fire({
        icon: "success",
        text: "Venta finalizada con éxito",
        confirmButtonColor: "#3085d6",
      });
      setDataTemporal({
        Caja: 1,
        cancelada: false,
        Cant_producto: 0,
        Cia: 0,
        Clave_Descuento: 0,
        Clave_prod: 0,
        Corte: 0,
        Corte_parcial: 0,
        Costo: 0,
        Credito: false,
        Cve_cliente: 0,
        Descuento: 0,
        Fecha: "20230724",
        folio_estilista: 0,
        hora: 0,
        idEstilista: 0,
        ieps: 0,
        No_venta: 0,
        Observacion: "",
        Precio: 0,
        Precio_base: 0,
        Sucursal: 0,
        Tasa_iva: 0,
        terminado: false,
        tiempo: 0,
        Usuario: 0,
        validadoServicio: false,
        cliente: "",
        estilista: "",
        id: 0,
        producto: "",
      });
      anticipoPost();
    });
  };

  const { dataAnticipos } = useAnticipoVentas({ cliente: Number(dataTemporal.Cve_cliente), suc: dataUsuarios2[0]?.sucursal });
  // ////////////////////////////////////
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
      renderCell: (params) => <p>{params.row.fecha.split("T")[0]}</p>,
      flex: 1, // Ancho flexible
      minWidth: 150, // Ancho mínimo

      headerClassName: "custom-header",
    },
  ];

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <Button
          onClick={() => {
            setFormPago({ ...formPago, anticipos: Number(params.row.importe) });
            setFormAnticipo({
              ...formAnticipo,
              id: params.row.id,
              referencia: params.row.referencia,
              observaciones: params.row.observaciones,
              importe: params.row.importe,
            });
            // console.log(formAnticipo);
            setModalAnticipo(false);
          }}
        >
          Seleccionar
        </Button>
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

  const anticipoPost = () => {
    jezaApi
      .post("/AnticipoAplicado", null, {
        params: {
          cia: 21,
          sucursal: dataUsuarios2[0]?.sucursal,
          caja: 1,
          fecha: fechaHoy,
          no_venta: 10,
          fechaMovto: 20230726,
          idCliente: dataTemporal.Cve_cliente,
          idUsuario: dataUsuarios2[0]?.id,
          tipoMovto: 1,
          referencia: formAnticipo.referencia,
          importe: formAnticipo.importe,
          observaciones: formAnticipo.observaciones,
          idAnticipo: formAnticipo.id,
        },
      })
      .then(() => {
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            text: "Venta finalizada con éxito",
            confirmButtonColor: "#3085d6",
          });
        }, 1500);
      });
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        <h1>Venta </h1>
        <br />
        <Row>
          <Col md={"8"}>
            <Row className="align-items-end">
              <Col md={"10"}>
                <Label>Cliente</Label>
                <Input disabled value={dataTemporal.cliente ? dataTemporal.cliente : ""} onChange={cambios} name={"Cve_cliente"} />
              </Col>
              <Col md={"1"}>
                <Button onClick={() => setModalCliente(true)}>Elegir</Button>
              </Col>
            </Row>
          </Col>
          <Col md={"4"}>
            <br />
            <Label>Fecha de venta: {fechaHoy}</Label>
            <br />
            <Label>Sucursal: BARRIO</Label>
            <br />
            <Label> Usuario: {dataUsuarios2 ? dataUsuarios2[0]?.nombre.toLocaleUpperCase() : ""} </Label>
            {/* <Label>Usuario: {dataUsuarios[0].d_perfil ? dataUsuarios[0].d_perfil : "cbinfortmatica"}</Label> */}
          </Col>
        </Row>
        <br />
        <br />
        <div className=" d-flex justify-content-end px-5">
          <Button
            color="secondary"
            onClick={() => {
              if (dataTemporal.cliente) {
                setModalOpen(true);
              } else {

                Swal.fire("Ingrese un cliente");

              }
            }}
          >
            Agregar venta o servicio
          </Button>
        </div>

        <br />
        <Alert style={{ width: 400, marginLeft: 20 }} color="success" isOpen={visible} toggle={onDismiss}>
          Venta registrada con éxito
        </Alert>
        <br />
        <br />
        <Table size="sm" striped={true} responsive={"sm"}>
          <thead>
            <tr>
              {TableDataHeader.map((valor: any) => (
                <th key={valor}>{valor}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataVentas.map((dato: Venta) => (
              <tr key={dato.id}>
                {dato.Cia ? (
                  <>
                    <td>{dato.d_estilista}</td>
                    <td>{dato.d_producto}</td>
                    <td>{dato.Cant_producto}</td>
                    <td>{"$" + dato.Precio_base.toFixed(2)}</td>
                    <td>{dato.Descuento.toFixed(2)}</td>
                    <td>{"$" + dato.Precio.toFixed(2)}</td>
                    <td>{obtenerHoraFormateada(dato.hora)}</td>
                    <td>{dato.tiempo + " min"}</td>
                    <td className="gap-5">
                      <AiFillDelete
                        color="lightred"
                        onClick={() => {
                          console.log(dato);
                          deleteVenta(dato);
                          setTimeout(() => {
                            fetchVentas();
                          }, 1000);
                        }}
                        size={23}
                      />
                      {dato.Observacion === "SERV" ? (
                        <GrStakeholder
                          className="mr-2"
                          onClick={() => {
                            setSelectedID(dato.id ? dato.id : null);
                            setDatoVentaSeleccionado(dato);
                            setModalOpenInsumos(true);
                          }}
                        ></GrStakeholder>
                      ) : null}
                    </td>
                  </>
                ) : null}
              </tr>
            ))}
          </tbody>
        </Table>
        <br />
        <hr />

        <Row>
          <Col md={"8"} className="">
            <br />
            <div className="d-flex  justify-content-start">
              <Button
                style={{ marginRight: 25 }}
                disabled={dataVentas.length > 0 ? false : true}
                color="success"
                onClick={() => {
                  setModalOpenPago(true);
                  setTotal(dataVentas.reduce((total, objeto) => total + (objeto.Precio ?? 0), 0));
                }}
              >
                Cobro
              </Button>

              <Button
                style={{ marginRight: 25 }}
                color="success"
                disabled={estilistaProceso.length > 0 ? false : true}
                onClick={() => {
                  setModalEstilistaSelector(true);
                }}
              >
                Estilistas ticket
              </Button>
              <Button
                style={{ marginRight: 25 }}
                color="secondary"
                onClick={() => {
                  setModalClientesProceso(true);
                }}
              >
                Clientes en proceso
              </Button>
            </div>
          </Col>
          <Col md={"2"} className="mt-4">
            <p>Total : {total.toFixed(2)}</p>
            <p>Tiempo estimado: {tiempo + " min"} </p>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modalOpenVenta} size="lg">
        <ModalHeader>
          <div>
            <h3>Venta</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Producto/servicio</Label>
          <Row>
            <Col>
              <Input disabled defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} />
            </Col>
            <Col md={2}>
              <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
            </Col>
          </Row>
          <br />
          <Label>Estilista</Label>
          <Row>
            <Col>
              <Input disabled defaultValue={dataTemporal.estilista ? dataTemporal.estilista : ""} />
            </Col>
            <Col md={2}>
              <Button onClick={() => setModalOpen2(true)}>Elegir</Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Label>Cantidad en existencia </Label>
              <Input disabled placeholder="Cantidad en existencia" onChange={cambios} name="d_existencia" defaultValue={dataTemporal.d_existencia} />
            </Col>
            <Col>
              <Label>Cantidad a vender</Label>
              <Input placeholder="Cantidad" onChange={cambios} name="Cant_producto" defaultValue={1} />
            </Col>
          </Row>
          <br />

          <Label>Tipo de descuento</Label>
          <Input type="select" name="Clave_Descuento" id="exampleSelect" value={dataTemporal.Clave_Descuento} onChange={cambios}>
            <option value={0}>-Selecciona El tipo de descuento-</option>
            {dataDescuentos.map((descuento) => (
              <option value={descuento.id}>{descuento.descripcion}</option>
            ))}
          </Input>

          <br />
          <Label>Descuento: </Label>
          <Row>
            <Col md={"12"}>
              <Input name="Descuento" onChange={cambios} placeholder="0.0"></Input>
            </Col>
          </Row>
          <br />

          <Label style={{ marginRight: 10 }}>Hora de servicio</Label>
          <select id="hora" name="hora" onChange={cambios} defaultValue={dataTemporal.hora}>
            {generarOpcionesDeTiempo()}
          </select>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpen(false);
              setDataTemporal((prevData) => ({
                ...datosInicialesArreglo[0],
                cliente: prevData.cliente,
                Cve_cliente: prevData.Cve_cliente,
              }));
            }}
            text="Salir"
          />
          <Button
            color="primary"
            disabled={dataTemporal.producto || dataTemporal.cliente ? false : true}
            onClick={() => {
              if (Number(dataTemporal.d_existencia) < dataTemporal.Cant_producto) {
                Swal.fire({
                  icon: "info",
                  text: "Este producto no cuenta con suficientes existencias",
                });
              } else {
                setModalOpen(false);
                if (dataTemporal.producto) {
                  setdata([...data, dataTemporal]);
                  insertar();
                  setDataTemporal((prevData) => ({
                    ...datosInicialesArreglo[0],
                    cliente: prevData.cliente,
                    Cve_cliente: prevData.Cve_cliente,
                  }));
                }
              }
            }}
          >
            Agregar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen2} size="md">
        <ModalHeader>
          <TableEstilistas data={dataTrabajadores} setModalOpen2={setModalOpen2}></TableEstilistas>
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpen2(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen3} size="lg" toggle={() => setModalOpen3(false)}>
        <ModalHeader>
          <TableProductos
            productoSelected={productoSelected}
            sucursal={dataUsuarios2 ? dataUsuarios2[0]?.sucursal : 21}
            data={data}
            setModalOpen2={setModalOpen3}
          ></TableProductos>
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpen3(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalClientesProceso} size="md">
        <ModalHeader> Clientes en proceso </ModalHeader>
        <ModalBody>
          <TableClientesProceso data={data} setModalOpen2={setModalClientesProceso}></TableClientesProceso>
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalClientesProceso(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalCliente} size="md">
        <ModalHeader> Cliente </ModalHeader>
        <ModalBody>
          <TableCliente data={dataClientes} setModalCliente={setModalCliente}></TableCliente>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalCliente(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>

      <ModalActualizarLayout
        modalActualizar={modalActualizar}
        editar={() => {
          setModalActualizar(false);
        }}
        cerrarModalActualizar={cerrarModalActualizar}
        form={dataTemporal}
        nombreActualizar="Editar venta / servicio"
      >
        <Label>Cliente</Label>
        <Input disabled defaultValue={dataTemporal.cliente ? dataTemporal.cliente : ""} onChange={cambios} name={"cve_cliente"} />
        <Label>Producto/servicio</Label>
        <Row>
          <Col>
            <Input defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} />
          </Col>
          <Col md={2}>
            <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
          </Col>
        </Row>
        <br />
        <Label>Estilista</Label>
        <Row>
          <Col>
            <Input defaultValue={dataTemporal.estilista ? dataTemporal.estilista : ""} />
          </Col>
          <Col md={2}>
            <Button onClick={() => setModalOpen2(true)}>Elegir</Button>
          </Col>
        </Row>
        <br />
        <Label>Cantidad</Label>
        <Input placeholder="Cantidad" onChange={cambios} name="Cant_producto" defaultValue={dataTemporal.Cant_producto} />
        <br />
        <Label>Cantidad en existencia </Label>
        <Input disabled placeholder="Cantidad en existencia" onChange={cambios} name="d_existencia" defaultValue={dataTemporal.d_existencia} />
        <br />
        <Label style={{ marginRight: 10 }}>Hora de servicio</Label>
        {/* <select id="hora" name="hora" onChange={cambios} value={dataTemporal.hora}>
          {generarOpcionesDeTiempo()}
        </select> */}
        <Input type="datetime-local" id="hora" name="hora" onChange={cambios} value={dataTemporal.hora}></Input>
      </ModalActualizarLayout>

      <Modal isOpen={modalOpenPago} size="md">
        <ModalHeader>Pago total: {total}</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="7">
              <Label>TOTAL DE ESTA VENTA: </Label>
            </Col>
            <Col md="5">
              <Input disabled value={total}></Input>
            </Col>
          </Row>
          <hr className="my-4" />

          <Row>
            <Col md="7">
              <Label>PAGO EN EFECTIVO: </Label>
            </Col>
            <Col md="5">
              <Input type="number" onChange={cambiosPagos} name="efectivo"></Input>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="7">
              <Label>PAGO TARJETA DEBITO / CREDITO: </Label>
            </Col>
            <Col md="5">
              <Input type="number" onChange={cambiosPagos} name="tc"></Input>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="5">
              <Label>APLICACIÓN DE ANTICIPO: </Label>
            </Col>
            <Col md="3">
              <Button onClick={() => setModalAnticipo(true)}>Seleccionar</Button>
            </Col>
            <Col md="4">
              <Input type="number" onChange={cambiosPagos} value={formPago.anticipos} name="anticipos"></Input>
            </Col>
          </Row>
          <hr className="my-4" />
          <Row>
            <Col md="7">
              <Label>TOTAL DE PAGOS: </Label>
            </Col>
            <Col md="5">
              <Input disabled onChange={cambiosPagos} name="totalPago" value={formPago.totalPago}></Input>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="7">
              <Label>CAMBIO AL CLIENTE: </Label>
            </Col>
            <Col md="5">
              {/* <Input name="cambioCliente" value={formPago.cambioCliente > 0 ? formPago.cambioCliente : 0} disabled></Input> */}
              <Input name="cambioCliente" value={formPago.cambioCliente} disabled></Input>
            </Col>
          </Row>
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpenPago(false);
            }}
            text="Salir"
          />
          <CButton
            color="success"
            onClick={() => {
              if (formPago.cambioCliente >= 0) {
                setModalOpenPago(false);
                createInsumo();
                setModalTicket(true);
                setDataTemporal({ Cve_cliente: 0 });
                setFormPago({ anticipos: 0, cambioCliente: 0, efectivo: 0, tc: 0, totalPago: 0 });
                endVenta();
              } else {
                alert("Error, falta dinero");
              }
            }}
            text="Cobrar"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpenInsumos} size="md">
        <ModalHeader>Insumos del servicio {datoVentaSeleccionado.d_producto}</ModalHeader>
        <ModalBody>
          <Row className="justify-content-end">
            <Col md={5}>
              <Label> Selecciona los insumos </Label>
            </Col>
            <Col md={2}>
              <Button onClick={() => setModalOpenInsumosSelect(true)}>Elegir</Button>
            </Col>
          </Row>
          <br />
          <br />
          <Table size="sm" striped={true} responsive={"sm"}>
            <thead>
              <tr>
                {TableDataHeaderInsumo.map((valor: any) => (
                  <th key={valor}>{valor}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datoInsumosProducto.map((dato: VentaInsumo) => (
                <tr key={dato.id}>
                  {dato.id ? (
                    <>
                      <td>{dato.d_insumo}</td>
                      <td align="center">{dato.cantidad}</td>
                      <td align="center">{dato.unidadMedida}</td>
                      <td className="gap-5">
                        <AiFillEdit
                          className="mr-2"
                          onClick={() => {
                            setModalEditInsumo(true);
                            setFormInsumo(dato);
                          }}
                          size={23}
                        ></AiFillEdit>
                        <AiFillDelete
                          color="lightred"
                          onClick={() => {
                            deleteInsumo(dato);
                            setTimeout(() => {
                              fetchInsumosProducto();
                            }, 1000);
                          }}
                          size={23}
                        />
                      </td>
                    </>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpenInsumos(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpenInsumosSelect} size="xl">
        <ModalBody>
          <Row>
            <Label> Selecciona el insumo </Label>
          </Row>
          <br />
          <TableInsumosGenerales
            datoVentaSeleccionado={selectedID2}
            data={data}
            setModalOpen2={setModalOpenInsumosSelect}
            handleGetFetch={fetchInsumosProducto}
          ></TableInsumosGenerales>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpenInsumosSelect(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditInsumo} size="md">
        <ModalBody>
          <Row>
            <Label> Insumo: {formInsumo.d_insumo} </Label>
            <br />
            <br />
            <Label> Cantidad a modificar: </Label>
            <Input value={formInsumo.cantidad} name="cantidad" onChange={cambiosInsumos} type="number"></Input>
            <br />
            <br />
            <br />
            <Button
              style={{ width: "22%" }}
              onClick={() => {
                editInsumo();
                setTimeout(() => {
                  setModalEditInsumo(false);
                  fetchInsumosProducto();
                }, 1000);
              }}
            >
              Guardar
            </Button>
          </Row>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalEditInsumo(false);
            }}
            text="Cancelar"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalTicket} size="sm">
        <ModalHeader>Preview de ticket</ModalHeader>
        <ModalBody>
          <br />
          <Row>
            <TicketPrint>
              <div className="text-center">
                {datoTicket.map((ticket) => (
                  <>
                    <Label> {ticket.mensaje2} </Label>
                    <br />
                  </>
                ))}
              </div>
              <br />
            </TicketPrint>
          </Row>
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalTicket(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEstilistaSelector} size="sm">
        <ModalHeader>Seleccione el estilista para el ticket</ModalHeader>
        <ModalBody>
          <Table size="sm" striped={true} responsive={"sm"}>
            <thead>
              <tr>
                {TabñeDataHeaderEstilistaProceso.map((valor: any) => (
                  <th key={valor}>{valor}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {estilistaProceso.map((dato: any) => (
                <tr key={dato.User}>
                  <>
                    <td> {dato.d_estilista} </td>
                    <td>
                      <Button
                        onClick={() => {
                          postEstilistaTicket(dato);
                          setModalTicketEstilista(true);
                        }}
                      >
                        Seleccionar
                      </Button>
                    </td>
                  </>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalEstilistaSelector(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalTicketEstilista} size="sm">
        <ModalHeader>Preview de ticket</ModalHeader>
        <ModalBody>
          <br />
          <Row>
            <TicketPrint>
              <div className="text-center">
                {datoTicketEstilista.length > 0 ? (
                  datoTicketEstilista.map((ticket) => (
                    <>
                      <Label> {ticket.LINEA} </Label>
                      <br />
                    </>
                  ))
                ) : (
                  <h5>Este estilista no se le han asignado insumos a su servicio</h5>
                )}
              </div>
              <br />
            </TicketPrint>
          </Row>
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalTicketEstilista(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalAnticipo} size="xl">
        <ModalHeader>Selección de anticipo</ModalHeader>
        <ModalBody>
          <br />
          <DataTable></DataTable>
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalAnticipo(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Ventas;
