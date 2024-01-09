import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { TipoMovtoModel } from "../../models/TipoMovtoModel";
import JezaApiService from "../../api/jezaApi2";

export const useTipoMovto = () => {
  const { jezaApi } = JezaApiService();
  const [dataTipoMovto, setDataTipoMovto] = useState<TipoMovtoModel[]>([]);

  const fetchTipoMovto = async () => {
    try {
      const response: AxiosResponse<TipoMovtoModel[]> = await jezaApi.get("/TipoMovto?id=0");
      setDataTipoMovto(response.data);
      console.log({ dataTipoMovto });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTipoMovto();
  }, []);

  return { dataTipoMovto, fetchTipoMovto };
};
