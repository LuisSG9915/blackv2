import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  Collapse,
  NavbarToggler,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardHeader,
  Card,
  ListGroup,
  ListGroupItem,
  Input,
  Spinner,
} from "reactstrap";
import { Usuario } from "../models/Usuario";
import { AiOutlineUser } from "react-icons/ai";
import Timer from "../components/Timer";
import Swal from "sweetalert2";
import "../../css/sidebar.css";
import logoImage from "../assets/logoN.png";
import { useSucursales } from "../hooks/getsHooks/useSucursales";
import RataLogo from "../assets/rataTNB.jpeg";
import useSeguridad from "../hooks/getsHooks/useSeguridad";

const SidebarHorizontal = () => {
  const { filtroSeguridad, session } = useSeguridad();

  /* sincronizacionshopify */
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Usuario[]>([]);
  // const [isDataLoaded, setIsDataLoaded] = useState(false);
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
        console.log(form);
        const formattedJSON = JSON.stringify(parsedItem, null, 2);
        const alertMessage = formattedJSON.replace(/\\n/g, "\n");

        console.log(alertMessage);
        // setIsDataLoaded(true);
      } catch (error) {
        console.error("Error parsing JSON:", error);
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

  const handleTimerUpdate = (timeLeft: number, userLogged: Usuario[]) => {
    const expirationTime = Date.now() + timeLeft;
    localStorage.setItem("timerExpiration", String(expirationTime));
    // localStorage.setItem("userLoggedv2", JSON.stringify(userLogged));
  };

  const isTimerExpired = () => {
    const timerExpiration = localStorage.getItem("timerExpiration");
    if (timerExpiration) {
      return Date.now() >= Number(timerExpiration);
    }
    return false;
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
  const [sucData, setSucData] = useState({ idSuc: 0, dSuc: "", idCia: 0 });
  const { dataSucursales } = useSucursales();
  const [bandera, setBandera] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    localStorage.removeItem("userLoggedv2");

    const desc = dataSucursales.find((suc) => Number(suc.sucursal) == Number(value));
    // setSucData((prevState: any) => ({ ...prevState, [name]: Number(value) }));
    // if (value.length > 0) setBandera(true);
    setSucData({ ...sucData, dSuc: desc?.nombre ? desc?.nombre : "", idSuc: Number(value), idCia: Number(desc?.cia) });
    // setTimeout(() => {
    //   const neuevoResponse = form.map((item) => {
    //     return {
    //       ...item,
    //       sucursal: sucData.idSuc,
    //       d_sucursal: sucData.dSuc,
    //     };
    //   });
    //   localStorage.setItem("userLoggedv2", JSON.stringify(neuevoResponse));
    // }, 1500);
  };
  useEffect(() => {
    if (sucData.idSuc > 0) {
      const nuevoResponse = form.map((item) => {
        return {
          ...item,
          sucursal: sucData.idSuc,
          d_sucursal: sucData.dSuc,
          idCia: sucData.idCia,
        };
      });
      localStorage.setItem("userLoggedv2", JSON.stringify(nuevoResponse));
      setForm(nuevoResponse);
      window.location.reload();
    }
  }, [sucData.dSuc]);

  const [puedeVerCatalogos, setPuedeVer] = useState(false);

  // useEffect(() => {
  //   function obtenerPermiso() {
  //     setTimeout(async () => {
  //       try {
  //         const resultado = await filtroSeguridad("sb_cias_view");
  //         setPuedeVer(resultado);
  //       } catch (error) {
  //         console.error(error);
  //         // Manejar errores
  //       }
  //     }, 1000);
  //   }

  //   obtenerPermiso();
  // }, [session]);

  const [loadingController, setLoadingController] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      // cleanData();
      setLoadingController(false);
    }, 1100);
    // console.log('Este código se ejecutará una vez al montar el componente.');

    // Puedes realizar cualquier tarea que necesites aquí
    // Por ejemplo, hacer una llamada a una API o inicializar algún estado
  }, []); // El array de dependencias está vacío

  return (
    <>
      {/* {isDataLoaded && ( */}
      <>
        <div>
          <Navbar className="navar" expand={"md"} color="rgba(255, 255, 255, 1)">
            {/* <NavbarBrand href="/" >{logoImage}</NavbarBrand> */}
            {/* <NavbarBrand href="/" src={logoImage}></NavbarBrand> */}
            {/* <img href="/" src={logoImage} alt="Logotipo" className="logo-inv" /> */}
            <NavbarBrand href="/">
              <img style={{ scale: "80%" }} src={logoImage} alt="Logotipo" />
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            {/* <div className="containersinc">
              <div
                id="loading-div-o"
                className={`loading ${loadingVisible_o ? "" : "hidden"}`}
                hidden={!loadingVisible_o}
              >
                <div className="loader-container">
                  <div className="loader"></div>
                  <p className="no-spin">Sincronizando órdenes shopify...</p>
                </div>
              </div>

              <div id="loading-div-c" className={`loading ${loadingVisible ? "" : "hidden"}`} hidden={!loadingVisible}>
                <div className="loader-container">
                  <div className="loader"></div>
                  <p className="no-spin">Sincronizando clientes shopify...</p>
                </div>
              </div>
            </div> */}
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar justified={true}>
                <UncontrolledDropdown color="black">
                  <DropdownToggle nav caret color="dark" className="navToggle">
                    Catálogos
                  </DropdownToggle>
                  <DropdownMenu dark>
                    <DropdownItem header>Administrativo</DropdownItem>
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_cias_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/Cias");
                      }}
                    >
                      Empresas
                    </DropdownItem>

                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_suc_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/Sucursales");
                      }}
                    >
                      Sucursales
                    </DropdownItem>
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_alm_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/Almacenes");
                      }}
                    >
                      Almacenes
                    </DropdownItem>
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_prov_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/Proveedores");
                      }}
                    >
                      Proveedores
                    </DropdownItem>
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_forma_p_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/TipoFormasPago");
                      }}
                    >
                      Tipo de formas pago
                    </DropdownItem>
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_cat_gasto_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/CategoriaGastos");
                      }}
                    >
                      Categoría de gastos
                    </DropdownItem>
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_cat_s_gasto_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/CategoriaSubGastos");
                      }}
                    >
                      Subcategorías de gastos
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem header>Comerciales</DropdownItem>
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_marcas_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/Marcas");
                      }}
                    >
                      Marcas
                    </DropdownItem>
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_area_dep_clas_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/AreaDeptoClases");
                      }}
                    >
                      Área, Departamentos y Clases
                    </DropdownItem>
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("sb_cli_view");
                        if (permiso === false) {
                          return;
                        }
                        navigate("/Clientes");
                      }}
                    >
                      Clientes
                    </DropdownItem>
                    <DropdownItem onClick={() => navigate("/ClientesShopify")}>Shopify clientes </DropdownItem>
                    <DropdownItem onClick={() => navigate("/Anticipo")}>Anticipos</DropdownItem>
                    <DropdownItem onClick={() => navigate("/Descuentos")}>Tipo de descuentos</DropdownItem>
                    <DropdownItem onClick={() => navigate("/DescPorPuntos")}>Configuración de puntos por departamentos</DropdownItem>
                    <DropdownItem onClick={() => navigate("/Productos")}>Productos</DropdownItem>
                    <DropdownItem onClick={() => navigate("/KitPaquete")}>Kit de Paquetes piezas</DropdownItem>
                    <DropdownItem onClick={() => navigate("/PaqueteConversiones")}>Paquetes conversiones</DropdownItem>
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
                    <DropdownItem onClick={() => navigate("/NominaTrabajadores")}>Catálogo trabajadores</DropdownItem>
                    <DropdownItem onClick={() => navigate("/Metas")}>Metas</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown>
                  <DropdownToggle nav caret color="rgba(225,224,253,255)">
                    Ventas
                  </DropdownToggle>
                  <DropdownMenu dark>
                    <DropdownItem onClick={() => navigate("/Ventas")}>Ventas</DropdownItem>
                    <DropdownItem onClick={() => navigate("/CancelacionVentas")}> Cancelaciones</DropdownItem>
                    <DropdownItem onClick={() => navigate("/DemoTresTablas")}>Reporte de cortes</DropdownItem>
                    {/* <DropdownItem onClick={() => navigate("/CorteCajaParcial")}>Corte parcial</DropdownItem>
                    <DropdownItem onClick={() => navigate("/CorteCaja")}>Corte final del día</DropdownItem> */}
                  </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown>
                  <DropdownToggle nav caret color="rgba(225,224,253,255)">
                    Citas
                  </DropdownToggle>
                  <DropdownMenu dark>
                    {/* <DropdownItem
                      onClick={() =>
                        (window.location.href = `http://cbinfo.no-ip.info:9085/?idRec=${form[0].id}&suc=${form[0].d_sucursal}&idSuc=${form[0].sucursal}`)
                      }
                    > */}
                    <DropdownItem
                      onClick={async () => {
                        const permiso = await filtroSeguridad("visor_citas");
                        if (permiso === false) {
                          return; // Si el permiso es falso o los campos no son válidos, se sale de la función
                        }

                        if (permiso === true) {
                          window.location.href = `http://cbinfo.no-ip.info:9085/?idRec=${form[0].id}&suc=${form[0].d_sucursal}&idSuc=${form[0].sucursal}`;
                        }
                      }}
                    >
                      Visor de citas
                    </DropdownItem>
                    <DropdownItem onClick={() => navigate("/BloqueosColaborador")}>Bloqueos de colaborador</DropdownItem>

                    {/* <DropdownItem> Configuración </DropdownItem> */}
                  </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown>
                  <DropdownToggle nav caret color="rgba(225,224,253,255)">
                    Inventario
                  </DropdownToggle>

                  <DropdownMenu dark>
                    <DropdownItem onClick={() => navigate("/Compras")}>Compras</DropdownItem>

                    <DropdownItem onClick={() => navigate("/TraspasosEntrada")}>Traspaso de entrada</DropdownItem>
                    <DropdownItem onClick={() => navigate("/TraspasoSalida")}>Traspaso de salida</DropdownItem>

                    <DropdownItem onClick={() => navigate("/MovimientoDiversos")}>Ajustes Diversos</DropdownItem>
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
                    {/* <DropdownItem onClick={() => navigate("/usuarios")}>Usuarios</DropdownItem> */}
                    <DropdownItem onClick={() => navigate("/Perfiles")}>Perfiles seguridad</DropdownItem>
                    <DropdownItem onClick={() => navigate("/PerfilesModulos")}>Permisos seguridad</DropdownItem>

                    <DropdownItem onClick={() => navigate("/ShopifySinc")}>SINC SHOPIFY</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown>
                  <DropdownToggle nav caret color="rgba(225,224,253,255)">
                    <AiOutlineUser></AiOutlineUser>Perfil
                  </DropdownToggle>
                  <DropdownMenu dark>
                    {/* <DropdownItem header> {form.map((usuario) => usuario.nombre)}</DropdownItem> */}
                    <DropdownItem header>
                      <Card>
                        <CardHeader>{currentDateTime}</CardHeader>
                        <ListGroup flush>
                          <ListGroupItem>Nombre: {form.length > 0 && form[0].nombre}</ListGroupItem>
                          {/* <ListGroupItem>Sucursal: {form.length > 0 && form[0].d_sucursal}</ListGroupItem> */}
                          {form[0]?.clave_perfil === 27 ? (
                            <ListGroupItem>
                              <Input
                                value={form.length > 0 && form[0].sucursal}
                                type="select"
                                bsSize="sm"
                                style={{ fontSize: 10, fontStyle: "oblique" }}
                                onChange={handleChange}
                              >
                                {dataSucursales.map((suc) => (
                                  <option value={suc.sucursal}> Sucursal: {suc.nombre}</option>
                                ))}
                              </Input>
                            </ListGroupItem>
                          ) : (
                            <ListGroupItem>Sucursal: {form.length > 0 && form[0]?.d_sucursal}</ListGroupItem>
                          )}
                        </ListGroup>
                      </Card>
                      {/* <div>
                        <p>
                          Tiempo restante para obtener órdenes: {Math.floor(countdown_o / 60)} minutos{" "}
                          {countdown_o % 60} segundos
                        </p>
                      </div> */}
                    </DropdownItem>
                    <DropdownItem onClick={cierraSesion}>Cerrar sesión</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
        <div>
          {loadingController ? (
            <div className="fondoLoader">
              <img style={{ width: "15%" }} src={logoImage} alt="Logotipo" />
              <img style={{ width: "15%" }} src={RataLogo} alt="Logotipos" />
              <Spinner
                style={{
                  height: "5rem",
                  width: "5rem",
                }}
                type="grow"
              >
                Loading...
              </Spinner>
            </div>
          ) : null}
        </div>

        {/* <div className="">
          {isTimerExpired() ? (
            <Timer limitInMinutes={60} onExpiration={handleLogout} redirectPath={undefined} onUpdate={undefined} />
          ) : (
            <Timer limitInMinutes={60} onExpiration={handleLogout} onUpdate={handleTimerUpdate} redirectPath={undefined} />
          )}
        </div> */}
      </>
    </>
  );
};

export default SidebarHorizontal;
