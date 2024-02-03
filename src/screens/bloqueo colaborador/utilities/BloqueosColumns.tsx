import { GridColDef } from "@mui/x-data-grid";

export const columnsBloqueos: GridColDef[] = [

  {
    field: "actions",
    headerName: "Acciones",
    flex: 1,
    renderCell: (params) => (
      <>
        {/* <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row as Descuento)} size={23}></AiFillEdit> */}
        {/* <AiFillDelete color="lightred" onClick={() => eliminar(params.row as Descuento)} size={23}></AiFillDelete> */}
      </>
    ),
  },
  { field: "descripcionBloqueo", headerName: "Descripción", flex: 1 },
  { field: "estilista", headerName: "Minimo descuento", flex: 1 },
  { field: "h1", headerName: "Máximo descuento", flex: 1 },
  { field: "h2", headerName: "Máximo descuento", flex: 1 },
  { field: "usuarioRegistro", headerName: "Máximo descuento", flex: 1 },
];
