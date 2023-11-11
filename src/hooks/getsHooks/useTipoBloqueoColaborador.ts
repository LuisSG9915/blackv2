import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { TiposdeBajas } from "../../models/TiposdeBajas";
import { TipoBloqueoColaborador } from "../../models/TipoBloqueoColaborador";

export const useTipoBloqueoColaborador = () => {
  const [dataTipoBloqueoColaborador, setTipoBloqueoColaborador] = useState<TipoBloqueoColaborador[]>([]);

  const fetchTipoBloqueoColaborador = async () => {
    try {
      const response: AxiosResponse<TipoBloqueoColaborador[]> = await jezaApi.get("/sp_detalle_bloqueosColaboradoresSel?id=%");
      setTipoBloqueoColaborador(response.data);
      console.log({ dataTipoBloqueoColaborador });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTipoBloqueoColaborador();
  }, []);

  return { dataTipoBloqueoColaborador, fetchTipoBloqueoColaborador };
};