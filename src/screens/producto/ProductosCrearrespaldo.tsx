import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import CButton from "../../components/CButton";
import useReadHook, { Forma } from "../../hooks/useReadHook";
import { jezaApi } from "../../api/jezaApi";
import { useNavigate } from "react-router-dom";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
import TabPrueba from "../TabPrueba";
import TabPruebaProductos from "../TabPruebaProductos";
import { Producto } from "../../models/Producto";
import { useMarcas } from "../../hooks/getsHooks/useMarcas";

function ProductosCrear() {
  const navigate = useNavigate();

  const handleNav = () => {
    navigate("/UsuariosCrear");
  };
  const [filtroValorMedico, setFiltroValorMedico] = useState("");

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <div className="container px-2 ">
        <h1> Crear Productos </h1>
        <br />
        <Card body>
          <TabPruebaProductos></TabPruebaProductos>
        </Card>
      </div>
    </>
  );
}

export default ProductosCrear;
