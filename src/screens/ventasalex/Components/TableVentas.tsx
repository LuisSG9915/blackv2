import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Table } from "reactstrap";
import { Medico } from "../../../models/Medico";
import { useEffect, useState } from "react";
import { Venta } from "../../../models/Venta";
import { useVentasV2 } from "../../../hooks/getsHooks/useVentasV2";

interface Props {
  TableDataHeader: string[];
  data: Venta[];
  mostrarModalActualizar: (dato: Venta) => void;
  eliminar: (dato: Venta) => void;
}

function TableVentas({ TableDataHeader, data, mostrarModalActualizar, eliminar }: Props) {
  useEffect(() => {
    console.log({ data });
  }, []);

  return (
    <Table size="sm" striped={true} responsive={"sm"}>
      <thead>
        <tr>
          {TableDataHeader.map((valor: any) => (
            <th key={valor}>{valor}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((dato: Venta) => (
          <tr key={dato.id}>
            {dato.Cia ? (
              <>
                <td>{dato.estilista}</td>
                <td>{dato.producto}</td>
                <td>{dato.hora}</td>
                <td>{dato.tiempo + " hr"}</td>
                <td>{dato.Cant_producto}</td>
                <td>{dato.Precio}</td>
                <td className="gap-5">
                  <AiFillEdit
                    className="mr-2"
                    onClick={() => {
                      mostrarModalActualizar(dato);
                      console.log({ dato });
                    }}
                    size={23}
                  />
                  <AiFillDelete color="lightred" onClick={() => eliminar(dato)} size={23} />
                </td>
              </>
            ) : null}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TableVentas;
