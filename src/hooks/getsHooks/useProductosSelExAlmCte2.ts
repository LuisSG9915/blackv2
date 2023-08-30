import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Producto, ProductoExistencia } from "../../models/Producto";
import { jezaApi } from "../../api/jezaApi";
interface Props {
  descripcion: string;
  inventariable: number;
  servicio: number;
  insumo: number;
  obsoleto: number;
  sucursal: number;
  cia: number;
  almacen: number;
  idCliente: number;
}
export const useProductosSelExAlmCte2 = ({ descripcion, insumo, inventariable, obsoleto, servicio, sucursal, cia, almacen, idCliente }: Props) => {
  const [dataProductosSelExAlmCte2, setDataProductosSelExAlmCte2] = useState<ProductoExistencia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchProductosSelExAlmCte2 = async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<ProductoExistencia[]> = await jezaApi.get(
        `/sp_catProductosSelExAlmCte2?id=0&descripcion=${
          descripcion ? descripcion : "%"
        }&verinventariable=${inventariable}&esServicio=${servicio}&esInsumo=${insumo}&obsoleto=${obsoleto}&marca=%&cia=${cia}&sucursal=${sucursal}&almacen=${almacen}&idCliente=${idCliente}`
      );
      setDataProductosSelExAlmCte2(response.data);
      console.log({ dataProductosSelExAlmCte2 });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductosSelExAlmCte2();
  }, []);
  useEffect(() => {
    fetchProductosSelExAlmCte2();
  }, [descripcion, inventariable, descripcion]);

  return { dataProductosSelExAlmCte2, fetchProductosSelExAlmCte2, setDataProductosSelExAlmCte2, isLoading };
};
