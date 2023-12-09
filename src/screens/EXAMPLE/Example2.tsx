import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row } from "reactstrap";
import { jezaApi } from "../../api/jezaApi";
import axios from "axios";
import { useQuery } from "react-query";

function Example2() {
  const [pruebaApi, setPruebaApi] = useState({
    username: "",
    password: "",
  });

  // axios.interceptors.request.use(
  //   (config) => {
  //     // Obtiene el token almacenado (asegúrate de haberlo almacenado previamente)
  //     const token = testToken; // Implementa tu lógica para obtener el token

  //     // Agrega el encabezado de autorización si hay un token
  //     if (token) {
  //       config.headers.Authorization = `${token}`;
  //       alert("a");
  //     }

  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  const [testToken, setTestToken] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPruebaApi((prevState: any) => ({ ...prevState, [name]: value }));
  };
  const apiExample = () => {
    axios.post("http://127.0.0.1:3003/login/prueba", pruebaApi).then((response) => {
      setTestToken(response.data.token);
    });
  };
  const apiPruebas = () => {
    axios
      .get("http://127.0.0.1:3003/testToken", {
        headers: {
          Authorization: testToken,
        },
      })
      .then((response) => {
        console.log(response.data.msg);
      });
  };

  return (
    <div>
      <Button onClick={() => apiExample()}>Boton prueba</Button>
      <Button onClick={() => apiPruebas()}>Botón verificación</Button>
      <Col>
        <Row>
          <Input name="username" onChange={handleChange}></Input>
          <Input name="password" onChange={handleChange}></Input>
        </Row>
      </Col>
    </div>
  );
}
export default Example2;
