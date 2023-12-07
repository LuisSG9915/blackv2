import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { CorteA, CorteB, CorteC, CorteD, CorteE, CorteF} from "../../models/CortesEmail";
import { format } from "date-fns-tz";

interface Props {
  sucursal: number;
  fecha: Date;
  

}
export const useCortesEmail = ({ sucursal, fecha }: Props) => {
  const [dataCorteEmailA, setDataCorteEmailA] = useState<CorteA[]>([]);
  const [dataCorteEmailB, setDataCorteEmailB] = useState<CorteB[]>([]);
  const [dataCorteEmailC, setDataCorteEmailC] = useState<CorteC[]>([]);
  const [dataCorteEmailD, setDataCorteEmailD] = useState<CorteD[]>([]);
  const [dataCorteEmailE, setDataCorteEmailE] = useState<CorteE[]>([]);
  const [dataCorteEmailF, setDataCorteEmailF] = useState<CorteF[]>([]);



  const [ColumnasA, setColumnasA] = useState([]);
  const [ColumnasB, setColumnasB] = useState([]);
  const [ColumnasC, setColumnasC] = useState([]);
  const [ColumnasD, setColumnasD] = useState([]);
  const [ColumnasE, setColumnasE] = useState([]);
  const [ColumnasF, setColumnasF] = useState([]);
  const currentDate = new Date();
  const zonaHoraria = "America/Mexico_City";

  const fetchCorteA = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/CorteSeccionA?suc=${sucursal}&fecha=${fecha ? fecha : format(currentDate, "yyyy-MM-dd", { timeZone: zonaHoraria })}`
      );
      setDataCorteEmailA(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCorteB = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/CorteSeccionB?suc=${sucursal}&fecha=${fecha ? fecha : format(currentDate, "yyyy-MM-dd", { timeZone: zonaHoraria })}`
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
        `/CorteSeccionC?suc=${sucursal}&fecha=${fecha ? fecha : format(currentDate, "yyyy-MM-dd", { timeZone: zonaHoraria })}`
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

  const fetchCorteD = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        // `/CorteSeccionC?suc=${sucursal}&fecha=${fecha ? fecha : format(currentDate, "yyyy-MM-dd", { timeZone: zonaHoraria })}`
        `/sp_reporteCifrasEmpleado?año=${fecha ? format(new Date(fecha),"yyyy") : format(currentDate, "yyyy")}&mes=${fecha ? format(new Date(fecha),"MM") :format(currentDate, "MM", { timeZone: zonaHoraria } )}&sucursal=${sucursal}`
        );
      setDataCorteEmailD(response.data);
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

  const fetchCorteE = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        // `/CorteSeccionC?suc=${sucursal}&fecha=${fecha ? fecha : format(currentDate, "yyyy-MM-dd", { timeZone: zonaHoraria })}`
        `/sp_reporteCifrasSucursal?año=${fecha ? format(new Date(fecha),"yyyy") : format(currentDate, "yyyy")}&mes=${fecha ? format(new Date(fecha),"MM") :format(currentDate, "MM", { timeZone: zonaHoraria } )}&suc=${sucursal}`
        );
      setDataCorteEmailE(response.data);
      if (response.data.length > 0) {
        const columnKeys = Object.keys(response.data[0]);
        const columns = columnKeys.map((key) => ({
          accessorKey: key,
          header: key,
          flex: 1,
        }));
        setColumnasE(columns);
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

 const fetchCorteF = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/sp_reporteCorte4?suc=${sucursal}&fecha=${fecha ? fecha : format(currentDate, "yyyy-MM-dd", { timeZone: zonaHoraria })}`
      );
      setDataCorteEmailF(response.data);
      if (response.data.length > 0) {
        const columnKeys = Object.keys(response.data[0]);
        const columns = columnKeys.map((key) => ({
          accessorKey: key,
          header: key,
          flex: 1,
        }));
        setColumnasF(columns);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (sucursal > 0) {
      fetchCorteA();
      fetchCorteB();
      fetchCorteC();
      fetchCorteD();
      fetchCorteE();
      fetchCorteF();
    }
  }, [sucursal, fecha]);

  return { dataCorteEmailA, dataCorteEmailB, dataCorteEmailC, dataCorteEmailD, dataCorteEmailE, dataCorteEmailF, ColumnasA, ColumnasB, ColumnasC, ColumnasD, ColumnasE,  ColumnasF, fetchCorteA };
};
