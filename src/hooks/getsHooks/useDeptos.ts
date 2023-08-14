import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Area } from "../../models/Area";
import { Departamento } from "../../models/Departamento";

export const useDeptos = () => {
  const [dataDeptos, setDeptos] = useState<Departamento[]>([]);

  const fetchAreas = async () => {
    try {
      const response: AxiosResponse<Departamento[]> = await jezaApi.get("/Depto?area=0&id=0");
      setDeptos(response.data);
      console.log({ dataDeptos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return { dataDeptos, fetchAreas };
};
