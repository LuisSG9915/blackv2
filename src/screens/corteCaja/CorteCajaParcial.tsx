import React, { useState, useEffect } from "react";
import { Button, Col, Alert, Container, Table, CardFooter, Card, FormGroup, CardText, Input, CardTitle, CardBody, Label, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import CurrencyInput from "react-currency-input-field";
import { ImCancelCircle } from "react-icons/im";
import { useCorteParcial } from "../../hooks/getsHooks/useCorteParcial";
import { UserResponse } from "../../models/Home";
import { jezaApi } from "../../api/jezaApi";
import Swal from "sweetalert2";
interface Props {
  efectivo: number;
  credito: number;
  anticipo: number;
  otro: number;
  gasto: number;
  total: number;
  totalCorte: number;
  diferencia: number;
  totalTira: number;
  efectiviTira: number;
  tcTira: number;
  anticipoTira: number;
  otroTira: number;
  gastoTira: number;
}

function CorteCajaParcial() {
  const [form, setForm] = useState<Props>({
    efectivo: 0,
    credito: 0,
    anticipo: 0,
    otro: 0,
    gasto: 0,
    total: 0,
    totalCorte: 0,
    diferencia: 0,
    totalTira: 9750,
    efectiviTira: 5000,
    tcTira: 2500,
    anticipoTira: 1500,
    otroTira: 500,
    gastoTira: 250,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (value === "" || value === "NaN") {
      // Manejar el caso cuando el campo está vacío
      setForm((prevState: Props) => ({ ...prevState, [name]: 0 }));
      return;
    }
    const integerValue = parseInt(value.replace(/\D/g, ""), 10);

    setForm((prevState: Props) => ({ ...prevState, [name]: integerValue }));
  };

  const handleValueChange = (fieldName: string, value: string | undefined) => {
    console.log(value);
    if (value === undefined) {
      setForm((prevForm) => ({
        ...prevForm,
        [fieldName]: 0, // Actualizar el valor correspondiente en el estado del formulario
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [fieldName]: value, // Actualizar el valor correspondiente en el estado del formulario
      }));
    }
  };
  const [visible, setVisible] = useState(false);
  const [danger, setDanger] = useState("");

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);

  /* alertas */
  const [creado, setVisible1] = useState(false);

  useEffect(() => {
    // const totalCortes = Number(form.efectivo) + Number(form.credito) + Number(form.anticipo) + Number(form.otro);
    const totalCortes = sumaImportes;
    const diferenciaCalc = totalCortes - form.efectivo - form.credito;

    if (diferenciaCalc) {
      setForm((prevState: any) => ({ ...prevState, diferencia: diferenciaCalc }));
    } else {
      setForm((prevState: any) => ({ ...prevState, diferencia: diferenciaCalc }));
    }
    if (totalCortes > 0) {
      setForm((prevState: any) => ({ ...prevState, total: totalCortes }));
      console.log({ form });
    }
    setForm({ ...form, total: Number(form.efectivo) + Number(form.credito), diferencia: totalCortes - form.total });
  }, [form.efectivo, form.credito, form.anticipo, form.gasto, form.otro, form.total]);

  useEffect(() => {
    // totalTira
    const totalTiras = form.efectiviTira + form.tcTira + form.anticipoTira + form.otroTira - form.gastoTira;
    setForm((prev) => ({ ...prev, totalTira: totalTiras }));
  }, [form.gasto]);

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
  const { dataCorteParcial, fetchCorteParcial } = useCorteParcial({ sucursal: dataUsuarios2[0]?.sucursal, corte: 1, corteParcial: 1 });
  const [sumaImportes, setSumaImportes] = useState(0);

  useEffect(() => {
    const suma = dataCorteParcial.reduce((total, item) => total + item.importe, 0);
    setSumaImportes(suma);
  }, [dataCorteParcial]);

  const postCorte = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const fechaFormateada = `${year}${month}${day}`;

    jezaApi
      .post(
        `/Corte?cia=26&sucursal=${
          dataUsuarios2[0].sucursal
        }&fecha=${fechaFormateada}&caja=${1}&corte=${1}&corteParcial=${1}&corteFinal=${1}&totalEfectivo=${dataCorteParcial[0]?.importe}&totalTC=${
          dataCorteParcial[1]?.importe
        }&totalAnticiposAplicados=${0}&totalOtros=${0}&totalGastos=${0}&id_usuario=${dataUsuarios2[0]?.id}&totalEfectivoEntregado=${
          form.efectivo
        }&totalTCEntregado=${form.credito}&totalAnticiposAplicadosEntregado=${0}&totalOtrosEntregado=${0}`
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          text: "Corte guardada con éxito",
          confirmButtonColor: "#3085d6",
        });
      });
  };

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
              <h1> Corte de caja parcial </h1>
            </div>
          </Col>
        </Row>
        <br />
        <Card body className="my-12" style={{ maxWidth: "70rem", margin: "auto" }}>
          <CardTitle tag="h2"></CardTitle>
          <CardBody>
            <Alert color={danger === "a" ? "danger" : "info"} isOpen={visible} toggle={onDismiss}>
              {danger === "a" ? "Corte no se ha realizado con éxito" : "Corte registrado con éxito"}
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
                      decimalScale={2}
                      className="custom-currency-input"
                      prefix="$"
                      onChange={handleChange}
                      value={dataCorteParcial[0]?.importe}
                      disabled
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="efectivo"
                      placeholder="Please enter a number"
                      defaultValue={form.efectivo ? form.efectivo : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("efectivo", value)}
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Venta con tarjeta de crédito:</th>
                  <td>
                    <CurrencyInput
                      decimalScale={2}
                      className="custom-currency-input"
                      onChange={handleChange}
                      value={dataCorteParcial[1]?.importe}
                      disabled
                      prefix="$"
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="credito"
                      placeholder="Please enter a number"
                      defaultValue={form.credito ? form.credito : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("credito", value)}
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Anticipos aplicados:</th>
                  <td>
                    <CurrencyInput decimalScale={2} className="custom-currency-input" prefix="$" onChange={handleChange} value={0} disabled />
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="anticipo"
                      placeholder="Please enter a number"
                      value={form.anticipo ? form.anticipo : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("anticipo", value)}
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Otros:</th>
                  <td>
                    <CurrencyInput decimalScale={2} className="custom-currency-input" prefix="$" onChange={handleChange} value={0} disabled />
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="otro"
                      placeholder="Please enter a number"
                      value={form.otro ? form.otro : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("otro", value)}
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Gastos:</th>
                  <td>
                    <CurrencyInput decimalScale={2} className="custom-currency-input" prefix="$" onChange={handleChange} value={0} disabled />
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      name="gasto"
                      placeholder="Please enter a number"
                      value={form.gasto ? form.gasto : 0}
                      decimalsLimit={2}
                      onValueChange={(value) => handleValueChange("gasto", value)}
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
                      decimalScale={2}
                      className="custom-currency-input"
                      prefix="$"
                      onChange={handleChange}
                      value={sumaImportes}
                      disabled
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      className="custom-currency-input"
                      prefix="$"
                      onChange={handleChange}
                      disabled
                      name="total"
                      value={form.total}
                      allowDecimals
                      decimalScale={2}
                    />
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
                      decimalScale={2}
                      onChange={handleChange}
                      disabled
                      name="diferencia"
                      value={form.diferencia}
                    />
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
                if (form.total >= sumaImportes) {
                  alert("Corte registrada correctamente");
                  postCorte();
                } else {
                  alert("Corte no registrada ");
                }
              }}
            >
              Ok
            </Button>
          </CardFooter>
        </Card>

        <br />
        {/* <AlertComponent error={error} onDismiss={onDismiss} visible={visible} /> */}
      </Container>
    </>
  );
}

export default CorteCajaParcial;
