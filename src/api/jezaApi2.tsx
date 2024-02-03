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
    timeout: 10000,
  });

  //25000,

  jezaApi.interceptors.request.use(
    (config) => {
      const authToken = tokenTemp;
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      config.headers["Cache-Control"] = "no-cache";
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
