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
import { HorarioSucursal } from "../../models/HorarioSucursal";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MdEmojiPeople, MdPendingActions } from "react-icons/md";
import "./horariosSuc.css";
import Swal from "sweetalert2";
import { MdEditCalendar, MdHistoryToggleOff, MdSchedule } from "react-icons/md";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { UserResponse } from "../../models/Home";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Sucursal } from "../../models/Sucursal";

function HorariosSuc() {
  const { filtroSeguridad, session } = useSeguridad();
  const [showView, setShowView] = useState(true);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  const [dataSucursal, setDataSucursal] = useState<Sucursal[]>([]);
  const { dataSucursales } = useSucursales();

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ parsedItem });

      // Llamar a getPermisoPantalla después de que los datos se hayan establecido
      getPermisoPantalla(parsedItem);
    }
  }, []);

  const getPermisoPantalla = async (userData) => {
    try {
      const response = await jezaApi.get(`/Permiso?usuario=${userData[0]?.id}&modulo=sb_horarios_view`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].permiso === false) {
          Swal.fire("Error!", "No tiene los permisos para ver esta pantalla", "error");
          setShowView(false);
          handleRedirect();
        } else {
          setShowView(true);
        }
      } else {
        // No se encontraron datos válidos en la respuesta.
        setShowView(false);
      }
    } catch (error) {
      console.error("Error al obtener el permiso:", error);
    }
  };

  const [horarios, setHorarios] = useState([]);
  const [trabajador, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(""); // Estado para almacenar el ID seleccionado
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedSuc, setSelectedSuc] = useState(""); // Estado para almacenar el nombre seleccionado
  const [showButton, setShowButton] = useState(false);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const fechaActual = new Date(); // Esto te dará la fecha y hora actual
  // const [cantHorarios, setcantHorarios] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
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

  const diasConRegistros = new Set(
    horarios.map((horario) => {
      const fechaHorario = new Date(horario.fecha);
      return fechaHorario.getDay(); // Devuelve el número del día de la semana (0 para Domingo, 1 para Lunes, etc.)
    })
  );

  const handleSucursalChange = (e) => {
    const { value } = e.target;
    setSelectedSuc(value);
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
      const { id, id_empleado, fecha, h1, h2, h3, h4, sucursal
      } = selectedHorario;

      /*      console.log(
        ` /HorarioApoyo?id=${id}&sucursal=${selectedSuc}&id_empleado=${id_empleado}&fecha=${fecha}&h1=${h1}&h2=${h2}&h3=${h3}&h4=${h4}&descanso=false`
      );
 */
      jezaApi
        .put(
          `/HorarioApoyo?id=${id}&sucursal=${selectedSuc}&id_empleado=${id_empleado}&fecha=${fecha}&h1=${h1}&h2=${h2}&h3=${h3}&h4=${h4}`
        )

        .then((response) => {
          console.log("Horario actualizado:", response.data);
          Swal.fire({
            icon: "success",
            title: "Edición de horarios exitosa",
            text: "El horario se ha actualizado.",
          });

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
    setSelectedSuc(selectedSuc);
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
    if (formData.length > 0) consulta();
  }, [formData]);

  // const handleDateChange = (e) => {
  //   const newDate = e.target.value;
  //   setSelectedDate(newDate);
  //   // consulta();

  //   // const filteredHorarios = horarios.filter((horario) => {
  //   //   const horarioDate = new Date(horario.fecha);
  //   //   return (
  //   //     horarioDate.getFullYear() === selectedDateObj.getFullYear() &&
  //   //     horarioDate.getMonth() === selectedDateObj.getMonth() &&
  //   //     horarioDate.getDate() === selectedDateObj.getDate()
  //   //   );
  //   // });

  //   // Calcular las fechas correspondientes para cada día de la semana
  //   const selectedDateObj = new Date(newDate);

  //   // Obtener el día de la semana actual (0 para Domingo, 1 para Lunes, etc.)
  //   const currentDay = selectedDateObj.getDay();

  //   // Calcular la diferencia en días para ajustar la fecha al día de la semana correcto
  //   const daysUntilMonday = 0 - currentDay; // Lunes
  //   selectedDateObj.setDate(selectedDateObj.getDate() + daysUntilMonday);

  //   // Actualizar las fechas en el formulario
  //   const updatedFormData = daysOfWeek.map((day, dayIndex) => {
  //     const date = new Date(selectedDateObj); // Clonar la fecha seleccionada
  //     date.setDate(date.getDate() + dayIndex); // Añadir días según el día de la semana
  //     return {
  //       id_empleado: "", // Puedes establecer un valor predeterminado aquí
  //       fecha: formatDate(date), // Utiliza la función auxiliar para formatear la fecha
  //       h1: "", // Puedes establecer otros campos del formulario aquí
  //       h2: "",
  //       h3: "",
  //       h4: "",
  //       descanso: false, // Puedes establecer valores predeterminados para otros campos
  //     };
  //   });

  //   setFormData(updatedFormData);
  // };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    // consulta();
    // Calcular las fechas correspondientes para cada día de la semana
    const selectedDateObj = new Date(newDate);

    // Obtener el día de la semana actual (6 para Domingo, 1 para Lunes, etc.)
    const currentDay = selectedDateObj.getDay();

    // Calcular la diferencia en días para ajustar la fecha al día de la semana correcto
    const daysUntilMonday = 0 - currentDay; // Lunes
    if (daysUntilMonday == -6) {
      selectedDateObj.setDate(selectedDateObj.getDate() + 1);
    } else {
      selectedDateObj.setDate(selectedDateObj.getDate() + daysUntilMonday);
    }

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
        sucursal: 0,
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
    setHorarios([]);
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

  const getHorarios = () => {
    jezaApi
      .get(`/HorarioApoyo?idTrabajador=${selectedId}&fecha=${selectedDate}`)
      .then((response) => {
        setHorarios(response.data);

        // Verifica si el resultado de la consulta es cero
        if (diasConRegistros.size < 7) {
          setShowButton(true); // Habilita el botón si hay días sin registros
        } else {
          setShowButton(false); // Deshabilita el botón si todos los días tienen registros
        }
      })
      .catch((e) => console.log(e));
  };

  const consulta = () => {
    // Verifica si se ha seleccionado un trabajador y se ha ingresado una fecha
    if (selectedId && selectedDate) {
      // Realiza la solicitud a la API con los parámetros
      getHorarios();
    } else {
      // Muestra un mensaje de error o realiza alguna acción apropiada
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: `Favor de llenar todos los campos `,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
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
          fechaHorario.setDate(fechaHorario.getDate() + 1); // Resta un día a la fecha

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
        accessorKey: "nombreSucursal",
        header: "Surcursal",
        size: 100,
        // Cell: ({ row }) => <div className={row.original.descanso ? "si" : "no"}>{row.original.descanso ? "Sí" : "No"}</div>,
      },
    ],
    []
  );

  const handleSubmit = () => {
    // Verifica si todos los campos h1 a h4 están llenos en al menos un día
    const allFieldsFilled = formData.some((dayData) => {
      return dayData.h1 && dayData.h2 && dayData.h3 && dayData.h4;
    });

    // Si no se llenaron todos los campos h1 a h4, muestra una alerta y no realiza la solicitud POST
    if (!allFieldsFilled) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes completar todos los campos H1 a H4 en al menos un día.",
      });
      return;
    }

    let successfulRequests = 0;

    // Realiza la solicitud POST solo para los días sin registros
    for (let i = 0; i < formData.length; i++) {
      const dayData = formData[i];
      const dayIndex = i;

      // Verifica si ya hay registros para este día
      if (!diasConRegistros.has(dayIndex)) {
        // console.log(
        //   `/Horarios?id_empleado=${selectedId}&fecha=${dayData.fecha}&h1=${dayData.h1}&h2=${dayData.h2}&h3=${dayData.h3}&h4=${dayData.h4}&descanso=${dayData.descanso}`
        // );

        //   `/Horarios?id_empleado=${selectedId}&fecha=${dayData.fecha}&h1=${dayData.h1}&h2=${dayData.h2}&h3=${dayData.h3}&h4=${dayData.h4}&descanso=${dayData.descanso}`
        jezaApi
          .post(
            `/HorariosApoyo?id_empleado=${selectedId}&fecha=${dayData.fecha}&h1=${dayData.h1}&h2=${dayData.h2}&h3=${dayData.h3}&h4=${dayData.h4}&sucursal=${selectedSuc}`
          )

          .then((response) => {
            // Incrementa el contador en cada solicitud exitosa
            successfulRequests++;

            // Verifica si todas las solicitudes han terminado
            if (successfulRequests === formData.length - diasConRegistros.size) {
              // Muestra una alerta de SweetAlert cuando todas las solicitudes hayan terminado
              // setSelectedId("");
              // setSelectedName("");
              // setSelectedDate(""); // Limpia la fecha seleccionada
              // setFormData([]); // Limpia los datos del formulario
              // setHorarios([]); // Limpia los datos de la tabla

              Swal.fire({
                icon: "success",
                title: "Creación de horarios exitosa",
                text: "Todos los horarios se han actualizado.",
              });

              consulta();
              toggleModalCrear();

              // Puedes realizar una nueva consulta o actualizar la vista según tus necesidades
            }
          })
          .catch((error) => {
            // Manejo de errores
            // setSelectedId("");
            // setSelectedName("");
            // setSelectedDate(""); // Limpia la fecha seleccionada
            // setFormData([]); // Limpia los datos del formulario
            // setHorarios([]); // Limpia los datos de la tabla

            console.error(`Error en la solicitud POST para ${daysOfWeek[i]}:`, error);
            Swal.fire({
              icon: "success",
              title: "Creación de horarios exitosa",
              text: "Todos los horarios se han actualizado.",
            });
            consulta();


            toggleModalCrear();
          });
      } else {
        // Si ya hay registros para este día, simplemente incrementa el contador
        successfulRequests++;
      }
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

        <Container>
          <h1>
            Cambio sucursal
            <MdHistoryToggleOff size={35} />
          </h1>
          <Card>
            <CardBody>
              <Row>
                <Col sm="12">
                  <h3>Cambio de sucursal de: {selectedName}</h3>
                  <br />
                </Col>
                <Col sm="6">
                  <Label> Seleccione un trabajador: </Label>
                  <InputGroup>
                    <Input disabled type="text" value={selectedName} />
                    <Button color="secondary" onClick={() => setModalOpen(true)}>
                      Elegir
                    </Button>
                  </InputGroup>
                  <br />
                </Col>

                <Col sm="6">
                  <Label> Seleccione fecha de cambio: </Label>
                  <Input type="date" value={selectedDate} onChange={handleDateChange} />
                  <br />
                </Col>

                {/* parte buena */}
                <Col sm="6">
                  <Button color="primary" onClick={consulta}>
                    Consultar días de la semana
                  </Button>
                  {showButton && (
                    <Button
                      color="primary"
                      onClick={() => {
                        const fechaSeleccionada = new Date(selectedDate); // Convierte la fecha seleccionada a un objeto Date
                        fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1); // Resta un día
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
          <MaterialReactTable columns={columns} data={horarios} />;
        </Container>
      </div>

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
      <Modal size="xl" isOpen={modalCrearOpen} toggle={toggleModalCrear}>
        <ModalHeader toggle={toggleModalCrear}>
          <h3>
            Crear horarios de : {selectedName} <p> </p>
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="table-responsive">
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
                  <th>Sucursal</th>
                </tr>
              </thead>
              {/* <tbody>
              {daysOfWeek.map((day, dayIndex) => (
                <tr key={dayIndex}> */}
              <tbody>
                {daysOfWeek.map((day, dayIndex) => {
                  if (!diasConRegistros.has(dayIndex)) {
                    // Solo muestra el formulario para los días sin registros
                    return (
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
                            onChange={(e) => handleDateChange(e, dayIndex)}
                          // onChange={(e) => handleDateChange(e)} // Utiliza la misma función para actualizar la fecha
                          />
                        </td>
                        <td>
                          <Input
                            type="time"
                            name="h1"
                            value={formData[dayIndex]?.h1 || ""}
                            onChange={(e) => handleInputChange(e, dayIndex)}
                            disabled={new Date(formData[dayIndex + 1]?.fecha) < new Date()}
                          />
                        </td>
                        <td>
                          <Input
                            type="time"
                            name="h2"
                            value={formData[dayIndex]?.h2 || ""}
                            onChange={(e) => handleInputChange(e, dayIndex)}
                            disabled={new Date(formData[dayIndex + 1]?.fecha) < new Date()}
                          />
                        </td>
                        <td>
                          <Input
                            type="time"
                            name="h3"
                            value={formData[dayIndex]?.h3 || ""}
                            onChange={(e) => handleInputChange(e, dayIndex)}
                            disabled={new Date(formData[dayIndex + 1]?.fecha) < new Date()}
                          />
                        </td>
                        <td>
                          <Input
                            type="time"
                            name="h4"
                            value={formData[dayIndex]?.h4 || ""}
                            onChange={(e) => handleInputChange(e, dayIndex)}
                            disabled={new Date(formData[dayIndex + 1]?.fecha) < new Date()}
                          />
                        </td>
                        {/* <td align="center">
                          <Input
                            type="checkbox"
                            name="descanso"
                            checked={formData[dayIndex]?.descanso || false}
                            disabled={new Date(formData[dayIndex + 1]?.fecha) < new Date()}
                            onChange={(e) => handleCheckboxChange(e, dayIndex)}
                          />
                        </td> */}
                        <td>
                          <select
                            name="sucursal"
                            id="exampleSelect"
                            value={selectedSuc}
                            onChange={handleSucursalChange}
                          >
                            <option value="">Selecciona sucursal</option>
                            {dataSucursales.map((sucursal) => (
                              <option key={sucursal.sucursal} value={sucursal.sucursal}>
                                {sucursal.nombre}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* <Input
                          type="text"
                          name="id_empleado"
                          value={formData[dayIndex]?.id_empleado || ""}
                          onChange={(e) => handleInputChange(e, dayIndex)}
                        /> */}
                      </tr>
                    );
                  } else {
                    return null; // No muestra nada para los días que ya tienen registros
                  }
                })}
              </tbody>
            </Table>
          </div>
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
            <div className="table-responsive">
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
                    {/* <td>
                      <input
                        type="checkbox"
                        checked={selectedHorario.descanso}
                        onChange={(e) => handleEditCheckboxChange("descanso", e.target.checked)}
                      />
                    </td> */}
                    <td>
                      <select name="sucursal" id="exampleSelect" value={selectedSuc} onChange={handleSucursalChange}>
                        <option value="">Selecciona sucursal</option>
                        {dataSucursales.map((sucursal) => (
                          <option key={sucursal.sucursal} value={sucursal.sucursal}>
                            {sucursal.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
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

export default HorariosSuc;
