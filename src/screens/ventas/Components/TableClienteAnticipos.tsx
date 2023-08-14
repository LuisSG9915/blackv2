// import React, { useState } from "react";
// import { Button, Col, Input, Label, Row, Table } from "reactstrap";
// import { useGentlemanContext } from "../context/VentasContext";
// import { Cliente } from "../../../models/Cliente";
// import { useClientes } from "../../../hooks/getsHooks/useClientes";
// import { AnticipoGet } from "../../../models/Anticipo";
// interface Venta {
//   id?: number;
//   estilista: string;
//   producto: string;
//   cantidad: number;
//   precio: number;
//   tasaIva: number;
//   tiempo: number;
// }
// interface Props {
//   data: Cliente[];
//   setModalCliente: React.Dispatch<React.SetStateAction<boolean>>;
//   setForm: React.Dispatch<React.SetStateAction<AnticipoGet>>;
//   form: AnticipoGet;
// }
// export interface Clientes {
//   id: number;
//   estilista: string;
// }
// const TableClienteAnticipos = ({ data, setModalCliente, form, setForm }: Props) => {
//   const { dataClientes, fetchClientes, setDataClientes } = useClientes();
//   const TableDataHeader = ["ID", "Clientes"];

//   const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();

//   const handle = (dato: Cliente) => {
//     setModalCliente(false);
//     setForm({ ...form, idCliente: dato.id_cliente, d_cliente: dato.nombre });
//   };
//   const [filtroCliente, setFiltroCliente] = useState("");

//   const filtroClientes = (datoMedico: string) => {
//     var resultado = dataClientes.filter((elemento: Cliente) => {
//       // Aplica la lógica del filtro solo si hay valores en los inputs
//       if ((datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.nombre.length > 2) {
//         return elemento;
//       }
//       console.log("a");
//     });
//     setDataClientes(resultado);
//   };
//   return (
//     <>
//       <Label>Cliente: </Label>
//       <Row>
//         <Col md={"8"}>
//           <Input
//             onChange={(e) => {
//               setFiltroCliente(e.target.value);
//               if (e.target.value === "") {
//                 fetchClientes();
//               }
//             }}
//           ></Input>
//         </Col>
//         <Col md={"2"}>
//           <Button onClick={() => filtroClientes(filtroCliente)}>Filtro</Button>
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
//           {dataClientes.map((dato: Cliente, index) => (
//             <tr key={index}>
//               <td>{dato.nombre}</td>
//               <td> {<Button onClick={() => handle(dato)}>Seleccionar</Button>} </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </>
//   );
// };

// export default TableClienteAnticipos;

import React from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { useGentlemanContext } from "../context/VentasContext"; // Asegúrate de importar useGentlemanContext aquí
import { useClientes } from "../../../hooks/getsHooks/useClientes";
import { AnticipoGet } from "../../../models/Anticipo";
import { useState } from "react";
import Cliente from "../../clientes/Cliente";

interface Props {
  data: Cliente[];
  setModalCliente: React.Dispatch<React.SetStateAction<boolean>>;
  setForm: React.Dispatch<React.SetStateAction<AnticipoGet>>;
  form: AnticipoGet;
}

const TableClienteAnticipos = ({ data, setModalCliente, form, setForm }: Props) => {
  const { dataClientes, fetchClientes, setDataClientes } = useClientes();
  const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext(); // Asegúrate de estar usando useGentlemanContext aquí
  const [filtroCliente, setFiltroCliente] = useState("");

  const handle = (dato: Cliente) => {
    setModalCliente(false);
    setForm({ ...form, idCliente: dato.id_cliente, d_cliente: dato.nombre });
  };

  const filtroClientes = (datoMedico: string) => {
    var resultado = dataClientes.filter((elemento: Cliente) => {
      if (
        (datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) &&
        elemento.nombre.length > 2
      ) {
        return elemento;
      }
    });
    setDataClientes(resultado);
  };

  const columns: MRT_ColumnDef<Cliente>[] = [
    {
      accessorKey: "nombre",
      header: "Clientes",
    },
    {
      accessorKey: "acciones", // Cambia "Acciones" a "acciones"
      header: "Acciones",
      Cell: ({ cell }) => <Button onClick={() => handle(cell.row.original)}>Seleccionar</Button>, // Usa cell.row.original para obtener el objeto completo
    },
  ];

  return (
    <>
      <Label>Cliente: </Label>
      <Row>
        <Col md={"8"}>
          <Input
            onChange={(e) => {
              setFiltroCliente(e.target.value);
              if (e.target.value === "") {
                fetchClientes();
              }
            }}
          ></Input>
        </Col>
        <Col md={"2"}>
          <Button onClick={() => filtroClientes(filtroCliente)}>Filtro</Button>
        </Col>
      </Row>
      <br />
      <br />
      <MaterialReactTable columns={columns} data={dataClientes} />
    </>
  );
};

export default TableClienteAnticipos;
