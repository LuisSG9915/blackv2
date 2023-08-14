import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";
import CFormGroupInput from "../../components/CFormGroupInput";
import { jezaApi } from "../../api/jezaApi";
import { Cia } from "../../models/Cia";
import { Perfil_Modulo } from "../../models/Perfil_Modulo";
import { Perfil } from "../../models/Perfil";
import AlertComponent from "../../components/AlertComponent";
import { usePerfiles } from "../../hooks/getsHooks/useClavePerfil";
import { useModulos } from "../../hooks/getsHooks/useModulos";
import { Modulo } from "../../models/Modulo";

function PerfilesModulosCrear() {
  const { modalInsertar, setModalInsertar } = useModalHook();

  const [form, setForm] = useState<Perfil_Modulo>({
    clave_perfil: 1,
    modulo: 1,
    permiso: true,
  });
  const [data, setData] = useState<Perfil_Modulo[]>([]);
  const { dataPerfiles } = usePerfiles();

  const getPerfilModulos = () => {
    jezaApi
      .get("PerfilModulo?id=0")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getPerfilModulos();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "permiso") {
      setForm((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setForm((prevState: Perfil_Modulo) => ({ ...prevState, [name]: value }));
    }
    console.log(form);
  };

  const insertar = () => {
    jezaApi
      .post("/PerfilModulo", null, {
        params: {
          clave_perfil: Number(form.clave_perfil),
          modulo: Number(form.modulo),
          permiso: form.permiso,
        },
      })
      .then((response) => {
        setVisible(true);
        setDataText(response.data.mensaje1);
        setModalInsertar(false);
      })
      .catch((error) => {
        // Handle error here
        console.log(error);
      });
  };
  const [visible, setVisible] = useState(false);
  const [dataText, setDataText] = useState("");

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);

  const { dataModulos } = useModulos();

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <Container className="px-2">
        <h1> Crear Seguridad </h1>
        <br />
        <FormGroup>
          <Row>
            <Col md="6" className="mb-4">
              <Label>Clave de perfil</Label>
              <Input type="select" name="clave_perfil" id="clave_perfil" value={form.clave_perfil} onChange={handleChange}>
                {dataPerfiles.map((perfil) => (
                  <option key={perfil.clave_perfil} value={Number(perfil.clave_perfil)}>
                    {perfil.descripcion_perfil}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md="6">
              <Label>Modulo</Label>
              <Input type="select" name="modulo" id="exampleSelect" value={form.modulo} onChange={handleChange}>
                {dataModulos.map((modulo: Modulo) => (
                  <option key={modulo.id} value={Number(modulo.id)}>
                    {modulo.descripcion}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md="6">
              <Label style={{ marginRight: 25 }}>Permiso</Label>
              <Input type="checkbox" name="permiso" onChange={handleChange}></Input>
            </Col>
          </Row>
        </FormGroup>
        <Button onClick={insertar}>Guardar</Button>
        <br />
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} text={dataText} />
      </Container>
    </>
  );
}

export default PerfilesModulosCrear;
