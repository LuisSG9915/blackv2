// import React, { useState } from "react";
// import { Button, Col, Input, Label, Row, Table } from "reactstrap";
// import { useGentlemanContext } from "../context/VentasContext";
// import { useProductos } from "../../../hooks/getsHooks/useProductos";
// import { Producto, ProductoExistencia } from "../../../models/Producto";
// import CButton from "../../../components/CButton";
// import { useProductosFiltradoExistenciaProducto } from "../../../hooks/getsHooks/useProductosFiltradoExistenciaProducto";
// import Swal from "sweetalert2";

// interface Props {
//   setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
//   sucursal: number;
//   productoSelected: Number[];
// }
// export interface Estilistas {
//   id: number;
//   estilista: string;
// }
// const TableProductos = ({ setModalOpen2, sucursal, productoSelected }: Props) => {
//   const TableDataHeader = ["Productos", "Existencias", ""];

//   const { dataProductos4, fetchProduct4, setDataProductos4 } = useProductosFiltradoExistenciaProducto({

//     descripcion: "%",
//     insumo: 0,
//     inventariable: 1,
//     obsoleto: 0,
//     servicio: 0,
//     sucursal: sucursal,
//   });
//   const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();

//   const handle = (dato: ProductoExistencia) => {
//     if (productoSelected.includes(Number(dato.id))) {
//       Swal.fire({
//         icon: "info",
//         text: "Este producto ya se encuentra seleccionado, verifique",
//       });
//     } else {
//       if (dato.es_servicio) {
//         setModalOpen2(false);
//         setDataTemporal({
//           ...dataTemporal,
//           producto: dato.descripcion,
//           tiempo: dato.tiempo,
//           Precio: dato.precio,
//           Clave_prod: dato.id,
//           Observacion: "SERV",
//           d_existencia: dato.existencia,
//         });
//       } else {
//         setModalOpen2(false);
//         setDataTemporal({
//           ...dataTemporal,
//           producto: dato.descripcion,
//           tiempo: dato.tiempo,
//           Precio: dato.precio,
//           Clave_prod: dato.id,
//           Observacion: "x",
//           d_existencia: dato.existencia,
//         });
//       }
//     }
//     console.log({ dataTemporal });
//   };

//   const [filtroProductos, setFiltroProductos] = useState("");

//   const filtroProducto = (datoMedico: string) => {
//     var resultado = dataProductos4.filter((elemento: ProductoExistencia) => {
//       // Aplica la lógica del filtro solo si hay valores en los inputs
//       if ((datoMedico === "" || elemento.descripcion.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.descripcion.length > 2) {
//         return elemento;
//       }
//     });
//     setDataProductos4(resultado);
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
//                 fetchProduct4();
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
//           {dataProductos4.map((dato: ProductoExistencia, index) => (
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

// export default TableProductos;

// -------------------------------------------------------------------------
import React, { useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { useGentlemanContext } from "../context/VentasContext";
import { useProductos } from "../../../hooks/getsHooks/useProductos";
import { Producto, ProductoExistencia } from "../../../models/Producto";
import CButton from "../../../components/CButton";
import { useProductosFiltradoExistenciaProducto } from "../../../hooks/getsHooks/useProductosFiltradoExistenciaProducto";
import Swal from "sweetalert2";
import { MaterialReactTable } from "material-react-table";

interface Props {
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  sucursal: number;
  productoSelected: Number[];
}

const TableProductos = ({ setModalOpen2, sucursal, productoSelected }: Props) => {
  const TableDataHeader = ["Productos", "Existencias", ""];

  const { dataProductos4, fetchProduct4, setDataProductos4 } = useProductosFiltradoExistenciaProducto({
    descripcion: "%",
    insumo: 0,
    inventariable: 2,
    obsoleto: 0,
    servicio: 2,
    sucursal: sucursal,
  });

  const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();

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
      }
    }
    console.log({ dataTemporal });
  };

  const [filtroProductos, setFiltroProductos] = useState("");

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

  // Agregar la propiedad "acciones" a los datos
  const dataProductosConAcciones = dataProductos4.map((dato: ProductoExistencia) => ({
    ...dato,
    acciones: <Button onClick={() => handle(dato)}>Seleccionar</Button>,
  }));

  const columns = [
    { accessorKey: "descripcion", header: "Productos", size: 200 },
    { accessorKey: "existencia", header: "Existencias", size: 150 },
    { accessorKey: "precio", header: "Precio", size: 150 },
    {
      accessorKey: "acciones",
      header: "",
      size: 120,
      customComponent: (rowData: any) => rowData.original.acciones,
    },
  ];

  return (
    <>
      <Label>Productos: </Label>
      <MaterialReactTable columns={columns} data={dataProductosConAcciones} />
    </>
  );
};

export default TableProductos;
