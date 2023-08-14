import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { CompraProveedor } from "../../models/CompraProveedor";
import { CompraSeleccion } from "../../models/CompraSeleccion";
interface Props {
  fecha1: string;
  fecha2: string;
  sucursal: number;
}
export const useComprasSeleccion = ({ fecha1, fecha2, sucursal }: Props) => {
  const [dataComprasSeleccion, setDataComprasSeleccion] = useState<CompraSeleccion[]>([]);

  const fetchComprasSeleccion = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/CompraListaSel?cia=26&sucursal=${sucursal}&f1=${fecha1}&f2=${fecha2}`);
      setDataComprasSeleccion(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComprasSeleccion();
  }, [fecha1, fecha2]);

  return { dataComprasSeleccion, fetchComprasSeleccion };
};
