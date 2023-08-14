import React from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Table } from "reactstrap";
import { Sucursal } from "../../../models/Sucursal";
import { Cia } from "../../../models/Cia";

interface props {
  data: Sucursal[];
  DataTableHeader: string[];
  mostrarModalActualizar: (dato: any) => void;
  eliminar: (dato: any) => void;
  dataCia: Cia[];
}
function TableSucursal({ DataTableHeader, data, eliminar, mostrarModalActualizar, dataCia }: props) {
  const getCiaForeignKey = (idMarca: number) => {
    const cia = dataCia.find((cia: Cia) => cia.id === idMarca);
    return cia ? cia.nombre : "Sin Compania";
  };

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
        {data.map((dato: Sucursal) => (
          <tr key={dato.direccion}>
            <td>{getCiaForeignKey(dato.cia)}</td>
            <td>{dato.nombre}</td>
            <td>{dato.direccion}</td>
            <td>
              <input type="checkbox" checked={dato.en_linea} disabled />
            </td>

            <td>
              <input type="checkbox" checked={dato.es_bodega} disabled />
            </td>

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

export default TableSucursal;
