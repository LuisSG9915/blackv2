import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, FormGroup } from "reactstrap";
import { useNavigate } from "react-router-dom";
import SidebarHorizontal from "./components/SidebarHorizontal";
import { Usuario } from "./models/Usuario";
import { useReactToPrint } from "react-to-print";
import { AnyAction } from "@reduxjs/toolkit";
import { Br, Cut, Line, Printer, render, Row, Text } from "react-thermal-printer";
import { connect } from "node:net";
import { useMutation } from "@tanstack/react-query";

const App = () => {
  const navigate = useNavigate();
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
      {/* {form[0]?.sucursal}
      {form[0]?.d_sucursal}
      {form[0]?.idCia} */}
    </>
  );
};

export default App;
