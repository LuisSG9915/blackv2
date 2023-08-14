import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { NivelEscolaridad } from "../../models/NivelEscolaridad";

export const useNominaEscolaridad = () => {
  const [dataNominaNivel, setDataNominaNivel] = useState<NivelEscolaridad[]>([]);

  const fetchNominaNivel = async () => {
    try {
      const response: AxiosResponse<NivelEscolaridad[]> = await jezaApi.get("/Nominanivel?id=%");
      setDataNominaNivel(response.data);
      console.log({ dataNominaNivel });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNominaNivel();
  }, []);

  return { dataNominaNivel, fetchNominaNivel };
};
