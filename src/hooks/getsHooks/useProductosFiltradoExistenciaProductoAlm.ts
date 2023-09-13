import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Producto, ProductoExistencia } from "../../models/Producto";
import { jezaApi } from "../../api/jezaApi";
import { useAlmacen } from "./useAlmacen";
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
export const useProductosFiltradoExistenciaProductoAlm = ({
  descripcion,
  insumo,
  inventariable,
  obsoleto,
  servicio,
  sucursal,
  almacen,
  cia,
  idCliente,
}: Props) => {
  const { dataAlmacenes } = useAlmacen();
  const [dataProductos4, setDataProductos4] = useState<ProductoExistencia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchProduct4 = async () => {
    setIsLoading(true);

    const objetoEncontrado = dataAlmacenes.find((item) => item.sucursal === sucursal && item.almacen === almacen);

    if (objetoEncontrado) {
      try {
        const response: AxiosResponse<ProductoExistencia[]> = await jezaApi.get(
          `/sp_cPSEAC?id=0&descripcion=${
            descripcion ? descripcion : "%"
          }&verinventariable=${inventariable}&esServicio=${servicio}&esInsumo=${insumo}&obsoleto=${obsoleto}&marca=%&cia=${cia}&sucursal=${sucursal}&almacen=${
            almacen <= 2 ? objetoEncontrado.id : almacen
          }&idCliente=${idCliente ? idCliente : 29003}`
        );
        setDataProductos4(response.data);
        console.log({ dataProductos4 });
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No se encontró un objeto que cumpla los criterios de búsqueda.");
    }
  };

  useEffect(() => {
    fetchProduct4();
  }, []);
  useEffect(() => {
    fetchProduct4();
  }, [descripcion, inventariable, descripcion]);

  return { dataProductos4, fetchProduct4, setDataProductos4, isLoading };
};
