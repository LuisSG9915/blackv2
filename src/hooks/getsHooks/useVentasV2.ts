import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { Venta } from "../../models/Venta";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  idCliente: any;
  sucursal: number;
}

export const useVentasV2 = ({ idCliente, sucursal }: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataVentas, setDataVentas] = useState<Venta[]>([]);
  const fetchVentas = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/VentaCliente?suc=${sucursal}&cliente=${idCliente}`);
      setDataVentas(response.data);
      // console.log({ dataVentas });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchVentas();
    }, 1000);
  }, [idCliente]);

  return { dataVentas, fetchVentas };
};
