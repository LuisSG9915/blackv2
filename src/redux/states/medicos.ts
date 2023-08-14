import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage,setLocalStorage } from "../../utilities/localstorage.utility";
import { Medico } from "../../models/Medico";

const initialState: Medico[] = [];

// Mis llaves cambian y con esto cambiamos todo...
enum LocalStorageTypes {
    MEDICOS = "medicos"
}


export const medicosSlice = createSlice({
    name: LocalStorageTypes.MEDICOS,
    initialState: getLocalStorage(LocalStorageTypes.MEDICOS) ? JSON.parse(getLocalStorage(LocalStorageTypes.MEDICOS) as string) : initialState,
    reducers: {
        addMedicos: (state, action) => {
            setLocalStorage(LocalStorageTypes.MEDICOS, state)
            return action.payload;
        },
        getMedicos:(state, action) => {
            getLocalStorage(LocalStorageTypes.MEDICOS)
            return action.payload
        }
    }
})

export const { addMedicos, getMedicos } = medicosSlice.actions;