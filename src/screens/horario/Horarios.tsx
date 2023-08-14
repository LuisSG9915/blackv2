import React, { useEffect, useState } from "react";
import { Row, Container, Button, Input, Table, Card, CardHeader, CardBody } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { jezaApi } from "../../api/jezaApi";
import { Trabajador } from "../../models/Trabajador";
import { Horario } from "../../models/Horario";

function Horarios() {
  const [data, setData] = useState<Trabajador[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [form, setForm] = useState<Horario>({
    id: 1,
    id_empleado: "",
    nombre: "",
    fecha: new Date(),
    diaSemana: 1,
    h1: "",
    h2: "",
    h3: "",
    h4: "",
    descanso: false,
  });

  const handleItemChange = (e) => {
    const id_empleado = e.target.value;
    const selectedEmpleado = data.find((item) => item.id === id_empleado);
    setForm((prevForm) => ({
      ...prevForm,
      id_empleado,
      nombre: selectedEmpleado ? selectedEmpleado.nombre : "",
    }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getDayOfWeek = (date: Date): string => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[date.getDay()];
  };

  const getCurrentWeekDates = (selectedDate: string): Date[] => {
    const startDate = new Date(selectedDate);
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      weekDates.push(date);
    }

    return weekDates;
  };

  const getEmpleado = () => {
    jezaApi.get(`/Trabajador?id=0`).then((response) => {
      setData(response.data);
    });
  };

  useEffect(() => {
    getEmpleado();
  }, []);

  const handleSearch = () => {
    if (selectedDate) {
      const dates = getCurrentWeekDates(selectedDate);
      setWeekDates(dates);
    }
  };

  const create = () => {
    const item = data.find((item) => item.id === form.id_empleado); // Obtiene el objeto item seleccionado
    if (item) {
      jezaApi
        .post(
          `/Horarios?id_empleado=${item.id}&fecha=${selectedDate}&h1=${form.h1}&h2=${form.h2}&h3=${form.h3}&h4=${form.h4}&descanso=${form.descanso}`
        )
        .then(() => {
          alert("registro cargado");
          getEmpleado(); // Actualiza los datos de los empleados
        });
    }
  };

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <h1 align="center">Horarios</h1>

      <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
        <Card>
          <CardHeader style={{ textAlign: "center" }}>
            <h5>Seleccione Personal</h5>
          </CardHeader>
          <CardBody style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <Input type="select" onChange={handleItemChange}>
              {data.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </Input>
            <Input type="date" value={selectedDate} onChange={handleDateChange} />
            <Button color="primary" onClick={handleSearch}>
              Buscar
            </Button>
          </CardBody>
        </Card>
      </Container>
      <br />
      <Container>
        <br />
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button color="info">Guardar configuración semana</Button>
          <Button color="success" onClick={create}>
            Sincronizar
          </Button>
        </div>

        <Table className="table-borderless">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Día</th>
              <th>Hora Entrada</th>
              <th>Hora Salida Comida</th>
              <th>Hora Entrada Comida</th>
              <th>Hora Salida</th>
              <th>Descanso</th>
            </tr>
          </thead>
          <tbody>
            {weekDates.map((date, index) => (
              <tr key={index}>
                <td>{date.toLocaleDateString()}</td>
                <td>{getDayOfWeek(date)}</td>
                <td>
                  <Input
                    type="time"
                    name={`h1-${index}`}
                    id={`h1-${index}`}
                    onChange={(e) => {
                      const { value } = e.target;
                      setForm((prevForm) => ({
                        ...prevForm,
                        [`h1-${index}`]: value,
                      }));
                    }}
                    value={form[`h1-${index}`] || ""}
                    disabled={date < new Date()}
                  />
                </td>
                <td>
                  <Input
                    type="time"
                    name={`h2-${index}`}
                    id={`h2-${index}`}
                    onChange={(e) => {
                      const { value } = e.target;
                      setForm((prevForm) => ({
                        ...prevForm,
                        [`h2-${index}`]: value,
                      }));
                    }}
                    value={form[`h2-${index}`] || ""}
                    disabled={date < new Date()}
                  />
                </td>
                <td>
                  <Input
                    type="time"
                    name={`h3-${index}`}
                    id={`h3-${index}`}
                    onChange={(e) => {
                      const { value } = e.target;
                      setForm((prevForm) => ({
                        ...prevForm,
                        [`h3-${index}`]: value,
                      }));
                    }}
                    value={form[`h3-${index}`] || ""}
                    disabled={date < new Date()}
                  />
                </td>
                <td>
                  <Input
                    type="time"
                    name={`h4-${index}`}
                    id={`h4-${index}`}
                    onChange={(e) => {
                      const { value } = e.target;
                      setForm((prevForm) => ({
                        ...prevForm,
                        [`h4-${index}`]: value,
                      }));
                    }}
                    value={form[`h4-${index}`] || ""}
                    disabled={date < new Date()}
                  />
                </td>
                <td className="text-center">
                  <Input
                    type="checkbox"
                    name={`descanso-${index}`}
                    id={`descanso-${index}`}
                    checked={form[`descanso-${index}`] || false}
                    onChange={(e) => {
                      const { checked } = e.target;
                      setForm((prevForm) => ({
                        ...prevForm,
                        [`descanso-${index}`]: checked,
                      }));
                    }}
                    disabled={date < new Date()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Horarios;
