import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { GastoCategoria } from "../../models/GastoCategoria";
import JezaApiService from "../../api/jezaApi2";

export const useSubGastos = () => {
  const { jezaApi } = JezaApiService();

  const [dataGastos, setDataGastos] = useState<GastoCategoria[]>([]);

  const getDataGastos = async () => {
    try {
      const response: AxiosResponse<GastoCategoria[]> = await jezaApi.get("/SubCategoria?id=0");
      setDataGastos(response.data);
      console.log({ dataGastos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataGastos();
  }, []);

  return { dataGastos, getDataGastos };
};

// const getCategoriaGasto = () => {
//   jezaApi.get("/Categoria?id=0").then((response) => {
//     setData(response.data);
//   });
// };
