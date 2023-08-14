import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";

import { CompraProveedor } from "../../models/CompraProveedor";

export const useComprasV3 = (proveedor: number, id_compra: any) => {
  const [dataComprasGeneral, setDataComprasGeneral] = useState<CompraProveedor[]>([]);

  const fetchCompras = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/Compra?cia=26&sucursal=%&id=%&proveedor=${proveedor}&idCompra=${id_compra}`);
      setDataComprasGeneral(response.data);
      console.log({ dataComprasGeneral });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchCompras();
  }, [proveedor, id_compra]);

  return { dataComprasGeneral, fetchCompras, setDataComprasGeneral };
};
