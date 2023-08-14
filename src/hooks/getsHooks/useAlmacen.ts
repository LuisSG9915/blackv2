import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { Almacen } from "../../models/Almacen";

export const useAlmacen = () => {
  const [dataAlmacenes, setAlmacenes] = useState<Almacen[]>([]);

  const fetchAlmacenes = async () => {
    try {
      const response: AxiosResponse<Almacen[]> = await jezaApi.get("/Almacen?id=0");
      setAlmacenes(response.data);
      console.log({ dataAlmacenes });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAlmacenes();
  }, []);

  return { dataAlmacenes, fetchAlmacenes };
};
