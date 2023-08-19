import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AlertComponent from "../../components/AlertComponent";
import { jezaApi } from "../../api/jezaApi";

import "../../../css/home.css";
import logoImage from "../../assets/Logo.png";
import CButton from "../../components/CButton";
import CFormGroupInput from "../../components/CFormGroupInput";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";

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
  const handleNavigation = async () => {
    setLoading(true);
    try {
      const response = await jezaApi.get(`/UsuarioPass?usuario=${username}&pass=${password}`);
      console.log(response.data);
      if (response.data[0].acceso === 1) {
        if (response.data[0].clave_perfil == 27) {
          setResponseData(response.data);
          setModalSucursal(true);
          // const arregloModificado = response.data.map((item: any) => {
          //   return {
          //     ...item,
          //     sucursal: 21,
          //     d_sucursal: "BARRIO",
          //   };
          // });
          // localStorage.setItem("userLoggedv2", JSON.stringify(arregloModificado));
        }
        //
        else {
          localStorage.setItem("userLoggedv2", JSON.stringify(response.data));
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
              setTimeout(() => {
                navigate("/app");
              }, 1000);
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
