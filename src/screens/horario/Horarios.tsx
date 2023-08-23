import React, { useEffect, useMemo, useState } from "react";
import { Row, Container, Button, Input, Table, Card, CardHeader, CardBody } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { jezaApi } from "../../api/jezaApi";
import { Trabajador } from "../../models/Trabajador";
import { Horario } from "../../models/Horario";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";

function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realizar la solicitud fetch a la API
    fetch("http://cbinfo.no-ip.info:9089/Horario?idTrabajador=2132&fecha=2023-08-07")
      .then((response) => response.json())
      .then((data) => {
        setHorarios(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      });
  }, []);

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "diaSemana",
        header: "Día",
        size: 150,
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
        size: 150,
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
        size: 200,
      },
      {
        accessorKey: "h2",
        header: "Hora de Salida",
        size: 150,
      },
      {
        accessorKey: "h3",
        header: "Hora de Entrada 2",
        size: 200,
      },
      {
        accessorKey: "h4",
        header: "Hora de Salida 2",
        size: 150,
      },
      {
        accessorKey: "descanso",
        header: "Descanso",
        size: 150,
        Cell: ({ cell }) => (cell.value ? "Sí" : "No"),
      },
      {
        accessorKey: "editar",
        header: "EDITAR",
        size: 150,
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
          <MaterialReactTable columns={columns} data={horarios} />;
        </Container>
      </div>
      );
    </>
  );
}

export default Horarios;
