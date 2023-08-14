import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "../../utilities/localstorage.utility";
import { Medico } from "../../models/Medico";

const initialState: Venta[] = [];
interface Venta {
  estilista: string;
  producto: string;
  cantidad: number;
  precio: number;
  tasaIva: number;
  tiempo: number;
}

interface Ventas2 {
  id?: number;
  Sucursal: string;
  Fecha: string;
  Caja: number;
  No_venta: number;   /* PREGUNTA, el numbero de venta de donde lo */
  Clave_prod: number;
  Cant_producto: number;
  Precio: number;
  Cve_cliente: number;
  Tasa_iva: number;
  ieps: number;
  Observacion: string;
  Descuento: number;
  Clave_Descuento: number;
  Usuario: string;
  Credito: boolean;
  Corte: number;
  Corte_parcial: number;
  Costo: number;
  cancelada: boolean;
  idEstilista: number;
  folio_estilista: number;
  hora: string;
  tiempo: number;
  terminado: boolean;
  validadoServicio: boolean;
}

// Mis llaves cambian y con esto cambiamos todo...
enum LocalStorageTypes {
  VENTAS = "ventas",
}

export const ventasSlice = createSlice({
  name: LocalStorageTypes.VENTAS,
  initialState: getLocalStorage(LocalStorageTypes.VENTAS) ? JSON.parse(getLocalStorage(LocalStorageTypes.VENTAS) as string) : initialState,
  reducers: {
    addVentas: (state, action) => {
      const newState = [...state, action.payload];
      setLocalStorage(LocalStorageTypes.VENTAS, newState);
      return newState;
    },
    getVentas: (state, action) => {
      const storedState = getLocalStorage(LocalStorageTypes.VENTAS);
      return storedState ? JSON.parse(storedState) : state;
    },
  },
});

export const { addVentas, getVentas } = ventasSlice.actions;
