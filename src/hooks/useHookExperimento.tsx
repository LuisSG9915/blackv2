import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

type APIResponse<T> = {
  data: T | null;
  isLoading: boolean;
  error: AxiosError | null;
};

const useHookExperimento = <T,>(url: string, options: AxiosRequestConfig = {}): APIResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response: AxiosResponse<T> = await axios(url, options);

        if (isMounted) {
          setData(response.data);
          setLoading(false);
        }
      } catch (error: any) {
        if (isMounted) {
          setError(error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, options]);

  return { data, isLoading, error };
};

export default useHookExperimento;
