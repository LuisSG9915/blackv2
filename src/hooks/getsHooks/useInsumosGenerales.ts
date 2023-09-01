import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { Venta } from "../../models/Venta";
interface Props {
  marca: any;
}

export const useInsumosGenerales = ({ marca }: Props) => {

 
  const [dataInsumoGenerales, setDataInsumosGenerales] = useState<Venta[]>([]);
  const fetchInsumosGenerales = async () => {
    try {
      if(marca){
         const response: AxiosResponse<any[]> = await jezaApi.get(`/ProductoInsumo?id=0&palabra=${marca}`);
      setDataInsumosGenerales(response.data);
      }else{
      const response: AxiosResponse<any[]> = await jezaApi.get(`/ProductoInsumo?id=0&palabra=%`);
      setDataInsumosGenerales(response.data);
      
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     fetchInsumosGenerales();
  //   }, 1000);
  // }, [marca.length > 2]);

  return { dataInsumoGenerales, fetchInsumosGenerales };
};
