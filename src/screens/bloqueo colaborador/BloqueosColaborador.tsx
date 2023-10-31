import React, { useState } from "react";
import { Button, ButtonGroup, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AiFillDelete, AiFillEdit, AiFillMinusSquare } from "react-icons/ai";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import { useBloqueosColaboradores } from "../../hooks/getsHooks/useBloqueosColaboradores";
import { Descuento } from "../../models/Descuento";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function BloqueosColaborador() {
  const [form, setForm] = useState({
    id: 0,
    fecha: "",
    estilista: "",
    descripcionBloqueo: "",
    h1: "",
    h2: "",
    observaciones: "",
    usuarioRegistro: "",
    f1: "20231010",
    f2: "20231025",
  });
  const [modalActualizar, setmodalActualizar] = useState(false);
  const [modalInsertar, setmodalInsertar] = useState(false);

  const { dataBloqueos } = useBloqueosColaboradores({ estilista: "%", f1: form.f1, f2: form.f2, tipoBloqueo: "%" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };
  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params) => (
        <>
          {/* <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row as Descuento)} size={23}></AiFillEdit> */}
          {/* <AiFillDelete color="lightred" onClick={() => eliminar(params.row as Descuento)} size={23}></AiFillDelete> */}
        </>
      ),
    },
    { field: "descripcionBloqueo", headerName: "Descripción", flex: 1 },
    { field: "estilista", headerName: "Minimo descuento", flex: 1 },
    { field: "h1", headerName: "Máximo descuento", flex: 1 },
    { field: "h2", headerName: "Máximo descuento", flex: 1 },
    { field: "usuarioRegistro", headerName: "Máximo descuento", flex: 1 },
  ];
  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <div style={{ display: "flex", alignItems: "", gap: 10 }}>
          <h1> Bloqueos de colaborador </h1>
          <AiFillMinusSquare size={30} />
        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
        <br />
        <Container className="d-flex  ">
          <Row>
            <div>
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button
                  style={{ marginLeft: "auto" }}
                  color="success"
                  onClick={() => {
                    setmodalInsertar(true);
                  }}
                >
                  Crear bloqueo
                </Button>
                <Button color="primary" onClick={() => null}>
                  <IoIosHome size={20}></IoIosHome>
                </Button>
                <Button onClick={() => null}>
                  <IoIosRefresh size={20}></IoIosRefresh>
                </Button>
              </ButtonGroup>
            </div>
          </Row>
        </Container>
        <br />
        <Row>
          <Col md={2}>
            <Label>Fecha 1</Label>
            <Input type="date"> </Input>
          </Col>
          <Col md={2}>
            <Label>Fecha 2</Label>
            <Input type="date"> </Input>
          </Col>
          <Col md={2}>
            <br /> <Button onClick={() => null}> Seleccionar </Button>
          </Col>
        </Row>
        <br />
        <br />

        <div style={{ height: 400, width: "100%", tableLayout: "fixed" }}>
          <DataGrid rows={dataBloqueos} columns={columns} />
        </div>
      </Container>

      <Modal isOpen={modalInsertar} about="">
        <ModalHeader>
          <div>
            <h3>Registro</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <CFormGroupInput handleChange={handleChange} inputName="fecha" labelName=" Fecha:" type="date" />
            <CFormGroupInput handleChange={handleChange} inputName="idColaborador" labelName=" Colaborador:" type="select" />
            <CFormGroupInput handleChange={handleChange} inputName="idTipoBloqueo" labelName=" Tipo de bloqueo:" type="select" />
            <Label>Hora 1</Label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker label="Controlled picker" value={form} onChange={(newValue) => setForm(newValue)} />
            </LocalizationProvider>
            <Label>Hora 1</Label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker label="Controlled picker" value={form} onChange={(newValue) => setForm(newValue)} />
            </LocalizationProvider>
            <CFormGroupInput handleChange={handleChange} inputName="observaciones" labelName=" Observaciones:" type="text" />
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={() => null} text="Guardar"></CButton>
          <CButton color="danger" onClick={() => setmodalInsertar(false)} text="Cancelar" />
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div>
            <h3>Editar Registro</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <CFormGroupInput handleChange={handleChange} inputName="fecha" labelName=" Fecha:" type="date" />
            <CFormGroupInput handleChange={handleChange} inputName="idColaborador" labelName=" Colaborador:" />
            <CFormGroupInput handleChange={handleChange} inputName="idTipoBloqueo" labelName=" Tipo de bloqueo:" />
            <CFormGroupInput handleChange={handleChange} inputName="h1" labelName=" Hora inicio:" />
            <CFormGroupInput handleChange={handleChange} inputName="h2" labelName=" Hora final:" />
            <CFormGroupInput handleChange={handleChange} inputName="observaciones" labelName=" Observaciones:" />
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="success"
            onClick={() => {
              // editar(form);
              // getDescuento();
            }}
            text="Editar"
          />
          <CButton color="danger" onClick={() => setmodalInsertar(false)} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default BloqueosColaborador;
