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
}
export const useProductosFiltradoExistencia = ({ descripcion, insumo, inventariable, obsoleto, servicio, sucursal }: Props) => {
  const [dataProductos3, setDataProductos3] = useState<ProductoExistencia[]>([]);

  const fetchProduct3 = async () => {
    try {
      const response: AxiosResponse<ProductoExistencia[]> = await jezaApi.get(
        `/ProductoExistencia?id=0&descripcion=${
          descripcion ? descripcion : "%"
        }&verinventariable=${inventariable}&esServicio=${servicio}&esInsumo=${insumo}&obsoleto=${obsoleto}&marca=%&cia=21&sucursal=${sucursal}`
      );
      setDataProductos3(response.data);
      console.log({ dataProductos3 });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct3();
  }, []);
  useEffect(() => {
    fetchProduct3();
  }, [descripcion]);

  return { dataProductos3, fetchProduct3, setDataProductos3 };
};
