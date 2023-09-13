import React, { useMemo, useState } from "react";
import { Button, Input, Container } from "reactstrap";
import { ProductoExistencia } from "../../../models/Producto";
import { Movimiento } from "../../../models/Movimiento";
import Swal from "sweetalert2";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import { AiOutlineBarcode } from "react-icons/ai";
import { useProductosFiltradoExistenciaProductoAlm } from "../../../hooks/getsHooks/useProductosFiltradoExistenciaProductoAlm";

interface Props {
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  form: Movimiento;
  setform: React.Dispatch<React.SetStateAction<Movimiento>>;
  productoSelected: Number[];
  sucursal: number;
  almacenId: number;
  cia: number;
}
export interface Estilistas {
  id: number;
  estilista: string;
}

const TableProductosMovimientos = ({ setModalOpen2, form, setform, productoSelected, sucursal, almacenId, cia }: Props) => {
  const [filtroProductos, setFiltroProductos] = useState("");
  const { dataProductos4, fetchProduct4, setDataProductos4 } = useProductosFiltradoExistenciaProductoAlm({
    descripcion: filtroProductos,
    insumo: 2,
    inventariable: 2,
    obsoleto: 0,
    servicio: 0,
    sucursal: sucursal,
    almacen: almacenId,
    cia: cia,
    idCliente: 0,
  });

  // Se agrego estos nuevos parametros a nuestro context para pdoder ser usado en otras screens
  // Se creo un nuevo folder para agregar el componente de la tabla y se consumido por la screen de MovimientoDiversos
  // Luego se agregaron nuevos parametros que se consumiran en mis pantalla dde TableProductosMovimientos Y MovimientoDiversos

  const handle = (dato: ProductoExistencia) => {
    if (productoSelected.includes(Number(dato.id))) {
      Swal.fire({
        icon: "info",
        text: "Este producto ya se encuentra seleccionado, verifique",
      }).then(() => {
        setform({ ...form, d_producto: "" });
      });
    } else {
      setform({
        ...form,
        clave_prod: dato.id,
        costo: dato.costo_unitario,
        precio: dato.precio,
        d_producto: dato.descripcion,
        d_existencia: dato.existencia,
      });
    }
    setModalOpen2(false);
  };

  // TODO Filtro de productos
  const dataProductosConAcciones = dataProductos4.map((dato: ProductoExistencia) => ({
    ...dato,
    acciones: (
      <Button size="sm" onClick={() => handle(dato)}>
        Seleccionar
      </Button>
    ),
  }));

  const columns = useMemo<MRT_ColumnDef<ProductoExistencia>[]>(
    () => [
      {
        accessorKey: "descripcion",
        header: "Productos",
        size: 200,
      },
      {
        accessorKey: "marca",
        header: "Marca",
        size: 150,
      },
      {
        accessorKey: "existencia",
        header: "Existencias",
        size: 150,
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
              placeholder="Código de barras"
              onChange={(e) => {
                setFiltroProductos(e.target.value);
                if (e.target.value === "") {
                  fetchProduct4();
                }
              }}
            />
            <AiOutlineBarcode style={{ fontSize: "24px" }} />
          </Box>
        )}
      />
    </>
  );
};

export default TableProductosMovimientos;
