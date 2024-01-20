//

import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { AnticipoGet } from "../../models/Anticipo";
import JezaApiService from "../../api/jezaApi2";
// Ya no se usa
export const useAnticipoValidar = () => {
  const { jezaApi } = JezaApiService();
  const [dataAnticiposVal, setAnticiposVal] = useState<AnticipoGet[]>([]);

  const fetchAnticiposVal = async () => {
    try {
      const response: AxiosResponse<AnticipoGet[]> = await jezaApi.get(
        `/Anticipo?id=%&idcia=%&idsuc=%&idnoVenta=%&idCliente=%&idtipoMovto=%&idformaPago=%&f1=20230101&f2=20601231`
      );
      setAnticiposVal(response.data);
      console.log({ dataAnticiposVal });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAnticiposVal();
  }, []);

  return { dataAnticiposVal, fetchAnticiposVal, setAnticiposVal };
};
