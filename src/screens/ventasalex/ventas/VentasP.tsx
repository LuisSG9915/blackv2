import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import useModalHook from "../../hooks/useModalHook";

import { eliminarMedico } from "../../services/home";
import TableVentas from "./Components/TableVentas";
import CButton from "../../components/CButton";
import TableEstilistas from "./Components/TableEstilistas";
import { useGentlemanContext } from "./context/VentasContext";
import TableProductos from "./Components/TableProductos";
import TableClientesProceso from "./Components/TableClientesProceso";
import TableCliente from "./Components/TableCliente";
import ModalActualizarLayout from "../../layout/ModalActualizarLayout";
import { useClientes } from "../../hooks/getsHooks/useClientes";
import { useNominaTrabajadores } from "../../hooks/getsHooks/useNominaTrabajadores";
import { jezaApi } from "../../api/jezaApi";
import { Usuario } from "../../models/Usuario";
import { Venta } from "../../models/Venta";

const VentasP = () => {
  const { modalActualizar, setModalActualizar, cerrarModalActualizar } = useModalHook();
  const [modalOpenVenta, setModalOpen] = useState<boolean>(false);
  const [modalOpen2, setModalOpen2] = useState<boolean>(false);
  const [modalOpen3, setModalOpen3] = useState<boolean>(false);
  const [modalOpenPago, setModalOpenPago] = useState<boolean>(false);
  const [modalClientesProceso, setModalClientesProceso] = useState<boolean>(false);
  const [modalCliente, setModalCliente] = useState<boolean>(false);

  const [total, setTotal] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  const [dataUsuarios, setDataUsuarios] = useState<Usuario[]>([]);

  const { dataClientes } = useClientes();
  const { dataTrabajadores } = useNominaTrabajadores();
  const [form, setForm] = useState<Usuario[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setForm(parsedItem);
    }
  }, []);
  const onDismiss = () => {
    setVisible(false);
  };

  const datosInicialesArreglo = [
    {
      id: 4,
      Cia: 2,
      Sucursal: 1,
      Fecha: "2023-06-13T00:00:00",
      Caja: 1,
      No_venta: 0,
      no_venta2: 0,
      Clave_prod: 5425,
      Cant_producto: 1,
      idEstilista: 0,
      Precio: 100.0,
      Cve_cliente: 6,
      Tasa_iva: 0.16,
      Observacion: "x",
      Descuento: 0.0,
      Clave_Descuento: 0,
      User: 55,
      Corte: 1,
      Corte_parcial: 1,
      Costo: 1.0,
      Precio_base: 100.0,
      No_venta_original: 0,
      cancelada: false,
      folio_estilista: 0,
      // hora: "2023-06-13T00:00:00",
      hora: 8,
      tiempo: 0,
      terminado: false,
      validadoServicio: false,
      ieps: 0,
      Usuario: 0,
      Credito: false,
    },
  ];

  const [data, setdata] = useState<Venta[]>([]);
  useEffect(() => {
    setdata(datosInicialesArreglo);
  }, []);

  const TableDataHeader = ["Estilista", "Producto/Servicio", "Hora", "Tiempo", "Cantidad", "Precio", "Acciones"];

  const mostrarModalActualizar = (dato: Venta) => {
    setModalActualizar(true);
    console.log({ dato });
  };

  const cambios = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "hora") {
      const partesHora = value.split(":");
      const hora = parseInt(partesHora[0], 10); // Convertir la parte de la hora a entero
      const minutos = parseInt(partesHora[1], 10); // Convertir la parte de los minutos a entero
      let horaInt = hora + minutos / 60; // Calcular el valor entero de la hora con fracciones de minut
      setDataTemporal((prev) => ({ ...prev, [name]: horaInt }));
    } else {
      setDataTemporal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const { data: dataTemporal, setData: setDataTemporal, selectedID, dataVentasProcesos } = useGentlemanContext();

  const generarOpcionesDeTiempo = () => {
    const opciones = [];
    for (let hora = 8; hora < 20; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horaFormateada = hora.toString().padStart(2, "0");
        const minutoFormateado = minuto.toString().padStart(2, "0");
        const tiempo = `${horaFormateada}:${minutoFormateado}`;
        opciones.push(
          <option key={tiempo} value={tiempo}>
            {tiempo}
          </option>
        );
      }
    }
    return opciones;
  };

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      setDataUsuarios(parsedItem);
    }
  }, []);
  const insertar = async () => {
    const today = new Date();
    const usuario = dataUsuarios[0];
    try {
      await jezaApi
        .post("/Venta", null, {
          params: {
            id: 0,
            Cia: 2,
            Sucursal: 1,
            Fecha: today,
            Caja: 1,
            No_venta: 0,
            no_venta2: 0,
            Clave_prod: dataTemporal.Clave_prod,
            Cant_producto: dataTemporal.Cant_producto,
            Precio: dataTemporal.Precio,
            Cve_cliente: dataTemporal.Cve_cliente,
            Tasa_iva: "0.16",
            Observacion: "x",
            Descuento: 0,
            Clave_Descuento: 0,
            usuario: form[0].id,
            Corte: 1,
            Corte_parcial: 1,
            Costo: 1,
            Precio_base: dataTemporal.Precio,
            No_venta_original: 0,
            cancelada: false,
            folio_estilista: 0,
            hora: "2023-06-13",
            tiempo: dataTemporal.tiempo,
            terminado: false,
            validadoServicio: false,
            ieps: "0",
            Credito: false,
            idEstilista: dataTemporal.idEstilista,
          },
        })
        .then(() => {
          console.log("realizado");
          setVisible(true);
          setTimeout(() => {
            setVisible(false);
          }, 3000);
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        <h1>Venta {selectedID} </h1>
        <br />
        <Row>
          <Col md={"2"}>
            <Label>Fecha de venta</Label>
            <Input disabled defaultValue={"26/05/2023"}></Input>
          </Col>
          <Col md={"2"}>
            <Label>Sucursal</Label>
            {/* <Input disabled defaultValue={2}></Input> */}
            <Input disabled defaultValue={"BARRIO"}></Input>
          </Col>
          <Col md={"8"}>
            <Row className="align-items-end">
              <Col md={"10"}>
                <Label>Cliente</Label>
                <Input disabled defaultValue={dataTemporal.cliente ? dataTemporal.cliente : ""} onChange={cambios} name={"cve_cliente"} />
              </Col>
              <Col md={"2"}>
                <Button onClick={() => setModalCliente(true)}>Elegir</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <br />
        <div className=" d-flex justify-content-end px-5">
          <Button
            color="secondary"
            onClick={() => {
              if (dataTemporal.cliente) {
                setModalOpen(true);
              } else {
                alert("Ingrese un cliente");
                console.log("a");
              }
            }}
          >
            Agregar Venta o servicio
          </Button>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <TableVentas TableDataHeader={TableDataHeader} data={data} mostrarModalActualizar={mostrarModalActualizar} eliminar={eliminarMedico} />

        <br />
        <br />
        <div className="d-flex  justify-content-end">
          {/* <Button
            onClick={() => {
              const nuevoData = data.slice(1);
              console.log({ nuevoData });
            }}
          >
            a
          </Button> */}
          <Button
            style={{ marginRight: 25 }}
            color="success"
            onClick={() => {
              setModalOpenPago(true);
              setTotal(data.reduce((total, objeto) => total + (objeto.Precio ?? 0), 0));
            }}
          >
            Pago
          </Button>
          <Button
            style={{ marginRight: 25 }}
            color="primary"
            onClick={() => {
              setVisible(true);
              setTimeout(() => {
                setVisible(false);
              }, 5000);
              setTotal(data.reduce((total, objeto) => total + (objeto.Precio ?? 0), 0));
            }}
          >
            Guardar
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setModalClientesProceso(true);
              setTotal(data.reduce((total, objeto) => total + (objeto.Precio ?? 0), 0));
            }}
          >
            Clientes en proceso
          </Button>
        </div>
      </Container>

      <Alert style={{ width: 400, marginLeft: 20 }} color="success" isOpen={visible} toggle={onDismiss}>
        Venta registrada con éxito
      </Alert>

      <Modal isOpen={modalOpenVenta} size="lg">
        <ModalHeader>
          <div>
            <h3>Venta</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <Label>Producto/servicio</Label>
          <Row>
            <Col>
              <Input defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} />
            </Col>
            <Col md={2}>
              <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
            </Col>
          </Row>
          <br />
          <Label>Estilista</Label>
          <Row>
            <Col>
              <Input defaultValue={dataTemporal.estilista ? dataTemporal.estilista : ""} />
            </Col>
            <Col md={2}>
              <Button onClick={() => setModalOpen2(true)}>Elegir</Button>
            </Col>
          </Row>
          <br />
          <Label>Cantidad</Label>
          <Input placeholder="Cantidad" onChange={cambios} name="Cant_producto" defaultValue={1} />
          <br />
          <Label style={{ marginRight: 10 }}>Hora de servicio</Label>
          <select id="hora" name="hora" onChange={cambios} value={dataTemporal.hora}>
            {generarOpcionesDeTiempo()}
          </select>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpen(false);
            }}
            text="Salir"
          />
          <CButton
            color="primary"
            onClick={() => {
              setModalOpen(false);
              if (dataTemporal.producto) {
                setdata([...data, dataTemporal]);
                insertar();
                setDataTemporal((prevData) => ({
                  cliente: prevData.cliente,
                  ...datosInicialesArreglo[0],
                }));
              }
            }}
            text="Agregar"
          />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen2} size="md">
        <ModalHeader>
          <TableEstilistas data={dataTrabajadores} setModalOpen2={setModalOpen2}></TableEstilistas>
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpen2(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen3} size="md">
        <ModalHeader>
          <TableProductos data={data} setModalOpen2={setModalOpen3}></TableProductos>
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalOpen3(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalClientesProceso} size="md">
        <ModalHeader> Clientes en proceso </ModalHeader>
        <ModalBody>
          <TableClientesProceso data={data} setModalOpen2={setModalClientesProceso}></TableClientesProceso>
        </ModalBody>
        <ModalFooter>
          <CButton color="danger" onClick={() => setModalClientesProceso(false)} text="Salir" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalCliente} size="md">
        <ModalHeader> Cliente </ModalHeader>
        <ModalBody>
          <TableCliente data={dataClientes} setModalCliente={setModalCliente}></TableCliente>
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalCliente(false);
            }}
            text="Salir"
          />
        </ModalFooter>
      </Modal>

      <ModalActualizarLayout
        modalActualizar={modalActualizar}
        editar={() => {
          setModalActualizar(false);
        }}
        cerrarModalActualizar={cerrarModalActualizar}
        form={dataTemporal}
        nombreActualizar="Editar venta / servicio"
      >
        <Label>Cliente</Label>
        <Input disabled defaultValue={dataTemporal.cliente ? dataTemporal.cliente : ""} onChange={cambios} name={"cve_cliente"} />
        <Label>Producto/servicio</Label>
        <Row>
          <Col>
            <Input defaultValue={dataTemporal.producto ? dataTemporal.producto : ""} />
          </Col>
          <Col md={2}>
            <Button onClick={() => setModalOpen3(true)}>Elegir</Button>
          </Col>
        </Row>
        <br />
        <Label>Estilista</Label>
        <Row>
          <Col>
            <Input defaultValue={dataTemporal.estilista ? dataTemporal.estilista : ""} />
          </Col>
          <Col md={2}>
            <Button onClick={() => setModalOpen2(true)}>Elegir</Button>
          </Col>
        </Row>
        <br />
        <Label>Cantidad</Label>
        <Input placeholder="Cantidad" onChange={cambios} name="Cant_producto" defaultValue={1} />
        <br />
        <Label style={{ marginRight: 10 }}>Hora de servicio</Label>
        <select id="hora" name="hora" onChange={cambios} value={dataTemporal.hora}>
          {generarOpcionesDeTiempo()}
        </select>
      </ModalActualizarLayout>

      <Modal isOpen={modalOpenPago} size="md">
        <ModalHeader>Pago total: {total}</ModalHeader>
        <ModalBody>
          <Label>Pago En Efectivo</Label>
          <Input></Input>
          <br />
          <Label>Pago En Tarjeta de Credito</Label>
          <Input></Input>
          <br />
          <Label>Pago En Efectivo</Label>
          <Input></Input>
          <br />
        </ModalBody>
        <ModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              setModalOpenPago(false);
              console.log({ data });
            }}
            text="Salir"
          />
          <CButton color="success" onClick={() => setModalOpenPago(false)} text="Pago" />
        </ModalFooter>
      </Modal>
    </>
  );
};

export default VentasP;
