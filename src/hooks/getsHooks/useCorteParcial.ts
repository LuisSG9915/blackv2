import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { CompraProveedor } from "../../models/CompraProveedor";
import { CompraSeleccion } from "../../models/CompraSeleccion";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  sucursal: number;
  corte: number;
  corteParcial: number;
}
export const useCorteParcial = ({ sucursal, corte, corteParcial }: Props) => {
  const { jezaApi } = JezaApiService();

  const [dataCorteParcial, setDataCorteParcial] = useState<CompraSeleccion[]>([]);

  const fetchCorteParcial = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/CorteParcial?cia=26&suc=${sucursal}&corte=${corte ? corte : 1}&corteParcial=${corteParcial ? corteParcial : 1}`
      );
      setDataCorteParcial(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCorteParcial();
  }, [sucursal]);

  return { dataCorteParcial, fetchCorteParcial };
};
