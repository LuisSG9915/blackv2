import React, { useState, useEffect } from "react";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Container,
  Input,
  Label,
  Row,
  UncontrolledAccordion,
} from "reactstrap";
import { AiFillFileExcel, AiOutlineFileExcel, AiOutlineFileText } from "react-icons/ai";
import "../../../css/reportes.css";
import { ExportToCsv } from "export-to-csv";
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from "material-react-table";
import { Padding } from "@mui/icons-material";

function DemoTresTablas() {
  const [reportes, setReportes] = useState([]);
  const [columnas, setColumnas] = useState([]);

  const [reportesTabla2, setReportesTabla2] = useState([]);
  const [columnasTabla2, setColumnasTabla2] = useState([]);

  const [reportesTabla3, setReportesTabla3] = useState([]);
  const [columnasTabla3, setColumnasTabla3] = useState([]);

  useEffect(() => {
    fetch("http://cbinfo.no-ip.info:9089/Cia?id=0")
      .then((response) => response.json())
      .then((responseData) => {
        setReportes(responseData);

        // Construir las columnas dinámicamente a partir de la primera entrada de reportes
        if (responseData.length > 0) {
          const columnKeys = Object.keys(responseData[0]);
          const columns = columnKeys.map((key) => ({
            accessorKey: key,
            header: key,
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
            // size: "flex",
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

  return (
    <>
      <Row>
        <SidebarHorizontal></SidebarHorizontal>
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> DEMO </h1>
          <AiOutlineFileText size={30}></AiOutlineFileText>
        </div>
        <UncontrolledAccordion defaultOpen="2">
          <AccordionItem>
            <AccordionHeader targetId="1">filtros</AccordionHeader>
            <AccordionBody accordionId="1">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div>
                  {" "}
                  <Label>Reporte</Label>
                  <Input type="text"></Input>
                </div>
              </div>
              <div className="formulario">
                <div>
                  {" "}
                  <Label>Fecha inicial</Label>
                  <Input type="date"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Fecha final</Label>
                  <Input type="date"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Sucursal</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Compañia</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Cliente</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Almacen</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Tipo de movimiento</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Proveedor</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Estilista</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Metodo de pago</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  {" "}
                  <Label>Empresa</Label>
                  <Input type="text"></Input>
                </div>
                <div>
                  {" "}
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
        </UncontrolledAccordion>
        <hr />
      </Container>
      <Container style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ width: "400px", overflow: "auto" }}>
          <div className="juntos"></div>
          <MaterialReactTable
            columns={columnas.map((col) => ({
              ...col,
              //size: "flex", // Establecer el tamaño de la columna como flex: 1
            }))}
            data={reportes} // Reemplaza "reportes1" con tus datos de la primera tabla
            enableRowSelection={false}
            rowSelectionCheckboxes={false}
            initialState={{ density: "compact" }}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <h4>EMPRESAS</h4>
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
            columns={columnasTabla2.map((col) => ({
              ...col,
              //size: "flex", // Establecer el tamaño de la columna como flex: 1
            }))}
            data={reportesTabla2} // Reemplaza "reportes1" con tus datos de la primera tabla
            enableRowSelection={false}
            rowSelectionCheckboxes={false}
            initialState={{ density: "compact" }}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <h4>USUARIOS</h4>
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
            columns={columnasTabla3.map((col) => ({
              ...col,
              //size: "flex", // Establecer el tamaño de la columna como flex: 1
            }))}
            data={reportesTabla3} // Reemplaza "reportes1" con tus datos de la primera tabla
            enableRowSelection={false}
            rowSelectionCheckboxes={false}
            initialState={{ density: "compact" }}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <h4>VENTAS</h4>
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
