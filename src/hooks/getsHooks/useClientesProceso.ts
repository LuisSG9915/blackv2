import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import JezaApiService from "../../api/jezaApi2";

export const useClientesProceso = () => {
  
 const { jezaApi } = JezaApiService();
  const [dataClientesProceso, setDataClientesProceso] = useState<any[]>([]);

  const fetchClientesProceso = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get("/VentaCliente?suc=1&cliente=6");
      setDataClientesProceso(response.data);
      // console.log({ dataClientesProceso });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClientesProceso();
  }, []);

  return { dataClientesProceso, fetchClientesProceso };
};
