import React from "react";
import { Container, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";

function InvCompras() {
  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <Container>
        <h2>Compras</h2>
      </Container>
    </>
  );
}

export default InvCompras;
