import React, { useEffect, useState } from "react";
import { Medico } from "../models/Medico";
import JezaApiService from "../api/jezaApi2";

interface Props {
  url: string;
}

export interface DataClinica {
  id?: any;
  nombre?: any;
}

type FormUnion = Medico | DataClinica;

function useReadHook({ url }: Props) {
  const { jezaApi } = JezaApiService();

  const [data, setdata] = useState<FormUnion[]>([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const llamada = () => {
    jezaApi
      .get(url)
      .then((response) => {
        setdata(response.data);
        setloading(false);
      })
      .catch((error) => {
        seterror("Error al cargar los datos" + error); // Puedes personalizar el mensaje de error según tus necesidades
        setloading(false);
      });
    console.log("ejecutada" + url);
  };
  useEffect(() => {
    llamada();
  }, [url]);
  return { data, loading, error, llamada, setdata };
}

export default useReadHook;
