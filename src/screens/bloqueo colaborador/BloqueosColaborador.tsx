import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AiFillDelete, AiFillEdit, AiFillMinusSquare } from "react-icons/ai";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import { useBloqueosColaboradores } from "../../hooks/getsHooks/useBloqueosColaboradores";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";
import { deleteBloqueoColab, postBloqueoColaborador, putBloqueoColaborador } from "./functions/BloqueosColabApiRest";
import { UserResponse } from "../../models/Home";

import { format } from "date-fns";
import { useTipoBloqueoColaborador } from "../../hooks/getsHooks/useTipoBloqueoColaborador";

function BloqueosColaborador() {
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ parsedItem });
    }
  }, []);

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
    f2: "20251010",
    idBloqueo: 0,
    usrRegistro: dataUsuarios2[0]?.sucursal,
    idColaborador: 0,
    idTipoBloqueo: 0,
  });
  const [modalActualizar, setmodalActualizar] = useState(false);
  const [modalInsertar, setmodalInsertar] = useState(false);

  const { dataBloqueos, fetchBloqueos } = useBloqueosColaboradores({ estilista: "%", f1: form.f1, f2: form.f2, tipoBloqueo: "%" });

  const { dataTipoBloqueoColaborador } = useTipoBloqueoColaborador();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const mostrarModalActualizar = (param) => {
    setmodalActualizar(!modalActualizar);
    setForm({
      ...form,
      descripcionBloqueo: param.descripcionBloqueo,
      estilista: param.estilista,
      fecha: param.fecha,
      h1: param.h1,
      h2: param.h2,
      id: param.id,
      observaciones: param.observaciones,
      usuarioRegistro: param.usuarioRegistro,
    });
  };
  const limpiarDatos = () => {
    setForm({
      ...form,
      descripcionBloqueo: "",
      estilista: "",
      fecha: "",
      h1: "",
      h2: "",
      id: 0,
      idBloqueo: 0,
      idColaborador: 0,
      idTipoBloqueo: 0,
      observaciones: "",
      usrRegistro: 0,
      usuarioRegistro: "",
    });
  };

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params) => (
        <>
          <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={23}></AiFillEdit>
          <AiFillDelete
            color="lightred"
            onClick={() =>
              deleteBloqueoColab(Number(params.row.id), params.row.estilista, params.row.fecha.split("T")[0]).then(() => {
                setTimeout(() => {
                  fetchBloqueos();
                }, 1111);
              })
            }
            size={23}
          ></AiFillDelete>
        </>
      ),
    },
    { field: "descripcionBloqueo", headerName: "Descripción", flex: 1 },
    { field: "estilista", headerName: "Colaborador", flex: 1 },

    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      renderCell(params) {
        return params.row.fecha ? format(new Date(params.row.fecha), "P") : "";
      },
    },
    {
      field: "h1",
      headerName: "Hora 1",
      flex: 1,
      renderCell(params) {
        return params.row.h1 ? format(new Date(params.row.h1), "p") : "";
      },
    },
    {
      field: "h2",
      headerName: "Hora 2",
      flex: 1,
      renderCell(params) {
        return params.row.h2 ? format(new Date(params.row.h2), "p") : "";
      },
    },
    { field: "usuarioRegistro", headerName: "Usuario de registro", flex: 1 },
  ];
  const { dataTrabajadores } = useNominaTrabajadores();
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
        {/* <Row>
          <Col md={2}>
            <Label>Fecha 1</Label>
            <Input type="date"> </Input>
          </Col>
          <Col md={2}>
            <Label>Fecha 2</Label>
            <Input type="date"> </Input>
          </Col>
          <Col md={2}>
            <br /> <Button onClick={fetchBloqueos}> Buscar </Button>
          </Col>
        </Row> */}
        <br />
        <br />

        <div style={{ height: "40%", width: "100%", tableLayout: "fixed" }}>
          <DataGrid rows={dataBloqueos} columns={columns} />
        </div>
      </Container>
      {/* ********************************************************************************************** */}
      <Modal isOpen={modalInsertar} about="">
        <ModalHeader>
          <div>
            <h3>Registro</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Container>
            <CFormGroupInput handleChange={handleChange} inputName="fecha" labelName=" Fecha:" type="date" />
            <FormGroup>
              <Label>Colaborador</Label>
              <Input type="select" value={form.idColaborador} name={"idColaborador"} onChange={handleChange}>
                {dataTrabajadores.map((trabajador) => (
                  <option value={trabajador.id}>{trabajador.nombre}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Tipo de bloqueo</Label>
              <Input type="select" value={form.idTipoBloqueo} name={"idTipoBloqueo"} onChange={handleChange}>
                <option value={0}> Escoja el bloqueo </option>
                {dataTipoBloqueoColaborador.map((bloqueo) => {
                  return <option value={bloqueo.id}> {bloqueo.descripcion} </option>;
                })}
              </Input>
            </FormGroup>
            <Label>Hora 1: </Label>
            <FormGroup>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  value={form}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                  onChange={(newValue) => {
                    setForm({ ...form, h1: newValue });
                    console.log(newValue);
                  }}
                />
              </LocalizationProvider>
            </FormGroup>
            <Label>Hora 2: </Label>
            <FormGroup>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  value={form}
                  onChange={(newValue) => setForm({ ...form, h2: newValue })}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
            </FormGroup>
            <CFormGroupInput handleChange={handleChange} inputName="observaciones" labelName=" Observaciones:" type="text" />
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="success"
            onClick={() =>
              postBloqueoColaborador(form, dataUsuarios2[0].id).then((response) => {
                if (Number(response.data.codigo) == 1) {
                  fetchBloqueos();
                  setmodalInsertar(false);
                  limpiarDatos();
                }
              })
            }
            text="Guardar"
          ></CButton>
          {/* <CButton color="success" onClick={() => console.log(dataUsuarios2[0]?.sucursal)} text="Guardar"></CButton> */}
          <CButton
            color="danger"
            onClick={() => {
              setmodalInsertar(false);
              limpiarDatos();
            }}
            text="Cancelar"
          />
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
            <CFormGroupInput handleChange={handleChange} inputName="fecha" labelName=" Fecha:" type="date" value={form.fecha.split("T")[0]} />
            <FormGroup>
              <Label>Colaborador</Label>
              <Input type="select" value={form.idColaborador} name={"idColaborador"} onChange={handleChange}>
                {dataTrabajadores.map((trabajador) => (
                  <option value={trabajador.id}>{trabajador.nombre}</option>
                ))}
              </Input>
            </FormGroup>{" "}
            <FormGroup>
              <Label>Tipo de bloqueo</Label>
              <Input type="select" value={form.idTipoBloqueo} name={"idTipoBloqueo"} onChange={handleChange}>
                <option value={0}> Escoja el bloqueo </option>
                {dataTipoBloqueoColaborador.map((bloqueo) => {
                  return <option value={bloqueo.id}> {bloqueo.descripcion} </option>;
                })}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Hora 1: </Label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  value={new Date(form.h1)}
                  onChange={(newValue) => {
                    setForm({ ...form, h1: newValue });
                  }}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
            </FormGroup>
            <Label>Hora 2: </Label>
            <FormGroup>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  value={new Date(form.h2)}
                  onChange={(newValue) => setForm({ ...form, h2: newValue })}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
            </FormGroup>
            <CFormGroupInput handleChange={handleChange} inputName="observaciones" labelName=" Observaciones:" value={form.observaciones} />
          </Container>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="success"
            onClick={() => {
              putBloqueoColaborador(form, dataUsuarios2[0]?.id).then(() => fetchBloqueos());
            }}
            text="Editar"
          />
          <CButton color="danger" onClick={() => setmodalActualizar(false)} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default BloqueosColaborador;
