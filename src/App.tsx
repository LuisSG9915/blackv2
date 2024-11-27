import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarHorizontal from "./components/SidebarHorizontal";
import { Usuario } from "./models/Usuario";
import { subscribeUserToPush } from "./../pushNotifications";
import { UserResponse } from "./models/Home";

const App = () => {
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
    }
  }, []);

  useEffect(() => {
    validaSuscripcion();
  }, [dataUsuarios2[0]?.id]);

  const validaSuscripcion = () => {
    // Validar la suscripción con el backend
    if (!dataUsuarios2[0]?.clave_perfil || !dataUsuarios2[0]?.id || !dataUsuarios2[0]?.idPuesto || !dataUsuarios2[0]?.idDepartamento) {
      console.log(dataUsuarios2[0]?.clave_perfil, dataUsuarios2[0]?.id, dataUsuarios2[0]?.idPuesto, dataUsuarios2[0]?.idDepartamento);
      return;
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          return registration.pushManager.getSubscription();
        })
        .then((subscription) => {
          if (subscription) {
            // Validar suscripción con el backend
            return fetch("https://cbinfo.no-ip.info:9111/api/notificaciones/validar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ endpoint: subscription.endpoint }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Error en la validación de suscripción: ${response.statusText}`);
                }
                return response.json();
              })
              .then((data) => {
                if (!data.isValid) {
                  console.log("La suscripción no es válida. Creando una nueva...");
                  subscribeUserToPush(
                    dataUsuarios2[0]?.clave_perfil,
                    dataUsuarios2[0]?.id,
                    dataUsuarios2[0]?.idPuesto,
                    dataUsuarios2[0]?.idDepartamento
                  );
                } else {
                  console.log("Suscripción válida:", subscription);
                }
              });
          } else {
            // No hay suscripción, solicitar permiso
            return Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                console.log("Permiso concedido. Suscribiendo al usuario...");
                subscribeUserToPush(
                  dataUsuarios2[0]?.clave_perfil,
                  dataUsuarios2[0]?.id,
                  dataUsuarios2[0]?.idPuesto,
                  dataUsuarios2[0]?.idDepartamento
                );
              } else {
                console.warn("El usuario no otorgó permiso para las notificaciones.");
              }
            });
          }
        })
        .catch((error) => {
          console.error("Error en el flujo de validación de suscripción:", error);
        });
    } else {
      console.warn("El navegador no soporta Service Workers.");
    }
  };

  // useEffect(() => {
  //   if (!dataUsuarios2[0]?.id) return;

  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/service-worker.js")
  //       .then((registration) => {
  //         console.log("Service Worker registrado con éxito:", registration);

  //         // Verificar si ya existe una suscripción activa
  //         return registration.pushManager.getSubscription();
  //       })
  //       .then((subscription) => {
  //         if (subscription) {
  //           // Validar la suscripción con el backend
  //           fetch("https://cbinfo.no-ip.info:9111/api/notificaciones/validar", {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({ endpoint: subscription.endpoint }),
  //           })
  //             .then((response) => response.json())
  //             .then((data) => {
  //               if (!data.isValid) {
  //                 console.log("La suscripción no es válida. Creando una nueva...");
  //                 subscribeUserToPush(
  //                   dataUsuarios2[0]?.clave_perfil,
  //                   dataUsuarios2[0]?.id,
  //                   dataUsuarios2[0]?.idPuesto,
  //                   dataUsuarios2[0]?.idDepartamento
  //                 );
  //               } else {
  //                 console.log("Suscripción válida:", subscription);
  //               }
  //             })
  //             .catch((error) => {
  //               console.error("Error al validar la suscripción:", error);
  //             });
  //         } else {
  //           console.log("No hay suscripción activa. Intentando suscribir al usuario...");
  //           subscribeUserToPush(dataUsuarios2[0]?.clave_perfil, dataUsuarios2[0]?.id, dataUsuarios2[0]?.idPuesto, dataUsuarios2[0]?.idDepartamento);
  //         }
  //         if (!subscription) {
  //           console.log("No hay suscripción activa. Intentando suscribir al usuario...");

  //           // Solicitar permiso y suscribir al usuario
  //           Notification.requestPermission().then((permission) => {
  //             if (permission === "granted") {
  //               console.log("Permiso concedido. Suscribiendo al usuario...");

  //               subscribeUserToPush(
  //                 dataUsuarios2[0]?.clave_perfil,
  //                 dataUsuarios2[0]?.id,
  //                 dataUsuarios2[0]?.idPuesto,
  //                 dataUsuarios2[0]?.idDepartamento
  //               );
  //             } else {
  //               console.warn("El usuario no otorgó permiso para las notificaciones.");
  //             }
  //           });
  //         } else {
  //           console.log("Ya existe una suscripción activa:", subscription);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error al manejar la suscripción:", error);
  //       });
  //   }
  // }, [dataUsuarios2[0]]);

  const [form, setForm] = useState<Usuario[]>([]);
  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      try {
        const parsedItem = JSON.parse(item);
        setForm(parsedItem);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Error al cargar los datos de sesión. Por favor, vuelve a iniciar sesión.");
      }
    } else {
      console.log("userLoggedv2 not found in localStorage");
    }
  }, []);

  return (
    <>
      <SidebarHorizontal />
    </>
  );
};

export default App;
