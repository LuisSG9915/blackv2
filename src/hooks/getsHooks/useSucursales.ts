import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { Sucursal } from "../../models/Sucursal";

export const useSucursales = () => {
  const [dataSucursales, setDataSucursales] = useState<Sucursal[]>([]);

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
