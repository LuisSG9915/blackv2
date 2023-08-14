import React, { useState, useEffect, useMemo } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Container,
  Card,
  InputGroup,
  Alert,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Input,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Col,
  Button,
} from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import { Marca } from "../../models/Marca";
import { ImCancelCircle } from "react-icons/im";
import { Cancelacion } from "../../models/Cancelacion";
import { useCancelaciones } from "../../hooks/getsHooks/useCancelaciones";
import { TiCancel } from "react-icons/ti";
import { Usuario } from "../../models/Usuario";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
function CancelacionVentas() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [filtroValorMedico, setFiltroValorMedico] = useState("");
  const [dataUsuarios, setDataUsuarios] = useState<Usuario[]>([]);

  const navigate = useNavigate();
  const [form, setForm] = useState<Cancelacion>({
    No_venta: 1,
    Sucursal: 1,
    nombre: "",
    Total: 1,
    Estatus: "",
  });
  const [datos, setDatos] = useState([]);
  const [noVentaForm, setNoVentaForm] = useState("");

  const DataTableHeader = ["No. Venta", "Cliente", "Total Venta", "Estado", "Acciones"];

  const mostrarModalActualizar = (dato: Marca) => {
    setForm(dato);
    console.log(dato);
    setModalActualizar(true);
  };

  /* alertas */
  const [eliminado, setVisible3] = useState(false);

  const deleteVenta = (dato: Cancelacion) => {
    const idsCanceladas = dataCancelaciones.filter((item: Cancelacion) => item.Estatus === "Cancelada").map((item: Cancelacion) => item.No_venta);
    if (idsCanceladas.includes(Number(dato.No_venta))) {
      alert("Venta ya cancelada");
    } else {
      const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.No_venta}`);
      if (opcion) {
        jezaApi
          .delete(`/VentaDia?no_venta=${dato.No_venta}&suc=21`)
          .then((response) => {
            setVisible3(true);
            fetchCancelaciones();

            setModalActualizar(false);
          })

          .catch((c) => console.log(c));
      }
      setTimeout(() => {
        setVisible3(false);
      }, 3000);
    }
  };

  const getCancelacionesVtas = () => {
    jezaApi.get("/VentaCanceladas?id=0").then((response) => {
      setDatos(response.data);
    });
  };

  useEffect(() => {
    getCancelacionesVtas();
  }, []);

  const filtroEmail = (datoMedico: string) => {
    var resultado = datos.filter((elemento: Marca) => {
      if (elemento.marca && (datoMedico === "" || elemento.marca.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.marca.length > 1) {
        return elemento;
      }
    });
    setDatos(resultado);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: Cancelacion) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const { dataCancelaciones, fetchCancelaciones } = useCancelaciones();
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

  useEffect(() => {
    const item = localStorage.getItem("userLogged");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios(parsedItem);
    }
  }, []);

  const columns: MRT_ColumnDef<Cancelacion>[] = useMemo(
    () => [
      {
        accessorKey: "acciones",
        header: "Acción",
        size: 100,
        Cell: ({ cell }) => (
          <>
            {cell.row.original.Estatus === "Pagada" ? (
              <AiFillDelete color="lightred" onClick={() => deleteVenta(cell.row.original)} size={23} />
            ) : (
              <TiCancel
                size={23}
                color="grey"
                onClick={() => {
                  alert("Venta ya cancelada");
                }}
              />
            )}
          </>
        ),
      },

      {
        accessorKey: "No_venta",
        header: "No. venta",
        size: 5,
      },
      {
        accessorKey: "nombre",
        header: "Cliente",
        size: 5,
      },
      {
        accessorKey: "Total",
        header: "Total venta",

        Cell: ({ cell }) => <p>${cell.getValue<number>().toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>,
        muiTableBodyCellProps: {
          align: "right",
        },
        muiTableHeadCellProps: {
          align: "right",
        },
        size: 1,
      },
      {
        accessorKey: "Estatus",
        header: "Estado",
        size: 150,
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

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <Alert color="success" isOpen={eliminado} toggle={() => setVisible3(false)}>
          Venta cancelada con éxito....
        </Alert>
        <br />
        <Row md={8}>
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1> Cancelación de la venta </h1>
              <ImCancelCircle size={30}></ImCancelCircle>
            </div>
          </Col>
        </Row>
        <br />
        <br />
        <MaterialReactTable columns={columns} data={dataCancelaciones} initialState={{ density: "compact" }} />
        <br />
        <br />
      </Container>
    </>
  );
}

export default CancelacionVentas;
