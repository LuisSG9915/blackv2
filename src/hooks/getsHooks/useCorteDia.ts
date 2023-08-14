import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { CompraProveedor } from "../../models/CompraProveedor";
import { CompraSeleccion } from "../../models/CompraSeleccion";
interface Props {
  sucursal: number;
  corte: number;
}
export const useCorteDia = ({ sucursal, corte }: Props) => {
  const [dataCorteDia, setDataCorteDia] = useState<CompraSeleccion[]>([]);

  const fetchCorteDia = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/CorteDia?cia=26&suc=${sucursal}&corte=${corte ? corte : 1}`);
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
