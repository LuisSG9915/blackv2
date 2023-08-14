import React, { useState } from "react";
import CFormGroupInput from "../components/CFormGroupInput";
import { Perfil } from "../models/Perfil";

function TabPerfil() {
  const [perfil, setPerfil] = useState<Perfil>({
    clave_perfil: 1,
    descripcion_perfil: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPerfil((prevState: any) => ({ ...prevState, [name]: value }));
  };
  return <CFormGroupInput handleChange={handleChange} inputName="tasa_ieps" labelName="Perfil:" value={perfil.descripcion_perfil} />;
}

export default TabPerfil;
