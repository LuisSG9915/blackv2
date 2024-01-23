import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { GastoCategoriaSub } from "../../models/GastoCategoriaSub";
import JezaApiService from "../../api/jezaApi2";

export const useCategoriasSub = () => {
  const { jezaApi } = JezaApiService();
  const [dataSub, setDataSub] = useState<GastoCategoriaSub[]>([]);

  const getCategoriaGastoSub = async () => {
    try {
      const response: AxiosResponse<GastoCategoriaSub[]> = await jezaApi.get("/SubCategoria?id=0");
      setDataSub(response.data);
      console.log({ dataSub });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoriaGastoSub();
  }, []);

  return { dataSub, getCategoriaGastoSub };
};

// const getCategoriaGasto = () => {
//   jezaApi.get("/Categoria?id=0").then((response) => {
//     setData(response.data);
//   });
// };
