import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const JezaApiService = () => {
  const { token } = useAuth();

  // Separate initialization code for tokenTemp
  const getInitialTokenTemp = () => {
    const item = localStorage.getItem("token");
    return item ? JSON.parse(item) : null;
  };

  const [tokenTemp, setTokenTemp] = useState(getInitialTokenTemp);

  useEffect(() => {
    setTokenTemp(tokenTemp);
  }, [token]);

  useEffect(() => {
    setrTempToken(tokenTemp);
  }, [tokenTemp]);

  const setrTempToken = (newToken) => {
    // Perform actions with the new token here
    console.log("New token:", newToken);
  };

  const jezaApi = axios.create({
    baseURL: "http://cbinfo.no-ip.info:9083",
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 25000,
  });

  jezaApi.interceptors.request.use(
    async (config) => {
      const authToken = tokenTemp;
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      config.headers["Cache-Control"] = "no-cache";

      // Verificar si la solicitud es de tipo POST
      if (config.method === "post" && config.params) {
        // Agregar los datos de config.parameters al cuerpo de la solicitud POST
        config.data = config.params;
        console.log(config.data);
      }

      return config;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error("Error de CORS:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return { jezaApi };
};

export default JezaApiService;
