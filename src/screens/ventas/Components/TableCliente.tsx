// import React, { useState } from "react";
// import { Button, Col, Input, Label, Row, Table } from "reactstrap";
// import { useGentlemanContext } from "../context/VentasContext";
// import { Cliente } from "../../../models/Cliente";
// import { useClientes } from "../../../hooks/getsHooks/useClientes";
// import { GrAdd } from "react-icons/gr";
// interface Venta {
//   id?: number;
//   estilista: string;
//   producto: string;
//   cantidad: number;
//   precio: number;
//   tasaIva: number;
//   tiempo: number;
// }
// interface Props {
//   data: Cliente[];
//   setModalCliente: React.Dispatch<React.SetStateAction<boolean>>;
// }
// export interface Clientes {
//   id: number;
//   estilista: string;
// }
// const TableCliente = ({ data, setModalCliente }: Props) => {
//   const { dataClientes, fetchClientes, setDataClientes } = useClientes();
//   const TableDataHeader = ["ID", "Clientes"];

//   const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();

//   const handle = (dato: Cliente) => {
//     setModalCliente(false);
//     setDataTemporal({ ...dataTemporal, cliente: dato.nombre, Cve_cliente: dato.id_cliente });
//   };
//   const [filtroCliente, setFiltroCliente] = useState("");

//   const filtroClientes = (datoMedico: string) => {
//     var resultado = dataClientes.filter((elemento: Cliente) => {
//       // Aplica la lógica del filtro solo si hay valores en los inputs
//       if (
//         (datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) &&
//         elemento.nombre.length > 2
//       ) {
//         return elemento;
//       }
//       console.log("a");
//     });
//     setDataClientes(resultado);
//   };
//   const handleOpenNewWindowCreateCita = () => {
//     const url = "http://cbinfo.no-ip.info:9088/ClienteCrear"; // Reemplaza esto con la URL que desees abrir
//     const width = 500;
//     const height = 1500;
//     const left = (window.screen.width - width) / 2;
//     const top = (window.screen.height - height) / 2;

//     const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;

//     // Abrir la ventana emergente
//     window.open(url, "_blank", features);
//   };
//   return (
//     <>
//       <Label>Cliente: </Label>
//       <div className="position-relative float-right" style={{ marginRight: "20px", marginBottom: "20px" }}>
//         <GrAdd className="" size={30} onClick={() => handleOpenNewWindowCreateCita()} />
//       </div>

//       <Row>
//         <Col md={"8"}>
//           <Input
//             onChange={(e) => {
//               setFiltroCliente(e.target.value);
//               if (e.target.value === "") {
//                 fetchClientes();
//               }
//             }}
//           ></Input>{" "}
//         </Col>
//         <Col md={"2"}>
//           <Button onClick={() => filtroClientes(filtroCliente)}>Filtro</Button>
//         </Col>
//       </Row>
//       <br />
//       <br />
//       <Table size="sm" striped={true} responsive={"sm"}>
//         <thead>
//           <tr>
//             {TableDataHeader.map((valor: any) => (
//               <th key={valor}>{valor}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {dataClientes.map((dato: Cliente, index) => (
//             <tr key={index}>
//               <td>{dato.nombre}</td>
//               <td> {<Button onClick={() => handle(dato)}>Seleccionar</Button>} </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </>
//   );
// };

// export default TableCliente;

import React, { useState, useMemo } from "react";
import { Button, Card, CardBody, CardText, CardTitle, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { GrAdd } from "react-icons/gr";
import { MaterialReactTable, MRT_ColumnDef, MRT_FullScreenToggleButton, MRT_ToggleDensePaddingButton } from "material-react-table";
import { useGentlemanContext } from "../context/VentasContext";
import { Cliente } from "../../../models/Cliente";
import { useClientes } from "../../../hooks/getsHooks/useClientes";
import { Box } from "@mui/material";
import CButton from "../../../components/CButton";
import Swal from "sweetalert2";
import { jezaApi } from "../../../api/jezaApi";
import useSeguridad from "../../../hooks/getsHooks/useSeguridad";
import { Venta } from "../../../models/Venta";
// interface Venta {
//   id?: number;
//   estilista: string;
//   producto: string;
//   cantidad: number;
//   precio: number;
//   tasaIva: number;
//   tiempo: number;
// }

interface Props {
  data: Cliente[];
  setModalCliente: React.Dispatch<React.SetStateAction<boolean>>;
  dataTemporal: Venta;
  setDataTemporal: React.Dispatch<React.SetStateAction<Venta>>;
}

const TableCliente = ({ data, setModalCliente, dataTemporal, setDataTemporal }: Props) => {
  const { dataClientes, fetchClientes, setDataClientes } = useClientes();
  // const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();
  const [filtroCliente, setFiltroCliente] = useState("");

  const TableDataHeader = ["First Name", "Last Name", "Actions"]; // Add "Actions" column header

  const handle = (dato: Cliente) => {
    setModalCliente(false);
    setDataTemporal({
      ...dataTemporal,
      cliente: dato.nombre,
      Cve_cliente: dato.id_cliente,
    });
  };

  const [datah, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModalHistorial = () => {
    setModalOpen(!modalOpen);
  };

  const historial = (dato: Cliente) => {
    jezaApi.get(`/Historial?cliente=${dato.id_cliente}`).then((response) => {
      setData(response.data);
      toggleModalHistorial(); // Abrir o cerrar el modal cuando los datos se hayan cargado
    });
  };

  const filtroClientes = (datoMedico: string) => {
    var resultado = dataClientes.filter((elemento: Cliente) => {
      if ((datoMedico === "" || elemento.nombre.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.nombre.length > 2) {
        return elemento;
      }
    });
    setDataClientes(resultado);
  };

  const handleOpenNewWindowCreateCita = () => {
    // ... (unchanged)
  };

  const dataClientesConAcciones = useMemo(
    () =>
      dataClientes.map((dato: Cliente) => ({
        ...dato,
        acciones: (
          <>
            <Button size="sm" onClick={() => handle(dato)}>
              Seleccionar
            </Button>{" "}
          </>
        ),
      })),
    [dataClientes]
  );

  const columns = useMemo<MRT_ColumnDef<Cliente>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre",
        flex: 10,
      },

      {
        accessorKey: "acciones",
        header: "Acciones",
        flex: 1,
      },
    ],
    []
  );
  // modal para crear
  const { filtroSeguridad, session } = useSeguridad();
  const [modalCreate, setModalCreate] = useState(false);
  const [form, setForm] = useState<Cliente>({
    id_cliente: 0,
    nombre: "",
    domicilio: "",
    ciudad: "",
    estado: "",
    colonia: "",
    cp: "",
    rfc: "",
    telefono: "",
    email: "",
    nombre_fiscal: "",
    suspendido: false,
    sucursal_origen: 0,
    num_plastico: "",
    suc_asig_plast: 0,
    fecha_asig_plast: "",
    usr_asig_plast: "",
    plastico_activo: false,
    fecha_nac: "",
    correo_factura: "",
    regimenFiscal: "",
    claveRegistroMovil: "",
    fecha_alta: "",
    fecha_act: "",
  });
  const toggleCreateModal = () => {
    setForm({
      // Restablecer el estado del formulario
      id_cliente: 0,
      nombre: "",
      domicilio: "",
      ciudad: "",
      estado: "",
      colonia: "",
      cp: "",
      rfc: "",
      telefono: "",
      email: "",
      nombre_fiscal: "",
      suspendido: false,
      sucursal_origen: 0,
      num_plastico: "",
      suc_asig_plast: 0,
      fecha_asig_plast: "",
      usr_asig_plast: "",
      plastico_activo: false,
      fecha_nac: "",
      correo_factura: "",
      regimenFiscal: "",
      claveRegistroMovil: "",
      fecha_alta: "",
      fecha_act: "",
    });
    setModalCreate(!modalCreate);
  };
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);
  const validarCampos = () => {
    const camposRequeridos: (keyof Cliente)[] = ["nombre", "domicilio", "ciudad", "estado", "colonia", "cp", "telefono", "email", "fecha_nac"];
    const camposVacios: string[] = [];

    camposRequeridos.forEach((campo: keyof Cliente) => {
      const fieldValue = form[campo];
      if (!fieldValue || String(fieldValue).trim() === "") {
        camposVacios.push(campo);
      }
    });

    setCamposFaltantes(camposVacios);

    if (camposVacios.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: `Los siguientes campos son requeridos: ${camposVacios.join(", ")}`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    }
    return camposVacios.length === 0;
  };
  // const [data, setData] = useState<Cliente[]>([]);
  const insertCliente = async () => {
    /* CREATE */
    const permiso = await filtroSeguridad("CAT_CLIENT_ADD");
    if (permiso === false) {
      return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    }
    console.log(validarCampos());
    console.log({ form });
    if (validarCampos() === true) {
      await jezaApi
        .post(
          `/Cliente?nombre=${form.nombre}&domicilio=${form.domicilio}&ciudad=${form.ciudad}&estado=${form.estado}&colonia=${form.colonia}&cp=${form.cp}&telefono=${form.telefono}&email=${form.email}&fecha_nac=${form.fecha_nac}`
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Cliente creado con éxito",
            confirmButtonColor: "#3085d6",
          });
          toggleCreateModal(); // Cerrar modal después de guardar

          setModalCliente(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const cHistorial = useMemo<MRT_ColumnDef<Cliente>[]>(
    () => [
      {
        accessorKey: "NumVenta",
        header: "NumVenta",
        flex: 1,
      },
      {
        accessorKey: "NombreSuc",
        header: "Sucursal",
        flex: 1,
      },
      {
        accessorKey: "Fecha",
        header: "Fecha",
        flex: 1,
      },
      {
        accessorKey: "Clave",
        header: "Clave",
        flex: 1,
      },
      {
        accessorKey: "Producto_Servicio",
        header: "Producto/Servicio",
        flex: 1,
      },
      {
        accessorKey: "Cantidad",
        header: "Cantidad",
        flex: 1,
      },
      {
        accessorKey: "Precio",
        header: "Precio",
        flex: 1,
      },
      {
        accessorKey: "Estilista",
        header: "Estilista",
        flex: 1,
      },
      {
        accessorKey: "Descuento",
        header: "Descuento",
        flex: 1,
      },
      {
        accessorKey: "Forma_pago",
        header: "Forma de pago",
        flex: 1,
      },
    ],
    []
  );

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={dataClientesConAcciones}
        initialState={{
          pagination: {
            pageSize: 5,
            pageIndex: 0,
          },
          density: "compact",
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                toggleCreateModal();
              }}
              variant="contained"
            >
              Agregar cliente +
            </Button>
          </Box>
        )}

        //customize built-in buttons in the top-right of top toolbar
      >
        <thead>
          <tr>
            {TableDataHeader.map((valor: any) => (
              <th key={valor}>{valor}</th>
            ))}
          </tr>
        </thead>
        <tbody>{/* Data is now rendered within the MaterialReactTable */}</tbody>
      </MaterialReactTable>
      <Modal isOpen={modalCreate} toggle={toggleCreateModal} size="lg">
        <ModalHeader toggle={toggleCreateModal}>Registro</ModalHeader>
        <ModalBody>
          {/* parte */}
          <div className="row">
            <div className="col-md-6">
              <Label>Nombre</Label>
              <Input type="text" name={"nombre"} onChange={(e) => setForm({ ...form, nombre: String(e.target.value) })} defaultValue={form.nombre} />
              <Label>Domicilio:</Label>
              <Input
                type="text"
                name={"domicilio"}
                onChange={(e) => setForm({ ...form, domicilio: String(e.target.value) })}
                defaultValue={form.domicilio}
              />
              <Label>Ciudad:</Label>
              <Input type="text" name={"ciudad"} onChange={(e) => setForm({ ...form, ciudad: String(e.target.value) })} defaultValue={form.ciudad} />
              <Label>Estado:</Label>
              <Input type="text" name={"Estado"} onChange={(e) => setForm({ ...form, estado: String(e.target.value) })} defaultValue={form.estado} />
            </div>
            <div className="col-md-6">
              <Label>Colonia:</Label>
              <Input
                type="text"
                name={"colonia"}
                onChange={(e) => setForm({ ...form, colonia: String(e.target.value) })}
                defaultValue={form.colonia}
              />
              <Label>Código postal:</Label>
              <Input type="text" name={"cp"} onChange={(e) => setForm({ ...form, cp: String(e.target.value) })} defaultValue={form.cp} />
              <Label>Teléfono:</Label>
              <Input
                type="text"
                name={"telefono"}
                onChange={(e) => setForm({ ...form, telefono: String(e.target.value) })}
                defaultValue={form.telefono}
              />
              <Label>E-mail:</Label>
              <Input type="email" name={"email"} onChange={(e) => setForm({ ...form, email: String(e.target.value) })} defaultValue={form.email} />
              <Label>Fecha de nacimiento:</Label>
              <Input
                type="date"
                name={"fecha_nac"}
                onChange={(e) => setForm({ ...form, fecha_nac: String(e.target.value) })}
                defaultValue={form.fecha_nac}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={insertCliente} text="Guardar"></CButton>{" "}
          <CButton color="danger" onClick={toggleCreateModal} text="Cancelar"></CButton>
        </ModalFooter>
      </Modal>
      {/* modal historial */}
      <Modal isOpen={modalOpen} toggle={toggleModalHistorial} size="lg">
        <ModalHeader toggle={toggleModalHistorial}>Historial</ModalHeader>
        <ModalBody>
          <MaterialReactTable
            columns={cHistorial}
            data={datah}
            initialState={{
              pagination: {
                pageSize: 5,
                pageIndex: 0,
              },
              density: "compact",
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModalHistorial}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
      
    </>
  );
};

export default TableCliente;
