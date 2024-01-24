// import { jezaApi } from "../api/jezaApi";
import JezaApiService from "../api/jezaApi2";
import { Medico } from "../models/Medico";
import { Venta } from "../models/Venta";


export const editarMedico = (dato: any) => {
  const { jezaApi } = JezaApiService();
  jezaApi
    .put(`/Medico`, {
      id: dato.id,
      nombre: dato.nombre,
      email: dato.email,
      idClinica: dato.idClinica,
      telefono: "",
      mostrarTel: false,
    })

  // const arreglo: Medico[] = [...data];
  // const index = arreglo.findIndex((registro) => registro.id === dato.id);
};

export const eliminarMedico = async (dato: Venta): Promise<void> => {
  const { jezaApi } = JezaApiService();
      const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {

    try {
      await jezaApi.delete(`/Medico?idMedico=${dato.id}`);
    } catch (error) {
      console.log(error)
    }
    }
};

export const insertarMedico = async (form: Medico) => {
  const { jezaApi } = JezaApiService();
  await jezaApi
    .post("/Medico", {
      nombre: form.nombre,
      email: form.email,
      idClinica: form.idClinica,
      telefono: "",
      mostrarTel: false,
    })
};

export const getMedico = async () => {
  const { jezaApi } = JezaApiService();
  try {
    const response = await jezaApi.get("Medico");
    return response;
  } catch (error) {
    console.error(error); // Imprimir el error en la consola en caso de que ocurra
    throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
  }
};