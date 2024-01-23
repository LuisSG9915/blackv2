import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Marca } from "../../models/Marca";
import { Sucursal } from "../../models/Sucursal";
import JezaApiService from "../../api/jezaApi2";

export const useSucursales = () => {
  const [dataSucursales, setDataSucursales] = useState<Sucursal[]>([]);
  const { jezaApi } = JezaApiService();

  const fetchSucursales = async () => {
    try {
      const response: AxiosResponse<Sucursal[]> = await jezaApi.get("/Sucursal?id=%");
      setDataSucursales(response.data);
      console.log({ dataSucursales });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  return { dataSucursales, fetchSucursales };
};
