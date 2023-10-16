import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { VentaInsumo } from "../../models/VentaInsumo";
interface Props {
  idVenta: any;
}
export const useInsumosProductosResumen = ({ idVenta }: Props) => {
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
