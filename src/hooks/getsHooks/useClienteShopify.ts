import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { ShopifyCliente } from "../../models/ShopifyCliente";

export const useClienteShopify = () => {
  const [dataClieSho, setDataClieSho] = useState<ShopifyCliente[]>([]);

  const fetchClieSho = async () => {
    try {
      const response: AxiosResponse<ShopifyCliente[]> = await jezaApi.get("/sp_ShopifyClientesSel");
      setDataClieSho(response.data);
      console.log({ dataClieSho });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClieSho();
  }, []);

  return { dataClieSho, fetchClieSho };
};
