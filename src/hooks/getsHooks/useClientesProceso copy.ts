import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { Descuento } from "../../models/Descuento";

export const useDescuentos = () => {
  const [dataDescuentos, setDataDescuentos] = useState<Descuento[]>([]);

  const fetchDescuentos = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get("/Tipodescuento?id=0");
      setDataDescuentos(response.data);
      console.log({ dataDescuentos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDescuentos();
  }, []);

  return { dataDescuentos, fetchDescuentos };
};
