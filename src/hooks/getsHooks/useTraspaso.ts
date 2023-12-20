import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { TraspasoGet } from "../../models/Traspaso";
interface Props {
  sucursal: number | string;
  folio: number | string;
  sucursal_origen: number;
}
export const useTraspaso = ({ sucursal, folio, sucursal_origen }: Props) => {
  const [dataTraspasos, setDataTraspasos] = useState<TraspasoGet[]>([]);

  const fetchTraspasos = async () => {
    try {
      const response: AxiosResponse<TraspasoGet[]> = await jezaApi.get(
        `/Traspaso?id=%&folio=${
          folio ? folio : "0"
        }&sucursal=${sucursal_origen}&sucursal_destino=${sucursal}&claveprod=%&f1=20230625&f2=${"20401212"}`
      );
      setDataTraspasos(response.data);
      console.log({ dataTraspasos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTraspasos();
  }, [sucursal_origen > 0, sucursal, folio]);

  return { dataTraspasos, fetchTraspasos };
};
