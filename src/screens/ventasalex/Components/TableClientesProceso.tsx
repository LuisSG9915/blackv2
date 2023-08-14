import React, { useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Button, Col, Input, Label, Row, Table } from "reactstrap";
import { addEstilistas } from "../../../redux/states/estilistas";
import { addVentas } from "../../../redux/states/ventas";
import { useGentlemanContext } from "../context/VentasContext";
import { useClientesProceso } from "../../../hooks/getsHooks/useClientesProceso";
import { useVentas } from "../../../hooks/getsHooks/useVentas";
import { jezaApi } from "../../../api/jezaApi";
import { useNavigate } from "react-router-dom";
import { useVentasProceso } from "../../../hooks/getsHooks/useVentasProceso";
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
}
export interface Clientes {
  id: number;
  estilista: string;
}
const TableClientesProceso = ({ data, setModalOpen2 }: Props) => {
  const TableDataHeader = ["ID", "Clientes"];
  const Clientes = ["Manuela", "Maria", "Penelope"];
  const navigate = useNavigate();

  const { data: dataTemporal, setData: setDataTemporal, selectedID, setselectedID, setDataVentasProcesos } = useGentlemanContext();

  const handle = (dato: any) => {
    setModalOpen2(false);
    setDataTemporal({ ...dataTemporal, Cve_cliente: dato.id_cliente, cliente: dato.nombre });
  };

  const { dataVentasProcesos } = useVentasProceso({ idSucursal: 1 });

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
              <td> {<Button onClick={() => handle(dato)}>Seleccionar</Button>} </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TableClientesProceso;
