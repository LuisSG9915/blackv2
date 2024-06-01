import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { NominaAnticipo } from "../../models/NominaAnticipo";

export const useAnticipoNomina = () => {
  const [dataAnticipoNomina , setDataAnticipoNomina ] = useState<NominaAnticipo[]>([]);

  const fetchAnticipoNomina  = async () => {
    try {
      const response: AxiosResponse<NominaAnticipo[]> = await jezaApi.get("/sp_detalleAnticipoNomSel?id=0");
      setDataAnticipoNomina (response.data);
      console.log({ dataAnticipoNomina  });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAnticipoNomina ();
  }, []);

  return { dataAnticipoNomina , fetchAnticipoNomina  };
};
