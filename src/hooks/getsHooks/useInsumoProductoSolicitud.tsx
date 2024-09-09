import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { VentaInsumo } from "../../models/VentaInsumo";
interface Props {
  idVenta: any;
}
export const useInsumoProductoSolicitud = ({ idVenta }: Props) => {
  const [datoInsumosProductoSolicitud, setDatoInsumosProductoSolicitud] = useState<VentaInsumo[]>([]);
  const fetchInsumosProductoSolicitud = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/VentaInsumoSolicitud?id_venta=${idVenta}`);
      setDatoInsumosProductoSolicitud(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchInsumosProductoSolicitud();
  }, [idVenta]);
  return { datoInsumosProductoSolicitud, fetchInsumosProductoSolicitud };
};
