import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Card,
  CardTitle,
  CardText,
  Button,
  FormGroup,
  Input,
  Label,
  Container,
} from "reactstrap";
import CButton from "../components/CButton";
import CFormGroupInput from "../components/CFormGroupInput";

import { jezaApi } from "../api/jezaApi";
import { Producto } from "../models/Producto";
import { useMarcas } from "../hooks/getsHooks/useMarcas";
import { useAreas } from "../hooks/getsHooks/useAreas";
import { useDeptos } from "../hooks/getsHooks/useDeptos";
import { useClases } from "../hooks/getsHooks/useClases";
import { Clase } from "../models/Clase";
import { Departamento } from "../models/Departamento";
import AlertComponent from "../components/AlertComponent";
import { useProveedor } from "../hooks/getsHooks/useProveedor";
import { useUnidadMedida } from "../hooks/getsHooks/useUnidadMedida";

function TabPrueba() {
  const [activeTab, setActiveTab] = useState("1");
  const [filteredDeptos, setFilteredDeptos] = useState([]);
  const [filteredClases, setFilteredClases] = useState([]);
  const [selectedArea, setSelectedArea] = useState(0);
  const [selectedDepto, setSelectedDepto] = useState(0);
  const { dataMarcas } = useMarcas();
  const { dataAreas } = useAreas();
  const { dataDeptos } = useDeptos();
  const { dataClases } = useClases();

  const { dataProveedores } = useProveedor();
  const { dataUnidadMedida } = useUnidadMedida();

  const toggleTab = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (
      name === "inventariable" ||
      name === "controlado" ||
      name === "es_fraccion" ||
      name === "obsoleto" ||
      name === "es_insumo" ||
      name === "es_producto" ||
      name === "es_servicio" ||
      name === "es_kit"
    ) {
      setForm((prevState: Producto) => ({ ...prevState, [name]: checked }));
    } else if (name === "area") {
      setSelectedArea(Number(value));
      console.log({ selectedArea });
      // const selectedArea = value;
      const filteredDepto = dataDeptos.filter((clase) => clase.area === Number(selectedArea));
      setFilteredDeptos(filteredDepto);
      setForm((prevState: Producto) => ({ ...prevState, [name]: value }));
    } else if (name === "depto") {
      setSelectedDepto(Number(value));
      console.log({ selectedDepto });

      // const selectedDepto = value;
      const filteredClase = dataClases.filter((clase) => clase.depto === Number(selectedDepto) && clase.area === Number(selectedArea));
      setFilteredClases(filteredClase);
      setForm((prevState: Producto) => ({ ...prevState, [name]: value }));
    } else {
      setForm((prevState: Producto) => ({ ...prevState, [name]: value }));
    }
    console.log(form);
  };

  const [isChecked, setIsChecked] = useState(false);

  const [form, setForm] = useState<Producto>({
    clave_prod: "",
    descripcion: "",
    descripcion_corta: "",
    sucursal_origen: 0,
    idMarca: 0,
    area: 0,
    depto: 0,
    clase: 0,
    observacion: "",
    inventariable: false,
    controlado: false,
    es_fraccion: false,
    obsoleto: false,
    es_insumo: false,
    es_servicio: false,
    es_producto: false,
    es_kit: false,
    tasa_iva: 18.1,
    tasa_ieps: 19.1,
    costo_unitario: 20.1,
    precio: 21.1,
    unidad_paq: 22,
    unidad_paq_traspaso: 23,
    promocion: false,
    porcentaje_promocion: 25.1,
    precio_promocion: 26.1,
    fecha_inicio: "2023-05-30T18:38:35.7506639-06:00",
    fecha_final: "2023-05-30T18:38:35.7506639-06:00",
    unidad_medida: 29,
    clave_prov: 30,
    tiempo: 31,
    comision: 32.1,
    productoLibre: true,
    fecha_act: "",
    fecha_alta: "",
    id: 0,
    d_area: "",
    d_clase: "",
    d_depto: "",
    d_proveedor: "",
    marca: "",
    d_unidadMedida: "",
  });
  const insertar = async () => {
    try {
      await jezaApi
        .post("/Producto", null, {
          params: {
            clave_prod: form.clave_prod,
            descripcion: form.descripcion,
            descripcion_corta: form.descripcion_corta,
            sucursal_origen: form.sucursal_origen,
            idMarca: Number(form.idMarca),
            area: Number(form.area),
            depto: Number(form.depto),
            clase: Number(form.clase),
            observacion: form.observacion,
            inventariable: form.inventariable,
            // inventariable: true,
            controlado: form.controlado,
            es_fraccion: form.es_fraccion,
            obsoleto: form.obsoleto,
            es_insumo: form.es_insumo,
            es_servicio: form.es_servicio,
            es_producto: form.es_producto,
            es_kit: form.es_kit,
            tasa_iva: Number(form.tasa_ieps),
            tasa_ieps: Number(form.tasa_ieps),
            costo_unitario: Number(form.costo_unitario),
            precio: Number(form.precio),
            unidad_paq: Number(form.unidad_paq),
            unidad_paq_traspaso: Number(form.unidad_paq_traspaso),
            promocion: false,
            porcentaje_promocion: Number(form.porcentaje_promocion),
            precio_promocion: Number(form.precio_promocion),
            // fecha_inicio: "2023-05-30T18:38:35.7506639-06:00",
            // fecha_final: "2023-05-30T18:38:35.7506639-06:00",
            fecha_inicio: form.fecha_inicio,
            fecha_final: form.fecha_final,
            unidad_medida: Number(form.unidad_medida),
            clave_prov: Number(form.clave_prov),
            tiempo: Number(form.tiempo),
            comision: Number(form.comision),
            productoLibre: form.productoLibre,
            fecha_act: "2023-05-30T18:38:35",
            fecha_alta: "2023-05-30T18:38:35",
          },
        })
        .then(() => {
          setVisible(true);
          setTimeout(() => {
            setVisible(false);
          }, 3000);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const onDismiss = () => setVisible(false);

  const [dataDeptosFiltrado, setDataDeptosFiltrado] = useState<Departamento[]>([]);
  const [dataClasesFiltrado, setDataClasesFiltrado] = useState<Clase[]>([]);

  useEffect(() => {
    const quePedo = dataDeptos.filter((data) => data.area === Number(form.area));
    setDataDeptosFiltrado(quePedo);
    console.log({ dataDeptosFiltrado });
  }, [form.area]);

  useEffect(() => {
    const quePedo = dataClases.filter((data) => data.depto === Number(form.depto));
    setDataClasesFiltrado(quePedo);
    console.log({ dataClasesFiltrado });
  }, [form.depto]);
  return (
    <>
      <Nav tabs>
        <NavItem>
          <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
            Datos
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
            Marca producto
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")}>
            Info de Producto
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === "4" ? "active" : ""} onClick={() => toggleTab("4")}>
            Promociones
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <br />
        <TabPane tabId="1">
          <Row>
            <Col>
              <Label>Area</Label>
              <Input type="select" name="area" id="exampleSelect" value={form.area} onChange={handleChange}>
                <option value={0}>-Selecciona Area-</option>
                {dataAreas.map((area) => (
                  <option value={area.area}>{area.descripcion}</option>
                ))}
              </Input>
              <br />
              <Label>Clase</Label>
              <Input type="select" name="clase" id="exampleSelect" value={form.clase} onChange={handleChange}>
                {/* TODO Filtro de clases dep de depto y area */}
                <option value={0}>-Selecciona Clase-</option>
                {dataClasesFiltrado.map((depto: Clase) => (
                  <option value={depto.clase}>{depto.descripcion}</option>
                ))}
              </Input>
              <div style={{ paddingBottom: 25 }}></div>
              <CFormGroupInput handleChange={handleChange} inputName="descripcion" labelName="Descripcion:" value={form.descripcion} />
              <div style={{ paddingBottom: 0 }}></div>
              <CFormGroupInput handleChange={handleChange} inputName="clave_prod" labelName="Clave Producto:" value={form.clave_prod} />
              <CFormGroupInput handleChange={handleChange} inputName="tiempo" labelName="Tiempo:" type="number" />
              <CFormGroupInput handleChange={handleChange} inputName="comision" labelName="Comision:" type="number" />
            </Col>
            <Col>
              <Label>Departamento</Label>
              <Input type="select" name="depto" id="exampleSelect" value={form.depto} onChange={handleChange}>
                <option value={0}>-Selecciona departamento-</option>
                {dataDeptosFiltrado.map((depto: Departamento) => (
                  <option value={depto.depto}>{depto.descripcion}</option>
                ))}
              </Input>
              <br />
              <Label>Marca</Label>
              <Input type="select" name="idMarca" id="exampleSelect" value={form.idMarca} onChange={handleChange}>
                <option value={0}>-Selecciona Marca-</option>
                {dataMarcas.map((marca) => (
                  <option value={marca.id}>{marca.marca}</option>
                ))}
              </Input>
              <br />
              <Label>Proveedor</Label>
              <Input type="select" name="clave_prov" id="exampleSelect" value={form.clave_prov} onChange={handleChange} style={{ marginBottom: 17 }}>
                <option value={0}>--Selecciona el proveedor--</option>
                {dataProveedores.map((proveedor) => (
                  <option value={proveedor.id}>{proveedor.nombre}</option>
                ))}
              </Input>
              <CFormGroupInput
                handleChange={handleChange}
                inputName="descripcion_corta"
                labelName="Descripcion_corta:"
                value={form.descripcion_corta}
              />
              <CFormGroupInput handleChange={handleChange} inputName="observacion" labelName="Observacion:" value={form.observacion} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <br />
          <Row>
            <Col sm="6">
              <label className="checkbox-container">
                <input type="checkbox" onChange={handleChange} name="inventariable" checked={form.inventariable} />
                <span className="checkmark"></span>
                ¿Inventariable?
              </label>
              <br />
              <br />
              <label className="checkbox-container">
                <input type="checkbox" checked={form.controlado} onChange={handleChange} name="controlado" />
                <span className="checkmark"></span>
                Controlado
              </label>
              <br />
              <br />
              <label className="checkbox-container">
                <input type="checkbox" checked={form.es_producto} onChange={handleChange} name="es_producto" />
                <span className="checkmark"></span>
                ¿Es producto?
              </label>
              <br />
              <br />
              <label className="checkbox-container">
                <input type="checkbox" checked={form.es_servicio} onChange={handleChange} name="es_servicio" />
                <span className="checkmark"></span>
                ¿Es servicio?
              </label>
            </Col>
            <Col sm="6">
              <label className="checkbox-container">
                <input type="checkbox" onChange={handleChange} name="es_fraccion" checked={form.es_fraccion} />
                <span className="checkmark"></span>
                ¿Es fracción?
              </label>
              <br />
              <br />
              <label className="checkbox-container">
                <input type="checkbox" onChange={handleChange} name="obsoleto" checked={form.obsoleto} />
                <span className="checkmark"></span>
                Obsoleto
              </label>
              <br />
              <br />
              <label className="checkbox-container">
                <input type="checkbox" onChange={handleChange} name="es_insumo" checked={form.es_insumo} />
                <span className="checkmark"></span>
                ¿Es insumo?
              </label>
              <br />
              <br />
              <label className="checkbox-container">
                <input type="checkbox" checked={form.es_kit} onChange={handleChange} name="es_kit" />
                <span className="checkmark"></span>
                ¿Es kit?
              </label>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <br />
          <Row>
            <Col sm="6">
              <CFormGroupInput type="number" handleChange={handleChange} inputName="tasa_iva" labelName="Tasa iva:" />
              <CFormGroupInput type="number" handleChange={handleChange} inputName="costo_unitario" labelName="Costo unitario:" />
              <Label>Unidad de medida:</Label>
              <Input
                type="select"
                name="unidad_medida"
                id="unidad_medida"
                value={form.unidad_medida}
                onChange={handleChange}
                style={{ marginBottom: 17 }}
              >
                <option value={0}>--Selecciona la unidad de medida--</option>
                {dataUnidadMedida.map((medida) => (
                  <option value={medida.id}>{medida.descripcion}</option>
                ))}
              </Input>
            </Col>
            <Col sm="6">
              <CFormGroupInput type="number" handleChange={handleChange} inputName="tasa_ieps" labelName="Tasa ieps:" />
              <CFormGroupInput type="number" handleChange={handleChange} inputName="precio" labelName="Precio:" />
              <CFormGroupInput type="number" handleChange={handleChange} inputName="unidad_paq" labelName="Unidad de paquete:" />
              <CFormGroupInput type="number" handleChange={handleChange} inputName="unidad_paq_traspaso" labelName="Unidad paquete traspaso:" />
            </Col>
          </Row>
          <br />
        </TabPane>
        <TabPane tabId="4">
          <br />
          <Container>
            <Row>
              <Col sm="6">
                <CFormGroupInput type="number" handleChange={handleChange} inputName="precio_promocion" labelName="Precio Promocion:" />
                <CFormGroupInput type="number" handleChange={handleChange} inputName="porcentaje_promocion" labelName="Porcentaje promocion:" />
                <label className="checkbox-container">
                  <input type="checkbox" checked={form.promocion} onChange={handleChange} name="promocion" />
                  <span className="checkmark"></span>
                  ¿Es promocion?
                </label>
              </Col>
              <Col sm="6">
                <Label> Fecha Inicio </Label>
                <Input
                  style={{ marginBottom: 15 }}
                  type="datetime-local"
                  onChange={handleChange}
                  name="fecha_inicio"
                  defaultValue={form.fecha_inicio}
                />
                <Label> Fecha Final </Label>
                <Input type="datetime-local" onChange={handleChange} name="fecha_final" defaultValue={form.fecha_final} />
                {/* <CFormGroupInput handleChange={handleChange} inputName="fecha_inicio" labelName="Fecha inicio:" value={form.fecha_inicio} />
                        <CFormGroupInput handleChange={handleChange} inputName="fecha_final" labelName="Fecha final:" value={form.fecha_final} /> */}
              </Col>
            </Row>
          </Container>
        </TabPane>
        {/* <TabPane tabId="5">
                  <h3>Info de proveedor</h3>
                  <br />
                  <Container>
                    <Row>
                      <Col sm="6">
                        <CFormGroupInput handleChange={handleChange} inputName="porcentaje_promocion" labelName="Porcentaje promocion:" value={form.porcentaje_promocion} />
                        </Col>
                      <Col sm="6">
                        <label>
                          <input type="checkbox" checked={form.productoLibre} onChange={handleChange} name="productoLibre" />
                          ¿Producto Libre?
                        </label>
                      </Col>
                    </Row>
                  </Container>
                </TabPane> */}
        <br />
        <br />
        <Button onClick={insertar}> Guardar</Button>
        <br />
        <AlertComponent error={error} onDismiss={onDismiss} visible={visible} />
      </TabContent>
    </>
  );
}

export default TabPrueba;
