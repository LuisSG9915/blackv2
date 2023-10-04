import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { VentaInsumo } from "../../models/VentaInsumo";
interface Props {
  idVenta: any;
}

export const useInsumosProductos = ({ idVenta }: Props) => {
  const [datoInsumosProducto, setDatoInsumosProducto] = useState<VentaInsumo[]>([]);
  const fetchInsumosProducto = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/VentaInsumo?id_venta=${idVenta}`);
      setDatoInsumosProducto(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInsumosProducto();
  }, [idVenta]);

  return { datoInsumosProducto, fetchInsumosProducto };
};
