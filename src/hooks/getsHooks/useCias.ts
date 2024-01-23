import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { Cia } from "../../models/Cia";
import JezaApiService from "../../api/jezaApi2";

export const useCias = () => {
  const { jezaApi } = JezaApiService();
  const [dataCias, setCias] = useState<Cia[]>([]);

  const fetchCias = async () => {
    try {
      const response: AxiosResponse<Cia[]> = await jezaApi.get("/Cia?id=0");
      setCias(response.data);
      console.log({ dataCias });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCias();
  }, []);

  return { dataCias, fetchCias };
};
