import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import JezaApiService from "../../api/jezaApi2";

export const useAreas = () => {
  const { jezaApi } = JezaApiService();
  const [dataAreas, setAreas] = useState<Area[]>([]);

  const fetchAreas = async () => {
    try {
      const response: AxiosResponse<Area[]> = await jezaApi.get("/Area?area=0");
      setAreas(response.data);
      console.log({ dataAreas });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return { dataAreas, fetchAreas };
};
