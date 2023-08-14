import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";

export const useModulos = () => {
  const [dataModulos, setDataModulos] = useState<Marca[]>([]);

  const fetchModulos = async () => {
    try {
      const response: AxiosResponse<Marca[]> = await jezaApi.get("/Modulo?id=0");
      setDataModulos(response.data);
      console.log({ dataModulos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchModulos();
  }, []);

  return { dataModulos, fetchModulos };
};
