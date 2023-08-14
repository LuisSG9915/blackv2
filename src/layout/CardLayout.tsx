import React from "react";
import { Container, Card, CardHeader, CardBody, Row } from "reactstrap";
import CardButton from "../components/CardButton";
import CardInput from "../components/CardInput";
import Title from "../components/Title";
import CButton from "../components/CButton";
interface Props {
  handleNav: () => void;
  tituloPrincipal: string;
  children: JSX.Element | JSX.Element[];
}
function CardLayout({ handleNav, tituloPrincipal, children }: Props) {
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

export default CardLayout;
