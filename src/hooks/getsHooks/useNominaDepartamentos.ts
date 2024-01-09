import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { RecursosDepartamento } from "../../models/RecursosDepartamento";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  cia: number;
}
export const useNominaDepartamentos = ({ cia }: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataNominaDepartamentos, setDataNominaDepartamentos] = useState<RecursosDepartamento[]>([]);

  const fetchNominaDepartamentos = async () => {
    try {
      const response: AxiosResponse<RecursosDepartamento[]> = await jezaApi.get(`/NominaDepartamentos?id=%&idcia=${cia ? cia : "%"}&idsuc=%`);
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
