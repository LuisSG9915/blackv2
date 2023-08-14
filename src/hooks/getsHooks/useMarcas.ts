import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";

export const useMarcas = () => {
  const [dataMarcas, setDataMarcas] = useState<Marca[]>([]);

  const fetchMarcas = async () => {
    try {
      const response: AxiosResponse<Marca[]> = await jezaApi.get("/Marca?id=0");
      setDataMarcas(response.data);
      console.log({ dataMarcas });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  return { dataMarcas, fetchMarcas };
};
