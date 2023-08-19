import React, { useState, useMemo, useEffect } from "react";
import { Button, Col, Container, Input, Label, Row } from "reactstrap";
import { CircularProgress } from "@mui/material";
import { useProductosFiltradoExistenciaProducto } from "../../../hooks/getsHooks/useProductosFiltradoExistenciaProducto";
import Swal from "sweetalert2";
import { Venta } from "../../../models/Venta";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import { AiOutlineBarcode } from "react-icons/ai";

interface Props {
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  sucursal: number;
  productoSelected: Number[];
  setDataVentaEdit: React.Dispatch<React.SetStateAction<Venta>>;
  dataVentaEdit: Venta;
  dataTemporal: Venta;
  setDataTemporal: React.Dispatch<React.SetStateAction<Venta>>;
}

export interface ProductoExistencia {
  // Define la interfaz ProductoExistencia según tu modelo actual
  id: number;
  descripcion: string;
  existencia: number;
  precio: number;
  es_servicio: boolean;
  tiempo?: string;
  // ... otros campos según tu modelo actual
}

const TableProductos = ({ setModalOpen2, sucursal, productoSelected, dataVentaEdit, setDataVentaEdit, dataTemporal, setDataTemporal }: Props) => {
  // const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();

  const handle = (dato: ProductoExistencia) => {
    if (productoSelected.includes(Number(dato.id))) {
      Swal.fire({
        icon: "info",
        text: "Este producto ya se encuentra seleccionado, verifique",
      });
    } else {
      if (dato.es_servicio) {
        setModalOpen2(false);
        setDataTemporal({
          ...dataTemporal,
          producto: dato.descripcion,
          tiempo: dato.tiempo,
          Precio: dato.precio,
          Clave_prod: dato.id,
          Observacion: "SERV",
          d_existencia: dato.existencia,
        });
        setDataVentaEdit({
          ...dataVentaEdit,
          d_producto: dato.descripcion,
          tiempo: dato.tiempo,
          Precio: dato.precio,
          Clave_prod: dato.id,
          Observacion: "SERV",
          d_existencia: dato.existencia,
        });
      } else {
        setModalOpen2(false);
        setDataTemporal({
          ...dataTemporal,
          producto: dato.descripcion,
          tiempo: dato.tiempo,
          Precio: dato.precio,
          Clave_prod: dato.id,
          Observacion: "x",
          d_existencia: dato.existencia,
        });
        setDataVentaEdit({
          ...dataVentaEdit,
          d_producto: dato.descripcion,
          tiempo: dato.tiempo,
          Precio: dato.precio,
          Clave_prod: dato.id,
          Observacion: "x",
          d_existencia: dato.existencia,
        });
      }
    }
  };

  const [filtroProductos, setFiltroProductos] = useState("");
  const [productoFilter, setProductoFilter] = useState({
    insumo: 0,
    inventariable: 2,
    obsoleto: 0,
    servicio: 0,
  });
  const { dataProductos4, fetchProduct4, isLoading } = useProductosFiltradoExistenciaProducto({
    descripcion: filtroProductos,
    insumo: productoFilter.insumo,
    inventariable: productoFilter.inventariable,
    obsoleto: productoFilter.obsoleto,
    servicio: productoFilter.servicio,
    sucursal: sucursal,
  });

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
        accessorKey: "precio",
        header: "Precio",
        Cell: ({ cell }) => <span>${cell.getValue<number>().toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
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
  const [state, setState] = useState(true);

  // useEffect(() => {
  //   fetchProduct4();
  // }, [state]);

  return (
    <Container>
      <Label></Label>
      <Row>
        <Col style={{ marginRight: 10 }} xs={1}>
          {state ? <p>Productos</p> : <p>Servicios</p>}
        </Col>
        <Col xs={1}>
          <Input
            checked={state}
            type="switch"
            role="switch"
            onClick={() => {
              setState(!state);
              if (state === false) {
                setProductoFilter({ insumo: 0, inventariable: 2, obsoleto: 0, servicio: 0 });
              } else {
                setProductoFilter({ insumo: 0, inventariable: 0, obsoleto: 0, servicio: 2 });
              }
            }}
          />
        </Col>
        <Col xs={1}>{isLoading ? <CircularProgress size={20} /> : null}</Col>
      </Row>
      <MaterialReactTable
        columns={columns}
        data={dataProductosConAcciones}
        state={{
          isLoading: isLoading,
        }}
        initialState={{
          density: "compact",
          showGlobalFilter: false,
          pagination: {
            pageSize: 5,
            pageIndex: 0,
          },
          sorting: [{ id: "descripcion", desc: false }],
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
    </Container>
  );
};

export default TableProductos;
