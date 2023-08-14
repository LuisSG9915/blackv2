import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { Descuento } from "../../models/Descuento";
import { CompraProveedor } from "../../models/CompraProveedor";

export const useCompras = () => {
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
