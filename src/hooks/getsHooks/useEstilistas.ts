import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";

export const useEstilistas = () => {
  const [dataEstilistas, setDataEstilistas] = useState<any[]>([]);

  const fetchEstilistas = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get("/Trabajador?id=0");
      setDataEstilistas(response.data);
      const filtrado = dataEstilistas.filter((estilista) => estilista.idPuesto === 1);
      console.log({ filtrado });
      setDataEstilistas(filtrado);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEstilistas();
  }, []);

  return { dataEstilistas, fetchEstilistas };
};
