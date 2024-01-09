import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { ColaboradorStatus } from "../../models/ColaboradorStatus";
import JezaApiService from "../../api/jezaApi2";

export const useEstatus = () => {
  const { jezaApi } = JezaApiService();
  const [dataEstatus, setEstatus] = useState<ColaboradorStatus[]>([]);

  const fetchEstatus = async () => {
    try {
      const response: AxiosResponse<ColaboradorStatus[]> = await jezaApi.get("/Nominaestatus?id=0");
      setEstatus(response.data);
      console.log({ dataEstatus });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEstatus();
  }, []);

  return { dataEstatus, fetchEstatus };
};
