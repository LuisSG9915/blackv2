import React, { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  NavbarToggler,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Container,
  CardHeader,
  Card,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Usuario } from "../models/Usuario";
import Usuarios from "../screens/Usuarios";
import { AiOutlineUser } from "react-icons/ai";
import Timer from "./Timer";
import Swal from "sweetalert2";
import "../../css/sidebar.css";
// import "../../css/reportes.css";

const SidebarHorizontal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Usuario[]>([]);
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const navigate = useNavigate();
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      try {
        const parsedItem = JSON.parse(item);
        setForm(parsedItem);
        const formattedJSON = JSON.stringify(parsedItem, null, 2);
        const alertMessage = formattedJSON.replace(/\\n/g, "\n");

        console.log(alertMessage);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        // Mostrar un alert en caso de error
        // alert("Error al cargar los datos de sesión. Por favor, vuelve a iniciar sesión.");
        // Otra opción es usar una librería de notificaciones como "sweetalert2" para mostrar un mensaje más estilizado

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cargar los datos de sesión. Por favor, vuelve a iniciar sesión.",
        });
        redireccion();
      }
    } else {
      redireccion();
    }
  }, []);

  const handleTimerExpiration = () => {
    localStorage.removeItem("timerExpiration");
  };

  const handleTimerUpdate = (timeLeft: number, userLogged: Usuario[]) => {
    const expirationTime = Date.now() + timeLeft;
    localStorage.setItem("timerExpiration", String(expirationTime));
    localStorage.setItem("userLoggedv2", JSON.stringify(userLogged));
  };

  const isTimerExpired = () => {
    const timerExpiration = localStorage.getItem("timerExpiration");
    if (timerExpiration) {
      return Date.now() >= Number(timerExpiration);
    }
    return false;
  };

  const handleUserActivity = () => {
    setIsIdle(false);
    setLastActivity(Date.now());
  };

  const checkUserActivity = () => {
    const inactivityPeriod = 30000; // 30 segundos de inactividad

    if (Date.now() - lastActivity > inactivityPeriod) {
      setIsIdle(true);
    }
  };

  // quitamos la veriabla de session del usuario logeado

  const clearUserData = () => {
    localStorage.removeItem("userLoggedv2");
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Sesión cerrada por inactividad",
      showConfirmButton: false,
      timer: 1500,
    });
    clearUserData();
    navigate("/");
  };

  const redireccion = () => {
    Swal.fire({
      title: "Debe iniciar sesion",
      showConfirmButton: false,
      timer: 1500,
    });
    clearUserData();
    navigate("/");
  };

  const cierraSesion = () => {
    Swal.fire({
      title: "Se cerrará la sesión. ¿Deseas continuar?",
      showDenyButton: true,
      confirmButtonText: "Cerrar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sesión terminada",
          showConfirmButton: false,
          timer: 1500,
        });
        clearUserData();
        navigate("/");
      }
    });
  };
  const [currentDateTime, setCurrentDateTime] = useState("");
  useEffect(() => {
    // Función para obtener la fecha y hora actual en el formato deseado
    const getCurrentDateTime = () => {
      const now = new Date();
      const dateOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const timeOptions = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false, // Para mostrar la hora en formato de 24 horas
      };

      const currentDate = now.toLocaleDateString(undefined, dateOptions);
      const currentTime = now.toLocaleTimeString(undefined, timeOptions);
      return `${currentDate}, ${currentTime}`;
    };

    // Actualizar el estado con la fecha y hora actual
    const interval = setInterval(() => {
      const dateTime = getCurrentDateTime();
      setCurrentDateTime(dateTime);
    }, 1000); // Actualizar cada segundo (o ajusta el intervalo según lo desees)

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isDataLoaded && (
        <>
          <div>
            <Navbar className="navar" expand={"md"} color="rgba(225,224,253,255)">
              <NavbarBrand href="/"> The New Black</NavbarBrand>
              <NavbarToggler onClick={toggle} />
              <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto" navbar justified={true}>
                  <UncontrolledDropdown>
                    <DropdownToggle nav caret color="rgba(225,224,253,255)">
                      Catálogos
                    </DropdownToggle>
                    <DropdownMenu dark>
                      <DropdownItem header>Administrativo</DropdownItem>
                      <DropdownItem onClick={() => navigate("/Cias")}>Empresas</DropdownItem>
                      <DropdownItem onClick={() => navigate("/Sucursales")}>Sucursales</DropdownItem>
                      <DropdownItem onClick={() => navigate("/Almacenes")}>Almacenes</DropdownItem>
                      <DropdownItem onClick={() => navigate("/Proveedores")}>Proveedores</DropdownItem>
                      <DropdownItem onClick={() => navigate("/TipoFormasPago")}>Tipo de formas pago</DropdownItem>
                      <DropdownItem onClick={() => navigate("/CategoriaGastos")}>Categoría de gastos</DropdownItem>
                      <DropdownItem onClick={() => navigate("/CategoriaSubGastos")}>
                        Subcategorías de gastos
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem header>Comerciales</DropdownItem>
                      <DropdownItem onClick={() => navigate("/Marcas")}>Marcas</DropdownItem>
                      <DropdownItem onClick={() => navigate("/AreaDeptoClases")}>
                        Área, Departamentos y Clases
                      </DropdownItem>
                      <DropdownItem onClick={() => navigate("/Clientes")}>Clientes</DropdownItem>
                      <DropdownItem onClick={() => navigate("/Descuentos")}>Tipo de descuentos</DropdownItem>
                      <DropdownItem onClick={() => navigate("/DescPorPuntos")}>
                        Configuración de puntos por departamentos
                      </DropdownItem>
                      <DropdownItem onClick={() => navigate("/Productos")}>Productos</DropdownItem>
                      <DropdownItem onClick={() => navigate("/KitPaquete")}>Kit de Paquetes piezas</DropdownItem>
                      <DropdownItem onClick={() => navigate("/PaqueteConversiones")}>Paquete conversiones</DropdownItem>
                      <DropdownItem onClick={() => navigate("/UnidadMedida")}>Unidad de medida</DropdownItem>
                      <DropdownItem onClick={() => navigate("/TipoMovto")}>Tipo de movimiento</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem header>Recursos Humanos</DropdownItem>
                      <DropdownItem onClick={() => navigate("/PuestoRecursosHumanos")}>Puestos RH</DropdownItem>
                      <DropdownItem onClick={() => navigate("/DepartamentoRecursos")}>Departamentos</DropdownItem>
                      <DropdownItem onClick={() => navigate("/TipoBajas")}>Tipo de bajas</DropdownItem>
                      <DropdownItem onClick={() => navigate("/NivelEscolar")}>Niveles de escolaridad</DropdownItem>
                      <DropdownItem onClick={() => navigate("/Estatuscolaborador")}>Estatus colaboradores</DropdownItem>
                      <DropdownItem onClick={() => navigate("/Horarios")}>Horarios</DropdownItem>
                      <DropdownItem onClick={() => navigate("/NominaTrabajadores")}>Nomina trabajadores</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <UncontrolledDropdown>
                    <DropdownToggle nav caret color="rgba(225,224,253,255)">
                      Ventas
                    </DropdownToggle>
                    <DropdownMenu dark>
                      <DropdownItem onClick={() => navigate("/Ventas")}>Ventas</DropdownItem>
                      <DropdownItem onClick={() => navigate("/CancelacionVentas")}> Cancelaciones</DropdownItem>
                      <DropdownItem onClick={() => navigate("/CorteCajaParcial")}>Corte parcial</DropdownItem>
                      <DropdownItem onClick={() => navigate("/CorteCaja")}>Corte final del día</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <UncontrolledDropdown>
                    <DropdownToggle nav caret color="rgba(225,224,253,255)">
                      Citas
                    </DropdownToggle>
                    <DropdownMenu dark>
                      <DropdownItem> Visor de citas </DropdownItem>
                      <DropdownItem> Configuración </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <UncontrolledDropdown>
                    <DropdownToggle nav caret color="rgba(225,224,253,255)">
                      Inventario
                    </DropdownToggle>

                    <DropdownMenu dark>
                      <DropdownItem onClick={() => navigate("/Compras")}>Compras</DropdownItem>
                      {/* <DropdownItem header>Traspasos</DropdownItem> */}
                      <DropdownItem onClick={() => navigate("/TraspasosEntrada")}>Traspaso de entrada</DropdownItem>
                      <DropdownItem onClick={() => navigate("/TraspasoSalida")}>Traspaso de salida</DropdownItem>
                      {/* <DropdownItem header>Ajustes</DropdownItem> */}
                      <DropdownItem onClick={() => navigate("/MovimientoDiversos")}>Ajustes Diversos</DropdownItem>
                      {/* <DropdownItem header>Conversiones</DropdownItem> */}
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <UncontrolledDropdown>
                    <DropdownToggle nav caret color="rgba(225,224,253,255)">
                      Reportes
                    </DropdownToggle>

                    <DropdownMenu dark>
                      <DropdownItem onClick={() => navigate("/ReporteTool")}>Reportes</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <UncontrolledDropdown>
                    <DropdownToggle nav caret color="rgba(225,224,253,255)">
                      Configuración
                    </DropdownToggle>

                    <DropdownMenu dark>
                      <DropdownItem onClick={() => navigate("/usuarios")}>Usuarios</DropdownItem>
                      <DropdownItem onClick={() => navigate("/Perfiles")}>Perfiles</DropdownItem>
                      <DropdownItem onClick={() => navigate("/PerfilesModulos")}>Seguridad</DropdownItem>

                      <DropdownItem onClick={() => navigate("/Anticipo")}>Anticipos</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <UncontrolledDropdown>
                    <DropdownToggle nav caret color="rgba(225,224,253,255)">
                      <AiOutlineUser></AiOutlineUser>Perfil
                    </DropdownToggle>

                    <DropdownMenu dark>
                      {/* <DropdownItem header> {form.map((usuario) => usuario.nombre)}</DropdownItem> */}
                      <DropdownItem header>
                        {" "}
                        <Card>
                          <CardHeader>{currentDateTime}</CardHeader>

                          <ListGroup flush>
                            <ListGroupItem>Nombre: {form.length > 0 && form[0].nombre}</ListGroupItem>
                            <ListGroupItem>Sucursal: {form.length > 0 && form[0].d_sucursal}</ListGroupItem>
                          </ListGroup>
                        </Card>
                      </DropdownItem>

                      <DropdownItem onClick={cierraSesion}>Cerrar sesión</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  {/* <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Todas las entregas
              </DropdownToggle>
              <DropdownMenu right> */}
                  {/* <DropdownItem onClick={() => navigate("/usuarios")}>Usuarios</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/Sucursales")}>Sucursales</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/Perfiles")}>Perfiles</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/Almacenes")}>Almacenes</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/Cias")}>Empresas</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/PerfilesModulos")}>Seguridad</DropdownItem> */}

                  {/* <DropdownItem onClick={() => navigate("/DescPorPuntos")}>Descuento por Puntos</DropdownItem>
                <DropdownItem onClick={() => navigate("/Descuentos")}>Descuentos</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/Marcas")}>Marcas</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/AreaDeptoClases")}>AreaDeptoClases</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/TipoFormasPago")}>Tipo Formas Pago</DropdownItem> */}

                  {/* <DropdownItem onClick={() => navigate("/Productos")}>Productos</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/PaqueteConversiones")}>PaqueteConversiones</DropdownItem>
                <DropdownItem onClick={() => navigate("/KitPaquete")}>KitPaquete</DropdownItem> */}

                  {/* <DropdownItem onClick={() => navigate("/Proveedores")}>Proveedores</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/CategoriaGastos")}>Categoria Gastos</DropdownItem>
                <DropdownItem onClick={() => navigate("/CategoriaSubGastos")}>Categoria SubGastos</DropdownItem> */}
                  {/* <DropdownItem onClick={() => navigate("/Clientes")}>Clientes</DropdownItem> */}

                  {/* 
                <DropdownItem onClick={() => navigate("/TipoBajas")}>Tipo de bajas</DropdownItem>
                <DropdownItem onClick={() => navigate("/PuestoRecursosHumanos")}>Puestos RH</DropdownItem>
                <DropdownItem onClick={() => navigate("/NivelEscolar")}>Niveles de Escolaridad</DropdownItem>
                <DropdownItem onClick={() => navigate("/DepartamentoRecursos")}>Departamentos</DropdownItem>
                <DropdownItem onClick={() => navigate("/Estatuscolaborador")}>Estatus</DropdownItem> */}
                  {/* 
              </DropdownMenu>
            </UncontrolledDropdown> */}
                </Nav>
              </Collapse>
            </Navbar>
          </div>
          <div className="">
            {isTimerExpired() ? (
              <Timer limitInMinutes={60} onExpiration={handleLogout} redirectPath={undefined} onUpdate={undefined} />
            ) : (
              <Timer
                limitInMinutes={60}
                onExpiration={handleLogout}
                onUpdate={handleTimerUpdate}
                redirectPath={undefined}
              />
            )}
          </div>

          {/* <div className="d-flex align-items-end flex-column">
        <p>Usuario: {form.map((usuario) => usuario.nombre)}</p>
        <p>Perfil: {form.map((usuario) => usuario.d_perfil)}</p>
      </div> */}

          {/* <Card
        style={{
          width: "18rem",
        }}
      >
        <CardHeader>{form.map((usuario) => usuario.nombre)}</CardHeader>
        <ListGroup flush>
          <ListGroupItem>{parsedItem.nombre}</ListGroupItem>
          <ListGroupItem>A second item</ListGroupItem>
          <ListGroupItem>And a third item</ListGroupItem>
        </ListGroup>
      </Card> */}

          {/* <Container>
        <div className="cardUsuario">
          <div>
            <Card>
              <CardHeader>{currentDateTime}</CardHeader>

              <ListGroup flush>
                <ListGroupItem>Nombre: {form.length > 0 && form[0].nombre}</ListGroupItem>
                <ListGroupItem>Sucursal: {form.length > 0 && form[0].d_sucursal}</ListGroupItem>
              </ListGroup>
            </Card>
          </div>
        </div>
      </Container> */}
          <div> </div>

          <div></div>
        </>
      )}
    </>
  );
};

export default SidebarHorizontal;
