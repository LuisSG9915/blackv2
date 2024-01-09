import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Venta } from "../../models/Venta";
import JezaApiService from "../../api/jezaApi2";

export const useVentas = () => {
  const { jezaApi } = JezaApiService();
  const [dataVentas, setDataVentas] = useState<Venta[]>([]);

  const fetchVentas = async () => {
    try {
      const response: AxiosResponse<Venta[]> = await jezaApi.get("/Venta?id=0");
      setDataVentas(response.data);
      console.log({ dataVentas });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return { dataVentas, fetchVentas };
};
