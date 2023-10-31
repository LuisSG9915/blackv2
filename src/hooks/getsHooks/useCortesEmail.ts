import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { CorteA, CorteB, CorteC } from "../../models/CortesEmail";
import { format } from "date-fns";

interface Props {
  sucursal: number;
  fecha: Date;
}
export const useCortesEmail = ({ sucursal, fecha }: Props) => {
  const [dataCorteEmailA, setDataCorteEmailA] = useState<CorteA[]>([]);
  const [dataCorteEmailB, setDataCorteEmailB] = useState<CorteB[]>([]);
  const [dataCorteEmailC, setDataCorteEmailC] = useState<CorteC[]>([]);

  const [ColumnasA, setColumnasA] = useState([]);
  const [ColumnasB, setColumnasB] = useState([]);
  const [ColumnasC, setColumnasC] = useState([]);
  const currentDate = new Date();

  const fetchCorteA = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/CorteSeccionA?suc=${sucursal}&fecha=${fecha ? fecha : format(currentDate, "yyyy-MM-dd")}`
      );
      setDataCorteEmailA(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCorteB = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/CorteSeccionB?suc=${sucursal}&fecha=${fecha ? fecha : format(currentDate, "yyyy-MM-dd")}`
      );
      setDataCorteEmailB(response.data);
      if (response.data.length > 0) {
        const columnKeys = Object.keys(response.data[0]);
        const columns = columnKeys.map((key) => ({
          accessorKey: key,
          header: key,
          flex: 1,
        }));
        setColumnasB(columns);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCorteC = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/CorteSeccionC?suc=${sucursal}&fecha=${fecha ? fecha : format(currentDate, "yyyy-MM-dd")}`
      );
      setDataCorteEmailC(response.data);
      if (response.data.length > 0) {
        const columnKeys = Object.keys(response.data[0]);
        const columns = columnKeys.map((key) => ({
          accessorKey: key,
          header: key,
          flex: 1,
        }));
        setColumnasC(columns);
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (sucursal > 0) {
      fetchCorteA();
      fetchCorteB();
      fetchCorteC();
    }
  }, [sucursal, fecha]);

  return { dataCorteEmailA, dataCorteEmailB, dataCorteEmailC, ColumnasA, ColumnasB, ColumnasC, fetchCorteA };
};
