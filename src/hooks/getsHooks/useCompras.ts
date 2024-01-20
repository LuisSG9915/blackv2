import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { CompraProveedor } from "../../models/CompraProveedor";
import JezaApiService from "../../api/jezaApi2";

export const useCompras = () => {
  const { jezaApi } = JezaApiService();
  const [dataComprasGeneral, setDataComprasGeneral] = useState<CompraProveedor[]>([]);

  const fetchCompras = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get("/Compra?cia=2&sucursal=%&id=%&proveedor=%&idCompra=%");
      setDataComprasGeneral(response.data);
      console.log({ dataComprasGeneral });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  return { dataComprasGeneral, fetchCompras };
};
