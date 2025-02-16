import React, { useEffect, useMemo, useState } from "react";
import { Button, Input } from "reactstrap";
import { jezaApi } from "../../../api/jezaApi";
import Swal from "sweetalert2";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { useUnidadMedida } from "../../../hooks/getsHooks/useUnidadMedida";
import { UnidadMedidaModel } from "../../../models/UnidadMedidaModel";
import { VentaInsumo } from "../../../models/VentaInsumo";
import { AiOutlineBarcode } from "react-icons/ai";
import useSeguridad from "../../../hooks/getsHooks/useSeguridad";
import { Box } from "@mui/material";
import { InsumoExistencia } from "./TableProductos";

interface Props {
  data: Estilistas[];
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  datoVentaSeleccionado2: any;
  handleGetFetch: any;
  datoInsumosProducto: InsumoExistencia[];
  datoInsumosProductoSolicitud?: VentaInsumo[];
}
export interface Estilistas {
  id: number;
  estilista: string;
}
const TableInsumos = ({ data, setModalOpen2, datoVentaSeleccionado2, handleGetFetch, datoInsumosProducto, datoInsumosProductoSolicitud }: Props) => {
  const [form, setForm] = useState({
    marca: "",
    cantidad: "",
    id_insumo: 0,
  });


  const { filtroSeguridad, session } = useSeguridad();

  const createInsumoSoli = async (updatedForm: { id_insumo: number; marca: string; cantidad: string }) => {
    // const permiso = await filtroSeguridad("AGREGAR_INSUMO_SOLICITADO");

    // if (permiso === false) {
    //   return; // Si el permiso es falso o los campos no son válidos, se sale de la función
    // }
    jezaApi
      .post("/VentaInsumoSolicitud", null, {
        params: {
          id_venta: datoVentaSeleccionado2,
          id_insumo: Number(updatedForm.id_insumo),
          cantidad: Number(updatedForm.cantidad),
        },
      })
      .then((re) =>
        Swal.fire({
          icon: "success",
          text: "Insumo solicitado con éxito",
          confirmButtonColor: "#3085d6",
        })
      )
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    handleGetFetch();
    console.log(datoInsumosProducto);
  }, [datoVentaSeleccionado2]);

  const handleInsumoSelectionORI = async (id: InsumoExistencia) => {

    // Mostrar el SweetAlert para obtener la cantidad
    // AQUI PONGO MI CONDICIONAL datoInsumosProducto

    const validarInsumoProducto = datoInsumosProductoSolicitud?.some((elemento: VentaInsumo) => elemento.id_insumo === Number(id.id));
    if (validarInsumoProducto) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Insumo repetido, favor de verificar`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    } else {
      Swal.fire({
        title: "Ingrese la cantidad:",
        input: "number",
        inputAttributes: {
          min: "0.01", // Establece un valor mínimo para el input (por ejemplo, 0.01 para permitir decimales)
          step: "0.01", // Define los pasos para incrementar/decrementar el valor (por ejemplo, 0.01 para decimales)
        },
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: (cantidad) => {
          if (cantidad) {
            return new Promise((resolve, reject) => {
              // Realizar cualquier validación adicional aquí si es necesario
              const cantidadNumber = parseFloat(cantidad);
              if (
                isNaN(cantidadNumber) ||
                cantidadNumber <= 0 ||
                cantidad === "" || // Check for an empty string
                cantidadNumber == undefined ||
                cantidad.toString() == ""
              ) {
                reject("La cantidad debe ser mayor a cero y no puede estar vacía.");
              } else {
                resolve(cantidadNumber);
              }
            });
          } else {
            !Swal.isLoading();
            return;
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          const cantidad = result.value as number;
          // Realiza aquí la lógica para guardar la cantidad seleccionada
          if (cantidad > id.existencia) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Insumo no tiene existencia para cubrir`,
              confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
            });
            return;
          } else if (!cantidad) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Digite un numero`,
              confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
            });
            return;
          } else {
            setForm((prevState) => {
              const updatedForm = { ...prevState, id_insumo: id.id, cantidad };
              createInsumoSoli(updatedForm);
              return updatedForm;
            });
            setModalOpen2(false);

            setTimeout(() => {
              handleGetFetch();
            }, 1600);
          }
        }
      });
    }
  };


  const handleInsumoSelection = async (id: InsumoExistencia) => {

 // Verificar si ya existe en datoInsumosProductoSolicitud
 const validarInsumoProducto = datoInsumosProductoSolicitud?.some(
  (elemento: VentaInsumo) => elemento.id_insumo === Number(id.id)
);
if (validarInsumoProducto) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `Insumo repetido, favor de verificar`,
    confirmButtonColor: "#3085d6",
  });
  return;
}

    // Mostrar alerta para ingresar la cantidad
    Swal.fire({
      title: "Ingrese la cantidad:",
      input: "number",
      inputAttributes: {
        min: "0.01",
        step: "0.01", // Para permitir decimales
      },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (cantidad) => {
        const cantidadNumber = parseFloat(cantidad);
        return new Promise((resolve, reject) => {
          // Validaciones para cantidad
          if (!cantidad || isNaN(cantidadNumber) || cantidadNumber <= 0) {
            reject("La cantidad debe ser mayor a cero y no puede estar vacía.");
          } else {
            resolve(cantidadNumber);
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const cantidad = result.value as number;

        // Verificar si la cantidad excede la existencia
        if (cantidad > id.existencia) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Insumo no tiene existencia para cubrir`,
            confirmButtonColor: "#3085d6",
          });
        } else {
          // Guardar insumo
          setForm((prevState) => {
            const updatedForm = { ...prevState, id_insumo: id.id, cantidad };
            createInsumoSoli(updatedForm);
            return updatedForm;
          });
          setModalOpen2(false);

          // Refrescar datos después de guardar
          setTimeout(() => {
            handleGetFetch();
          }, 1600);
        }
      }
    });
  };


  const { dataUnidadMedida } = useUnidadMedida();
  const getCiaForeignKey = (idTableCia: number) => {
    const cia = dataUnidadMedida.find((cia: UnidadMedidaModel) => cia.id === idTableCia);
    return cia ? cia.descripcion : "Sin unidad de medida";
  };
  const columns: MRT_ColumnDef<InsumoExistencia>[] = useMemo(
    () => [
      {
        header: "Insumo",
        accessorKey: "descripcion",
      },
      {
        header: "Marca",
        accessorKey: "marca",
      },
      {
        header: "Precio",
        accessorKey: "precio",

        Cell: ({ cell }) => <p> {"$" + cell.getValue().toFixed(2)} </p>,
      },
      {
        header: "Unidad de medida",
        accessorKey: "d_unidadMedida",
      },
      {
        header: "Existencia",
        accessorKey: "existencia",
      },
      {
        header: "Acciones",
        accessorKey: "id",

        Cell: ({ cell }) => (
          <Button
            onClick={() => {
              handleInsumoSelectionORI(cell.row.original);
            }}
          >
            Seleccionar
          </Button>
        ),
      },
    ],
    []
  );

  // useEffect(() => {
  //   fetchInsumosGenerales();
  // }, []);
  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={datoInsumosProducto ? datoInsumosProducto : []}
        initialState={{
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
          density: "compact",
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Input type="text" placeholder="Codigo de barras" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} />
            <AiOutlineBarcode style={{ fontSize: "24px" }} />
          </Box>
        )}
      />
    </>
  );
};

export default TableInsumos;
