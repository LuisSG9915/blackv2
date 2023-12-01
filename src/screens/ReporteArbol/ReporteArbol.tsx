import React, { useState, useEffect, useMemo } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import numeral from "numeral";
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Container,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  UncontrolledAccordion,
} from "reactstrap";
import { AiFillFileExcel, AiOutlineFileExcel, AiOutlineFileText } from "react-icons/ai";
import "../../../css/reportes.css";
import { ExportToCsv } from "export-to-csv";
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from "material-react-table";
import { Padding } from "@mui/icons-material";
import { jezaApi } from "../../api/jezaApi";
import { useCias } from "../../hooks/getsHooks/useCias";
import { useClientes } from "../../hooks/getsHooks/useClientes";
import { useUsuarios } from "../../hooks/getsHooks/useUsuarios";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Box } from "@mui/material";
import Swal from "sweetalert2";
import { set } from "date-fns";
import { useAreas } from "../../hooks/getsHooks/useAreas";
import { useDeptos } from "../../hooks/getsHooks/useDeptos";
import { useFormasPagos } from "../../hooks/getsHooks/useFormasPagos";
import { Departamento } from "../../models/Departamento";
import { Clase } from "../../models/Clase";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useProductosFiltradoExistenciaProductoAlm } from "../../hooks/getsHooks/useProductosFiltradoExistenciaProductoAlm";
import { UserResponse } from "../../models/Home";
import { ALMACEN } from "../../utilities/constsAlmacenes";

import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SvgMore from "@mui/icons-material/ExpandMore";

export type Person = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  subRows?: Person[]; //Each person can have sub rows of more people
};

export const dataArbol: Person[] = [
  {
    nombre: "Alex",
    genero: "Masculino",
    edad: 23,
    escolaridad: {
      curso: 2,
      promedio: 8.5,
      materias: {
        espanol: 10,
        matematicas: 9,
        ciencia: 8,
      },
    },
  },
];

function reporteArbol() {
  const [reportes, setReportes] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [data, setData] = useState<ReporteTool[]>([]);
  const { dataCias, fetchCias } = useCias();
  const { dataAreas, fetchAreas1 } = useAreas();
  const { dataDeptos, fetchAreas } = useDeptos();
  const { dataFormasPagos, fetchFormasPagos } = useFormasPagos();
  const { dataUsuarios, fetchUsuarios } = useUsuarios();

  const { dataClientes, fetchClientes, setDataClientes } = useClientes();
  const { dataSucursales, fetchSucursales } = useSucursales();
  const [modalOpenCli, setModalOpenCli] = useState(false);
  const [selectedIdC, setSelectedIdC] = useState("");
  const [descuento, setDescuento] = useState("");
  const [nprod, setNprod] = useState([]);
  const [marca, setMarca] = useState([]);
  const [almacen, setAlmacen] = useState([]);
  const [selectedName, setSelectedName] = useState(""); // Estado para almacenar el nombre seleccionados
  const [trabajador, setTrabajadores] = useState([]);

  const [showClienteInput, setShowClienteInput] = useState(false);
  const [showSucursalInput, setShowSucursalInput] = useState(false);
  const [showEstilistaInput, setShowEstilistaInput] = useState(false);
  const [showProductoInput, setShowProductoInput] = useState(false);
  const [showMarcaInput, setShowMarcaInput] = useState(false);
  const [showAlmacenInput, setShowAlmacenInput] = useState(false);
  const [showEmpresaInput, setShowEmpresaInput] = useState(false);
  const [showSucDesInput, setShowSucDesInput] = useState(false);
  const [showAlmOrigenInput, setShowAlmOrigenInput] = useState(false);
  const [showAlmDestInput, setShowAlmDestInput] = useState(false);
  const [showTipoMovtoInput, setShowTipoMovtoInput] = useState(false);
  const [showNoVentaInput, setShowNoVentaInput] = useState(false);
  const [showProveedorInput, setShowProveedorInput] = useState(false);
  const [showMetodoPagoInput, setShowMetodoPagoInput] = useState(false);
  const [showClaveProdInput, setShowClaveProdInput] = useState(false);
  const [showPalabraProdInput, setShowPalabraProdInput] = useState(false);
  const [showTipoDescuentoInput, setShowTipoDescuentoInput] = useState(false);
  const [showAreaInput, setShowAreaInput] = useState(false);
  const [showDeptoInput, setShowDeptoInput] = useState(false);
  const [showf1, setShowf1] = useState(false);
  const [showf2, setShowf2] = useState(false);
  const [showAñoInput, setShowAñoInput] = useState(false);
  const [showMesInput, setShowMesInput] = useState(false);
  const [dataDeptosFiltrado, setDataDeptosFiltrado] = useState<Departamento[]>([]);

  const { filtroSeguridad, session } = useSeguridad();
  const [showView, setShowView] = useState(true);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  const [DatosSumados, setDatosSumados] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  const [columnaSumas, setColumnaSumas] = useState({}); // Estado para las sumas individuales de las columnas

  // En el useEffect donde calculas la suma de las columnas
  useEffect(() => {
    const sumatoria = calcularSumatoriaDinamica(reportes);
    console.log("Sumatoria dinámica:", sumatoria);
    setDatosSumados(sumatoria); // Actualiza el estado DatosSumados

    // Calcula y actualiza las sumas individuales de las columnas
    const nuevasColumnaSumas = {};
    Object.entries(sumatoria).forEach(([columna, valor]) => {
      nuevasColumnaSumas[columna] = valor;
    });
    setColumnaSumas(nuevasColumnaSumas);
  }, [reportes]);

  // Función para calcular la sumatoria de manera dinámica
  function calcularSumatoriaDinamica(data) {
    const sumatoria = {};

    // Itera sobre las filas de datos
    data.forEach((row) => {
      // Itera sobre las columnas de cada fila
      for (const key in row) {
        if (row.hasOwnProperty(key) && typeof row[key] === "number") {
          // Verifica si la columna es numérica y suma los valores
          if (!sumatoria[key]) {
            sumatoria[key] = 0;
          }
          sumatoria[key] += row[key];
        }
      }
    });

    return sumatoria;
  }

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      setFormulario1(parsedItem[0]?.sucursal.toString());

      // Llamar a getPermisoPantalla después de que los datos se hayan establecido
      getPermisoPantalla(parsedItem);
    }
  }, []);

  const getPermisoPantalla = async (userData) => {
    try {
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_RepTool_view`);

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

  const [tablaData, setTablaData] = useState({
    data: [],
    columns: [],
  });

  const [formClase, setClase] = useState<Clase>({
    id: 0,
    clase: 0,
    area: 1,
    d_area: "",
    depto: 1,
    d_depto: "",
    descripcion: "",
  });

  useEffect(() => {
    const quePedo = dataDeptos.filter((data) => data.area === Number(formClase.area));
    setDataDeptosFiltrado(quePedo);

    // Si el área es 0, establece el departamento como 0
    if (formClase.area === "0") {
      setClase((prevState) => ({ ...prevState, depto: "0" }));
    }
  }, [formClase.area]);

  const getDescuento = () => {
    jezaApi
      .get("/TipodescuentoGeneral?id=0")
      .then((response) => {
        setDescuento(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getDescuento();
  }, []);

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

  const getReporte = () => {
    jezaApi
      .get("/Reporte")
      .then((response) => setData(response.data))
      .catch((e) => console.log(e));
  };

  const getCias = () => {
    jezaApi
      .get("/Cia?=0")
      .then((response) => setData(response.data))
      .catch((e) => console.log(e));
  };

  const getArea = () => {
    jezaApi
      .get("/Area?area=0")
      .then((response) => setData(response.data))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getReporte();
  }, []);

  const handleChangeAreaDeptoClase = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setClase((prevState) => ({ ...prevState, [name]: value }));
    // console.log(formClase);
  };

  const [descripcionReporte, setDescripcionReporte] = useState("Seleccione un reporte");

  const ejecutaReporte = (reporte) => {
    // Copiamos el formulario actual para no modificar el estado original

    const formData = { ...formulario };

    // Reemplazamos los campos vacíos con '%'
    for (const campo in formData) {
      if (formData[campo] === "" || formData[campo] === 0) {
        formData[campo] = "%";
      }
    }
    for (const campos in formClase) {
      if (formClase[campos] == 0) {
        formClase[campos] = "%";
      }
    }

    if (reporte === "") {
      Swal.fire("", "Debe seleccionar un tipo de reporte", "info");
      return;
    }

    let queryString = "";
    if (reporte == "sp_reporte5_Ventas") {
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&cia=${26}&suc=${
        formData.sucursal
      }&clave_prod=${formClase.area}&tipoDescuento=${formData.tipoDescuento}&estilista=${formData.estilista}&tipoPago=${
        formData.tipoPago
      }`;
    } else if (reporte == "sp_reporte4_Estilistas") {
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&estilista=${formData.estilista}&suc=${formData.sucursal}&area=${formClase.area}&depto=${formClase.depto}`;
    } else if (reporte == "sp_repoComisiones1") {
      queryString = `/${reporte}?suc=${formData.sucursal}&f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&estilista=${formData.estilista}`;
    } else if (reporte == "TicketInsumosEstilsta") {
      //---------------------
      queryString = `/${reporte}?cia=${26}&sucursal=${formData.sucursal}&f1=${formData.fechaInicial}&f2=${
        formData.fechaFinal
      }&estilista=${formData.estilista}&cte=${formData.cliente}&noVenta=${formData.noVenta}`;
    } else if (reporte == "sp_reporteinventario") {
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&suc=${formData.sucursal}&almacen=${formData.almacen}&marca=${formData.marca}&tipoProducto=%&palabra=%&claveProd=${formData.clave_prod}`;
    } else if (reporte == "sp_reporteCifrasEmpleado") {
      queryString = `/${reporte}?año=${formData.año}&mes=${formData.mes}&sucursal=${formData.sucursal}`;
    } else if (reporte == "sp_reporteCifras") {
      queryString = `/${reporte}?año=${formData.año}&mes=${formData.mes}&sucursal=${formData.sucursal}`;
    } else {
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&cia=${26}&suc=${
        formData.sucursal
      }&cliente=${formData.cliente}&estilista=${formData.estilista}`;
    }

    jezaApi

      .get(queryString)
      .then((response) => response.data)
      .then((responseData) => {
        // Buscar el objeto que corresponde al valor seleccionado en el input select
        const selectedReporte = data.find((item) => item.metodoApi === reporte);

        if (selectedReporte) {
          // Si se encuentra el objeto, actualizar la descripción en el estado
          setDescripcionReporte(selectedReporte.descripcion);
        } else {
          // Si no se encuentra el objeto, mostrar el mensaje predeterminado
          setDescripcionReporte("Seleccione un reporte");
        }
        setReportes(responseData);
        setTablaData({
          data: responseData,
          columns: responseData.length > 0 ? Object.keys(responseData[0]) : [],
        });
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  };

  const handleExportData = (descripcionReporte: string) => {
    // Verificar si reportes contiene datos
    if (reportes.length > 0) {
      // Obtener los nombres de las columnas de la primera fila de datos (asumiendo que todas las filas tienen las mismas columnas)
      const columnHeaders = Object.keys(reportes[0]);

      // Función para reemplazar valores nulos o vacíos con un valor predeterminado
      const replaceNullOrEmpty = (value, defaultValue = "") => {
        return value === null || value === undefined || value === "" ? defaultValue : value;
      };

      // Función para calcular la suma de la columna "Total" si existe
      const sumTotalColumn = () => {
        if (columnHeaders.includes("Total")) {
          return reportes.reduce((total, row) => {
            const totalValue = parseFloat(replaceNullOrEmpty(row["Total"], "0")); // Convierte a número y maneja valores nulos o vacíos como 0
            return total + totalValue;
          }, 0);
        } else {
          return 0;
        }
      };

      // Calcular la suma de la columna "Total"
      const totalSum = sumTotalColumn();

      // Mapear los datos y aplicar la función de reemplazo y formato de fecha
      const formattedData = reportes.map((row) => {
        const formattedRow = {};
        columnHeaders.forEach((header) => {
          if (header === "Fecha" || header === "fechaCita") {
            // Formatear la fecha en formato DD/MM/AAAA si es una columna de fecha
            formattedRow[header] = row[header] ? formatDate(new Date(row[header])) : "";
          } else {
            formattedRow[header] = replaceNullOrEmpty(row[header], "");
          }
        });
        return formattedRow;
      });

      // Función para formatear la fecha como DD/MM/AAAA
      function formatDate(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

      if (totalSum > 0) {
        const totalRow = {};
        const linea = "_";
        columnHeaders.forEach((header) => {
          if (header === "Total") {
            formattedData.push({ linea });
            totalRow[header] = totalSum.toString(); // Agregar la suma de la columna "Total"
          } else {
            totalRow[header] = ""; // Dejar todas las demás columnas en blanco
          }
        });
        formattedData.push(totalRow);
      }

      const csvOptions = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columnHeaders, // Utiliza los nombres de columnas originales
        filename: `${descripcionReporte}`,
        title: { display: true, title: descripcionReporte }, // Agrega el título del reporte
        useTitleAsFileName: true, // Utiliza el título como nombre de archivo
      };

      const csvExporter = new ExportToCsv(csvOptions);
      csvExporter.generateCsv(formattedData);
    } else {
      Swal.fire("", "No hay datos para exportar", "info");
    }
  };

  // Filtrar los datos para excluir la columna "id" y sus valores
  const filteredData = reportes.map(({ id, ...rest }) => rest);

  const columns = columnas.map((col) => ({
    ...col,
    size: "flex",
  }));

  // toma de los datos que usaremos para imprimir cadena:
  const [formulario, setFormulario] = useState({
    reporte: "",
    fechaInicial: "",
    fechaFinal: "",
    sucursal: "",
    compania: "",
    cliente: "",
    almacen: "",
    tipoMovimiento: "",
    proveedor: "",
    estilista: "",
    metodoPago: "",
    empresa: "",
    sucursalDestino: "",
    almacenDestino: "",
    clave_prod: "",
    tipoDescuento: "",
    tipoPago: "",
    area: "",
    depto: "",
    cve_prod: "",
    marca: "",
    palabra: "",
    noVenta: "",
    año: "",
    mes: "",
  });

  function setShowAllInputsToFalse() {
    setShowClienteInput(false);
    setShowSucursalInput(false);
    setShowEstilistaInput(false);
    setShowEmpresaInput(false);
    setShowSucDesInput(false);
    setShowAlmOrigenInput(false);
    setShowAlmDestInput(false);
    setShowTipoMovtoInput(false);
    setShowProveedorInput(false);
    setShowMetodoPagoInput(false);
    setShowClaveProdInput(false);
    setShowTipoDescuentoInput(false);
    setShowAreaInput(false);
    setShowDeptoInput(false);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));

    setFormulario1({ ...formulario, [name]: value });

    if (name === "reporte") {
      if (value === "RepVtaSucEstilista" || value === "RepVtaDetalle" || value === "RepVtaSucFecha") {
        // Mostrar los campos para estos informes

        setShowSucursalInput(true);
        setShowClienteInput(true);
        setShowEstilistaInput(true);
        setShowf1(true);
        setShowf2(true);
        //------------------------------------
        setShowSucDesInput(false);
        setShowAlmOrigenInput(false);
        setShowAlmDestInput(false);
        setShowTipoMovtoInput(false);
        setShowProveedorInput(false);
        setShowMetodoPagoInput(false);
        setShowClaveProdInput(false);
        setShowTipoDescuentoInput(false);
        setShowAreaInput(false);
        setShowDeptoInput(false);
        setShowMarcaInput(false);
        setShowProductoInput(false);
        setShowAlmacenInput(false);
        setShowPalabraProdInput(false);
        setShowNoVentaInput(false);
        setShowEmpresaInput(false);
        setShowMesInput(false);
        setShowAñoInput(false);
      } else if (value === "sp_reporte5_Ventas") {
        setShowSucursalInput(true);

        setShowTipoDescuentoInput(true);
        setShowEstilistaInput(true);
        setShowMetodoPagoInput(true);
        setShowAreaInput(true);
        setShowf1(true);
        setShowf2(true);
        //----------------------------------------------------------------
        setShowEmpresaInput(false);
        setShowClaveProdInput(false);
        setShowClienteInput(false);
        setShowSucDesInput(false);
        setShowAlmOrigenInput(false);
        setShowAlmDestInput(false);
        setShowTipoMovtoInput(false);
        setShowProveedorInput(false);
        setShowMarcaInput(false);
        setShowDeptoInput(false);
        setShowProductoInput(false);
        setShowAlmacenInput(false);
        setShowNoVentaInput(false);
        setShowPalabraProdInput(false);
        setShowMesInput(false);
        setShowAñoInput(false);
        //sp_repoComisiones1
      } else if (value === "sp_repoComisiones1") {
        //f1- f2 -suc-estilista

        setShowSucursalInput(true);
        setShowEstilistaInput(true);
        setShowf1(true);
        setShowf2(true);
        //----------------------------------------------------------------
        setShowTipoDescuentoInput(false);

        setShowMetodoPagoInput(false);
        setShowAreaInput(false);
        setShowEmpresaInput(false);
        setShowClaveProdInput(false);
        setShowClienteInput(false);
        setShowSucDesInput(false);
        setShowAlmOrigenInput(false);
        setShowAlmDestInput(false);
        setShowTipoMovtoInput(false);
        setShowProveedorInput(false);
        setShowMarcaInput(false);
        setShowProductoInput(false);
        setShowDeptoInput(false);
        setShowAlmacenInput(false);
        setShowNoVentaInput(false);
        setShowPalabraProdInput(false);
        setShowMesInput(false);
        setShowAñoInput(false);
      } else if (value === "sp_reporte4_Estilistas") {
        setShowf1(true);
        setShowf2(true);
        setShowEstilistaInput(true);
        setShowSucursalInput(true);
        setShowAreaInput(true);
        setShowDeptoInput(true);
        setShowMarcaInput(false);
        //------------------------------------------------------
        setShowClienteInput(false);
        setShowEmpresaInput(false);
        setShowSucDesInput(false);
        setShowAlmOrigenInput(false);
        setShowAlmDestInput(false);
        setShowTipoMovtoInput(false);
        setShowProveedorInput(false);
        setShowMetodoPagoInput(false);
        setShowClaveProdInput(false);
        setShowTipoDescuentoInput(false);
        setShowProductoInput(false);
        setShowAlmacenInput(false);
        setShowPalabraProdInput(false);
        setShowNoVentaInput(false);
        setShowMesInput(false);
        setShowAñoInput(false);
      } else if (value === "sp_reporteinventario") {
        //f1☻,f2☻,suc☻,almacen☻,marca,tipoProd,palabra,cveProd☻
        setShowf1(true);
        setShowf2(true);
        setShowSucursalInput(true);
        setShowAlmOrigenInput(true);
        setShowAlmacenInput(true);
        setShowProductoInput(true);
        setShowMarcaInput(true);
        setShowPalabraProdInput(false);
        //------------------------------------------------------
        setShowClaveProdInput(false);
        setShowEstilistaInput(false);
        setShowSucDesInput(false);
        setShowClienteInput(false);
        setShowEmpresaInput(false);
        setShowSucDesInput(false);
        setShowAlmOrigenInput(false);
        setShowAlmDestInput(false);
        setShowTipoMovtoInput(false);
        setShowProveedorInput(false);
        setShowMetodoPagoInput(false);
        setShowNoVentaInput(false);
        setShowTipoDescuentoInput(false);
        setShowAreaInput(false);
        setShowDeptoInput(false);
        setShowMesInput(false);
        setShowAñoInput(false);
      } else if (value === "TicketInsumosEstilsta") {
        //f1☻,f2☻,suc☻,almacen☻,marca,tipoProd,palabra,cveProd☻
        setShowf1(true);
        setShowf2(true);
        setShowSucursalInput(true);
        setShowClienteInput(true);
        setShowEstilistaInput(true);
        setShowNoVentaInput(true);
        //------------------------------------------------------
        setShowAlmOrigenInput(false);
        setShowClaveProdInput(false);
        setShowMarcaInput(false);
        setShowPalabraProdInput(false);
        setShowSucDesInput(false);
        setShowProductoInput(false);
        setShowEmpresaInput(false);
        setShowSucDesInput(false);
        setShowAlmOrigenInput(false);
        setShowAlmDestInput(false);
        setShowTipoMovtoInput(false);
        setShowProveedorInput(false);
        setShowMetodoPagoInput(false);
        setShowAlmacenInput(false);
        setShowTipoDescuentoInput(false);
        setShowAreaInput(false);
        setShowDeptoInput(false);
        setShowMesInput(false);
        setShowAñoInput(false);
      } else if (value === "sp_reporteCifrasEmpleado" || value === "sp_reporteCifras") {
        // Mostrar los campos para estos informes

        setShowSucursalInput(true);
        setShowMesInput(true);
        setShowAñoInput(true);

        //------------------------------------
        setShowSucDesInput(false);
        setShowAlmOrigenInput(false);
        setShowAlmDestInput(false);
        setShowTipoMovtoInput(false);
        setShowProveedorInput(false);
        setShowMetodoPagoInput(false);
        setShowClaveProdInput(false);
        setShowTipoDescuentoInput(false);
        setShowAreaInput(false);
        setShowDeptoInput(false);
        setShowMarcaInput(false);
        setShowProductoInput(false);
        setShowAlmacenInput(false);
        setShowPalabraProdInput(false);
        setShowNoVentaInput(false);
        setShowEmpresaInput(false);
        setShowClienteInput(false);
        setShowEstilistaInput(false);
        setShowf1(false);
        setShowf2(false);
      } else {
        setShowClienteInput(false);
        setShowSucursalInput(false);
        setShowEstilistaInput(false);
        setShowEmpresaInput(false);
        setShowSucDesInput(false);
        setShowAlmOrigenInput(false);
        setShowAlmDestInput(false);
        setShowTipoMovtoInput(false);
        setShowProveedorInput(false);
        setShowMetodoPagoInput(false);
        setShowClaveProdInput(false);
        setShowTipoDescuentoInput(false);
        setShowAreaInput(false);
        setShowDeptoInput(false);
        setShowMarcaInput(false);
        setShowProductoInput(false);
        setShowAlmacenInput(false);
        setShowPalabraProdInput(false);
        setShowNoVentaInput(false);
        setShowMesInput(false);
        setShowAñoInput(false);
        setShowf1(false);
        setShowf2(false);
      }
      // Agrega lógica similar para otros campos según sea necesario
    }
  };

  const handleConsultar = (reporte) => {
    ejecutaReporte(reporte);
  };

  const handleModalSelect = async (id_cliente: number, name: string) => {
    setSelectedIdC(id_cliente);
    setFormulario({
      ...formulario,
      cliente: id_cliente, // O formulario.cliente: name si deseas guardar el nombre
    });
    setSelectedName(name);
    cerrarModal();
  };

  // Función para abrir el modal
  const abrirModal = () => {
    setModalOpenCli(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalOpenCli(false);
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

  const [formulario1, setFormulario1] = useState({
    sucursal: "", // El valor inicial de la sucursal
    // Otras propiedades de tu formulario
  });
  const { dataProductos4 } = useProductosFiltradoExistenciaProductoAlm({
    almacen: ALMACEN.VENTAS,
    cia: dataUsuarios2[0]?.idCia,
    descripcion: "%",
    idCliente: 26296,
    insumo: 2,
    inventariable: 2,
    obsoleto: 2,
    servicio: 2,
    sucursal: dataUsuarios2[0]?.sucursal,
  });

  const getProductos = () => {
    jezaApi
      .get(
        `/sp_cPSEAC?id=0&descripcion=%&verinventariable=2&esServicio=0&esInsumo=0&obsoleto=0&marca=%&cia=26&sucursal=${formulario1}&almacen=3&idCliente=26296`
      )
      .then((response) => {
        setNprod(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    // Llama a getProductos cuando cambie el valor de formulario.sucursal
    if (formulario1 && Number(formulario1) > 0) {
      getProductos();
    }
  }, [formulario1.sucursal]);
  const getMarca = () => {
    jezaApi
      .get("/Marca?id=0")
      .then((response) => {
        setMarca(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getMarca();
  }, []);
  const getAlmacen = () => {
    jezaApi
      .get("/Almacen?id=0")
      .then((response) => {
        setAlmacen(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getAlmacen();
  }, []);

  const optionsProductos = [
    { value: "", label: "--Selecciona un Producto--" },
    ...dataProductos4.map((item) => ({
      value: String(item.id),
      label: item.descripcion,
    })),
  ];
  const optionsAlmacen = [
    { value: "", label: "--Selecciona un Almacen--" },
    ...almacen.map((item) => ({
      value: String(item.id),
      label: item.descripcion,
    })),
  ];
  const optionsMarca = [
    { value: "", label: "--Selecciona una Marca--" },
    ...marca.map((item) => ({
      value: Number(item.id),
      label: item.marca,
    })),
  ];

  const optionsEstilista = [
    { value: "", label: "--Selecciona un Estilista--" },
    ...dataUsuarios.map((item) => ({
      value: Number(item.id),
      label: item.nombre,
    })),
  ];

  const [expandedRows, setExpandedRows] = useState([]);

  const handleExpand = (index) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = [...prevExpandedRows];
      // Invierte el estado del nivel actual
      newExpandedRows[index] = !newExpandedRows[index];
      return newExpandedRows;
    });
  };

  const sampleData = [
    {
      date: "2023-01-01",
      client: "John Doe",
      totalSale: "$100.00",
      paymentMethod: "Credit Card",
      expandedData: [
        {
          product: "Product 1",
          quantity: 2,
          price: "$50.00",
          priceInsumo: "$10.00",
          auxiliar: "Aux 1",
          promoDiscount: "10%",
        },
        // Add more entries as needed
      ],
      secondLevelData: [
        {
          branch: "Branch 1",
          date: "2023-01-01",
          client: "Jane Doe",
          stylist: "Stylist 1",
          product: "Product 1",
          quantity: 1,
          price: "$30.00",
          priceInsumo: "$5.00",
          auxiliar: "Aux 2",
          promoDiscount: "5%",
        },
        // Add more entries as needed
      ],
      thirdLevelData: [
        {
          store: "Store X",
          date: "2023-01-01",
          client: "Jane Doe",
          stylist: "Stylist 1",
          product: "Product 1",
          quantity: 1,
          price: "$30.00",
          priceInsumo: "$5.00",
          auxiliar: "Aux 2",
          promoDiscount: "5%",
        },
        // Add more entries as needed
      ],
    },
    {
      date: "2023-01-02",
      client: "Alice Smith",
      totalSale: "$120.00",
      paymentMethod: "Cash",
      expandedData: [
        {
          product: "Product 2",
          quantity: 3,
          price: "$60.00",
          priceInsumo: "$15.00",
          auxiliar: "Aux 3",
          promoDiscount: "15%",
        },
        // Add more entries as needed
      ],
      secondLevelData: [
        {
          branch: "Branch 2",
          date: "2023-01-02",
          client: "Bob Johnson",
          stylist: "Stylist 2",
          product: "Product 2",
          quantity: 2,
          price: "$40.00",
          priceInsumo: "$8.00",
          auxiliar: "Aux 4",
          promoDiscount: "8%",
        },
        // Add more entries as needed
      ],
      thirdLevelData: [
        {
          store: "Store Y",
          date: "2023-01-02",
          client: "Charlie Brown",
          stylist: "Stylist 2",
          product: "Product 2",
          quantity: 1,
          price: "$20.00",
          priceInsumo: "$4.00",
          auxiliar: "Aux 5",
          promoDiscount: "4%",
        },
        // Add more entries as needed
      ],
    },
    // Add more elements as needed
    {
      date: "2023-01-03",
      client: "Eva Green",
      totalSale: "$80.00",
      paymentMethod: "Debit Card",
      expandedData: [
        {
          product: "Product 3",
          quantity: 1,
          price: "$40.00",
          priceInsumo: "$8.00",
          auxiliar: "Aux 6",
          promoDiscount: "20%",
        },
        // Add more entries as needed
      ],
      secondLevelData: [
        {
          branch: "Branch 3",
          date: "2023-01-03",
          client: "David White",
          stylist: "Stylist 3",
          product: "Product 3",
          quantity: 3,
          price: "$30.00",
          priceInsumo: "$6.00",
          auxiliar: "Aux 7",
          promoDiscount: "12%",
        },
        // Add more entries as needed
      ],
      thirdLevelData: [
        {
          store: "Store Z",
          date: "2023-01-03",
          client: "Frank Black",
          stylist: "Stylist 3",
          product: "Product 3",
          quantity: 2,
          price: "$30.00",
          priceInsumo: "$6.00",
          auxiliar: "Aux 8",
          promoDiscount: "8%",
        },
        // Add more entries as needed
      ],
    },
    // Add more elements as needed
  ];

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <h1>
            Reportes <AiOutlineFileText size={30} />
          </h1>
        </div>
        <table border="5">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Venta Total</th>
              <th>Método Pago</th>
              <th>Expandir</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((sale, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{sale.date}</td>
                  <td>{sale.client}</td>
                  <td>{sale.totalSale}</td>
                  <td>{sale.paymentMethod}</td>
                  <td>
                    <button onClick={() => handleExpand(index)}>Expandir Nivel 2</button>
                  </td>
                </tr>
                {expandedRows[index] && (
                  <tr>
                    <td colSpan="4">
                      <table border="1">
                        <thead>
                          <tr>
                            <th>Producto/Servicio</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Precio Insumo</th>
                            <th>Auxiliar</th>
                            <th>Promoción/Descuento</th>
                            <th>Expandir</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Agregar más datos de segundo nivel según sea necesario */}
                          <tr>
                            <td>Product 1</td>
                            <td>2</td>
                            <td>$50.00</td>
                            <td>$10.00</td>
                            <td>Aux 1</td>
                            <td>10%</td>
                            <td>
                              <button onClick={() => handleExpand(index + 1)}>Expandir Nivel 3</button>
                            </td>
                          </tr>
                          {expandedRows[index + 1] && (
                            <tr>
                              <td colSpan="6">
                                <table border="1">
                                  <thead>
                                    <tr>
                                      <th>Sucursal</th>
                                      <th>Fecha</th>
                                      <th>Cliente</th>
                                      <th>Estilista</th>
                                      <th>Producto/servicio</th>
                                      <th>Cantidad</th>
                                      <th>Precio</th>
                                      <th>Precio insumo</th>
                                      <th>Auxiliar</th>
                                      <th>Promo/descuento</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* Agregar más datos de tercer nivel según sea necesario */}
                                    <tr>
                                      <td>Store X</td>
                                      <td>2023-01-01</td>
                                      <td>Jane Doe</td>
                                      <td>Stylist 1</td>
                                      <td>Product 1</td>
                                      <td>1</td>
                                      <td>$30.00</td>
                                      <td>$5.00</td>
                                      <td>Aux 2</td>
                                      <td>5%</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {/* <div className="App">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Venta Total</TableCell>
                  <TableCell>Metodo Pago</TableCell>
                  <TableCell>Expandir</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleData.sales.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.client}</TableCell>
                    <TableCell>{sale.totalSale}</TableCell>
                    <TableCell>{sale.paymentMethod}</TableCell>
                    <TableCell>
                      <IconButton onClick={handleExpand}>
                        <SvgMore />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {expand ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Producto/Servicio</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Precio Insumo</TableCell>
                            <TableCell>Auxiliar</TableCell>
                            <TableCell>Promoción/Descuento</TableCell>
                            <TableCell>Expandir</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sampleData.expandedData.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell>{data.product}</TableCell>
                              <TableCell>{data.quantity}</TableCell>
                              <TableCell>{data.price}</TableCell>
                              <TableCell>{data.priceInsumo}</TableCell>
                              <TableCell>{data.auxiliar}</TableCell>
                              <TableCell>{data.promoDiscount}</TableCell>
                              <TableCell>
                                <IconButton onClick={handleExpandSecondLevel}>
                                  <SvgMore />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                          {expandSecondLevel ? (
                            <TableRow>
                              <TableCell colSpan={6}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Sucursal</TableCell>
                                      <TableCell>Fecha</TableCell>
                                      <TableCell>Cliente</TableCell>
                                      <TableCell>Estilista</TableCell>
                                      <TableCell>Producto/servicio</TableCell>
                                      <TableCell>Cantidad</TableCell>
                                      <TableCell>Precio</TableCell>
                                      <TableCell>Precio insumo</TableCell>
                                      <TableCell>Auxiliar</TableCell>
                                      <TableCell>Promo/descuento</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {sampleData.secondLevelData.map((data, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{data.branch}</TableCell>
                                        <TableCell>{data.date}</TableCell>
                                        <TableCell>{data.client}</TableCell>
                                        <TableCell>{data.stylist}</TableCell>
                                        <TableCell>{data.product}</TableCell>
                                        <TableCell>{data.quantity}</TableCell>
                                        <TableCell>{data.price}</TableCell>
                                        <TableCell>{data.priceInsumo}</TableCell>
                                        <TableCell>{data.auxiliar}</TableCell>
                                        <TableCell>{data.promoDiscount}</TableCell>
                                        <TableCell>
                                          <IconButton onClick={handleExpandSecondLevel}>
                                            <SvgMore />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </Paper>
        </div> */}
      </Container>
    </>
  );
}

export default reporteArbol;
