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

function ReporteTool() {
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

  // const calcularSumatoria = (data) => {
  //   const sumatoria = {};
  //   if (data.length > 0) {
  //     for (const key in data[0]) {
  //       if (!isNaN(data[0][key])) {
  //         sumatoria[key] = data.reduce((total, row) => total + parseFloat(row[key] || 0), 0);
  //       }
  //     }
  //   }
  //   return sumatoria;
  // };

  // useEffect(() => {
  //   getReporte();
  // }, []);

  // const [DatosSumados, setDatosSumados] = useState("");
  // useEffect(() => {
  //   const sumatoria = calcularSumatoria(reportes);
  //   console.log("Sumatoria:", sumatoria); // Muestra la sumatoria en la consola
  //   setDatosSumados(sumatoria);
  // }, [reportes]);

  const [DatosSumados, setDatosSumados] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  const [columnaSumas, setColumnaSumas] = useState({}); // Estado para las sumas individuales de las columnas

  // ...

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
      .get("/Cliente2?id=0")
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

  const ejecutaReporte = async (reporte) => {
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

    // if (
    //   (formData.fechaInicial === "%" && formData.fechaInicial === "%" && reporte != "sp_reporteCifrasEmpleado") ||
    //   (formData.fechaInicial === "%" && formData.fechaInicial === "%" && reporte != "sp_reporteCifras")
    // ) {
    //   Swal.fire("", "Debe seleccionar el rango de fechas", "info");
    //   return;
    // }

    // if (formData.fechaInicial === "%" || formData.fechaInicial === "%") {
    //   Swal.fire("", "Debe seleccionar el rango de fechas", "info");
    //   return;
    // }

    let queryString = "";
    if (reporte == "sp_reporte5_Ventas") {
      const permiso = await filtroSeguridad("REP_VENTAS");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&cia=${26}&suc=${formData.sucursal
        }&clave_prod=${formClase.area}&tipoDescuento=${formData.tipoDescuento}&estilista=${formData.estilista}&tipoPago=${formData.tipoPago
        }`;
    } else if (reporte == "sp_reporte4_Estilistas") {
      const permiso = await filtroSeguridad("REP_ESTILISTAS");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&estilista=${formData.estilista}&suc=${formData.sucursal}&area=${formClase.area}&depto=${formClase.depto}`;
    } else if (reporte == "sp_repoComisiones1") {
      const permiso = await filtroSeguridad("REP_COMISIONES1");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }

      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&estilista=${formData.estilista}&suc=${formData.sucursal}`;
    } else if (reporte == "sp_nominaComision63") {
      const permiso = await filtroSeguridad("REP_COMISIONES1");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }
      queryString = `/${reporte}?suc=${formData.sucursal}&f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&estilista=${formData.estilista}`;
    } else if (reporte == "TicketInsumosEstilsta") {
      const permiso = await filtroSeguridad("REP_TICKET_INSUMOS_ESTILISTA");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }
      queryString = `/${reporte}?cia=${26}&sucursal=${formData.sucursal}&f1=${formData.fechaInicial}&f2=${formData.fechaFinal
        }&estilista=${formData.estilista}&cte=${formData.cliente}&noVenta=${formData.noVenta}`;
    } else if (reporte == "sp_reporteinventario") {
      const permiso = await filtroSeguridad("REP_INVENTARIO");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }

      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&suc=${formData.sucursal}&almacen=${formData.almacen}&marca=${formData.marca}&tipoProducto=%&palabra=%&claveProd=${formData.clave_prod}`;
    } else if (reporte == "sp_reporteCifrasEmpleado") {
      const permiso = await filtroSeguridad("REP_CIFRAS_EMPLEADO");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }
      queryString = `/${reporte}?año=${formData.año}&mes=${formData.mes}&sucursal=${formData.sucursal}`;
    } else if (reporte == "sp_reporteCifras") {
      const permiso = await filtroSeguridad("REP_CIFRAS");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }
      queryString = `/${reporte}?año=${formData.año}&mes=${formData.mes}&sucursal=${formData.sucursal}`;
    } else if (reporte == "sp_reporteCifrasEmpleado_2Extendido") {
      const permiso = await filtroSeguridad("REP_CIFRAS_EXTENDIDO");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }
      queryString = `/${reporte}?año=${formData.año}&mes=${formData.mes}&sucursal=${formData.sucursal}&estilista=${formData.estilista}`;
    } else if (reporte == "RepVtaSucEstilista") {
      const permiso = await filtroSeguridad("REP_VTA_SUC_ESTILISTA");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }

      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&cia=${26}&suc=${formData.sucursal
        }&cliente=${formData.cliente}&estilista=${formData.estilista}`;
    } else if (reporte == "RepVtaDetalle") {
      const permiso = await filtroSeguridad("REP_VTA_DETALLE");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&cia=${26}&suc=${formData.sucursal
        }&cliente=${formData.cliente}&estilista=${formData.estilista}`;
    } else if (reporte == "sp_repoComisionesHoja") {
      const permiso = await filtroSeguridad("RECOMISIONES1");
      if (permiso === false) {
        return; // Si el permiso es falso o los campos no son válidos, se sale de la función
      }
      queryString = `/${reporte}?suc=${formData.sucursal}f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&estilista=${formData.estilista}`;
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

  // const handleExportData = (descripcionReporte: string) => {
  //   // Verificar si reportes contiene datos
  //   if (reportes.length > 0) {
  //     // Obtener los nombres de las columnas de la primera fila de datos (asumiendo que todas las filas tienen las mismas columnas)
  //     const columnHeaders = Object.keys(reportes[0]);

  //     // Función para reemplazar valores nulos o vacíos con un valor predeterminado
  //     const replaceNullOrEmpty = (value, defaultValue = '') => {
  //       return value === null || value === undefined || value === '' ? defaultValue : value;
  //     };

  //     // Mapear los datos y aplicar la función de reemplazo
  //     const formattedData = reportes.map((row) => {
  //       const formattedRow = {};
  //       columnHeaders.forEach((header) => {
  //         formattedRow[header] = replaceNullOrEmpty(row[header]);
  //       });
  //       return formattedRow;
  //     });

  //     const csvOptions = {
  //       fieldSeparator: ",",
  //       quoteStrings: '"',
  //       decimalSeparator: ".",
  //       showLabels: true,
  //       useBom: true,
  //       useKeysAsHeaders: false,
  //       headers: columnHeaders, // Utiliza los nombres de columnas originales
  //       filename: `${descripcionReporte}`,
  //       title: { display: true, title: descripcionReporte }, // Agrega el título del reporte
  //       useTitleAsFileName: true, // Utiliza el título como nombre de archivo
  //     };

  //     const csvExporter = new ExportToCsv(csvOptions);
  //     csvExporter.generateCsv(formattedData);
  //   } else {
  //     Swal.fire("", "No hay datos para exportar", "info");
  //   }
  // };

  // const handleExportData = (descripcionReporte: string) => {
  //   // Verificar si reportes contiene datos
  //   if (reportes.length > 0) {
  //     // Obtener los nombres de las columnas de la primera fila de datos (asumiendo que todas las filas tienen las mismas columnas)
  //     const columnHeaders = Object.keys(reportes[0]);

  //     // Función para reemplazar valores nulos o vacíos con un valor predeterminado
  //     const replaceNullOrEmpty = (value, defaultValue = "") => {
  //       return value === null || value === undefined || value === "" ? defaultValue : value;
  //     };

  //     // Función para calcular la suma de la columna "Total" si existe
  //     const sumTotalColumn = () => {
  //       if (columnHeaders.includes("Total")) {
  //         return reportes.reduce((total, row) => {
  //           const totalValue = parseFloat(replaceNullOrEmpty(row["Total"], "0")); // Convierte a número y maneja valores nulos o vacíos como 0
  //           return total + totalValue;
  //         }, 0);
  //       } else {
  //         return 0;
  //       }
  //     };

  //     // Calcular la suma de la columna "Total"
  //     const totalSum = sumTotalColumn();

  //     // Mapear los datos y aplicar la función de reemplazo
  //     const formattedData = reportes.map((row) => {
  //       const formattedRow = {};
  //       columnHeaders.forEach((header) => {
  //         formattedRow[header] = replaceNullOrEmpty(row[header], "-----");
  //       });
  //       return formattedRow;
  //     });

  //     // Si la suma de la columna "Total" es mayor que cero, agregarla a los datos formateados con una línea divisoria
  //     if (totalSum > 0) {
  //       const totalRow = {};
  //       columnHeaders.forEach((header) => {
  //         totalRow[header] = "----"; // Dejar todos los valores en blanco
  //       });
  //       formattedData.push(totalRow);
  //       formattedData.push({ Total: totalSum.toString() }); // Agregar la suma de la columna "Total"
  //     }

  //     const csvOptions = {
  //       fieldSeparator: ",",
  //       quoteStrings: '"',
  //       decimalSeparator: ".",
  //       showLabels: true,
  //       useBom: true,
  //       useKeysAsHeaders: false,
  //       headers: columnHeaders, // Utiliza los nombres de columnas originales
  //       filename: `${descripcionReporte}`,
  //       title: { display: true, title: descripcionReporte }, // Agrega el título del reporte
  //       useTitleAsFileName: true, // Utiliza el título como nombre de archivo
  //     };

  //     const csvExporter = new ExportToCsv(csvOptions);
  //     csvExporter.generateCsv(formattedData);
  //   } else {
  //     Swal.fire("", "No hay datos para exportar", "info");
  //   }
  // };

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

      // Mapear los datos y aplicar la función de reemplazo
      // const formattedData = reportes.map((row) => {
      //   const formattedRow = {};
      //   columnHeaders.forEach((header) => {
      //     formattedRow[header] = replaceNullOrEmpty(row[header], "");
      //   });
      //   return formattedRow;
      // });

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
      } else if (value === "sp_nominaComision63") {
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
      } else if (value === "sp_reporteCifrasEmpleado_2Extendido") {
        setShowSucursalInput(true);
        setShowMesInput(true);
        setShowAñoInput(true);
        setShowEstilistaInput(true);

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

        setShowf1(false);
        setShowf2(false);
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
      } else if (value === "sp_repoComisionesHoja") {
        // Mostrar los campos para estos informes

        setShowSucursalInput(true);
        setShowf1(true);
        setShowf2(true);
        setShowEstilistaInput(true);
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

        setShowMesInput(false);
        setShowAñoInput(false);
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

  // const optionsPermiso = [
  //   { value: 0, label: "--Selecciona una opción--" },
  //   ...dataModulos.map((modulo: Modulo) => ({
  //     value: Number(modulo.id),
  //     label: modulo.descripcion,
  //   })),
  // ];
  // const optionsEstilista = [
  //   { value: 0, label: "--Selecciona una opción--" },
  //   ...dataUsuarios.map((item) => ({
  //     value: Number(item.id),
  //     label: item.nombre,
  //   })),
  // ];

  // <Select
  //   name="estilista"
  //   options={optionsEstilista}
  //   value={optionsEstilista.find((option) => option.value === formulario.estilista)}
  //   onChange={(selectedOption) => {
  //     // Aquí actualizas el valor en el estado form
  //     setFormulario((prevState) => ({
  //       ...prevState,
  //       estilista: selectedOption ? selectedOption.value : 0, // 0 u otro valor predeterminado
  //     }));
  //   }}
  //   placeholder="--Selecciona una opción--"
  // />;

  // <Input type="select" name="estilista" value={formulario.estilista} onChange={handleChange} bsSize="sm">
  //   <option value="">Seleccione un Estilista</option>

  //   {dataUsuarios.map((item) => (
  //     <option value={item.id}>{item.nombre}</option>
  //   ))}
  // </Input>;

  // <Select
  //   name="modulo"
  //   options={optionsPermiso}
  //   value={optionsPermiso.find((option) => option.value === form.modulo)}
  //   onChange={(selectedOption) => {
  //     // Aquí actualizas el valor en el estado form
  //     setForm((prevState) => ({
  //       ...prevState,
  //       modulo: selectedOption ? selectedOption.value : 0, // 0 u otro valor predeterminado
  //     }));
  //   }}
  //   placeholder="--Selecciona una opción--"
  // />;

  const [formulario1, setFormulario1] = useState({
    sucursal: "", // El valor inicial de la sucursal
    // Otras propiedades de tu formulario
  });
  const { dataProductos4 } = useProductosFiltradoExistenciaProductoAlm({
    almacen: ALMACEN.VENTAS,
    cia: dataUsuarios2[0]?.idCia,
    descripcion: "%",
    idCliente: 44110,
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

  return (
    <>
      <Row>
        <SidebarHorizontal></SidebarHorizontal>
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1>
            {" "}
            Reportes <AiOutlineFileText size={30}></AiOutlineFileText>
          </h1>
        </div>
        <br />

        <UncontrolledAccordion defaultOpen="1">
          <AccordionItem>
            <AccordionHeader targetId="1">Filtros</AccordionHeader>
            <AccordionBody accordionId="1">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div>
                  <Label>Reporte:</Label>
                  <Input type="select" name="reporte" value={formulario.reporte} onChange={handleChange}>
                    <option value="">Seleccione un reporte</option>

                    {data.map((item) => (
                      <option key={item.id} value={item.metodoApi}>
                        {item.descripcion}
                      </option>
                    ))}
                  </Input>
                </div>
              </div>
              <br />
              <div className="formulario">
                {showf1 ? (
                  <div>
                    <Label>Fecha inicial:</Label>
                    <Input
                      type="date"
                      name="fechaInicial"
                      value={formulario.fechaInicial}
                      onChange={handleChange}
                      disabled={!data[0]?.f1}
                      bsSize="sm"
                    />
                  </div>
                ) : null}
                {showf2 ? (
                  <div>
                    <Label>Fecha final:</Label>
                    <Input
                      type="date"
                      name="fechaFinal"
                      value={formulario.fechaFinal}
                      onChange={handleChange}
                      disabled={!data[0]?.f2}
                      bsSize="sm"
                    />
                  </div>
                ) : null}
                {showSucursalInput ? (
                  <div>
                    <Label>Sucursal:</Label>
                    <Input
                      type="select"
                      name="sucursal"
                      value={formulario.sucursal}
                      onChange={handleChange}
                      bsSize="sm"
                    >
                      <option value="">Seleccione la sucursal</option>

                      {dataSucursales.map((item) => (
                        <option value={item.sucursal}>{item.nombre}</option>
                      ))}
                    </Input>
                  </div>
                ) : null}

                {showClienteInput ? (
                  <div>
                    <>
                      <Label>Clientes:</Label>
                      <InputGroup>
                        {" "}
                        <Input
                          type="text"
                          name="cliente"
                          value={selectedName} // Usamos selectedId si formulario.cliente está vacío
                          bsSize="sm"
                          placeholder="Ingrese el cliente"
                        />
                        <Button size="sm" color="secondary" onClick={abrirModal}>
                          seleccionar
                        </Button>
                      </InputGroup>
                    </>
                  </div>
                ) : null}

                {showEstilistaInput ? (
                  <div>
                    <Label>Estilista:</Label>
                    {/* <Input
                      type="select"
                      name="estilista"
                      value={formulario.estilista}
                      onChange={handleChange}
                      bsSize="sm"
                    >
                      <option value="">Seleccione un Estilista</option>

                      {dataUsuarios.map((item) => (
                        <option value={item.id}>{item.nombre}</option>
                      ))}
                    </Input> */}
                    <Select
                      menuPlacement="top"
                      name="estilista"
                      options={optionsEstilista}
                      value={optionsEstilista.find((option) => option.value === formulario.estilista)}
                      onChange={(selectedOption) => {
                        // Aquí actualizas el valor en el estado form
                        setFormulario((prevState) => ({
                          ...prevState,
                          estilista: selectedOption ? selectedOption.value : "", // 0 u otro valor predeterminado
                        }));
                      }}
                      placeholder="--Selecciona una opción--"
                    />
                  </div>
                ) : null}
                {showProductoInput ? (
                  <div>
                    <Label>Clave Producto:</Label>
                    {/* <Input
                      type="select"
                      name="estilista"
                      value={formulario.estilista}
                      onChange={handleChange}
                      bsSize="sm"
                    >
                      <option value="">Seleccione un Estilista</option>

                      {dataUsuarios.map((item) => (
                        <option value={item.id}>{item.nombre}</option>
                      ))}
                    </Input> */}
                    <Select
                      menuPlacement="top"
                      // styles={{ placeholder }}
                      name="clave_prod"
                      options={optionsProductos}
                      value={optionsProductos.find((option) => option.value === formulario.clave_prod)}
                      onChange={(selectedOption) => {
                        // Aquí actualizas el valor en el estado form
                        setFormulario((prevState) => ({
                          ...prevState,
                          clave_prod: selectedOption ? selectedOption.value : "", // 0 u otro valor predeterminado
                        }));
                      }}
                      placeholder="--Selecciona una opción--"
                    />
                  </div>
                ) : null}
                {showMarcaInput ? (
                  <div>
                    <Label>Marca:</Label>
                    {/* <Input
                      type="select"
                      name="estilista"
                      value={formulario.estilista}
                      onChange={handleChange}
                      bsSize="sm"
                    >
                      <option value="">Seleccione un Estilista</option>

                      {dataUsuarios.map((item) => (
                        <option value={item.id}>{item.nombre}</option>
                      ))}
                    </Input> */}
                    <Select
                      menuPlacement="top"
                      name="marca"
                      options={optionsMarca}
                      value={optionsMarca.find((option) => option.value === formulario.marca)}
                      onChange={(selectedOption) => {
                        // Aquí actualizas el valor en el estado form
                        setFormulario((prevState) => ({
                          ...prevState,
                          marca: selectedOption ? selectedOption.value : "", // 0 u otro valor predeterminado
                        }));
                      }}
                      placeholder="--Selecciona una opción--"
                    />
                  </div>
                ) : null}
                {showAlmacenInput ? (
                  <div>
                    <Label>Almacen:</Label>
                    {/* <Input
                      type="select"
                      name="estilista"
                      value={formulario.estilista}
                      onChange={handleChange}
                      bsSize="sm"
                    >
                      <option value="">Seleccione un Estilista</option>

                      {dataUsuarios.map((item) => (
                        <option value={item.id}>{item.nombre}</option>
                      ))}
                    </Input> */}
                    <Select
                      menuPlacement="top"
                      name="marca"
                      options={optionsAlmacen}
                      value={optionsAlmacen.find((option) => option.value === formulario.almacen)}
                      onChange={(selectedOption) => {
                        // Aquí actualizas el valor en el estado form
                        setFormulario((prevState) => ({
                          ...prevState,
                          almacen: selectedOption ? selectedOption.value : "", // 0 u otro valor predeterminado
                        }));
                      }}
                      placeholder="--Selecciona una opción--"
                    />
                  </div>
                ) : null}
                {showEmpresaInput ? (
                  <div>
                    <Label>Empresa:</Label>
                    <Input type="select" name="empresa" value={formulario.empresa} onChange={handleChange} bsSize="sm">
                      <option value="">Seleccione la empresa</option>

                      {dataCias.map((item) => (
                        <option value={item.id}>{item.nombre}</option>
                      ))}
                    </Input>
                  </div>
                ) : null}

                {showSucDesInput ? (
                  <div>
                    <Label>Sucursal destino:</Label>
                    <Input
                      type="text"
                      name="sucursalDestino"
                      value={formulario.sucursalDestino}
                      onChange={handleChange}
                      disabled={!data[0]?.sucDestino}
                      bsSize="sm"
                    />
                  </div>
                ) : null}

                {showAlmOrigenInput ? (
                  <div>
                    <Label>Almacen origen:</Label>
                    <Input
                      type="text"
                      name="almacen"
                      value={formulario.almacen}
                      onChange={handleChange}
                      disabled={!data[0]?.almacenOrigen}
                      bsSize="sm"
                    />
                  </div>
                ) : null}
                {showAlmDestInput ? (
                  <div>
                    <Label>Almacen destino:</Label>
                    <Input
                      type="text"
                      name="almacendestino"
                      value={formulario.almacenDestino}
                      onChange={handleChange}
                      disabled={!data[0]?.almacenDestino}
                      bsSize="sm"
                    />
                  </div>
                ) : null}
                {showTipoMovtoInput ? (
                  <div>
                    <Label>Tipo de movimiento:</Label>
                    <Input
                      type="text"
                      name="tipoMovimiento"
                      value={formulario.tipoMovimiento}
                      onChange={handleChange}
                      disabled={!data[0]?.tipomovto}
                      bsSize="sm"
                    />
                  </div>
                ) : null}

                {showProveedorInput ? (
                  <div>
                    <Label>Proveedor:</Label>
                    <Input
                      type="text"
                      name="proveedor"
                      value={formulario.proveedor}
                      onChange={handleChange}
                      disabled={!data[0]?.proveedor}
                      bsSize="sm"
                    />
                  </div>
                ) : null}
                {showMetodoPagoInput ? (
                  <div>
                    <Label>Método de pago:</Label>

                    <Input
                      type="select"
                      name="tipoPago"
                      value={formulario.tipoPago}
                      onChange={handleChange}
                      bsSize="sm"
                    >
                      <option value="">Seleccione el tipo de pago</option>

                      {dataFormasPagos.map((item) => (
                        <option value={item.id}>{item.descripcion}</option>
                      ))}
                    </Input>
                  </div>
                ) : null}

                {showTipoDescuentoInput ? (
                  <div>
                    <Label>Tipo de descuento:</Label>

                    <Input
                      type="select"
                      name="tipoDescuento"
                      value={formulario.tipoDescuento}
                      onChange={handleChange}
                      bsSize="sm"
                    >
                      <option value="">Seleccione el tipo de descuento:</option>

                      {descuento.map((item) => (
                        <option value={item.id}>{item.descripcion}</option>
                      ))}
                    </Input>
                  </div>
                ) : null}
                {showClaveProdInput ? (
                  <div>
                    <Label>Clave producto</Label>
                    <Input
                      type="text"
                      name="clave_prod"
                      value={formulario.clave_prod}
                      onChange={handleChange}
                      bsSize="sm"
                    />
                  </div>
                ) : null}
                {showPalabraProdInput ? (
                  <div>
                    <Label>Palabra</Label>
                    <Input type="text" name="palabra" value={formulario.palabra} onChange={handleChange} bsSize="sm" />
                  </div>
                ) : null}
                {showNoVentaInput ? (
                  <div>
                    <Label>No. venta</Label>
                    <Input type="text" name="noVenta" value={formulario.noVenta} onChange={handleChange} bsSize="sm" />
                  </div>
                ) : null}
                {showAreaInput ? (
                  <div>
                    <Label for="area">Área:</Label>
                    <Input
                      type="select"
                      name="area"
                      id="exampleSelect"
                      value={formClase.area}
                      onChange={handleChangeAreaDeptoClase}
                      bsSize="sm"
                    >
                      <option value={0}>Seleccione un área</option>
                      {dataAreas.map((area) => (
                        <option value={area.area}>{area.descripcion}</option>
                      ))}{" "}
                    </Input>
                  </div>
                ) : null}
                {showAñoInput ? (
                  <div>
                    <Label>Año</Label>
                    <Input type="select" name="año" value={formulario.año} onChange={handleChange}>
                      <option value="">Seleccione un Año</option>
                      <option value={2023}>2023</option>
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                      <option value={2027}>2027</option>
                      <option value={2028}>2028</option>
                      <option value={2029}>2028</option>
                      <option value={2030}>2030</option>
                    </Input>
                  </div>
                ) : null}
                {showMesInput ? (
                  <div>
                    <Label>Mes</Label>
                    <Input type="select" name="mes" value={formulario.mes} onChange={handleChange}>
                      <option value="">Seleccione un Mes</option>
                      <option value="1">Enero</option>
                      <option value="2">Febrero</option>
                      <option value="3">Marzo</option>
                      <option value="4">Abril</option>
                      <option value="5">Mayo</option>
                      <option value="6">Junio</option>
                      <option value="7">Julio</option>
                      <option value="8">Agosto</option>
                      <option value="9">Septiembre</option>
                      <option value="10">Octubre</option>
                      <option value="11">Noviembre</option>
                      <option value="12">Diciembre</option>
                    </Input>
                  </div>
                ) : null}
                {showDeptoInput ? (
                  <div>
                    <Label for="departamento">Departamento:</Label>
                    <Input
                      bsSize="sm"
                      type="select"
                      name="depto"
                      id="exampleSelect"
                      value={formClase.depto}
                      onChange={handleChangeAreaDeptoClase}
                    >
                      <option value={0}>Seleccione un departamento</option>
                      {dataDeptosFiltrado.map((depto) => (
                        <option value={depto.depto}>{depto.descripcion}</option>
                      ))}{" "}
                    </Input>
                  </div>
                ) : null}
              </div>
              <br />
              <div className="d-flex justify-content-end">
                <Button className="ml-auto" onClick={() => ejecutaReporte(formulario.reporte)}>
                  Consultar
                </Button>
              </div>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>

        <hr />
      </Container>
      <Container>
        <div>
          {/* <MaterialReactTable
            columns={tablaData.columns.map((key) => ({
              accessorKey: key,
              header: key,
              isVisible: key !== "id", // Opcional: Puedes ocultar la columna "id" si lo deseas.
              // size: "flex",
            }))}
            data={tablaData.data}
            enableRowSelection={false}
            rowSelectionCheckboxes={false}
            initialState={{ density: "compact" }}
            enableBottomToolbar={true}
            renderTopToolbarCustomActions={({ table }) => (
              <>
              <h3>{descripcionReporte}</h3>
              <Button
                onClick={handleExportData}
                variant="contained"
                color="white" // Cambiado de "withe" a "white"
                style={{ marginLeft: "auto" }}
                startIcon={<AiFillFileExcel />}
                aria-label="Exportar a Excel"
              >
                <AiOutlineFileExcel size={20}></AiOutlineFileExcel>
              </Button>
            </>
          )}
          renderBottomToolbarCustomActions={() => (
            <>
<div style={{ textAlign: 'center' }}>
  {Object.entries(DatosSumados).map(([columna, valor]) => (
    <div key={columna}>
      {columna === "Total" || columna === "Importe" ? (
        <>
          <Label htmlFor={columna}><strong>{`${columna}`}</strong></Label>
          <Input type="text" id={columna} value={`$${valor.toFixed(2)}`} disabled/>
        </>
      ) : (
        ''
      )}
    </div>
  ))}
</div>

            </>
            
          )}
        /> */}
          <MaterialReactTable
            columns={tablaData.columns.map((key) => ({
              accessorKey: key,
              header: key,
              isVisible: key !== "id",
              Cell: ({ cell }) => {
                const valor = cell.getValue<number>();

                if (key === "Total" || key === "Importe" || key === "Precio") {
                  if (!isNaN(valor)) {
                    return (
                      <span>
                        ${valor.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    );
                  } else {
                    return valor;
                  }
                }

                if (key === "Fecha" || key === "fechaCita") {
                  const fecha = cell.getValue<string>(); // Obtén la fecha en formato ISO como cadena
                  if (fecha) {
                    const opcionesDeFormato = { day: "2-digit", month: "2-digit", year: "numeric" };
                    const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES", opcionesDeFormato);
                    return <span>{fechaFormateada}</span>;
                  } else {
                    return ""; // Mostrar cadena vacía para fechas vacías
                  }
                }

                return valor; // Para otras columnas, simplemente muestra el valor sin formato
              },
            }))}
            data={tablaData.data}
            enableRowSelection={false}
            rowSelectionCheckboxes={false}
            initialState={{ density: "compact" }}
            enableBottomToolbar={true}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <h3>{descripcionReporte}</h3>
                <Button
                  onClick={() => handleExportData(descripcionReporte)}
                  variant="contained"
                  color="white"
                  style={{ marginLeft: "auto" }}
                  startIcon={<AiFillFileExcel />}
                  aria-label="Exportar a Excel"
                >
                  <AiOutlineFileExcel size={20}></AiOutlineFileExcel>
                </Button>
              </>
            )}
            renderBottomToolbarCustomActions={() => (
              <>
                <div style={{ textAlign: "center" }}>
                  {Object.entries(DatosSumados).map(([columna, valor]) => (
                    <div key={columna}>
                      {columna === "Total" || columna === "Importe" ? (
                        <>
                          <Label htmlFor={columna}>
                            <strong>{`${columna}`}</strong>
                          </Label>
                          {/* Aplica formato de moneda a las columnas "importe" y "Total" */}
                          <Input
                            type="text"
                            id={columna}
                            value={
                              columna === "Total" || columna === "Importe" ? numeral(valor).format("$0,0.00") : valor
                            }
                            disabled
                          />
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          />
        </div>
        <div>
          {/* <ul> */}
          {/* {Object.entries(DatosSumados).map(([columna, valor]) => (
            <li key={columna}>
              Sumatoria de {columna}: {valor}
            </li>
          ))}
        </ul> */}
          {/* Muestra la suma total en un campo Input */}
          {/* <Input type="text" value={totalSum} readOnly /> */}
        </div>
      </Container>
      <Modal isOpen={modalOpenCli} toggle={cerrarModal}>
        <ModalHeader toggle={cerrarModal}>Modal Cliente</ModalHeader>
        <ModalBody>
          <MaterialReactTable
            columns={columnsTrabajador}
            data={trabajador}
            onSelect={(id_cliente, name) => handleModalSelect(id_cliente, name)} // Pasa la función de selección
            initialState={{ density: "compact" }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ReporteTool;
