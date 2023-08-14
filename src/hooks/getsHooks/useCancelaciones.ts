import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { Cancelacion } from "../../models/Cancelacion";

interface Props {
  sucursal: number;
}
export const useCancelaciones = ({ sucursal }: Props) => {
  const [dataCancelaciones, setCancelaciones] = useState<Cancelacion[]>([]);

  const fetchCancelaciones = async () => {
    try {
      const response: AxiosResponse<Cancelacion[]> = await jezaApi.get(`/VentasDia?suc=${sucursal}`);
      setCancelaciones(response.data);
      console.log({ dataCancelaciones });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCancelaciones();
  }, [sucursal]);

  return { dataCancelaciones, fetchCancelaciones };
};
