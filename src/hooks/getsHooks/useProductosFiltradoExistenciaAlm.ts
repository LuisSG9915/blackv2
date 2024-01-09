import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Producto, ProductoExistencia } from "../../models/Producto";
import { jezaApi } from "../../api/jezaApi";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  descripcion: string;
  inventariable: number;
  servicio: number;
  insumo: number;
  obsoleto: number;
  sucursal: number;
  almacen: number;
  idCliente: number;
  cia: number;
}
export const useProductosFiltradoExistenciaAlm = ({
  descripcion,
  insumo,
  inventariable,
  obsoleto,
  servicio,
  sucursal,
  almacen,
  idCliente,
  cia,
}: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataProductos3, setDataProductos3] = useState<ProductoExistencia[]>([]);

  const fetchProduct3 = async () => {
    try {
      const response: AxiosResponse<ProductoExistencia[]> = await jezaApi.get(
        `/sp_cPSEAC?id=0&descripcion=${
          descripcion ? descripcion : "%"
        }&verinventariable=${inventariable}&esServicio=${servicio}&esInsumo=${insumo}&obsoleto=${obsoleto}&marca=%&cia=${
          cia ? cia : "%"
        }&sucursal=${sucursal}&almacen=${almacen}&idCliente=${idCliente ? idCliente : 29003}`
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
