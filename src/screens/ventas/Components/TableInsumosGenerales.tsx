import React, { useEffect, useMemo, useState } from "react";
import { Button, Input } from "reactstrap";
import { jezaApi } from "../../../api/jezaApi";
import Swal from "sweetalert2";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { useUnidadMedida } from "../../../hooks/getsHooks/useUnidadMedida";
import { UnidadMedidaModel } from "../../../models/UnidadMedidaModel";
import { VentaInsumo } from "../../../models/VentaInsumo";
import { AiOutlineBarcode } from "react-icons/ai";

import { Box } from "@mui/material";
import { InsumoExistencia } from "./TableProductos";

interface Props {
  data: Estilistas[];
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  datoVentaSeleccionado: any;
  handleGetFetch: any;
  datoInsumosProducto: InsumoExistencia[];
  datoInsumosProductoResumen?: VentaInsumo[];
}
export interface Estilistas {
  id: number;
  estilista: string;
}
const TableInsumos = ({ data, setModalOpen2, datoVentaSeleccionado, handleGetFetch, datoInsumosProducto, datoInsumosProductoResumen }: Props) => {
  const [form, setForm] = useState({
    marca: "",
    cantidad: "",
    id_insumo: 0,
  });

  const createInsumoTrue = (updatedForm: { id_insumo: number; marca: string; cantidad: string }) => {
    jezaApi
      .post("/VentaInsumo", null, {
        params: {
          id_venta: datoVentaSeleccionado,
          id_insumo: Number(updatedForm.id_insumo),
          cantidad: Number(updatedForm.cantidad),
        },
      })
      .then((re) =>
        Swal.fire({
          icon: "success",
          text: "Insumo ingresado con éxito",
          confirmButtonColor: "#3085d6",
        })
      )
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    handleGetFetch();
    console.log(datoInsumosProducto);
  }, [datoVentaSeleccionado]);

  const handleInsumoSelection = (id: InsumoExistencia) => {
    // Mostrar el SweetAlert para obtener la cantidad
    // AQUI PONGO MI CONDICIONAL datoInsumosProducto
    console.log(datoInsumosProductoResumen);
    const validarInsumoProducto = datoInsumosProductoResumen?.some((elemento: VentaInsumo) => elemento.id_insumo === Number(id.id));
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
              createInsumoTrue(updatedForm);
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
      // {
      //   header: "Unidad de medida",
      //   accessorKey: "d_unidad_medida",
      //
      //   // Cell: ({ cell }) => <p>{getCiaForeignKey(cell.getValue())}</p>,
      // },
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
              handleInsumoSelection(cell.row.original);
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
