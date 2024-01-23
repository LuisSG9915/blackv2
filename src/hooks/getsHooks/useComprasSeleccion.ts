import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { CompraProveedor } from "../../models/CompraProveedor";
import { CompraSeleccion } from "../../models/CompraSeleccion";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  fecha1: string;
  fecha2: string;
  sucursal: number;
  cia: number;
}
export const useComprasSeleccion = ({ fecha1, fecha2, sucursal, cia }: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataComprasSeleccion, setDataComprasSeleccion] = useState<CompraSeleccion[]>([]);

  const fetchComprasSeleccion = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/CompraListaSel?cia=${cia}&sucursal=${sucursal}&f1=${fecha1 ? fecha1 : "2023-01-01"}&f2=${fecha2 ? fecha2 : "2023-12-12"}`
      );
      setDataComprasSeleccion(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComprasSeleccion();
  }, [fecha1, fecha2]);

  return { dataComprasSeleccion, fetchComprasSeleccion };
};
