import React, { useEffect, useState, useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";

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
} from "reactstrap";
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
import { useFormasPagos } from "../../hooks/getsHooks/useFormasPagos";
import { FormaPago } from "../../models/FormaPago";
import TimeKeeper from "react-timekeeper";
import { useVentasProceso } from "../../hooks/getsHooks/useVentasProceso";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MdOutlineReceiptLong, MdAttachMoney, MdAccessTime, MdDataSaverOn, MdPendingActions, MdEmojiPeople } from "react-icons/md";
import { format } from "date-fns";
import { LuCalendarSearch } from "react-icons/lu";




interface TicketPrintProps {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}
const Ventas = () => {
  const { modalActualizar, setModalActualizar, cerrarModalActualizar } = useModalHook();

  const [modalOpenVenta, setModalOpen] = useState<boolean>(false);
  const [modalOpenVentaEdit, setModalOpenVentaEdit] = useState<boolean>(false);
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
  const [modalTipoVenta, setModalTipoVenta] = useState<boolean>(false);
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
  const [arregloTemporal, setArregloTemporal] = useState<{ importe: number; formaPago: number; referencia: string }[]>([]);
  const [dataArregloTemporal, setDataArregloTemporal] = useState({
    formaPago: 0,
    importe: 0,
    d_formaPago: "",
    referencia: "",
  });

  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  const { dataClientes } = useClientes();
  const { dataTrabajadores } = useNominaTrabajadores();
  const { dataDescuentos } = useDescuentos();
  const [formasPagosFiltradas, setFormasPagosFiltradas] = useState<FormaPago[]>([]);

  const { dataFormasPagos, fetchFormasPagos } = useFormasPagos();
  useEffect(() => {
    const formasPagosFiltradas = dataFormasPagos.filter((formaPago) => formaPago.sucursal === dataUsuarios2[0]?.sucursal);
    setFormasPagosFiltradas(formasPagosFiltradas);
  }, [dataFormasPagos]);
  const [form, setForm] = useState<Usuario[]>([]);
  const [datoTicket, setDatoTicket] = useState([]);
  const [datoTicketEstilista, setDatoTicketEstilista] = useState([]);
  const { dataVentasProcesos, fetchVentasProcesos } = useVentasProceso({ idSucursal: dataUsuarios2[0]?.sucursal });

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
      hora: 8,
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
    idEstilista: 0,
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
    idestilistaAux: 0,
    idRecepcionista: 0,
  });
  const [data, setdata] = useState<Venta[]>([]);
  useEffect(() => {
    setdata(datosInicialesArreglo);
  }, []);

  // const TableDataHeader = ["Estilista", "Producto/Servicio", "Cantidad", "Precio", "Descuento", "Importe", "Hora", "Tiempo", "Acciones"];
  const TableDataHeader = [
    "Estilista",
    "Auxiliar",
    "Producto/Servicio",
    "Cantidad",
    // "Unidad de medida",
    "Precio unitario",
    "Precio total",
    "Descuento autorizado",
    "Importe",
    "Acciones",
  ];
  const TableDataHeaderInsumo = ["Insumo", "Cantidad", "Unidad de medida", "Acciones"];
  const TabñeDataHeaderEstilistaProceso = ["Estilista", ""];

  const mostrarModalActualizar = (dato: Venta) => {
    setDataTemporal(dato);
    setModalActualizar(true);
  };

  const handleInsumoSelection = () => {
    Swal.fire({
      title: `Ingrese el descuento entre: ${descuento.min} - ${descuento.max} `,
      input: "number",
      inputAttributes: {
        min: "0.01", // Establece un valor mínimo para el input (por ejemplo, 0.01 para permitir decimales)
        step: "0.01", // Define los pasos para incrementar/decrementar el valor (por ejemplo, 0.01 para decimales)
      },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (cantidad) => {
        return new Promise((resolve, reject) => {
          // Realizar cualquier validación adicional aquí si es necesario
          const cantidadNumber = parseFloat(cantidad);
          if (isNaN(cantidadNumber) || cantidadNumber <= 0) {
            reject("La cantidad debe ser mayor a cero.");
          } else {
            resolve(cantidadNumber);
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const cantidad = result.value;
        // Realiza aquí la lógica para guardar la cantidad seleccionada
        setDataTemporal({ ...dataTemporal, Descuento: Number(cantidad) });
        // setForm((prevState) => {
        //   const updatedForm = { ...prevState, id_insumo: id, cantidad };
        //   return updatedForm;
        // });
        setModalOpen2(false);
      }
    });
  };

  const [descuento, setDescuento] = useState({
    min: 0,
    max: 0,
  });
  const cambios = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "hora") {
      // const partesHora = value.split(":");
      // const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
      // const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
      // let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut
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
  const cambiosPagos = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormPago((prev) => ({ ...prev, [name]: value }));
  };
  // const handleFormaPagoTemporal = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {

  //   const { name, value } = e.target;
  //   if ((name === "formaPago" && Number(value) === 60) || (name === "formaPago" && Number(value) === 2059)) {
  //     setModalAnticipo(true);
  //   }
  //   // if (name === "formaPago" && Number(value) === 58) {
  //   //   setFormPago({ ...formPago, tc: Number(value) });
  //   // } else if (name === "formaPago" && Number(value) === 60) {
  //   //   setFormPago({ ...formPago, anticipos: Number(value) });
  //   // } else if (name === "formaPago" && Number(value) === 1057) {
  //   //   setFormPago({ ...formPago, tc: Number(value) });
  //   // } else if (name === "formaPago" && Number(value) === 2058) {
  //   //   setFormPago({ ...formPago, tc: Number(value) });
  //   // } else if (name === "formaPago" && Number(value) === 2059) {
  //   //   setFormPago({ ...formPago, tc: Number(value) });
  //   // }

  //   setDataArregloTemporal((prev) => ({ ...prev, [name]: value }));
  // };

  const [selectedFormasPago, setSelectedFormasPago] = useState<Set<number>>(new Set());
  const handleFormaPagoTemporal = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Comprueba si el método de pago seleccionado ya está en el arregloTemporal
    const isAlreadySelected = arregloTemporal.some((pago) => pago.formaPago === value);

    if (isAlreadySelected && name === "formaPago") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `¡Método de pago ya seleccionado!`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    } else if (name === "formaPago" && Number(value) === 100) {
      setModalAnticipo(true);
      setDataArregloTemporal((prev) => ({ ...prev, [name]: value }));
    } else if (name === "importe") {
      const cleanedValue = value?.replace(/[^0-9]/g, ""); // Remover caracteres no numéricos
      setDataArregloTemporal((prev) => ({ ...prev, [name]: Number(cleanedValue) }));
    } else {
      setDataArregloTemporal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const cambiosInsumos = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormInsumo((prev) => ({ ...prev, [name]: value }));
    console.log(formInsumo);
  };

  useEffect(() => {
    const totalCobro = Number(formPago.anticipos) + Number(formPago.efectivo) + Number(formPago.tc);
    const totalCambio = Number(totalCobro) - Number(total);
    setFormPago((prev) => ({
      ...prev,
      totalPago: totalCobro,
      cambioCliente: Number(totalCambio),
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
            // Precio: dataTemporal.Precio_base === 0 ? dataTemporal.Precio : dataTemporal.Precio_base,
            Precio: dataTemporal.Precio,
            Precio_base: dataTemporal.Precio,
            No_venta_original: 0,
            cancelada: false,
            folio_estilista: 0,
            hora: horaDateTime,
            tiempo: dataTemporal.tiempo == 0 ? 30 : dataTemporal.tiempo,
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
            cliente: prevData.cliente,
            Cve_cliente: prevData.Cve_cliente,
          }));
          setDescuento({ min: 0, max: 0 });
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

    // if (dato.Observacion === "SERV") {
    //   const opcion = window.confirm(`¿Está seguro de eliminar esta venta? Al eliminar esta venta se eliminarán los insumos relacionados `);
    //   console.log(dato.id);
    //   if (opcion) {
    //     try {
    //       await jezaApi.delete(`/Venta?id=${dato.id}`).then((response) => console.log(response));
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // } else {
    //   const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento `);
    //   console.log(dato.id);
    //   if (opcion) {
    //     try {
    //       await jezaApi.delete(`/Venta?id=${dato.id}`).then((response) => console.log(response));
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // }
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
          jezaApi.delete(`/VentaInsumo?id=${dato.id}`).then(() => fetchInsumosProducto());
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editInsumo = () => {
    jezaApi
      .put("/VentaInsumo", null, {
        params: {
          id: Number(formInsumo.id),
          cantidad: Number(formInsumo.cantidad),
        },
      })
      .then((response) =>
        Swal.fire({
          icon: "success",
          text: "Insumo actualizada con éxito",
          confirmButtonColor: "#3085d6",
        })
      );
  };

  const { dataVentas, fetchVentas } = useVentasV2({
    idCliente: dataTemporal.Cve_cliente,
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

  const obtenerHoraFormateada = (hora: any) => {
    const fecha = new Date(hora);
    const horaFormateada = fecha.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    return horaFormateada;
  };

  useEffect(() => {
    let totalPorProducto = 0;

    dataVentas.forEach((producto) => {
      totalPorProducto += producto.Precio * producto.Cant_producto - producto.Precio * producto.Cant_producto * producto.Descuento;
    });

    setTotal(Number(totalPorProducto));
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

    // const temporal = dataVentas[0]?.hora ? dataVentas[0]?.hora : "";
    // const partesHora = temporal.split(":");
    // const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
    // const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
    // let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut
    // setDataTemporal({ ...dataTemporal, hora: horaInt });
  }, [dataVentas]);

  const postEstilistaTicket = (dato: any) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19);
    console.log(dato);
    jezaApi
      .get(
        `/TicketInsumosEstilsta?cia=26&sucursal=${dataUsuarios2[0]?.sucursal}&f1=${fechaVieja}&f2=${formattedDate}&estilista=${dato.User}&cte=${dato.Cve_cliente}&noVenta=${dato.No_venta}`
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
  }, [dataVentas]);

  const endVenta = () => {
    jezaApi.put(`/VentaCierre?suc=${dataUsuarios2[0].sucursal}&cliente=${dataTemporal.Cve_cliente}&Caja=1`).then((response) => {
      medioPago(Number(response.data.mensaje2));
      jezaApi
        .get(
          `/TicketVta?folio=${response.data.mensaje2}&caja=1&suc=${dataUsuarios2[0]?.sucursal}&usr=${dataUsuarios2[0]?.id}&pago=${formPago.totalPago}`
        )
        .then((response) => {
          setDatoTicket(response.data);
          setModalTicket(true);
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
    });
  };

  const { dataAnticipos } = useAnticipoVentas({
    cliente: Number(dataTemporal.Cve_cliente),
    suc: dataUsuarios2[0]?.sucursal,
  });
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
            setFormPago({ ...formPago, anticipos: Number(formPago.anticipos) + Number(params.row.importe) });
            setFormAnticipo({
              ...formAnticipo,
              id: params.row.id,
              referencia: params.row.referencia,
              observaciones: params.row.observaciones,
              importe: params.row.importe,
            });
            // console.log(formAnticipo);
            setModalAnticipo(false);
            // setModalTipoVenta(false);
            setDataArregloTemporal({
              ...dataArregloTemporal,
              importe: params.row.importe,
              referencia: params.row.referencia.toString(),
            });
          }}
        >
          Seleccionar
        </Button>
      </>
    );
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

  // const anticipoPost = (noVenta: number) => {
  //   if (formAnticipo.importe > 0) {
  //     jezaApi
  //       .post("/AnticipoAplicado", null, {
  //         params: {
  //           cia: 26,
  //           sucursal: dataUsuarios2[0]?.sucursal,
  //           caja: 1,
  //           fecha: fechaHoy,
  //           no_venta: noVenta,
  //           fechaMovto: 20230726,
  //           idCliente: dataTemporal.Cve_cliente,
  //           idUsuario: dataUsuarios2[0]?.id,
  //           tipoMovto: 1,
  //           referencia: formAnticipo.referencia,
  //           importe: formAnticipo.importe,
  //           observaciones: formAnticipo.observaciones,
  //           idAnticipo: formAnticipo.id,
  //         },
  //       })
  //       .then(() => {
  //         setTimeout(() => {
  //           Swal.fire({
  //             icon: "success",
  //             text: "Venta finalizada con éxito",
  //             confirmButtonColor: "#3085d6",
  //           });
  //         }, 1500);
  //       });
  //   } else {
  //     null;
  //   }
  // };

  const medioPago = (noVenta: number) => {
    arregloTemporal.forEach((elemento) => {
      const tempIdPago = getIdPago(Number(elemento.formaPago));

      jezaApi.post("/MedioPago", null, {
        params: {
          caja: 1,
          no_venta: noVenta,
          corte: 0,
          corte_parcial: 0,
          fecha: new Date(),
          sucursal: dataUsuarios2[0]?.sucursal,
          tipo_pago: tempIdPago,
          referencia: elemento.referencia ? elemento.referencia : "efectivo",
          importe: elemento.importe,
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

  const editVenta = () => {
    const today2 = new Date();
    const formattedDate = format(today2, "yyyy-MM-dd");
    const today = new Date();
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

    jezaApi
      .put(
        `/Venta?id=${dataVentaEdit.id}&Cia=26&Sucursal=${dataUsuarios2[0]?.sucursal
        }&Fecha=${formattedDate}&Caja=1&No_venta=0&no_venta2=0&Clave_prod=${dataVentaEdit.Clave_prod}&Cant_producto=${dataVentaEdit.Cant_producto
        }&Precio=${dataVentaEdit.Precio}&Cve_cliente=${dataVentaEdit.Cve_cliente}&Tasa_iva=0.16&Observacion=${dataVentaEdit.Observacion}&Descuento=${dataVentaEdit.Descuento
        }&Clave_Descuento=${dataVentaEdit.Clave_Descuento}&usuario=${dataVentaEdit.idEstilista}&Corte=1&Corte_parcial=1&Costo=${dataVentaEdit.Costo
        }&Precio_base=${dataVentaEdit.Precio_base}&No_venta_original=0&cancelada=false&folio_estilista=${0}&hora=${horaDateTime}&tiempo=${dataVentaEdit.tiempo === 0 ? 30 : dataVentaEdit.tiempo
        }&terminado=false&validadoServicio=false&idestilistaAux=${dataVentaEdit.idestilistaAux}&idRecepcionista=${dataUsuarios2[0]?.id}`
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          text: "Venta actualizada con éxito",
          confirmButtonColor: "#3085d6",
        });
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
        fetchVentas();
      });
  };

  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeChange = (time) => {
    setSelectedTime(time);
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
  };

  const [historialDetalle, setHistorialDetalle] = useState<any[]>([]); // Definir historialDetalle como una variable local, no un estado del componente
  const [flagDetalles, setFlagDetalles] = useState(false);
  const [paramsDetalles, setParamsDetalles] = useState({
    sucursal: 0,
    numVenta: 0,
    idProducto: 0,
    clave: 0,
    Cve_cliente: 0,
    fecha: "",
  });

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

  const cHistorial = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: "Acciones",
        Cell: ({ row }) => (
          <LuCalendarSearch size={23}
            onClick={() => {
              console.log(row.original);
              loadHistorialDetalle(row.original.Cve_cliente, row.original.NumVenta, row.original.idProducto, row.original.sucursal);
              setParamsDetalles({
                Cve_cliente: row.original.Cve_cliente,
                idProducto: row.original.idProducto,
                numVenta: row.original.NumVenta,
                sucursal: row.original.NombreSuc,
                clave: row.original.id,
                fecha: row.original.Fecha,
              });
              setIsModalOpen(true);
            }}


          />
        ),
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Cve_cliente",
        header: "Cliente",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "NumVenta",
        header: "NumVenta",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "NombreSuc",
        header: "Sucursal",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Fecha",
        header: "Fecha",
        flex: 1,
        size: 1,
        Cell: ({ cell }) => {
          const fecha = new Date(cell.getValue()); // Obtener la fecha como objeto Date
          const dia = fecha.getDate().toString().padStart(2, "0"); // Obtener el día con dos dígitos
          const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Obtener el mes con dos dígitos (los meses en JavaScript son base 0)
          const anio = fecha.getFullYear().toString(); // Obtener el año con cuatro dígitos

          return <span>{`${dia}/${mes}/${anio}`}</span>;
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Clave",
        header: "Clave",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Producto_Servicio",
        header: "Producto/Servicio",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Cantidad",
        header: "Cantidad",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Precio",
        header: "Precio",
        flex: 1,
        Cell: ({ cell }) => <span>${cell.getValue<number>().toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
        muiTableBodyCellProps: {
          align: "right",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        size: 1,
      },
      {
        accessorKey: "Estilista",
        header: "Estilista",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Descuento",
        header: "Descuento",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Forma_pago",
        header: "Forma de pago",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
    ],
    []
  );
  // const renderDetailPanel = ({ row }: { row: any }) => {
  //   // Cargar los detalles del historial al expandir un row
  //   useEffect(() => {
  //     loadHistorialDetalle(row.original.NumVenta);
  //   }, [row.original.NumVenta]); // Se ejecutará cada vez que cambie la NumVenta en el row

  //   return (
  //     <div style={{ display: "grid" }}>
  //       {/* Renderizar los detalles del historial */}
  //       {historialDetalle.length > 0 && (
  //         <div>
  //           <span>Detalles del historial:</span>
  //           <span>Fecha: {historialDetalle[0].Fecha}</span>
  //           <span>NumVenta: {historialDetalle[0].NumVenta}</span>
  //           <span>Sucursal: {historialDetalle[0].Sucursal}</span>
  //           <span>Estilista: {historialDetalle[0].Estilista}</span>
  //           <span>Servicio: {historialDetalle[0].Servicio}</span>
  //           <span>Insumo: {historialDetalle[0].Insumo}</span>
  //           <span>Cantidad: {historialDetalle[0].Cant}</span>
  //           {/* ... */}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  const [flagEstilistas, setFlagEstilistas] = useState(false);

  // const handleInputChange = (event) => {
  //   const cleanedValue = event.target.value.replace(/[^0-9]/g, ""); // Remover caracteres no numéricos
  //   setInputValue(cleanedValue);
  // };
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
              <Col md={"7"}>
                <InputGroup>
                  <Input disabled value={dataTemporal.cliente ? dataTemporal.cliente : ""} onChange={cambios} name={"Cve_cliente"} />
                  <Button onClick={() => setModalCliente(true)}>
                    <MdEmojiPeople size={23} />
                    Elegir
                  </Button>
                  <Button disabled={!dataTemporal.cliente} color="primary" size="sm" onClick={() => historial(dataTemporal.id)}>
                    Historial
                    <MdPendingActions size={23} />
                  </Button>
                </InputGroup>

                {/* <Label>Cliente</Label>
                <Input
                  disabled
                  value={dataTemporal.cliente ? dataTemporal.cliente : ""}
                  onChange={cambios}
                  name={"Cve_cliente"}
                />
                <Button onClick={() => setModalCliente(true)}>Elegir</Button> */}
              </Col>

              {/* <Col md={"10"}>
                <Label>Cliente</Label>
                <Input disabled value={dataTemporal.cliente ? dataTemporal.cliente : ""} onChange={cambios} name={"Cve_cliente"} />
              </Col>
              <Col md={"1"}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  <Button onClick={() => setModalCliente(true)}>Elegir</Button>
                  <Button disabled={!dataTemporal.cliente} color="primary" size="sm" onClick={() => historial(dataTemporal.id)}>
                    Historial
                  </Button>
                </ButtonGroup>
              </Col> */}
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
                    <td>{"$" + dato.Precio.toFixed(2)}</td>
                    <td>{"$" + (dato.Precio * dato.Cant_producto).toFixed(2)}</td>
                    {/* IMPORTE */}
                    <td>{"$" + (dato.Cant_producto * dato.Descuento * dato.Precio).toFixed(2)}</td>
                    <td>
                      {dato.Descuento === 0
                        ? "$" + (dato.Precio * dato.Cant_producto).toFixed(2)
                        : "$" + (dato.Precio * dato.Cant_producto - dato.Precio * dato.Cant_producto * dato.Descuento).toFixed(2)}
                    </td>
                    {/* <td>{obtenerHoraFormateada(dato.hora)}</td> */}
                    {/* <td>{dato.tiempo + " min"}</td> */}
                    <td className="gap-5">
                      <AiFillDelete
                        color="lightred"
                        onClick={() => {
                          deleteVenta(dato);
                          setTimeout(() => {
                            fetchVentas();
                          }, 1000);
                        }}
                        size={23}
                      />
                      <AiFillEdit
                        color="lightred"
                        onClick={() => {
                          console.log(dato);
                          const dateObject = new Date(dato.hora);

                          const hours = dateObject.getHours();
                          const minutes = dateObject.getMinutes();

                          const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                          setDataVentaEdit({
                            ...dataVentaEdit,
                            id: dato.id,
                            d_producto: dato.d_producto,
                            producto: dato.d_producto,
                            Clave_prod: dato.Clave_prod,
                            d_estilista: dato.d_estilista,
                            Cant_producto: dato.Cant_producto,
                            Descuento: dato.Descuento,
                            hora: formattedTime,
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
            <div className="d-flex  justify-content-start ">
              <InputGroup size="sm">
                <Button
                  // style={{ marginRight: 25 }}
                  disabled={dataVentas.length > 0 ? false : true}
                  color="success"
                  onClick={() => {
                    setModalOpenPago(true);
                    setFormPago({ ...formPago, anticipos: 0, efectivo: 0, tc: 0, cambioCliente: 0 });
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
            <p>Total: ${total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
          <Label>Producto/servicio:</Label>
          <Row>
            <Col>
              <Input disabled defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} />
            </Col>
            <Col md={2}>
              <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
            </Col>
          </Row>
          <br />
          <Label>Encargado:</Label>
          <Row>
            <Col>
              <Input disabled defaultValue={dataTemporal.estilista ? dataTemporal.estilista : ""} />
            </Col>
            <Col md={2}>
              <Button
                onClick={() => {
                  setFlagEstilistas(false);
                  setModalOpen2(true);
                }}
              >
                Elegir
              </Button>
            </Col>
          </Row>
          <br />
          {dataTemporal.Observacion === "SERV" ? (
            <>
              <Label>Estilista auxiliar:</Label>
              <Row>
                <Col xs={9}>
                  <Input disabled defaultValue={dataTemporal.d_estilistaAuxilliar ? dataTemporal.d_estilistaAuxilliar : ""} />
                </Col>

                <Col xs={1}>
                  <Button color="danger" onClick={() => setDataTemporal({ ...dataTemporal, idestilistaAux: 0, d_estilistaAuxilliar: "" })}>
                    <AiFillDelete></AiFillDelete>
                  </Button>
                </Col>
                <Col md={1}>
                  <Button
                    onClick={() => {
                      setModalOpen2(true);
                      setFlagEstilistas(true);
                    }}
                  >
                    Elegir
                  </Button>
                </Col>
              </Row>
            </>
          ) : null}
          <br />
          <Row>
            <Col sm={6} md={4}>
              <Label>Cantidad en existencia: </Label>
              <Input disabled placeholder="Cantidad en existencia" onChange={cambios} name="d_existencia" defaultValue={dataTemporal.d_existencia} />
              <br />
            </Col>
            <Col sm={6} md={4}>
              <Label>Precio</Label>
              <Input
                disabled
                placeholder="Precio"
                onChange={cambiosEdit}
                name="Precio"
                value={dataTemporal.Precio ? "$" + dataTemporal.Precio.toFixed(2) : 0}
              />
              <br />
            </Col>
            <Col md={4}>
              <Label>Cantidad a vender:</Label>
              <Input placeholder="Cantidad" onChange={cambios} name="Cant_producto" value={dataTemporal.Cant_producto} />
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
            Descuento entre {descuento.min} - {descuento.max} :{" "}
          </Label>
          <Row>
            <Col md={"12"}>
              <Input name="Descuento" value={dataTemporal.Descuento} onChange={cambios} placeholder="0.0"></Input>
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
              } else if (dataTemporal?.d_existencia < dataTemporal.Cant_producto && dataTemporal.Observacion !== "SERV") {
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
            Agregar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen2} size="md">
        <ModalHeader></ModalHeader>
        <ModalBody>
          <TableEstilistas
            dataVentaEdit={dataVentaEdit}
            setDataVentaEdit={setDataVentaEdit}
            data={dataTrabajadores}
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
          ></TableProductos>
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpen3(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalClientesProceso} size="md">
        <ModalHeader> Clientes en proceso </ModalHeader>
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

      <Modal isOpen={modalCliente} size="md">
        <ModalHeader> Cliente </ModalHeader>
        <ModalBody>
          <TableCliente
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
        <ModalHeader>Cobro</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="7">
              <Label>TOTAL DE ESTA VENTA: </Label>
            </Col>
            <Col md="5">
              <Input disabled value={"$" + total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}></Input>
            </Col>
          </Row>
          <hr className="my-4" />

          <Row>
            <Label> Seleccionar tipo de venta </Label>
            <Col md="5">
              <Button onClick={() => setModalTipoVenta(true)}> Seleccionar </Button>
            </Col>
          </Row>
          <br />
          {arregloTemporal.map((pago, index) => (
            <div>
              <Container>
                <Row className="align-items-center">
                  <Col xs={""}>
                    <Label>Forma de pago</Label>
                    <Input value={getFormaPago(Number(pago.formaPago))} disabled />
                  </Col>
                  <Col xs={""}>
                    <Label>Importe</Label>
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
                      <Label>Referencia</Label>
                      <Input value={pago.referencia} disabled />
                    </Col>
                  )}
                  <Col xs={"2"} md={"2"} className="d-flex justify-content-end mt-4">
                    {/* Utilizamos "justify-content-end" para alinear el botón a la derecha */}
                    <Button
                      onClick={() => {
                        if (Number(pago.formaPago) === 11) {
                          // efectivo
                          eliminarElemento(2, index, Number(pago.importe));
                        } else if (Number(pago.formaPago) === 90) {
                          // anticipo
                          eliminarElemento(1, index, Number(pago.importe));
                        } else {
                          // credito
                          eliminarElemento(0, index, Number(pago.importe));
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </Col>
                </Row>
              </Container>

              <br />
            </div>
          ))}

          <hr className="my-4" />
          {/* <Row>
            <Col md="7">
              <Label>Efectivo: </Label>
            </Col>
            <Col md="5">
              <Input onChange={cambiosPagos} name="efectivo" value={formPago.efectivo}></Input>
            </Col>
          </Row> */}
          <br />
          <Row>
            <Col md="7">
              <Label>TOTAL DE PAGOS: </Label>
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
              <Label>CAMBIO AL CLIENTE: </Label>
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
            }}
            text="Salir"
          />

          <CButton
            color="success"
            onClick={() => {
              // Convertir los valores a números antes de realizar la comparación
              const cambioCliente = parseFloat(formPago.cambioCliente);
              const efectivo = parseFloat(formPago.efectivo);
              const totalVenta = parseFloat(total); // Asegúrate de que "total" sea un número

              // Validar que el cambio no sea mayor al efectivo
              // if (cambioCliente >= 0 && cambioCliente <= efectivo) {
              if (cambioCliente <= efectivo) {
                // Validar que el total de pagos sea mayor o igual al total de venta
                if (parseFloat(formPago.totalPago) >= totalVenta) {
                  // El total de pagos es mayor o igual al total de venta, continuar con el proceso de cobro
                  setModalOpenPago(false);
                  setDataTemporal({ Cve_cliente: 0 });
                  setFormPago({ anticipos: 0, cambioCliente: 0, efectivo: 0, tc: 0, totalPago: 0 });
                  endVenta();
                  setArregloTemporal([]);
                } else {
                  // El total de pagos es menor al total de venta, mostrar un mensaje de error
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `El total de pagos es menor al total de venta`,
                    confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
                  });
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

      <Modal isOpen={modalOpenInsumos} size="md">
        <ModalHeader>Insumos del servicio {datoVentaSeleccionado.d_producto}</ModalHeader>
        <ModalBody>
          <Row className="justify-content-end">
            <Col md={6}>
              <Button color="primary" onClick={() => setModalOpenInsumosSelect(true)}>
                Agregar insumos +
              </Button>
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
          <br />
          <TableInsumosGenerales
            datoVentaSeleccionado={selectedID2}
            data={data}
            setModalOpen2={setModalOpenInsumosSelect}
            handleGetFetch={fetchInsumosProducto}
            datoInsumosProducto={datoInsumosProducto}
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
        <ModalHeader>Preview de ticket de venta</ModalHeader>
        <ModalBody>
          <br />
          <Row>
            <TicketPrint>
              <div className="text-left" style={{ fontFamily: "courier new" }}>
                {datoTicket.map((ticket) => (
                  <>
                    <Label> {ticket.LINEA} </Label>
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
          <br />
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

      <Modal isOpen={modalTipoVenta} size="xl">
        <ModalHeader>Seleccione el tipo de venta</ModalHeader>
        <ModalBody>
          <Label> Forma de pago </Label>
          <Input type="select" onChange={handleFormaPagoTemporal} value={dataArregloTemporal.formaPago} name={"formaPago"}>
            <option value={0}>-Seleccione la forma de pago-</option>
            {formasPagosFiltradas.map((formaPago, index) => (
              <option key={index} value={formaPago.tipo}>
                {formaPago.descripcion}
              </option>
            ))}
          </Input>
          <br />
          <Label> Importe </Label>
          <Input type="number" onChange={handleFormaPagoTemporal} value={dataArregloTemporal.importe} name={"importe"}></Input>
          <br />
          {dataArregloTemporal.formaPago == 90 ||
            dataArregloTemporal.formaPago == 91 ||
            dataArregloTemporal.formaPago == 80 ||
            dataArregloTemporal.formaPago == 92 ? (
            <>
              <Label> Referencia </Label>
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
            }}
            text="Salir"
          />
          <CButton
            color="success"
            onClick={() => {
              console.log(dataArregloTemporal);
              // Validación de campos
              if (!dataArregloTemporal.formaPago || dataArregloTemporal.formaPago === 0) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Por favor, seleccione una forma de pago.",
                });
                return;
              } else if (!dataArregloTemporal.importe || dataArregloTemporal.importe <= 0) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Por favor, ingrese un importe válido.",
                });
                return;
              } else if (dataArregloTemporal.formaPago != 11 && !dataArregloTemporal.referencia) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Por favor, ingrese una referencia.",
                });
                return;
              } else {
                console.log(dataArregloTemporal);
                // AAQUI TENGO LOS INSERTS
                if (
                  Number(dataArregloTemporal.formaPago) === 90 ||
                  Number(dataArregloTemporal.formaPago) === 91 ||
                  Number(dataArregloTemporal.formaPago) === 92
                ) {
                  setFormPago({ ...formPago, tc: Number(formPago.tc) + Number(dataArregloTemporal.importe) });
                } else if (Number(dataArregloTemporal.formaPago) === 11) {
                  setFormPago({ ...formPago, efectivo: Number(dataArregloTemporal.importe) });
                }
                setArregloTemporal([...arregloTemporal, dataArregloTemporal]);

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
            <h3>Venta edicion</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Producto/servicio:</Label>
          <Row>
            <Col>
              <Input disabled value={dataVentaEdit.d_producto ? dataVentaEdit.d_producto : ""} />
            </Col>
            <Col md={2}>
              <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
            </Col>
          </Row>
          <br />
          <Label>Encargado:</Label>
          <Row>
            <Col>
              <Input disabled value={dataVentaEdit.d_estilista ? dataVentaEdit.d_estilista : ""} />
            </Col>
            <Col md={2}>
              <Button
                onClick={() => {
                  setModalOpen2(true);
                  setFlagEstilistas(false);
                }}
              >
                Elegir
              </Button>
            </Col>
          </Row>
          <br />
          {dataVentaEdit.Observacion === "SERV" ? (
            <>
              <Label>Estilista auxilliar:</Label>
              <Row>
                <Col xs={9}>
                  <Input disabled value={dataVentaEdit.d_estilistaAuxilliar ? dataVentaEdit.d_estilistaAuxilliar : ""} />
                </Col>
                <Col xs={1}>
                  <Button color="danger" onClick={() => setDataVentaEdit({ ...dataVentaEdit, idestilistaAux: 0, d_estilistaAuxilliar: "" })}>
                    <AiFillDelete></AiFillDelete>
                  </Button>
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => {
                      setModalOpen2(true);
                      setFlagEstilistas(true);
                    }}
                  >
                    Elegir
                  </Button>
                </Col>
              </Row>
            </>
          ) : null}
          <br />
          <Row>
            <Col>
              <Label>Cantidad en existencia: </Label>
              <Input disabled placeholder="Cantidad en existencia" onChange={cambiosEdit} name="d_existencia" value={dataVentaEdit.d_existencia} />
            </Col>
            <Col>
              <Label>Precio:</Label>
              <Input
                disabled
                placeholder="Precio"
                onChange={cambiosEdit}
                name="Precio"
                value={dataVentaEdit.Precio ? "$" + dataVentaEdit.Precio.toFixed(2) : 0}
              />
            </Col>

            <Col>
              <Label>Cantidad a vender:</Label>
              <Input placeholder="Cantidad" onChange={cambiosEdit} name="Cant_producto" value={dataVentaEdit.Cant_producto} />
            </Col>
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

          <Label style={{ marginRight: 10 }}>Hora de servicio:</Label>
          <select id="hora" name="hora" onChange={cambiosEdit} value={dataVentaEdit.hora}>
            {generarOpcionesDeTiempo()}
          </select>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpenVentaEdit(false);
              setDescuento({ min: 0, max: 0 });
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
            Editar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen} toggle={toggleModalHistorial} fullscreen>
        <ModalHeader toggle={toggleModalHistorial}>Historial </ModalHeader>
        <ModalBody>
          <MaterialReactTable
            columns={cHistorial}
            data={datah}
            initialState={{
              pagination: {
                pageSize: 5,
                pageIndex: 0,
              },
              density: "compact",
            }}
          // renderDetailPanel={renderDetailPanel} // Pasar la función renderDetailPanel como prop
          />
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
              <thead >
                <tr>
                  <th><p><strong>Fecha:</strong> {paramsDetalles.fecha.split("T")[0]}</p></th>
                  <th><p><strong>No. Venta: </strong>{paramsDetalles.numVenta}</p></th>
                  <th><p><strong>Sucursal:</strong> {paramsDetalles.sucursal}</p></th>
                </tr>
              </thead>
            </Table>
            <Table>
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {historialDetalle.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Insumo}</td>
                    <td>{item.Cant}</td>
                    <td>$ 10.00</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div>
              <p style={{ textAlign: "left" }}>
                <strong>Total: $20.00</strong>
              </p>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* 
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} size="lg">
        <ModalHeader toggle={handleCloseModal}>Historial Detalle</ModalHeader>
        <ModalBody>
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            {historialDetalle.map((item, index) => (
              <div key={index}>
                <Table borderless>
                  <thead>
                    <tr>
                      <th>Fecha: {item.Fecha}</th>
                      <th>Número de Venta: {item.NumVenta}</th>
                      <th>Sucursal: {item.Sucursal}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Insumo: {item.Insumo}</td>
                      <td>Cantidad: {item.Cant}</td>
                      <td>Precio $</td>
                    </tr>
                  </tbody>
                </Table> */}
      {/* <p>Fecha: {item.Fecha}</p>
                <p>Número de Venta: {item.NumVenta}</p>
                <p>Sucursal: {item.Sucursal}</p>
                <p>Estilista: {item.Estilista}</p>
                <p>Servicio: {item.Servicio}</p>
                <p></p>
                <p>Cantidad: {item.Cant}</p>
                <hr /> */}
      {/* </div>
            ))}
          </div>
        </ModalBody>
      </Modal> */}
    </>
  );
};

export default Ventas;
