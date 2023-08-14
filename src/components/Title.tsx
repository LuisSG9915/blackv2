import React from "react";
import { Container } from "reactstrap";
import CButton from "./CButton";
interface props {
  handleNav: () => void;
  titulo: string;
}
function Title({ handleNav, titulo }: props) {
  return (
    <>
      <br />
      <h1> {titulo} </h1>
      <Container className="d-flex justify-content-end ">
        <CButton color="success" onClick={handleNav} text="Crear médico" />
      </Container>
      <br />
    </>
  );
}

export default Title;
