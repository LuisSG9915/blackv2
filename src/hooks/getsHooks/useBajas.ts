import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { TiposdeBajas } from "../../models/TiposdeBajas";
import JezaApiService from "../../api/jezaApi2";

export const useBajas = () => {
  const { jezaApi } = JezaApiService();
  const [dataBajas, setBajas] = useState<TiposdeBajas[]>([]);

  const fetchBajas = async () => {
    try {
      const response: AxiosResponse<TiposdeBajas[]> = await jezaApi.get("/Nominatipobaja?id=0");
      setBajas(response.data);
      console.log({ dataBajas });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBajas();
  }, []);

  return { dataBajas, fetchBajas };
};
