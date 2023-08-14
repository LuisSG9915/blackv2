import React, { useEffect, useState } from "react";
import { Row, Container, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Table, Alert } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { AiFillDelete, AiFillEdit, AiOutlineBgColors } from "react-icons/ai";
import { jezaApi } from "../../api/jezaApi";
import { Paquete_conversion } from "../../models/Paquete_conversion";
import { useProductos } from "../../hooks/getsHooks/useProductos";
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import CButton from "../../components/CButton";
import { useNavigate } from "react-router-dom";

function PaqueteConversiones() {
  const [form, setForm] = useState<Paquete_conversion>({
    id: 0,
    idPaquete: 0,
    idPieza: 0,
    Cantidad: 0.0, // Número decimal
    d_paquete: "",
    d_pieza: "",
  });

  const [data, setData] = useState<Paquete_conversion[]>([]);
  const insertPaqueteConversion = () => {
    /* CREATE */
    console.log(form);
    // Validar que idPaquete y idPieza no sean iguales
    if (form.id === form.idPieza) {
      console.log("Error: idPaquete e idPieza no pueden ser iguales");
      toggleCreateModal(); // Cerrar modal después de guardar
      setVisible4(true);
      setTimeout(() => {
        setVisible4(false);
      }, 3000);

      return;
    }

    jezaApi
      .post(`/PaquetePieza?idPaquete=${form.idPaquete}&idPieza=${form.idPieza}&cantidad=${form.Cantidad}`)
      .then(() => {
        setVisible1(true);
        getPaqueteConversion();
        toggleCreateModal(); // Cerrar modal después de guardar
        setTimeout(() => {
          setVisible1(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* get */
  const getPaqueteConversion = () => {
    jezaApi.get("/PaquetePieza?id=0").then((response) => {
      setData(response.data);
    });
  };
  const { dataProductos } = useProductos();

  /* update */
  const updatePaqueteConversion = (dato: Paquete_conversion) => {
    console.log(dato);
    if (dato.idPaquete === dato.idPieza) {
      console.log("Error: idPaquete e idPieza no pueden ser iguales");
      setModalUpdate(!modalUpdate);
      setVisible4(true);
      setTimeout(() => {
        setVisible4(false);
      }, 3000);

      return;
    }
    jezaApi
      .put(`/PaquetePieza?id=${dato.id}&idPaquete=${dato.idPaquete}&idPieza=${dato.idPieza}&cantidad=${dato.Cantidad}`)
      .then((response) => {
        setVisible2(true);
        getPaqueteConversion();
        setModalUpdate(!modalUpdate);
        setTimeout(() => {
          setVisible2(false);
        }, 3000);
        // Cerrar modal después de guardar
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePaquetesConversion = (dato: Paquete_conversion) => {
    /* DELETE */
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento`);
    if (opcion) {
      jezaApi.delete(`/PaquetePieza?id=${dato.id}`).then(() => {
        setVisible3(true);
        getPaqueteConversion();
        setTimeout(() => {
          setVisible3(false);
        }, 3000);
      });
    }
  };

  useEffect(() => {
    getPaqueteConversion();
  }, []);

  /* modals */
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);

  const toggleCreateModal = () => {
    setForm({
      // Restablecer el estado del formulario
      id: 0,
      idPaquete: 0,
      idPieza: 0,
      Cantidad: 0,

      d_paquete: "",
      d_pieza: "",
    });
    setModalCreate(!modalCreate);
  };

  const toggleUpdateModal = (dato: any) => {
    setModalUpdate(!modalUpdate);
    setForm(dato);
  };

  /* alertas */
  const [creado, setVisible1] = useState(false);
  const [actualizado, setVisible2] = useState(false);
  const [eliminado, setVisible3] = useState(false);
  const [error, setVisible4] = useState(false);

  // Redirige a la ruta "/app"
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    { field: "d_paquete", headerName: "Paquete", flex: 1, headerClassName: "custom-header" },
    { field: "d_pieza", headerName: "Pieza", flex: 1, headerClassName: "custom-header" },
    { field: "Cantidad", headerName: "Cantidad", flex: 1, headerClassName: "custom-header" },
  ];

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => toggleUpdateModal(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => deletePaquetesConversion(params.row)} size={23}></AiFillDelete>
        {/* <AiFillDelete color="lightred" onClick={() => console.log(params.row.id)} size={23}></AiFillDelete> */}
      </>
    );
  };

  function DataTable() {
    return (
      <div style={{ height: 300, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.idPaquete}
            hideFooter={false}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 15 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        
        <Alert color="success" isOpen={creado} toggle={() => setVisible1(false)}>
          Registro guardado con exito
        </Alert>
        <Alert color="info" isOpen={actualizado} toggle={() => setVisible2(false)}>
          Registro modificado con exito
        </Alert>
        <Alert color="info" isOpen={eliminado} toggle={() => setVisible3(false)}>
          Registro Eliminado con exito
        </Alert>
        <Alert color="danger" isOpen={error} toggle={() => setVisible4(false)}>
          Error: idPaquete e idPieza no pueden ser iguales
        </Alert>
        <h1>Paquetes y Conversiones</h1>
        <br />
        <Button color="success" onClick={toggleCreateModal}>
          Agregar
        </Button>

        <Table>
          <thead>
            <tr>
              <th>Paquete</th>
              <th>Pieza</th>
              <th>Cantidad por Unidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dato: Paquete_conversion) => (
              <tr key={dato.id}>
                <td>{dato.d_paquete}</td>
                <td>{dato.d_pieza}</td>
                <td>{dato.Cantidad}</td>
                <td>
                  <Button onClick={() => toggleUpdateModal(dato)}>
                    <AiFillEdit />
                  </Button>
                  <Button onClick={() => {
                    deletePaquetesConversion(dato);
                  }}
                  >
                    <AiFillDelete />
                  </Button>

                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container> */}

      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1>Paquetes y conversiones</h1>
          <AiOutlineBgColors size={30} />
        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
        <br />
        <br />
        <br />
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button
            style={{ marginLeft: "auto" }}
            color="success"
            onClick={() => {
              setModalCreate(true);
              // setEstado("insert");
              // LimpiezaForm();
            }}
          >
            Crear conversión
          </Button>

          <Button color="primary" onClick={handleRedirect}>
            <IoIosHome size={20}></IoIosHome>
          </Button>
          <Button onClick={handleReload}>
            <IoIosRefresh size={20}></IoIosRefresh>
          </Button>
        </ButtonGroup>

        <br />
        <br />
        <DataTable></DataTable>
      </Container>

      {/* Modals */}
      {/* create */}
      <Modal isOpen={modalCreate} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}>Crear paquete conversión</ModalHeader>

        <ModalBody>
          <Label>Paquete: </Label>
          <Input
            type="select"
            name="idPaquete"
            onChange={(e) => setForm({ ...form, idPaquete: parseInt(e.target.value) })}
            defaultValue={form.idPaquete}
          >
            {dataProductos.map((producto) => (
              <option value={producto.id}>{producto.descripcion}</option>
            ))}
          </Input>
          <br />
          <Label> Pieza: </Label>
          <Input type="select" name="idPieza" onChange={(e) => setForm({ ...form, idPieza: parseInt(e.target.value) })} defaultValue={form.idPieza}>
            {dataProductos.map((producto) => (
              <option value={producto.id}>{producto.descripcion}</option>
            ))}
          </Input>
          <br />
          {/* <Input type="number" name="idPaquete" value={form.idPaquete} onChange={(e) => setForm({ ...form, idPaquete: parseInt(e.target.value) })} placeholder="Ingrese el nombre del producto" /> */}
          <Label>Cantidad por unidad:</Label>
          <Input
            type="number"
            name="cantidad"
            value={form.Cantidad}
            onChange={(e) => {
              const value = parseFloat(e.target.value); // Convertir a número decimal
              setForm({ ...form, Cantidad: value });
            }}
            min="0.01" // Valor mínimo permitido
            step="0.01" // Precisión decimal
            placeholder="Ingrese la cantidad de producto por unidad"
          />
        </ModalBody>

        <ModalFooter>
          <CButton color="success" onClick={insertPaqueteConversion} text="Guardar paquete conversión" />
          <CButton color="danger" onClick={toggleCreateModal} text="Cancelar" />
        </ModalFooter>
      </Modal>
      {/* modal para update */}
      <Modal isOpen={modalUpdate} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>Editar paquete conversión</ModalHeader>
        <ModalBody>
          <Label>Paquete:</Label>
          <Input
            type="select"
            name="idPaquete"
            onChange={(e) => setForm({ ...form, idPaquete: parseInt(e.target.value) })}
            defaultValue={form.idPaquete}
          >
            {dataProductos.map((producto) => (
              <option value={producto.id}>{producto.descripcion}</option>
            ))}
          </Input>
          <br />
          <Label>Pieza:</Label>
          <Input type="select" name="idPieza" onChange={(e) => setForm({ ...form, idPieza: parseInt(e.target.value) })} defaultValue={form.idPieza}>
            {dataProductos.map((producto) => (
              <option value={producto.id}>{producto.descripcion}</option>
            ))}
          </Input>
          <br />
          {/* <Input type="number" name="idPaquete" value={form.idPaquete} onChange={(e) => setForm({ ...form, idPaquete: parseInt(e.target.value) })} placeholder="Ingrese el nombre del producto" /> */}
          <Label>Cantidad por unidad:</Label>
          <Input
            type="number"
            name="cantidad"
            value={form.Cantidad}
            onChange={(e) => {
              const value = parseFloat(e.target.value); // Convertir a número decimal
              setForm({ ...form, Cantidad: value });
            }}
            min="0.01" // Valor mínimo permitido
            step="0.01" // Precisión decimal
            placeholder="Ingrese la cantidad de producto por unidad"
          />
        </ModalBody>

        <ModalFooter>
          <CButton color="primary" text="Actualizar" onClick={() => updatePaqueteConversion(form)} />
          <CButton color="danger" text="Cancelar" onClick={toggleUpdateModal} />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default PaqueteConversiones;
