//

import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { AnticipoGet } from "../../models/Anticipo";
import JezaApiService from "../../api/jezaApi2";
interface Props {
  cliente: number;
  suc: string;
}
// Ya no se usa
export const useAnticipoVentas = ({ cliente, suc }: Props) => {
  const { jezaApi } = JezaApiService();
  const [dataAnticipos, setAnticipos] = useState<AnticipoGet[]>([]);

  const fetchAnticipos = async () => {
    try {
      const response: AxiosResponse<AnticipoGet[]> = await jezaApi.get(
        `/Anticipo?id=%&idcia=%&idsuc=${suc}&idnoVenta=%&idCliente=${cliente}&idtipoMovto=%&idformaPago=%&f1=20230101&f2=20601231`
      );
      setAnticipos(response.data);
      console.log({ dataAnticipos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAnticipos();
  }, [cliente]);

  return { dataAnticipos, fetchAnticipos, setAnticipos };
};
