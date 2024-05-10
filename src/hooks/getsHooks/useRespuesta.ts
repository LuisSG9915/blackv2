import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { RespuestaClie } from "../../models/RespuestaClie";

export const useRespuesta = () => {
  const [dataRespuesta, setRespuesta] = useState<RespuestaClie[]>([]);

  const fetchRespuesta = async () => {
    try {
      const response: AxiosResponse<RespuestaClie[]> = await jezaApi.get("/sp_respuestaClienteReagendado?id=0");
      setRespuesta(response.data);
      console.log({ dataRespuesta });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRespuesta();
  }, []);

  return { dataRespuesta, fetchRespuesta };
};
