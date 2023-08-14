import { configureStore } from "@reduxjs/toolkit";
import { medicosSlice } from "./states/medicos";
import { Medico } from "../models/Medico";
import { ventasSlice } from "./states/estilistas";
  interface Venta {
    estilista: string;
    producto: string;
    cantidad: number;
    precio: number;
    tasaIva: number;
    tiempo: number;
  }
export interface AppStore { 
    medicos: Medico[];
    ventas: Venta[];
}
export default configureStore<AppStore>({
    reducer:{
        medicos: medicosSlice.reducer,
        ventas: ventasSlice.reducer,
    }
});