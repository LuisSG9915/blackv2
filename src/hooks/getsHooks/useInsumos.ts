import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Venta } from "../../models/Venta";

export const useInsumos = () => {
  const [dataVentas, setDataVentas] = useState<Venta[]>([]);

  const fetchVentas = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/VentaCliente?id=0`);
      setDataVentas(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return { dataVentas, fetchVentas };
};
