import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Kit } from "../../models/Kit";
import { Trabajador } from "../../models/Trabajador";
import JezaApiService from "../../api/jezaApi2";

export const useNominaTrabajadores = () => {
  const { jezaApi } = JezaApiService();
  const [dataTrabajadores, setDataTrabajadores] = useState<Trabajador[]>([]);

  const fetchNominaTrabajadores = async () => {
    try {
      const response: AxiosResponse<Trabajador[]> = await jezaApi.get(`/Trabajador?id=0`);
      setDataTrabajadores(response.data);
      // console.log(dataTrabajadores);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNominaTrabajadores();
  }, []);

  return { dataTrabajadores, fetchNominaTrabajadores };
};
