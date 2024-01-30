import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AlertComponent from "../../components/AlertComponent";
import JezaApiService from "../../api/jezaApi2";

import "../../../css/home.css";
import logoImage from "../../assets/Logo.png";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Sucursal } from "../../models/Sucursal";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

function Home() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuthToken } = useAuth();
  const { jezaApi } = JezaApiService();

  const handleUsernameChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setPassword(event.target.value);
  };
  const [modalSucursal, setModalSucursal] = useState(false);
  const [responseData, setResponseData] = useState([]);

  const getSucursalForeignKey = (idTableCia: number) => {
    const cia = dataSucursales.filter((cia: Sucursal) => cia.sucursal === idTableCia);
    return cia;
  };

  const datas = {
    Usuario: "1",
    Contraseña: "2",
  };
  const handleNavigation = async () => {
    setLoading(true);
    try {
      const response2 = await jezaApi.post(`/tokenLogin`, datas);
      localStorage.setItem("token", JSON.stringify(response2.data.token));
      setAuthToken("a");
      const response = await jezaApi.get(`/UsuarioPass?usuario=${username}&pass=${password}`);
      const sucursalArray = getSucursalForeignKey(response.data[0].sucursal);
      const nuevoResponse = response.data.map((item) => {
        return {
          ...item,
          idCia: sucursalArray[0].cia,
        };
      });
      if (response.data[0].acceso === 1) {
        if (response.data[0].clave_perfil == 27 || response.data[0].clave_perfil == 1032 || response.data[0].clave_perfil == 1033) {
          setResponseData(nuevoResponse);
          setModalSucursal(true);
        } else {
          localStorage.setItem("userLoggedv2", JSON.stringify(nuevoResponse));
          navigate("/app");
        }
      } else {
        setError(true);
        setVisible(true);
        setTimeout(() => {
          setError(false);
          setVisible(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      setError(true);
      setVisible(true);
      setTimeout(() => {
        setError(false);
        setVisible(false);
      }, 3000);
    } finally {
      setLoading(false); // Finalizar el proceso de carga
    }
  };

  // const { logout } = useAuth();
  // const history = useNavigate();

  // useEffect(() => {
  //   const interceptor = jezaApi.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       if (error.response && error.response.status === 401) {
  //         // Se ha recibido un estado 401 (No autorizado)
  //         Swal.fire({
  //           icon: "error",
  //           title: "Tiempo de sesión expirado",
  //           text: "Favor de iniciar sesión nuevamente",
  //           confirmButtonColor: "#3085d6",
  //           showCancelButton: true,
  //           cancelButtonText: "Cancelar",
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             // Redirigir al usuario a la página de inicio de sesión
  //             history.push("/http://localhost:5173/"); // Ajusta la ruta según tu configuración
  //           } else {
  //             // Cerrar sesión si el usuario cancela
  //             logout();
  //           }
  //         });
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return () => {
  //     // Eliminar el interceptor cuando el componente se desmonte
  //     jezaApi.interceptors.response.eject(interceptor);
  //   };
  // }, [jezaApi, logout, history]);


  // useEffect(() => {
  //   const interceptor = jezaApi.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       if (error && error.response) {
  //         const { status, data } = error.response;
  //         if (status === 401 && data && data.Message === "Se ha denegado la autorización para esta solicitud.") {
  //           // Resto del código
  //           console.log("Interceptor capturó respuesta 401 con mensaje específico");
  //         }
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return () => {
  //     // Eliminar el interceptor cuando el componente se desmonte
  //     jezaApi.interceptors.response.eject(interceptor);
  //   };
  // }, [jezaApi]);

  const [visible, setVisible] = useState(false);
  const [sucData, setSucData] = useState({ idSuc: 0, dSuc: "" });
  const onDismiss = () => setVisible(false);
  const { dataSucursales } = useSucursales();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const desc = dataSucursales.find((suc) => Number(suc.sucursal) == Number(value));
    // setSucData((prevState: any) => ({ ...prevState, [name]: Number(value) }));
    setSucData({ ...sucData, dSuc: desc?.nombre ? desc?.nombre : "", idSuc: Number(value) });
  };
  return (
    <>
      <div className="home-page">
        <div className="content-container">
          <div className="logo-container">
            <img src={logoImage} alt="Logotipo" />
          </div>
          <div className="container_home">
            <div className="centered-content">
              <br />
              <form>
                <FormGroup floating>
                  <Input id="username" name="username" placeholder="Usuario" onChange={handleUsernameChange} type="text" bsSize="sm" />
                  <Label for="username">Usuario</Label>
                </FormGroup>
                <br />
                <FormGroup floating>
                  <Input
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleNavigation();
                      }
                    }}
                    id="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={handlePasswordChange}
                    type="password"
                    bsSize="sm"
                  />
                  <Label for="password">Contraseña</Label>
                </FormGroup>
                <br />
                <FormGroup floating>
                  <Button
                    title="Ingresar sesión"
                    name="aa"
                    onClick={handleNavigation}
                    disabled={loading} // Deshabilitar el botón durante el proceso de carga
                  >
                    {loading ? "Cargando..." : "Ingresar sesión"}
                  </Button>
                </FormGroup>
              </form>
              <br />
              <br />
              <AlertComponent
                error={error}
                onDismiss={onDismiss}
                visible={visible}
                text="Credenciales incorrectas, favor de ingresarlas nuevamente"
              />
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modalSucursal}>
        <ModalHeader>
          <div>
            <h3>Seleccione la sucursal que quiere ingresar</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <Input type="select" onChange={handleChange}>
            <option value={0}>Seleccione una sucursal</option>
            {dataSucursales.map((sucursal) => {
              return <option value={sucursal.sucursal}>{sucursal.nombre}</option>;
            })}
          </Input>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              const arregloModificado = responseData.map((item: any) => {
                return {
                  ...item,
                  sucursal: sucData.idSuc,
                  d_sucursal: sucData.dSuc,
                };
              });
              localStorage.setItem("userLoggedv2", JSON.stringify(arregloModificado));

              if (sucData.idSuc == 0) {
                Swal.fire({
                  icon: "error",
                  title: "¡Favor de seleccionar sucursal!",
                  text: `Es requerido seleccionar una sucursal para iniciar sesión...`,
                  confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
                });
                // alert("Prueba")
              } else {
                setTimeout(() => {
                  navigate("/app");
                }, 1000);
              }
            }}
            text="Guardar"
          />
          <CButton color="danger" onClick={() => setModalSucursal(false)} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}
export default Home;
