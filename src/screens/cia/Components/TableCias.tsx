import React from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Table } from "reactstrap";
import { Sucursal } from "../../../models/Sucursal";
import { Cia } from "../../../models/Cia";

interface props {
  data: Cia[];
  DataTableHeader: string[];
  mostrarModalActualizar: (dato: any) => void;
  eliminar: (dato: any) => void;
}
function TableCias({ DataTableHeader, data, eliminar, mostrarModalActualizar }: props) {
  return (
    <Table size="sm" striped={true} responsive={"sm"}>
      <thead>
        <tr>
          {DataTableHeader.map((valor) => (
            <th className="" key={valor}>
              {valor}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((dato: Cia) => (
          <tr key={dato.rfc}>
            <td>{dato.nombre}</td>
            <td>{dato.domicilio}</td>
            <td>{dato.cpFiscal}</td>
            <td>{dato.regimenFiscal}</td>
            <td>{dato.rfc}</td>
            <td className="gap-5">
              <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(dato)} size={23}></AiFillEdit>
              <AiFillDelete color="lightred" onClick={() => eliminar(dato)} size={23}></AiFillDelete>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TableCias;
