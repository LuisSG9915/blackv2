import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import JezaApiService from "../../api/jezaApi2";

export interface Props {
  f1: string;
  f2: string;
  estilista: string;
  tipoBloqueo: string;
}
export const useBloqueosColaboradores = ({ estilista, f1, f2, tipoBloqueo }: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataBloqueos, setDataBloqueos] = useState<any[]>([]);

  const fetchBloqueos = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/sp_detalle_bloqueosColaboradoresSel?f1=${f1 ? f1 : new Date()}&f2=${f2 ? f2 : new Date()}&estilista=${estilista}&tipoBloqueo=${tipoBloqueo}`
      );
      setDataBloqueos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBloqueos();
  }, [f1, f2]);

  return { dataBloqueos, fetchBloqueos };
};
