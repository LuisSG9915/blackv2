import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useAlmacen } from "./useAlmacen";
import { InsumoExistencia } from "../../screens/ventas/Components/TableProductos";
import JezaApiService from "../../api/jezaApi2";
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

export const useInsumosProductos = ({ descripcion, insumo, inventariable, obsoleto, servicio, sucursal, almacen, cia, idCliente }: Props) => {
  const { jezaApi } = JezaApiService();
  const { dataAlmacenes } = useAlmacen();
  const [dataProductos4, setDataProductos4] = useState<InsumoExistencia[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [datoInsumosProducto, setDatoInsumosProducto] = useState<InsumoExistencia[]>([]);
  const fetchInsumosProducto = async () => {
    if (sucursal > 0) {
      setIsLoading(true);

      const objetoEncontrado = dataAlmacenes.find((item) => item.sucursal === sucursal && item.almacen === almacen);

      if ((objetoEncontrado && objetoEncontrado.id) || almacen > 2) {
        try {
          const response: AxiosResponse<InsumoExistencia[]> = await jezaApi.get(
            `/sp_cPSEAC?id=0&descripcion=${
              descripcion ? descripcion : "%"
            }&verinventariable=${inventariable}&esServicio=${servicio}&esInsumo=${insumo}&obsoleto=${obsoleto}&marca=%&cia=${cia}&sucursal=${sucursal}&almacen=${
              almacen <= 2 ? objetoEncontrado.id : almacen
            }&idCliente=${idCliente ? idCliente : 29003}`
          );
          setDatoInsumosProducto(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("No se encontró un objeto que cumpla los criterios de búsqueda.");
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    fetchInsumosProducto();
  }, [dataAlmacenes, sucursal, cia, descripcion]);

  return { datoInsumosProducto, fetchInsumosProducto };
};
