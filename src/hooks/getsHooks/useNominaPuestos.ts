import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Puesto } from "../../models/Puesto";
import JezaApiService from "../../api/jezaApi2";

export const useNominaPuestos = () => {
  const { jezaApi } = JezaApiService();

  const [dataNominaPuestos, setDataNominaPuestos] = useState<Puesto[]>([]);

  const fetchNominaPuestos = async () => {
    try {
      const response: AxiosResponse<Puesto[]> = await jezaApi.get("/Puesto?id=0");
      setDataNominaPuestos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNominaPuestos();
  }, []);

  return { dataNominaPuestos, fetchNominaPuestos };
};
