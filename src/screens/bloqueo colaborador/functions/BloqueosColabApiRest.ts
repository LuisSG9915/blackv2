import Swal from "sweetalert2";
// import { jezaApi } from "../../../api/jezaApi";
import { BloqueoColab } from "../../../models/BloqueoColaborador";
import { format } from "date-fns";
import JezaApiService from "../../../api/jezaApi2";

export const postBloqueoColaborador = async (form, idUsuario) => {
  const { jezaApi } = JezaApiService();
  const { fecha, idColaborador, idTipoBloqueo, h1, h2, observaciones } = form;
  if (form.fecha.length && form.idColaborador > 0 && idTipoBloqueo > 0) {
    const newH1 = format(new Date(h1), "yyyy-MM-dd HH:mm");
    const newH2 = format(new Date(h2), "yyyy-MM-dd HH:mm");
    return jezaApi
      .post(
        `/sp_detalle_bloqueosColaboradoresAdd?fecha=${fecha}&idColaborador=${idColaborador}&idTipoBloqueo=${idTipoBloqueo}&h1=${newH1}&h2=${newH2}&observaciones=${observaciones}&usrRegisro=${idUsuario}`
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          text: "Bloqueo realizado con éxito",
          confirmButtonColor: "#3085d6",
        });
        console.log(response); // Verificar la respuesta obtenida
        return response; // Devuelve la respuesta
      })
      .catch((e) => {
        console.log(e);
        throw e; // Relanza el error para que se maneje más arriba si es necesario
      });
  } else {
    Swal.fire({
      icon: "error",
      title: "Campos vacíos",
      text: `Favor de llenar todos los campos`,
      confirmButtonColor: "#3085d6",
    });
    return null; // Devuelve null o un valor apropiado en caso de falla
  }
};

export const putBloqueoColaborador = async (form, idUsuario) => {
  const { id, fecha, idColaborador, idTipoBloqueo, h1, h2, observaciones } = form;
  const newH1 = format(new Date(h1), "yyyy-MM-dd HH:mm");
  const newH2 = format(new Date(h2), "yyyy-MM-dd HH:mm");
  await jezaApi
    .put(
      `sp_detalle_bloqueosColaboradoresUpd?id=${id}&fecha=${fecha}&idColaborador=${idColaborador}&idTipoBloqueo=${idTipoBloqueo}&h1=${newH1}&h2=${newH2}&observaciones=${observaciones}&usrRegisro=${idUsuario}
      `
    )
    .then(() => {
      Swal.fire({
        icon: "success",
        text: "Bloqueo editado con éxito",
        confirmButtonColor: "#3085d6",
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

export const deleteBloqueoColab = async (id: number, estilista: string, fecha: string) => {
  Swal.fire({
    title: "ADVERTENCIA",
    text: `¿Está seguro que desea eliminar el registro: ${estilista} de la fecha: ${fecha}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      jezaApi.delete(`/sp_detalle_bloqueosColaboradoresDel?id=${id}`).then(() => {
        Swal.fire({
          icon: "success",
          text: "Registro eliminado con éxito",
          confirmButtonColor: "#3085d6",
        });
      });
    }
  });
};
