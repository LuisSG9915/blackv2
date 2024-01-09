import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { AnticipoGet } from "../../models/Anticipo";
import JezaApiService from "../../api/jezaApi2";

export const useAnticipos = () => {
  const { jezaApi } = JezaApiService();

  const [dataAnticipos, setAnticipos] = useState<AnticipoGet[]>([]);

  const fetchAnticipos = async () => {
    try {
      const response: AxiosResponse<AnticipoGet[]> = await jezaApi.get("/Anticipo?id=%&idsuc=21&idCliente=11&f1=20230725&f2=20501225");
      setAnticipos(response.data);
      console.log({ dataAnticipos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAnticipos();
  }, []);

  return { dataAnticipos, fetchAnticipos, setAnticipos };
};
