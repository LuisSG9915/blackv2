import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { AnticipoGet } from "../../models/Anticipo";
interface Props {
  cia: number;
}
export const useAnticipos = ({ cia }: Props) => {
  const [dataAnticipos, setAnticipos] = useState<AnticipoGet[]>([]);

  const fetchAnticipos = async () => {
    try {
      const response: AxiosResponse<AnticipoGet[]> = await jezaApi.get(
        `/Anticipo?id=%&idcia=${cia}&idsuc=%&idnoVenta=%&idCliente=%&idtipoMovto=%&idformaPago=%&f1=20230101&f2=20230731`
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
