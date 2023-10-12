import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarHorizontal from "./components/SidebarHorizontal";
import { Usuario } from "./models/Usuario";

const App = () => {
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
