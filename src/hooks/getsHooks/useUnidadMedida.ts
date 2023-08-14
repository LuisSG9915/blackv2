import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { UnidadMedidaModel } from "../../models/UnidadMedidaModel";

export const useUnidadMedida = () => {
  const [dataUnidadMedida, setDataUnidadMedida] = useState<UnidadMedidaModel[]>([]);

  const fetchUnidadMedida = async () => {
    try {
      const response: AxiosResponse<UnidadMedidaModel[]> = await jezaApi.get("/UnidadMedida?id=%");
      setDataUnidadMedida(response.data);
      console.log({ dataUnidadMedida });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUnidadMedida();
  }, []);

  return { dataUnidadMedida, fetchUnidadMedida };
};
