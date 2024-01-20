import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Citafutura } from "../../models/Citafutura";
import JezaApiService from "../../api/jezaApi2";

export const useCitaFutura = () => {

  const { jezaApi } = JezaApiService();
  const [dataCitaFutura, setDataCitaFutura] = useState<Citafutura[]>([]);

  const fetchClientes = async () => {
    try {
      const response: AxiosResponse<Citafutura[]> = await jezaApi.get("/sp_detalleCitasFuturasSel?Cliente=%");
      setDataCitaFutura(response.data);
      // console.log({ dataClientes });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return { dataCitaFutura, fetchClientes, setDataCitaFutura };
};
