import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { AnticipoGet } from "../../models/Anticipo";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  cia: number;
}
export const useAnticipos = ({ cia }: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataAnticipos, setAnticipos] = useState<AnticipoGet[]>([]);

  const fetchAnticipos = async () => {
    try {
      const response: AxiosResponse<AnticipoGet[]> = await jezaApi.get(
        `/Anticipo?id=%&idcia=${cia}&idsuc=%&idnoVenta=%&idCliente=%&idtipoMovto=%&idformaPago=%&f1=20230101&f2=20500731`
      );
      setAnticipos(response.data);
      console.log({ dataAnticipos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAnticipos();
  }, []);

  return { dataAnticipos, fetchAnticipos, setAnticipos };
};
