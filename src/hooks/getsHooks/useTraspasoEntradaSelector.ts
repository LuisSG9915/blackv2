import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { TraspasoGet } from "../../models/Traspaso";
interface Props {
  sucursal: string | number;
  folio: string | number;
  sucursal_destino: string | number;
  f1: string;
  f2: string;
}
export const useTraspasoEntradaSelector = ({ f1, f2, folio, sucursal, sucursal_destino }: Props) => {
  const [dataTraspasosEntradas, setDataTraspasosEntradas] = useState<TraspasoGet[]>([]);

  const fetchTraspasosEntradas = async ({ sucursal, sucursal_destino, folio }: Props) => {
    console.log(folio);
    try {
      const response: AxiosResponse<TraspasoGet[]> = await jezaApi.get(
        `/Traspaso?id=%&folio=${folio === 0 ? "%" : folio}&sucursal=${sucursal}&sucursal_destino=${
          sucursal_destino ? sucursal_destino : "%"
        }&claveprod=%&f1=20230625&f2=20401212`
      );
      setDataTraspasosEntradas(response.data);
      console.log({ dataTraspasosEntradas });
    } catch (error) {
      console.log(error);
    }
  };

  return { dataTraspasosEntradas, fetchTraspasosEntradas };
};
