import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Producto } from "../../models/Producto";
import { jezaApi } from "../../api/jezaApi";

export const useProductos = () => {
  const [dataProductos, setDataProductos] = useState<Producto[]>([]);

  const fetchProduct = async () => {
    try {
      const response: AxiosResponse<Producto[]> = await jezaApi.get(
        "/producto?id=0&descripcion=%&verinventariable=0&esServicio=2&esInsumo=2&obsoleto=2&marca=%&cia=21&sucursal=26"
      );
      setDataProductos(response.data);
      console.log(dataProductos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return { dataProductos, fetchProduct, setDataProductos };
};
