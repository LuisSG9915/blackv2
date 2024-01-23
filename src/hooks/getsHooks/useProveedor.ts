import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { Proveedor } from "../../models/Proveedor";
import JezaApiService from "../../api/jezaApi2";

export const useProveedor = () => {
  const { jezaApi } = JezaApiService();
  const [dataProveedores, setProveedores] = useState<Proveedor[]>([]);

  const fetchProveedores = async () => {
    try {
      const response: AxiosResponse<Proveedor[]> = await jezaApi.get("/Proveedor?id=0");
      setProveedores(response.data);
      console.log({ dataProveedores });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return { dataProveedores, fetchProveedores, setProveedores };
};
