import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Table } from "reactstrap";
import { Perfil_Modulo } from "../../../models/Perfil_Modulo";

interface props {
  data: Perfil_Modulo[];
  DataTableHeader: string[];
  mostrarModalActualizar: (dato: any) => void;
  eliminar: (dato: any) => void;
}
function TablePerfilesModulos({ DataTableHeader, data, eliminar, mostrarModalActualizar }: props) {
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
        {data.map((dato: Perfil_Modulo) => (
          <tr key={dato.clave_perfil}>
            <td>{dato.d_perfil}</td>
            <td>{dato.d_modulo}</td>
            <td>
              <input type="checkbox" checked={dato.permiso} disabled />
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

export default TablePerfilesModulos;
