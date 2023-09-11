import React, { useState, useEffect, useMemo } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
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
  const [selectedName, setSelectedName] = useState(""); // Estado para almacenar el nombre seleccionados
  const [trabajador, setTrabajadores] = useState([]);

  const [showClienteInput, setShowClienteInput] = useState(false);
  const [showSucursalInput, setShowSucursalInput] = useState(false);
  const [showEstilistaInput, setShowEstilistaInput] = useState(false);
  const [showEmpresaInput, setShowEmpresaInput] = useState(false);
  const [showSucDesInput, setShowSucDesInput] = useState(false);
  const [showAlmOrigenInput, setShowAlmOrigenInput] = useState(false);
  const [showAlmDestInput, setShowAlmDestInput] = useState(false);
  const [showTipoMovtoInput, setShowTipoMovtoInput] = useState(false);
  const [showProveedorInput, setShowProveedorInput] = useState(false);
  const [showMetodoPagoInput, setShowMetodoPagoInput] = useState(false);
  const [showClaveProdInput, setShowClaveProdInput] = useState(false);
  const [showTipoDescuentoInput, setShowTipoDescuentoInput] = useState(false);
  const [showAreaInput, setShowAreaInput] = useState(false);
  const [showDeptoInput, setShowDeptoInput] = useState(false);
  const [dataDeptosFiltrado, setDataDeptosFiltrado] = useState<Departamento[]>([]);

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
      .get("/Tipodescuento?id=0")
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
      if (formData[campo] === "") {
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

    if (formData.fechaInicial === "%" || formData.fechaInicial === "%") {
      Swal.fire("", "Debe seleccionar el rango de fechas", "info");
      return;
    }

    let queryString = "";
    if (reporte == "sp_reporte5_Ventas") {
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&cia=${formData.empresa}&suc=${formData.sucursal}&clave_prod=${formData.clave_prod}&tipoDescuento=${formData.tipoDescuento}&estilista=${formData.estilista}&tipoPago=${formData.tipoPago}`;
    } else if (reporte == "sp_reporte4_Estilistas") {
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&estilista=${formData.estilista}&suc=${formData.sucursal}&area=${formClase.area}&depto=${formClase.depto}`;
    } else {
      queryString = `/${reporte}?f1=${formData.fechaInicial}&f2=${formData.fechaFinal}&cia=${formData.empresa}&suc=${formData.sucursal}&cliente=${formData.cliente}&estilista=${formData.estilista}`;
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

  const handleExportData = () => {
    // Verificar si reportes contiene datos
    if (reportes.length > 0) {
      // Obtener los nombres de las columnas de la primera fila de datos (asumiendo que todas las filas tienen las mismas columnas)
      const columnHeaders = Object.keys(reportes[0]);

      const csvOptions = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columnHeaders, // Utiliza los nombres de columnas obtenidos de los datos
      };

      const csvExporter = new ExportToCsv(csvOptions);
      csvExporter.generateCsv(reportes);
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

    if (name === "reporte") {
      if (value === "RepVtaSucEstilista" || value === "RepVtaDetalle" || value === "RepVtaSucFecha") {
        // Mostrar los campos para estos informes
        setShowEmpresaInput(true);
        setShowSucursalInput(true);
        setShowClienteInput(true);
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
      } else if (value === "sp_reporte5_Ventas") {
        setShowEmpresaInput(true);
        setShowSucursalInput(true);
        setShowClaveProdInput(true);
        setShowTipoDescuentoInput(true);
        setShowEstilistaInput(true);
        setShowMetodoPagoInput(true);
        //----------------------------------------------------------------
        setShowClienteInput(false);
        setShowSucDesInput(false);
        setShowAlmOrigenInput(false);
        setShowAlmDestInput(false);
        setShowTipoMovtoInput(false);
        setShowProveedorInput(false);
        setShowAreaInput(false);
        setShowDeptoInput(false);
      } else if (value === "sp_reporte4_Estilistas") {
        setShowEstilistaInput(true);
        setShowSucursalInput(true);
        setShowAreaInput(true);
        setShowDeptoInput(true);

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

  return (
    <>
      <Row>
        <SidebarHorizontal></SidebarHorizontal>
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Reportes </h1>
          <AiOutlineFileText size={30}></AiOutlineFileText>
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
                    <Input
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
                    </Input>
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
          <MaterialReactTable
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
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <h3>{descripcionReporte}</h3>
                <Button
                  onClick={handleExportData}
                  variant="contained"
                  color="withe"
                  style={{ marginLeft: "auto" }}
                  startIcon={<AiFillFileExcel />}
                  aria-label="Exportar a Excel"
                >
                  <AiOutlineFileExcel size={20}></AiOutlineFileExcel>
                </Button>
              </>
            )}
          />
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
