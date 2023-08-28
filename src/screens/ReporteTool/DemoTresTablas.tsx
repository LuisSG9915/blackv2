import React, { useState, useEffect, useMemo } from "react";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import { AccordionBody, AccordionHeader, AccordionItem, Button, Col, Container, Input, Label, Row, UncontrolledAccordion } from "reactstrap";
import { AiFillFileExcel, AiOutlineFileExcel, AiOutlineFileText } from "react-icons/ai";
import "../../../css/reportes.css";
import { ExportToCsv } from "export-to-csv";
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from "material-react-table";
import { Padding } from "@mui/icons-material";
import axios from "axios";
import { UserResponse } from "../../models/Home";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCortesEmail } from "../../hooks/getsHooks/useCortesEmail";
import { CorteA, CorteB, CorteC } from "../../models/CortesEmail";

function DemoTresTablas() {
  const [reportes, setReportes] = useState([]);
  const [columnas, setColumnas] = useState([]);

  const [reportesTabla2, setReportesTabla2] = useState([]);
  const [columnasTabla2, setColumnasTabla2] = useState([]);

  const [reportesTabla3, setReportesTabla3] = useState([]);
  const [columnasTabla3, setColumnasTabla3] = useState([]);

  //TABLA 1
  useEffect(() => {
    // Realizar la solicitud GET a la API
    fetch("http://cbinfo.no-ip.info:9089/Cia?id=0")
      // fetch("http://cbinfo.no-ip.info:9089/Usuario?id=0")
      .then((response) => response.json())
      .then((responseData) => {
        setReportes(responseData);

        // Construir las columnas dinámicamente a partir de la primera entrada de reportes
        if (responseData.length > 0) {
          const columnKeys = Object.keys(responseData[0]);
          const columns = columnKeys.map((key) => ({
            accessorKey: key,
            header: key,
            // size: 200,
            flex: 1,
          }));
          setColumnas(columns);
        }
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);

  //TABLA 2
  useEffect(() => {
    // Realiza la solicitud GET a la API para la Tabla 2
    fetch("http://cbinfo.no-ip.info:9089/Usuario?id=0")
      .then((response) => response.json())
      .then((responseData) => {
        setReportesTabla2(responseData);

        // Construye las columnas dinámicamente a partir de la primera entrada de reportes
        if (responseData.length > 0) {
          const columnKeys = Object.keys(responseData[0]);
          const columns = columnKeys.map((key) => ({
            accessorKey: key,
            header: key,
            flex: 1,
          }));
          setColumnasTabla2(columns);
        }
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);

  //TABLA 3
  useEffect(() => {
    // Realiza la solicitud GET a la API para la Tabla 2
    fetch("http://cbinfo.no-ip.info:9089/Venta?id=0")
      .then((response) => response.json())
      .then((responseData) => {
        setReportesTabla3(responseData);

        // Construye las columnas dinámicamente a partir de la primera entrada de reportes
        if (responseData.length > 0) {
          const columnKeys = Object.keys(responseData[0]);
          const columns = columnKeys.map((key) => ({
            accessorKey: key,
            header: key,
            flex: 1,
          }));
          setColumnasTabla3(columns);
        }
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);

  const handleExportData = () => {
    const csvOptions = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: columnas.map((col) => col.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(reportes);
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
    axios
      .post("http://localhost:3001/send-email", {
        to: "luis.sg9915@gmail.com, desarrollo01@cbinformatica.net",
        subject: "HOLA MUNDO",
        text: "HLOI",
        sucursal: dataUsuarios2[0]?.sucursal,
        fecha: new Date(),
      })
      .then(() => alert("Correo enviado correctamente"));
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
        header: "Forma de pago",
        size: 5,
      },
      {
        accessorKey: "Importe",
        header: "Importe",
        size: 5,
      },
    ],
    []
  );

  const columnsB: MRT_ColumnDef<CorteB>[] = useMemo(
    () => [
      {
        accessorKey: "FechaCita",
        header: "Fecha de cita",
        size: 1,
        Cell: ({ cell }) => {
          return cell.row.original.FechaCita.split("T")[0];
        },
      },
      {
        accessorKey: "DescripcionCita",
        header: "Descripcion de cita",
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
  return (
    <>
      <Row>
        <SidebarHorizontal></SidebarHorizontal>
      </Row>

      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Corte <AiOutlineFileText size={30} /></h1>

        </div>
        <Row>
          <Col xs={2}>
            <Input
              id="exampleDate"
              name="date"
              placeholder="date placeholder"
              type="date"
              max={today}
              defaultValue={new Date().toISOString().split("T")[0]}
              onChange={(value) => {
                setFechaPost(new Date(value.target.value));
              }}
            />
          </Col>
          <Col xs={1}>
            <Button onClick={() => sendEmail()}>Enviar correo</Button>
          </Col>
        </Row>
        <br />
        {/* <UncontrolledAccordion defaultOpen="2">
          <AccordionItem>
            <AccordionHeader targetId="1">filtros</AccordionHeader>
            <AccordionBody accordionId="1">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div>
                  <Label>Reporte</Label>
                  <Input type="text"></Input>
                </div>
              </div>
              <div className="formulario">
                <div>
                  <Label>Fecha inicial</Label>
                  <Input type="date"></Input>
                </div>
                <div>
                  <Label>Fecha final</Label>
                  <Input type="date"></Input>
                </div>
                <div>
                  <Label>Sucursal</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  <Label>Compañia</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  <Label>Cliente</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  <Label>Almacen</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  <Label>Tipo de movimiento</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  <Label>Proveedor</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  <Label>Estilista</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  <Label>Metodo de pago</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  <Label>Empresa</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  <Label>Sucursal destino</Label>
                  <Input type="text"></Input>
                </div>
              </div>
              <br />

              <div className="d-flex justify-content-end ">
                <Button className="ml-auto">Consultar</Button>
              </div>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion> */}
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
    </>
  );
}

export default DemoTresTablas;
