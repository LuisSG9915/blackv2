import React from "react";
import { AnticipoGet } from "../../../models/Anticipo";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "reactstrap";
interface Props {
  dataAnticipos: AnticipoGet[];
  anticipoSelectedFunction: (params: any) => void;
}
function TableAnticipos({ dataAnticipos, anticipoSelectedFunction }: Props) {
  const getRowId = (row: AnticipoGet) => row.id;
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 1, // Ancho flexible
      minWidth: 120, // Ancho mínimo
      headerClassName: "custom-header",
    },
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
            anticipoSelectedFunction(params);
          }}
        >
          Seleccionar
        </Button>
      </>
    );
  };

  return (
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
  );
}

export default TableAnticipos;
