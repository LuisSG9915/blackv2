import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { CompraSeleccion } from "../../models/CompraSeleccion";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  sucursal: number;
  corte: number;
  cia: number;
}
export const useCorteDia = ({ sucursal, corte, cia }: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataCorteDia, setDataCorteDia] = useState<CompraSeleccion[]>([]);

  const fetchCorteDia = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/CorteDia?cia=${cia}&suc=${sucursal}&corte=${corte ? corte : 1}`);
      setDataCorteDia(response.data);
      console.log({ dataCorteDia });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCorteDia();
  }, [sucursal]);

  return { dataCorteDia, fetchCorteDia };
};
