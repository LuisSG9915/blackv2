import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AlertComponent from "../../components/AlertComponent";
import { jezaApi } from "../../api/jezaApi";

import "../../../css/home.css";
import logoImage from "../../assets/pe_logorecn.png";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Sucursal } from "../../models/Sucursal";
import Swal from "sweetalert2";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleNavigation = async () => {
    setLoading(true);
    try {
      const response = await jezaApi.get(`/UsuarioPass?usuario=${username}&pass=${password}`);
      const sucursalArray = getSucursalForeignKey(response.data[0].sucursal);
      const nuevoResponse = response.data.map((item) => {
        return {
          ...item,
          idCia: sucursalArray[0].cia,
        };
      });
      if (response.data[0].acceso === 1) {
        if (
          response.data[0].clave_perfil == 27 ||
          response.data[0].clave_perfil == 1032 ||
          response.data[0].clave_perfil == 1033
        ) {
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
                  <Input
                    id="username"
                    name="username"
                    placeholder="Usuario"
                    onChange={handleUsernameChange}
                    type="text"
                    bsSize="sm"
                  />
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
