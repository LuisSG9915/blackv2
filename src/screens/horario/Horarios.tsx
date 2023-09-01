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
  Label,
} from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { jezaApi } from "../../api/jezaApi";
import { Trabajador } from "../../models/Trabajador";
import { Horario } from "../../models/Horario";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MdEmojiPeople, MdPendingActions } from "react-icons/md";
import "./horarios.css";
import Swal from "sweetalert2";
import { MdEditCalendar, MdHistoryToggleOff, MdSchedule } from "react-icons/md";

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
  const fechaActual = new Date(); // Esto te dará la fecha y hora actual

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
  useEffect(() => {
    consulta();
  }, [formData]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    // consulta();
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

    // Copia el estado actual del formulario
    const updatedFormData = [...formData];

    // Actualiza el valor del campo cambiado
    updatedFormData[dayIndex][name] = value;

    // Verifica si algún campo h1 a h4 es diferente de "00:00"
    const anyFieldIsNonZero = ["h1", "h2", "h3", "h4"].some((field) => updatedFormData[dayIndex][field] !== "00:00");

    // Si algún campo es diferente de "00:00", desmarca el checkbox
    updatedFormData[dayIndex].descanso = !anyFieldIsNonZero;

    // Actualiza el estado del formulario con los cambios
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
        accessorKey: "editar",
        header: "Acción",
        size: 100,
        Cell: ({ row }) => {
          const fechaHorario = new Date(row.original.fecha); // Convierte la fecha del horario a un objeto Date
          const esFechaAnterior = fechaHorario < fechaActual; // Comprueba si la fecha es anterior a la fecha actual

          return (
            <Button size="sm" color="secondary" disabled={esFechaAnterior} onClick={() => openEditModal(row.original)}>
              <MdEditCalendar size={30} />
            </Button>
          );
        },
      },
      {
        accessorKey: "diaSemana",
        header: "Día",
        size: 100,
        Cell: ({ row }) => {
          const dayNumber = row.original.diaSemana;
          let dayName = "";

          if (dayNumber === 1) {
            dayName = "Domingo";
          } else if (dayNumber === 2) {
            dayName = "Lunes";
          } else if (dayNumber === 3) {
            dayName = "Martes";
          } else if (dayNumber === 4) {
            dayName = "Miercoles";
          } else if (dayNumber === 5) {
            dayName = "Jueves";
          } else if (dayNumber === 6) {
            dayName = "Viernes";
          } else if (dayNumber === 7) {
            dayName = "Sabado";
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
        header: "Hora de comida",
        size: 100,
      },
      {
        accessorKey: "h3",
        header: "Hora de regreso",
        size: 100,
      },
      {
        accessorKey: "h4",
        header: "Hora de salida",
        size: 100,
      },
      {
        accessorKey: "descanso",
        header: "Descanso",
        size: 100,
        Cell: ({ row }) => (
          <div className={row.original.descanso ? "si" : "no"}>{row.original.descanso ? "Sí" : "No"}</div>
        ),
      },
    ],
    []
  );

  //  console.log(
  //    `/Horarios?id_empleado=${selectedId}&fecha=${dayData.fecha}&h1=${dayData.h1}&h2=${dayData.h2}&h3=${dayData.h3}&h4=${dayData.h4}&descanso=${dayData.descanso}`
  //  );

  // const handleSubmit = () => {
  //   // Realiza la validación de que todos los campos h1 a h4 estén llenos
  //   const isFormValid = formData.every((dayData) => {
  //     // Verifica si los campos h1 a h4 están llenos
  //     return dayData.h1 && dayData.h2 && dayData.h3 && dayData.h4;
  //   });
  //   if (isFormValid) {

  //     // Realiza la solicitud POST con los datos del formulario
  //     for (let i = 0; i < formData.length; i++) {
  //       const dayData = formData[i];

  //       jezaApi
  //         .post(
  //           `/Horarios?id_empleado=${selectedId}&fecha=${dayData.fecha}&h1=${dayData.h1}&h2=${dayData.h2}&h3=${dayData.h3}&h4=${dayData.h4}&descanso=${dayData.descanso}`
  //         )
  //         .then((response) => {
  //           // Realiza alguna acción después de que la solicitud sea exitosa
  //           console.log(`Solicitud POST exitosa para ${daysOfWeek[i]}:`, response.data);
  //           // Puedes realizar una nueva consulta o actualizar la vista según tus necesidades
  //         })
  //         .catch((error) => {
  //           // Manejo de errores
  //           console.error(`Error en la solicitud POST para ${daysOfWeek[i]}:`, error);
  //         });
  //     }
  //   } else {
  //     // Mostrar un mensaje de error o realizar alguna acción apropiada

  //     Swal.fire({
  //       icon: "info",
  //       title: "",
  //       text: "Por favor, completa todos los campos antes de guardar",
  //     });
  //   }
  // };

  const handleSubmit = () => {
    // Realiza la validación de que todos los campos h1 a h4 estén llenos
    const isFormValid = formData.every((dayData) => {
      // Verifica si los campos h1 a h4 están llenos
      return dayData.h1 && dayData.h2 && dayData.h3 && dayData.h4;
    });

    if (isFormValid) {
      // Inicializa un contador para llevar un registro de las solicitudes exitosas
      let successfulRequests = 0;

      // Realiza la solicitud POST con los datos del formulario
      for (let i = 0; i < formData.length; i++) {
        const dayData = formData[i];
        jezaApi
          .post(
            `/Horarios?id_empleado=${selectedId}&fecha=${dayData.fecha}&h1=${dayData.h1}&h2=${dayData.h2}&h3=${dayData.h3}&h4=${dayData.h4}&descanso=${dayData.descanso}`
          )
          .then((response) => {
            // Incrementa el contador en cada solicitud exitosa
            successfulRequests++;

            // Verifica si todas las solicitudes han terminado
            if (successfulRequests === formData.length) {
              // Muestra una alerta de SweetAlert cuando todas las solicitudes hayan terminado
              Swal.fire({
                icon: "success",
                title: "Creación de horararios exitosa",
                text: "Todos los horarios de ha actualizado.",
              });
              consulta();
              toggleModalCrear();

              // Puedes realizar una nueva consulta o actualizar la vista según tus necesidades
            }
          })
          .catch((error) => {
            // Manejo de errores
            console.error(`Error en la solicitud POST para ${daysOfWeek[i]}:`, error);
          });
      }
    } else {
      // Mostrar un mensaje de error o realizar alguna acción apropiada
      Swal.fire({
        icon: "info",
        title: "",
        text: "Por favor, completa todos los campos antes de guardar",
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
          <h1>
            Horarios <MdHistoryToggleOff size={35} />
          </h1>
          <Card>
            <CardBody>
              <Row>
                <Col sm="12">
                  <h3>Horario de: {selectedName}</h3>
                  <br />
                </Col>
                <Col sm="6">
                  <Label> Seleccione un trabajador: </Label>
                  <InputGroup>
                    <Input type="text" value={selectedName} />
                    <Button color="secondary" onClick={() => setModalOpen(true)}>
                      Elegir
                    </Button>
                  </InputGroup>
                  <br />
                </Col>
                {/* <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /> */}

                <Col sm="6">
                  <Label> Seleccione una fecha: </Label>
                  <Input type="date" value={selectedDate} onChange={handleDateChange} />
                  <br />
                </Col>
                <Col sm="6">
                  <Button color="primary" onClick={consulta}>
                    Consultar
                  </Button>
                  {showButton && (
                    <Button
                      color="primary"
                      onClick={() => {
                        const fechaSeleccionada = new Date(selectedDate); // Convierte la fecha seleccionada a un objeto Date
                        const esFechaAnterior = fechaSeleccionada < fechaActual; // Comprueba si la fecha seleccionada es anterior a la fecha actual

                        if (esFechaAnterior) {
                          // Si la fecha es anterior, muestra una alerta de SweetAlert
                          Swal.fire({
                            icon: "info",
                            title: "",
                            text: "No se puede crear un horario para una fecha anterior",
                          });
                        } else {
                          // Si la fecha es posterior o igual, abre el modal de creación
                          toggleModalCrear();
                        }
                      }}
                    >
                      Crear horario
                    </Button>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
          {/* 
          {showButton && (
            <Button
              color="primary"
              onClick={() => {
                const fechaSeleccionada = new Date(selectedDate); // Convierte la fecha seleccionada a un objeto Date
                const esFechaAnterior = fechaSeleccionada < fechaActual; // Comprueba si la fecha seleccionada es anterior a la fecha actual

                if (esFechaAnterior) {
                  // Si la fecha es anterior, muestra una alerta de SweetAlert
                  Swal.fire({
                    icon: "info",
                    title: "",
                    text: "No se puede crear un horario para una fecha anterior",
                  }); 
                } else {
                  // Si la fecha es posterior o igual, abre el modal de creación
                  toggleModalCrear();
                }
              }}
            >
              Crear
            </Button>
          )} */}
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
      <Modal size="lg" isOpen={modalCrearOpen} toggle={toggleModalCrear}>
        <ModalHeader toggle={toggleModalCrear}>
          <h3>Crear horarios</h3>
        </ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>Día de la Semana</th>
                {/* <th>ID Empleado</th> */}
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Comida</th>
                <th>Regreso</th>
                <th>Salida</th>
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
                      disabled="disabled"
                      type="date"
                      name="fecha"
                      value={formData[dayIndex]?.fecha || ""}
                      // onChange={(e) => handleDateChange(e, dayIndex)}
                      onChange={(e) => handleDateChange(e)} // Utiliza la misma función para actualizar la fecha
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
            Actualizar horario
          </Button>{" "}
          <Button color="danger" onClick={toggleModalCrear}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      {/* modal editar */}
      <Modal isOpen={editModalOpen} size="lg" toggle={() => setEditModalOpen(!editModalOpen)}>
        <ModalHeader toggle={() => setEditModalOpen(!editModalOpen)}>
          {/* Editar Horario: {formatFecha(selectedHorario.fecha)} */}
          <h3>Editar horario</h3>
        </ModalHeader>
        <ModalBody>
          {selectedHorario && (
            <Table>
              <thead>
                <tr>
                  <th> </th>
                  <th>Hora de entrada</th>
                  <th>Hora de comida</th>
                  <th>Hora de regreso</th>
                  <th>Hora de salida</th>
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
            Actualizar horario
          </Button>{" "}
          <Button color="danger" onClick={() => setEditModalOpen(!editModalOpen)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Horarios;
