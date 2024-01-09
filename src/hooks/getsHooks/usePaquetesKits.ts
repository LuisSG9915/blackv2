import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { Kit } from "../../models/Kit";
import { Producto } from "../../models/Producto";
import JezaApiService from "../../api/jezaApi2";

export const usePaquetesKits = (dato: Producto) => {
  const { jezaApi } = JezaApiService();
  const [dataPaquetesKits, setDataPaquetesKits] = useState<Kit[]>([]);

  const fetchPaquetesKits = async () => {
    try {
      const response: AxiosResponse<Kit[]> = await jezaApi.get(`/Kit?id=${dato.id}`);
      setDataPaquetesKits(response.data);
      console.log("KIT EJECUTADA" + dato.id);
      console.log(dataPaquetesKits);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPaquetesKits();
  }, [dato.id]);

  return { dataPaquetesKits, fetchPaquetesKits };
};
