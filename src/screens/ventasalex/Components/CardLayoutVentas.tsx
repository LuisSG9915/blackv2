import React from "react";
import { Container, Card, CardHeader, CardBody, Row } from "reactstrap";
import CButton from "../../../components/CButton";

interface Props {
  handleNav: () => void;
  tituloPrincipal: string;
  children: JSX.Element | JSX.Element[];
}
function CardLayoutVentas({ handleNav, tituloPrincipal, children }: Props) {
  return (
    <Container fluid>
      <br />
      <h1> {tituloPrincipal} </h1>
      <Container className="d-flex justify-content-end ">
        <CButton color="success" onClick={handleNav} text="Crear médico" />
      </Container>
      <br />
      <div className="col align-self-start d-flex justify-content-center ">
        <Card className="my-2 w-100" color="white">
          <CardHeader>Filtro</CardHeader>
          <CardBody>{children}</CardBody>
        </Card>
      </div>
    </Container>
  );
}

export default CardLayoutVentas;
