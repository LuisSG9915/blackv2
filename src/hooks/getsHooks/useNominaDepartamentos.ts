import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { RecursosDepartamento } from "../../models/RecursosDepartamento";

export const useNominaDepartamentos = () => {
  const [dataNominaDepartamentos, setDataNominaDepartamentos] = useState<RecursosDepartamento[]>([]);

  const fetchNominaDepartamentos = async () => {
    try {
      const response: AxiosResponse<RecursosDepartamento[]> = await jezaApi.get("/NominaDepartamentos?id=%&idcia=%&idsuc=%");
      setDataNominaDepartamentos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNominaDepartamentos();
  }, []);

  return { dataNominaDepartamentos, fetchNominaDepartamentos };
};
