import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Venta } from "../../models/Venta";

export const useVentas = () => {
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
