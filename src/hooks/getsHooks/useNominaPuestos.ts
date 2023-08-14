import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Puesto } from "../../models/Puesto";

export const useNominaPuestos = () => {
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
