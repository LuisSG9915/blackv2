import React, { useEffect, useMemo, useState } from "react";
import { Row, Container, Button, Input, Table, Card, CardHeader, CardBody, InputGroup, Col, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { jezaApi } from "../../api/jezaApi";
import { Trabajador } from "../../models/Trabajador";
import { Horario } from "../../models/Horario";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MdEmojiPeople, MdPendingActions } from "react-icons/md";

function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [trabajador, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Dentro de useEffect, realizamos la solicitud a la API
    jezaApi.get("/Trabajador?id=0")
      .then((response) => {
        // Cuando la solicitud sea exitosa, actualizamos el estado
        setTrabajadores(response.data);
      })
      .catch((error) => {
        // Manejo de errores
        console.error("Error al cargar los trabajadores:", error);
      });
  }, []); // El segundo argumento [] indica que este efecto se ejecuta solo una vez al montar el componente



  const consulta = () => {
    jezaApi.get("/Horario?idTrabajador=2132&fecha=2023-08-07")
      .then((response) => setHorarios(response.data))
      .catch((e) => console.log(e));
  };

  const columnsTrabajador = useMemo<MRT_ColumnDef<Trabajador>[]>(
    () => [


      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 100,
      },
      {
        header: "Acciones",
        Cell: ({ row }) => (
          <Button
            size="sm"
           
          >
            Detalle
          </Button>
        ),
        
      },

    ],
    []
  );
  


  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "diaSemana",
        header: "Día",
        size: 100,
        Cell: ({ row }) => {
          const dayNumber = row.original.diaSemana;
          let dayName = "";

          if (dayNumber === 1) {
            dayName = "Lunes";
          } else if (dayNumber === 2) {
            dayName = "Martes";
          } else if (dayNumber === 3) {
            dayName = "Miércoles";
          } else if (dayNumber === 4) {
            dayName = "Jueves";
          } else if (dayNumber === 5) {
            dayName = "Viernes";
          } else if (dayNumber === 6) {
            dayName = "Sábado";
          } else if (dayNumber === 7) {
            dayName = "Domingo";
          }

          return dayName;
        },
      },
      {
        accessorKey: "fecha",
        header: "Fecha",
        size: 100,
        Cell: ({ row }) => {
          // Obtiene la cadena de fecha desde row.original.fecha
          const dateStr = row.original.fecha;

          // Crea un objeto de fecha a partir de la cadena de fecha
          const date = new Date(dateStr);

          // Verifica si la fecha es válida antes de formatearla
          if (isNaN(date.getTime())) {
            return "Fecha inválida";
          }

          // Formatea la fecha como día/mes/año
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

          return formattedDate;
        },
      },
      {
        accessorKey: "h1",
        header: "Hora de Entrada",
        size: 100,
      },
      {
        accessorKey: "h2",
        header: "Hora de Salida",
        size: 100,
      },
      {
        accessorKey: "h3",
        header: "Hora de Entrada 2",
        size: 100,
      },
      {
        accessorKey: "h4",
        header: "Hora de Salida 2",
        size: 100,
      },
      {
        accessorKey: "descanso",
        header: "Descanso",
        size: 100,
        Cell: ({ cell }) => (cell.value ? "Sí" : "No"),
      },
      {
        accessorKey: "editar",
        header: "EDITAR",
        size: 100,
        Cell: ({ cell }) => (
          <Button size="sm" color="secondary">
            Editar
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div>
        <SidebarHorizontal></SidebarHorizontal>
        {/* <p>horarios 2.0 en construccion...</p> */}
        <Container>
          <InputGroup>
          <Input type="text"></Input>
          <Button color="secondary" onClick={() => setModalOpen(true)}>Elegir</Button>
 
          <Button color="primary" onClick={consulta}>Consultar</Button>
          </InputGroup>
          <MaterialReactTable columns={columns} data={horarios} />;
        </Container>
      </div>
      );

      {/* modal trabajador */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
  <ModalHeader toggle={() => setModalOpen(!modalOpen)}></ModalHeader>
  <ModalBody>
  <MaterialReactTable columns={columnsTrabajador} data={trabajador} />;
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onClick={() => setModalOpen(!modalOpen)}>Cerrar</Button>
  </ModalFooter>
</Modal>
    </>
  );
}

export default Horarios;
