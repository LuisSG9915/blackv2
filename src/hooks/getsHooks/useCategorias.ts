import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { GastoCategoria } from "../../models/GastoCategoria";

export const useCategorias = () => {
  const [data, setData] = useState<GastoCategoria[]>([]);

  const getCategoriaGasto = async () => {
    try {
      const response: AxiosResponse<GastoCategoria[]> = await jezaApi.get("/Categoria?id=0");
      setData(response.data);
      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoriaGasto();
  }, []);

  return { data, getCategoriaGasto };
};

// const getCategoriaGasto = () => {
//   jezaApi.get("/Categoria?id=0").then((response) => {
//     setData(response.data);
//   });
// };
