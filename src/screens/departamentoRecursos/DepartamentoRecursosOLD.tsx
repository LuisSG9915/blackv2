import React, { useEffect, useState } from "react";
import {
  Row,
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Table,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { jezaApi } from "../../api/jezaApi";
import { RecursosDepartamento } from "../../models/RecursosDepartamento";

function DepartamentoRecursos() {
  const [data, setData] = useState<RecursosDepartamento[]>([]); /* setear valores  */
  const [form, setForm] = useState<RecursosDepartamento>({
    id: 1,
    descripcion_departamento: "",
  });

  /* CRUD */

  // Create ----> POST
  const create = () => {
    if (form.descripcion_departamento === "") {
      return;
    }
    jezaApi.post(`/NominaDepartamentos?descripcion=${form.descripcion_departamento}`).then(() => {
      alert("registro cargado"); //manda alerta
      getinfo(); // refresca tabla
    });
  };

  // Update ---> PUT
  const update = () => {
    jezaApi.put(`/NominaDepartamentos?id=${form.id}&descripcion=${form.descripcion_departamento}`).then(() => {
      alert("Registro Actualizado"); //manda alerta
      setModalUpdate(!modalUpdate); //cierra modal
      getinfo(); // refresca tabla
    });
  };

  // Read --->  GET
  const getinfo = () => {
    jezaApi.get("/NominaDepartamentos?id=0").then((response) => {
      setData(response.data);
    });
  };

  // Delete ----> DELETE
  const eliminar = (dato: RecursosDepartamento) => {
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento`);
    if (opcion) {
      jezaApi.delete(`/NominaDepartamentos?id=${dato.id}`).then(() => {
        alert("Registro Eliminado");
        getinfo(); //refresca tabla
      });
    }
  };

  useEffect(() => {
    getinfo();
  }, []);

  /* Modal */
  const [modalUpdate, setModalUpdate] = useState(false); /* definimos el usestate del modal */

  /* NO SE PARA QUE SIRVE PERO SE USA PARA EL MODAL */
  const toggleUpdateModal = (dato: RecursosDepartamento) => {
    setModalUpdate(!modalUpdate);
    setForm(dato);
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <h1 align="center">Tipos de Departamentos</h1>
      <br />
      <Container>
        <div>
          <Card>
            <CardHeader>Agregue el departamento: </CardHeader>
            <CardBody>
              <Input
                type="text"
                name={"descripcion_baja"}
                onChange={(e) => setForm({ ...form, descripcion_departamento: e.target.value })}
                value={form.descripcion_departamento}
                placeholder="Ingrese descripcion"
              ></Input>
              <br />
              <Button color="success" onClick={create}>
                Agregar
              </Button>
            </CardBody>
          </Card>

          <br />
          <br />
          <Container>
            <Table>
              <thead>
                <tr align="center">
                  <th>Departamentos Registradas</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {/* a partir de aqui se van a mostrar los registros de la base */}
                {data.map((dato: RecursosDepartamento) => (
                  <tr key={dato.id}>
                    {/* identificador del */}
                    <td align="center">{dato.descripcion_departamento}</td>

                    <td align="center">
                      <Button color="info" onClick={() => toggleUpdateModal(dato)}>
                        <AiFillEdit />
                      </Button>
                      <Button color="danger" onClick={() => eliminar(dato)}>
                        <AiFillDelete />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </div>
      </Container>

      {/* SANTOS ME DIJO QUE LOS MODALS LOS PUSIERA ABAJO */}
      <Modal isOpen={modalUpdate} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>Editar Tipo Departamento</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            name={"descripcion"}
            onChange={(e) => setForm({ ...form, descripcion_departamento: e.target.value })}
            value={form.descripcion_departamento}
            placeholder="Ingrese descripcion"
          ></Input>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => update()}>
            Guardar
          </Button>{" "}
          <Button color="secondary" onClick={toggleUpdateModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DepartamentoRecursos;
