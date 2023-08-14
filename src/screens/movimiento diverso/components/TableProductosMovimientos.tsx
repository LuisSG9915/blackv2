import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Input, Label, Row, InputGroup, Table, Container } from "reactstrap";
import { useProductos } from "../../../hooks/getsHooks/useProductos";
import { Producto, ProductoExistencia } from "../../../models/Producto";
import { Venta } from "../../../models/Venta";
import CButton from "../../../components/CButton";
import { useGentlemanContext } from "../../ventas/context/VentasContext";
import { MovimientoResponse } from "../../../models/MovimientoDiversoModel";
import { Movimiento } from "../../../models/Movimiento";
import Swal from "sweetalert2";
import { useProductosFiltradoExistenciaProducto } from "../../../hooks/getsHooks/useProductosFiltradoExistenciaProducto";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import { AiOutlineBarcode } from "react-icons/ai";

interface Props {
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  form: Movimiento;
  setform: React.Dispatch<React.SetStateAction<Movimiento>>;
  productoSelected: Number[];
  sucursal: number;
}
export interface Estilistas {
  id: number;
  estilista: string;
}

const TableProductosMovimientos = ({ setModalOpen2, form, setform, productoSelected, sucursal }: Props) => {
  const TableDataHeader = ["Productos", "Existencias", "Acción"];
  const [filtroProductos, setFiltroProductos] = useState("");
  const { dataProductos4, fetchProduct4, setDataProductos4 } = useProductosFiltradoExistenciaProducto({
    descripcion: filtroProductos,
    insumo: 2,
    inventariable: 2,
    obsoleto: 0,
    servicio: 0,
    sucursal: sucursal,
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

  const filtroProducto = (datoMedico: string) => {
    var resultado = dataProductos4.filter((elemento: ProductoExistencia) => {
      // Aplica la lógica del filtro solo si hay valores en los inputs
      if (
        (datoMedico === "" || elemento.descripcion.toLowerCase().includes(datoMedico.toLowerCase())) &&
        elemento.descripcion.length > 2
      ) {
        return elemento;
      }
    });
    setDataProductos4(resultado);
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
    // () => [
    //   {
    //     accessorKey: "descripcion",
    //     header: "Productos",
    //   },
    //   {
    //     accessorKey: "existencia",
    //     header: "Existencias",
    //   },
    //   {
    //     accessorKey: "id", // Usamos "id" para identificar cada fila de manera única
    //     header: "Acción",
    //     customComponent: ({ row }) => <Button onClick={() => handle(row)}>Seleccionar</Button>,
    //   },
    // ],
    // []
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

      // {
      //   accessorKey: "precio",
      //   header: "Precio",
      //   Cell: ({ cell }) => (
      //     <span>
      //       ${cell.getValue<number>().toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      //     </span>
      //   ),
      // },

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
      <Container>
        {/* <Row>
          <Label>Búsqueda: </Label>
          <InputGroup>
            <Input
              onChange={(e) => {
                setFiltroProductos(e.target.value);
                if (e.target.value === "") {
                  fetchProduct4();
                }
              }}
            ></Input>

            <CButton color="success" onClick={() => filtroProducto(filtroProductos)} text="Filtro" />
          </InputGroup>
        </Row> */}
        <br />
        {/* <Table size="lg" striped={true} responsive={"sm"}>
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
        </Table> */}
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
      </Container>
    </>
  );
};

export default TableProductosMovimientos;
