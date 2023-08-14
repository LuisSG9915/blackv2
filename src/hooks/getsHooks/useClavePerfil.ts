import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { Sucursal } from "../../models/Sucursal";
import { Perfil } from "../../models/Perfil";

export const usePerfiles = () => {
  const [dataPerfiles, setDataPerfiles] = useState<Perfil[]>([]);

  const fetchPerfiles = async () => {
    try {
      const response: AxiosResponse<Perfil[]> = await jezaApi.get("/Perfil?id=0");
      setDataPerfiles(response.data);
      console.log({ dataPerfiles });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPerfiles();
  }, []);

  return { dataPerfiles, fetchPerfiles };
};
