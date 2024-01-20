import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const JezaApiService = () => {
  const { token } = useAuth();
  const [tokenTemp, setTokenTemp] = useState(() => {
    const item = localStorage.getItem("token");
    return item ? JSON.parse(item) : null;
  });
  useEffect(() => {
    setTokenTemp(token);
  }, [token]);

  // Crea una instancia de Axios
  const jezaApi = axios.create({
    //baseURL: "http://localhost:61118",
    baseURL: " http://cbinfo.no-ip.info:9083",

    headers: {
      "Content-Type": "application/json",
    },
    timeout: 25000,
  });

  // Añade un interceptor para actualizar el encabezado de autorización antes de cada solicitud
  jezaApi.interceptors.request.use(
    (config) => {
      // Obtiene el token de autenticación
      const authToken = tokenTemp;

      // Añade el token a la cabecera de la solicitud
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken ? authToken : "NADAAAA"}`;
      }
      config.headers["Cache-Control"] = "no-cache";

      return config;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Manejar el error de CORS aquí
        console.error("Error de CORS:", error.message);
      }
      return Promise.reject(error);
    }
  );

  // Actualiza el estado local del token cuando cambia
  useEffect(() => {
    setTokenTemp(token);
  }, [token]);

  // Devuelve la instancia de jezaApi
  return { jezaApi };
};

export default JezaApiService;

