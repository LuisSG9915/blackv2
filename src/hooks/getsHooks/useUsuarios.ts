import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { Marca } from "../../models/Marca";
import { Sucursal } from "../../models/Sucursal";
import { Usuario } from "../../models/Usuario";
import JezaApiService from "../../api/jezaApi2";

export const useUsuarios = () => {
  const { jezaApi } = JezaApiService();
  const [dataUsuarios, setDataUsuarios] = useState<Usuario[]>([]);

  const fetchUsuarios = async () => {
    try {
      const response: AxiosResponse<Usuario[]> = await jezaApi.get("/Usuario?id=0");
      setDataUsuarios(response.data);
      console.log({ dataUsuarios });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return { dataUsuarios, fetchUsuarios };
};
