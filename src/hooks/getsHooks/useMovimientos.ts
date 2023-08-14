import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { Puesto } from "../../models/Puesto";

export const useMovimientos = () => {
  const [dataMovimientos, setDataMovimientos] = useState<any[]>([]);

  const fetchMovimientos = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get("/TipoMovto?id=0");
      setDataMovimientos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  return { dataMovimientos, fetchMovimientos };
};
