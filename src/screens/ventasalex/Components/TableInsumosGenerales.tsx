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
import { useInsumosGenerales } from "../../../hooks/getsHooks/useInsumosGenerales";
import { jezaApi } from "../../../api/jezaApi";
import { prepareAutoBatched } from "@reduxjs/toolkit";
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
  datoVentaSeleccionado: any;
  handleGetFetch: any;
}
export interface Estilistas {
  id: number;
  estilista: string;
}
const TableInsumos = ({ data, setModalOpen2, datoVentaSeleccionado, handleGetFetch }: Props) => {
  const TableDataHeader = ["Insumo", "Acciones"];
  const [estilistasFiltrado, setEstilistasFiltrado] = useState<Estilistas[]>([]);
  const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();
  const [form, setForm] = useState({
    marca: "",
    cantidad: "",
    id_insumo: 0,
  });
  const { dataInsumoGenerales, fetchInsumosGenerales } = useInsumosGenerales({ marca: form.marca });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const filtroEmail = (datoMedico: string) => {
    var resultado = data.filter((elemento: Estilistas) => {
      if ((datoMedico === "" || elemento.estilista.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.estilista.length > 0) {
        return elemento;
      }
    });
    setEstilistasFiltrado(resultado);
  };
  const createInsumoTrue = (updatedForm: { id_insumo: number; marca: string; cantidad: string }) => {
    jezaApi
      .post("/VentaInsumo", null, {
        params: { id_venta: datoVentaSeleccionado, id_insumo: Number(updatedForm.id_insumo), cantidad: Number(updatedForm.cantidad) },
      })
      .then((re) => console.log(re))
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    console.log(data);
  }, []);
  const [insumo, setInsumo] = useState(0);

  const handleInsumoSelection = (id: number) => {
    setForm((prevState) => {
      const updatedForm = { ...prevState, id_insumo: id };
      createInsumoTrue(updatedForm);
      return updatedForm;
    });
    setModalOpen2(false);
    setTimeout(() => {
      handleGetFetch();
    }, 1600);
  };
  return (
    <>
      <Label>Cantidad: </Label>
      <Input onChange={handleChange} name="cantidad"></Input>
      <br />
      <Label>Marca o palabra: </Label>
      <Row>
        <Col md={"9"}>
          <Input onChange={handleChange} name="marca"></Input>
        </Col>
        <br />
        <Col md={"1"}>
          <Button onClick={fetchInsumosGenerales}>Buscar</Button>
        </Col>
      </Row>
      <br />
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
          {dataInsumoGenerales.map((dato: any, index) => (
            <tr key={dato.id}>
              <td>{dato.descripcion}</td>
              <td>
                {
                  <Button
                    onClick={() => {
                      handleInsumoSelection(dato.id);
                    }}
                  >
                    Seleccionar
                  </Button>
                }{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TableInsumos;
