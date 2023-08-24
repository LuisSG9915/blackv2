import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Container,
  Button,
  Input,
  Table,
  Card,
  CardHeader,
  CardBody,
  InputGroup,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { jezaApi } from "../../api/jezaApi";
import { Trabajador } from "../../models/Trabajador";
import { Horario } from "../../models/Horario";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MdEmojiPeople, MdPendingActions } from "react-icons/md";
import "./horarios.css";
function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [trabajador, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(""); // Estado para almacenar el ID seleccionado
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedName, setSelectedName] = useState(""); // Estado para almacenar el nombre seleccionado
  const [showButton, setShowButton] = useState(false);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const handleEditInputChange = (field, value) => {
    // Desmarcar el checkbox si h1 a h4 tienen un valor distinto de "00:00"
    if (field === "h1" || field === "h2" || field === "h3" || field === "h4") {
      const allTimesEmpty = ![selectedHorario.h1, selectedHorario.h2, selectedHorario.h3, selectedHorario.h4].some(
        (time) => time !== "00:00"
      );

      setSelectedHorario((prevHorario) => ({
        ...prevHorario,
        [field]: value,
        descanso: allTimesEmpty ? false : prevHorario.descanso, // Desmarcar si todos los campos son distintos de "00:00"
      }));
    } else {
      // Mantener los valores actuales de otros campos
      setSelectedHorario((prevHorario) => ({
        ...prevHorario,
        [field]: value,
      }));
    }
  };

  const handleEditCheckboxChange = (field, checked) => {
    if (checked) {
      // Si el checkbox está marcado, establecer h1 a h4 en "00:00"
      setSelectedHorario((prevHorario) => ({
        ...prevHorario,
        [field]: checked,
        h1: "00:00",
        h2: "00:00",
        h3: "00:00",
        h4: "00:00",
      }));
    } else {
      // Si el checkbox está desmarcado, mantener los valores actuales de h1 a h4
      setSelectedHorario((prevHorario) => ({
        ...prevHorario,
        [field]: checked,
      }));
    }
  };

  const handleEditSubmit = () => {
    if (selectedHorario) {
      // Realiza la solicitud PUT con los datos actualizados del horario
      const { id, id_empleado, fecha, h1, h2, h3, h4, descanso } = selectedHorario;

      jezaApi
        .put(
          `/Horario?id=${id}&id_empleado=${id_empleado}&fecha=${fecha}&h1=${h1}&h2=${h2}&h3=${h3}&h4=${h4}&descanso=${descanso}`
        )
        .then((response) => {
          console.log("Horario actualizado:", response.data);

          // Cierra el modal de edición después de guardar
          setEditModalOpen(false);
          consulta();
          // Puedes realizar una nueva consulta o actualizar la vista según tus necesidades
        })
        .catch((error) => {
          console.error("Error al actualizar el horario:", error);
        });
    }
  };

  const openEditModal = (horario) => {
    setSelectedHorario(horario);
    setEditModalOpen(true);
  };

  const handleCheckboxChange = (e, dayIndex) => {
    const { checked } = e.target;
    const updatedFormData = [...formData];

    // Si el checkbox se selecciona, establece h1, h2, h3 y h4 en "00:00", de lo contrario, deja los valores actuales
    if (checked) {
      updatedFormData[dayIndex]["h1"] = "00:00";
      updatedFormData[dayIndex]["h2"] = "00:00";
      updatedFormData[dayIndex]["h3"] = "00:00";
      updatedFormData[dayIndex]["h4"] = "00:00";
    } else {
      // Aquí puedes manejar el caso en que el checkbox se deselecciona, si es necesario
    }

    updatedFormData[dayIndex]["descanso"] = checked; // Actualiza el campo "descanso"
    setFormData(updatedFormData);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    // Calcular las fechas correspondientes para cada día de la semana
    const selectedDateObj = new Date(newDate);

    // Obtener el día de la semana actual (0 para Domingo, 1 para Lunes, etc.)
    const currentDay = selectedDateObj.getDay();

    // Calcular la diferencia en días para ajustar la fecha al día de la semana correcto
    const daysUntilMonday = 1 - currentDay; // Lunes
    selectedDateObj.setDate(selectedDateObj.getDate() + daysUntilMonday);

    // Actualizar las fechas en el formulario
    const updatedFormData = daysOfWeek.map((day, dayIndex) => {
      const date = new Date(selectedDateObj); // Clonar la fecha seleccionada
      date.setDate(date.getDate() + dayIndex); // Añadir días según el día de la semana
      return {
        id_empleado: "", // Puedes establecer un valor predeterminado aquí
        fecha: formatDate(date), // Utiliza la función auxiliar para formatear la fecha
        h1: "", // Puedes establecer otros campos del formulario aquí
        h2: "",
        h3: "",
        h4: "",
        descanso: false, // Puedes establecer valores predeterminados para otros campos
      };
    });

    setFormData(updatedFormData);
  };

  // Función auxiliar para formatear la fecha como "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e, dayIndex) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[dayIndex][name] = value;
    setFormData(updatedFormData);
  };

  const toggleModalCrear = () => {
    setModalCrearOpen(!modalCrearOpen);
  };

  const handleModalSelect = (id: React.SetStateAction<string>, name: React.SetStateAction<string>) => {
    setSelectedId(id); // Actualiza el estado con el ID seleccionado
    setSelectedName(name); // Actualiza el estado con el nombre seleccionado
    setModalOpen(false); // Cierra el modal
  };

  useEffect(() => {
    // Dentro de useEffect, realizamos la solicitud a la API
    jezaApi
      .get("/Trabajador?id=0")
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
    // Verifica si se ha seleccionado un trabajador y se ha ingresado una fecha
    if (selectedId && selectedDate) {
      // Realiza la solicitud a la API con los parámetros
      jezaApi
        .get(`/Horario?idTrabajador=${selectedId}&fecha=${selectedDate}`)
        .then((response) => {
          setHorarios(response.data);
          // Verifica si el resultado de la consulta es cero
          if (response.data.length === 0) {
            setShowButton(true); // Habilita el botón
          } else {
            setShowButton(false); // Deshabilita el botón
          }
        })
        .catch((e) => console.log(e));
    } else {
      // Muestra un mensaje de error o realiza alguna acción apropiada
      console.log("Por favor, selecciona un trabajador y una fecha válida.");
    }
  };
  const columnsTrabajador = useMemo<MRT_ColumnDef<Trabajador>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 100,
      },
      {
        header: "Acciones",
        Cell: ({ row }) => (
          <Button size="sm" onClick={() => handleModalSelect(row.original.id, row.original.nombre)}>
            seleccionar
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
        header: "Hora de entrada",
        size: 100,
      },
      {
        accessorKey: "h2",
        header: "Hora de salida",
        size: 100,
      },
      {
        accessorKey: "h3",
        header: "Hora de entrada 2",
        size: 100,
      },
      {
        accessorKey: "h4",
        header: "Hora de salida 2",
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
        Cell: ({ row }) => (
          <Button size="sm" color="secondary" onClick={() => openEditModal(row.original)}>
            Editar
          </Button>
        ),
      },
    ],
    []
  );

  const handleSubmit = () => {
    // Realiza la solicitud POST con los datos del formulario
    for (let i = 0; i < formData.length; i++) {
      const dayData = formData[i];
      // console.log(
      //   `/Horarios?id_empleado=${selectedId}&fecha=${dayData.fecha}&h1=${dayData.h1}&h2=${dayData.h2}&h3=${dayData.h3}&h4=${dayData.h4}&descanso=${dayData.descanso}`
      // );

      jezaApi
        .post(
          `/Horarios?id_empleado=${selectedId}&fecha=${dayData.fecha}&h1=${dayData.h1}&h2=${dayData.h2}&h3=${dayData.h3}&h4=${dayData.h4}&descanso=${dayData.descanso}`
        )
        .then((response) => {
          // Realiza alguna acción después de que la solicitud sea exitosa
          console.log(`Solicitud POST exitosa para ${daysOfWeek[i]}:`, response.data);
          // Puedes realizar una nueva consulta o actualizar la vista según tus necesidades
        })
        .catch((error) => {
          // Manejo de errores
          console.error(`Error en la solicitud POST para ${daysOfWeek[i]}:`, error);
        });
    }
  };

  const formatFecha = (fecha) => {
    const dateObj = new Date(fecha);
    const dia = dateObj.getDate();
    const mes = dateObj.getMonth() + 1;
    const año = dateObj.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  return (
    <>
      <div>
        <SidebarHorizontal></SidebarHorizontal>
        {/* <p>horarios 2.0 en construccion...</p> */}
        <Container>
          <h1>Horarios</h1>
          <Card>
            <CardBody>
              <div className="form">
                <InputGroup>
                  <Input type="text" value={selectedName} />
                  <Button color="secondary" onClick={() => setModalOpen(true)}>
                    Elegir
                  </Button>
                </InputGroup>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

                <Button color="primary" onClick={consulta}>
                  Consultar
                </Button>
              </div>
            </CardBody>
          </Card>
          <br />
          <h3>Horario de: {selectedName}</h3>
          <br />
          {showButton && (
            <Button
              color="primary"
              onClick={() => {
                if (showButton) {
                  toggleModalCrear(); // Abre el modal de creación
                } else {
                  // Realiza alguna acción o muestra un mensaje si no se cumple la condición
                  console.log("No se puede crear un horario ya existente");
                }
              }}
            >
              Crear
            </Button>
          )}
          <MaterialReactTable columns={columns} data={horarios} />;
        </Container>
      </div>
      );
      {/* modal trabajador */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}></ModalHeader>
        <ModalBody>
          <MaterialReactTable
            columns={columnsTrabajador}
            data={trabajador}
            onSelect={(id, name) => handleModalSelect(id, name)} // Pasa la función de selección
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setModalOpen(!modalOpen)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
      {/* modal crear */}
      <Modal isOpen={modalCrearOpen} toggle={toggleModalCrear} size="lg">
        <ModalHeader toggle={toggleModalCrear}>Crear Horarios</ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>Día de la Semana</th>
                {/* <th>ID Empleado</th> */}
                <th>Fecha</th>
                <th>H1</th>
                <th>H2</th>
                <th>H3</th>
                <th>H4</th>
                <th>Descanso</th>
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day, dayIndex) => (
                <tr key={dayIndex}>
                  <td>{day}</td>
                  {/* <td>
                    <Input
                      type="text"
                      name="id_empleado"
                      value={formData[dayIndex]?.id_empleado || ""}
                      onChange={(e) => handleInputChange(e, dayIndex)}
                    />
                  </td> */}
                  <td>
                    <Input
                      type="date"
                      name="fecha"
                      value={formData[dayIndex]?.fecha || ""}
                      onChange={(e) => handleDateChange(e, dayIndex)}
                    />
                  </td>
                  <td>
                    <Input
                      type="time"
                      name="h1"
                      value={formData[dayIndex]?.h1 || ""}
                      onChange={(e) => handleInputChange(e, dayIndex)}
                    />
                  </td>
                  <td>
                    <Input
                      type="time"
                      name="h2"
                      value={formData[dayIndex]?.h2 || ""}
                      onChange={(e) => handleInputChange(e, dayIndex)}
                    />
                  </td>
                  <td>
                    <Input
                      type="time"
                      name="h3"
                      value={formData[dayIndex]?.h3 || ""}
                      onChange={(e) => handleInputChange(e, dayIndex)}
                    />
                  </td>
                  <td>
                    <Input
                      type="time"
                      name="h4"
                      value={formData[dayIndex]?.h4 || ""}
                      onChange={(e) => handleInputChange(e, dayIndex)}
                    />
                  </td>
                  <td align="center">
                    <Input
                      type="checkbox"
                      name="descanso"
                      checked={formData[dayIndex]?.descanso || false}
                      onChange={(e) => handleCheckboxChange(e, dayIndex)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Guardar
          </Button>{" "}
          <Button color="secondary" onClick={toggleModalCrear}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      {/* modal editar */}
      <Modal isOpen={editModalOpen} toggle={() => setEditModalOpen(!editModalOpen)}>
        <ModalHeader toggle={() => setEditModalOpen(!editModalOpen)}>
          {/* Editar Horario: {formatFecha(selectedHorario.fecha)} */}
        </ModalHeader>
        <ModalBody>
          {selectedHorario && (
            <Table>
              <thead>
                <tr>
                  <th> </th>
                  <th>Hora de entrada</th>
                  <th>Hora de salida</th>
                  <th>Hora de entrada 2</th>
                  <th>Hora de salida 2</th>
                  <th>Descanso</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    <input
                      type="time"
                      value={selectedHorario.h1}
                      onChange={(e) => handleEditInputChange("h1", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={selectedHorario.h2}
                      onChange={(e) => handleEditInputChange("h2", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={selectedHorario.h3}
                      onChange={(e) => handleEditInputChange("h3", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={selectedHorario.h4}
                      onChange={(e) => handleEditInputChange("h4", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHorario.descanso}
                      onChange={(e) => handleEditCheckboxChange("descanso", e.target.checked)}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditSubmit}>
            Guardar
          </Button>{" "}
          <Button color="secondary" onClick={() => setEditModalOpen(!editModalOpen)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Horarios;
