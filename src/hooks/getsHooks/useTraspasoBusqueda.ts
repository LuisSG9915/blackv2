import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { TraspasoBusqueda } from "../../models/Traspaso";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  f1: string;
  f2: string;
  folio: string;
  sucursal_destino: any;
  sucursal: number;
}
export const useTraspasoBusqueda = ({ f1, f2, folio, sucursal_destino, sucursal }: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataTraspasoBusqueda, setDataTraspasoBusqueda] = useState<TraspasoBusqueda[]>([]);

  const fetchTraspasoBusqueda = async () => {
    try {
      const response: AxiosResponse<TraspasoBusqueda[]> = await jezaApi.get(
        `/TraspasoBusqueda?folio=${folio}&sucursal=${sucursal}&sucursal_destino=${sucursal_destino}&f1=${f1}&f2=${f2}`
      );
      setDataTraspasoBusqueda(response.data);
      console.log(dataTraspasoBusqueda);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTraspasoBusqueda();
  }, [f1, f2, folio, sucursal_destino, sucursal]);

  return { dataTraspasoBusqueda, fetchTraspasoBusqueda };
};
