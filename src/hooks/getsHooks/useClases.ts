import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { Clase } from "../../models/Clase";

export const useClases = () => {
  const [dataClases, setClases] = useState<Clase[]>([]);

  const fetchClases = async () => {
    try {
      const response: AxiosResponse<Clase[]> = await jezaApi.get("/Clase?area=0&depto=0&id=0");
      setClases(response.data);
      console.log({ dataClases });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  return { dataClases, fetchClases };
};
