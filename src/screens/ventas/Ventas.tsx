// import React, { useEffect, useState, useRef, useMemo } from "react";
// import { useReactToPrint } from "react-to-print";
// import CFormGroupInput from "../../components/CFormGroupInput";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   Alert,
//   Button,
//   ButtonGroup,
//   Col,
//   Container,
//   FormGroup,
//   Input,
//   Label,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
//   InputGroup,
//   Row,
//   Table,
//   Card,
//   CardBody,
//   CardTitle,
//   CardSubtitle,
//   CardText,
// } from "reactstrap";
// import SidebarHorizontal from "../../components/SidebarHorizontal";
// import useModalHook from "../../hooks/useModalHook";
// import CButton from "../../components/CButton";
// import TableEstilistas from "./Components/TableEstilistas";
// import TableProductos, { InsumoExistencia, ProductoExistencia } from "./Components/TableProductos";
// import TableClientesProceso from "./Components/TableClientesProceso";
// import TableCliente from "./Components/TableCliente";
// import ModalActualizarLayout from "../../layout/ModalActualizarLayout";
// import { useClientes } from "../../hooks/getsHooks/useClientes";
// import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";
// import { jezaApi } from "../../api/jezaApi";
// import { Usuario } from "../../models/Usuario";
// import { Venta } from "../../models/Venta";
// import { useVentasV2 } from "../../hooks/getsHooks/useVentasV2";
// import { AiFillDelete, AiFillEdit } from "react-icons/ai";
// import { GrStakeholder } from "react-icons/gr";
// import TableInsumosGenerales from "./Components/TableInsumosGenerales";
// import { useInsumosProductos } from "../../hooks/getsHooks/useInsumoProducto";
// import { VentaInsumo } from "../../models/VentaInsumo";
// import { useDescuentos } from "../../hooks/getsHooks/useClientesProceso copy";
// import { UserResponse } from "../../models/Home";
// import Swal from "sweetalert2";
// import { AnticipoGet } from "../../models/Anticipo";
// import { useAnticipoVentas } from "../../hooks/getsHooks/useAnticipoVentas";
// import { useFormasPagos } from "../../hooks/getsHooks/useFormasPagos";
// import { FormaPago } from "../../models/FormaPago";
// import TimeKeeper from "react-timekeeper";
// import { useVentasProceso } from "../../hooks/getsHooks/useVentasProceso";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { MdOutlineReceiptLong, MdAttachMoney, MdAccessTime, MdDataSaverOn, MdPendingActions, MdEmojiPeople } from "react-icons/md";
// import { format } from "date-fns";
// import TableHistorial from "./Components/TableHistorial";
// import TableAnticipos from "./Components/TableAnticipos";
// import useSeguridad from "../../hooks/getsHooks/useSeguridad";
// import { useNavigate } from "react-router-dom";
// import { FaCashRegister } from "react-icons/fa";
// import { BsCashCoin } from "react-icons/bs";
// import { useProductosFiltradoExistenciaProductoAlm } from "../../hooks/getsHooks/useProductosFiltradoExistenciaProductoAlm";
// import axios from "axios";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { useInsumosProductosResumen } from "../../hooks/getsHooks/useInsumoProductoResumen";
// import { ALMACEN } from "../../utilities/constsAlmacenes";
// import TableTiendaVirtual from "./Components/TableTiendaVirtual";
// import { Cliente } from "../../models/Cliente";

// interface TicketPrintProps {
//   children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
// }
// const Ventas = () => {
//   const { filtroSeguridad, session } = useSeguridad();
//   const [showView, setShowView] = useState(true);

//   useEffect(() => {
//     const item = localStorage.getItem("userLoggedv2");
//     if (item !== null) {
//       const parsedItem = JSON.parse(item);
//       setDataUsuarios2(parsedItem);
//       console.log({ parsedItem });

//       getPermisoPantalla(parsedItem);
//     }
//   }, []);


//   const getPermisoPantalla = async (userData) => {
//     try {
//       const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_ventas_view`);

//       if (Array.isArray(response.data) && response.data.length > 0) {
//         if (response.data[0].permiso === false) {
//           Swal.fire("Error!", "No tiene los permisos para ver esta pantalla", "error");
//           setShowView(false);
//           handleRedirect();
//         } else {
//           setShowView(true);
//         }
//       } else {
//         // No se encontraron datos válidos en la respuesta.
//         setShowView(false);
//       }
//     } catch (error) {
//       console.error("Error al obtener el permiso:", error);
//     }
//   };

//   const navigate = useNavigate();
//   const handleRedirect = () => {
//     navigate("/app"); // Redirige a la ruta "/app"
//   };

//   const { modalActualizar, setModalActualizar, cerrarModalActualizar } = useModalHook();
//   const [modalActualizar2, setModalActualizar2] = useState(false)
//   const [modalOpenVenta, setModalOpen] = useState<boolean>(false);
//   const [modalOpenVentaEdit, setModalOpenVentaEdit] = useState<boolean>(false);
//   const [modalOpen2, setModalOpen2] = useState<boolean>(false);
//   const [modalOpen3, setModalOpen3] = useState<boolean>(false);
//   const [modalOpenPago, setModalOpenPago] = useState<boolean>(false);
//   const [modalOpenPromo, setModalOpenPromo] = useState<boolean>(false);
//   const [modalOpenInsumos, setModalOpenInsumos] = useState<boolean>(false);
//   const [modalOpenInsumosSelect, setModalOpenInsumosSelect] = useState<boolean>(false);
//   const [modalEditInsumo, setModalEditInsumo] = useState<boolean>(false);
//   const [modalClientesProceso, setModalClientesProceso] = useState<boolean>(false);
//   const [modalCliente, setModalCliente] = useState<boolean>(false);
//   const [modalTicket, setModalTicket] = useState<boolean>(false);
//   const [modalTicketEstilista, setModalTicketEstilista] = useState<boolean>(false);
//   const [modalAnticipo, setModalAnticipo] = useState<boolean>(false);
//   const [modalTiendaVirtual, setModalTiendaVirtual] = useState<boolean>(false);
//   const [modalTipoVenta, setModalTipoVenta] = useState<boolean>(false);
//   const [modalEstilistaSelector, setModalEstilistaSelector] = useState<boolean>(false);

//   const [total, setTotal] = useState<number>(0);
//   const [tiempo, setTiempo] = useState<number>(0);
//   const [hora, setHora] = useState<string>("");

//   const [validacion, setValidacion] = useState(false);
//   const [dataVentasValidacion, setDataVentasValidacion] = useState<Venta[]>();
//   const [dataVentasOld, setDataVentasOld] = useState<Venta[]>();

//   const [visible, setVisible] = useState<boolean>(false);
//   const [estilistaProceso, setEstilistaProceso] = useState([
//     {
//       d_estilista: "",
//       User: 0,
//       No_venta: 0,
//       Cve_cliente: 0,
//     },
//   ]);
//   const [fechaVieja, setFechaVieja] = useState("");
//   const [arregloTemporal, setArregloTemporal] = useState<{ importe: number; formaPago: number; referencia: string }[]>([]);
//   const [dataArregloTemporal, setDataArregloTemporal] = useState({
//     formaPago: 0,
//     importe: 0,
//     d_formaPago: "",
//     referencia: "",
//   });

//   const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

//   const { dataClientes, fetchClientes } = useClientes();
//   const { dataTrabajadores } = useNominaTrabajadores();
//   const { dataDescuentos } = useDescuentos();
//   const [formasPagosFiltradas, setFormasPagosFiltradas] = useState<FormaPago[]>([]);

//   const { dataFormasPagos } = useFormasPagos();

//   const [form, setForm] = useState<Usuario[]>([]);
//   const [datoTicket, setDatoTicket] = useState([]);
//   const [datoTicketEstilista, setDatoTicketEstilista] = useState([]);
//   const { dataVentasProcesos, fetchVentasProcesos } = useVentasProceso({ idSucursal: dataUsuarios2[0]?.sucursal });

//   const nombreClienteParam = new URLSearchParams(window.location.search).get("nombreCliente");
//   const nombreCliente = nombreClienteParam ? nombreClienteParam.replace(/%20/g, "").replace(/#/g, "") : "";
//   const idCliente = new URLSearchParams(window.location.search).get("idCliente");
//   const [correoCliente, setCorreoCliente] = useState("")

//   useEffect(() => {
//     setDataTemporal((prevDataTemporal) => ({
//       ...prevDataTemporal,
//       cliente: nombreCliente ? nombreCliente.toString() : "",
//       Cve_cliente: Number(idCliente),
//     }));
//   }, [nombreCliente, idCliente]);

//   const [datoVentaSeleccionado, setDatoVentaSeleccionado] = useState<any>({
//     Caja: 1,
//     Cant_producto: 1,
//     Cia: 26,
//     Clave_Descuento: 0,
//     Clave_prod: 5426,
//     Corte: 1,
//     Corte_parcial: 1,
//     Costo: 1,
//     Cve_cliente: 24,
//     Descuento: 0,
//     Fecha: "2023-06-14T00:10:57.817",
//     No_venta: 0,
//     No_venta_original: 0,
//     Observacion: "x",
//     Precio: 0,
//     Precio_base: 0,
//     Sucursal: 21,
//     Tasa_iva: 0.16,
//     User: 54,
//     cancelada: false,
//     d_cliente: "LUIS ALBERTO",
//     d_estilista: null,
//     d_producto: "OXIDANTE CREMA 20 VOL. frasco 1l",
//     d_sucursal: "Barrio",
//     folio_estilista: "0",
//     hora: "2023-06-14T00:10:57.817",
//     id: 0,
//     no_venta2: 0,
//     terminado: false,
//     tiempo: 0,
//     validadoServicio: false,
//   });

//   const [formInsumo, setFormInsumo] = useState<VentaInsumo>({
//     id: 0,
//     id_insumo: 0,
//     id_venta: 0,
//     cantidad: 0,
//     fechaAlta: "",
//     unidadMedida: "",
//     d_insumo: "",
//     existencia: 1,
//   });

//   const [selectedID2, setSelectedID] = useState(0);

//   const [formPago, setFormPago] = useState({
//     efectivo: 0,
//     tc: 0,
//     anticipos: 0,
//     totalPago: 0,
//     tiendaVirtual: 0,
//     cambioCliente: 0,
//   });
//   const [formAnticipo, setFormAnticipo] = useState<AnticipoGet>({
//     caja: 0,
//     cia: 0,
//     fecha: "",
//     fechaMovto: "",
//     id: 0,
//     idCliente: 0,
//     idUsuario: 0,
//     importe: 0,
//     no_venta: 0,
//     nombreCia: "",
//     nombreSuc: "",
//     nombreUsr: "",
//     observaciones: "",
//     referencia: "",
//     sucursal: 0,
//     tipoMovto: 0,
//     d_cliente: "",
//     idformaPago: 0,
//   });

//   useEffect(() => {
//     const item = localStorage.getItem("userLoggedv2");
//     if (item !== null) {
//       try {
//         const parsedItem = JSON.parse(item);
//         setForm(parsedItem);
//       } catch (error) {
//         // Handle the error appropriately, e.g., log it or show an error message to the user.
//         console.error("Error parsing JSON from localStorage:", error);
//       }
//     }
//   }, []);

//   const onDismiss = () => {
//     setVisible(false);
//   };
//   const [dataVentaEdit, setDataVentaEdit] = useState<Venta>({
//     id: 0,
//     Sucursal: 0,
//     Fecha: "",
//     Caja: 1,
//     No_venta: 1,
//     Clave_prod: 1,
//     Cant_producto: 0,
//     Precio: 0,
//     Precio_base: 0,
//     Cve_cliente: 0,
//     Tasa_iva: 0.16,
//     ieps: 0,
//     Observacion: "",
//     Descuento: 0,
//     Clave_Descuento: 0,
//     Usuario: 0,
//     Credito: false,
//     Corte: 1,
//     Corte_parcial: 1,
//     Costo: 1,
//     cancelada: false,
//     idEstilista: 1,
//     folio_estilista: 1,
//     hora: 8,
//     tiempo: 1,
//     terminado: false,
//     validadoServicio: false,
//     Cia: 0,
//     cliente: "",
//     d_estilista: "",
//     d_producto: "",
//     d_existencia: "",
//     estilista: "",
//     producto: "",
//     formaPago: 0,
//     existenciaEdit: 0,
//   });
//   const datosInicialesArreglo = [
//     {
//       id: 4,
//       Cia: 2,
//       Sucursal: 1,
//       Fecha: "2023-06-13T00:00:00",
//       Caja: 1,
//       No_venta: 0,
//       no_venta2: 0,
//       Clave_prod: 5425,
//       Cant_producto: 0,
//       idEstilista: 0,
//       Precio: 0.0,
//       Cve_cliente: 6,
//       Tasa_iva: 0.16,
//       Observacion: "x",
//       Descuento: 0.0,
//       Clave_Descuento: 0,
//       User: 55,
//       Corte: 1,
//       Corte_parcial: 1,
//       Costo: 1.0,
//       Precio_base: 0.0,
//       No_venta_original: 0,
//       cancelada: false,
//       folio_estilista: 0,
//       // hora: "2023-06-13T00:00:00",
//       hora: new Date(),
//       tiempo: 0,
//       terminado: false,
//       validadoServicio: false,
//       ieps: 0,
//       Usuario: 0,
//       Credito: false,
//       idestilistaAux: 0,
//       idRecepcionista: 0,
//     },
//   ];
//   const [dataTemporal, setDataTemporal] = useState<Venta>({
//     id: 0,
//     Sucursal: 0,
//     Fecha: "",
//     Caja: 1,
//     No_venta: 1,
//     Clave_prod: 1,
//     Cant_producto: 1,
//     Precio: 0,
//     Precio_base: 0,
//     Cve_cliente: 0,
//     Tasa_iva: 0.16,
//     ieps: 0,
//     Observacion: "",
//     Descuento: 0,
//     Clave_Descuento: 0,
//     Usuario: 0,
//     Credito: false,
//     Corte: 1,
//     Corte_parcial: 1,
//     Costo: 1,
//     cancelada: false,
//     idEstilista: 0,
//     folio_estilista: 1,
//     hora: new Date(),
//     tiempo: 1,
//     terminado: false,
//     validadoServicio: false,
//     Cia: 0,
//     cliente: "",
//     d_estilista: "",
//     d_producto: "",
//     d_existencia: "",
//     estilista: "",
//     producto: "",
//     formaPago: 0,
//     idestilistaAux: 0,
//     idRecepcionista: 0,
//   });

//   useEffect(() => {
//     const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//     setCorreoCliente(correo[0]?.email ? correo[0]?.email : 'SIN CORREOP')
//   }, [dataTemporal.Cve_cliente])


//   const [data, setdata] = useState<Venta[]>([]);
//   useEffect(() => {
//     setdata(datosInicialesArreglo);
//   }, []);

//   const TableDataHeader = [
//     "Estilista",
//     "Auxiliar",
//     "Producto/Servicio",
//     "Cantidad",
//     "Precio unitario",
//     "Precio total",
//     "Descuento autorizado",
//     "Importe",
//     "Acciones",
//   ];
//   const TableDataHeaderInsumo = ["Insumo", "Existencia", "Unidad de medida", "Cantidad", "Acciones"];
//   const TabñeDataHeaderEstilistaProceso = ["Estilista", ""];
//   const { datoInsumosProductoResumen, fetchInsumosProductoResumen } = useInsumosProductosResumen({
//     idVenta: selectedID2,
//   });

//   const [descuento, setDescuento] = useState({
//     min: 0,
//     max: 0,
//   });
//   const cambios = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === "hora") {
//       setDataTemporal((prev) => ({ ...prev, [name]: value }));
//       console.log(dataTemporal.hora);
//     } else if (name === "Clave_Descuento") {
//       setFlag(false);

//       const descuentito = dataDescuentos.find((objeto) => objeto.id === Number(value));
//       setDataTemporal({
//         ...dataTemporal,
//         Clave_Descuento: value,
//       });
//       setDescuento({
//         min: descuentito?.min_descto ? Number(descuentito?.min_descto) : 0,
//         max: descuentito?.max_descto ? Number(descuentito?.max_descto) : 0,
//       });
//       setTimeout(() => {
//         setFlag(true);
//       }, 2000);
//     } else {
//       setDataTemporal((prev) => ({ ...prev, [name]: value }));
//     }
//   };
//   const cambiosEdit = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === "hora") {
//       // const partesHora = value.split(":");
//       // const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
//       // const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
//       // let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut
//       setDataVentaEdit((prev) => ({ ...prev, [name]: value }));
//     } else if (name === "Clave_Descuento") {
//       setFlag(false);
//       const descuentito = dataDescuentos.find((objeto) => objeto.id === Number(value));
//       setDataVentaEdit({
//         ...dataVentaEdit,
//         Clave_Descuento: value,
//       });
//       setDescuento({
//         min: descuentito?.min_descto ? Number(descuentito?.min_descto) : 0,
//         max: descuentito?.max_descto ? Number(descuentito?.max_descto) : 0,
//       });
//       setTimeout(() => {
//         setFlag(true);
//       }, 2000);
//     } else {
//       setDataVentaEdit((prev) => ({ ...prev, [name]: value }));
//     }
//     console.log(name);
//   };

//   const [anticipoSelected, setAnticipoSelected] = useState(false);
//   const [tiendaVirtualSelected, setTiendaVirtualSelect] = useState(false);
//   const handleFormaPagoTemporal = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     // Comprueba si el método de pago seleccionado ya está en el arregloTemporal
//     const isAlreadySelected = arregloTemporal.some((pago) => Number(pago.formaPago) === Number(value));

//     if (isAlreadySelected && name === "formaPago") {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: `¡Método de pago ya seleccionado!`,
//         confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
//       });
//     } else if (name === "formaPago" && Number(value) === 94) {
//       setModalAnticipo(true);
//       setAnticipoSelected(true);
//       setDataArregloTemporal((prev) => ({ ...prev, [name]: value }));
//     } else if (name === "formaPago" && Number(value) === 245) {
//       setModalTiendaVirtual(true);
//       setAnticipoSelected(true);
//       setDataArregloTemporal((prev) => ({ ...prev, [name]: value }));
//     } else {
//       setAnticipoSelected(false);
//       setDataArregloTemporal((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const cambiosInsumos = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     setFormInsumo((prev) => ({ ...prev, [name]: value }));
//     console.log(formInsumo);
//   };
//   // SUMATORIAS
//   useEffect(() => {
//     const totalCobro = Number(formPago.anticipos) + Number(formPago.efectivo) + Number(formPago.tc);
//     const totalCambio = Number(totalCobro) - Number(total);
//     setFormPago((prev) => ({
//       ...prev,
//       totalPago: totalCobro.toFixed(2),
//       cambioCliente: Number(totalCambio.toFixed(2)),
//     }));
//     console.log({ formPago });
//   }, [formPago.anticipos, formPago.efectivo, formPago.tc]);

//   const [flag, setFlag] = useState(false);

//   useEffect(() => {
//     if (flag === true) {
//       const importeFinal = Number(dataTemporal.Precio) - Number(dataTemporal.Precio) * Number(dataTemporal.Descuento);
//       if (dataTemporal.Descuento > 0) {
//         setDataTemporal((prev) => ({ ...prev, Precio_base: importeFinal }));
//       } else {
//         setDataTemporal((prev) => ({ ...prev, Precio_base: dataTemporal.Precio }));
//       }
//     } else {
//       console.log("a");
//     }
//     console.log({ dataTemporal });
//   }, [dataTemporal?.Descuento]);

//   const generarOpcionesDeTiempo = () => {
//     const opciones = [];
//     for (let hora = 8; hora < 20; hora++) {
//       for (let minuto = 0; minuto < 60; minuto += 30) {
//         const horaFormateada = hora.toString().padStart(2, "0");
//         const minutoFormateado = minuto.toString().padStart(2, "0");
//         const tiempo = `${horaFormateada}:${minutoFormateado}`;
//         opciones.push(
//           <option key={tiempo} value={tiempo}>
//             {tiempo}
//           </option>
//         );
//       }
//     }
//     return opciones;
//   };

//   useEffect(() => {
//     const item = localStorage.getItem("userLoggedv2");
//     if (item !== null) {
//       const parsedItem = JSON.parse(item);
//       setDataUsuarios2(parsedItem);
//     }
//   }, []);

//   const insertar = async () => {
//     const permiso = await filtroSeguridad("CREAR_VENTA");
//     if (permiso === false) {
//       return; // Si el permiso es falso o los campos no son válidos, se sale de la función
//     }
//     const today2 = new Date();
//     const today = new Date();
//     let horaDateTime = "";
//     if (typeof dataTemporal.hora === "string") {
//       const partesHora = dataTemporal.hora.split(":");
//       const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
//       const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
//       let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut

//       const horaTempora = horaInt;
//       today.setHours(Math.floor(horaTempora));
//       today.setMinutes((horaTempora % 1) * 60);
//       today.setSeconds(0);
//       today.setMilliseconds(0);
//       horaDateTime = today.toISOString();
//     } else {
//       const horaTemp = "8:00";
//       const partesHora = horaTemp.split(":");
//       const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
//       const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
//       let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut

//       const horaTempora = horaInt;
//       today.setHours(Math.floor(horaTempora));
//       today.setMinutes((horaTempora % 1) * 60);
//       today.setSeconds(0);
//       today.setMilliseconds(0);
//       horaDateTime = today.toISOString();
//     }
//     if (dataTemporal.Cant_producto > 0) {
//       try {
//         await jezaApi
//           .post("/Venta", null, {
//             params: {
//               id: 0,
//               Cia: dataUsuarios2[0]?.idCia,
//               Sucursal: dataUsuarios2[0]?.sucursal,
//               Fecha: today2,
//               Caja: 1,
//               No_venta: 0,
//               no_venta2: 0,
//               Clave_prod: dataTemporal.Clave_prod,
//               Cant_producto: dataTemporal.Cant_producto,
//               Cve_cliente: dataTemporal.Cve_cliente,
//               Tasa_iva: "0.16",
//               Observacion: dataTemporal.Observacion,
//               Descuento: dataTemporal.Descuento ? dataTemporal.Descuento : 0,
//               Clave_Descuento: dataTemporal.Clave_Descuento ? dataTemporal.Clave_Descuento : 0,
//               usuario: dataTemporal.idEstilista,
//               Corte: 1,
//               Corte_parcial: 1,
//               Costo: 1,
//               Precio: dataTemporal.Precio,
//               Precio_base: dataTemporal.Precio,
//               No_venta_original: 0,
//               cancelada: false,
//               folio_estilista: 0,
//               // hora: horaDateTime,
//               hora: format(dataTemporal.hora, "HH:mm"),
//               tiempo: dataTemporal.tiempo == 0 ? 0 : dataTemporal.tiempo,
//               // tiempo: dataTemporal.tiempo == 0 ? 30 : dataTemporal.tiempo,
//               terminado: false,
//               validadoServicio: false,
//               ieps: "0",
//               Credito: false,
//               idEstilista: dataTemporal.idEstilista,
//               idestilistaAux: dataTemporal.idestilistaAux ? dataTemporal.idestilistaAux : 0,
//               idRecepcionista: dataUsuarios2[0]?.id,
//             },
//           })
//           .then(() => {
//             Swal.fire({
//               icon: "success",
//               text: "Venta registrada con éxito",
//               confirmButtonColor: "#3085d6",
//             });
//             fetchVentas();
//             setDataTemporal((prevData) => ({
//               ...datosInicialesArreglo[0],
//               Cant_producto: 1,
//               cliente: prevData.cliente,
//               Cve_cliente: prevData.Cve_cliente,
//             }));
//             setDescuento({ min: 0, max: 0 });
//           });
//       } catch (error) {
//         console.error(error);
//       }
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "Advertencia",
//         text: `El campo de cantidad a vender solo acepta numeros, favor de verificar`,
//         confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
//       });
//     }
//   };

//   const deleteVenta = async (dato: Venta): Promise<void> => {
//     const permiso = await filtroSeguridad("ELIMINAR_VENTA");
//     if (permiso === false) {
//       return; // Si el permiso es falso o los campos no son válidos, se sale de la función
//     }
//     Swal.fire({
//       title: "ADVERTENCIA",
//       text: `¿Está seguro que desea eliminar el registro: ${dato.d_producto}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Sí, eliminar",
//     }).then(async (result) => {
//       // Convierte esta función en una función asíncrona también.
//       if (result.isConfirmed) {
//         try {
//           await jezaApi
//             .delete(`/Venta?id=${dato.id}`)
//             .then((response) => console.log(response))
//             .then(() => {
//               Swal.fire({
//                 icon: "success",
//                 text: "Registro eliminado con éxito",
//                 confirmButtonColor: "#3085d6",
//               });
//               fetchVentas();
//             });
//         } catch (error) { }
//       }
//     });
//   };

//   const deleteInsumo = async (dato: VentaInsumo): Promise<void> => {
//     Swal.fire({
//       title: "ADVERTENCIA",
//       text: `¿Está seguro que desea eliminar el insumo: ${dato.d_insumo}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Sí, eliminar",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         try {
//           jezaApi.delete(`/VentaInsumo?id=${dato.id}`).then(() => fetchInsumosProductoResumen());
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     });
//   };

//   //EDITAR ORIGINAL

//   // const editInsumo = () => {
//   //   jezaApi
//   //     .put("/VentaInsumo", null, {
//   //       params: {
//   //         id: Number(formInsumo.id),
//   //         cantidad: Number(formInsumo.cantidad),
//   //       },
//   //     })
//   //     .then((response) =>
//   //       Swal.fire({
//   //         icon: "success",
//   //         text: "Insumo actualizada con éxito",
//   //         confirmButtonColor: "#3085d6",
//   //       })
//   //     );
//   // };
//   const editInsumo = () => {
//     // Verificar si los campos están vacíos
//     if (!formInsumo.id || !formInsumo.cantidad || formInsumo.cantidad <= 0) {
//       Swal.fire({
//         icon: "error",
//         text: "Por favor, complete todos los campos.",
//         confirmButtonColor: "#3085d6",
//       });
//       return; // Salir de la función si faltan campos
//     }
//     if (formInsumo.cantidad > formInsumo?.existencia) {
//       Swal.fire({
//         icon: "error",
//         title: "Alerta",
//         text: `No hay suficientes insumos en sucursal`,
//         confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
//       });
//       return;
//     } else {
//       // Si los campos no están vacíos, realizar la solicitud PUT a la API
//       jezaApi
//         .put("/VentaInsumo", null, {
//           params: {
//             id: Number(formInsumo.id),
//             cantidad: Number(formInsumo.cantidad),
//           },
//         })
//         .then((response) => {
//           fetchInsumosProductoResumen();
//           Swal.fire({
//             icon: "success",
//             text: "Insumo actualizada con éxito",
//             confirmButtonColor: "#3085d6",
//           });
//           setTimeout(() => {
//             setModalEditInsumo(false);
//             fetchInsumosProducto();
//           }, 1000);
//         });
//     }
//   };

//   const { dataVentas, fetchVentas } = useVentasV2({
//     idCliente: dataTemporal?.Cve_cliente,
//     sucursal: dataUsuarios2[0]?.sucursal,
//   });

//   const [fechaHoy, setFechaHoy] = useState("");
//   const [fechaHoyMedioPago, setFechaHoyMedioPago] = useState("");

//   useEffect(() => {
//     const obtenerFechaHoy = () => {
//       const fecha = new Date();
//       const opcionesFecha = { year: "numeric", month: "numeric", day: "numeric" };
//       const fechaFormateada = fecha.toLocaleDateString(undefined, opcionesFecha);
//       setFechaHoy(fechaFormateada);

//       // Usar fechaFormateada en lugar de fechaHoy
//       const [dia, mes, anio] = fechaFormateada.split("/");

//       // Resto del formateo
//       const mesFormateado = mes.length === 1 ? `0${mes}` : mes;
//       const diaFormateado = dia.length === 1 ? `0${dia}` : dia;
//       const fechaFormateada2 = `${anio}-${mesFormateado}-${diaFormateado}`;
//       setFechaHoyMedioPago(fechaFormateada2);
//     };

//     obtenerFechaHoy();
//   }, []);

//   useEffect(() => {
//     let totalPorProductoNormal = 0;
//     if (!validacion) {
//       setDataVentasOld(dataVentas);
//     } else {
//       setDataVentasValidacion(dataVentas);
//     }
//     dataVentas.forEach((producto) => {
//       totalPorProductoNormal += producto.Precio * producto.Cant_producto - producto.Precio * producto.Cant_producto * producto.Descuento;
//     });

//     setTotal(Number(totalPorProductoNormal.toFixed(2)));
//     setTiempo(dataVentas.reduce((total, objeto) => total + (objeto.tiempo ?? 0), 0));
//   }, [dataVentas]);

//   useEffect(() => {
//     let totalPorProductoOld = 0;
//     let totalPorProductoValidacion = 0;
//     if (dataVentasOld) {
//       dataVentasOld.forEach((producto) => {
//         totalPorProductoOld += producto.Precio * producto.Cant_producto - producto.Precio * producto.Cant_producto * producto.Descuento;
//       });
//     }
//     if (dataVentasValidacion) {
//       dataVentasValidacion.forEach((producto) => {
//         totalPorProductoValidacion += producto.Precio * producto.Cant_producto - producto.Precio * producto.Cant_producto * producto.Descuento;
//       });
//     }
//     if (totalPorProductoOld !== totalPorProductoValidacion && validacion) {
//       Swal.fire({
//         icon: "info",
//         text: "Los precios o los servicios de la venta han cambiado, favor de verificar",
//         confirmButtonColor: "#3085d6",
//       }).then((result) => {
//         if (result.isConfirmed) setModalOpenPago(false);
//       });

//       setValidacion(false);

//       setDataVentasOld(dataVentas);
//       return;
//     }
//   }, [dataVentasValidacion]);

//   const TicketPrint: React.FC<TicketPrintProps> = ({ children }) => {
//     const componentRef = useRef<HTMLDivElement>(null);

//     const handlePrint = useReactToPrint({
//       content: () => componentRef.current,
//     });

//     return (
//       <div>
//         <div ref={componentRef}>{children}</div>
//         <button onClick={handlePrint}>Imprimir ticket</button>
//       </div>
//     );
//   };

//   useEffect(() => {
//     const dates = dataVentas.map((item) => new Date(item.hora));
//     const oldestDate = new Date(Math.min.apply(null, dates));
//     const year = oldestDate.getFullYear();
//     const month = String(oldestDate.getMonth() + 1).padStart(2, "0"); // El mes comienza desde 0, por lo que se le suma 1
//     const day = String(oldestDate.getDate()).padStart(2, "0");

//     const formattedDate = `${year}-${month}-${day}`;
//     setFechaVieja(formattedDate);
//     // ESTILISTAS EN PROCESO...
//     const estilistasUnicos = dataVentas.reduce((listaEstilistas, estilista) => {
//       const { d_estilista, User, No_venta, Cve_cliente, Observacion } = estilista;
//       if (
//         Observacion === "SERV" &&
//         !listaEstilistas.some(
//           (item) => item.d_estilista === d_estilista && item.User === User && item.No_venta === No_venta && item.Cve_cliente === Cve_cliente
//         )
//       ) {
//         listaEstilistas.push({ d_estilista, User, No_venta, Cve_cliente });
//       }
//       return listaEstilistas;
//     }, []);
//     setEstilistaProceso(estilistasUnicos);
//   }, [dataVentas]);

//   const postEstilistaTicket = (dato: any) => {
//     const currentDate = new Date();
//     const sp = `TicketInsumosEstilsta ${dataUsuarios2[0]?.idCia}, ${dataUsuarios2[0]?.sucursal}, ${fechaVieja.replace(
//       /-/g,
//       ""
//     )}, ${fechaVieja.replace(/-/g, "")}, ${dato.User}, ${dato.Cve_cliente}, ${dato.No_venta}`;
//     jezaApi
//       .post(`sp_T_ImpresionesAdd?sp=${sp}&idUsuario=${dataUsuarios2[0]?.id}&idSucursal=${dataUsuarios2[0]?.sucursal}&observaciones=observaciones`)
//       .then(() =>
//         Swal.fire({
//           icon: "success",
//           text: "Sucursal actualizada con éxito",
//           confirmButtonColor: "#3085d6",
//         })
//       );
//     // TICKET DEL ESTILISTA
//     jezaApi
//       .get(
//         `/TicketInsumosEstilsta?cia=${dataUsuarios2[0]?.idCia}&sucursal=${dataUsuarios2[0]?.sucursal}&f1=${fechaVieja}&f2=${fechaVieja}&estilista=${dato.User}&cte=${dato.Cve_cliente}&noVenta=${dato.No_venta}`
//       )
//       .then((response) => {
//         setDatoTicketEstilista(response.data);
//         console.log(response);
//       })
//       .catch((error) => console.log(error));
//   };

//   const [productoSelected, setProductoSelected] = useState<number[]>([]);

//   useEffect(() => {
//     const descripciones = dataVentas ? dataVentas.map((item) => item.Clave_prod) : [];
//     setProductoSelected(descripciones);
//     const ultimaHora = dataVentas && dataVentas.length > 0 ? dataVentas[dataVentas.length - 1].hora : "";
//     setHora(ultimaHora);
//   }, [dataVentas]);

//   const ticketVta = async ({ folio }: any) => {
//     const sp = `TicketVta ${folio},1,${dataUsuarios2[0]?.sucursal},${dataUsuarios2[0]?.id},${formPago.totalPago}`;
//     await jezaApi
//       .post(`sp_T_ImpresionesAdd?sp=${sp}&idUsuario=${dataUsuarios2[0]?.id}&idSucursal=${dataUsuarios2[0]?.sucursal}&observaciones=observaciones`)
//       .then(() => {
//         // Swal.fire({
//         //   icon: "success",
//         //   text: "Ticket ejecutada correctamente",
//         //   confirmButtonColor: "#3085d6",
//         // });
//       })
//       .catch((e) => console.log(e));
//   };
//   // FINALIZACIÓN DE VENTAS
//   const [tempFolio, setTempFolio] = useState(0);

//   // const endVenta1 = async () => {
//   //   // Cierro mi venta y mando response a medioPago
//   //   const permiso = await filtroSeguridad("CIERE_VENTA_UPD");
//   //   if (permiso === false) {
//   //     return;
//   //   }
//   //   jezaApi.put(`/VentaCierre?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1`).then((response) => {
//   //     if (response.data.codigo == 0) {
//   //       // alert("ESTAMOS MAL");
//   //       Swal.fire({
//   //         icon: "error",
//   //         title: "Error",
//   //         text: response.data.mensaje1,
//   //         confirmButtonColor: "#d33",
//   //       });
//   //       return;
//   //     } else {
//   //       medioPago(Number(response.data.mensaje2)).then(() => {
//   //         setTempFolio(response.data.mensaje2);
//   //         const temp = response.data.mensaje2;
//   //         jezaApi
//   //           .get(
//   //             `/TicketVta?folio=${Number(response.data.mensaje2)}&caja=1&suc=${Number(dataUsuarios2[0]?.sucursal)}&usr=${dataUsuarios2[0]?.id
//   //             }&pago=${Number(formPago.totalPago)}`
//   //           )
//   //           .then((response) => {

//   //             const cliente = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//   //             if (cliente[0]?.suspendido) {
//   //               // Cliente suspendido, enviar el ticket a un correo definido
//   //               const envioCorreoRem = "correo@definido.com";
//   //               axios
//   //                 .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//   //                   to: envioCorreoRem,
//   //                   subject: "Ticket",
//   //                   textTicket: response.data,
//   //                   text: "...",
//   //                 })
//   //                 .then(() => {
//   //                   Swal.fire({
//   //                     icon: "success",
//   //                     text: "Correo enviado con éxito",
//   //                     confirmButtonColor: "#3085d6",
//   //                   });
//   //                 })
//   //                 .catch((error) => {
//   //                   alert(error);
//   //                   console.log(error);
//   //                 });
//   //             } else {
//   //               if (dataUsuarios2[0]?.sucursal == 27) {
//   //               }
//   //               setDatoTicket(response.data);
//   //               setTimeout(() => {
//   //                 Swal.fire({
//   //                   title: "ADVERTENCIA",
//   //                   text: `¿Se enviará el ticket por correo?`,
//   //                   icon: "warning",
//   //                   showCancelButton: true,
//   //                   confirmButtonColor: "#3085d6",
//   //                   cancelButtonColor: "#d33",
//   //                   confirmButtonText: "Verificar correo",
//   //                   cancelButtonText: "No deseo recibir correos",
//   //                 }).then((result) => {
//   //                   if (result.isConfirmed) {
//   //                     // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com";
//   //                     const envioCorreoRem = "soporte@cbinformatica.net";
//   //                     const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//   //                     Swal.fire({
//   //                       title: "ADVERTENCIA",
//   //                       text: `¿Su correo es ${correo[0].email}?`,
//   //                       icon: "warning",
//   //                       showCancelButton: true,
//   //                       showDenyButton: true,
//   //                       denyButtonText: `Asignar correo`,
//   //                       denyButtonColor: "green",
//   //                       confirmButtonColor: "#3085d6",
//   //                       cancelButtonColor: "#d33",
//   //                       confirmButtonText: "Sí",
//   //                       cancelButtonText: "No, imprimir",
//   //                     }).then((result) => {
//   //                       if (result.isConfirmed) {
//   //                         //const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
//   //                         const envioCorreoRem = "soporte@cbinformatica.net";
//   //                         const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//   //                         axios
//   //                           .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//   //                             // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//   //                             to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
//   //                             subject: "Ticket",
//   //                             textTicket: response.data,
//   //                             text: "...",
//   //                           })
//   //                           .then(() => {
//   //                             Swal.fire({
//   //                               icon: "success",
//   //                               text: "Correo enviado con éxito",
//   //                               confirmButtonColor: "#3085d6",
//   //                             });
//   //                           })
//   //                           .catch((error) => {
//   //                             alert(error);
//   //                             console.log(error);
//   //                           });
//   //                       } else if (result.isDenied) {
//   //                         Swal.fire({
//   //                           title: "Ingrese el correo",
//   //                           input: "email",
//   //                           inputAttributes: {
//   //                             autocapitalize: "off",
//   //                           },
//   //                           showCancelButton: true,
//   //                           confirmButtonText: "Listo",
//   //                           showLoaderOnConfirm: true,
//   //                           preConfirm: (correo) => {
//   //                             const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
//   //                             if (!regexCorreo.test(correo)) {
//   //                               Swal.showValidationMessage("Por favor, ingrese un correo electrónico válido");
//   //                             }
//   //                           }
//   //                         }).then((result) => {
//   //                           if (result.isConfirmed) {
//   //                             // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com";
//   //                             // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
//   //                             const envioCorreoRem = "soporte@cbinformatica.net";
//   //                             axios
//   //                               .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//   //                                 // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//   //                                 to: envioCorreoRem + `,${result.value}`,
//   //                                 subject: "Ticket",
//   //                                 textTicket: response.data,
//   //                                 text: "...",
//   //                               })
//   //                               .then(() => {
//   //                                 Swal.fire({
//   //                                   icon: "success",
//   //                                   text: "Correo enviado con éxito",
//   //                                   confirmButtonColor: "#3085d6",
//   //                                 });
//   //                               })
//   //                               .catch((error) => {
//   //                                 alert(error);
//   //                                 console.log(error);
//   //                               });
//   //                           }
//   //                         });
//   //                       }
//   //                     });
//   //                   } else {
//   //                     const envioCorreoRem = "soporte@cbinformatica.net";
//   //                     // const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//   //                     axios
//   //                       .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//   //                         // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//   //                         to: envioCorreoRem,
//   //                         subject: "Ticket",
//   //                         textTicket: response.data,
//   //                         text: "...",
//   //                       })
//   //                       .then(() => {
//   //                         Swal.fire({
//   //                           icon: "success",
//   //                           text: "Correo enviado a TNB",
//   //                           confirmButtonColor: "#3085d6",
//   //                         });
//   //                       }).catch((error) => {
//   //                         alert(error);
//   //                         console.log(error);
//   //                       });
//   //                     ticketVta({ folio: temp });
//   //                     setModalTicket(true);

//   //                 });
//   //               });
//   //             }, 3000)

//   //           .catch(() => console.log("Error"));
//   //       });
//   //       Swal.fire({
//   //         icon: "success",
//   //         text: "Venta finalizada con éxito",
//   //         confirmButtonColor: "#3085d6",
//   //       });
//   //       setDataTemporal({
//   //         Caja: 1,
//   //         cancelada: false,
//   //         Cant_producto: 0,
//   //         Cia: 0,
//   //         Clave_Descuento: 0,
//   //         Clave_prod: 0,
//   //         Corte: 0,
//   //         Corte_parcial: 0,
//   //         Costo: 0,
//   //         Credito: false,
//   //         Cve_cliente: 0,
//   //         Descuento: 0,
//   //         Fecha: "20230724",
//   //         folio_estilista: 0,
//   //         hora: 0,
//   //         idEstilista: 0,
//   //         ieps: 0,
//   //         No_venta: 0,
//   //         Observacion: "",
//   //         Precio: 0,
//   //         Precio_base: 0,
//   //         Sucursal: 0,
//   //         Tasa_iva: 0,
//   //         terminado: false,
//   //         tiempo: 0,
//   //         Usuario: 0,
//   //         validadoServicio: false,
//   //         cliente: "",
//   //         estilista: "",
//   //         id: 0,
//   //         producto: "",
//   //         User: 0,
//   //       });
//   //       // anticipoPost(Number(response.data.mensaje2));
//   //     }
//   //   });
//   //   fetchInsumosProducto();
//   //      };

//   //RESPALDO FUNCION VENTAS 
//   // const endVenta = async () => {
//   //   // Cierro mi venta y mando response a medioPago
//   //   const permiso = await filtroSeguridad("CIERE_VENTA_UPD");
//   //   if (permiso === false) {
//   //     return;
//   //   }
//   //   jezaApi.put(`/VentaCierre?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1`).then((response) => {
//   //     if (response.data.codigo == 0) {
//   //       // alert("ESTAMOS MAL");
//   //       Swal.fire({
//   //         icon: "error",
//   //         title: "Error",
//   //         text: response.data.mensaje1,
//   //         confirmButtonColor: "#d33",
//   //       });
//   //       return;
//   //     } else {
//   //       medioPago(Number(response.data.mensaje2)).then(() => {
//   //         setTempFolio(response.data.mensaje2);
//   //         const temp = response.data.mensaje2;
//   //         jezaApi
//   //           .get(
//   //             `/TicketVta?folio=${Number(response.data.mensaje2)}&caja=1&suc=${Number(dataUsuarios2[0]?.sucursal)}&usr=${dataUsuarios2[0]?.id
//   //             }&pago=${Number(formPago.totalPago)}`
//   //           )
//   //           .then((response) => {
//   //             if (dataUsuarios2[0]?.sucursal == 27) {
//   //             }
//   //             setDatoTicket(response.data);
//   //             setTimeout(() => {
//   //               Swal.fire({
//   //                 title: "ADVERTENCIA",
//   //                 text: `¿Requiere su ticket por correo?`,
//   //                 icon: "warning",
//   //                 showCancelButton: true,
//   //                 confirmButtonColor: "#3085d6",
//   //                 //cancelButtonColor: "#d33",
//   //                 confirmButtonText: "Si, verificar correo",
//   //                 //cancelButtonText: "No",
//   //               }).then((result) => {
//   //                 if (result.isConfirmed) {
//   //                   const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com";

//   //                   Swal.fire({
//   //                     title: "ADVERTENCIA",
//   //                     text: `¿Su correo es ${correo[0].email}?`,
//   //                     icon: "warning",
//   //                     showCancelButton: true,
//   //                     showDenyButton: true,
//   //                     denyButtonText: `Asignar correo`,
//   //                     denyButtonColor: "green",
//   //                     confirmButtonColor: "#3085d6",
//   //                     cancelButtonColor: "#d33",
//   //                     confirmButtonText: "Sí",
//   //                     cancelButtonText: "No, imprimir",
//   //                   }).then((result) => {
//   //                     if (result.isConfirmed) {
//   //                       const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
//   //                       const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//   //                       axios
//   //                         .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//   //                           // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//   //                           to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
//   //                           subject: "Ticket",
//   //                           textTicket: response.data,
//   //                           text: "...",
//   //                         })
//   //                         .then(() => {
//   //                           Swal.fire({
//   //                             icon: "success",
//   //                             text: "Correo enviado con éxito",
//   //                             confirmButtonColor: "#3085d6",
//   //                           });
//   //                         })
//   //                         .catch((error) => {
//   //                           alert(error);
//   //                           console.log(error);
//   //                         });
//   //                     } else if (result.isDenied) {
//   //                       Swal.fire({
//   //                         title: "Ingrese el correo",
//   //                         input: "text",
//   //                         inputAttributes: {
//   //                           autocapitalize: "off",
//   //                         },
//   //                         showCancelButton: true,
//   //                         confirmButtonText: "Listo",
//   //                         showLoaderOnConfirm: true,
//   //                       }).then((result) => {
//   //                         if (result.isConfirmed) {
//   //                           // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com";
//   //                           const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
//   //                           axios
//   //                             .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//   //                               // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//   //                               to: envioCorreoRem + `,${result.value}`,
//   //                               subject: "Ticket",
//   //                               textTicket: response.data,
//   //                               text: "...",
//   //                             })
//   //                             .then(() => {
//   //                               Swal.fire({
//   //                                 icon: "success",
//   //                                 text: "Correo enviado con éxito",
//   //                                 confirmButtonColor: "#3085d6",
//   //                               });
//   //                             })
//   //                             .catch((error) => {
//   //                               alert(error);
//   //                               console.log(error);
//   //                             });
//   //                         }
//   //                       });
//   //                     }
//   //                   });
//   //                 } else {
//   //                   ticketVta({ folio: temp });
//   //                   setModalTicket(true);
//   //                 }
//   //               });
//   //             });
//   //           }, 3000)
//   //           .catch(() => console.log("Error"));
//   //       });
//   //       Swal.fire({
//   //         icon: "success",
//   //         text: "Venta finalizada con éxito",
//   //         confirmButtonColor: "#3085d6",
//   //       });
//   //       setDataTemporal({
//   //         Caja: 1,
//   //         cancelada: false,
//   //         Cant_producto: 0,
//   //         Cia: 0,
//   //         Clave_Descuento: 0,
//   //         Clave_prod: 0,
//   //         Corte: 0,
//   //         Corte_parcial: 0,
//   //         Costo: 0,
//   //         Credito: false,
//   //         Cve_cliente: 0,
//   //         Descuento: 0,
//   //         Fecha: "20230724",
//   //         folio_estilista: 0,
//   //         hora: 0,
//   //         idEstilista: 0,
//   //         ieps: 0,
//   //         No_venta: 0,
//   //         Observacion: "",
//   //         Precio: 0,
//   //         Precio_base: 0,
//   //         Sucursal: 0,
//   //         Tasa_iva: 0,
//   //         terminado: false,
//   //         tiempo: 0,
//   //         Usuario: 0,
//   //         validadoServicio: false,
//   //         cliente: "",
//   //         estilista: "",
//   //         id: 0,
//   //         producto: "",
//   //         User: 0,
//   //       });
//   //       // anticipoPost(Number(response.data.mensaje2));
//   //     }
//   //   });
//   //   fetchInsumosProducto();
//   // };


//   const endVentaori = async () => {
//     // Cierro mi venta y mando response a medioPago
//     const permiso = await filtroSeguridad("CIERE_VENTA_UPD");
//     if (permiso === false) {
//       return;
//     }
//     jezaApi.put(`/VentaCierre?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1`).then((response) => {
//       if (response.data.codigo == 0) {
//         // alert("ESTAMOS MAL");
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: response.data.mensaje1,
//           confirmButtonColor: "#d33",
//         });
//         return;
//       } else {
//         medioPago(Number(response.data.mensaje2)).then(() => {
//           setTempFolio(response.data.mensaje2);
//           const temp = response.data.mensaje2;
//           jezaApi
//             .get(
//               `/TicketVta?folio=${Number(response.data.mensaje2)}&caja=1&suc=${Number(dataUsuarios2[0]?.sucursal)}&usr=${dataUsuarios2[0]?.id
//               }&pago=${Number(formPago.totalPago)}`
//             )
//             .then((response) => {
//               if (dataUsuarios2[0]?.sucursal == 27) {
//               }
//               setDatoTicket(response.data);
//               setTimeout(() => {
//                 Swal.fire({
//                   title: "ADVERTENCIA",
//                   text: `¿Requiere su ticket por correo?`,
//                   icon: "warning",
//                   showCancelButton: true,
//                   confirmButtonColor: "#3085d6",
//                   //cancelButtonColor: "#d33",
//                   confirmButtonText: "Si, verificar correo",
//                   //cancelButtonText: "No",
//                 }).then((result) => {
//                   if (result.isConfirmed) {
//                     const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com";
//                     const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//                     Swal.fire({
//                       title: "ADVERTENCIA",
//                       text: `¿Su correo es ${correo[0].email}?`,
//                       icon: "warning",
//                       showCancelButton: true,
//                       showDenyButton: true,
//                       denyButtonText: `Asignar correo`,
//                       denyButtonColor: "green",
//                       confirmButtonColor: "#3085d6",
//                       cancelButtonColor: "#d33",
//                       confirmButtonText: "Sí",
//                       cancelButtonText: "No, imprimir",
//                     }).then((result) => {
//                       if (result.isConfirmed) {
//                         const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
//                         const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//                         axios
//                           .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//                             // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//                             to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
//                             subject: "Ticket",
//                             textTicket: response.data,
//                             text: "...",
//                           })
//                           .then(() => {
//                             Swal.fire({
//                               icon: "success",
//                               text: "Correo enviado con éxito",
//                               confirmButtonColor: "#3085d6",
//                             });
//                           })
//                           .catch((error) => {
//                             alert(error);
//                             console.log(error);
//                           });
//                       } else if (result.isDenied) {
//                         Swal.fire({
//                           title: "Ingrese el correo",
//                           input: "text",
//                           inputAttributes: {
//                             autocapitalize: "off",
//                           },
//                           showCancelButton: true,
//                           confirmButtonText: "Listo",
//                           showLoaderOnConfirm: true,
//                         }).then((result) => {
//                           if (result.isConfirmed) {
//                             // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com";
//                             const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
//                             axios
//                               .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//                                 // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//                                 to: envioCorreoRem + `,${result.value}`,
//                                 subject: "Ticket",
//                                 textTicket: response.data,
//                                 text: "...",
//                               })
//                               .then(() => {
//                                 Swal.fire({
//                                   icon: "success",
//                                   text: "Correo enviado con éxito",
//                                   confirmButtonColor: "#3085d6",
//                                 });
//                               })
//                               .catch((error) => {
//                                 alert(error);
//                                 console.log(error);
//                               });
//                           }
//                         });
//                       }
//                     });
//                   } else {
//                     ticketVta({ folio: temp });
//                     setModalTicket(true);
//                   }
//                 });
//               });
//             }, 3000)
//             .catch(() => console.log("Error"));
//         });
//         Swal.fire({
//           icon: "success",
//           text: "Venta finalizada con éxito",
//           confirmButtonColor: "#3085d6",
//         });
//         setDataTemporal({
//           Caja: 1,
//           cancelada: false,
//           Cant_producto: 0,
//           Cia: 0,
//           Clave_Descuento: 0,
//           Clave_prod: 0,
//           Corte: 0,
//           Corte_parcial: 0,
//           Costo: 0,
//           Credito: false,
//           Cve_cliente: 0,
//           Descuento: 0,
//           Fecha: "20230724",
//           folio_estilista: 0,
//           hora: 0,
//           idEstilista: 0,
//           ieps: 0,
//           No_venta: 0,
//           Observacion: "",
//           Precio: 0,
//           Precio_base: 0,
//           Sucursal: 0,
//           Tasa_iva: 0,
//           terminado: false,
//           tiempo: 0,
//           Usuario: 0,
//           validadoServicio: false,
//           cliente: "",
//           estilista: "",
//           id: 0,
//           producto: "",
//           User: 0,
//         });
//         // anticipoPost(Number(response.data.mensaje2));
//       }
//     });
//     fetchInsumosProducto();
//   };


//   const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     // Eliminar espacios en blanco al principio de la cadena
//     const trimmedValue = value.replace(/^\s+/g, "");
//     setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
//     console.log(form);
//   };

//   const endVenta = async () => {
//    // alert(`/VentaCierreP?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1&promo=${promocion}`)
//    // return;
//     // Cierro mi venta y mando response a medioPago
//     const permiso = await filtroSeguridad("CIERE_VENTA_UPD");
//     if (permiso === false) {
//       return;
//     }
//     jezaApi.put(`/VentaCierreP?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1&promo=${promocion}`).then((response) => {
//       if (response.data.codigo == 0) {
//         // alert("ESTAMOS MAL");
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: response.data.mensaje1,
//           confirmButtonColor: "#d33",
//         });
//         return;
//       } else {
//         medioPago(Number(response.data.mensaje2)).then(() => {
//           setTempFolio(response.data.mensaje2);
//           const temp = response.data.mensaje2;
//           jezaApi
//             .get(
//               `/TicketVta?folio=${Number(response.data.mensaje2)}&caja=1&suc=${Number(dataUsuarios2[0]?.sucursal)}&usr=${dataUsuarios2[0]?.id
//               }&pago=${Number(formPago.totalPago)}`
//             )
//             .then((response) => {
//               setDatoTicket(response.data);
//               const cliente = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente);
//               if (cliente && cliente.recibirCorreo === true) {
//                 const envioCorreoRem = "soporte@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holajann@tnbmx.com ";
//                 axios
//                   .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//                     to: envioCorreoRem,
//                     subject: "Ticket",
//                     textTicket: response.data,
//                     text: "...",
//                   })
//                   .then(() => {
//                     Swal.fire({
//                       icon: "success",
//                       text: "El cliente no desea recibir correos, el correo fue enviado a TNB",
//                       confirmButtonColor: "#3085d6",
//                     });
//                   })
//                   .catch((error) => {
//                     alert(error);
//                     console.log(error);
//                   });
//                 ticketVta({ folio: temp });
//                 setModalTicket(true);
//                 return;
//               }
//               if (dataUsuarios2[0]?.sucursal == 27) {
//               }
//               //setDatoTicket(response.data);
//               setTimeout(() => {
//                 Swal.fire({
//                   title: "Envío de ticket",
//                   text: `¿Se enviará el ticket por correo?`,
//                   icon: "warning",
//                   showCancelButton: true,
//                   confirmButtonColor: "#3085d6",
//                   cancelButtonColor: "#d33",
//                   confirmButtonText: "Verificar correo",
//                   cancelButtonText: "No deseo recibir correos",
//                   allowOutsideClick: false
//                 }).then((result) => {
//                   if (result.isConfirmed) {
//                     // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com";
//                     const envioCorreoRem = "soporte@cbinformatica.net, abigailmh9@gmail.com, holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holajann@tnbmx.com ";
//                     const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//                     Swal.fire({
//                       title: "CONFIRMACIÓN",
//                       text: `¿Su correo es ${correo[0].email}?`,
//                       icon: "warning",
//                       // showCancelButton: true,
//                       showDenyButton: true,
//                       denyButtonText: `Asignar correo`,
//                       denyButtonColor: "green",
//                       confirmButtonColor: "#3085d6",
//                       //cancelButtonColor: "#d33",
//                       confirmButtonText: "Sí",
//                       allowOutsideClick: false
//                       //cancelButtonText: "No, imprimir",
//                     }).then((result) => {
//                       if (result.isConfirmed) {
//                         const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holajann@tnbmx.com ";
//                         //const envioCorreoRem = "soporte@cbinformatica.net";
//                         const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//                         axios
//                           .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//                             // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//                             to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
//                             subject: "Ticket",
//                             textTicket: response.data,
//                             text: "...",
//                           })
//                           .then(() => {
//                             Swal.fire({
//                               icon: "success",
//                               text: "Correo enviado con éxito",
//                               confirmButtonColor: "#3085d6",
//                             });
//                           })
//                           .catch((error) => {
//                             alert(error);
//                             console.log(error);
//                           });
//                       } else if (result.isDenied) {
//                         Swal.fire({
//                           title: "Ingrese el correo",
//                           input: "email",
//                           inputAttributes: {
//                             autocapitalize: "off",
//                           },
//                           //showCancelButton: true,
//                           confirmButtonText: "Listo",
//                           showLoaderOnConfirm: true,
//                           allowOutsideClick: false,
//                           allowEscapeKey: false,
//                           preConfirm: (correo) => {
//                             // const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol|tnbmx)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
//                             const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//                             if (!regexCorreo.test(correo)) {
//                               Swal.showValidationMessage("Por favor, ingrese un correo electrónico válido");
//                             }
//                           }
//                         }).then((result) => {
//                           if (result.isConfirmed) {
//                             // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com";
//                             const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holajann@tnbmx.com";
//                             //const envioCorreoRem = "soporte@cbinformatica.net";
//                             axios
//                               .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//                                 // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//                                 to: envioCorreoRem + `,${result.value}`,
//                                 subject: "Ticket",
//                                 textTicket: response.data,
//                                 text: "...",
//                               })
//                               .then(() => {
//                                 Swal.fire({
//                                   icon: "success",
//                                   text: "Correo enviado con éxito",
//                                   confirmButtonColor: "#3085d6",
//                                 });
//                               })
//                               .catch((error) => {
//                                 alert(error);
//                                 console.log(error);
//                               });
//                           }
//                         });
//                       }
//                     });
//                   } else {
//                     const envioCorreoRem = "soporte@cbinformatica.net, abigailmh9@gmail.com, holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holajann@tnbmx.com ";
//                     // const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
//                     axios
//                       .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
//                         // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
//                         to: envioCorreoRem,
//                         subject: "Ticket",
//                         textTicket: response.data,
//                         text: "...",
//                       })
//                       .then(() => {
//                         Swal.fire({
//                           icon: "success",
//                           text: "Correo enviado a TNB",
//                           confirmButtonColor: "#3085d6",
//                         });
//                       })
//                       .catch((error) => {
//                         alert(error);
//                         console.log(error);
//                       });
//                     ticketVta({ folio: temp });
//                     setModalTicket(true);
//                   }
//                   /* tengo que quitar estos de aqui abajo */
//                  /*  ticketVta({ folio: temp });
//                   setModalTicket(true); */
//                 });
//               });
//             }, 800)
//             .catch(() => console.log("Error"));
//         });
//         Swal.fire({
//           icon: "success",
//           text: "Venta finalizada con éxito",
//           confirmButtonColor: "#3085d6",
//         });
//         setDataTemporal({
//           Caja: 1,
//           cancelada: false,
//           Cant_producto: 0,
//           Cia: 0,
//           Clave_Descuento: 0,
//           Clave_prod: 0,
//           Corte: 0,
//           Corte_parcial: 0,
//           Costo: 0,
//           Credito: false,
//           Cve_cliente: 0,
//           Descuento: 0,
//           Fecha: "20230724",
//           folio_estilista: 0,
//           hora: 0,
//           idEstilista: 0,
//           ieps: 0,
//           No_venta: 0,
//           Observacion: "",
//           Precio: 0,
//           Precio_base: 0,
//           Sucursal: 0,
//           Tasa_iva: 0,
//           terminado: false,
//           tiempo: 0,
//           Usuario: 0,
//           validadoServicio: false,
//           cliente: "",
//           estilista: "",
//           id: 0,
//           producto: "",
//           User: 0,
//         });
//         // anticipoPost(Number(response.data.mensaje2));
//       }
//     });
//     fetchInsumosProducto();
//   };



//   const { dataAnticipos } = useAnticipoVentas({
//     cliente: Number(dataTemporal?.Cve_cliente),
//     suc: "%",
//   });
//   const [anticipoId, setAnticipoId] = useState(0);
//   const [anticipoIdentificador, setAnticipoIdentificador] = useState(0);
//   const anticipoSelectedFunction = (params) => {
//     setFormAnticipo({
//       ...formAnticipo,
//       id: params.row.id,
//       referencia: params.row.referencia,
//       observaciones: params.row.observaciones,
//       importe: params.row.importe,
//     });
//     setDataArregloTemporal({
//       ...dataArregloTemporal,
//       importe: params.row.importe * -1,
//       // referencia: params.row.referencia ? params.row.referencia.toString() : ".",
//       referencia: params.row.id,
//     });
//     setAnticipoId(Number(params.row.id));
//     setAnticipoIdentificador(Number(params.row.id));
//     setModalAnticipo(false);
//     setModalTiendaVirtual(false);
//   };

//   const [selectedItemIndex, setSelectedItemIndex] = useState(-1); // Inicialmente, no hay ningún índice seleccionado

//   // Función para eliminar un elemento del arreglo según su índice
//   const eliminarElemento = (tipopago: number, index: number, importe: number) => {
//     // Verificamos que el índice sea válido (dentro del rango del arreglo)
//     if (index >= 0 && index < arregloTemporal.length) {
//       const newArray = [...arregloTemporal];
//       newArray.splice(index, 1); // Eliminamos un elemento a partir del índice seleccionado
//       setArregloTemporal(newArray);

//       // Restar el importe eliminado de formPago
//       if (tipopago === 2) {
//         setFormPago({ ...formPago, efectivo: formPago.efectivo - importe });
//       } else if (tipopago === 1) {
//         setFormPago({ ...formPago, anticipos: formPago.anticipos - importe });
//       } else {
//         setFormPago({ ...formPago, tc: formPago.tc - importe });
//       }

//       setSelectedItemIndex(-1); // Reseteamos el índice seleccionado para que no haya elemento seleccionado
//     }
//   };

//   function DataTable() {
//     return (
//       <div className="table-responsive" style={{ height: "59%", overflow: "auto" }}>
//         <div style={{ height: "100%", display: "table", tableLayout: "fixed", width: "100%" }}>
//           <TableAnticipos anticipoSelectedFunction={anticipoSelectedFunction} dataAnticipos={dataAnticipos}></TableAnticipos>
//         </div>
//       </div>
//     );
//   }
//   function DataTableTiendaVirtual() {
//     return (
//       <div className="table-responsive" style={{ height: "59%", overflow: "auto" }}>
//         <div style={{ height: "100%", display: "table", tableLayout: "fixed", width: "100%" }}>
//           <TableTiendaVirtual anticipoSelectedFunction={anticipoSelectedFunction} dataAnticipos={dataAnticipos}></TableTiendaVirtual>
//         </div>
//       </div>
//     );
//   }

//   const medioPago = async (noVenta: number) => {
//     arregloTemporal.forEach(async (elemento) => {
//       const tempIdPago = getIdPago(Number(elemento.formaPago));
//       await jezaApi.post("/MedioPago", null, {
//         params: {
//           caja: 1,
//           no_venta: noVenta,
//           corte: 0,
//           corte_parcial: 0,
//           fecha: new Date(),
//           sucursal: dataUsuarios2[0]?.sucursal,
//           tipo_pago: tempIdPago,
//           // referencia:
//           // Number(elemento.formaPago) === 94 || Number(elemento.formaPago) === 245
//           //   ? anticipoIdentificador
//           //   : elemento.referencia
//           //   ? elemento.referencia
//           //   : "Efectivo",
//           referencia: elemento.referencia ? elemento.referencia : "Efectivo",
//           importe: elemento.formaPago == 1 ? elemento.importe - formPago.cambioCliente : elemento.importe,
//           usuario: dataUsuarios2[0]?.id,
//         },
//       });
//     });
//   };
//   const getFormaPago = (idTableCia: number) => {
//     const cia = dataFormasPagos.find((cia: FormaPago) => cia.tipo === idTableCia);
//     return cia ? cia.descripcion : "Sin forma de pago";
//   };
//   const getIdPago = (idTipoPago: number) => {
//     const cia = dataFormasPagos.find((cia: FormaPago) => cia.tipo === idTipoPago && cia.sucursal === dataUsuarios2[0]?.sucursal);
//     return cia ? cia.id : 1;
//   };

//   const editVenta = async () => {
//     const permiso = await filtroSeguridad("EDITAR_VENTA");
//     if (permiso === false) {
//       return; // Si el permiso es falso o los campos no son válidos, se sale de la función
//     }
//     const today2 = new Date();
//     const formattedDate = format(today2, "yyyy-MM-dd");
//     const horaTemporal = dataVentaEdit.hora;
//     let horaDateTime; // Declare here

//     if (typeof horaTemporal === "number") {
//       // Si horaTemporal es un número decimal (float)
//       // Realiza el proceso de conversión y formateo aquí
//       const today = new Date();
//       today.setHours(Math.floor(horaTemporal));
//       today.setMinutes((horaTemporal % 1) * 60);
//       today.setSeconds(0);
//       today.setMilliseconds(0);
//       horaDateTime = today.toISOString();

//       console.log(horaDateTime);
//     } else {
//       // Si horaTemporal es un objeto Date
//       // Realiza el proceso que necesites para manejar un objeto Date aquí
//       horaDateTime = dataVentaEdit.hora;
//     }
//     const horaFormateada = format(new Date(dataVentaEdit.hora), "yyyy-MM-dd HH:mm");

//     jezaApi
//       .put(
//         `/Venta?id=${dataVentaEdit.id}&Cia=${dataUsuarios2[0]?.idCia}&Sucursal=${dataUsuarios2[0]?.sucursal
//         }&Fecha=${formattedDate}&Caja=1&No_venta=0&no_venta2=0&Clave_prod=${dataVentaEdit.Clave_prod}&Cant_producto=${dataVentaEdit.Cant_producto
//         }&Precio=${dataVentaEdit.Precio}&Cve_cliente=${dataVentaEdit.Cve_cliente}&Tasa_iva=0.16&Observacion=${dataVentaEdit.Observacion}&Descuento=${dataVentaEdit.Descuento
//         }&Clave_Descuento=${dataVentaEdit.Clave_Descuento}&usuario=${dataVentaEdit.idEstilista}&Corte=1&Corte_parcial=1&Costo=${dataVentaEdit.Costo
//         }&Precio_base=${dataVentaEdit.Precio_base}&No_venta_original=0&cancelada=false&folio_estilista=${0}&hora=${horaFormateada}&tiempo=${dataVentaEdit.tiempo === 0 ? 0 : dataVentaEdit.tiempo
//         }&terminado=false&validadoServicio=false&idestilistaAux=${dataVentaEdit.idestilistaAux ? dataVentaEdit.idestilistaAux : 0}&idRecepcionista=${dataUsuarios2[0]?.id
//         }`
//       )
//       .then(() => {
//         Swal.fire({
//           icon: "success",
//           text: "Venta actualizada con éxito",
//           confirmButtonColor: "#3085d6",
//         }).catch((e) => alert(e));
//         setModalOpenVentaEdit(false);
//         setDataVentaEdit({
//           Caja: 0,
//           cancelada: false,
//           Cant_producto: 0,
//           Cia: 0,
//           Clave_Descuento: 0,
//           Clave_prod: 0,
//           Corte: 0,
//           Corte_parcial: 0,
//           Costo: 0,
//           Credito: false,
//           Cve_cliente: 0,
//           Descuento: 0,
//           Fecha: fechaHoy,
//           folio_estilista: 0,
//           hora: 0,
//           idEstilista: 0,
//           ieps: 0,
//           No_venta: 0,
//           Observacion: "",
//           Precio: 0,
//           Precio_base: 0,
//           Sucursal: 0,
//           Tasa_iva: 0,
//           terminado: false,
//           tiempo: 0,
//           Usuario: 0,
//           validadoServicio: false,
//           cliente: "",
//           User: 0,
//           idestilistaAux: 0,
//           idRecepcionista: 0,
//         });
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//     setTimeout(() => {
//       fetchVentas();
//     }, 1000);
//   };

//   const [time, setTime] = useState("12:34pm");

//   const [datah, setData] = useState<any[]>([]); // Definir el estado datah
//   const [modalOpen, setModalOpenH] = useState(false);

//   const toggleModalHistorial = () => {
//     setModalOpenH(!modalOpen);
//   };

//   const historial = (dato: any) => {
//     jezaApi.get(`/Historial?cliente=${dataTemporal.Cve_cliente}`).then((response) => {
//       setData(response.data);
//       toggleModalHistorial(); // Abrir o cerrar el modal cuando los datos se hayan cargado
//     });
//     historialCitaFutura(dataTemporal.Cve_cliente);
//   };


//   const [dataPromo, setDataPromo] = useState<any[]>([]);
//   const [promocion, setPromocion] = useState(0);


//   const getPromo = () => {
//     jezaApi.get(`/sp_nPromociones02?cve_cliente=${dataTemporal.Cve_cliente}&sucursal=${dataUsuarios2[0]?.sucursal}`).then((response) => {
//       // Asumiendo que quieres comprobar si hay algún dato
//       if (response.data && Object.keys(response.data).length !== 0) {
//         // Aquí puedes añadir más lógica específica, por ejemplo, comprobar propiedades específicas dentro de response.data
//         setDataPromo(response.data);
//       } else {
//         // Opcional: manejar el caso cuando no hay datos relevantes
//         console.log("No hay datos relevantes para mostrar.");
//       }
//     });
//   };

//   const muestraPromo = () => {

//     if (dataPromo["0"].importeNormal > 850 ){
//     // Se prepara el mensaje con la descripción y el importe del descuento
//     const promoMessage = `¡Buenas noticias! La venta califica para un descuento especial. Al pagar con <strong>${dataPromo["0"].descripcion}</strong>, el total de la venta será de solo <strong>$${dataPromo["0"].importeDescuento}</strong>.`;

//     const swalWithBootstrapButtons = Swal.mixin({
//       customClass: {
//         confirmButton: 'btn btn-success',
//         cancelButton: 'btn btn-danger'
//       },
//       buttonsStyling: false
//     });

//     swalWithBootstrapButtons.fire({
//       title: 'Venta con descuento disponible',
//       html: promoMessage, // Usar html en lugar de text para interpretar las etiquetas HTML
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, aplicar descuento',
//       cancelButtonText: 'No, cancelar',
//       reverseButtons: true
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setPromocion(1);
//         setTotal(Number(dataPromo["0"].importeDescuento.toFixed(2)));

//         swalWithBootstrapButtons.fire({
//           title: '¡Descuento aplicado!',
//           text: 'El descuento ha sido aplicado a tu compra.',
//           icon: 'success'
//         });
//         // Aquí podrías incluir lógica adicional para aplicar el descuento
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         setPromocion(0);
//         swalWithBootstrapButtons.fire({
//           title: 'Cancelado',
//           text: 'El descuento no ha sido aplicado.',
//           icon: 'error'
//         });
//       }
//     });
//   } else{
//     console.log(dataPromo["0"].importeNormal)
//   }

//     //setModalOpenPromo(true); // Solo abrir el modal si response.data cumple con tus criterios
//   };


//   useEffect(() => {
//    getPromo();
//   }, [dataVentas]);



//   useEffect(() => {
//     // Verificamos si modalOpenPago es false
//     if (!modalOpenPago) {
//       // Aquí puedes ejecutar la lógica que deseas realizar cuando modalOpenPago sea false
//       /* alert("modalOpenPago es false. Realizando alguna acción..."); */
//       // Por ejemplo, puedes llamar a una función, hacer una petición, etc.
//       setPromocion(0)
//     }
//   }, [modalOpenPago]); 


//   const [datah1, setData1] = useState<any[]>([]); // Definir el estado datah

//   const toggleModalHistorialFutura = () => {
//     setModalOpenH(!modalOpen);
//   };

//   const { dataProductos4 } = useProductosFiltradoExistenciaProductoAlm({
//     descripcion: "%",
//     insumo: 2,
//     inventariable: 2,
//     obsoleto: 2,
//     servicio: 2,
//     sucursal: dataUsuarios2[0]?.sucursal,
//     almacen: ALMACEN.VENTAS,
//     cia: dataUsuarios2[0]?.idCia,
//     idCliente: dataTemporal.Cve_cliente,
//   });
//   const [descInsumos, setDescInsumos] = useState("%");
//   const { datoInsumosProducto, fetchInsumosProducto } = useInsumosProductos({
//     descripcion: descInsumos,
//     insumo: 1,
//     inventariable: 1,
//     obsoleto: 0,
//     servicio: 0,
//     sucursal: dataUsuarios2[0]?.sucursal,
//     almacen: 2,
//     cia: dataUsuarios2[0]?.idCia,
//     idCliente: 26307,
//   });
//   const getExistenciaForeignKey = (idProducto: number) => {
//     if (idProducto > 1) {
//       const cia = dataProductos4.find((item: any) => item.id === idProducto);

//       if (cia && cia.existencia > 0 && cia.existencia !== dataVentaEdit.existenciaEdit) {
//         setDataVentaEdit({ ...dataVentaEdit, existenciaEdit: cia.existencia });
//       } else if (cia && cia.existencia === 0 && cia.existencia !== dataVentaEdit.existenciaEdit) {
//         setDataVentaEdit({ ...dataVentaEdit, existenciaEdit: cia.existencia });
//       }
//       return cia ? cia.existencia : 10000;
//     }
//   };
//   const historialCitaFutura = (dato: any) => {
//     jezaApi.get(`/sp_detalleCitasFuturasSel?Cliente=${dataTemporal.Cve_cliente}`).then((response) => {
//       const dataConFechasFormateadas = response.data.map((item: any) => ({
//         ...item,
//         fechaCita: new Date(item.fechaCita).toLocaleDateString(),
//         fechaAlta: new Date(item.fechaAlta).toLocaleDateString(),
//       }));
//       setData1(dataConFechasFormateadas);
//       toggleModalHistorialFutura(); // Abrir o cerrar el modal cuando los datos se hayan cargado
//     });
//   };

//   const [historialDetalle, setHistorialDetalle] = useState<any[]>([]); // Definir historialDetalle como una variable local, no un estado del componente

//   const [paramsDetalles, setParamsDetalles] = useState({
//     sucursal: 0,
//     numVenta: 0,
//     idProducto: 0,
//     clave: 0,
//     Cve_cliente: 0,
//     fecha: "",
//   });

//   const [totalImportes, setTotalImportes] = useState(0);

//   // Cuando cambia historialDetalle, recalcula el total de importes
//   useEffect(() => {
//     const total = historialDetalle.reduce((accumulator, item) => {
//       const importe = parseFloat(item.importe);
//       return accumulator + importe;
//     }, 0);
//     setTotalImportes(total);
//   }, [historialDetalle]);

//   const loadHistorialDetalle = async (cveCliente: number, noVenta: number, idProducto: number, idSucursal: number) => {
//     await jezaApi
//       .get(`/HistorialDetalle?suc=${idSucursal}&cliente=${cveCliente}&venta=${noVenta}&serv=${idProducto}`)
//       .then((response) => {
//         // Verifica los datos de respuesta en la consola para asegurarte que sean correctos
//         console.log(response.data);
//         // Asigna los datos de respuesta a la variable local historialDetalle
//         handleOpenModal();
//         setHistorialDetalle(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);

//   const handleOpenModal = () => {
//     setIsModalOpen(!isModalOpen);
//   };

//   const handleCloseModal = () => {
//     setSelectedId(null);
//     setIsModalOpen(!isModalOpen);
//     // loadHistorialDetalle(  )
//   };
//   // useEffect(() => {

//   // }, [])

//   const [flagEstilistas, setFlagEstilistas] = useState(false);
//   useEffect(() => {
//     const formasPagosFiltradas = dataFormasPagos.filter((formaPago) => formaPago.sucursal === dataUsuarios2[0]?.sucursal);
//     const clienteSuc33 = dataClientes.filter(
//       (cliente) => Number(cliente.sucursal_origen) === 33 && Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente)
//     );
//     if (clienteSuc33.length > 0) {
//       setFormasPagosFiltradas(formasPagosFiltradas);
//     } else {
//       const formaPagoNomina = dataFormasPagos.filter((nomina) => nomina.tipo != 110 && nomina.sucursal == dataUsuarios2[0]?.sucursal);
//       setFormasPagosFiltradas(formaPagoNomina);
//     }
//   }, [dataFormasPagos, dataTemporal.Cve_cliente]);

//   const cantidadInsumo = (dato: any) => {
//     const cantidadInsumoBusqueda = datoInsumosProducto.find((insumo) => Number(dato) == Number(insumo.id));
//     return cantidadInsumoBusqueda?.existencia ? cantidadInsumoBusqueda?.existencia : 0;
//   };

//   function openTicketPreview() {
//     const newWindow = window.open("", "_blank");

//     let content = `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: 'Courier New', monospace;
//             white-space: pre;
//             font-size: 10 px;
//           }
//           strong {
//             font-weight: bold;
//           }
//         </style>
//       </head>
//       <body>
//   `;

//     if (datoTicket) {
//       datoTicket.forEach((ticket) => {
//         content += `<strong>${ticket.LINEA}\n</strong>`;
//       });
//     }

//     content += `
//       </body>
//        <script>
//         window.onload = () => {
//           window.print();
//         };
//       </script>
//     </html>
//   `;

//     newWindow.document.write(content);
//     newWindow.document.close();
//   }

//   function openTicketEstilistaPreview() {
//     const newWindow = window.open("", "_blank");

//     let content = `
//     <html>
//       <head>
//         <style>
//            body {
//             font-family: 'Courier New', monospace;
//             white-space: pre;
//             font-size: 12 px;
//           }
//           strong {
//             font-weight: bold;
//           }
//         </style>
//       </head>
//       <body>
//   `;

//     if (datoTicketEstilista) {
//       datoTicketEstilista.forEach((ticket) => {
//         content += `<strong>${ticket.LINEA}\n</strong>`;
//       });
//     }

//     content += `
//       </body>
//        <script>
//         window.onload = () => {
//           window.print();
//         };
//       </script>
//     </html>
//   `;

//     newWindow.document.write(content);
//     newWindow.document.close();
//   }

//   const [camposFaltantes1, setCamposFaltantes1] = useState<string[]>([]);
//   const validarCampos1 = () => {

//     if (!correoCliente) {
//       Swal.fire({
//         icon: "error",
//         title: "Campos vacíos",
//         text: `El campo correo es requerido`,
//         confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
//       });
//       return false
//     } else {
//       return true
//     }
//   };
//   const cerrarModalActualizar2 = () => {
//     setModalActualizar2(false);
//   };

//   const editar = async () => {
//     const permiso = await filtroSeguridad("CAT_CLIENT_UPD");
//     if (!permiso) {
//       return;
//     }
//     console.log(validarCampos1());
//     console.log({ form });

//     if (validarCampos1()) {
//       //const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
//       const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       if (!regexCorreo.test(correoCliente)) {
//         Swal.fire({
//           icon: "error",
//           text: "Por favor, ingrese un correo electrónico válido",
//         });
//         return;
//       }
//       try {
//         await jezaApi.put(`/ClienteUpdCorreo?`, null, {
//           params: {
//             id_cliente: dataTemporal.Cve_cliente,
//             email: correoCliente,
//           },
//         });

//         Swal.fire({
//           icon: "success",
//           text: "Cliente actualizado con éxito",
//           confirmButtonColor: "#3085d6",
//         });
//         cerrarModalActualizar2();
//         fetchClientes();
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   return (
//     <>
//       <Row>
//         <SidebarHorizontal />
//       </Row>

//       <Container>
//         <br />
//         <h1>
//           Venta <FaCashRegister size={35} />

//         </h1>
//         <input type="" value={promocion} />
//         <br />
//         <Row>
//           <Col md={"8"}>
//             <Row className="align-items-end">
//               <Col md={"7"}>
//                 <InputGroup>
//                   <Input disabled value={dataTemporal.cliente} onChange={cambios} name={"cliente"} />
//                   <Button onClick={() => setModalCliente(true)}>
//                     <MdEmojiPeople size={23} />
//                     Elegir
//                   </Button>
//                   <Button disabled={!dataTemporal.cliente} color="primary" size="sm" onClick={() => historial(dataTemporal.id)}>
//                     Historial
//                     <MdPendingActions size={23} />
//                   </Button>
//                 </InputGroup>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//         <br />
//         <br />
//         <div className=" d-flex justify-content-end px-5">
//           <Button
//             color="secondary"
//             onClick={() => {
//               if (dataTemporal.cliente) {
//                 if (dataVentas.length > 0) {
//                   // setDataTemporal;
//                 }
//                 setModalOpen(true);
//               } else {
//                 Swal.fire({
//                   icon: "warning",
//                   text: "Favor de ingresar un cliente",
//                   confirmButtonColor: "#3085d6",
//                 });
//               }
//             }}
//           >
//             <MdDataSaverOn size={30} />
//             Agregar venta o servicio
//           </Button>
//         </div>
//         <div style={{ flex: 1 }}></div>
//         <br />
//         <Alert style={{ width: 400, marginLeft: 20 }} color="success" isOpen={visible} toggle={onDismiss}>
//           Venta registrada con éxito
//         </Alert>
//         <br />
//         <br />
//         <Table size="sm" striped={true} responsive={"sm"}>
//           <thead>
//             <tr>
//               {TableDataHeader.map((valor: any) => (
//                 <th key={valor}>{valor}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {dataVentas.map((dato: Venta) => (
//               <tr key={dato.id}>
//                 {dato.Cia ? (
//                   <>
//                     <td>{dato.d_estilista}</td>
//                     <td>{dato.nombreEstilistaAux ? dato.nombreEstilistaAux : "Sin estilista auxilliar"}</td>
//                     <td>{dato.d_producto}</td>
//                     <td align="center">{dato.Cant_producto}</td>
//                     <td>
//                       {dato.Precio.toLocaleString("es-MX", {
//                         style: "currency",
//                         currency: "MXN", // Código de moneda para el Peso Mexicano
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                     <td>
//                       {(dato.Precio * dato.Cant_producto).toLocaleString("es-MX", {
//                         style: "currency",
//                         currency: "MXN", // Código de moneda para el Peso Mexicano
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                     {/* IMPORTE */}
//                     <td>
//                       {(dato.Cant_producto * dato.Descuento * dato.Precio).toLocaleString("es-MX", {
//                         style: "currency",
//                         currency: "MXN", // Código de moneda para el Peso Mexicano

//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                     <td>
//                       {dato.Descuento === 0
//                         ? (dato.Precio * dato.Cant_producto).toLocaleString("es-MX", {
//                           style: "currency",
//                           currency: "MXN", // Código de moneda para el Peso Mexicano
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })
//                         : (dato.Precio * dato.Cant_producto - dato.Precio * dato.Cant_producto * dato.Descuento).toLocaleString("es-MX", {
//                           style: "currency",
//                           currency: "MXN", // Código de moneda para el Peso Mexicano

//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                     </td>
//                     <td className="gap-5">
//                       <AiFillDelete
//                         color="lightred"
//                         onClick={() => {
//                           deleteVenta(dato);
//                         }}
//                         size={23}
//                       />
//                       <AiFillEdit
//                         color="lightred"
//                         onClick={() => {
//                           setDataVentaEdit({
//                             ...dataVentaEdit,
//                             id: dato.id,
//                             d_producto: dato.d_producto,
//                             producto: dato.d_producto,
//                             Clave_prod: dato.Clave_prod,
//                             d_estilista: dato.d_estilista,
//                             Cant_producto: dato.Cant_producto,
//                             Descuento: dato.Descuento,
//                             hora: dato.hora,
//                             Cve_cliente: dato.Cve_cliente,
//                             Precio: dato.Precio,
//                             Precio_base: dato.Precio_base,
//                             idEstilista: dato.User,
//                             Observacion: dato.Observacion,
//                             Clave_Descuento: dato.Clave_Descuento,
//                             idestilistaAux: dato.idEstilistaAux,
//                             d_estilistaAuxilliar: dato.nombreEstilistaAux,
//                             tiempo: dato.tiempo,
//                           });
//                           const descuentito = dataDescuentos.find((objeto) => objeto.id === Number(dato.Clave_Descuento));

//                           setDescuento({
//                             min: descuentito?.min_descto ? Number(descuentito?.min_descto) : 0,
//                             max: descuentito?.max_descto ? Number(descuentito?.max_descto) : 0,
//                           });
//                           console.log(dato);
//                           console.log(dataVentaEdit);
//                           setModalOpenVentaEdit(true);
//                         }}
//                         size={23}
//                       />
//                       {dato.Observacion === "SERV" ? (
//                         <GrStakeholder
//                           className="mr-2"
//                           onClick={() => {
//                             setSelectedID(dato.id ? dato.id : null);
//                             setDatoVentaSeleccionado(dato);
//                             setModalOpenInsumos(true);
//                           }}
//                         ></GrStakeholder>
//                       ) : null}
//                     </td>
//                   </>
//                 ) : null}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//         <br />
//         <hr />

//         <Row>
//           <Col md={"8"} className="">
//             <br />
//             <div className="d-flex  justify-content-start ">
//               <InputGroup size="sm">
//                 <Button
//                   // style={{ marginRight: 25 }}
//                   disabled={dataVentas.length > 0 ? false : true}
//                   color="success"
//                   onClick={() => {
//                     //getPromo();
//                     muestraPromo();
//                     setModalOpenPago(true);

//                     setFormPago({ ...formPago, anticipos: 0, efectivo: 0, tc: 0, cambioCliente: 0 });
//                     fetchVentas();
//                     setValidacion(true);
//                   }}
//                 >
//                   <MdAttachMoney size={35} />
//                   Pago
//                 </Button>

//                 <Button
//                   // style={{ marginRight: 25 }}
//                   color="success"
//                   disabled={estilistaProceso.length > 0 ? false : true}
//                   onClick={() => {
//                     setModalEstilistaSelector(true);
//                   }}
//                 >
//                   Estilistas ticket
//                   <MdOutlineReceiptLong size={30} />
//                 </Button>
//                 <Button
//                   // style={{ marginRight: 25 }}
//                   color="secondary"
//                   onClick={() => {
//                     setModalClientesProceso(true);
//                     fetchVentasProcesos();
//                   }}
//                 >
//                   Clientes en proceso
//                   <MdAccessTime size={30} />
//                 </Button>
//               </InputGroup>
//             </div>
//           </Col>
//           <Col md={"2"} className="mt-4">
//             <strong>
//               <h4>Total: ${total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
//             </strong>
//             <strong>
//               <p>Tiempo estimado: {tiempo + " min"} </p>
//             </strong>
//           </Col>
//         </Row>
//       </Container>

//       <Modal isOpen={modalOpenVenta} size="lg">
//         <ModalHeader>
//           <div>
//             <h3>Venta</h3>
//           </div>
//         </ModalHeader>
//         <ModalBody>
//           <Label>Producto/Servicio:</Label>
//           <Row>
//             <Col md={12}>
//               <InputGroup>
//                 <Input disabled defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} />

//                 <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
//               </InputGroup>
//             </Col>
//           </Row>
//           <br />
//           <Label>Encargado:</Label>
//           <Row>
//             <Col>
//               <InputGroup>
//                 <Input disabled defaultValue={dataTemporal.estilista ? dataTemporal.estilista : ""} />

//                 <Button
//                   onClick={() => {
//                     setFlagEstilistas(false);
//                     setModalOpen2(true);
//                   }}
//                 >
//                   Elegir
//                 </Button>
//               </InputGroup>
//             </Col>
//           </Row>
//           <br />
//           {dataTemporal.Observacion === "SERV" ? (
//             <>
//               <Label>Estilista auxiliar:</Label>
//               <Row>
//                 <Col xs={10}>
//                   <InputGroup>
//                     <Input disabled defaultValue={dataTemporal.d_estilistaAuxilliar ? dataTemporal.d_estilistaAuxilliar : ""} />

//                     <Button
//                       onClick={() => {
//                         setModalOpen2(true);
//                         setFlagEstilistas(true);
//                       }}
//                     >
//                       Elegir
//                     </Button>
//                   </InputGroup>
//                 </Col>
//                 <Col xs={1}>
//                   <Button color="danger" onClick={() => setDataTemporal({ ...dataTemporal, idestilistaAux: 0, d_estilistaAuxilliar: "" })}>
//                     <AiFillDelete></AiFillDelete>
//                   </Button>
//                 </Col>

//                 {/* <Col xs={1}>
//                 </Col>
//                 <Col md={1}>
//                 </Col> */}
//               </Row>
//             </>
//           ) : null}
//           {dataTemporal.Observacion !== "SERV" ? null : <br />}
//           <Row>
//             {dataTemporal.Observacion !== "SERV" ? (
//               <Col sm={6} md={6}>
//                 <Label>Cantidad en existencia: </Label>
//                 <Input
//                   disabled
//                   placeholder="Cantidad en existencia"
//                   onChange={cambios}
//                   name="d_existencia"
//                   defaultValue={dataTemporal.d_existencia}
//                 />
//               </Col>
//             ) : (
//               <br />
//             )}
//             <Col sm={6} md={6}>
//               <Label>Precio:</Label>
//               <Input
//                 disabled
//                 placeholder="Precio"
//                 onChange={cambiosEdit}
//                 name="Precio"
//                 value={dataTemporal.Precio ? "$" + dataTemporal.Precio.toFixed(2) : 0}
//               />
//               <br />
//             </Col>
//             <Col md={6}>
//               <Label>Cantidad a vender:</Label>
//               <Input placeholder="Cantidad" onChange={cambios} name="Cant_producto" value={dataTemporal.Cant_producto} type="number" />
//               <br />
//             </Col>
//           </Row>

//           <Label>Tipo de descuento:</Label>
//           <Input type="select" name="Clave_Descuento" id="exampleSelect" value={dataTemporal.Clave_Descuento} onChange={cambios}>
//             <option value={0}>-Selecciona el tipo de descuento-</option>
//             {dataDescuentos.map((descuento) => (
//               <option value={descuento.id}>{descuento.descripcion}</option>
//             ))}
//           </Input>

//           <br />
//           <Label>
//             Descuento entre: {descuento.min} - {descuento.max} :{" "}
//           </Label>
//           <Row>
//             <Col md={"12"}>
//               <Input name="Descuento" value={dataTemporal.Descuento} onChange={cambios} placeholder="0.0"></Input>
//             </Col>
//           </Row>
//           <br />
//           {dataTemporal.Observacion == "SERV" ? (
//             <>
//               <Label style={{ marginRight: 10 }}>Hora de servicio:</Label>
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <TimePicker
//                   label="Seleccione la hora"
//                   value={new Date(dataTemporal.hora)}
//                   onChange={(newValue) => setDataTemporal((prev) => ({ ...prev, hora: newValue }))}
//                 />
//               </LocalizationProvider>
//             </>
//           ) : null}
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalOpen(false);
//               setDataTemporal((prevData) => ({
//                 ...datosInicialesArreglo[0],
//                 Cant_producto: 1,
//                 cliente: prevData.cliente,
//                 Cve_cliente: prevData.Cve_cliente,
//               }));
//               setDescuento({ min: 0, max: 0 });
//             }}
//             text="Salir"
//           />
//           <Button
//             color="primary"
//             disabled={dataTemporal.producto || dataTemporal.cliente ? false : true}
//             onClick={() => {
//               if (dataTemporal.Cant_producto == 0) {
//                 Swal.fire({
//                   icon: "info",
//                   text: "No ha seleccionado cantidad a vender",
//                 });
//               } else if (!dataTemporal.producto) {
//                 Swal.fire({
//                   icon: "info",
//                   text: "No ha seleccionado producto",
//                 });
//               } else if (!dataTemporal.idEstilista || !dataTemporal.estilista) {
//                 Swal.fire({
//                   icon: "info",
//                   text: "No ha seleccionado estilista",
//                 });
//               } else if (Number(dataTemporal.d_existencia) < Number(dataTemporal.Cant_producto) && dataTemporal.Observacion !== "SERV") {
//                 Swal.fire({
//                   icon: "info",
//                   text: "No hay existencias ",
//                 });
//               } else if (dataTemporal.Descuento > descuento.max || dataTemporal.Descuento < descuento.min) {
//                 Swal.fire({
//                   icon: "info",
//                   text: "Favor de verificar los descuentos ",
//                 });
//               } else {
//                 if (dataTemporal.producto) {
//                   setdata([...data, dataTemporal]);
//                   insertar();
//                 }
//               }
//             }}
//           >
//             Agregar venta
//           </Button>
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalOpen2} size="md">
//         <ModalHeader></ModalHeader>
//         <ModalBody>
//           <TableEstilistas
//             dataVentaEdit={dataVentaEdit}
//             setDataVentaEdit={setDataVentaEdit}
//             data={dataTrabajadores}
//             setModalOpen2={setModalOpen2}
//             dataTemporal={dataTemporal}
//             setDataTemporal={setDataTemporal}
//             flagEstilistas={flagEstilistas}
//             setFlagEstilistas={setFlagEstilistas}
//           ></TableEstilistas>
//         </ModalBody>
//         <ModalFooter>
//           <CButton color="danger" onClick={() => setModalOpen2(false)} text="Salir" />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalOpen3} size="xl" toggle={() => setModalOpen3(false)}>
//         <ModalHeader></ModalHeader>
//         <ModalBody>
//           {" "}
//           <TableProductos
//             productoSelected={productoSelected}
//             sucursal={dataUsuarios2 ? dataUsuarios2[0]?.sucursal : 21}
//             data={data}
//             setModalOpen2={setModalOpen3}
//             dataVentaEdit={dataVentaEdit}
//             setDataVentaEdit={setDataVentaEdit}
//             dataTemporal={dataTemporal}
//             setDataTemporal={setDataTemporal}
//             cia={dataUsuarios2[0]?.idCia}
//           ></TableProductos>
//         </ModalBody>
//         <ModalFooter>
//           <CButton color="danger" onClick={() => setModalOpen3(false)} text="Salir" />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalClientesProceso} size="md">
//         <ModalHeader>
//           {" "}
//           <h3>Clientes en proceso </h3>
//         </ModalHeader>
//         <ModalBody>
//           <TableClientesProceso
//             dataTemporal={dataTemporal}
//             setDataTemporal={setDataTemporal}
//             dataVentasProcesos={dataVentasProcesos}
//             data={data}
//             setModalOpen2={setModalClientesProceso}
//           ></TableClientesProceso>
//         </ModalBody>
//         <ModalFooter>
//           <CButton color="danger" onClick={() => setModalClientesProceso(false)} text="Salir" />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalCliente} size="lg">
//         <ModalHeader>
//           <h3>Selección de clientes</h3>{" "}
//         </ModalHeader>
//         <ModalBody>
//           <TableCliente
//             sucursal={dataUsuarios2[0]?.sucursal}
//             dataTemporal={dataTemporal}
//             setDataTemporal={setDataTemporal}
//             data={dataClientes}
//             setModalCliente={setModalCliente}
//           ></TableCliente>
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalCliente(false);
//             }}
//             text="Salir"
//           />
//         </ModalFooter>
//       </Modal>

//       <ModalActualizarLayout
//         modalActualizar={modalActualizar}
//         editar={() => {
//           setModalActualizar(false);
//         }}
//         cerrarModalActualizar={cerrarModalActualizar}
//         form={dataTemporal}
//         nombreActualizar="Editar venta / servicio"
//       >
//         <Label>Cliente</Label>
//         <Input disabled defaultValue={dataTemporal.cliente ? dataTemporal.cliente : ""} onChange={cambios} name={"cve_cliente"} />
//         <Label>Producto/servicio</Label>
//         <Row>
//           <Col>
//             <Input defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} />
//           </Col>
//           <Col md={2}>
//             <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
//           </Col>
//         </Row>
//         <br />
//         <Label>Estilista</Label>
//         <Row>
//           <Col>
//             <Input defaultValue={dataTemporal.estilista ? dataTemporal.estilista : ""} />
//           </Col>
//           <Col md={2}>
//             <Button onClick={() => setModalOpen2(true)}>Elegir</Button>
//           </Col>
//         </Row>
//         <br />
//         <Label>Cantidad</Label>
//         <Input placeholder="Cantidad" onChange={cambios} name="Cant_producto" defaultValue={dataTemporal.Cant_producto} />
//         <br />
//         <Label>Cantidad en existencia </Label>
//         <Input disabled placeholder="Cantidad en existencia" onChange={cambios} name="d_existencia" defaultValue={dataTemporal.d_existencia} />
//         <br />
//         <Label style={{ marginRight: 10 }}>Hora de servicio</Label>
//         {/* <select id="hora" name="hora" onChange={cambios} value={dataTemporal.hora}>
//           {generarOpcionesDeTiempo()}
//         </select> */}
//         <TimeKeeper time={time} onChange={(newTime) => setTime(newTime.formatted12)} />
//         <span>Time is {time}</span>
//       </ModalActualizarLayout>

//       <Modal isOpen={modalOpenPago} size="xl">

//         <ModalHeader>
//           <h3>Cobro</h3>
//         </ModalHeader>
//         <ModalBody>
//           <Row>
//             <Col md="7">
//               <Label>
//                 <strong>TOTAL DE ESTA VENTA:</strong>{" "}
//               </Label>
//             </Col>
//             <Col md="5">
//               <Input disabled value={"$" + total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}></Input>
//             </Col>
//           </Row>
//           <hr className="my-4" />

//           <Row>
//             <Col md="4">
//               <Label>
//                 {" "}
//                 <strong>Seleccionar forma de pago:</strong>
//               </Label>
//             </Col>
//             <Col md="5">
//               <Button
//                 onClick={() => {
//                   fetchClientes();
//                   setModalTipoVenta(true);
//                 }}
//               >
//                 {" "}
//                 Seleccionar <BsCashCoin size={20} />
//               </Button>
//             </Col>
//           </Row>
//           <br />
//           {arregloTemporal.map((pago, index) => (
//             <div>
//               <Container>
//                 <Row className="align-items-center">
//                   <Col xs={""}>
//                     <Label>Forma de pago:</Label>
//                     <Input value={getFormaPago(Number(pago.formaPago))} disabled />
//                   </Col>
//                   <Col xs={""}>
//                     <Label>Importe:</Label>
//                     <Input
//                       value={
//                         "$" +
//                         Number(pago.importe).toLocaleString("es-MX", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })
//                       }
//                       disabled
//                     />
//                   </Col>
//                   {pago.referencia && (
//                     <Col xs={"2"}>
//                       <Label>Referencia:</Label>
//                       <Input value={pago.referencia} disabled />
//                     </Col>
//                   )}
//                   <Col xs={"2"} md={"2"} className="d-flex justify-content-end mt-4">
//                     {/* Utilizamos "justify-content-end" para alinear el botón a la derecha */}
//                     <Button
//                       color="danger"
//                       onClick={() => {
//                         if (Number(pago.formaPago) === 1) {
//                           // efectivo
//                           eliminarElemento(2, index, Number(pago.importe));
//                         } else if (Number(pago.formaPago) === 94) {
//                           // anticipo
//                           eliminarElemento(1, index, Number(pago.importe));
//                         } else {
//                           // credito
//                           eliminarElemento(0, index, Number(pago.importe));
//                         }
//                       }}
//                     >
//                       <AiFillDelete size={20}></AiFillDelete>
//                     </Button>
//                   </Col>
//                 </Row>
//               </Container>

//               <br />
//             </div>
//           ))}

//           <hr className="my-4" />
//           <br />
//           <Row>
//             <Col md="7">
//               <Label>
//                 <strong>TOTAL DE PAGOS: </strong>
//               </Label>
//             </Col>
//             <Col md="5">
//               <Input
//                 disabled
//                 name="totalPago"
//                 value={"$ " + formPago.totalPago.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               ></Input>
//             </Col>
//           </Row>
//           <br />
//           <Row>
//             <Col md="7">
//               <Label>
//                 <strong>CAMBIO AL CLIENTE: </strong>
//               </Label>
//             </Col>
//             <Col md="5">
//               {/* <Input name="cambioCliente" value={formPago.cambioCliente > 0 ? formPago.cambioCliente : 0} disabled></Input> */}
//               <Input
//                 name="cambioCliente"
//                 value={"$ " + formPago.cambioCliente.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 disabled
//               ></Input>
//             </Col>
//           </Row>
//           <br />
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalOpenPago(false);
//               setArregloTemporal([]);
//               setFormPago({ anticipos: 0, cambioCliente: 0, efectivo: 0, tc: 0, totalPago: 0 });
//               setValidacion(false);
//             }}
//             text="Salir"
//           />

//           <CButton
//             color="success"
//             onClick={() => {
//               // const correo = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente)?.email;
//               // // Validar el formato del correo electrónico
//               // //const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol|tnbmx)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
//               // const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//               // if (!regexCorreo.test(correo)) {
//               //   // Si el formato del correo electrónico no es válido, mostrar una alerta
//               //   Swal.fire({
//               //     icon: "error",
//               //     title: "Error",
//               //     text: `El formato del correo electrónico del cliente no es válido`,
//               //     confirmButtonColor: "#3085d6",
//               //     showCancelButton: true,
//               //     cancelButtonText: "Cancelar",
//               //     cancelButtonColor: "#d33",
//               //     confirmButtonText: "Cambiar correo",
//               //   }).then((result) => {
//               //     if (result.isConfirmed) {
//               //       // Muestra un modal para que el usuario ingrese un nuevo correo electrónico
//               //       //modalActualizar();
//               //       setModalActualizar2(true)
//               //     }
//               //   });
//               //   return; // Detener el proceso de cobro
//               // }
//               // Convertir los valores a números antes de realizar la comparación

//               const recibirCorreo = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente)?.recibirCorreo;
//               const correo = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente)?.email;
//               // Si el cliente tiene la opción de recibirCorreo configurada como false, entonces se valida el formato del correo electrónico

//               const cliente = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente);
//               if (recibirCorreo === false || recibirCorreo === null) {
//                 // Validar el formato del correo electrónico
//                 //const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//                 // const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol|tnbmx)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
//                 const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//                 if (!regexCorreo.test(correo)) {
//                   // Si el formato del correo electrónico no es válido, mostrar una alerta
//                   Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: `El formato del correo electrónico del cliente no es válido`,
//                     confirmButtonColor: "#3085d6",
//                     showCancelButton: true,
//                     cancelButtonText: "Cancelar",
//                     cancelButtonColor: "#d33",
//                     confirmButtonText: "Cambiar correo",
//                   }).then((result) => {
//                     if (result.isConfirmed) {
//                       setModalActualizar2(true);
//                     }
//                   });
//                   return; // Detener el proceso de cobro
//                 }
//               }
//               const cambioCliente = parseFloat(formPago.cambioCliente);
//               const efectivo = parseFloat(formPago.efectivo);
//               const totalVenta = parseFloat(total); // Asegúrate de que "total" sea un número
//               // Validar que el cambio no sea mayor al efectivo
//               if (cambioCliente <= efectivo) {
//                 // Validar que el total de pagos sea mayor o igual al total de venta
//                 if (arregloTemporal.length == 0) {
//                   Swal.fire({
//                     title: "ADVERTENCIA",
//                     text: `Favor de ingresar al menos un método de pago`,
//                     icon: "warning",
//                     confirmButtonColor: "#3085d6",
//                     cancelButtonColor: "#d33",
//                   });
//                 } else {
//                   if (parseFloat(formPago.totalPago) >= totalVenta) {
//                     // El total de pagos es mayor o igual al total de venta, continuar con el proceso de cobro
//                     // setValidacion(true);
//                     // fetchVentas();
//                     setValidacion(false);


//                     setDataTemporal({ Cve_cliente: 0 });
//                     setFormPago({ anticipos: 0, cambioCliente: 0, efectivo: 0, tc: 0, totalPago: 0 });
//                     setArregloTemporal([]);
//                     endVenta();
//                     setModalOpenPago(false);
//                   } else {
//                     // El total de pagos es menor al total de venta, mostrar un mensaje de error
//                     Swal.fire({
//                       icon: "error",
//                       title: "Error",
//                       text: `El total de pagos es menor al total de venta`,
//                       confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
//                     });
//                   }
//                 }
//               } else {
//                 // El cambio es mayor al efectivo, mostrar un mensaje de error
//                 Swal.fire({
//                   icon: "error",
//                   title: "Error",
//                   text: `No se puede ingresar una cantidad de cambio mayor al efectivo que pagó el cliente`,
//                   confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
//                 });
//               }
//             }}
//             text="Cobrar"
//           />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalActualizar2} size="lg">
//         <ModalHeader>
//           <h3>Actualizar correo del cliente</h3>
//         </ModalHeader>
//         <ModalBody>
//           {/* parte */}
//           <Row>
//             <Col sm="6">
//               <CFormGroupInput handleChange={(e) => {
//                 setCorreoCliente(e.target.value)
//               }} inputName="correoCliente" labelName="Correo:" defaultValue={correoCliente ? correoCliente : 'HALA'} minlength={1} maxlength={199} />
//             </Col>
//           </Row>
//         </ModalBody>
//         <ModalFooter>
//           <CButton color="primary" onClick={editar} text="Actualizar" />
//           <CButton color="danger" onClick={cerrarModalActualizar2} text="Cancelar" />
//         </ModalFooter>
//       </Modal>


//       <Modal isOpen={modalOpenInsumos} size="xl">
//         <ModalHeader>Insumos del servicio {datoVentaSeleccionado.d_producto}</ModalHeader>

//         <ModalBody>
//           <Row className="justify-content-end">
//             <Col md={6}>
//               {/* <Button
//                 onClick={() => {
//                   setModalOpenInsumosSelect(true);
//                   fetchInsumosProductoResumen();
//                   fetchInsumosProducto();
//                 }}
//               >
//                 Agregar insumos +
//               </Button> */}

//               <Button
//                 onClick={async () => {
//                   const permiso = await filtroSeguridad("AGREGA_INSUMO");
//                   if (permiso === false) {
//                     return; // Si el permiso es falso o los campos no son válidos, se sale de la función
//                   } else {
//                     setModalOpenInsumosSelect(true);
//                     fetchInsumosProductoResumen();
//                     fetchInsumosProducto();
//                   }
//                 }}
//               >
//                 Agregar insumos +
//               </Button>
//             </Col>
//             <Col md={6}></Col>
//           </Row>
//           <br />
//           <br />
//           <Table size="sm" striped={true} responsive={"sm"}>
//             <thead>
//               <tr>
//                 {TableDataHeaderInsumo.map((valor: any) => (
//                   <th key={valor}>{valor}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {datoInsumosProductoResumen.length > 0
//                 ? datoInsumosProductoResumen.map((dato: any) => (
//                   <tr key={dato.id}>
//                     {dato.id ? (
//                       <>
//                         <td>{dato.d_insumo}</td>
//                         <td align="left">{cantidadInsumo(dato.id_insumo)}</td>
//                         <td align="left">{dato.unidadMedida}</td>
//                         <td align="center">{dato.cantidad}</td>

//                         <td className="gap-5">
//                           <AiFillEdit
//                             className="mr-2"
//                             onClick={() => {
//                               setModalEditInsumo(true);
//                               setFormInsumo({
//                                 cantidad: dato.cantidad,
//                                 fechaAlta: dato.fechaAlta,
//                                 id: dato.id,
//                                 id_insumo: dato.id_insumo,
//                                 id_venta: dato.id_venta,
//                                 unidadMedida: dato.unidadMedida,
//                                 d_insumo: dato.d_insumo,
//                                 existencia: cantidadInsumo(dato.id_insumo),
//                               });
//                             }}
//                             size={23}
//                           ></AiFillEdit>
//                           {/* <AiFillDelete
//                             color="lightred"
//                             onClick={() => {
//                               deleteInsumo(dato);
//                               setTimeout(() => {
//                                 fetchInsumosProducto();
//                               }, 1000);
//                             }}
//                             size={23}
//                           /> */}
//                           <AiFillDelete
//                             color="lightred"
//                             onClick={async () => {
//                               const permiso = await filtroSeguridad("ELIMINA_INSUMO ");
//                               if (permiso === false) {
//                                 return; // Si el permiso es falso o los campos no son válidos, se sale de la función
//                               } else {
//                                 deleteInsumo(dato);
//                                 setTimeout(() => {
//                                   fetchInsumosProducto();
//                                 }, 1000);
//                               }
//                             }}
//                             size={23}
//                           />
//                         </td>
//                       </>
//                     ) : null}
//                   </tr>
//                 ))
//                 : null}
//             </tbody>
//           </Table>
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalOpenInsumos(false);
//             }}
//             text="Salir"
//           />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalOpenInsumosSelect} size="xl">
//         <ModalBody>
//           <br />
//           <TableInsumosGenerales
//             datoVentaSeleccionado={selectedID2}
//             data={data}
//             setModalOpen2={setModalOpenInsumosSelect}
//             handleGetFetch={fetchInsumosProductoResumen}
//             datoInsumosProducto={datoInsumosProducto}
//             datoInsumosProductoResumen={datoInsumosProductoResumen}
//             setDescInsumos={setDescInsumos}
//             descInsumos={descInsumos}
//           ></TableInsumosGenerales>
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalOpenInsumosSelect(false);
//             }}
//             text="Salir"
//           />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalEditInsumo} size="md">
//         <ModalHeader>
//           <h3>Edición de insumo</h3>{" "}
//         </ModalHeader>
//         <ModalBody>
//           <Row>
//             <Col>
//               <Label>
//                 Insumo utilizado: <strong>{formInsumo.d_insumo}</strong>{" "}
//               </Label>
//               <Label>
//                 Cantidad de existencia: <strong>{formInsumo.existencia}</strong>{" "}
//               </Label>
//               <br />
//               <br />
//               <Label> Cantidad a modificar: </Label>
//               <Input value={formInsumo.cantidad} name="cantidad" onChange={cambiosInsumos} type="number"></Input>
//               <br />
//             </Col>
//           </Row>
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalEditInsumo(false);
//             }}
//             text="Cancelar"
//           />
//           {/* <Button
//             color="success"
//             style={{ width: "34%" }}
//             onClick={() => {
//               editInsumo();
//             }}
//           >
//             Guardar cambios
//           </Button> */}

//           <Button
//             color="success"
//             onClick={async () => {
//               const permiso = await filtroSeguridad("EDITAR_INSUMO ");
//               if (permiso === false) {
//                 return; // Si el permiso es falso o los campos no son válidos, se sale de la función
//               } else {
//                 editInsumo();
//               }
//             }}
//           >
//             Guardar cambios
//           </Button>
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalTicket} size="sm">
//         <ModalHeader>Preview</ModalHeader>
//         <ModalBody>
//           {/* <br />
//           <Row>
//             <div className="text-left" style={{ fontFamily: "courier new" }}>
//               {datoTicket
//                 ? datoTicket.map((ticket) => (
//                     <>
//                       <Label> {ticket.LINEA} </Label>
//                       <br />
//                     </>
//                   ))
//                 : null}
//             </div>
//             <br />
//           </Row>
//           <br /> */}
//           <div style={{ fontFamily: "Courier New", whiteSpace: "pre", fontSize: "12px" }}>
//             {datoTicket &&
//               datoTicket.map((ticket, index) => (
//                 <strong key={index}>
//                   {ticket.LINEA}
//                   <br />
//                 </strong>
//               ))}
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="primary"
//             onClick={() => {
//               openTicketPreview();
//             }}
//             text="Imprimir"
//           />
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalTicket(false);
//             }}
//             text="Salir"
//           />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalEstilistaSelector} size="sm">
//         <ModalHeader>Seleccione el estilista para el ticket</ModalHeader>
//         <ModalBody>
//           <Table size="sm" striped={true} responsive={"sm"}>
//             <thead>
//               <tr>
//                 {TabñeDataHeaderEstilistaProceso.map((valor: any) => (
//                   <th key={valor}>{valor}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {estilistaProceso.map((dato: any) => (
//                 <tr key={dato.User}>
//                   <>
//                     <td> {dato.d_estilista} </td>
//                     <td>
//                       <Button
//                         onClick={() => {
//                           postEstilistaTicket(dato);
//                           setModalTicketEstilista(true);
//                         }}
//                         cantidad
//                       >
//                         Seleccionar
//                       </Button>
//                     </td>
//                   </>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalEstilistaSelector(false);
//               // stas;
//             }}
//             text="Salir"
//           />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalTicketEstilista} size="sm">
//         <ModalHeader>Preview de ticket del estilista</ModalHeader>
//         <ModalBody>
//           <div style={{ fontFamily: "Courier New", whiteSpace: "pre", fontSize: "12px" }}>
//             {datoTicketEstilista &&
//               datoTicketEstilista.map((ticket, index) => (
//                 <strong key={index}>
//                   {ticket.LINEA}
//                   <br />
//                 </strong>
//               ))}
//           </div>
//           {/* <br />
//           <Row>
//             <TicketPrint>
//               <div className="text-left" style={{ fontFamily: "courier new" }}>
//                 {datoTicketEstilista.length > 0 ? (
//                   datoTicketEstilista.map((ticket) => (
//                     <>
//                       <Label> {ticket.LINEA} </Label>
//                       <br />
//                     </>
//                   ))
//                 ) : (
//                   <h5>Se ha impreso ticket de insumos del estilista. </h5>
//                 )}
//               </div>
//               <br />
//             </TicketPrint>
//           </Row>
//           <br /> */}
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="primary"
//             onClick={() => {
//               openTicketEstilistaPreview();
//             }}
//             text="Imprimir"
//           />
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalTicketEstilista(false);
//             }}
//             text="Salir"
//           />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalAnticipo} size="xl">
//         <ModalHeader>
//           <h3>Elegir anticipo</h3>
//         </ModalHeader>
//         <ModalBody>
//           {dataAnticipos.length === 0 ? <h4> Por el momento el cliente no cuenta con anticipos </h4> : null}
//           <br />
//           <DataTable></DataTable>
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalAnticipo(false);
//             }}
//             text="Salir"
//           />
//         </ModalFooter>
//       </Modal>
//       <Modal isOpen={modalTiendaVirtual} size="xl">
//         <ModalHeader>
//           <h3>Elegir tienda virtual</h3>
//         </ModalHeader>
//         <ModalBody>
//           {dataAnticipos.length === 0 ? <h4> Por el momento el cliente no cuenta con anticipos </h4> : null}
//           <br />
//           <DataTableTiendaVirtual></DataTableTiendaVirtual>
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalTiendaVirtual(false);
//             }}
//             text="Salir"
//           />
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalTipoVenta} size="xl">
//         <ModalHeader>
//           <h3>Elegir forma de pago</h3>
//         </ModalHeader>
//         <ModalBody>
//           <Label> Forma de pago: </Label>
//           {/* <Input type="select" onChange={handleFormaPagoTemporal} value={dataArregloTemporal.formaPago} name={"formaPago"}>
//             <option value={""}>--Seleccione la forma de pago--</option>
//             {formasPagosFiltradas.map((formaPago, index) => (
//               <option key={index} value={formaPago.tipo}>
//                 {formaPago.descripcion}
//               </option>
//             ))}
//           </Input>
//            */}

// <Input type="select" onChange={handleFormaPagoTemporal} value={dataArregloTemporal.formaPago} name="formaPago">
//     <option value="">--Seleccione la forma de pago--</option>
//     {formasPagosFiltradas
//         .filter((formaPago) =>
//             promocion === 1 ? formaPago.descripcion.includes("EFECTIVO") || formaPago.descripcion.includes("anticipos") : true
//         )
//         .map((formaPago, index) => (
//             <option key={index} value={formaPago.tipo}>
//                 {formaPago.descripcion}
//             </option>
//         ))}
// </Input>
//           <br />
//           <Label> Importe: </Label>
//           <Input
//             type="number"
//             onChange={handleFormaPagoTemporal}
//             value={dataArregloTemporal.importe}
//             name={"importe"}
//             disabled={anticipoSelected}
//           ></Input>
//           <br />
//           {dataArregloTemporal.formaPago == 90 ||
//             dataArregloTemporal.formaPago == 91 ||
//             dataArregloTemporal.formaPago == 80 ||
//             dataArregloTemporal.formaPago == 92 ||
//             dataArregloTemporal.formaPago == 100 ||
//             dataArregloTemporal.formaPago == 101 ||
//             dataArregloTemporal.formaPago == 110 ||
//             dataArregloTemporal.formaPago == 103 ? (
//             <>
//               <Label> Referencia: </Label>
//               <Input onChange={handleFormaPagoTemporal} value={dataArregloTemporal.referencia} name={"referencia"}></Input>
//             </>
//           ) : null}

//           <br />
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalTipoVenta(false);
//               setAnticipoSelected(false);
//               setDataArregloTemporal({ ...dataArregloTemporal, formaPago: 0, importe: 0, referencia: "" });
//             }}
//             text="Salir"
//           />
//           <CButton
//             color="success"
//             onClick={() => {
//               setAnticipoSelected(false);
//               // Validación de campos
//               if (!dataArregloTemporal.formaPago || dataArregloTemporal.formaPago === 0) {
//                 Swal.fire({
//                   icon: "error",
//                   title: "Oops...",
//                   text: "Por favor, seleccione una forma de pago.",
//                 });
//                 return;
//               } else if (dataArregloTemporal.importe < 0) {
//                 Swal.fire({
//                   icon: "error",
//                   title: "Oops...",
//                   text: "Por favor, ingrese un importe válido.",
//                 });
//                 return;
//               } else if (dataArregloTemporal.formaPago != 1 && !dataArregloTemporal.referencia) {
//                 Swal.fire({
//                   icon: "error",
//                   title: "Oops...",
//                   text: "Por favor, ingrese una referencia.",
//                 });
//                 return;
//               } else {
//                 // Tarjetas / Movimientos bancarios
//                 if (anticipoId > 0) {
//                   let anticipoTemp = (Number(formPago.anticipos) * -1 + Number(formAnticipo.importe)) * -1;
//                   setFormPago({ ...formPago, anticipos: anticipoTemp });
//                 } else {
//                   if (
//                     Number(dataArregloTemporal.formaPago) === 90 ||
//                     Number(dataArregloTemporal.formaPago) === 91 ||
//                     Number(dataArregloTemporal.formaPago) === 92 ||
//                     Number(dataArregloTemporal.formaPago) === 100 ||
//                     Number(dataArregloTemporal.formaPago) === 101 ||
//                     Number(dataArregloTemporal.formaPago) === 110 ||
//                     Number(dataArregloTemporal.formaPago) === 103
//                   ) {
//                     setFormPago({ ...formPago, tc: Number(formPago.tc) + Number(dataArregloTemporal.importe) });
//                     // Efectivo
//                   } else if (Number(dataArregloTemporal.formaPago) === 1) {
//                     setFormPago({ ...formPago, efectivo: Number(dataArregloTemporal.importe) });
//                   }
//                 }
//                 setArregloTemporal([...arregloTemporal, dataArregloTemporal]);
//                 setAnticipoId(0);
//                 setModalTipoVenta(false);
//                 setDataArregloTemporal({ d_formaPago: "", formaPago: 0, importe: 0, referencia: "" });
//               }
//             }}
//             text="Guardar"
//           />
//         </ModalFooter>
//       </Modal>
//       {/* AQUI COMIENZO MI EDIT...........E........... */}
//       <Modal isOpen={modalOpenVentaEdit} size="lg">
//         <ModalHeader>
//           <div>
//             <h3>Venta edición</h3>
//           </div>
//         </ModalHeader>
//         <ModalBody>
//           <Label>Producto/Servicio:</Label>
//           <Row>
//             <Col md={12}>
//               <InputGroup>
//                 <Input disabled value={dataVentaEdit.d_producto ? dataVentaEdit.d_producto : ""} />
//                 <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
//               </InputGroup>
//             </Col>
//           </Row>
//           <br />
//           <Label>Encargado:</Label>
//           <Row>
//             <Col md={12}>
//               <InputGroup>
//                 <Input disabled value={dataVentaEdit.d_estilista ? dataVentaEdit.d_estilista : ""} />
//                 <Button
//                   onClick={() => {
//                     setModalOpen2(true);
//                     setFlagEstilistas(false);
//                   }}
//                 >
//                   Elegir
//                 </Button>
//               </InputGroup>
//             </Col>
//           </Row>
//           <br />
//           {dataVentaEdit.Observacion === "SERV" ? (
//             <>
//               <Label>Estilista auxilliar:</Label>
//               <Row>
//                 <Col xs={10}>
//                   <InputGroup>
//                     <Input disabled value={dataVentaEdit.d_estilistaAuxilliar ? dataVentaEdit.d_estilistaAuxilliar : ""} />
//                     <Button
//                       onClick={() => {
//                         setModalOpen2(true);
//                         setFlagEstilistas(true);
//                       }}
//                     >
//                       Elegir
//                     </Button>
//                   </InputGroup>
//                 </Col>
//                 <Col xs={2}>
//                   <Button color="danger" onClick={() => setDataVentaEdit({ ...dataVentaEdit, idestilistaAux: 0, d_estilistaAuxilliar: "" })}>
//                     <AiFillDelete></AiFillDelete>
//                   </Button>
//                 </Col>
//               </Row>
//               <br />
//             </>
//           ) : null}
//           <Row>
//             <Col sm="6">
//               <Label>Cantidad en existencia: </Label>
//               <Input
//                 disabled
//                 placeholder="Cantidad en existencia"
//                 onChange={cambiosEdit}
//                 name="d_existencia"
//                 value={dataVentaEdit.d_existencia ? dataVentaEdit.d_existencia : getExistenciaForeignKey(dataVentaEdit.Clave_prod)}
//               />
//               {/* Revisar si hay error de render en esta linea 2264 */}
//             </Col>
//             <Col sm="6">
//               <Label>Precio:</Label>
//               <Input
//                 disabled
//                 placeholder="Precio"
//                 onChange={cambiosEdit}
//                 name="Precio"
//                 value={dataVentaEdit.Precio ? "$" + dataVentaEdit.Precio.toFixed(2) : 0}
//               />
//               <br />
//             </Col>

//             <Col sm="6">
//               <Label>Cantidad a vender:</Label>
//               <Input placeholder="Cantidad" onChange={cambiosEdit} name="Cant_producto" value={dataVentaEdit.Cant_producto} />
//             </Col>
//             {dataVentaEdit.Observacion === "SERV" ? (
//               <Col sm="6">
//                 <Label>Tiempo:</Label>
//                 <Input placeholder="tiempo" onChange={cambiosEdit} name="tiempo" value={dataVentaEdit.tiempo} />
//               </Col>
//             ) : null}
//           </Row>
//           <br />
//           <Label>Tipo de descuento:</Label>
//           <Input type="select" name="Clave_Descuento" value={dataVentaEdit.Clave_Descuento} onChange={cambiosEdit}>
//             <option value={0}>-Selecciona El tipo de descuento-</option>
//             {dataDescuentos.map((descuento) => (
//               <option value={descuento.id}>{descuento.descripcion}</option>
//             ))}
//           </Input>
//           <br />
//           <Label>
//             Descuento {descuento.min} - {descuento.max} :{" "}
//           </Label>
//           <Row>
//             <Col md={"12"}>
//               <Input name="Descuento" value={dataVentaEdit.Descuento} onChange={cambiosEdit} placeholder="0.0" type="number"></Input>
//             </Col>
//           </Row>
//           <br />
//           {dataVentaEdit.Observacion === "SERV" ? (
//             <>
//               <Label style={{ marginRight: 10 }}>Hora de servicio:</Label>
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <TimePicker
//                   sx={{ width: 1 / 3, height: 1, paddingBottom: 5 }}
//                   label="Seleccione la hora"
//                   defaultValue={new Date(dataVentaEdit.hora)}
//                   onChange={(newValue) => setDataVentaEdit((prev) => ({ ...prev, hora: newValue }))}
//                 />
//               </LocalizationProvider>
//             </>
//           ) : null}
//         </ModalBody>
//         <ModalFooter>
//           <CButton
//             color="danger"
//             onClick={() => {
//               setModalOpenVentaEdit(false);
//               setDescuento({ min: 0, max: 0 });
//               setDataVentaEdit({ ...dataVentaEdit, Cant_producto: 0, d_existencia: 0 });
//             }}
//             text="Salir"
//           />
//           <Button
//             color="primary"
//             disabled={dataVentaEdit.d_producto || dataVentaEdit.cliente ? false : true}
//             onClick={() => {
//               if (dataVentaEdit.Cant_producto == 0) {
//                 Swal.fire({
//                   icon: "info",
//                   text: "No ha seleccionado cantidad a vender",
//                 });
//               } else if (!dataVentaEdit.d_producto) {
//                 Swal.fire({
//                   icon: "info",
//                   text: "No ha seleccionado producto",
//                 });
//               } else if (!dataVentaEdit.d_estilista) {
//                 Swal.fire({
//                   icon: "info",
//                   text: "No ha seleccionado estilista",
//                 });
//               } else if (dataVentaEdit.Descuento > descuento.max || dataVentaEdit.Descuento < descuento.min) {
//                 Swal.fire({
//                   icon: "info",
//                   text: "Favor de verificar el descuento",
//                 });
//               } else {
//                 //setModalOpen(false);
//                 if (dataVentaEdit.Observacion !== "SERV") {
//                   if (Number(dataVentaEdit.Cant_producto) > Number(dataVentaEdit.existenciaEdit)) {
//                     Swal.fire({
//                       icon: "info",
//                       text: "Favor de verificar las existencias",
//                     });
//                     return;
//                   }
//                 }
//                 if (dataVentaEdit.d_producto) {
//                   editVenta();
//                   setDataTemporal((prevData) => ({
//                     ...datosInicialesArreglo[0],
//                     cliente: prevData.cliente,
//                     Cve_cliente: prevData.Cve_cliente,
//                   }));
//                   setDescuento({ min: 0, max: 0 });
//                 }
//               }
//             }}
//           >
//             Editar venta
//           </Button>
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={modalOpen} toggle={toggleModalHistorial} fullscreen>
//         <ModalHeader toggle={toggleModalHistorial}>
//           <h3>Historial del cliente</h3>{" "}
//         </ModalHeader>
//         <ModalBody>
//           <TableHistorial
//             datah={datah}
//             loadHistorialDetalle={loadHistorialDetalle}
//             setIsModalOpen={setIsModalOpen}
//             setParamsDetalles={setParamsDetalles}
//           ></TableHistorial>

//           <br />
//           <div>
//             <Card style={{ width: "1650px", height: "400px" }}>
//               <CardBody>
//                 <h3>Historial citas futuras</h3>
//                 <br />
//                 <div>
//                   <Table hover className="table-responsive">
//                     <thead>
//                       <tr>
//                         <th>Fecha</th>
//                         <th>Hora</th>
//                         <th>Sucursal</th>
//                         <th>Servicio</th>
//                         <th>Estilista</th>
//                         <th>Usuario</th>
//                         <th>Feha alta cita</th>
//                         {/* Agrega más encabezados según tus datos */}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {datah1.map((item, index) => (
//                         <tr key={index}>
//                           <td>{item.fechaCita}</td>
//                           <td>{item.hora}</td>
//                           <td>{item.nombreSuc}</td>
//                           <td>{item.Servicio}</td>
//                           <td>{item.Estilista}</td>
//                           <td>{item.nombreUsrRegistra}</td>
//                           <td>{item.fechaAlta}</td>
//                           {/* Agrega más celdas según tus datos */}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               </CardBody>
//             </Card>
//           </div>
//           <br />
//         </ModalBody>
//         <ModalFooter>
//           <Button color="danger" onClick={toggleModalHistorial}>
//             Cerrar
//           </Button>
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} size="lg">
//         <ModalHeader toggle={handleCloseModal}>Historial detalle</ModalHeader>
//         <ModalBody>
//           <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
//             <Table>
//               <thead>
//                 <tr>
//                   <th>
//                     <p>
//                       <strong>Fecha:</strong> {paramsDetalles.fecha.split("T")[0]}
//                     </p>
//                   </th>
//                   <th>
//                     <p>
//                       <strong>No. Venta: </strong>
//                       {paramsDetalles.numVenta}
//                     </p>
//                   </th>
//                   <th>
//                     <p>
//                       <strong>Sucursal:</strong> {paramsDetalles.sucursal}
//                     </p>
//                   </th>
//                 </tr>
//               </thead>
//             </Table>
//             <Table>
//               <thead>
//                 <tr>
//                   <th>Insumo</th>
//                   <th>Cantidad</th>
//                   <th>Precio</th>
//                   <th>Importe</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {historialDetalle.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.Insumo}</td>
//                     <td>{item.Cant}</td>
//                     <td>{item.precio}</td>
//                     <td>{item.importe}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <div>
//               <p style={{ textAlign: "left" }}>
//                 <strong>Total: ${totalImportes.toFixed(2)}</strong>
//               </p>
//             </div>
//           </div>
//         </ModalBody>
//       </Modal>
//       <Modal isOpen={modalOpenPromo} size="sm" toggle={() => setModalOpenPromo(false)}>
//         <ModalHeader>Descuento disponible</ModalHeader>
//         <ModalBody>
//           {/* Asumiendo que solo quieres mostrar los datos del primer ítem */}
//           {dataPromo && dataPromo["0"] && (
//             <div>
//               <p>
//                 ¡Buenas noticias! La venta califica para un descuento especial. Al pagar con <strong>{dataPromo["0"].descripcion}</strong>, el total de la venta será de solo <strong>${dataPromo["0"].importeDescuento}</strong>.
//               </p>

//             </div>
//           )}

//         </ModalBody>
//         <ModalFooter>
//           <CButton color="danger" onClick={() => setModalOpenPromo(false)} text="Salir" />
//         </ModalFooter>
//       </Modal>

//     </>
//   );
// };

// export default Ventas;



import React, { useEffect, useState, useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import CFormGroupInput from "../../components/CFormGroupInput";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InputGroup,
  Row,
  Table,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
} from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import CButton from "../../components/CButton";
import TableEstilistas from "./Components/TableEstilistas";
import TableProductos, { InsumoExistencia, ProductoExistencia } from "./Components/TableProductos";
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
import { AnticipoGet } from "../../models/Anticipo";
import { useAnticipoVentas } from "../../hooks/getsHooks/useAnticipoVentas";
import { useFormasPagos } from "../../hooks/getsHooks/useFormasPagos";
import { FormaPago } from "../../models/FormaPago";
import TimeKeeper from "react-timekeeper";
import { useVentasProceso } from "../../hooks/getsHooks/useVentasProceso";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { MdOutlineReceiptLong, MdAttachMoney, MdAccessTime, MdDataSaverOn, MdPendingActions, MdEmojiPeople } from "react-icons/md";
import { format } from "date-fns";
import TableHistorial from "./Components/TableHistorial";
import TableAnticipos from "./Components/TableAnticipos";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useNavigate } from "react-router-dom";
import { FaCashRegister } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { useProductosFiltradoExistenciaProductoAlm } from "../../hooks/getsHooks/useProductosFiltradoExistenciaProductoAlm";
import axios from "axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useInsumosProductosResumen } from "../../hooks/getsHooks/useInsumoProductoResumen";
import { useInsumoProductoSolicitud } from "../../hooks/getsHooks/useInsumoProductoSolicitud";
import { ALMACEN } from "../../utilities/constsAlmacenes";
import TableTiendaVirtual from "./Components/TableTiendaVirtual";
import { Cliente } from "../../models/Cliente";
import { FcPaid } from "react-icons/fc";
import { FcSynchronize } from "react-icons/fc";
import { FcDownload } from "react-icons/fc";
import { GoPersonAdd } from "react-icons/go";
interface TicketPrintProps {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}
const Ventas = () => {
  const { filtroSeguridad, session } = useSeguridad();
  const [showView, setShowView] = useState(true);

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ parsedItem });

      getPermisoPantalla(parsedItem);
    }
  }, []);


  const getPermisoPantalla = async (userData) => {
    try {
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_ventas_view`);

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

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app"); // Redirige a la ruta "/app"
  };

  const { modalActualizar, setModalActualizar, cerrarModalActualizar } = useModalHook();
  const [modalActualizar2, setModalActualizar2] = useState(false)
  const [modalOpenVenta, setModalOpen] = useState<boolean>(false);
  const [modalOpenVentaEdit, setModalOpenVentaEdit] = useState<boolean>(false);
  const [modalOpen2, setModalOpen2] = useState<boolean>(false);
  const [modalOpen3, setModalOpen3] = useState<boolean>(false);
  const [modalOpenPago, setModalOpenPago] = useState<boolean>(false);
  const [modalOpenPromo, setModalOpenPromo] = useState<boolean>(false);
  const [modalOpenInsumos, setModalOpenInsumos] = useState<boolean>(false);
  const [modalOpenInsumos1, setModalOpenInsumos1] = useState<boolean>(false);
  const [modalOpenInsumosSelect, setModalOpenInsumosSelect] = useState<boolean>(false);
  const [modalEditInsumo, setModalEditInsumo] = useState<boolean>(false);
  const [modalClientesProceso, setModalClientesProceso] = useState<boolean>(false);
  const [modalCliente, setModalCliente] = useState<boolean>(false);
  const [modalTicket, setModalTicket] = useState<boolean>(false);
  const [modalTicketEstilista, setModalTicketEstilista] = useState<boolean>(false);
  const [modalAnticipo, setModalAnticipo] = useState<boolean>(false);
  const [modalTiendaVirtual, setModalTiendaVirtual] = useState<boolean>(false);
  const [modalTipoVenta, setModalTipoVenta] = useState<boolean>(false);
  const [modalEstilistaSelector, setModalEstilistaSelector] = useState<boolean>(false);

  const [total, setTotal] = useState<number>(0);
  const [tiempo, setTiempo] = useState<number>(0);
  const [hora, setHora] = useState<string>("");

  const [validacion, setValidacion] = useState(false);
  const [dataVentasValidacion, setDataVentasValidacion] = useState<Venta[]>();
  const [dataVentasOld, setDataVentasOld] = useState<Venta[]>();

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
  const [arregloTemporal, setArregloTemporal] = useState<{ importe: number; formaPago: number; referencia: string }[]>([]);
  const [dataArregloTemporal, setDataArregloTemporal] = useState({
    formaPago: 0,
    importe: 0,
    d_formaPago: "",
    referencia: "",
  });

  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  const { dataClientes, fetchClientes } = useClientes();
  const { dataTrabajadores } = useNominaTrabajadores();
  const dataFiltrada = dataTrabajadores.filter(estilista => estilista.status !== 2);

  const { dataDescuentos } = useDescuentos();
  const [formasPagosFiltradas, setFormasPagosFiltradas] = useState<FormaPago[]>([]);

  const { dataFormasPagos } = useFormasPagos();

  const [form, setForm] = useState<Usuario[]>([]);
  const [datoTicket, setDatoTicket] = useState([]);
  const [datoTicketEstilista, setDatoTicketEstilista] = useState([]);
  const { dataVentasProcesos, fetchVentasProcesos } = useVentasProceso({ idSucursal: dataUsuarios2[0]?.sucursal, estilista: 0 });

  const nombreClienteParam = new URLSearchParams(window.location.search).get("nombreCliente");
  const nombreCliente = nombreClienteParam ? nombreClienteParam.replace(/%20/g, "").replace(/#/g, "") : "";
  const idCliente = new URLSearchParams(window.location.search).get("idCliente");
  const [correoCliente, setCorreoCliente] = useState("")

  useEffect(() => {
    setDataTemporal((prevDataTemporal) => ({
      ...prevDataTemporal,
      cliente: nombreCliente ? nombreCliente.toString() : "",
      Cve_cliente: Number(idCliente),
    }));
  }, [nombreCliente, idCliente]);

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
    Fecha: "2023-06-14T00:10:57.817",
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
    hora: "2023-06-14T00:10:57.817",
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
    existencia: 1,
  });

  const [selectedID2, setSelectedID] = useState(0);

  const [formPago, setFormPago] = useState({
    efectivo: 0,
    tc: 0,
    anticipos: 0,
    totalPago: 0,
    tiendaVirtual: 0,
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
    idformaPago: 0,
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
  const [dataVentaEdit, setDataVentaEdit] = useState<Venta>({
    id: 0,
    Sucursal: 0,
    Fecha: "",
    Caja: 1,
    No_venta: 1,
    Clave_prod: 1,
    Cant_producto: 0,
    Precio: 0,
    Precio_base: 0,
    Cve_cliente: 0,
    Tasa_iva: 0.16,
    ieps: 0,
    Observacion: "",
    Descuento: 0,
    Clave_Descuento: 0,
    Usuario: 0,
    Credito: false,
    Corte: 1,
    Corte_parcial: 1,
    Costo: 1,
    cancelada: false,
    idEstilista: 1,
    folio_estilista: 1,
    hora: 8,
    tiempo: 1,
    terminado: false,
    validadoServicio: false,
    Cia: 0,
    cliente: "",
    d_estilista: "",
    d_producto: "",
    d_existencia: "",
    estilista: "",
    producto: "",
    formaPago: 0,
    existenciaEdit: 0,
  });
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
      Cant_producto: 0,
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
      hora: new Date(),
      tiempo: 0,
      terminado: false,
      validadoServicio: false,
      ieps: 0,
      Usuario: 0,
      Credito: false,
      idestilistaAux: 0,
      idRecepcionista: 0,
    },
  ];
  const [dataTemporal, setDataTemporal] = useState<Venta>({
    id: 0,
    Sucursal: 0,
    Fecha: "",
    Caja: 1,
    No_venta: 1,
    Clave_prod: 1,
    Cant_producto: 1,
    Precio: 0,
    Precio_base: 0,
    Cve_cliente: 0,
    Tasa_iva: 0.16,
    ieps: 0,
    Observacion: "",
    Descuento: 0,
    Clave_Descuento: 0,
    Usuario: 0,
    Credito: false,
    Corte: 1,
    Corte_parcial: 1,
    Costo: 1,
    cancelada: false,
    idEstilista: 0,
    folio_estilista: 1,
    hora: new Date(),
    tiempo: 1,
    terminado: false,
    validadoServicio: false,
    Cia: 0,
    cliente: "",
    d_estilista: "",
    d_producto: "",
    d_existencia: "",
    estilista: "",
    producto: "",
    formaPago: 0,
    idestilistaAux: 0,
    idRecepcionista: 0,
  });

  useEffect(() => {
    const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
    setCorreoCliente(correo[0]?.email ? correo[0]?.email : 'SIN CORREOP')
  }, [dataTemporal.Cve_cliente])


  const [data, setdata] = useState<Venta[]>([]);
  useEffect(() => {
    setdata(datosInicialesArreglo);
  }, []);

  const TableDataHeader = [
    "Estilista",
    "Auxiliar",
    "Producto/Servicio",
    "Cantidad",
    "Precio unitario",
    "Precio total",
    "Descuento autorizado",
    "Importe",
    "Acciones",
  ];
  const TableDataHeaderInsumo = ["Insumo", "Existencia", "Unidad de medida", "Cantidad", "Acciones"];

  const TabñeDataHeaderEstilistaProceso = ["Estilista", ""];
  const { datoInsumosProductoResumen, fetchInsumosProductoResumen } = useInsumosProductosResumen({
    idVenta: selectedID2,
  });


  const TableDataHeaderInsumoSoli = ["Insumo", "Existencia", "Unidad de medida", "Cantidad", "Enlace", "Fecha", "Acciones"];
  const [modalOpenInsumosSolicitud, setModalOpenInsumosSolicitud] = useState<boolean>(false);
  const { datoInsumosProductoSolicitud, fetchInsumosProductoSolicitud } = useInsumoProductoSolicitud({
    idVenta: selectedID2,
  });

  const [alertShown, setAlertShown] = useState<boolean>(false);


  // useEffect(() => {
  //   // Verifica si hay insumos con enlazado = false
  //   const insumosNoEnlazados = datoInsumosProductoSolicitud.filter(
  //     (insumo: any) => insumo.enlazado === false
  //   );

  //   // Si hay insumos no enlazados, mostrar alerta
  //   if (insumosNoEnlazados.length > 0) {
  //     const listaInsumos = insumosNoEnlazados.map((insumo: any) => insumo.d_insumo).join(", ");

  //     Swal.fire({
  //       icon: "warning",
  //       title: "Advertencia",
  //       text: `Los siguientes servicios tienen insumos no enlazados: ${listaInsumos}`,
  //       confirmButtonColor: "#3085d6",
  //       showCancelButton: true,
  //       confirmButtonText: "Ir a enlazar",
  //       cancelButtonText: "Cancelar",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // Abre el modal al hacer clic en "Ir a enlazar"
  //         setModalOpenInsumosSolicitud(true);
  //       }
  //     });
  //   }
  // }, [datoInsumosProductoSolicitud]);

  useEffect(() => {
    // Verifica si hay insumos con enlazado = false
    const insumosNoEnlazados = datoInsumosProductoSolicitud.filter(
      (insumo: any) => insumo.enlazado === false
    );

    // Si hay insumos no enlazados y la alerta no ha sido mostrada
    if (insumosNoEnlazados.length > 0 && !alertShown) {
      const listaInsumos = insumosNoEnlazados.map((insumo: any) => insumo.d_insumo).join(", ");

      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: `El servicio contiene insumos no enlazados: ${listaInsumos}`,
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        confirmButtonText: "Ir a enlazar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Abre el modal al hacer clic en "Ir a enlazar"
          setModalOpenInsumosSolicitud(true);
        }
        setAlertShown(true); // Marca la alerta como mostrada
      });
    }
  }, [datoInsumosProductoSolicitud, alertShown]);



  const [descuento, setDescuento] = useState({
    min: 0,
    max: 0,
  });
  const cambios = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "hora") {
      setDataTemporal((prev) => ({ ...prev, [name]: value }));
      console.log(dataTemporal.hora);
    } else if (name === "Clave_Descuento") {
      setFlag(false);

      const descuentito = dataDescuentos.find((objeto) => objeto.id === Number(value));
      setDataTemporal({
        ...dataTemporal,
        Clave_Descuento: value,
      });
      setDescuento({
        min: descuentito?.min_descto ? Number(descuentito?.min_descto) : 0,
        max: descuentito?.max_descto ? Number(descuentito?.max_descto) : 0,
      });
      setTimeout(() => {
        setFlag(true);
      }, 2000);
    } else {
      setDataTemporal((prev) => ({ ...prev, [name]: value }));
    }
  };
  const cambiosEdit = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "hora") {
      // const partesHora = value.split(":");
      // const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
      // const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
      // let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut
      setDataVentaEdit((prev) => ({ ...prev, [name]: value }));
    } else if (name === "Clave_Descuento") {
      setFlag(false);
      const descuentito = dataDescuentos.find((objeto) => objeto.id === Number(value));
      setDataVentaEdit({
        ...dataVentaEdit,
        Clave_Descuento: value,
      });
      setDescuento({
        min: descuentito?.min_descto ? Number(descuentito?.min_descto) : 0,
        max: descuentito?.max_descto ? Number(descuentito?.max_descto) : 0,
      });
      setTimeout(() => {
        setFlag(true);
      }, 2000);
    } else {
      setDataVentaEdit((prev) => ({ ...prev, [name]: value }));
    }
    console.log(name);
  };

  const [anticipoSelected, setAnticipoSelected] = useState(false);
  const [tiendaVirtualSelected, setTiendaVirtualSelect] = useState(false);
  const handleFormaPagoTemporal = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Comprueba si el método de pago seleccionado ya está en el arregloTemporal
    const isAlreadySelected = arregloTemporal.some((pago) => Number(pago.formaPago) === Number(value));

    if (isAlreadySelected && name === "formaPago") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `¡Método de pago ya seleccionado!`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    } else if (name === "formaPago" && Number(value) === 94) {
      setModalAnticipo(true);
      setAnticipoSelected(true);
      setDataArregloTemporal((prev) => ({ ...prev, [name]: value }));
    } else if (name === "formaPago" && Number(value) === 245) {
      setModalTiendaVirtual(true);
      setAnticipoSelected(true);
      setDataArregloTemporal((prev) => ({ ...prev, [name]: value }));
    } else {
      setAnticipoSelected(false);
      setDataArregloTemporal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const cambiosInsumos = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormInsumo((prev) => ({ ...prev, [name]: value }));
    console.log(formInsumo);
  };
  // SUMATORIAS
  useEffect(() => {
    const totalCobro = Number(formPago.anticipos) + Number(formPago.efectivo) + Number(formPago.tc);
    const totalCambio = Number(totalCobro) - Number(total);
    setFormPago((prev) => ({
      ...prev,
      totalPago: totalCobro.toFixed(2),
      cambioCliente: Number(totalCambio.toFixed(2)),
    }));
    console.log({ formPago });
  }, [formPago.anticipos, formPago.efectivo, formPago.tc]);

  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (flag === true) {
      const importeFinal = Number(dataTemporal.Precio) - Number(dataTemporal.Precio) * Number(dataTemporal.Descuento);
      if (dataTemporal.Descuento > 0) {
        setDataTemporal((prev) => ({ ...prev, Precio_base: importeFinal }));
      } else {
        setDataTemporal((prev) => ({ ...prev, Precio_base: dataTemporal.Precio }));
      }
    } else {
      console.log("a");
    }
    console.log({ dataTemporal });
  }, [dataTemporal?.Descuento]);

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

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
    }
  }, []);

  const insertar = async () => {
    const permiso = await filtroSeguridad("CREAR_VENTA");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    const today2 = new Date();
    const today = new Date();
    let horaDateTime = "";
    if (typeof dataTemporal.hora === "string") {
      const partesHora = dataTemporal.hora.split(":");
      const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
      const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
      let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut

      const horaTempora = horaInt;
      today.setHours(Math.floor(horaTempora));
      today.setMinutes((horaTempora % 1) * 60);
      today.setSeconds(0);
      today.setMilliseconds(0);
      horaDateTime = today.toISOString();
    } else {
      const horaTemp = "8:00";
      const partesHora = horaTemp.split(":");
      const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
      const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
      let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut

      const horaTempora = horaInt;
      today.setHours(Math.floor(horaTempora));
      today.setMinutes((horaTempora % 1) * 60);
      today.setSeconds(0);
      today.setMilliseconds(0);
      horaDateTime = today.toISOString();
    }
    if (dataTemporal.Cant_producto > 0) {
      try {
        await jezaApi
          .post("/Venta", null, {
            params: {
              id: 0,
              Cia: dataUsuarios2[0]?.idCia,
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
              Descuento: dataTemporal.Descuento ? dataTemporal.Descuento : 0,
              Clave_Descuento: dataTemporal.Clave_Descuento ? dataTemporal.Clave_Descuento : 0,
              usuario: dataTemporal.idEstilista,
              Corte: 1,
              Corte_parcial: 1,
              Costo: 1,
              Precio: dataTemporal.Precio,
              Precio_base: dataTemporal.Precio,
              No_venta_original: 0,
              cancelada: false,
              folio_estilista: 0,
              // hora: horaDateTime,
              hora: format(dataTemporal.hora, "HH:mm"),
              tiempo: dataTemporal.tiempo == 0 ? 0 : dataTemporal.tiempo,
              // tiempo: dataTemporal.tiempo == 0 ? 30 : dataTemporal.tiempo,
              terminado: false,
              validadoServicio: false,
              ieps: "0",
              Credito: false,
              idEstilista: dataTemporal.idEstilista,
              idestilistaAux: dataTemporal.idestilistaAux ? dataTemporal.idestilistaAux : 0,
              idRecepcionista: dataUsuarios2[0]?.id,
            },
          })
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Venta registrada con éxito",
              confirmButtonColor: "#3085d6",
            });
            fetchVentas();
            setDataTemporal((prevData) => ({
              ...datosInicialesArreglo[0],
              Cant_producto: 1,
              cliente: prevData.cliente,
              Cve_cliente: prevData.Cve_cliente,
            }));
            setDescuento({ min: 0, max: 0 });
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Advertencia",
        text: `El campo de cantidad a vender solo acepta numeros, favor de verificar`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    }
  };

  const deleteVenta = async (dato: Venta): Promise<void> => {
    const permiso = await filtroSeguridad("ELIMINAR_VENTA");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Está seguro que desea eliminar el registro: ${dato.d_producto}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      // Convierte esta función en una función asíncrona también.
      if (result.isConfirmed) {
        try {
          await jezaApi
            .delete(`/Venta?id=${dato.id}`)
            .then((response) => console.log(response))
            .then(() => {
              Swal.fire({
                icon: "success",
                text: "Registro eliminado con éxito",
                confirmButtonColor: "#3085d6",
              });
              fetchVentas();
            });
        } catch (error) { }
      }
    });
  };

  const deleteInsumo = async (dato: VentaInsumo): Promise<void> => {
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
        try {
          jezaApi.delete(`/VentaInsumo?id=${dato.id}`).then(() => fetchInsumosProductoResumen());
        } catch (error) {
          console.log(error);
        }
      }
    });
  };


  const InsumoSolicitadoFinaliza = async (dato: VentaInsumo): Promise<void> => {
    Swal.fire({
      title: "ADVERTENCIA",
      text: `¿Desea enlazar el insumo solicitado: ${dato.d_insumo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, enlazar",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          jezaApi.put(`/VentaInsumoSolicitudFin?id=${dato.id}`).then(() => {
            fetchInsumosProductoSolicitud(); // Actualizar la tabla del modal de insumos solicitados
            fetchInsumosProducto();          // Actualizar la tabla de la ventana principal de insumos
            fetchInsumosProductoResumen();   // Actualizar resumen si es necesario
            setAlertShown(false);
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editInsumo = () => {
    // Verificar si los campos están vacíos
    if (!formInsumo.id || !formInsumo.cantidad || formInsumo.cantidad <= 0) {
      Swal.fire({
        icon: "error",
        text: "Por favor, complete todos los campos.",
        confirmButtonColor: "#3085d6",
      });
      return; // Salir de la función si faltan campos
    }
    if (formInsumo.cantidad > formInsumo?.existencia) {
      Swal.fire({
        icon: "error",
        title: "Alerta",
        text: `No hay suficientes insumos en sucursal`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
      return;
    } else {
      // Si los campos no están vacíos, realizar la solicitud PUT a la API
      jezaApi
        .put("/VentaInsumo", null, {
          params: {
            id: Number(formInsumo.id),
            cantidad: Number(formInsumo.cantidad),
          },
        })
        .then((response) => {
          fetchInsumosProductoResumen();
          Swal.fire({
            icon: "success",
            text: "Insumo actualizada con éxito",
            confirmButtonColor: "#3085d6",
          });
          setTimeout(() => {
            setModalEditInsumo(false);
            fetchInsumosProducto();
          }, 1000);
        });
    }
  };

  const { dataVentas, fetchVentas } = useVentasV2({
    idCliente: dataTemporal?.Cve_cliente,
    sucursal: dataUsuarios2[0]?.sucursal,
  });

  const [fechaHoy, setFechaHoy] = useState("");
  const [fechaHoyMedioPago, setFechaHoyMedioPago] = useState("");

  useEffect(() => {
    const obtenerFechaHoy = () => {
      const fecha = new Date();
      const opcionesFecha = { year: "numeric", month: "numeric", day: "numeric" };
      const fechaFormateada = fecha.toLocaleDateString(undefined, opcionesFecha);
      setFechaHoy(fechaFormateada);

      // Usar fechaFormateada en lugar de fechaHoy
      const [dia, mes, anio] = fechaFormateada.split("/");

      // Resto del formateo
      const mesFormateado = mes.length === 1 ? `0${mes}` : mes;
      const diaFormateado = dia.length === 1 ? `0${dia}` : dia;
      const fechaFormateada2 = `${anio}-${mesFormateado}-${diaFormateado}`;
      setFechaHoyMedioPago(fechaFormateada2);
    };

    obtenerFechaHoy();
  }, []);

  useEffect(() => {
    let totalPorProductoNormal = 0;
    if (!validacion) {
      setDataVentasOld(dataVentas);
    } else {
      setDataVentasValidacion(dataVentas);
    }
    dataVentas.forEach((producto) => {
      totalPorProductoNormal += producto.Precio * producto.Cant_producto - producto.Precio * producto.Cant_producto * producto.Descuento;
    });

    setTotal(Number(totalPorProductoNormal.toFixed(2)));
    setTiempo(dataVentas.reduce((total, objeto) => total + (objeto.tiempo ?? 0), 0));
  }, [dataVentas]);

  useEffect(() => {
    let totalPorProductoOld = 0;
    let totalPorProductoValidacion = 0;
    if (dataVentasOld) {
      dataVentasOld.forEach((producto) => {
        totalPorProductoOld += producto.Precio * producto.Cant_producto - producto.Precio * producto.Cant_producto * producto.Descuento;
      });
    }
    if (dataVentasValidacion) {
      dataVentasValidacion.forEach((producto) => {
        totalPorProductoValidacion += producto.Precio * producto.Cant_producto - producto.Precio * producto.Cant_producto * producto.Descuento;
      });
    }
    if (totalPorProductoOld !== totalPorProductoValidacion && validacion) {
      Swal.fire({
        icon: "info",
        text: "Los precios o los servicios de la venta han cambiado, favor de verificar",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) setModalOpenPago(false);
      });

      setValidacion(false);

      setDataVentasOld(dataVentas);
      return;
    }
  }, [dataVentasValidacion]);

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
    const sp = `TicketInsumosEstilsta ${dataUsuarios2[0]?.idCia}, ${dataUsuarios2[0]?.sucursal}, ${fechaVieja.replace(
      /-/g,
      ""
    )}, ${fechaVieja.replace(/-/g, "")}, ${dato.User}, ${dato.Cve_cliente}, ${dato.No_venta}`;
    jezaApi
      .post(`sp_T_ImpresionesAdd?sp=${sp}&idUsuario=${dataUsuarios2[0]?.id}&idSucursal=${dataUsuarios2[0]?.sucursal}&observaciones=observaciones`)
      .then(() =>
        Swal.fire({
          icon: "success",
          text: "Sucursal actualizada con éxito",
          confirmButtonColor: "#3085d6",
        })
      );
    // TICKET DEL ESTILISTA
    jezaApi
      .get(
        `/TicketInsumosEstilsta?cia=${dataUsuarios2[0]?.idCia}&sucursal=${dataUsuarios2[0]?.sucursal}&f1=${fechaVieja}&f2=${fechaVieja}&estilista=${dato.User}&cte=${dato.Cve_cliente}&noVenta=${dato.No_venta}`
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
    const ultimaHora = dataVentas && dataVentas.length > 0 ? dataVentas[dataVentas.length - 1].hora : "";
    setHora(ultimaHora);
  }, [dataVentas]);

  const ticketVta = async ({ folio }: any) => {
    const sp = `TicketVta ${folio},1,${dataUsuarios2[0]?.sucursal},${dataUsuarios2[0]?.id},${formPago.totalPago}`;
    await jezaApi
      .post(`sp_T_ImpresionesAdd?sp=${sp}&idUsuario=${dataUsuarios2[0]?.id}&idSucursal=${dataUsuarios2[0]?.sucursal}&observaciones=observaciones`)
      .then(() => {
        // Swal.fire({
        //   icon: "success",
        //   text: "Ticket ejecutada correctamente",
        //   confirmButtonColor: "#3085d6",
        // });
      })
      .catch((e) => console.log(e));
  };
  // FINALIZACIÓN DE VENTAS
  const [tempFolio, setTempFolio] = useState(0);

  // const endVenta1 = async () => {
  //   // Cierro mi venta y mando response a medioPago
  //   const permiso = await filtroSeguridad("CIERE_VENTA_UPD");
  //   if (permiso === false) {
  //     return;
  //   }
  //   jezaApi.put(`/VentaCierre?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1`).then((response) => {
  //     if (response.data.codigo == 0) {
  //       // alert("ESTAMOS MAL");
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: response.data.mensaje1,
  //         confirmButtonColor: "#d33",
  //       });
  //       return;
  //     } else {
  //       medioPago(Number(response.data.mensaje2)).then(() => {
  //         setTempFolio(response.data.mensaje2);
  //         const temp = response.data.mensaje2;
  //         jezaApi
  //           .get(
  //             `/TicketVta?folio=${Number(response.data.mensaje2)}&caja=1&suc=${Number(dataUsuarios2[0]?.sucursal)}&usr=${dataUsuarios2[0]?.id
  //             }&pago=${Number(formPago.totalPago)}`
  //           )
  //           .then((response) => {

  //             const cliente = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
  //             if (cliente[0]?.suspendido) {
  //               // Cliente suspendido, enviar el ticket a un correo definido
  //               const envioCorreoRem = "correo@definido.com";
  //               axios
  //                 .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
  //                   to: envioCorreoRem,
  //                   subject: "Ticket",
  //                   textTicket: response.data,
  //                   text: "...",
  //                 })
  //                 .then(() => {
  //                   Swal.fire({
  //                     icon: "success",
  //                     text: "Correo enviado con éxito",
  //                     confirmButtonColor: "#3085d6",
  //                   });
  //                 })
  //                 .catch((error) => {
  //                   alert(error);
  //                   console.log(error);
  //                 });
  //             } else {
  //               if (dataUsuarios2[0]?.sucursal == 27) {
  //               }
  //               setDatoTicket(response.data);
  //               setTimeout(() => {
  //                 Swal.fire({
  //                   title: "ADVERTENCIA",
  //                   text: `¿Se enviará el ticket por correo?`,
  //                   icon: "warning",
  //                   showCancelButton: true,
  //                   confirmButtonColor: "#3085d6",
  //                   cancelButtonColor: "#d33",
  //                   confirmButtonText: "Verificar correo",
  //                   cancelButtonText: "No deseo recibir correos",
  //                 }).then((result) => {
  //                   if (result.isConfirmed) {
  //                     // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com";
  //                     const envioCorreoRem = "soporte@cbinformatica.net";
  //                     const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
  //                     Swal.fire({
  //                       title: "ADVERTENCIA",
  //                       text: `¿Su correo es ${correo[0].email}?`,
  //                       icon: "warning",
  //                       showCancelButton: true,
  //                       showDenyButton: true,
  //                       denyButtonText: `Asignar correo`,
  //                       denyButtonColor: "green",
  //                       confirmButtonColor: "#3085d6",
  //                       cancelButtonColor: "#d33",
  //                       confirmButtonText: "Sí",
  //                       cancelButtonText: "No, imprimir",
  //                     }).then((result) => {
  //                       if (result.isConfirmed) {
  //                         //const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
  //                         const envioCorreoRem = "soporte@cbinformatica.net";
  //                         const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
  //                         axios
  //                           .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
  //                             // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
  //                             to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
  //                             subject: "Ticket",
  //                             textTicket: response.data,
  //                             text: "...",
  //                           })
  //                           .then(() => {
  //                             Swal.fire({
  //                               icon: "success",
  //                               text: "Correo enviado con éxito",
  //                               confirmButtonColor: "#3085d6",
  //                             });
  //                           })
  //                           .catch((error) => {
  //                             alert(error);
  //                             console.log(error);
  //                           });
  //                       } else if (result.isDenied) {
  //                         Swal.fire({
  //                           title: "Ingrese el correo",
  //                           input: "email",
  //                           inputAttributes: {
  //                             autocapitalize: "off",
  //                           },
  //                           showCancelButton: true,
  //                           confirmButtonText: "Listo",
  //                           showLoaderOnConfirm: true,
  //                           preConfirm: (correo) => {
  //                             const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
  //                             if (!regexCorreo.test(correo)) {
  //                               Swal.showValidationMessage("Por favor, ingrese un correo electrónico válido");
  //                             }
  //                           }
  //                         }).then((result) => {
  //                           if (result.isConfirmed) {
  //                             // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com";
  //                             // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
  //                             const envioCorreoRem = "soporte@cbinformatica.net";
  //                             axios
  //                               .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
  //                                 // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
  //                                 to: envioCorreoRem + `,${result.value}`,
  //                                 subject: "Ticket",
  //                                 textTicket: response.data,
  //                                 text: "...",
  //                               })
  //                               .then(() => {
  //                                 Swal.fire({
  //                                   icon: "success",
  //                                   text: "Correo enviado con éxito",
  //                                   confirmButtonColor: "#3085d6",
  //                                 });
  //                               })
  //                               .catch((error) => {
  //                                 alert(error);
  //                                 console.log(error);
  //                               });
  //                           }
  //                         });
  //                       }
  //                     });
  //                   } else {
  //                     const envioCorreoRem = "soporte@cbinformatica.net";
  //                     // const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
  //                     axios
  //                       .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
  //                         // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
  //                         to: envioCorreoRem,
  //                         subject: "Ticket",
  //                         textTicket: response.data,
  //                         text: "...",
  //                       })
  //                       .then(() => {
  //                         Swal.fire({
  //                           icon: "success",
  //                           text: "Correo enviado a TNB",
  //                           confirmButtonColor: "#3085d6",
  //                         });
  //                       }).catch((error) => {
  //                         alert(error);
  //                         console.log(error);
  //                       });
  //                     ticketVta({ folio: temp });
  //                     setModalTicket(true);

  //                 });
  //               });
  //             }, 3000)

  //           .catch(() => console.log("Error"));
  //       });
  //       Swal.fire({
  //         icon: "success",
  //         text: "Venta finalizada con éxito",
  //         confirmButtonColor: "#3085d6",
  //       });
  //       setDataTemporal({
  //         Caja: 1,
  //         cancelada: false,
  //         Cant_producto: 0,
  //         Cia: 0,
  //         Clave_Descuento: 0,
  //         Clave_prod: 0,
  //         Corte: 0,
  //         Corte_parcial: 0,
  //         Costo: 0,
  //         Credito: false,
  //         Cve_cliente: 0,
  //         Descuento: 0,
  //         Fecha: "20230724",
  //         folio_estilista: 0,
  //         hora: 0,
  //         idEstilista: 0,
  //         ieps: 0,
  //         No_venta: 0,
  //         Observacion: "",
  //         Precio: 0,
  //         Precio_base: 0,
  //         Sucursal: 0,
  //         Tasa_iva: 0,
  //         terminado: false,
  //         tiempo: 0,
  //         Usuario: 0,
  //         validadoServicio: false,
  //         cliente: "",
  //         estilista: "",
  //         id: 0,
  //         producto: "",
  //         User: 0,
  //       });
  //       // anticipoPost(Number(response.data.mensaje2));
  //     }
  //   });
  //   fetchInsumosProducto();
  //      };

  //RESPALDO FUNCION VENTAS 
  // const endVenta = async () => {
  //   // Cierro mi venta y mando response a medioPago
  //   const permiso = await filtroSeguridad("CIERE_VENTA_UPD");
  //   if (permiso === false) {
  //     return;
  //   }
  //   jezaApi.put(`/VentaCierre?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1`).then((response) => {
  //     if (response.data.codigo == 0) {
  //       // alert("ESTAMOS MAL");
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: response.data.mensaje1,
  //         confirmButtonColor: "#d33",
  //       });
  //       return;
  //     } else {
  //       medioPago(Number(response.data.mensaje2)).then(() => {
  //         setTempFolio(response.data.mensaje2);
  //         const temp = response.data.mensaje2;
  //         jezaApi
  //           .get(
  //             `/TicketVta?folio=${Number(response.data.mensaje2)}&caja=1&suc=${Number(dataUsuarios2[0]?.sucursal)}&usr=${dataUsuarios2[0]?.id
  //             }&pago=${Number(formPago.totalPago)}`
  //           )
  //           .then((response) => {
  //             if (dataUsuarios2[0]?.sucursal == 27) {
  //             }
  //             setDatoTicket(response.data);
  //             setTimeout(() => {
  //               Swal.fire({
  //                 title: "ADVERTENCIA",
  //                 text: `¿Requiere su ticket por correo?`,
  //                 icon: "warning",
  //                 showCancelButton: true,
  //                 confirmButtonColor: "#3085d6",
  //                 //cancelButtonColor: "#d33",
  //                 confirmButtonText: "Si, verificar correo",
  //                 //cancelButtonText: "No",
  //               }).then((result) => {
  //                 if (result.isConfirmed) {
  //                   const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com";

  //                   Swal.fire({
  //                     title: "ADVERTENCIA",
  //                     text: `¿Su correo es ${correo[0].email}?`,
  //                     icon: "warning",
  //                     showCancelButton: true,
  //                     showDenyButton: true,
  //                     denyButtonText: `Asignar correo`,
  //                     denyButtonColor: "green",
  //                     confirmButtonColor: "#3085d6",
  //                     cancelButtonColor: "#d33",
  //                     confirmButtonText: "Sí",
  //                     cancelButtonText: "No, imprimir",
  //                   }).then((result) => {
  //                     if (result.isConfirmed) {
  //                       const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
  //                       const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
  //                       axios
  //                         .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
  //                           // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
  //                           to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
  //                           subject: "Ticket",
  //                           textTicket: response.data,
  //                           text: "...",
  //                         })
  //                         .then(() => {
  //                           Swal.fire({
  //                             icon: "success",
  //                             text: "Correo enviado con éxito",
  //                             confirmButtonColor: "#3085d6",
  //                           });
  //                         })
  //                         .catch((error) => {
  //                           alert(error);
  //                           console.log(error);
  //                         });
  //                     } else if (result.isDenied) {
  //                       Swal.fire({
  //                         title: "Ingrese el correo",
  //                         input: "text",
  //                         inputAttributes: {
  //                           autocapitalize: "off",
  //                         },
  //                         showCancelButton: true,
  //                         confirmButtonText: "Listo",
  //                         showLoaderOnConfirm: true,
  //                       }).then((result) => {
  //                         if (result.isConfirmed) {
  //                           // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com";
  //                           const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
  //                           axios
  //                             .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
  //                               // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
  //                               to: envioCorreoRem + `,${result.value}`,
  //                               subject: "Ticket",
  //                               textTicket: response.data,
  //                               text: "...",
  //                             })
  //                             .then(() => {
  //                               Swal.fire({
  //                                 icon: "success",
  //                                 text: "Correo enviado con éxito",
  //                                 confirmButtonColor: "#3085d6",
  //                               });
  //                             })
  //                             .catch((error) => {
  //                               alert(error);
  //                               console.log(error);
  //                             });
  //                         }
  //                       });
  //                     }
  //                   });
  //                 } else {
  //                   ticketVta({ folio: temp });
  //                   setModalTicket(true);
  //                 }
  //               });
  //             });
  //           }, 3000)
  //           .catch(() => console.log("Error"));
  //       });
  //       Swal.fire({
  //         icon: "success",
  //         text: "Venta finalizada con éxito",
  //         confirmButtonColor: "#3085d6",
  //       });
  //       setDataTemporal({
  //         Caja: 1,
  //         cancelada: false,
  //         Cant_producto: 0,
  //         Cia: 0,
  //         Clave_Descuento: 0,
  //         Clave_prod: 0,
  //         Corte: 0,
  //         Corte_parcial: 0,
  //         Costo: 0,
  //         Credito: false,
  //         Cve_cliente: 0,
  //         Descuento: 0,
  //         Fecha: "20230724",
  //         folio_estilista: 0,
  //         hora: 0,
  //         idEstilista: 0,
  //         ieps: 0,
  //         No_venta: 0,
  //         Observacion: "",
  //         Precio: 0,
  //         Precio_base: 0,
  //         Sucursal: 0,
  //         Tasa_iva: 0,
  //         terminado: false,
  //         tiempo: 0,
  //         Usuario: 0,
  //         validadoServicio: false,
  //         cliente: "",
  //         estilista: "",
  //         id: 0,
  //         producto: "",
  //         User: 0,
  //       });
  //       // anticipoPost(Number(response.data.mensaje2));
  //     }
  //   });
  //   fetchInsumosProducto();
  // };


  const endVentaori = async () => {
    // Cierro mi venta y mando response a medioPago
    const permiso = await filtroSeguridad("CIERE_VENTA_UPD");
    if (permiso === false) {
      return;
    }
    jezaApi.put(`/VentaCierre?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1`).then((response) => {
      if (response.data.codigo == 0) {
        // alert("ESTAMOS MAL");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.mensaje1,
          confirmButtonColor: "#d33",
        });
        return;
      } else {
        medioPago(Number(response.data.mensaje2)).then(() => {
          setTempFolio(response.data.mensaje2);
          const temp = response.data.mensaje2;
          jezaApi
            .get(
              `/TicketVta?folio=${Number(response.data.mensaje2)}&caja=1&suc=${Number(dataUsuarios2[0]?.sucursal)}&usr=${dataUsuarios2[0]?.id
              }&pago=${Number(formPago.totalPago)}`
            )
            .then((response) => {
              if (dataUsuarios2[0]?.sucursal == 27) {
              }
              setDatoTicket(response.data);
              setTimeout(() => {
                Swal.fire({
                  title: "ADVERTENCIA",
                  text: `¿Requiere su ticket por correo?`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  //cancelButtonColor: "#d33",
                  confirmButtonText: "Si, verificar correo",
                  //cancelButtonText: "No",
                }).then((result) => {
                  if (result.isConfirmed) {
                    const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com";
                    const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
                    Swal.fire({
                      title: "ADVERTENCIA",
                      text: `¿Su correo es ${correo[0].email}?`,
                      icon: "warning",
                      showCancelButton: true,
                      showDenyButton: true,
                      denyButtonText: `Asignar correo`,
                      denyButtonColor: "green",
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Sí",
                      cancelButtonText: "No, imprimir",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
                        const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
                        axios
                          .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
                            // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
                            to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
                            subject: "Ticket",
                            textTicket: response.data,
                            text: "...",
                          })
                          .then(() => {
                            Swal.fire({
                              icon: "success",
                              text: "Correo enviado con éxito",
                              confirmButtonColor: "#3085d6",
                            });
                          })
                          .catch((error) => {
                            alert(error);
                            console.log(error);
                          });
                      } else if (result.isDenied) {
                        Swal.fire({
                          title: "Ingrese el correo",
                          input: "text",
                          inputAttributes: {
                            autocapitalize: "off",
                          },
                          showCancelButton: true,
                          confirmButtonText: "Listo",
                          showLoaderOnConfirm: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com";
                            const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com, holapaola@tnbmx.com";
                            axios
                              .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
                                // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
                                to: envioCorreoRem + `,${result.value}`,
                                subject: "Ticket",
                                textTicket: response.data,
                                text: "...",
                              })
                              .then(() => {
                                Swal.fire({
                                  icon: "success",
                                  text: "Correo enviado con éxito",
                                  confirmButtonColor: "#3085d6",
                                });
                              })
                              .catch((error) => {
                                alert(error);
                                console.log(error);
                              });
                          }
                        });
                      }
                    });
                  } else {
                    ticketVta({ folio: temp });
                    setModalTicket(true);
                  }
                });
              });
            }, 3000)
            .catch(() => console.log("Error"));
        });
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
          User: 0,
        });
        // anticipoPost(Number(response.data.mensaje2));
      }
    });
    fetchInsumosProducto();
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Eliminar espacios en blanco al principio de la cadena
    const trimmedValue = value.replace(/^\s+/g, "");
    setForm((prevState) => ({ ...prevState, [name]: trimmedValue }));
    console.log(form);
  };
  const verificarObservaciones = (observaciones) => {
    return observaciones.some(observacion => observacion.includes("SERV"));
  };

  const verificarInsumosNoEnlazados = async () => {
    for (const venta of dataVentas) {
      const response = await jezaApi.get(`/VentaInsumoSolicitud?id_venta=${venta.id}`);
      const insumosNoEnlazados = response.data.filter((insumo: any) => insumo.enlazado === false);

      // Si hay insumos no enlazados, muestra la alerta
      if (insumosNoEnlazados.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: `Algunos insumos no se encuentran enlazados. Favor de revisar antes de finalizar la venta.`,
          confirmButtonColor: "#FF0000",
          confirmButtonText: "OK",
        });
        // Continuar el proceso sin detener la función
        break; // Salimos del ciclo tras la primera coincidencia
      }
    }
  };

  const endVenta = async () => {
    // alert(`/VentaCierreP?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1&promo=${promocion}`)
    // return;
    // Mostrar alerta si hay insumos no enlazados pero continuar con el proceso


    // Cierro mi venta y mando response a medioPago

    const permiso = await filtroSeguridad("CIERE_VENTA_UPD");
    if (permiso === false) {
      return;
    }
    jezaApi.put(`/VentaCierreP?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1&promo=${promocion}`).then((response) => {
      if (response.data.codigo == 0) {
        // alert("ESTAMOS MAL");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.mensaje1,
          confirmButtonColor: "#d33",
        });
        return;
      } else {
        medioPago(Number(response.data.mensaje2)).then(() => {
          setTempFolio(response.data.mensaje2);
          const temp = response.data.mensaje2;
          jezaApi
            .get(
              `/TicketVta?folio=${Number(response.data.mensaje2)}&caja=1&suc=${Number(dataUsuarios2[0]?.sucursal)}&usr=${dataUsuarios2[0]?.id
              }&pago=${Number(formPago.totalPago)}`
            )
            .then((response) => {
              setDatoTicket(response.data);
              const cliente = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente);
              if (cliente && cliente.recibirCorreo === true) {
                const envioCorreoRem = "soporte@cbinformatica.net, tnbsoportetnb@gmail.com";
                axios
                  .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
                    to: envioCorreoRem,
                    subject: "Ticket",
                    textTicket: response.data,
                    text: "...",
                  })
                  .then(() => {
                    Swal.fire({
                      icon: "success",
                      text: "El cliente no desea recibir correos, el correo fue enviado a TNB",
                      confirmButtonColor: "#3085d6",
                    });
                  })
                  .catch((error) => {
                    alert(error);
                    console.log(error);
                  });
                ticketVta({ folio: temp });
                setModalTicket(true);
                return;
              }
              if (dataUsuarios2[0]?.sucursal == 27) {
              }
              //setDatoTicket(response.data);
              setTimeout(() => {
                Swal.fire({
                  title: "Envío de ticket",
                  text: `¿Se enviará el ticket por correo?`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Verificar correo",
                  cancelButtonText: "No deseo recibir correos",
                  allowOutsideClick: false
                }).then((result) => {
                  if (result.isConfirmed) {
                    // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com";
                    const envioCorreoRem = "soporte@cbinformatica.net, tnbsoportetnb@gmail.com";
                    const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
                    Swal.fire({
                      title: "CONFIRMACIÓN",
                      text: `¿Su correo es ${correo[0].email}?`,
                      icon: "warning",
                      // showCancelButton: true,
                      showDenyButton: true,
                      denyButtonText: `Asignar correo`,
                      denyButtonColor: "green",
                      confirmButtonColor: "#3085d6",
                      confirmButtonText: "Sí",
                      allowOutsideClick: false
                      //cancelButtonText: "No, imprimir",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        //const envioCorreoRem = "desarrollo01@cbinformatica.net, tnbsoportetnb@gmail.com"; ORIGINAL 
                        //const envioCorreoRem = "tnbsoportetnb@gmail.com , rene@cbinformatica.net , holanefi@tnbmx.com, holaatenea@tnbmx.com,  holajann@tnbmx.com ";
                        const envioCorreoRem = "tnbsoportetnb@gmail.com";
                        const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
                        const d_cliente = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
                        const escapeHtml = (unsafe) => {
                          return unsafe
                            .replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/"/g, "&quot;")
                            .replace(/'/g, "&#039;");
                        };

                        if (d_cliente.length > 0) {
                          const nombreCliente = escapeHtml(d_cliente[0].nombre); // Ajusta según la estructura de tu objeto cliente

                          axios.post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
                            //to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
                            to: envioCorreoRem + `,${correo[0].email}`,
                            subject: "Ticket",
                            textTicket: response.data,
                            text: "...",
                          })
                            .then(() => {
                              Swal.fire({
                                icon: "success",
                                text: "Correo enviado con éxito",
                                confirmButtonColor: "#3085d6",
                              });


                              const observaciones = dataVentas.map(venta => venta.Observacion);
                              const tieneServ = observaciones.some(obs => obs.includes("SERV"));

                              if (tieneServ) {
                                // Enviar el segundo correo después de enviar el primero
                                return axios.post("http://cbinfo.no-ip.info:9086/send-custom-email", {
                                  //to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
                                  to: envioCorreoRem + `,${correo[0].email}`,
                                  subject: "GRACIAS POR TU VISITA🖤OBTÉN UN -10%😱PARA TU SIGUIENTE CITA😎🤘",
                                  text: "CORREO 📧",
                                  html: `
                                  <html>
                                   <head>
                                     <meta charset="UTF-8">
                                     <style>
                                       body {
                                         font-family: Arial, sans-serif;
                                         color: #333;
                                       }
                                     </style>
                                   </head>
                                   <body>
                                  <div style="font-family: Arial, sans-serif; color: #333;">
                                    <meta charset="UTF-8">
                                    <p><strong>¡Hola, ${nombreCliente}!</strong></p>
                                    <p>¡Muchas gracias por elegirnos y visitarnos el día de hoy! 🫰🖤</p>
                                    <p>Nunca olvides que eres muy especial para nosotros. Cualquier cosa en la que podamos apoyarte, cuenta con nosotros. 🫂</p>
                                    <p>Tip: Es importante que demos mantenimiento al servicio que te realizamos por lo menos cada mes y medio.</p>
                                    <p>¡Esperamos verte pronto! 😎🤘 WE LOVE U! </p>
                                    <p>🙈 <strong>GANA UN 10% de descuento</strong> para tu siguiente visita respondiendo nuestra encuesta: 
                                      <a href="https://forms.gle/srHf9DbcUKmJMhxq9" target="_blank">https://forms.gle/srHf9DbcUKmJMhxq9</a>
                                    </p>
                                    <p>Presenta el screenshot cuando agendes tu cita para que se aplique. Tienes 30 días para usar tu descuento. No aplica con otras PROMOS.</p>
                                    <p>P.S.: Recuerda que un cabello increíble es trabajo en equipo de salón y casa.</p>
                                    <p>No hay garantías de trabajo si no seguimos recomendaciones adecuadas en casa, tanto de hábitos como de productos profesionales que te sugiramos.</p>
                                    <br>
                                    <img src="https://i.imgur.com/dfwXr3L.png" alt="Imagen de agradecimiento" style="width: 40%; max-width: 250px; height: auto;">
                                    </div>
                                  </body>
                                  </html>
                                `
                                }).then(() => {
                                  Swal.fire({
                                    icon: "success",
                                    text: "Correo de agradecimiento enviado al cliente",
                                    confirmButtonColor: "#3085d6",
                                  });
                                }).catch((error) => {
                                  alert(error);
                                  console.log(error);
                                });
                              }
                            })
                            .catch((error) => {
                              alert(error);
                              console.log(error);
                            });
                        }
                      }
                      // .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
                      //   // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
                      //   to: correo ? envioCorreoRem + `,${correo[0].email}` : envioCorreoRem,
                      //   subject: "Ticket",
                      //   textTicket: response.data,
                      //   text: "...",
                      // })
                      // .then(() => {
                      //   Swal.fire({
                      //     icon: "success",
                      //     text: "Correo enviado con éxito",
                      //     confirmButtonColor: "#3085d6",
                      //   });
                      // })
                      // .catch((error) => {
                      //   alert(error);
                      //   console.log(error);
                      // });

                      else if (result.isDenied) {
                        Swal.fire({
                          title: "Ingrese el correo",
                          input: "email",
                          inputAttributes: {
                            autocapitalize: "off",
                          },
                          //showCancelButton: true,
                          confirmButtonText: "Listo",
                          showLoaderOnConfirm: true,
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          preConfirm: (correo) => {
                            // const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol|tnbmx)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
                            // const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                            const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|info|biz|me|xyz)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]+)?)$/;

                            if (!regexCorreo.test(correo)) {
                              Swal.showValidationMessage("Por favor, ingrese un correo electrónico válido");
                            }
                          }
                        }).then((result) => {
                          if (result.isConfirmed) {
                            // const envioCorreoRem = "desarrollo01@cbinformatica.net, abigailmh9@gmail.com, luis.sg9915@gmail.com";
                            const envioCorreoRem = "desarrollo01@cbinformatica.net, tnbsoportetnb@gmail.com";
                            //const envioCorreoRem = "soporte@cbinformatica.net";
                            const d_cliente = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
                            const escapeHtml = (unsafe) => {
                              return unsafe
                                .replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;")
                                .replace(/"/g, "&quot;")
                                .replace(/'/g, "&#039;");
                            };
                            if (d_cliente.length > 0) {
                              const nombreCliente = escapeHtml(d_cliente[0].nombre); // Ajusta según la estructura de tu objeto cliente
                              axios.post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
                                // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
                                to: envioCorreoRem + `,${result.value} `,
                                subject: "Ticket",
                                textTicket: response.data,
                                text: "...",
                              })
                                .then(() => {
                                  Swal.fire({
                                    icon: "success",
                                    text: "Correo enviado con éxito",
                                    confirmButtonColor: "#3085d6",
                                  });
                                })
                                .catch((error) => {
                                  alert(error);
                                  console.log(error);
                                });

                              const observaciones = dataVentas.map(venta => venta.Observacion);
                              const tieneServ = observaciones.some(obs => obs.includes("SERV"));
                              if (tieneServ) {
                                // Enviar el segundo correo después de enviar el primero
                                return axios.post("http://cbinfo.no-ip.info:9086/send-custom-email", {
                                  to: envioCorreoRem + `,${result.value}`,
                                  subject: "GRACIAS POR TU VISITA🖤OBTÉN UN -10%😱PARA TU SIGUIENTE CITA😎🤘",
                                  text: "CORREO 📧",
                                  html: `
                                    <html>
                                   <head>
                                     <meta charset="UTF-8">
                                     <style>
                                       body {
                                         font-family: Arial, sans-serif;
                                         color: #333;
                                       }
                                     </style>
                                   </head>
                                   <body>
                                  <div style="font-family: Arial, sans-serif; color: #333;">
                                    <meta charset="UTF-8">
                                    <p><strong>¡Hola, ${nombreCliente}!</strong></p>
                                    <p>¡Muchas gracias por elegirnos y visitarnos el día de hoy! 🫰🖤</p>
                                    <p>Nunca olvides que eres muy especial para nosotros. Cualquier cosa en la que podamos apoyarte, cuenta con nosotros. 🫂</p>
                                    <p>Tip: Es importante que demos mantenimiento al servicio que te realizamos por lo menos cada mes y medio.</p>
                                    <p>¡Esperamos verte pronto! 😎🤘 WE LOVE U! </p>
                                    <p>🙈 <strong>GANA UN 10% de descuento</strong> para tu siguiente visita respondiendo nuestra encuesta: 
                                      <a href="https://forms.gle/srHf9DbcUKmJMhxq9" target="_blank">https://forms.gle/srHf9DbcUKmJMhxq9</a>
                                    </p>
                                    <p>Presenta el screenshot cuando agendes tu cita para que se aplique. Tienes 30 días para usar tu descuento. No aplica con otras PROMOS.</p>
                                    <p>P.S.: Recuerda que un cabello increíble es trabajo en equipo de salón y casa.</p>
                                    <p>No hay garantías de trabajo si no seguimos recomendaciones adecuadas en casa, tanto de hábitos como de productos profesionales que te sugiramos.</p>
                                   <br>
                                    <img src="https://i.imgur.com/dfwXr3L.png" alt="Imagen de agradecimiento" style="width: 40%; max-width: 250px; height: auto;">
                                    </div>
                                  </body>
                                  </html>
                                  `
                                }).then(() => {
                                  Swal.fire({
                                    icon: "success",
                                    text: "Correo de agradecimiento enviado al cliente",
                                    confirmButtonColor: "#3085d6",
                                  });
                                }).catch((error) => {
                                  alert(error);
                                  console.log(error);
                                });
                              }
                            }
                          }
                        });
                      }
                    });
                  } else {
                    const envioCorreoRem = "soporte@cbinformatica.net, tnbsoportetnb@gmail.com";
                    // const correo = dataClientes.filter((cliente) => Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente));
                    axios
                      .post("http://cbinfo.no-ip.info:9086/send-emailTicket", {
                        // to: "luis.sg9915@gmail.com, abigailmh09@gmail.com ,holapaola@tnbmx.com, holanefi@tnbmx.com, holaatenea@tnbmx.com, holasusy@tnbmx.com,holajacque@tnbmx.com, holaeli@tnbmx.com, holalezra@tnbmx.com",
                        to: envioCorreoRem,
                        subject: "Ticket",
                        textTicket: response.data,
                        text: "...",
                      })
                      .then(() => {
                        Swal.fire({
                          icon: "success",
                          text: "Correo enviado a TNB",
                          confirmButtonColor: "#3085d6",
                        });
                      })
                      .catch((error) => {
                        alert(error);
                        console.log(error);
                      });

                    ticketVta({ folio: temp });
                    setModalTicket(true);
                  }
                });
              });
            }, 800)
            .catch(() => console.log("Error"));
        });
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
          User: 0,
        });
        // anticipoPost(Number(response.data.mensaje2));
      }
    });
    fetchInsumosProducto();
  };



  const { dataAnticipos } = useAnticipoVentas({
    cliente: Number(dataTemporal?.Cve_cliente),
    suc: "%",
  });
  const [anticipoId, setAnticipoId] = useState(0);
  const [anticipoIdentificador, setAnticipoIdentificador] = useState(0);
  const anticipoSelectedFunction = (params) => {
    setFormAnticipo({
      ...formAnticipo,
      id: params.row.id,
      referencia: params.row.referencia,
      observaciones: params.row.observaciones,
      importe: params.row.importe,
    });
    setDataArregloTemporal({
      ...dataArregloTemporal,
      importe: params.row.importe * -1,
      // referencia: params.row.referencia ? params.row.referencia.toString() : ".",
      referencia: params.row.id,
    });
    setAnticipoId(Number(params.row.id));
    setAnticipoIdentificador(Number(params.row.id));
    setModalAnticipo(false);
    setModalTiendaVirtual(false);
  };

  const [selectedItemIndex, setSelectedItemIndex] = useState(-1); // Inicialmente, no hay ningún índice seleccionado

  // Función para eliminar un elemento del arreglo según su índice
  const eliminarElemento = (tipopago: number, index: number, importe: number) => {
    // Verificamos que el índice sea válido (dentro del rango del arreglo)
    if (index >= 0 && index < arregloTemporal.length) {
      const newArray = [...arregloTemporal];
      newArray.splice(index, 1); // Eliminamos un elemento a partir del índice seleccionado
      setArregloTemporal(newArray);

      // Restar el importe eliminado de formPago
      if (tipopago === 2) {
        setFormPago({ ...formPago, efectivo: formPago.efectivo - importe });
      } else if (tipopago === 1) {
        setFormPago({ ...formPago, anticipos: formPago.anticipos - importe });
      } else {
        setFormPago({ ...formPago, tc: formPago.tc - importe });
      }

      setSelectedItemIndex(-1); // Reseteamos el índice seleccionado para que no haya elemento seleccionado
    }
  };

  function DataTable() {
    return (
      <div className="table-responsive" style={{ height: "59%", overflow: "auto" }}>
        <div style={{ height: "100%", display: "table", tableLayout: "fixed", width: "100%" }}>
          <TableAnticipos anticipoSelectedFunction={anticipoSelectedFunction} dataAnticipos={dataAnticipos}></TableAnticipos>
        </div>
      </div>
    );
  }
  function DataTableTiendaVirtual() {
    return (
      <div className="table-responsive" style={{ height: "59%", overflow: "auto" }}>
        <div style={{ height: "100%", display: "table", tableLayout: "fixed", width: "100%" }}>
          <TableTiendaVirtual anticipoSelectedFunction={anticipoSelectedFunction} dataAnticipos={dataAnticipos}></TableTiendaVirtual>
        </div>
      </div>
    );
  }

  const medioPago = async (noVenta: number) => {
    arregloTemporal.forEach(async (elemento) => {
      const tempIdPago = getIdPago(Number(elemento.formaPago));
      await jezaApi.post("/MedioPago", null, {
        params: {
          caja: 1,
          no_venta: noVenta,
          corte: 0,
          corte_parcial: 0,
          fecha: new Date(),
          sucursal: dataUsuarios2[0]?.sucursal,
          tipo_pago: tempIdPago,
          // referencia:
          // Number(elemento.formaPago) === 94 || Number(elemento.formaPago) === 245
          //   ? anticipoIdentificador
          //   : elemento.referencia
          //   ? elemento.referencia
          //   : "Efectivo",
          referencia: elemento.referencia ? elemento.referencia : "Efectivo",
          importe: elemento.formaPago == 1 ? elemento.importe - formPago.cambioCliente : elemento.importe,
          usuario: dataUsuarios2[0]?.id,
        },
      });
    });
  };
  const getFormaPago = (idTableCia: number) => {
    const cia = dataFormasPagos.find((cia: FormaPago) => cia.tipo === idTableCia);
    return cia ? cia.descripcion : "Sin forma de pago";
  };
  const getIdPago = (idTipoPago: number) => {
    const cia = dataFormasPagos.find((cia: FormaPago) => cia.tipo === idTipoPago && cia.sucursal === dataUsuarios2[0]?.sucursal);
    return cia ? cia.id : 1;
  };

  const editVenta = async () => {
    const permiso = await filtroSeguridad("EDITAR_VENTA");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    const today2 = new Date();
    const formattedDate = format(today2, "yyyy-MM-dd");
    const horaTemporal = dataVentaEdit.hora;
    let horaDateTime; // Declare here

    if (typeof horaTemporal === "number") {
      // Si horaTemporal es un número decimal (float)
      // Realiza el proceso de conversión y formateo aquí
      const today = new Date();
      today.setHours(Math.floor(horaTemporal));
      today.setMinutes((horaTemporal % 1) * 60);
      today.setSeconds(0);
      today.setMilliseconds(0);
      horaDateTime = today.toISOString();

      console.log(horaDateTime);
    } else {
      // Si horaTemporal es un objeto Date
      // Realiza el proceso que necesites para manejar un objeto Date aquí
      horaDateTime = dataVentaEdit.hora;
    }
    const horaFormateada = format(new Date(dataVentaEdit.hora), "yyyy-MM-dd HH:mm");

    jezaApi
      .put(
        `/Venta?id=${dataVentaEdit.id}&Cia=${dataUsuarios2[0]?.idCia}&Sucursal=${dataUsuarios2[0]?.sucursal
        }&Fecha=${formattedDate}&Caja=1&No_venta=0&no_venta2=0&Clave_prod=${dataVentaEdit.Clave_prod}&Cant_producto=${dataVentaEdit.Cant_producto
        }&Precio=${dataVentaEdit.Precio}&Cve_cliente=${dataVentaEdit.Cve_cliente}&Tasa_iva=0.16&Observacion=${dataVentaEdit.Observacion}&Descuento=${dataVentaEdit.Descuento
        }&Clave_Descuento=${dataVentaEdit.Clave_Descuento}&usuario=${dataVentaEdit.idEstilista}&Corte=1&Corte_parcial=1&Costo=${dataVentaEdit.Costo
        }&Precio_base=${dataVentaEdit.Precio_base}&No_venta_original=0&cancelada=false&folio_estilista=${0}&hora=${horaFormateada}&tiempo=${dataVentaEdit.tiempo === 0 ? 0 : dataVentaEdit.tiempo
        }&terminado=false&validadoServicio=false&idestilistaAux=${dataVentaEdit.idestilistaAux ? dataVentaEdit.idestilistaAux : 0}&idRecepcionista=${dataUsuarios2[0]?.id
        }`
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          text: "Venta actualizada con éxito",
          confirmButtonColor: "#3085d6",
        }).catch((e) => alert(e));
        setModalOpenVentaEdit(false);
        setDataVentaEdit({
          Caja: 0,
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
          Fecha: fechaHoy,
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
          User: 0,
          idestilistaAux: 0,
          idRecepcionista: 0,
        });
      })
      .catch((e) => {
        console.log(e);
      });
    setTimeout(() => {
      fetchVentas();
    }, 1000);
  };

  const [time, setTime] = useState("12:34pm");

  const [datah, setData] = useState<any[]>([]); // Definir el estado datah
  const [modalOpen, setModalOpenH] = useState(false);

  const toggleModalHistorial = () => {
    setModalOpenH(!modalOpen);
  };

  const historial = (dato: any) => {
    jezaApi.get(`/Historial?cliente=${dataTemporal.Cve_cliente}`).then((response) => {
      setData(response.data);
      toggleModalHistorial(); // Abrir o cerrar el modal cuando los datos se hayan cargado
    });
    historialCitaFutura(dataTemporal.Cve_cliente);
  };


  const [dataPromo, setDataPromo] = useState<any[]>([]);
  const [promocion, setPromocion] = useState(0);


  const getPromo = () => {
    jezaApi.get(`/sp_nPromociones02?cve_cliente=${dataTemporal.Cve_cliente}&sucursal=${dataUsuarios2[0]?.sucursal}`).then((response) => {
      // Asumiendo que quieres comprobar si hay algún dato
      if (response.data && Object.keys(response.data).length !== 0) {
        // Aquí puedes añadir más lógica específica, por ejemplo, comprobar propiedades específicas dentro de response.data
        setDataPromo(response.data);
      } else {
        setDataPromo([])
        // Opcional: manejar el caso cuando no hay datos relevantes
        console.log("No hay datos relevantes para mostrar.");
      }
    });
  };

  const muestraPromo = () => {

    // Verificar si dataPromo es un arreglo vacío
    if (Array.isArray(dataPromo) && dataPromo.length === 0) {
      console.log("DATAPROMO ES ARREGLO VACIO")
      return;
    }


    // Se prepara el mensaje con la descripción y el importe del descuento
    const promoMessage = `¡Buenas noticias! La venta califica para un descuento especial. Al pagar con <strong>${dataPromo["0"].descripcion}</strong>, el total de la venta será de solo <strong>$${dataPromo["0"].importeDescuento}</strong>.`;

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Venta con descuento disponible',
      html: promoMessage, // Usar html en lugar de text para interpretar las etiquetas HTML
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, aplicar descuento',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setPromocion(1);
        setTotal(Number(dataPromo["0"].importeDescuento.toFixed(2)));

        swalWithBootstrapButtons.fire({
          title: '¡Descuento aplicado!',
          text: 'El descuento ha sido aplicado a tu compra.',
          icon: 'success'
        });
        // Aquí podrías incluir lógica adicional para aplicar el descuento
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        setPromocion(0);
        setDataPromo([])
        swalWithBootstrapButtons.fire({
          title: 'Cancelado',
          text: 'El descuento no ha sido aplicado.',
          icon: 'error'
        });
      }
    });


    //setModalOpenPromo(true); // Solo abrir el modal si response.data cumple con tus criterios
  };


  useEffect(() => {
    getPromo();
  }, [dataVentas, modalOpenPago]);



  useEffect(() => {
    // Verificamos si modalOpenPago es false
    if (!modalOpenPago) {
      // Aquí puedes ejecutar la lógica que deseas realizar cuando modalOpenPago sea false
      /* alert("modalOpenPago es false. Realizando alguna acción..."); */
      // Por ejemplo, puedes llamar a una función, hacer una petición, etc.
      setPromocion(0)
    }
  }, [modalOpenPago]);

  const [datah1, setData1] = useState<any[]>([]); // Definir el estado datah

  const toggleModalHistorialFutura = () => {
    setModalOpenH(!modalOpen);
  };

  const { dataProductos4 } = useProductosFiltradoExistenciaProductoAlm({
    descripcion: "%",
    insumo: 2,
    inventariable: 2,
    obsoleto: 2,
    servicio: 2,
    sucursal: dataUsuarios2[0]?.sucursal,
    almacen: ALMACEN.VENTAS,
    cia: dataUsuarios2[0]?.idCia,
    idCliente: dataTemporal.Cve_cliente,
  });
  const [descInsumos, setDescInsumos] = useState("%");
  const { datoInsumosProducto, fetchInsumosProducto } = useInsumosProductos({
    descripcion: descInsumos,
    insumo: 1,
    inventariable: 1,
    obsoleto: 0,
    servicio: 0,
    sucursal: dataUsuarios2[0]?.sucursal,
    almacen: 2,
    cia: dataUsuarios2[0]?.idCia,
    idCliente: 26307,
  });
  const getExistenciaForeignKey = (idProducto: number) => {
    if (idProducto > 1) {
      const cia = dataProductos4.find((item: any) => item.id === idProducto);

      if (cia && cia.existencia > 0 && cia.existencia !== dataVentaEdit.existenciaEdit) {
        setDataVentaEdit({ ...dataVentaEdit, existenciaEdit: cia.existencia });
      } else if (cia && cia.existencia === 0 && cia.existencia !== dataVentaEdit.existenciaEdit) {
        setDataVentaEdit({ ...dataVentaEdit, existenciaEdit: cia.existencia });
      }
      return cia ? cia.existencia : 10000;
    }
  };
  const historialCitaFutura = (dato: any) => {
    jezaApi.get(`/sp_detalleCitasFuturasSel?Cliente=${dataTemporal.Cve_cliente}`).then((response) => {
      const dataConFechasFormateadas = response.data.map((item: any) => ({
        ...item,
        fechaCita: new Date(item.fechaCita).toLocaleDateString(),
        fechaAlta: new Date(item.fechaAlta).toLocaleDateString(),
      }));
      setData1(dataConFechasFormateadas);
      toggleModalHistorialFutura(); // Abrir o cerrar el modal cuando los datos se hayan cargado
    });
  };

  const [historialDetalle, setHistorialDetalle] = useState<any[]>([]); // Definir historialDetalle como una variable local, no un estado del componente

  const [paramsDetalles, setParamsDetalles] = useState({
    sucursal: 0,
    numVenta: 0,
    idProducto: 0,
    clave: 0,
    Cve_cliente: 0,
    fecha: "",
  });

  const [totalImportes, setTotalImportes] = useState(0);

  // Cuando cambia historialDetalle, recalcula el total de importes
  useEffect(() => {
    const total = historialDetalle.reduce((accumulator, item) => {
      const importe = parseFloat(item.importe);
      return accumulator + importe;
    }, 0);
    setTotalImportes(total);
  }, [historialDetalle]);

  const loadHistorialDetalle = async (cveCliente: number, noVenta: number, idProducto: number, idSucursal: number) => {
    await jezaApi
      .get(`/HistorialDetalle?suc=${idSucursal}&cliente=${cveCliente}&venta=${noVenta}&serv=${idProducto}`)
      .then((response) => {
        // Verifica los datos de respuesta en la consola para asegurarte que sean correctos
        console.log(response.data);
        // Asigna los datos de respuesta a la variable local historialDetalle
        handleOpenModal();
        setHistorialDetalle(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setIsModalOpen(!isModalOpen);
    // loadHistorialDetalle(  )
  };
  // useEffect(() => {

  // }, [])

  const [flagEstilistas, setFlagEstilistas] = useState(false);
  useEffect(() => {
    const formasPagosFiltradas = dataFormasPagos.filter((formaPago) => formaPago.sucursal === dataUsuarios2[0]?.sucursal);
    const clienteSuc33 = dataClientes.filter(
      (cliente) => Number(cliente.sucursal_origen) === 33 && Number(cliente.id_cliente) === Number(dataTemporal.Cve_cliente)
    );
    if (clienteSuc33.length > 0) {
      setFormasPagosFiltradas(formasPagosFiltradas);
    } else {
      const formaPagoNomina = dataFormasPagos.filter((nomina) => nomina.tipo != 110 && nomina.sucursal == dataUsuarios2[0]?.sucursal);
      setFormasPagosFiltradas(formaPagoNomina);
    }
  }, [dataFormasPagos, dataTemporal.Cve_cliente]);

  const cantidadInsumo = (dato: any) => {
    const cantidadInsumoBusqueda = datoInsumosProducto.find((insumo) => Number(dato) == Number(insumo.id));
    return cantidadInsumoBusqueda?.existencia ? cantidadInsumoBusqueda?.existencia : 0;
  };

  function openTicketPreview() {
    const newWindow = window.open("", "_blank");

    let content = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Courier New', monospace;
            white-space: pre;
            font-size: 10 px;
          }
          strong {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
  `;

    if (datoTicket) {
      datoTicket.forEach((ticket) => {
        content += `<strong>${ticket.LINEA}\n</strong>`;
      });
    }

    content += `
      </body>
       <script>
        window.onload = () => {
          window.print();
        };
      </script>
    </html>
  `;

    newWindow.document.write(content);
    newWindow.document.close();
  }

  function openTicketEstilistaPreview() {
    const newWindow = window.open("", "_blank");

    let content = `
    <html>
      <head>
        <style>
           body {
            font-family: 'Courier New', monospace;
            white-space: pre;
            font-size: 12 px;
          }
          strong {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
  `;

    if (datoTicketEstilista) {
      datoTicketEstilista.forEach((ticket) => {
        content += `<strong>${ticket.LINEA}\n</strong>`;
      });
    }

    content += `
      </body>
       <script>
        window.onload = () => {
          window.print();
        };
      </script>
    </html>
  `;

    newWindow.document.write(content);
    newWindow.document.close();
  }

  const [camposFaltantes1, setCamposFaltantes1] = useState<string[]>([]);
  const validarCampos1 = () => {

    if (!correoCliente) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: `El campo correo es requerido`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
      return false
    } else {
      return true
    }
  };
  const cerrarModalActualizar2 = () => {
    setModalActualizar2(false);
  };

  const editar = async () => {
    const permiso = await filtroSeguridad("CAT_CLIENT_UPD");
    if (!permiso) {
      return;
    }
    console.log(validarCampos1());
    console.log({ form });

    if (validarCampos1()) {
      //const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
      //const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|info|biz|me|xyz)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]+)?)$/;
      if (!regexCorreo.test(correoCliente)) {
        Swal.fire({
          icon: "error",
          text: "Por favor, ingrese un correo electrónico válido",
        });
        return;
      }
      try {
        await jezaApi.put(`/ClienteUpdCorreo?`, null, {
          params: {
            id_cliente: dataTemporal.Cve_cliente,
            email: correoCliente,
          },
        });

        Swal.fire({
          icon: "success",
          text: "Cliente actualizado con éxito",
          confirmButtonColor: "#3085d6",
        });
        cerrarModalActualizar2();
        fetchClientes();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>

      <Container>
        <br />
        <h1>
          Venta <FaCashRegister size={35} />
        </h1>
        <br />
        <Row>
          <Col md={"8"}>
            <Row className="align-items-end">
              <Col md={"7"}>
                <InputGroup>
                  <Input disabled value={dataTemporal.cliente} onChange={cambios} name={"cliente"} />
                  <Button onClick={() => setModalCliente(true)}>
                    <MdEmojiPeople size={23} />
                    Elegir
                  </Button>
                  <Button disabled={!dataTemporal.cliente} color="primary" size="sm" onClick={() => historial(dataTemporal.id)}>
                    Historial
                    <MdPendingActions size={23} />
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <br />
        <div className=" d-flex justify-content-end px-5">
          <Button
            color="secondary"
            onClick={() => {
              if (dataTemporal.cliente) {
                if (dataVentas.length > 0) {
                  // setDataTemporal;
                }
                setModalOpen(true);
              } else {
                Swal.fire({
                  icon: "warning",
                  text: "Favor de ingresar un cliente",
                  confirmButtonColor: "#3085d6",
                });
              }
            }}
          >
            <MdDataSaverOn size={30} />
            Agregar venta o servicio
          </Button>
        </div>
        <div style={{ flex: 1 }}></div>
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
                    <td>{dato.nombreEstilistaAux ? dato.nombreEstilistaAux : "Sin estilista auxilliar"}</td>
                    <td>{dato.d_producto}</td>
                    <td align="center">{dato.Cant_producto}</td>
                    <td>
                      {dato.Precio.toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN", // Código de moneda para el Peso Mexicano
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      {(dato.Precio * dato.Cant_producto).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN", // Código de moneda para el Peso Mexicano
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    {/* IMPORTE */}
                    <td>
                      {(dato.Cant_producto * dato.Descuento * dato.Precio).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN", // Código de moneda para el Peso Mexicano

                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      {dato.Descuento === 0
                        ? (dato.Precio * dato.Cant_producto).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN", // Código de moneda para el Peso Mexicano
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                        : (dato.Precio * dato.Cant_producto - dato.Precio * dato.Cant_producto * dato.Descuento).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN", // Código de moneda para el Peso Mexicano

                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </td>
                    <td className="gap-5">
                      <AiFillDelete
                        color="lightred"
                        onClick={() => {
                          deleteVenta(dato);
                        }}
                        size={23}
                      />
                      <AiFillEdit
                        color="lightred"
                        onClick={() => {
                          setDataVentaEdit({
                            ...dataVentaEdit,
                            id: dato.id,
                            d_producto: dato.d_producto,
                            producto: dato.d_producto,
                            Clave_prod: dato.Clave_prod,
                            d_estilista: dato.d_estilista,
                            Cant_producto: dato.Cant_producto,
                            Descuento: dato.Descuento,
                            hora: dato.hora,
                            Cve_cliente: dato.Cve_cliente,
                            Precio: dato.Precio,
                            Precio_base: dato.Precio_base,
                            idEstilista: dato.User,
                            Observacion: dato.Observacion,
                            Clave_Descuento: dato.Clave_Descuento,
                            idestilistaAux: dato.idEstilistaAux,
                            d_estilistaAuxilliar: dato.nombreEstilistaAux,
                            tiempo: dato.tiempo,
                          });
                          const descuentito = dataDescuentos.find((objeto) => objeto.id === Number(dato.Clave_Descuento));

                          setDescuento({
                            min: descuentito?.min_descto ? Number(descuentito?.min_descto) : 0,
                            max: descuentito?.max_descto ? Number(descuentito?.max_descto) : 0,
                          });
                          console.log(dato);
                          console.log(dataVentaEdit);
                          setModalOpenVentaEdit(true);
                        }}
                        size={23}
                      />
                      {/* {dato.Observacion === "SERV" ? ( */}
                      {dato.Observacion === "SERV" && ![1074].includes(dataUsuarios2[0]?.sucursal) ? (
                        <GrStakeholder
                          className="mr-2"
                          size={20}
                          onClick={() => {
                            setSelectedID(dato.id ? dato.id : null);
                            setDatoVentaSeleccionado(dato);
                            fetchInsumosProducto();
                            fetchInsumosProductoSolicitud();
                            setModalOpenInsumos1(true);
                          }}
                        ></GrStakeholder>
                      ) : null}

                      {/* {dato.Observacion === "SERV" ? ( */}
                      {dato.Observacion === "SERV" && ![27, 21, 26, 33].includes(dataUsuarios2[0]?.sucursal) ? (
                        <GoPersonAdd
                          size={20}
                          className="mr-2"
                          onClick={() => {
                            setSelectedID(dato.id ? dato.id : null);
                            setDatoVentaSeleccionado(dato);

                            // Llamar a las funciones de fetch para actualizar los datos
                            fetchInsumosProducto();
                            fetchInsumosProductoSolicitud();

                            // Restablecer `alertShown` para asegurarse de que la alerta se muestre en futuras interacciones
                            setAlertShown(false);

                            // Verifica si hay insumos con enlazado = false
                            const insumosNoEnlazados = datoInsumosProductoSolicitud.filter(
                              (insumo: any) => insumo.enlazado === false
                            );

                            if (insumosNoEnlazados.length > 0 && !alertShown) {
                              const listaInsumos = insumosNoEnlazados.map((insumo: any) => insumo.d_insumo).join(", ");

                              Swal.fire({
                                icon: "warning",
                                title: "Advertencia",
                                text: `Los siguientes servicios tienen insumos no enlazados: ${listaInsumos}`,
                                confirmButtonColor: "#3085d6",
                                showCancelButton: true,
                                confirmButtonText: "Ir a enlazar",
                                cancelButtonText: "Cancelar",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  // Abre el modal al hacer clic en "Ir a enlazar"
                                  setModalOpenInsumosSolicitud(true);
                                }
                                setAlertShown(true); // Marca la alerta como mostrada
                              });
                            } else {
                              // Si no hay insumos no enlazados, abre el modal directamente
                              setModalOpenInsumos(true);
                            }
                          }}
                        ></GoPersonAdd>
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
            <div className="d-flex  justify-content-start ">
              <InputGroup size="sm">
                <Button
                  // style={{ marginRight: 25 }}
                  disabled={dataVentas.length > 0 ? false : true}
                  color="success"
                  onClick={() => {
                    muestraPromo();
                    verificarInsumosNoEnlazados();
                    setModalOpenPago(true);

                    setFormPago({ ...formPago, anticipos: 0, efectivo: 0, tc: 0, cambioCliente: 0 });
                    fetchVentas();
                    setValidacion(true);
                  }}
                >
                  <MdAttachMoney size={35} />
                  Pago
                </Button>

                <Button
                  // style={{ marginRight: 25 }}
                  color="success"
                  disabled={estilistaProceso.length > 0 ? false : true}
                  onClick={() => {
                    setModalEstilistaSelector(true);
                  }}
                >
                  Estilistas ticket
                  <MdOutlineReceiptLong size={30} />
                </Button>
                <Button
                  // style={{ marginRight: 25 }}
                  color="secondary"
                  onClick={() => {
                    setModalClientesProceso(true);
                    fetchVentasProcesos();
                  }}
                >
                  Clientes en proceso
                  <MdAccessTime size={30} />
                </Button>
              </InputGroup>
            </div>
          </Col>
          <Col md={"2"} className="mt-4">
            <strong>
              <h4>Total: ${total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
            </strong>
            <strong>
              <p>Tiempo estimado: {tiempo + " min"} </p>
            </strong>
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
          <Label>Producto/Servicio:</Label>
          <Row>
            <Col md={12}>
              <InputGroup>
                <Input disabled defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} />

                <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
              </InputGroup>
            </Col>
          </Row>
          <br />
          <Label>Encargado:</Label>
          <Row>
            <Col>
              <InputGroup>
                <Input disabled defaultValue={dataTemporal.estilista ? dataTemporal.estilista : ""} />

                <Button
                  onClick={() => {
                    setFlagEstilistas(false);
                    setModalOpen2(true);
                  }}
                >
                  Elegir
                </Button>
              </InputGroup>
            </Col>
          </Row>
          <br />
          {dataTemporal.Observacion === "SERV" ? (
            <>
              <Label>Estilista auxiliar:</Label>
              <Row>
                <Col xs={10}>
                  <InputGroup>
                    <Input disabled defaultValue={dataTemporal.d_estilistaAuxilliar ? dataTemporal.d_estilistaAuxilliar : ""} />

                    <Button
                      onClick={() => {
                        setModalOpen2(true);
                        setFlagEstilistas(true);
                      }}
                    >
                      Elegir
                    </Button>
                  </InputGroup>
                </Col>
                <Col xs={1}>
                  <Button color="danger" onClick={() => setDataTemporal({ ...dataTemporal, idestilistaAux: 0, d_estilistaAuxilliar: "" })}>
                    <AiFillDelete></AiFillDelete>
                  </Button>
                </Col>

                {/* <Col xs={1}>
                </Col>
                <Col md={1}>
                </Col> */}
              </Row>
            </>
          ) : null}
          {dataTemporal.Observacion !== "SERV" ? null : <br />}
          <Row>
            {dataTemporal.Observacion !== "SERV" ? (
              <Col sm={6} md={6}>
                <Label>Cantidad en existencia: </Label>
                <Input
                  disabled
                  placeholder="Cantidad en existencia"
                  onChange={cambios}
                  name="d_existencia"
                  defaultValue={dataTemporal.d_existencia}
                />
              </Col>
            ) : (
              <br />
            )}
            <Col sm={6} md={6}>
              <Label>Precio:</Label>
              <Input
                disabled
                placeholder="Precio"
                onChange={cambiosEdit}
                name="Precio"
                value={dataTemporal.Precio ? "$" + dataTemporal.Precio.toFixed(2) : 0}
              />
              <br />
            </Col>
            <Col md={6}>
              <Label>Cantidad a vender:</Label>
              <Input placeholder="Cantidad" onChange={cambios} name="Cant_producto" value={dataTemporal.Cant_producto} type="number" />
              <br />
            </Col>
          </Row>

          <Label>Tipo de descuento:</Label>
          <Input type="select" name="Clave_Descuento" id="exampleSelect" value={dataTemporal.Clave_Descuento} onChange={cambios}>
            <option value={0}>-Selecciona el tipo de descuento-</option>
            {dataDescuentos.map((descuento) => (
              <option value={descuento.id}>{descuento.descripcion}</option>
            ))}
          </Input>

          <br />
          <Label>
            Descuento entre: {descuento.min} - {descuento.max} :{" "}
          </Label>
          <Row>
            <Col md={"12"}>
              <Input name="Descuento" value={dataTemporal.Descuento} onChange={cambios} placeholder="0.0"></Input>
            </Col>
          </Row>
          <br />
          {dataTemporal.Observacion == "SERV" ? (
            <>
              <Label style={{ marginRight: 10 }}>Hora de servicio:</Label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Seleccione la hora"
                  value={new Date(dataTemporal.hora)}
                  onChange={(newValue) => setDataTemporal((prev) => ({ ...prev, hora: newValue }))}
                />
              </LocalizationProvider>
            </>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpen(false);
              setDataTemporal((prevData) => ({
                ...datosInicialesArreglo[0],
                Cant_producto: 1,
                cliente: prevData.cliente,
                Cve_cliente: prevData.Cve_cliente,
              }));
              setDescuento({ min: 0, max: 0 });
            }}
            text="Salir"
          />
          <Button
            color="primary"
            disabled={dataTemporal.producto || dataTemporal.cliente ? false : true}
            onClick={() => {
              if (dataTemporal.Cant_producto == 0) {
                Swal.fire({
                  icon: "info",
                  text: "No ha seleccionado cantidad a vender",
                });
              } else if (!dataTemporal.producto) {
                Swal.fire({
                  icon: "info",
                  text: "No ha seleccionado producto",
                });
              } else if (!dataTemporal.idEstilista || !dataTemporal.estilista) {
                Swal.fire({
                  icon: "info",
                  text: "No ha seleccionado estilista",
                });
              } else if (Number(dataTemporal.d_existencia) < Number(dataTemporal.Cant_producto) && dataTemporal.Observacion !== "SERV") {
                Swal.fire({
                  icon: "info",
                  text: "No hay existencias ",
                });
              } else if (dataTemporal.Descuento > descuento.max || dataTemporal.Descuento < descuento.min) {
                Swal.fire({
                  icon: "info",
                  text: "Favor de verificar los descuentos ",
                });
              } else {
                if (dataTemporal.producto) {
                  setdata([...data, dataTemporal]);
                  insertar();
                }
              }
            }}
          >
            Agregar venta
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen2} size="md">
        <ModalHeader></ModalHeader>
        <ModalBody>
          <TableEstilistas
            dataVentaEdit={dataVentaEdit}
            setDataVentaEdit={setDataVentaEdit}
            data={dataFiltrada}
            setModalOpen2={setModalOpen2}
            dataTemporal={dataTemporal}
            setDataTemporal={setDataTemporal}
            flagEstilistas={flagEstilistas}
            setFlagEstilistas={setFlagEstilistas}
          ></TableEstilistas>
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpen2(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen3} size="xl" toggle={() => setModalOpen3(false)}>
        <ModalHeader></ModalHeader>
        <ModalBody>
          {" "}
          <TableProductos
            productoSelected={productoSelected}
            sucursal={dataUsuarios2 ? dataUsuarios2[0]?.sucursal : 21}
            data={data}
            setModalOpen2={setModalOpen3}
            dataVentaEdit={dataVentaEdit}
            setDataVentaEdit={setDataVentaEdit}
            dataTemporal={dataTemporal}
            setDataTemporal={setDataTemporal}
            cia={dataUsuarios2[0]?.idCia}
          ></TableProductos>
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpen3(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalClientesProceso} size="md">
        <ModalHeader>
          {" "}
          <h3>Clientes en proceso </h3>
        </ModalHeader>
        <ModalBody>
          <TableClientesProceso
            dataTemporal={dataTemporal}
            setDataTemporal={setDataTemporal}
            dataVentasProcesos={dataVentasProcesos}
            data={data}
            setModalOpen2={setModalClientesProceso}
          ></TableClientesProceso>
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalClientesProceso(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalCliente} size="lg">
        <ModalHeader>
          <h3>Selección de clientes</h3>{" "}
        </ModalHeader>
        <ModalBody>
          <TableCliente
            sucursal={dataUsuarios2[0]?.sucursal}
            dataTemporal={dataTemporal}
            setDataTemporal={setDataTemporal}
            data={dataClientes}
            setModalCliente={setModalCliente}
          ></TableCliente>
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
        <TimeKeeper time={time} onChange={(newTime) => setTime(newTime.formatted12)} />
        <span>Time is {time}</span>
      </ModalActualizarLayout>

      <Modal isOpen={modalOpenPago} size="xl">

        <ModalHeader>
          <h3>Cobro</h3>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="7">
              <Label>
                <strong>TOTAL DE ESTA VENTA:</strong>{" "}
              </Label>
            </Col>
            <Col md="5">
              <Input disabled value={"$" + total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}></Input>
            </Col>
          </Row>
          <hr className="my-4" />

          <Row>
            <Col md="4">
              <Label>
                {" "}
                <strong>Seleccionar forma de pago:</strong>
              </Label>
            </Col>
            <Col md="5">
              <Button
                onClick={() => {
                  fetchClientes();
                  setModalTipoVenta(true);
                }}
              >
                {" "}
                Seleccionar <BsCashCoin size={20} />
              </Button>
            </Col>
          </Row>
          <br />
          {arregloTemporal.map((pago, index) => (
            <div>
              <Container>
                <Row className="align-items-center">
                  <Col xs={""}>
                    <Label>Forma de pago:</Label>
                    <Input value={getFormaPago(Number(pago.formaPago))} disabled />
                  </Col>
                  <Col xs={""}>
                    <Label>Importe:</Label>
                    <Input
                      value={
                        "$" +
                        Number(pago.importe).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      }
                      disabled
                    />
                  </Col>
                  {pago.referencia && (
                    <Col xs={"2"}>
                      <Label>Referencia:</Label>
                      <Input value={pago.referencia} disabled />
                    </Col>
                  )}
                  <Col xs={"2"} md={"2"} className="d-flex justify-content-end mt-4">
                    {/* Utilizamos "justify-content-end" para alinear el botón a la derecha */}
                    <Button
                      color="danger"
                      onClick={() => {
                        if (Number(pago.formaPago) === 1) {
                          // efectivo
                          eliminarElemento(2, index, Number(pago.importe));
                        } else if (Number(pago.formaPago) === 94) {
                          // anticipo
                          eliminarElemento(1, index, Number(pago.importe));
                        } else {
                          // credito
                          eliminarElemento(0, index, Number(pago.importe));
                        }
                      }}
                    >
                      <AiFillDelete size={20}></AiFillDelete>
                    </Button>
                  </Col>
                </Row>
              </Container>

              <br />
            </div>
          ))}

          <hr className="my-4" />
          <br />
          <Row>
            <Col md="7">
              <Label>
                <strong>TOTAL DE PAGOS: </strong>
              </Label>
            </Col>
            <Col md="5">
              <Input
                disabled
                name="totalPago"
                value={"$ " + formPago.totalPago.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              ></Input>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="7">
              <Label>
                <strong>CAMBIO AL CLIENTE: </strong>
              </Label>
            </Col>
            <Col md="5">
              {/* <Input name="cambioCliente" value={formPago.cambioCliente > 0 ? formPago.cambioCliente : 0} disabled></Input> */}
              <Input
                name="cambioCliente"
                value={"$ " + formPago.cambioCliente.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                disabled
              ></Input>
            </Col>
          </Row>
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpenPago(false);
              setArregloTemporal([]);
              setFormPago({ anticipos: 0, cambioCliente: 0, efectivo: 0, tc: 0, totalPago: 0 });
              setValidacion(false);
            }}
            text="Salir"
          />

          <CButton
            color="success"
            onClick={() => {
              // const correo = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente)?.email;
              // // Validar el formato del correo electrónico
              // //const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol|tnbmx)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
              // const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              // if (!regexCorreo.test(correo)) {
              //   // Si el formato del correo electrónico no es válido, mostrar una alerta
              //   Swal.fire({
              //     icon: "error",
              //     title: "Error",
              //     text: `El formato del correo electrónico del cliente no es válido`,
              //     confirmButtonColor: "#3085d6",
              //     showCancelButton: true,
              //     cancelButtonText: "Cancelar",
              //     cancelButtonColor: "#d33",
              //     confirmButtonText: "Cambiar correo",
              //   }).then((result) => {
              //     if (result.isConfirmed) {
              //       // Muestra un modal para que el usuario ingrese un nuevo correo electrónico
              //       //modalActualizar();
              //       setModalActualizar2(true)
              //     }
              //   });
              //   return; // Detener el proceso de cobro
              // }
              // Convertir los valores a números antes de realizar la comparación

              const recibirCorreo = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente)?.recibirCorreo;
              const correo = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente)?.email;
              // Si el cliente tiene la opción de recibirCorreo configurada como false, entonces se valida el formato del correo electrónico

              const cliente = dataClientes.find(cliente => cliente.id_cliente === dataTemporal.Cve_cliente);
              if (recibirCorreo === false || recibirCorreo === null) {
                // Validar el formato del correo electrónico
                //const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                // const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol|tnbmx)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;
                //const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|info|biz|me|xyz)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]+)?)$/;
                if (!regexCorreo.test(correo)) {
                  // Si el formato del correo electrónico no es válido, mostrar una alerta
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `El formato del correo electrónico del cliente no es válido`,
                    confirmButtonColor: "#3085d6",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Cambiar correo",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      setModalActualizar2(true);
                    }
                  });
                  return; // Detener el proceso de cobro
                }
              }
              const cambioCliente = parseFloat(formPago.cambioCliente);
              const efectivo = parseFloat(formPago.efectivo);
              const totalVenta = parseFloat(total); // Asegúrate de que "total" sea un número
              // Validar que el cambio no sea mayor al efectivo
              if (cambioCliente <= efectivo) {
                // Validar que el total de pagos sea mayor o igual al total de venta
                if (arregloTemporal.length == 0) {
                  Swal.fire({
                    title: "ADVERTENCIA",
                    text: `Favor de ingresar al menos un método de pago`,
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                  });
                } else {
                  if (parseFloat(formPago.totalPago) >= totalVenta) {
                    // El total de pagos es mayor o igual al total de venta, continuar con el proceso de cobro
                    // setValidacion(true);
                    // fetchVentas();
                    setValidacion(false);

                    setModalOpenPago(false);
                    setDataTemporal({ Cve_cliente: 0 });
                    setFormPago({ anticipos: 0, cambioCliente: 0, efectivo: 0, tc: 0, totalPago: 0 });
                    setArregloTemporal([]);
                    endVenta();
                  } else {
                    // El total de pagos es menor al total de venta, mostrar un mensaje de error
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: `El total de pagos es menor al total de venta`,
                      confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
                    });
                  }
                }
              } else {
                // El cambio es mayor al efectivo, mostrar un mensaje de error
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: `No se puede ingresar una cantidad de cambio mayor al efectivo que pagó el cliente`,
                  confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
                });
              }
            }}
            text="Cobrar"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalActualizar2} size="lg">
        <ModalHeader>
          <h3>Actualizar correo del cliente</h3>
        </ModalHeader>
        <ModalBody>
          {/* parte */}
          <Row>
            <Col sm="6">
              <CFormGroupInput handleChange={(e) => {
                setCorreoCliente(e.target.value)
              }} inputName="correoCliente" labelName="Correo:" defaultValue={correoCliente ? correoCliente : 'HALA'} minlength={1} maxlength={199} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <CButton color="primary" onClick={editar} text="Actualizar" />
          <CButton color="danger" onClick={cerrarModalActualizar2} text="Cancelar" />
        </ModalFooter>
      </Modal>


      {/* INSUMOS SIN ACTUALIZACION  */}
      <Modal isOpen={modalOpenInsumos1} size="xl">
        <ModalHeader><strong>Insumos del servicio:</strong> {datoVentaSeleccionado.d_producto}</ModalHeader>

        <ModalBody>
          {/* <Row className="justify-content-end"> */}
          <Row>
            <Col md={7}>
              <ButtonGroup>
                <Button
                  onClick={async () => {
                    const permiso = await filtroSeguridad("AGREGA_INSUMO");
                    if (permiso === false) {
                      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
                    } else {
                      setModalOpenInsumosSelect(true);
                      fetchInsumosProductoResumen();
                      fetchInsumosProducto();
                    }
                  }}
                >
                  Agregar insumos +
                </Button>
                {/* <Button color="info"
                  onClick={async () => {
                    const permiso = await filtroSeguridad("AGREGA_INSUMO");
                    if (permiso === false) {
                      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
                    } else {
                      fetchInsumosProductoSolicitud();
                      setModalOpenInsumosSolicitud(true);
                    }
                  }}
                >
                  Enlazar insumos <FcDownload size={23} />
                </Button> */}
              </ButtonGroup>
            </Col>
            <Col md={6}></Col>
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
              {datoInsumosProductoResumen.length > 0
                ? datoInsumosProductoResumen.map((dato: any) => (
                  <tr key={dato.id}>
                    {dato.id ? (
                      <>
                        <td>{dato.d_insumo}</td>
                        <td align="left">{cantidadInsumo(dato.id_insumo)}</td>
                        <td align="left">{dato.unidadMedida}</td>
                        <td align="left">{dato.cantidad}</td>

                        <td className="gap-5">
                          <AiFillEdit
                            className="mr-2"
                            onClick={() => {
                              setModalEditInsumo(true);
                              setFormInsumo({
                                cantidad: dato.cantidad,
                                fechaAlta: dato.fechaAlta,
                                id: dato.id,
                                id_insumo: dato.id_insumo,
                                id_venta: dato.id_venta,
                                unidadMedida: dato.unidadMedida,
                                d_insumo: dato.d_insumo,
                                existencia: cantidadInsumo(dato.id_insumo),
                              });
                            }}
                            size={23}
                          ></AiFillEdit>
                          {/* <AiFillDelete
                            color="lightred"
                            onClick={() => {
                              deleteInsumo(dato);
                              setTimeout(() => {
                                fetchInsumosProducto();
                              }, 1000);
                            }}
                            size={23}
                          /> */}
                          <AiFillDelete
                            color="lightred"
                            onClick={async () => {
                              const permiso = await filtroSeguridad("ELIMINA_INSUMO ");
                              if (permiso === false) {
                                return; // Si el permiso es falso o los campos no son válidos, se sale de la función
                              } else {
                                deleteInsumo(dato);
                                setTimeout(() => {
                                  fetchInsumosProducto();
                                }, 1000);
                              }
                            }}
                            size={23}
                          />
                        </td>
                      </>
                    ) : null}
                  </tr>
                ))
                : null}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpenInsumos1(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>


      {/* NUEVAS ACTUALIZACION DE INSUMOS  */}
      <Modal isOpen={modalOpenInsumos} size="xl">
        <ModalHeader><strong>Insumos del servicio:</strong> {datoVentaSeleccionado.d_producto}</ModalHeader>

        <ModalBody>
          {/* <Row className="justify-content-end"> */}
          <Row>
            <Col md={7}>
              <ButtonGroup>
                {/* <Button
                  onClick={async () => {
                    const permiso = await filtroSeguridad("AGREGA_INSUMO");
                    if (permiso === false) {
                      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
                    } else {
                      setModalOpenInsumosSelect(true);
                      fetchInsumosProductoResumen();
                      fetchInsumosProducto();
                    }
                  }}
                >
                  Agregar insumos +
                </Button> */}
                <Button color="info"
                  onClick={async () => {
                    const permiso = await filtroSeguridad("AGREGA_INSUMO");
                    if (permiso === false) {
                      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
                    } else {
                      fetchInsumosProductoSolicitud();
                      setModalOpenInsumosSolicitud(true);
                    }
                  }}
                >
                  Enlazar insumos <FcDownload size={23} />
                </Button>
              </ButtonGroup>
            </Col>
            <Col md={6}></Col>
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
              {datoInsumosProductoResumen.length > 0
                ? datoInsumosProductoResumen.map((dato: any) => (
                  <tr key={dato.id}>
                    {dato.id ? (
                      <>
                        <td>{dato.d_insumo}</td>
                        <td align="left">{cantidadInsumo(dato.id_insumo)}</td>
                        <td align="left">{dato.unidadMedida}</td>
                        <td align="left">{dato.cantidad}</td>

                        <td className="gap-5">
                          <AiFillEdit
                            className="mr-2"
                            onClick={() => {
                              setModalEditInsumo(true);
                              setFormInsumo({
                                cantidad: dato.cantidad,
                                fechaAlta: dato.fechaAlta,
                                id: dato.id,
                                id_insumo: dato.id_insumo,
                                id_venta: dato.id_venta,
                                unidadMedida: dato.unidadMedida,
                                d_insumo: dato.d_insumo,
                                existencia: cantidadInsumo(dato.id_insumo),
                              });
                            }}
                            size={23}
                          ></AiFillEdit>
                          {/* <AiFillDelete
                            color="lightred"
                            onClick={() => {
                              deleteInsumo(dato);
                              setTimeout(() => {
                                fetchInsumosProducto();
                              }, 1000);
                            }}
                            size={23}
                          /> */}
                          <AiFillDelete
                            color="lightred"
                            onClick={async () => {
                              const permiso = await filtroSeguridad("ELIMINA_INSUMO ");
                              if (permiso === false) {
                                return; // Si el permiso es falso o los campos no son válidos, se sale de la función
                              } else {
                                deleteInsumo(dato);
                                setTimeout(() => {
                                  fetchInsumosProducto();
                                }, 1000);
                              }
                            }}
                            size={23}
                          />
                        </td>
                      </>
                    ) : null}
                  </tr>
                ))
                : null}
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
          <br />
          <TableInsumosGenerales
            datoVentaSeleccionado={selectedID2}
            data={data}
            setModalOpen2={setModalOpenInsumosSelect}
            handleGetFetch={fetchInsumosProductoResumen}
            datoInsumosProducto={datoInsumosProducto}
            datoInsumosProductoResumen={datoInsumosProductoResumen}
            setDescInsumos={setDescInsumos}
            descInsumos={descInsumos}
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
        <ModalHeader>
          <h3>Edición de insumo</h3>{" "}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Label>
                Insumo utilizado: <strong>{formInsumo.d_insumo}</strong>{" "}
              </Label>
              <Label>
                Cantidad de existencia: <strong>{formInsumo.existencia}</strong>{" "}
              </Label>
              <br />
              <br />
              <Label> Cantidad a modificar: </Label>
              <Input value={formInsumo.cantidad} name="cantidad" onChange={cambiosInsumos} type="number"></Input>
              <br />
            </Col>
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
          {/* <Button
            color="success"
            style={{ width: "34%" }}
            onClick={() => {
              editInsumo();
            }}
          >
            Guardar cambios
          </Button> */}

          <Button
            color="success"
            onClick={async () => {
              const permiso = await filtroSeguridad("EDITAR_INSUMO ");
              if (permiso === false) {
                return; // Si el permiso es falso o los campos no son válidos, se sale de la función
              } else {
                editInsumo();
              }
            }}
          >
            Guardar cambios
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalTicket} size="sm">
        <ModalHeader>Preview</ModalHeader>
        <ModalBody>
          {/* <br />
          <Row>
            <div className="text-left" style={{ fontFamily: "courier new" }}>
              {datoTicket
                ? datoTicket.map((ticket) => (
                    <>
                      <Label> {ticket.LINEA} </Label>
                      <br />
                    </>
                  ))
                : null}
            </div>
            <br />
          </Row>
          <br /> */}
          <div style={{ fontFamily: "Courier New", whiteSpace: "pre", fontSize: "12px" }}>
            {datoTicket &&
              datoTicket.map((ticket, index) => (
                <strong key={index}>
                  {ticket.LINEA}
                  <br />
                </strong>
              ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              openTicketPreview();
            }}
            text="Imprimir"
          />
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
                        cantidad
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
              // stas;
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalTicketEstilista} size="sm">
        <ModalHeader>Preview de ticket del estilista</ModalHeader>
        <ModalBody>
          <div style={{ fontFamily: "Courier New", whiteSpace: "pre", fontSize: "12px" }}>
            {datoTicketEstilista &&
              datoTicketEstilista.map((ticket, index) => (
                <strong key={index}>
                  {ticket.LINEA}
                  <br />
                </strong>
              ))}
          </div>
          {/* <br />
          <Row>
            <TicketPrint>
              <div className="text-left" style={{ fontFamily: "courier new" }}>
                {datoTicketEstilista.length > 0 ? (
                  datoTicketEstilista.map((ticket) => (
                    <>
                      <Label> {ticket.LINEA} </Label>
                      <br />
                    </>
                  ))
                ) : (
                  <h5>Se ha impreso ticket de insumos del estilista. </h5>
                )}
              </div>
              <br />
            </TicketPrint>
          </Row>
          <br /> */}
        </ModalBody>
        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              openTicketEstilistaPreview();
            }}
            text="Imprimir"
          />
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
        <ModalHeader>
          <h3>Elegir anticipo</h3>
        </ModalHeader>
        <ModalBody>
          {dataAnticipos.length === 0 ? <h4> Por el momento el cliente no cuenta con anticipos </h4> : null}
          <br />
          <DataTable></DataTable>
          <br />
          <br />
          <br />
          <br />
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
      <Modal isOpen={modalTiendaVirtual} size="xl">
        <ModalHeader>
          <h3>Elegir tienda virtual</h3>
        </ModalHeader>
        <ModalBody>
          {dataAnticipos.length === 0 ? <h4> Por el momento el cliente no cuenta con anticipos </h4> : null}
          <br />
          <DataTableTiendaVirtual></DataTableTiendaVirtual>
          <br />
          <br />
          <br />
          <br />
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalTiendaVirtual(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalTipoVenta} size="xl">
        <ModalHeader>
          <h3>Elegir forma de pago</h3>
        </ModalHeader>
        <ModalBody>
          <Label> Forma de pago: </Label>
          {/* <Input type="select" onChange={handleFormaPagoTemporal} value={dataArregloTemporal.formaPago} name={"formaPago"}>
            <option value={""}>--Seleccione la forma de pago--</option>
            {formasPagosFiltradas.map((formaPago, index) => (
              <option key={index} value={formaPago.tipo}>
                {formaPago.descripcion}
              </option>
            ))}
          </Input>
           */}

          <Input type="select" onChange={handleFormaPagoTemporal} value={dataArregloTemporal.formaPago} name="formaPago">
            <option value="">--Seleccione la forma de pago--</option>
            {formasPagosFiltradas
              .filter((formaPago) => {
                const descripcion = formaPago.descripcion.toLowerCase();
                const palabraClave = /efectivo|anticipos/;
                return promocion === 1 ? palabraClave.test(descripcion) : true;
              })
              .map((formaPago, index) => (
                <option key={index} value={formaPago.tipo}>
                  {formaPago.descripcion}
                </option>
              ))}
          </Input>
          <br />
          <Label> Importe: </Label>
          <Input
            type="number"
            onChange={handleFormaPagoTemporal}
            value={dataArregloTemporal.importe}
            name={"importe"}
            disabled={anticipoSelected}
          ></Input>
          <br />
          {dataArregloTemporal.formaPago == 90 ||
            dataArregloTemporal.formaPago == 91 ||
            dataArregloTemporal.formaPago == 80 ||
            dataArregloTemporal.formaPago == 92 ||
            dataArregloTemporal.formaPago == 100 ||
            dataArregloTemporal.formaPago == 101 ||
            dataArregloTemporal.formaPago == 110 ||
            dataArregloTemporal.formaPago == 103 ? (
            <>
              <Label> Referencia: </Label>
              <Input onChange={handleFormaPagoTemporal} value={dataArregloTemporal.referencia} name={"referencia"}></Input>
            </>
          ) : null}

          <br />
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalTipoVenta(false);
              setAnticipoSelected(false);
              setDataArregloTemporal({ ...dataArregloTemporal, formaPago: 0, importe: 0, referencia: "" });
            }}
            text="Salir"
          />
          <CButton
            color="success"
            onClick={() => {
              setAnticipoSelected(false);
              // Validación de campos
              if (!dataArregloTemporal.formaPago || dataArregloTemporal.formaPago === 0) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Por favor, seleccione una forma de pago.",
                });
                return;
              } else if (dataArregloTemporal.importe < 0) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Por favor, ingrese un importe válido.",
                });
                return;
              } else if (dataArregloTemporal.formaPago != 1 && !dataArregloTemporal.referencia) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Por favor, ingrese una referencia.",
                });
                return;
              } else {
                // Tarjetas / Movimientos bancarios
                if (anticipoId > 0) {
                  let anticipoTemp = (Number(formPago.anticipos) * -1 + Number(formAnticipo.importe)) * -1;
                  setFormPago({ ...formPago, anticipos: anticipoTemp });
                } else {
                  if (
                    Number(dataArregloTemporal.formaPago) === 90 ||
                    Number(dataArregloTemporal.formaPago) === 91 ||
                    Number(dataArregloTemporal.formaPago) === 92 ||
                    Number(dataArregloTemporal.formaPago) === 100 ||
                    Number(dataArregloTemporal.formaPago) === 101 ||
                    Number(dataArregloTemporal.formaPago) === 110 ||
                    Number(dataArregloTemporal.formaPago) === 103
                  ) {
                    setFormPago({ ...formPago, tc: Number(formPago.tc) + Number(dataArregloTemporal.importe) });
                    // Efectivo
                  } else if (Number(dataArregloTemporal.formaPago) === 1) {
                    setFormPago({ ...formPago, efectivo: Number(dataArregloTemporal.importe) });
                  }
                }
                setArregloTemporal([...arregloTemporal, dataArregloTemporal]);
                setAnticipoId(0);
                setModalTipoVenta(false);
                setDataArregloTemporal({ d_formaPago: "", formaPago: 0, importe: 0, referencia: "" });
              }
            }}
            text="Guardar"
          />
        </ModalFooter>
      </Modal>
      {/* AQUI COMIENZO MI EDIT...........E........... */}
      <Modal isOpen={modalOpenVentaEdit} size="lg">
        <ModalHeader>
          <div>
            <h3>Venta edición</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Producto/Servicio:</Label>
          <Row>
            <Col md={12}>
              <InputGroup>
                <Input disabled value={dataVentaEdit.d_producto ? dataVentaEdit.d_producto : ""} />
                <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
              </InputGroup>
            </Col>
          </Row>
          <br />
          <Label>Encargado:</Label>
          <Row>
            <Col md={12}>
              <InputGroup>
                <Input disabled value={dataVentaEdit.d_estilista ? dataVentaEdit.d_estilista : ""} />
                <Button
                  onClick={() => {
                    setModalOpen2(true);
                    setFlagEstilistas(false);
                  }}
                >
                  Elegir
                </Button>
              </InputGroup>
            </Col>
          </Row>
          <br />
          {dataVentaEdit.Observacion === "SERV" ? (
            <>
              <Label>Estilista auxilliar:</Label>
              <Row>
                <Col xs={10}>
                  <InputGroup>
                    <Input disabled value={dataVentaEdit.d_estilistaAuxilliar ? dataVentaEdit.d_estilistaAuxilliar : ""} />
                    <Button
                      onClick={() => {
                        setModalOpen2(true);
                        setFlagEstilistas(true);
                      }}
                    >
                      Elegir
                    </Button>
                  </InputGroup>
                </Col>
                <Col xs={2}>
                  <Button color="danger" onClick={() => setDataVentaEdit({ ...dataVentaEdit, idestilistaAux: 0, d_estilistaAuxilliar: "" })}>
                    <AiFillDelete></AiFillDelete>
                  </Button>
                </Col>
              </Row>
              <br />
            </>
          ) : null}
          <Row>
            <Col sm="6">
              <Label>Cantidad en existencia: </Label>
              <Input
                disabled
                placeholder="Cantidad en existencia"
                onChange={cambiosEdit}
                name="d_existencia"
                value={dataVentaEdit.d_existencia ? dataVentaEdit.d_existencia : getExistenciaForeignKey(dataVentaEdit.Clave_prod)}
              />
              {/* Revisar si hay error de render en esta linea 2264 */}
            </Col>
            <Col sm="6">
              <Label>Precio:</Label>
              <Input
                disabled
                placeholder="Precio"
                onChange={cambiosEdit}
                name="Precio"
                value={dataVentaEdit.Precio ? "$" + dataVentaEdit.Precio.toFixed(2) : 0}
              />
              <br />
            </Col>

            <Col sm="6">
              <Label>Cantidad a vender:</Label>
              <Input placeholder="Cantidad" onChange={cambiosEdit} name="Cant_producto" value={dataVentaEdit.Cant_producto} />
            </Col>
            {dataVentaEdit.Observacion === "SERV" ? (
              <Col sm="6">
                <Label>Tiempo:</Label>
                <Input placeholder="tiempo" onChange={cambiosEdit} name="tiempo" value={dataVentaEdit.tiempo} />
              </Col>
            ) : null}
          </Row>
          <br />
          <Label>Tipo de descuento:</Label>
          <Input type="select" name="Clave_Descuento" value={dataVentaEdit.Clave_Descuento} onChange={cambiosEdit}>
            <option value={0}>-Selecciona El tipo de descuento-</option>
            {dataDescuentos.map((descuento) => (
              <option value={descuento.id}>{descuento.descripcion}</option>
            ))}
          </Input>
          <br />
          <Label>
            Descuento {descuento.min} - {descuento.max} :{" "}
          </Label>
          <Row>
            <Col md={"12"}>
              <Input name="Descuento" value={dataVentaEdit.Descuento} onChange={cambiosEdit} placeholder="0.0" type="number"></Input>
            </Col>
          </Row>
          <br />
          {dataVentaEdit.Observacion === "SERV" ? (
            <>
              <Label style={{ marginRight: 10 }}>Hora de servicio:</Label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  sx={{ width: 1 / 3, height: 1, paddingBottom: 5 }}
                  label="Seleccione la hora"
                  defaultValue={new Date(dataVentaEdit.hora)}
                  onChange={(newValue) => setDataVentaEdit((prev) => ({ ...prev, hora: newValue }))}
                />
              </LocalizationProvider>
            </>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpenVentaEdit(false);
              setDescuento({ min: 0, max: 0 });
              setDataVentaEdit({ ...dataVentaEdit, Cant_producto: 0, d_existencia: 0 });
            }}
            text="Salir"
          />
          <Button
            color="primary"
            disabled={dataVentaEdit.d_producto || dataVentaEdit.cliente ? false : true}
            onClick={() => {
              if (dataVentaEdit.Cant_producto == 0) {
                Swal.fire({
                  icon: "info",
                  text: "No ha seleccionado cantidad a vender",
                });
              } else if (!dataVentaEdit.d_producto) {
                Swal.fire({
                  icon: "info",
                  text: "No ha seleccionado producto",
                });
              } else if (!dataVentaEdit.d_estilista) {
                Swal.fire({
                  icon: "info",
                  text: "No ha seleccionado estilista",
                });
              } else if (dataVentaEdit.Descuento > descuento.max || dataVentaEdit.Descuento < descuento.min) {
                Swal.fire({
                  icon: "info",
                  text: "Favor de verificar el descuento",
                });
              } else {
                //setModalOpen(false);
                if (dataVentaEdit.Observacion !== "SERV") {
                  if (Number(dataVentaEdit.Cant_producto) > Number(dataVentaEdit.existenciaEdit)) {
                    Swal.fire({
                      icon: "info",
                      text: "Favor de verificar las existencias",
                    });
                    return;
                  }
                }
                if (dataVentaEdit.d_producto) {
                  editVenta();
                  setDataTemporal((prevData) => ({
                    ...datosInicialesArreglo[0],
                    cliente: prevData.cliente,
                    Cve_cliente: prevData.Cve_cliente,
                  }));
                  setDescuento({ min: 0, max: 0 });
                }
              }
            }}
          >
            Editar venta
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen} toggle={toggleModalHistorial} fullscreen>
        <ModalHeader toggle={toggleModalHistorial}>
          <h3>Historial del cliente</h3>{" "}
        </ModalHeader>
        <ModalBody>
          <TableHistorial
            datah={datah}
            loadHistorialDetalle={loadHistorialDetalle}
            setIsModalOpen={setIsModalOpen}
            setParamsDetalles={setParamsDetalles}
          ></TableHistorial>

          <br />
          <div>
            <Card style={{ width: "1650px", height: "400px" }}>
              <CardBody>
                <h3>Historial citas futuras</h3>
                <br />
                <div>
                  <Table hover className="table-responsive">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Sucursal</th>
                        <th>Servicio</th>
                        <th>Estilista</th>
                        <th>Usuario</th>
                        <th>Feha alta cita</th>
                        {/* Agrega más encabezados según tus datos */}
                      </tr>
                    </thead>
                    <tbody>
                      {datah1.map((item, index) => (
                        <tr key={index}>
                          <td>{item.fechaCita}</td>
                          <td>{item.hora}</td>
                          <td>{item.nombreSuc}</td>
                          <td>{item.Servicio}</td>
                          <td>{item.Estilista}</td>
                          <td>{item.nombreUsrRegistra}</td>
                          <td>{item.fechaAlta}</td>
                          {/* Agrega más celdas según tus datos */}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </div>
          <br />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggleModalHistorial}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} size="lg">
        <ModalHeader toggle={handleCloseModal}>Historial detalle</ModalHeader>
        <ModalBody>
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <Table>
              <thead>
                <tr>
                  <th>
                    <p>
                      <strong>Fecha:</strong> {paramsDetalles.fecha.split("T")[0]}
                    </p>
                  </th>
                  <th>
                    <p>
                      <strong>No. Venta: </strong>
                      {paramsDetalles.numVenta}
                    </p>
                  </th>
                  <th>
                    <p>
                      <strong>Sucursal:</strong> {paramsDetalles.sucursal}
                    </p>
                  </th>
                </tr>
              </thead>
            </Table>
            <Table>
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                {historialDetalle.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Insumo}</td>
                    <td>{item.Cant}</td>
                    <td>{item.precio}</td>
                    <td>{item.importe}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div>
              <p style={{ textAlign: "left" }}>
                <strong>Total: ${totalImportes.toFixed(2)}</strong>
              </p>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={modalOpenPromo} size="sm" toggle={() => setModalOpenPromo(false)}>
        <ModalHeader>Descuento disponible</ModalHeader>
        <ModalBody>
          {/* Asumiendo que solo quieres mostrar los datos del primer ítem */}
          {dataPromo && dataPromo["0"] && (
            <div>
              <p>
                ¡Buenas noticias! La venta califica para un descuento especial. Al pagar con <strong>{dataPromo["0"].descripcion}</strong>, el total de la venta será de solo <strong>${dataPromo["0"].importeDescuento}</strong>.
              </p>

            </div>
          )}

        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpenPromo(false)} text="Salir" />
        </ModalFooter>
      </Modal>


      {/* ENLAZAR INSUMOS DE LOS ESTILISTAS */}

      <Modal isOpen={modalOpenInsumosSolicitud} size="xl">
        <ModalHeader><strong>Enlace de Insumos Solicitados:</strong> {datoVentaSeleccionado.d_producto}</ModalHeader>

        <ModalBody>
          <Table size="sm" striped={true} responsive={"sm"}>
            <thead>
              <tr>
                {TableDataHeaderInsumoSoli.map((valor: any) => (
                  <th key={valor}>{valor}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datoInsumosProductoSolicitud.length > 0
                ? datoInsumosProductoSolicitud.map((dato: any) => (
                  <tr key={dato.id}>
                    {dato.id ? (
                      <>
                        <td>{dato.d_insumo}</td>
                        <td align="left">{cantidadInsumo(dato.id_insumo)}</td>
                        <td align="left">{dato.unidadMedida}</td>
                        <td align="left">{dato.cantidad}</td>
                        <td align="left">{dato.enlazado ? "Si" : "No"}</td>
                        <td align="left">{dato.fecha_enlace}</td>

                        {/* Mostrar ícono de sincronización en la columna de eliminar si enlazado = false */}
                        <td align="left" className="gap-5">
                          {!dato.enlazado ? (
                            <FcSynchronize
                              color="lightred"
                              onClick={async () => {
                                const permiso = await filtroSeguridad("FINALIZA_INSUMO_SOLICITADO");
                                if (permiso === false) {
                                  return; // Si el permiso es falso, se sale de la función
                                } else {
                                  InsumoSolicitadoFinaliza(dato);
                                  setTimeout(() => {
                                    fetchInsumosProductoSolicitud();

                                  }, 1000);
                                }
                              }}
                              size={23}
                            />
                          ) : (
                            <>
                              {/* Íconos de editar/eliminar cuando enlazado es true */}

                              <FcPaid
                                color="lightred"
                                size={23}
                              />
                            </>
                          )}
                        </td>
                      </>
                    ) : null}
                  </tr>
                ))
                : null}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpenInsumosSolicitud(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>





    </>
  );
};

export default Ventas;
