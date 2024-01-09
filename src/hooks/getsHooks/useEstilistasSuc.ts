import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import JezaApiService from "../../api/jezaApi2";

interface Props {
  sucursal: number;
}
export const useEstilistasSuc = ({ sucursal }: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataEstilistasSuc, setDataEstilistasSuc] = useState<any[]>([]);

  const fetchEstilistasSuc = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/Estilistas?suc=${sucursal}`);
      setDataEstilistasSuc(response.data);
      const filtrado = dataEstilistasSuc.filter((estilista) => estilista.idPuesto === 1);
      console.log({ filtrado });
      setDataEstilistasSuc(filtrado);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEstilistasSuc();
  }, [sucursal]);

  return { dataEstilistasSuc, fetchEstilistasSuc };
};
