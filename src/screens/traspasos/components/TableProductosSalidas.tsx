// import React, { useEffect, useState } from "react";
// import { Button, Col, Input, Label, Row, Table } from "reactstrap";
// import { useProductos } from "../../../hooks/getsHooks/useProductos";
// import { Producto, ProductoExistencia } from "../../../models/Producto";
// import CButton from "../../../components/CButton";
// import { useGentlemanContext } from "../../ventas/context/VentasContext";
// import { Traspaso } from "../../../models/Traspaso";
// import Swal from "sweetalert2";
// import { useProductosFiltradoExistencia } from "../../../hooks/getsHooks/useProductosFiltradoExistencia";
// import { UserResponse } from "../../../models/Home";

// interface Props {
//   setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
//   setForm: React.Dispatch<React.SetStateAction<Traspaso>>;
//   form: Traspaso;
//   productoSelected: Number[];
//   sucursal: number;
// }
// export interface Estilistas {
//   id: number;
//   estilista: string;
// }
// const TableProductosSalidas = ({ setModalOpen2, setForm, form, productoSelected, sucursal }: Props) => {
//   const TableDataHeader = ["Productos", "Existencias", ""];

//   const { dataProductos3, fetchProduct3, setDataProductos3 } = useProductosFiltradoExistencia({
//     descripcion: "%",
//     insumo: 0,
//     inventariable: 2,
//     obsoleto: 0,
//     servicio: 0,
//     sucursal: sucursal,
//   });

//   const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();

//   const handle = (dato: Producto) => {
//     if (productoSelected.includes(dato.clave_prod)) {
//       Swal.fire({
//         icon: "info",
//         text: "Este producto ya se encuentra seleccionado, verifique",
//       }).then(() => {
//         setForm({ ...form, d_producto: "" });
//       });
//     } else if (dato.existencia <= 0) {
//       Swal.fire({
//         icon: "info",
//         text: "Este producto no tiene inventario",
//       }).then(() => {
//         setForm({ ...form, d_producto: "" });
//       });
//     } else {
//       setForm({
//         ...form,
//         clave_prod: dato.id,
//         costo: dato.costo_unitario,
//         d_producto: dato.descripcion,
//         precio: dato.precio,
//         d_existencia: dato.existencia,
//       });
//       setModalOpen2(false);
//     }
//   };

//   const [filtroProductos, setFiltroProductos] = useState("");

//   const filtroProducto = (datoMedico: string) => {
//     var resultado = dataProductos3.filter((elemento: ProductoExistencia) => {
//       // Aplica la lógica del filtro solo si hay valores en los inputs
//       if ((datoMedico === "" || elemento.descripcion.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.descripcion.length > 2) {
//         return elemento;
//       }
//     });
//     setDataProductos3(resultado);
//   };

//   // TODO Filtro de productos
//   return (
//     <>
//       <Label>Productos: </Label>
//       <Row>
//         <Col md={"9"}>
//           <Input
//             onChange={(e) => {
//               setFiltroProductos(e.target.value);
//               if (e.target.value === "") {
//                 fetchProduct3();
//               }
//             }}
//           ></Input>
//           <div className="d-flex justify-content-end"></div>
//         </Col>
//         <Col md={"1"}>
//           <CButton color="success" onClick={() => filtroProducto(filtroProductos)} text="Filtro" />
//         </Col>
//       </Row>
//       <br />
//       <br />
//       <Table size="sm" striped={true} responsive={"sm"}>
//         <thead>
//           <tr>
//             {TableDataHeader.map((valor: any) => (
//               <th key={valor}>{valor}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {dataProductos3.map((dato: ProductoExistencia, index) => (
//             <tr key={index}>
//               <td>{dato.descripcion}</td>
//               <td>{dato.existencia}</td>
//               <td> {<Button onClick={() => handle(dato)}>Seleccionar</Button>} </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </>
//   );
// };

// export default TableProductosSalidas;
import React, { useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { useProductosFiltradoExistencia } from "../../../hooks/getsHooks/useProductosFiltradoExistencia";
import CButton from "../../../components/CButton";
import { Traspaso } from "../../../models/Traspaso";
import Swal from "sweetalert2";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import { AiOutlineBarcode } from "react-icons/ai";
import { useProductosFiltradoExistenciaAlm } from "../../../hooks/getsHooks/useProductosFiltradoExistenciaAlm";

interface Props {
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  setForm: React.Dispatch<React.SetStateAction<Traspaso>>;
  form: Traspaso;
  productoSelected: number[];
  sucursal: number;
  cia: number;
}

const TableProductosSalidas = ({ setModalOpen2, setForm, form, productoSelected, sucursal, cia }: Props) => {
  const [filtroProductos, setFiltroProductos] = useState("");
  const { dataProductos3, fetchProduct3 } = useProductosFiltradoExistenciaAlm({
    descripcion: filtroProductos,
    insumo: 0,
    inventariable: 2,
    obsoleto: 0,
    servicio: 0,
    sucursal: sucursal,
    almacen: form.almacenOrigen,
    idCliente: 29003,
    cia: cia,
  });

  const handle = (dato: any) => {
    if (productoSelected.includes(dato.clave_prod)) {
      Swal.fire({
        icon: "info",
        text: "Este producto ya se encuentra seleccionado, verifique",
      }).then(() => {
        setForm((prevForm) => ({ ...prevForm, d_producto: "" }));
      });
    } else if (dato.existencia <= 0) {
      Swal.fire({
        icon: "info",
        text: "Este producto no tiene inventario",
      }).then(() => {
        setForm((prevForm) => ({ ...prevForm, d_producto: "" }));
      });
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        clave_prod: dato.id,
        costo: dato.costo_unitario,
        d_producto: dato.descripcion,
        precio: dato.precio,
        d_existencia: dato.existencia,
      }));
      setModalOpen2(false);
    }
  };

  const columns: MRT_ColumnDef<any>[] = [
    { accessorKey: "descripcion", header: "Productos", size: 2 },
    { accessorKey: "existencia", header: "Existencias", size: 1 },
    {
      accessorKey: "acciones",
      header: "",
      size: 1,
      Cell: ({ cell }) => (
        <Button size="sm" onClick={() => handle(cell.row.original)}>
          Seleccionar
        </Button>
      ),
    },
  ];

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={dataProductos3}
        renderEmptyRowsFallback={() => <p align="center">Cargando...</p>}
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
                  fetchProduct3();
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

export default TableProductosSalidas;
