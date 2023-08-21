import React, { ReactElement, useEffect, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarHorizontal from "./components/SidebarHorizontal";
import { Usuario } from "./models/Usuario";
import { Button } from "reactstrap";
// import nodemailer from "nodemailer";

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

  const sendMail = async () => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      port: 587,
      auth: {
        user: "soporte@cbinformatica.net",
        pass: "xlcrvcqovbsywcze",
      },
    });
    const mailOptions = {
      from: "soporte@cbinformatica.net",
      to: "luis.sg9915@gmail.com",
      subject: "Prueba de correo desde React.js",
      text: "Este es un correo de prueba enviado desde React.js y Nodemailer.",
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Correo enviado:", info.response);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  };
  return (
    <>
      <SidebarHorizontal />
      {/* {form[0]?.sucursal}
      {form[0]?.d_sucursal}
      {form[0]?.idCia} */}
      {/* <Button onClick={() => null}>Envío</Button> */}
    </>
  );
};

export default App;
