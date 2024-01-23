import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import JezaApiService from "../../api/jezaApi2";

export const useEstilistas = () => {
  const { jezaApi } = JezaApiService();
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
