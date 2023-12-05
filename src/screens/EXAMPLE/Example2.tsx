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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPruebaApi((prevState: any) => ({ ...prevState, [name]: value }));
  };
  const apiExample = () => {
    axios.post("http://127.0.0.1:3003/login/prueba", pruebaApi);
  };

  return (
    <div>
      <Button onClick={() => apiExample()}>Boton prueba</Button>
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
