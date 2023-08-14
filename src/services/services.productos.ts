import { AxiosResponse } from "axios";
import { jezaApi } from "../api/jezaApi";
import { Medico } from "../models/Medico";
import { Producto } from "../models/Producto";

export const getProductos = async (): Promise<AxiosResponse<Producto>> => {
  try {
    const response = await jezaApi.get("/Producto?id=0");
    return response.data;
  } catch (error) {
    console.error(error); // Imprimir el error en la consola en caso de que ocurra
    throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
  }
};
