import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { ComisionRepo } from "../../models/ComisionRepo";
import JezaApiService from "../../api/jezaApi2";

export const useRepoComision = () => {
  const { jezaApi } = JezaApiService();
  const [dataRepoComi, setDataRepoComi] = useState<ComisionRepo[]>([]);

  const fetchRepCom = async () => {
    try {
      const response: AxiosResponse<ComisionRepo[]> = await jezaApi.get("/sp_repoComisiones1?suc=%&f1=20230801&f2=20700130&estilista=%");
      setDataRepoComi(response.data);
      // console.log({ dataClientes });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRepCom();
  }, []);

  return { dataRepoComi, fetchRepCom, setDataRepoComi };
};
