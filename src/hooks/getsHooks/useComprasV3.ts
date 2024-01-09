import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";

import { CompraProveedor } from "../../models/CompraProveedor";
import JezaApiService from "../../api/jezaApi2";

export const useComprasV3 = (proveedor: number, id_compra: any, sucursal: number, cia: number) => {
  const { jezaApi } = JezaApiService();
  const [dataComprasGeneral, setDataComprasGeneral] = useState<CompraProveedor[]>([]);

  const fetchCompras = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(
        `/Compra?cia=${cia}&sucursal=${sucursal}&id=%&proveedor=${proveedor}&idCompra=${id_compra}`
      );
      setDataComprasGeneral(response.data);
      console.log({ dataComprasGeneral });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchCompras();
  }, [proveedor, id_compra, sucursal]);

  return { dataComprasGeneral, fetchCompras, setDataComprasGeneral };
};
