import { useState, useEffect, useMemo } from "react";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import { Button, Col, Container, Input, Row } from "reactstrap";
import { AiFillFileExcel, AiOutlineFileExcel, AiOutlineFileText } from "react-icons/ai";
import "../../../css/reportes.css";
import { ExportToCsv } from "export-to-csv";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import axios from "axios";
import { UserResponse } from "../../models/Home";
import { useCortesEmail } from "../../hooks/getsHooks/useCortesEmail";
import { CorteA, CorteB, CorteC } from "../../models/CortesEmail";
import { PieChart } from "@mui/x-charts/PieChart";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jezaApi } from "../../api/jezaApi";
import { format } from "date-fns";

function DemoTresTablas() {
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
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_Corte_view`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].permiso === false) {
          Swal.fire("Error!", "No tiene los permisos para ver esta pantalla", "error");
          setShowView(false);
          handleRedirect();
        } else {
          setShowView(true);
        }
      } else {
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

  const handleExportDataCorte1 = () => {
    const csvOptions = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: columnsA.map((col) => col.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(dataCorteEmailA);
  };
  const handleExportDataCorte2 = () => {
    const csvOptions = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: columnsB.map((col) => col.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(dataCorteEmailB);
  };

  const handleExportDataCorte3 = () => {
    const csvOptions = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: columnsC.map((col) => col.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(dataCorteEmailC);
  };

  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);
  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ dataUsuarios2 });
    }
  }, []);
  const [fechaPost, setFechaPost] = useState<Date>();
  const sendEmail = () => {
    const fechaSelected = fechaPost ? fechaPost : new Date();
    const fechaTemporal = format(fechaSelected, "yyyy-MM-dd");
    axios
      .post("https://cbinfo.no-ip.info:9086/send-email", {
        to: "luis.sg9915@gmail.com, desarrollo01@cbinformatica.net",
        subject: "Corte del dia",
        text: "HLOI",
        sucursal: dataUsuarios2[0]?.sucursal,
        fecha: fechaTemporal,
      })
      .then(() => alert("Correo enviado correctamente"))
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const { dataCorteEmailA, dataCorteEmailB, dataCorteEmailC, ColumnasA, ColumnasB, ColumnasC } = useCortesEmail({
    sucursal: dataUsuarios2[0]?.sucursal,
    fecha: fechaPost,
  });

  const columnsA: MRT_ColumnDef<CorteA>[] = useMemo(
    () => [
      {
        accessorKey: "FormadePago",
        header: "FormadePago",
        size: 10,
      },
      {
        accessorKey: "Importe",
        header: "Importe",
        size: 10,
      },
    ],
    []
  );

  const columnsB: MRT_ColumnDef<CorteB>[] = useMemo(
    () => [
      {
        accessorKey: "total_Servicios",
        header: "total_Servicios",
        size: 10,
      },
      {
        accessorKey: "servicios_Realizados",
        header: "servicios_Realizados",
        size: 10,
      },
      {
        accessorKey: "servicios_Agendados",
        header: "servicios_Agendados",
        size: 10,
      },
    ],
    []
  );
  const columnsC: MRT_ColumnDef<CorteC>[] = useMemo(
    () => [
      {
        accessorKey: "Responsable",
        header: "Responsable",
        maxSize: 1,
      },
      {
        accessorKey: "Servicio",
        header: "Servicio",
        size: 5,
      },
      {
        accessorKey: "Venta",
        header: "Venta",
        size: 10,
      },
      {
        accessorKey: "Color",
        header: "Color",
        size: 10,
      },
      {
        accessorKey: "Productos",
        header: "Productos",
        size: 10,
      },
    ],
    []
  );

  const arregloOriginal = [
    {
      FormadePago: "Aplicacion de Anticipos ",
      Importe: "$100.00",
    },
    {
      FormadePago: "Efectivo",
      Importe: "$350.00",
    },
    {
      FormadePago: "Total ",
      Importe: "$450.00",
    },
  ];
  const arregloConID = dataCorteEmailA.map((item, index) => ({
    id: index + 1, // Sumamos 1 para que los IDs comiencen desde 1
    value: item.Importe ? Number(item.Importe.replace("$", "").replace(",", "")) : 0,
    label: item.FormadePago,
  }));
  const arregloFormateado = arregloConID.slice(0, -1);

  const arregloCorte3Servicio = dataCorteEmailC.map((item, index) => ({
    id: index + 1,
    value: item.Servicio,
    label: item.Responsable,
  }));
  const arregloCorte3Venta = dataCorteEmailC.map((item, index) => ({
    id: index + 1,
    value: item.Venta,
    label: item.Responsable,
  }));

  return (
    <>
      <Row>
        <SidebarHorizontal></SidebarHorizontal>
      </Row>

      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1>
            {" "}
            Corte <AiOutlineFileText size={30} />
          </h1>
        </div>
        <Row>
          <Col xs={3}>
            <Input
              id="exampleDate"
              name="date"
              placeholder="date placeholder"
              type="date"
              max={today}
              defaultValue={new Date().toISOString().split("T")[0]}
              onChange={(value) => {
                alert(new Date(value.target.value));
                setFechaPost(new Date(value.target.value));
              }}
            />
          </Col>
          <Col xs={3}>
            <Button onClick={() => sendEmail()}>Enviar correo</Button>
          </Col>
        </Row>
        <br />

        <hr />
      </Container>
      <Container style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ width: "400px", overflow: "auto" }}>
          <div className="juntos"></div>
          <MaterialReactTable
            columns={columnsA}
            data={dataCorteEmailA} // Reemplaza "reportes1" con tus datos de la primera tabla
            enableRowSelection={false}
            rowSelectionCheckboxes={false}
            initialState={{ density: "compact" }}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <h4>Corte 1</h4>
                <Button
                  onClick={handleExportDataCorte1}
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
        <div style={{ width: "400px", overflow: "auto" }}>
          <div className="juntos"></div>
          <MaterialReactTable
            columns={columnsB}
            data={dataCorteEmailB} // Reemplaza "reportes1" con tus datos de la primera tabla
            enableRowSelection={false}
            rowSelectionCheckboxes={false}
            initialState={{ density: "compact" }}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <h4>Corte 2</h4>
                <Button
                  onClick={handleExportDataCorte2}
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
        <div style={{ width: "400px", overflow: "auto" }}>
          <div className="juntos"></div>
          <MaterialReactTable
            columns={columnsC}
            data={dataCorteEmailC} // Reemplaza "reportes1" con tus datos de la primera tabla
            enableRowSelection={false}
            rowSelectionCheckboxes={false}
            initialState={{ density: "compact" }}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <h4>Corte 3</h4>
                <Button
                  onClick={handleExportDataCorte3}
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
        <div>
          <h4>Corte 1 </h4>
          <PieChart
            series={[
              {
                arcLabel: (item) =>
                  `${item.label} (${item.value.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN", // Cambiamos a pesos mexicanos (MXN)
                  })})`,
                data: arregloFormateado,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 30, additionalRadius: -30 },
              },
            ]}
            width={450}
            height={350}
          />
        </div>
        <div>
          <h4>Corte 3 resumen de servicios</h4>
          <PieChart
            series={[
              {
                arcLabel: (item) => {
                  if (item.value > 10)
                    return `${item.label} (${item.value.toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN", // Cambiamos a pesos mexicanos (MXN)
                    })})`;
                },

                data: arregloCorte3Servicio,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 30, additionalRadius: -30 },
              },
            ]}
            width={450}
            height={350}
          />
        </div>

        <div>
          <h4>Corte 3 resumen de ventas</h4>
          <PieChart
            colors={["orange", "purple", "pink"]}
            series={[
              {
                arcLabel: (item) => {
                  if (item.value > 10)
                    return `${item.label} (${item.value.toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN", // Cambiamos a pesos mexicanos (MXN)
                    })})`;
                },

                data: arregloCorte3Venta,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 30, additionalRadius: -30 },
              },
            ]}
            width={450}
            height={350}
          />
        </div>
      </Container>
    </>
  );
}

export default DemoTresTablas;
