import React, { useEffect } from "react";

import { Button, Table } from "reactstrap";
import "../../../../css/invalidEmail.css";

interface Venta {
  id?: number;
  estilista: string;
  producto: string;
  cantidad: number;
  precio: number;
  tasaIva: number;
  tiempo: number;
}
interface Props {
  data: Venta[];
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  dataVentasProcesos: any;
  dataTemporal: Venta;
  setDataTemporal: React.Dispatch<React.SetStateAction<Venta>>;
}
export interface Clientes {
  id: number;
  estilista: string;
}
const TableClientesProceso = ({ data, setModalOpen2, dataVentasProcesos, dataTemporal, setDataTemporal }: Props) => {
  const TableDataHeader = ["Nombre", "Email", "Acción"];

  // const { data: dataTemporal, setData: setDataTemporal, selectedID, setselectedID, setDataVentasProcesos } = useGentlemanContext();

  const regexCorreo = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol)\.(?:com|net|org|edu|gov|mil|co|info|biz|me|xyz))$/i;


  const handle = (dato: any) => {
    setModalOpen2(false);
    setDataTemporal({ ...dataTemporal, Cve_cliente: dato.id_cliente, cliente: dato.nombre });
  };

  return (
    <>
      <br />
      <br />
      <Table size="sm" striped={true} responsive={"sm"}>
        <thead>
          <tr>
            {TableDataHeader.map((valor: any) => (
              <th key={valor}>{valor}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataVentasProcesos.map((dato) => (
            <tr key={dato.id_cliente}>
              <td>{dato.nombre}</td>
              <td className={!regexCorreo.test(dato.email) ? 'invalid-email' : ''}>{dato.email || 'Sin correo electrónico'}</td>
              <td> {<Button onClick={() => handle(dato)}>Seleccionar</Button>} </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TableClientesProceso;
