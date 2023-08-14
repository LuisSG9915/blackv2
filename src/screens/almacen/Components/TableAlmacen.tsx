import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Table } from "reactstrap";
import { Almacen } from "../../../models/Almacen";

interface props {
  data: Almacen[];
  DataTableHeader: string[];
  mostrarModalActualizar: (dato: any) => void;
  eliminar: (dato: any) => void;
}
function TableAlmacen({ DataTableHeader, data, eliminar, mostrarModalActualizar }: props) {
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
        {data.map((dato: Almacen) => (
          <tr key={dato.id}>
            <td> {dato.d_cia} </td>
            <td> {dato.d_sucursal} </td>
            <td> {dato.descripcion} </td>
            <td> {dato.almacen} </td>
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

export default TableAlmacen;
