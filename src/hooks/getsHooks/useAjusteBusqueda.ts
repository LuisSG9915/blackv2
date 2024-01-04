import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { MovimientoBusqueda, MovimientoResponse } from "../../models/MovimientoDiversoModel";
interface Props {
  f1: string;
  f2: string;
  sucursal: number;
}
export const useAjusteBusqueda = ({ f1, f2, sucursal }: Props) => {
  const [dataAjustesBusquedas, setAjustesBusquedas] = useState<MovimientoBusqueda[]>([]);

  const fetchAjustesBusquedas = async () => {
    try {
      const response: AxiosResponse<MovimientoBusqueda[]> = await jezaApi.get(
        `/AjusteDialogo?f1=${f1 ? f1.replaceAll("-", "") : "20230101"}&f2=${f2 ? f2.replaceAll("-", "") : "20301212"}&suc=${sucursal}`
      );
      setAjustesBusquedas(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAjustesBusquedas();
  }, [f2, f1]);

  return { dataAjustesBusquedas, fetchAjustesBusquedas };
};
