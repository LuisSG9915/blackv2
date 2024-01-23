import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { VentaInsumo } from "../../models/VentaInsumo";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  idVenta: any;
}
export const useInsumosProductosResumen = ({ idVenta }: Props) => {
  const { jezaApi } = JezaApiService();
  const [datoInsumosProductoResumen, setDatoInsumosProductoResumen] = useState<VentaInsumo[]>([]);
  const fetchInsumosProductoResumen = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/VentaInsumo?id_venta=${idVenta}`);
      setDatoInsumosProductoResumen(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchInsumosProductoResumen();
  }, [idVenta]);
  return { datoInsumosProductoResumen, fetchInsumosProductoResumen };
};
