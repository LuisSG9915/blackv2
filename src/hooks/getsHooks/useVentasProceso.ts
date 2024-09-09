import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Venta } from "../../models/Venta";
interface Props {
  idSucursal: any;
  estilista: any;
}
interface Proceso {
  id_cliente: number;
  nombre: string;
}

export const useVentasProceso = ({ idSucursal , estilista}: Props) => {
  const [dataVentasProcesos, setDataVentasProcesos] = useState<any[]>([]);
  const fetchVentasProcesos = async () => {
    try {
      const response: AxiosResponse<any[]> = await jezaApi.get(`/ClienteProceso?suc=${idSucursal}&estilista=${estilista}`);
      // const response: AxiosResponse<Venta[]> = await jezaApi.get(`/VentaCliente?suc=1&cliente=6`);
      setDataVentasProcesos(response.data);
      console.log({ dataVentasProcesos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVentasProcesos();
  }, [idSucursal, estilista]);

  return { dataVentasProcesos, fetchVentasProcesos };
};
