import React, { useState, useEffect, useRef, useMemo } from "react";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { useProveedor } from "../../hooks/getsHooks/useProveedor";
import { Proveedor } from "../../models/Proveedor";
import "./compras.css";
import {
  Button,
  Row,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Col,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
  InputGroup,
} from "reactstrap";
import { CompraProveedor } from "../../models/CompraProveedor";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import { useProductos } from "../../hooks/getsHooks/useProductos";
import { Producto, ProductoExistencia } from "../../models/Producto";
import { useComprasSeleccion } from "../../hooks/getsHooks/useComprasSeleccion";
import { CompraSeleccion } from "../../models/CompraSeleccion";
import { AiFillEdit, AiFillDelete, AiOutlineBarcode, AiOutlineSelect } from "react-icons/ai";
import { useComprasV3 } from "../../hooks/getsHooks/useComprasV3";
import CurrencyInput from "react-currency-input-field";
import { useReactToPrint } from "react-to-print";
import { UserResponse } from "../../models/Home";
import { useProductosFiltradoExistenciaProducto } from "../../hooks/getsHooks/useProductosFiltradoExistenciaProducto";
import Swal from "sweetalert2";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import { BiAddToQueue } from "react-icons/bi"; //PARA BOTÓN AGREGAR
import { BiSearchAlt } from "react-icons/bi"; //PARA BOTÓN BUSQUEDA
import { CgPlayListCheck } from "react-icons/cg"; //PARA BOTÓN FINALIZAR
import { BiTag } from "react-icons/bi"; //PARA BOTÓN NUEVO
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useNavigate } from "react-router-dom";
import { useProductosFiltradoExistenciaProductoAlm } from "../../hooks/getsHooks/useProductosFiltradoExistenciaProductoAlm";
import { ALMACEN_DB } from "../../utilities/constsAlmacenes";
import { BsCartPlus } from "react-icons/bs";
import { Trabajador } from "../../models/Trabajador";
import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";

function Compras() {
  const [showView, setShowView] = useState(true);

  const { dataTrabajadores, fetchNominaTrabajadores } = useNominaTrabajadores();
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_Compras_view`);

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
  const { dataProveedores } = useProveedor();

  /* modal crear */
  const [isCrearOpen, setIsCrearOpen] = useState<boolean>(false);
  const [modalOpen3, setModalOpen3] = useState<boolean>(false);
  const [modalImpresion, setModalImpresion] = useState<boolean>(false);
  const { filtroSeguridad, session } = useSeguridad();
  const TableDataHeader = ["Productos", "Existencias", "Acciones"];
  const TableDataHeaderCompras = [
    "Responsable",
    "Clave",
    "Descripción",
    "Cantidad",
    "Cantidad factura",
    "Mal estado",

    "Costo en catálogo",
    "Costo compra",
    "Importe",
    "Bonificación",
    "Acciones",
  ];
  const TableDataHeaderComprasSeleccion = ["Acción", "Clave compra", "Proveedor", "Items", "Importe", "Estado", "Fecha", "Nombre del encargado"];

  const [estados, setEstados] = useState(false);

  const { dataProductos, setDataProductos, fetchProduct } = useProductos();

  const toggleCrearModal = () => {
    setDataCompras({
      ...dataCompras,
      bonificaciones: 0,
      cantidad: 0,
      cantidadFactura: 0,
      cantidadMalEstado: 0,
      cia: 0,
      clave_prod: 0,
      costoCompra: 0,
      costoUnitario: 0,
      costounitario: 0,
      d_producto: "",
      d_unidadMedida: "",
      d_unidadTraspaso: 0,
      descripcion: "",
      finalizado: false,
      folioValidacion: 0,
      id: 0,
      id_compra: 0,
      idSucursal: 0,
      Usuario: 0,
    });
    // Define los campos requeridos
    const camposRequeridos = ["fechaDocumento", "folioDocumento"];

    // Verifica si todos los campos requeridos tienen valores
    const camposIncompletos = camposRequeridos.filter((campo) => !dataCompras[campo]);

    if (!dataCompras.idProveedor || camposIncompletos.length > 0) {
      if (Number(dataCompras.idProveedor === 0)) {
        Swal.fire("Campos obligatorios", "El campo 'idProveedor' es obligatorio.", "error");
      } else {
        const camposFaltantes = camposIncompletos.join(", ");
        Swal.fire("Campos obligatorios", `Faltan los siguientes campos por llenar: ${camposFaltantes}`, "error");
      }
    } else {
      // Si todos los campos requeridos están llenos, puedes continuar con el proceso
      fetchProduct4();
      setIsCrearOpen(!isCrearOpen);
    }
  };

  const filtroProducto = (datoMedico: string) => {
    var resultado = dataProductos.filter((elemento: Producto) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if ((datoMedico === "" || elemento.descripcion.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.descripcion.length > 2) {
        return elemento;
      }
    });
    setDataProductos(resultado);
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleConsultaModal = () => {
    setIsOpen(!isOpen);
    fetchComprasSeleccion();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name == "idProveedor" && value == "0") {
      setDataCompras({ ...dataCompras, d_Encargado: "", idProveedor: 0 });
    }
    setDataCompras((prevState: any) => ({ ...prevState, [name]: value }));
    console.log({ dataCompras });
  };
  const handleValueChange = (fieldName: string, value: string | undefined) => {
    if (value === undefined) {
      setDataCompras((prevForm) => ({
        ...prevForm,
        [fieldName]: 0, // Actualizar el valor correspondiente en el estado del formulario
      }));
    } else {
      setDataCompras((prevForm) => ({
        ...prevForm,
        [fieldName]: value, // Actualizar el valor correspondiente en el estado del formulario
      }));
    }
    console.log(dataCompras);
  };
  const handleChangeFechas = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormFechas((prevState: any) => ({ ...prevState, [name]: value }));
    console.log({ dataCompras });
  };

  const [formFechas, setFormFechas] = useState({
    fecha1: "",
    fecha2: "",
  });

  /* alertas */
  const [modalEdit, setModalEdit] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(0);
  const [filtroProductos, setFiltroProductos] = useState("");
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  // const { dataCompras, setDataCompras } = useGentlemanContext();
  const [dataCompras, setDataCompras] = useState<CompraProveedor>({
    id: 0,
    id_compra: 0,
    fecha: "",
    cia: 0,
    idSucursal: 0,
    idProveedor: 0,
    clave_prod: 0,
    cantidad: 0,
    bonificaciones: 0,
    costounitario: 0,
    costoCompra: 0,
    Usuario: 0,
    folioDocumento: "",
    finalizado: false,
    d_proveedor: "",
    fechaDocumento: "",
    cantidadFactura: 0,
    cantidadMalEstado: 0,
    folioValidacion: 0,
    d_Encargado: "",
  });
  const { dataComprasGeneral, fetchCompras, setDataComprasGeneral } = useComprasV3(
    dataCompras.idProveedor,
    idSeleccionado,
    dataUsuarios2[0]?.sucursal,
    dataUsuarios2[0]?.idCia

  );
  const handle = (dato: Producto) => {
    fetchProduct();
    if (productoSelected.includes(Number(dato.id))) {
      // alert("Producto repitido, intente con otro");

      Swal.fire("", "Producto repetido, intente con otro", "warning");
    } else {
      setDataCompras({
        ...dataCompras,
        clave_prod: dato.id,
        d_producto: dato.descripcion,
        costoUnitario: dato.costo_unitario,
        d_unidadTraspaso: dato.unidad_paq_traspaso,
        d_unidadMedida: dato.d_unidadMedida,
      });
      setModalOpen3(false);
    }

    console.log({ dataCompras });
  };
  const [disabledFecha, setDisabledFecha] = useState(false);
  const handleBusqueda = (dato: CompraSeleccion) => {
    setDataCompras({
      ...dataCompras,
      idProveedor: dato.idProveedor,
      fecha: dato.fecha !== undefined ? dato.fecha.split("T")[0] : "",
      id_compra: dato.id_compra,
      d_Encargado: dato.nombreEncargado,

    });


    setIsOpen(false);
    setIdSeleccionado(dato.id_compra);
  };

  const postCompra = async () => {
    const permiso = await filtroSeguridad("COMPRA_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    if (!dataCompras.idProveedor || !dataCompras.clave_prod || dataCompras.cantidadFactura <= 0 || dataCompras.costoCompra <= 0) {
      // alert("Por favor, complete los campos obligatorios.");
      Swal.fire("", "Por favor, complete los campos obligatorios.", "info");
      return;
    }
    jezaApi
      .post("/Compra", null, {
        params: {
          id_compra: 0,
          fecha: new Date(),
          cia: dataUsuarios2[0]?.idCia,
          idSucursal: dataUsuarios2[0]?.sucursal,
          idProveedor: dataCompras.idProveedor,
          clave_prod: dataCompras.clave_prod,
          cantidad: dataCompras.cantidad,
          cantidadFactura: dataCompras.cantidadFactura,
          cantidadMalEstado: dataCompras.cantidadMalEstado,
          bonificaciones: dataCompras.bonificaciones,
          costounitario: dataCompras.costoUnitario,
          costoCompra: dataCompras.costoCompra,
          Usuario: dataUsuarios2[0]?.id,
          folioDocumento: dataCompras.folioDocumento,
          finalizado: false,
        },
      })
      .then(() => {
        // alert("Compra guardada");
        Swal.fire("", "Compra guardada!", "success");
        fetchCompras();
      })
      .catch((error) => {
        console.log(error);
        // alert("Error");
        Swal.fire("", "Error", "error");
      });
    setDataCompras({
      ...dataCompras,
      costoUnitario: 0,
      id: 0,
      id_compra: 0,
      cia: 0,
      idSucursal: 0,
      clave_prod: 0,
      cantidad: 0,
      bonificaciones: 0,
      costounitario: 0,
      costoCompra: 0,
      Usuario: 0,
      finalizado: false,
      d_proveedor: "",
      d_producto: "",
      d_unidadMedida: "",
      d_unidadTraspaso: 0,
      cantidadFactura: 0,
      cantidadMalEstado: 0,
    });
  };

  const putFinalizaCompra = async () => {
    const permiso = await filtroSeguridad("COMPRA_FIN");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }

    if (dataCompras.folioDocumento && dataCompras.fecha && dataComprasGeneral) {
      jezaApi
        .put("/CompraFinaliza", null, {
          params: {
            proveedor: dataCompras.idProveedor,
            sucursal: dataUsuarios2[0]?.sucursal,
            foliodocto: dataCompras.folioDocumento,
            fechaDocumento: dataCompras.fechaDocumento?.replace(/-/g, ""),
          },
        })
        .then((response) => {
          setDataCompras({ ...dataCompras, idProveedor: 0, folioDocumento: "", fechaDocumento: "" });
          setDataComprasGeneral([]);
          Swal.fire({
            icon: "success",
            text: "Compra guardado con éxito",
            confirmButtonColor: "#3085d6",
          });
          setTimeout(() => {
            fetchCompras();
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Faltan ingresar datos`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    }
    setDataCompras({
      ...dataCompras,
      costoUnitario: 0,
      id: 0,
      id_compra: 0,
      cia: 0,
      idSucursal: 0,
      clave_prod: 0,
      cantidad: 0,
      bonificaciones: 0,
      costounitario: 0,
      costoCompra: 0,
      Usuario: 0,
      finalizado: false,
      d_proveedor: "",
      d_Encargado: "",
    });
    console.log(dataCompras);
  };

  const put = async () => {
    const permiso = await filtroSeguridad("COMPRA_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    jezaApi
      .put("/Compra", null, {
        params: {
          id: dataCompras.id,
          id_compra: dataCompras.id_compra,
          fecha: new Date(),
          cia: dataCompras.cia,
          idSucursal: dataCompras.idSucursal,
          idProveedor: dataCompras.idProveedor,
          claveProd: dataCompras.claveProd,
          cantidad: dataCompras.cantidad,
          cantidadFactura: dataCompras.cantidadFactura,
          cantidadMalEstado: dataCompras.cantidadMalEstado,
          bonificaciones: dataCompras.bonificaciones,
          costoUnitario: dataCompras.costoUnitario.toFixed(2),
          costoCompra: dataCompras.costoCompra,
          usuario: dataCompras.usuario,
          folioDocumento: dataCompras.folioDocumento,
          finalizado: dataCompras.finalizado,
        },
      })
      .then((response) => {
        // alert("Producto cambiado con éxito");
        Swal.fire("", "Producto cambiado con éxito", "success");
        console.log(response);
        fetchCompras();
      });
  };

  const deleteCompra = async (dato: CompraProveedor) => {
    const permiso = await filtroSeguridad("COMPRA_UPD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    Swal.fire({
      title: "Esta seguro?",
      text: `Estás Seguro que deseas Eliminar el elemento ${dato.descripcion}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "si, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        jezaApi.delete(`/Compra?id=${dato.id}`).then(() => {
          fetchCompras();
          // alert("Producto eliminada correctamente");
          Swal.fire("", "Producto eliminado correctamente", "success");
        });
      }
    });

    // const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    // if (opcion) {
    //   jezaApi.delete(`/Compra?id=${dato.id}`).then(() => {
    //     fetchCompras();
    //     // alert("Producto eliminada correctamente");
    //     Swal.fire("", "Producto eliminado correctamente", "success");
    //   });
    // }
  };

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ dataUsuarios2 });
    }
  }, []);

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

  const [sumaTotalCompras, setSetsumaTotalCompras] = useState(0);
  const [productoSelected, setProductoSelected] = useState<Number[]>([]);

  useEffect(() => {
    setSetsumaTotalCompras(dataComprasGeneral.reduce((total, objeto) => total + (objeto.costoCompra * objeto.cantidad ?? 0), 0) * 1.16);
    const ultimoFolio = dataComprasGeneral && dataComprasGeneral.length > 0 ? dataComprasGeneral[dataComprasGeneral.length - 1].folioDocumento : "";
    const ultiFecha = dataComprasGeneral.length > 0 ? dataComprasGeneral[dataComprasGeneral.length - 1].fecha : "";
    const ultiFechaDocumento = dataComprasGeneral.length > 0 ? dataComprasGeneral[dataComprasGeneral.length - 1].fechaDocumento : "";
    const ultiCompra = dataComprasGeneral.length > 0 ? dataComprasGeneral[dataComprasGeneral.length - 1].id_compra : 0;
    const ultiResposable = dataComprasGeneral.length > 0 ? dataComprasGeneral[dataComprasGeneral.length - 1].usuario : 0;

    if (ultiCompra > 0) {
      setDisabledFecha(true);
    } else {
      setDisabledFecha(false);
    }
    setDataCompras({
      ...dataCompras,
      folioDocumento: ultimoFolio,
      fecha: ultiFecha.split("T")[0],
      fechaDocumento: ultiFechaDocumento.split("T")[0],
      folioValidacion: ultimoFolio,
      d_Encargado: getUsuarioForeignKey(ultiResposable),
    });
    const descripciones = dataComprasGeneral.map((item) => item.claveProd);
    setProductoSelected(descripciones);
  }, [dataComprasGeneral]);

  const options = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  };

  const { dataComprasSeleccion, fetchComprasSeleccion } = useComprasSeleccion({
    fecha1: formFechas.fecha1,
    fecha2: formFechas.fecha2,
    sucursal: dataUsuarios2[0]?.sucursal,
    cia: dataUsuarios2[0]?.idCia,
  });

  interface TicketPrintProps {
    children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  }
  const TicketPrint: React.FC<TicketPrintProps> = ({ children }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    return (
      <div>
        <div style={{ display: "none" }}>
          <div ref={componentRef}>{children}</div>
        </div>
        {children && <Button onClick={handlePrint}>Imprimir</Button>}
      </div>
    );
  };
  const Impresion = () => {
    return (
      <>
        {/* alertas */}
        <Container>
          <br />
          <h1>Compras </h1>
          <br />
          <div className="form-grid">
            <div>
              <Label>Proveedor: {dataCompras.d_proveedor}</Label>
              <br />
              <Label>Fecha: {dataCompras.fecha}</Label>
              <br />
              <Label for="documento">Documento: {dataCompras.folioDocumento}</Label>
            </div>
            {/* <div>
              <Label>Fecha {fechaHoy} </Label>
              <br />
              <Label>Sucursal: BARRIO</Label>
              <br />
              <Label> Usuario: {dataUsuarios2 ? dataUsuarios2[0]?.nombre.toLocaleUpperCase() : ""} </Label>
            </div> */}
          </div>
          <br />
          {/* <Label>Usuario: {dataUsuarios[0].d_perfil ? dataUsuarios[0].d_perfil : "cbinfortmatica"}</Label> */}
          <Container>
            <div className="alineación-derecha">
              <Button disabled={disabledFecha} color="success" onClick={toggleCrearModal}>
                Agregar
              </Button>
            </div>
            <Table size="sm" striped={true}>
              <thead>
                <tr>
                  {TableDataHeaderCompras.map((valor: any) => (
                    <th key={valor}>{valor}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataComprasGeneral.map((dato: CompraProveedor, index) => (
                  <tr key={dato.id + index}>
                    <td>{dato.descripcion}</td>
                    <td>{dato.descripcion}</td>
                    <td>{dato.cantidad}</td>
                    <td>
                      {dato.costoUnitario.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>{dato.costoCompra.toLocaleString("en-US", options)}</td>
                    <td>{(dato.costoCompra * dato.cantidad).toLocaleString("en-US", options)}</td>
                    <td className="gap-1">
                      {dato.finalizado === true ? (
                        <>
                          <AiFillEdit color={"grey"} className="mr-2" onClick={() => null} size={23}></AiFillEdit>
                          <AiFillDelete color="grey" onClick={() => null} size={23}></AiFillDelete>
                        </>
                      ) : (
                        <>
                          <AiFillEdit
                            className="mr-2"
                            onClick={() => {
                              setModalEdit(true);
                              setDataCompras(dato);
                            }}
                            size={23}
                          ></AiFillEdit>
                          <AiFillDelete color="lightred" onClick={() => deleteCompra(dato)} size={23}></AiFillDelete>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <p> Total: {sumaTotalCompras.toLocaleString("en-US", options)}</p>
            </div>
          </Container>
        </Container>
      </>
    );
  };

  const { dataProductos4, fetchProduct4 } = useProductosFiltradoExistenciaProductoAlm({
    descripcion: filtroProductos,
    insumo: 0,
    inventariable: 2,
    obsoleto: 0,
    servicio: 2,
    sucursal: dataUsuarios2[0]?.sucursal,
    almacen: ALMACEN_DB[1],
    cia: dataUsuarios2[0]?.cia,
    idCliente: 0,
  });

  const getUsuarioForeignKey = (responsable: number) => {

    const usuario = dataTrabajadores.find((usuario: Trabajador) => usuario.id === responsable);

    return usuario ? usuario.nombre : "Sin usuario";
  };

  const dataProductosConAcciones = dataProductos4.map((dato: ProductoExistencia) => ({
    ...dato,
    acciones: (
      <Button size="sm" onClick={() => handle(dato)}>
        Seleccionar
      </Button>
    ),
  }));

  const columns: MRT_ColumnDef<ProductoExistencia>[] = useMemo(
    () => [
      {
        accessorKey: "descripcion",
        header: "Productos",
        size: 200,
      },
      {
        accessorKey: "existencia",
        header: "Existencias",
        size: 150,
      },

      {
        accessorKey: "precio",
        header: "Precio",
        Cell: ({ cell }) => (
          <span style={{ textAlign: "left" }}>
            ${cell.getValue<number>().toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        ),
      },

      {
        accessorKey: "acciones",
        header: "Acciones",
        size: 120,
        customComponent: (rowData) => rowData.original.acciones,
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
        <h1>
          Compras <BsCartPlus size={35} />
        </h1>
        <br />
        <Row>
          <Col md="6">
            <Label>Proveedor:</Label>
            <Input
              onClick={() => {
                setTimeout(() => {
                  setIdSeleccionado(0);
                }, 1500);
                setDisabledFecha(false);
              }}
              type="select"
              name="idProveedor"
              value={dataCompras.idProveedor}
              onChange={handleChange}
              style={{ marginBottom: 17 }}
              disabled={disabledFecha}
              bsSize="sm"
            >
              <option value={0}>Selecciona el proveedor</option>
              {dataProveedores.map((proveedor: Proveedor) => (
                <option value={proveedor.id}> {proveedor.nombre} </option>
              ))}
            </Input>
            <br />
          </Col>

          <Col md="6">
            <Label>Fecha de documento:</Label>
            <Input
              type="date"
              disabled={disabledFecha}
              onChange={handleChange}
              name="fechaDocumento"
              value={dataCompras.fechaDocumento || dataCompras.fecha || ""} // Prioriza fechaDocumento si existe, si no, muestra fecha, y si no, cadena vacía
              bsSize="sm"
            />
            <br />
          </Col>

          <Col md="4">
            <Label for="documento">Documento:</Label>
            <Input
              disabled={disabledFecha}
              type="text"
              onChange={handleChange}
              name="folioDocumento"
              value={dataCompras.folioDocumento ? dataCompras.folioDocumento : ""}
              bsSize="sm"
            />
            <br />
          </Col>
          <Col md="4">
            <Label for="documento">Nombre del encargado:</Label>
            <Input
              disabled
              type="text"
              onChange={handleChange}
              name="d_Encargado"
              value={dataCompras.d_Encargado ? dataCompras.d_Encargado : ""}
              bsSize="sm"
            />
            <br />
          </Col>
          <Col md="4">
            <Label for="documento">Folio:</Label>
            <Input
              disabled
              type="text"
              onChange={handleChange}
              name="id_compra"
              value={dataCompras.id_compra ? dataCompras.id_compra : "0"}
              bsSize="sm"
            />
            <br />
          </Col>
        </Row>
      </Container>

      {/* <Label>Usuario: {dataUsuarios[0].d_perfil ? dataUsuarios[0].d_perfil : "cbinfortmatica"}</Label> */}
      <Container>
        <div className="alineación-derecha">
          <Button style={{ marginRight: 5 }} disabled={Number(dataCompras?.id_compra) > 0} color="success" onClick={toggleCrearModal}>
            <BiAddToQueue size={30} />
            Agregar
          </Button>
          <Button
            disabled={!dataComprasGeneral.length > 0}
            color="primary"
            onClick={() => {
              setDataCompras({
                bonificaciones: 0,
                cantidad: 0,
                cantidadFactura: 0,
                cantidadMalEstado: 0,
                cia: 0,
                clave_prod: 0,
                costoCompra: 0,
                costounitario: 0,
                d_proveedor: "",
                fecha: "",
                finalizado: false,
                folioDocumento: "",
                id: 0,
                id_compra: 0,
                idProveedor: 0,
                idSucursal: 0,
                Usuario: 0,
                d_Encargado: "",
              });
              setDisabledFecha(false);
            }}
          >
            Nuevo
            <BiTag size={30} />
          </Button>
        </div>
        <div className="table-responsive">
          <Table responsive={"sm"} bordered={true} striped={true} >
            <thead>
              <tr>
                {TableDataHeaderCompras.map((valor: any) => (
                  <th key={valor} style={{ fontSize: "13px", textAlign: "center" }}>
                    {valor}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataComprasGeneral.map((dato: CompraProveedor, index) => (
                <tr key={dato.id + index}>
                  {/* <td style={{ fontSize: "13px" }}>{dato.id_compra}</td> */}
                  <td style={{ fontSize: "13px" }}>{getUsuarioForeignKey(Number(dato.usuario))}</td>
                  <td style={{ fontSize: "13px" }}>{dato.claveProd}</td>
                  <td style={{ fontSize: "13px" }}>{dato.descripcion}</td>
                  <td style={{ fontSize: "13px" }} align="center">
                    {dato.cantidad}
                  </td>
                  <td style={{ fontSize: "13px" }} align="center">
                    {dato.cantidadFactura}
                  </td>
                  <td style={{ fontSize: "13px" }} align="center">
                    {dato.cantidadMalEstado}
                  </td>
                  <td style={{ fontSize: "13px" }} align="right">
                    {dato.costoUnitario.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ fontSize: "13px" }} align="right" width="120">
                    {dato.costoCompra.toLocaleString("en-US", options)}
                  </td>
                  <td style={{ fontSize: "13px" }} align="right" width="120">
                    {(dato.costoCompra * dato.cantidad).toLocaleString("en-US", options)}
                  </td>
                  <td style={{ fontSize: "13px" }} align="right">
                    {dato.bonificaciones.toFixed(2)}
                  </td>
                  <td style={{ fontSize: "13px" }} className="gap-1">
                    {dato.finalizado === true ? (
                      <>
                        <AiFillEdit color={"grey"} className="mr-2" onClick={() => null} size={23}></AiFillEdit>
                        <AiFillDelete color="grey" onClick={() => null} size={23}></AiFillDelete>
                      </>
                    ) : (
                      <>
                        <AiFillEdit
                          className="mr-2"
                          onClick={() => {
                            setModalEdit(true);
                            console.log({ dato });
                            setDataCompras({ ...dato, fechaDocumento: dataCompras.fecha, d_Encargado: dataCompras.d_Encargado });
                          }}
                          size={23}
                        ></AiFillEdit>
                        <AiFillDelete color="lightred" onClick={() => deleteCompra(dato)} size={23}></AiFillDelete>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={10}></th>
              </tr>
            </tfoot>
          </Table>
        </div>
        <div>
          <UncontrolledAccordion defaultOpen="2">
            <AccordionItem>
              <AccordionHeader targetId="1">
                <strong>Totales</strong>
              </AccordionHeader>
              <AccordionBody accordionId="1">
                <table style={{ width: "100%" }}>
                  <tr>
                    <th style={{ fontSize: "13px", textAlign: "center" }}>Claves</th>
                    <th style={{ fontSize: "13px", textAlign: "center" }} width="100"></th>
                    <th style={{ fontSize: "13px", textAlign: "center" }}>Cantidad</th>
                    <th style={{ fontSize: "13px", textAlign: "center" }}>Cantidad facturada</th>
                    <th style={{ fontSize: "13px", textAlign: "center" }}>Mal estado</th>
                    <th style={{ fontSize: "13px", textAlign: "center" }}>Costo en catalogo</th>
                    <th style={{ fontSize: "13px", textAlign: "center" }}>Costo compra</th>
                    <th style={{ fontSize: "13px", textAlign: "center" }}>Importe:</th>
                    <th style={{ fontSize: "13px", textAlign: "center" }}>Bonificación</th>
                    <th colSpan={1} width="80"></th>
                  </tr>
                  <tr>
                    <td style={{ fontSize: "13px" }} align="center">
                      {dataComprasGeneral.length}
                    </td>
                    <td style={{ fontSize: "13px" }} width="100"></td>
                    <td style={{ fontSize: "13px" }} align="center">
                      {dataComprasGeneral.reduce((total, dato) => total + dato.cantidad, 0)}
                    </td>
                    <td style={{ fontSize: "13px" }} align="center">
                      {dataComprasGeneral.reduce((total, dato) => total + dato.cantidadFactura, 0)}
                    </td>
                    <td style={{ fontSize: "13px" }} align="center">
                      {dataComprasGeneral.reduce((total, dato) => total + dato.cantidadMalEstado, 0)}
                    </td>
                    <td style={{ fontSize: "13px" }} align="right">
                      {dataComprasGeneral
                        .reduce((total, dato) => total + dato.costoUnitario, 0)
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                        })}
                    </td>
                    <td style={{ fontSize: "13px" }} align="right">
                      {dataComprasGeneral.reduce((total, dato) => total + dato.costoCompra, 0).toLocaleString("en-US", options)}
                    </td>
                    <td style={{ fontSize: "13px" }} align="right">
                      {dataComprasGeneral
                        .reduce((total, dato) => total + dato.costoCompra * dato.cantidadFactura, 0)
                        .toLocaleString("en-US", options)}
                    </td>
                    <td style={{ fontSize: "13px" }} align="right">
                      {dataComprasGeneral.reduce((total, dato) => total + dato.bonificaciones, 0)}
                    </td>
                    <td colSpan={1}></td>
                  </tr>
                </table>
              </AccordionBody>
            </AccordionItem>
          </UncontrolledAccordion>
        </div>

        <div style={{ display: "flex", justifyContent: "end" }}>
          <p style={{ backgroundColor: "#dee2e6" }}>
            {" "}
            <strong>Total + iva: </strong> {sumaTotalCompras.toLocaleString("en-US", options)}
          </p>
        </div>
      </Container>
      <Container>
        <Row>
          <Col md={"8"} className="">
            <br />
            <div className="d-flex  justify-content-start ">
              <Button
                disabled={disabledFecha || dataComprasGeneral.length === 0}
                style={{ marginRight: 5 }}
                onClick={() => putFinalizaCompra()}
                color="success"
              >
                Finalizado
                <CgPlayListCheck size={30} />
              </Button>

              <Button color="primary" onClick={toggleConsultaModal} style={{ marginRight: 0 }}>
                <BiSearchAlt size={30} />
                Consultar
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      {/* Modal */}

      <Modal isOpen={isCrearOpen} toggle={toggleCrearModal} centered size="lg">
        <ModalHeader toggle={toggleCrearModal}>
          <h3>Registro de compras</h3>
        </ModalHeader>
        <ModalBody>
          <Label>Producto:</Label>
          <Row>
            <Col>
              <InputGroup>
                {/* <Input disabled defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} /> */}
                <Input style={{ backgroundColor: "#fafafa" }} disabled defaultValue={dataCompras.d_producto} />
                <Button
                  onClick={() => {
                    setModalOpen3(true);
                    fetchProduct4();
                    setDataCompras({
                      ...dataCompras,
                      clave_prod: 0,
                      costounitario: 0,
                      d_producto: "",
                    });
                  }}
                >
                  Elegir
                </Button>
              </InputGroup>

              {/* <Button onClick={() => setModalOpen3(true)}>Elegir</Button> */}
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={4} xs={4}>
              <Label>Costo catálogo:</Label>
              <CurrencyInput
                className="custom-currency-input"
                prefix="$"
                name="costoUnitario"
                value={dataCompras.costoUnitario}
                disabled
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={(value) => handleValueChange("costoUnitario", value)}
              />
            </Col>
            {/* <Col md={4} xs={4}>
              <Label>Existencias:</Label>
              <CurrencyInput
                className="custom-currency-input"
                prefix="$"
                name="costoUnitario"
                value={dataCompras.existencias}
                disabled
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={(value) => handleValueChange("costoUnitario", value)}
              />AiOutlineSelect
            </Col> */}
            <Col md={4} xs={4}>
              <Label>Unidad paquete:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="costoUnitario"
                value={dataCompras.d_unidadTraspaso}
                disabled
                onValueChange={(value) => handleValueChange("costoUnitario", value)}
              />
            </Col>
            <Col md={4} xs={4}>
              <Label>Unidad medida</Label>
              <Input
                style={{ backgroundColor: "#fafafa" }}
                type="text"
                className="custom-currency-input"
                name="d_unidadMedida"
                value={dataCompras.d_unidadMedida}
                disabled
              />
            </Col>
          </Row>

          <br />
          <Row>
            <Col>
              <Label>Costo compra:</Label>
              <CurrencyInput
                className="custom-currency-input"
                prefix="$"
                name="costoCompra"
                value={dataCompras.costoCompra}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={(value) => handleValueChange("costoCompra", value)}
              />
            </Col>
            <Col>
              <Label>Cantidad:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="cantidad"
                value={dataCompras.cantidad}
                decimalsLimit={2}
                onValueChange={(value) => handleValueChange("cantidad", value)}
              />
            </Col>
            <Col>
              <Label>Bonificaciones:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="bonificaciones"
                value={dataCompras.bonificaciones}
                onValueChange={(value) => handleValueChange("bonificaciones", value)}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Label>Cantidad factura:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="bonificaciones"
                value={dataCompras.cantidadFactura}
                onValueChange={(value) => handleValueChange("cantidadFactura", value)}
              />
            </Col>

            <Col>
              <Label>Cantidad en mal estado:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="cantidadMalEstado"
                value={dataCompras.cantidadMalEstado}
                onValueChange={(value) => handleValueChange("cantidadMalEstado", value)}
              />
            </Col>
          </Row>
          <br />
          <br />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => setIsCrearOpen(!isCrearOpen)}>
            Cancelar
          </Button>
          <Button color="success" onClick={() => postCompra()}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isOpen} size="xl">
        <ModalHeader><h3>Búsqueda</h3></ModalHeader>
        <ModalBody>
          <Row>
            <Col md={2}>
              <Label>Fecha inicio: </Label>
            </Col>
            <Col md={4}>
              <Input type="date" onChange={handleChangeFechas} defaultValue={formFechas.fecha1} name="fecha1"></Input>
            </Col>
            <Col md={2}>
              <Label>Fecha final: </Label>
            </Col>
            <Col md={4}>
              <Input type="date" onChange={handleChangeFechas} defaultValue={formFechas.fecha2} name="fecha2"></Input>
            </Col>
          </Row>
          <br />
          <Container>
            <Table size="xl" striped={true} responsive={"xl"}>
              <thead>
                <tr>
                  {TableDataHeaderComprasSeleccion.map((valor: any) => (
                    <th key={valor}>{valor}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataComprasSeleccion.map((dato: CompraSeleccion, index) => (
                  <tr key={index}>
                    <td>{dato.id_compra}</td>
                    <td>{dato.nombre}</td>
                    <td>{dato.items}</td>
                    <td>{"$" + dato.importe.toFixed(2)}</td>
                    <td>{dato.Estatus}</td>
                    <td>{dato.fecha.split("T")[0]}</td>
                    <td>{dato.nombreEncargado}</td>
                    <td> {<AiOutlineSelect onClick={() => handleBusqueda(dato)} />} </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* <Modal isOpen={modalOpen3} size="lg" toggle={() => setModalOpen3(false)}>
        <ModalHeader>
          <Label>Productos: </Label>
          <Row>
            <Col md={"9"}>
              <Input
                onChange={(e) => {
                  setFiltroProductos(e.target.value);
                  if (e.target.value === "") {
                    fetchProduct();
                  }
                }}
              ></Input>
              <div className="d-flex justify-content-end"></div>
            </Col>
            <Col md={"1"}>
              <CButton color="success" onClick={() => filtroProducto(filtroProductos)} text="Filtro" />
            </Col>
          </Row>
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
              {dataProductos4.map((dato: ProductoExistencia, index) => (
                <tr key={index}>
                  <td>{dato.descripcion}</td>
                  <td>{dato.existencia}</td>
                  <td> {<Button onClick={() => handle(dato)}>Seleccionar</Button>} </td>
                </tr>
              ))}
            </tbody>
          </Table>{" "}
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpen3(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal> */}

      <Modal isOpen={modalOpen3} size="lg" toggle={() => setModalOpen3(false)}>
        <ModalHeader></ModalHeader>
        <ModalBody>
          <div style={{ height: 300, width: "100%" }}>
            <MaterialReactTable
              columns={columns}
              data={dataProductosConAcciones}
              initialState={{
                density: "compact",
                showGlobalFilter: false,
                pagination: {
                  pageSize: 5,
                  pageIndex: 0,
                },
              }}
              muiTableBodyRowProps={{
                sx: {
                  height: "10px",
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  p: "2px 16px",
                },
              }}
              renderTopToolbarCustomActions={({ table }) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Input
                    onChange={(e) => {
                      setFiltroProductos(e.target.value);
                      if (e.target.value === "") {
                        fetchProduct4();
                      }
                    }}
                    placeholder="Codigo de barras"
                  />
                  <AiOutlineBarcode style={{ fontSize: "24px" }} />
                </Box>
              )}
            />
          </div>
          <br />
          <br />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => setModalOpen3(false)}>
            Salir
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit} size="md">
        <ModalHeader> Editar compra </ModalHeader>
        <ModalBody>
          <Label> Producto: </Label>
          <Input disabled defaultValue={dataCompras.descripcion}></Input>
          <br />
          <br />
          <Row>
            <Col md={4} xs={4}>
              <Label>Costo Catalogo:</Label>
              <CurrencyInput
                className="custom-currency-input"
                prefix="$"
                name="costoUnitario"
                value={dataCompras.costoUnitario}
                disabled
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={(value) => handleValueChange("costoUnitario", value)}
              />
            </Col>
            <Col md={4} xs={4}>
              <Label>Unidad paquete:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="costoUnitario"
                value={dataCompras.unidad_paq}
                disabled
                onValueChange={(value) => handleValueChange("costoUnitario", value)}
              />
            </Col>
            <Col md={4} xs={4}>
              <Label>Unidad medida:</Label>
              <Input
                style={{ backgroundColor: "#fafafa" }}
                type="text"
                className="custom-currency-input"
                name="d_unidadMedida"
                value={dataCompras.descUnidadMedida}
                disabled
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Label>Costo Compra:</Label>
              <CurrencyInput
                className="custom-currency-input"
                prefix="$"
                name="costoCompra"
                value={dataCompras.costoCompra}
                decimalsLimit={2}
                onValueChange={(value) => handleValueChange("costoCompra", value)}
              />
            </Col>
            <Col>
              <Label>Cantidad:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="cantidad"
                value={dataCompras.cantidad}
                onValueChange={(value) => handleValueChange("cantidad", value)}
              />
            </Col>
            <Col>
              <Label>Bonificaciones:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="bonificaciones"
                value={dataCompras.bonificaciones}
                decimalsLimit={2}
                onValueChange={(value) => handleValueChange("bonificaciones", value)}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Label>Cantidad factura:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="bonificaciones"
                value={dataCompras.cantidadFactura}
                onValueChange={(value) => handleValueChange("cantidadFactura", value)}
              />
            </Col>
            <Col>
              <Label>Cantidad en mal estado:</Label>
              <CurrencyInput
                className="custom-currency-input"
                name="cantidadMalEstado"
                value={dataCompras.cantidadMalEstado}
                onValueChange={(value) => handleValueChange("cantidadMalEstado", value)}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="success"
            onClick={() => {
              setModalEdit(false);
              put();
            }}
            text="Guardar"
          />
          <CButton color="danger" onClick={() => setModalEdit(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={isOpen} size="xl">
        <ModalHeader><h3>Búsqueda</h3></ModalHeader>
        <ModalBody>
          <Row>
            <Col md={2}>
              <Label>Fecha inicio: </Label>
            </Col>
            <Col md={4}>
              <Input type="date" onChange={handleChangeFechas} defaultValue={formFechas.fecha1} name="fecha1"></Input>
            </Col>
            <Col md={2}>
              <Label>Fecha final: </Label>
            </Col>
            <Col md={4}>
              <Input type="date" onChange={handleChangeFechas} defaultValue={formFechas.fecha2} name="fecha2"></Input>
            </Col>
          </Row>
          <br />
          <Container>
            <Table size="xl" striped={true} responsive={"xl"}>
              <thead>
                <tr>
                  {TableDataHeaderComprasSeleccion.map((valor: any) => (
                    <th key={valor}>{valor}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataComprasSeleccion.map((dato: CompraSeleccion, index) => (
                  <tr key={index}>
                    <td> {<AiOutlineSelect onClick={() => handleBusqueda(dato)} />} </td>
                    <td>{dato.id_compra}</td>
                    <td>{dato.nombre}</td>
                    <td>{dato.items}</td>
                    <td>{"$" + dato.importe.toFixed(2)}</td>
                    <td>{dato.Estatus}</td>
                    <td>{dato.fecha.split("T")[0]}</td>
                    <td>{dato.nombreEncargado}</td>


                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalImpresion} size="md">
        <ModalHeader>
          <Label>Productos: </Label>
          <TicketPrint>
            <Impresion></Impresion>
          </TicketPrint>
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalImpresion(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Compras;
