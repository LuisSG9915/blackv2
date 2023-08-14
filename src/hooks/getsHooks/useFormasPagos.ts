import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { Cia } from "../../models/Cia";
import { FormaPago } from "../../models/FormaPago";

export const useFormasPagos = () => {
  const [dataFormasPagos, setFormasPagos] = useState<FormaPago[]>([]);

  const fetchFormasPagos = async () => {
    try {
      const response: AxiosResponse<FormaPago[]> = await jezaApi.get("/FormaPago?id=%");
      setFormasPagos(response.data);
      console.log({ dataFormasPagos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFormasPagos();
  }, []);

  return { dataFormasPagos, fetchFormasPagos };
};
