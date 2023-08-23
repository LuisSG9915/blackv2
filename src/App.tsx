import React, { ReactElement, useEffect, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarHorizontal from "./components/SidebarHorizontal";
import { Usuario } from "./models/Usuario";
import { Button } from "reactstrap";
import ReactDOMServer from "react-dom/server";
import { useSucursales } from "./hooks/getsHooks/useSucursales";
import { Sucursal } from "./models/Sucursal";
import { DataGrid } from "@mui/x-data-grid";
import { jezaApi } from "./api/jezaApi";
import axios from "axios";
// import nodemailer from "nodemailer";

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey("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");

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

  const envioCorreo = () => {
    axios.post("http://localhost:5000/send-email", {
      to: "luis.sg9915@gmail.com",
      subject: "Hello",
      text: "Hello world?",
      html: "<a>a</a>",
    });
  };

  return (
    <>
      <SidebarHorizontal />
      {/* {form[0]?.sucursal}
      {form[0]?.d_sucursal}
      {form[0]?.idCia} */}
      {/* <Button onClick={() => envioCorreo()}>Enviar</Button> */}
    </>
  );
};

export default App;
