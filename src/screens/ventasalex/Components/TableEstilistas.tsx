import React, { useEffect, useState } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Button, Col, Input, Label, Row, Table } from "reactstrap";
import { addEstilistas } from "../../../redux/states/estilistas";
import { addVentas } from "../../../redux/states/ventas";
import { useGentlemanContext } from "../context/VentasContext";
import { Trabajador } from "../../../models/Trabajador";
import { useEstilistas } from "../../../hooks/getsHooks/useEstilistas";
import { Estilista } from "../../../models/Estilista";
interface Venta {
  id: number;
  estilista: string;
  producto: string;
  cantidad: number;
  precio: number;
  tasaIva: number;
  tiempo: number;
}
interface Props {
  data: Estilistas[];
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface Estilistas {
  id: number;
  estilista: string;
}
const TableEstilistas = ({ data, setModalOpen2 }: Props) => {
  const TableDataHeader = ["Estilistas", ""];
  const [estilistasFiltrado, setEstilistasFiltrado] = useState<Estilistas[]>([]);
  const [estilistaFilter, setEstilistaFilter] = useState("");
  const { dataEstilistas, fetchEstilistas } = useEstilistas();

  const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();

  const handle = (dato: Trabajador) => {
    setModalOpen2(false);
    setDataTemporal({ ...dataTemporal, estilista: dato.nombre, idEstilista: dato.id });
  };

  const filtroEmail = (datoMedico: string) => {
    var resultado = data.filter((elemento: Estilistas) => {
      if ((datoMedico === "" || elemento.estilista.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.estilista.length > 0) {
        return elemento;
      }
    });
    setEstilistasFiltrado(resultado);
  };

  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <>
      {/* <Label>Estilistas: </Label>
      <Row>
        <Col md={"9"}>
          <Input
            onChange={(e) => {
              setEstilistasFiltrado(e.target.value);
              if (e.target.value === "") {
                fetchProduct();
              }
            }}
          ></Input>
        </Col>
        <Col md={"1"}>
          <Button onClick={() => filtroEmail(estilistaFilter)}>Filtro</Button>
        </Col>
      </Row> */}
      {/* <br />
      <br /> */}
      <Table size="sm" striped={true} responsive={"sm"}>
        <thead>
          <tr>
            {TableDataHeader.map((valor: any) => (
              <th key={valor}>{valor}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((dato: any, index) => (
            <tr key={index}>
              <td>{dato.nombre}</td>
              <td> {<Button onClick={() => handle(dato)}>Seleccionar</Button>} </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TableEstilistas;
