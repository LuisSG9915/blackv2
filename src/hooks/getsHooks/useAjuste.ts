import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { Almacen } from "../../models/Almacen";
import { MovimientoResponse } from "../../models/MovimientoDiversoModel";

interface Props {
  folio: string | number;
  sucursal: number;
}

export const useAjuste = ({ folio = "0", sucursal }: Props) => {
  const [dataAjustes, setAjustes] = useState<MovimientoResponse[]>([]);

  const fetchAjustes = async () => {
    try {
      const response: AxiosResponse<MovimientoResponse[]> = await jezaApi.get(`/Ajuste?id=%&suc=${sucursal}&folio=${folio}`);
      setAjustes(response.data);
      console.log({ dataAjustes });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAjustes();
  }, [folio, sucursal]);

  return { dataAjustes, fetchAjustes };
};
