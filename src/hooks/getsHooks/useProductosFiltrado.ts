import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Producto } from "../../models/Producto";
import { jezaApi } from "../../api/jezaApi";
interface Props {
  descripcion: string;
  inventariable: number;
  servicio: number;
  insumo: number;
  obsoleto: number;
}
export const useProductosFiltrado = ({ descripcion, insumo, inventariable, obsoleto, servicio }: Props) => {
  const [dataProductos2, setDataProductos2] = useState<Producto[]>([]);

  const fetchProduct2 = async () => {
    try {
      const response: AxiosResponse<Producto[]> = await jezaApi.get(
        `/producto?id=0&descripcion=${
          descripcion ? descripcion : "%"
        }&verinventariable=${inventariable}&esServicio=${servicio}&esInsumo=${insumo}&obsoleto=${obsoleto}&marca=%&cia=21&sucursal=26`
      );
      setDataProductos2(response.data);
      console.log({ dataProductos2 });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct2();
  }, []);
  useEffect(() => {
    fetchProduct2();
  }, [descripcion]);

  return { dataProductos2, fetchProduct2, setDataProductos2 };
};
