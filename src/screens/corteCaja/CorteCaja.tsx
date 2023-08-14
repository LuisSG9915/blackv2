import React, { useState, useEffect } from "react";
import { Button, Col, Alert, Container, Table, CardFooter, Card, FormGroup, CardText, Input, CardTitle, CardBody, Label, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { jezaApi } from "../../api/jezaApi";
import { Almacen } from "../../models/Almacen";
import AlertComponent from "../../components/AlertComponent";
import { Usuario } from "../../models/Usuario";
import { ImCancelCircle } from "react-icons/im";
import CurrencyInput from "react-currency-input-field";
import { useCorteDia } from "../../hooks/getsHooks/useCorteDia";
import { UserResponse } from "../../models/Home";
interface Props {
  efectivo: number;
  credito: number;
  anticipo: number;
  otro: number;
  gasto: number;
  total: number;
  totalCorte: number;
  diferencia: number;
}
function CorteCaja() {
  const [form, setForm] = useState<Props>({
    efectivo: 0,
    credito: 0,
    anticipo: 0,
    otro: 0,
    gasto: 0,
    total: 19500,
    totalCorte: 0,
    diferencia: 1,
  });

  useEffect(() => {
    const diferenciaCalc = form.totalCorte - form.total;
    if (diferenciaCalc < 0) {
      setForm((prevState: any) => ({ ...prevState, diferencia: 0 }));
    } else {
      setForm((prevState: any) => ({ ...prevState, diferencia: diferenciaCalc }));
    }
  }, [form.totalCorte]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
    console.log(form);
  };

  const [visible, setVisible] = useState(false);
  const [danger, setDanger] = useState("");

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);

  /* alertas */
  const [creado, setVisible1] = useState(false);

  const [fechaHoy, setFechaHoy] = useState("");
  useEffect(() => {
    const obtenerFechaHoy = () => {
      const fecha = new Date();
      const opcionesFecha = { year: "numeric", month: "numeric", day: "numeric" };
      const fechaFormateada = fecha.toLocaleDateString(undefined, opcionesFecha);
      setFechaHoy(fechaFormateada);
    };

    obtenerFechaHoy();
  }, []);
  const [dataUsuarios2, setDataUsuarios2] = useState<UserResponse[]>([]);

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios2(parsedItem);
      console.log({ dataUsuarios2 });
    }
  }, []);

  const { dataCorteDia, fetchCorteDia } = useCorteDia({ sucursal: dataUsuarios2[0]?.sucursal, corte: 1 });

  const [sumaImportes, setSumaImportes] = useState(0);

  useEffect(() => {
    const suma = dataCorteDia.reduce((total, item) => total + item.importe, 0);
    setSumaImportes(suma);
  }, [dataCorteDia]);

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <br />
      <Container className="px-2">
        {/* alertas */}

        <br />
        <Row md={8}>
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1> Corte de caja final del día </h1>
            </div>
          </Col>
        </Row>
        <br />
        <Card body className="my-12" style={{ maxWidth: "70rem", margin: "auto" }}>
          <CardTitle tag="h2"></CardTitle>
          <CardBody>
            <Alert color={danger === "a" ? "danger" : "info"} isOpen={visible} toggle={onDismiss}>
              {danger === "a" ? "Corte final del día no se ha realizado con éxito" : "Corte del final del día registrado con éxito"}
            </Alert>

            <Table borderless>
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <h4 style={{ textAlign: "center" }}>Tira </h4>{" "}
                  </th>
                  <th>
                    <h4 style={{ textAlign: "center" }}>Corte </h4>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Venta con efectico:</th>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={dataCorteDia[0]?.importe}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      // onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={dataCorteDia[0]?.importe}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      // onValueChange={(value) => handleValueChange("credito", value)}
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Venta con tarjeta de crédito:</th>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={dataCorteDia[1]?.importe}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={dataCorteDia[1]?.importe}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Anticipos aplicados:</th>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={0}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={0}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Otros:</th>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={0}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={0}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Gastos:</th>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={0}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={0}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                </tr>
              </tbody>
            </Table>
            <hr />
            <Table borderless>
              <tbody>
                <tr>
                  <th scope="row" style={{ minWidth: "220px", maxWidth: "370px" }}>
                    <h4>Total:</h4>
                  </th>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={sumaImportes}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                  <td>
                    {/* <Input onChange={handleChange} name="totalCorte" type="number" defaultValue={form.totalCorte} /> */}
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={sumaImportes}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <h4>Diferencia:</h4>
                  </th>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      value={0}
                      disabled
                      decimalScale={2}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />{" "}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </CardBody>

          <CardFooter>
            <br />
            <Button
              style={{ minWidth: "100px", maxWidth: "300px" }}
              color="success"
              onClick={() => {
                if (19000 >= 19000) {
                  setVisible(true);
                }
              }}
            >
              Ok
            </Button>
          </CardFooter>
        </Card>

        <br />
      </Container>
    </>
  );
}

export default CorteCaja;
