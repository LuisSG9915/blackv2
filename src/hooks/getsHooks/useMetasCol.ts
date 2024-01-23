
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { MetasCol } from "../../models/MetasCol";
import JezaApiService from "../../api/jezaApi2";

export const useMetasCol = () => {
  const { jezaApi } = JezaApiService();
  const [dataMetasCol, setMetasCol] = useState<MetasCol[]>([]);

  const fetchMetas = async () => {
    try {
      const response: AxiosResponse<MetasCol[]> = await jezaApi.get("/sp_cat_colaboradoresMetasSel?id=0");
      setMetasCol(response.data);
      console.log({ dataMetasCol });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  return { dataMetasCol, fetchMetas };
};
