import React, { useState, useEffect } from "react";
import SidebarHorizontal from "../../components/SideBarHorizontal";
import { Button, Container, Input, Label, Row } from "reactstrap";
import { AiOutlineFileText } from "react-icons/ai";
import "../../../css/reportes.css";
import { ExportToCsv } from "export-to-csv";
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from "material-react-table";
import { Padding } from "@mui/icons-material";

function DemoTresTablas() {
  const [reportes, setReportes] = useState([]);
  const [columnas, setColumnas] = useState([]);

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
          <h1> Reportes </h1>
          <AiOutlineFileText size={30}></AiOutlineFileText>
        </div>
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
        <hr />
      </Container>
      <Container>
        <div>
          <div className="juntos">
            <h1>Tabla dinámica con Headers y Datos - Tabla 2</h1>
            <Button className="boton" onClick={handleExportData2}>
              Export Data 2
            </Button>
          </div>
          <MaterialReactTable
            columns={columnas.map((col) => ({
              ...col,
              size: "flex", // Establecer el tamaño de la columna como flex: 1
            }))}
            data={reportes2} // Reemplaza "reportes2" con tus datos de la segunda tabla
            enableRowSelection={false} // Deshabilitar la selección de filas
            rowSelectionCheckboxes={false} // Ocultar los checkboxes de selección
          />
        </div>

        <div>
          <div className="juntos">
            <h1>Tabla dinámica con Headers y Datos - Tabla 3</h1>
            <Button className="boton" onClick={handleExportData3}>
              Export Data 3
            </Button>
          </div>
          <MaterialReactTable
            columns={columnas.map((col) => ({
              ...col,
              size: "flex", // Establecer el tamaño de la columna como flex: 1
            }))}
            data={reportes3} // Reemplaza "reportes3" con tus datos de la tercera tabla
            enableRowSelection={false} // Deshabilitar la selección de filas
            rowSelectionCheckboxes={false} // Ocultar los checkboxes de selección
          />
        </div>
      </Container>
    </>
  );
}

export default DemoTresTablas;
