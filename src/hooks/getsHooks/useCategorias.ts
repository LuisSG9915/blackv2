import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { GastoCategoria } from "../../models/GastoCategoria";

export const useCategorias = () => {
  const [dataCate, setDatacate] = useState<GastoCategoria[]>([]);

  const getCategoriaGasto = async () => {
    try {
      const response: AxiosResponse<GastoCategoria[]> = await jezaApi.get("/Categoria?id=0");
      setDatacate(response.data);
      console.log({ dataCate });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoriaGasto();
  }, []);

  return { dataCate, setDatacate };
};

// const getCategoriaGasto = () => {
//   jezaApi.get("/Categoria?id=0").then((response) => {
//     setData(response.data);
//   });
// };
