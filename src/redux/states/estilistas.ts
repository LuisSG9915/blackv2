import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage,setLocalStorage } from "../../utilities/localstorage.utility";
import { Medico } from "../../models/Medico";
import { Estilistas } from "../../screens/ventas/Components/TableEstilistas";

const initialState: Estilistas[] = [];

// Mis llaves cambian y con esto cambiamos todo...
enum LocalStorageTypes {
    ESTILISTAS = "estilistas"
}


export const ventasSlice = createSlice({
    name: LocalStorageTypes.ESTILISTAS,
    initialState: getLocalStorage(LocalStorageTypes.ESTILISTAS) ? JSON.parse(getLocalStorage(LocalStorageTypes.ESTILISTAS) as string) : initialState,
    reducers: {
        addEstilistas: (state, action) => {
            setLocalStorage(LocalStorageTypes.ESTILISTAS, state)
            return action.payload;
        },
        getEstilistas:(state, action) => {
            getLocalStorage(LocalStorageTypes.ESTILISTAS)
            return action.payload
        }
    }
})

export const { addEstilistas, getEstilistas } = ventasSlice.actions;