import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { Trabajador } from "../../../models/Trabajador";
import { Venta } from "../../../models/Venta";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import Swal from "sweetalert2";
interface Venta2 {
  id: number;
  estilista: string;
  producto: string;
  cantidad: number;
  precio: number;
  tasaIva: number;
  tiempo: number;
}
interface Props {
  data: Estilistas[];
  setModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  setDataVentaEdit: React.Dispatch<React.SetStateAction<Venta>>;
  dataVentaEdit: Venta;
  dataTemporal: Venta;
  setDataTemporal: React.Dispatch<React.SetStateAction<Venta>>;
  flagEstilistas: boolean;
  setFlagEstilistas: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface Estilistas {
  id: number;
  estilista: string;
}
const TableEstilistas = ({ data, setModalOpen2, dataVentaEdit, setDataVentaEdit, dataTemporal, setDataTemporal, flagEstilistas }: Props) => {
  const [estilistasFiltrado, setEstilistasFiltrado] = useState<Estilistas[]>([]);
  const [estilistaFiltro, setEstilistaFiltro] = useState<any>([]);
  // const { data: dataTemporal, setData: setDataTemporal } = useGentlemanContext();
  const handle = (dato: Trabajador) => {
    const newId = dato.id;

    if (!dataTemporal.idEstilista && !dataTemporal.idestilistaAux) {
      setModalOpen2(false);
      if (flagEstilistas === false) {
        setDataTemporal({ ...dataTemporal, estilista: dato.nombre, idEstilista: newId });
        setDataVentaEdit({ ...dataVentaEdit, d_estilista: dato.nombre, idEstilista: newId });
      } else {
        setDataTemporal({ ...dataTemporal, d_estilistaAuxilliar: dato.nombre, idestilistaAux: newId });
        setDataVentaEdit({ ...dataVentaEdit, d_estilistaAuxilliar: dato.nombre, idestilistaAux: newId });
      }
    } else if (
      dataTemporal.idEstilista !== dataTemporal.idestilistaAux &&
      newId !== dataTemporal.idestilistaAux &&
      newId !== dataTemporal.idEstilista
    ) {
      setModalOpen2(false);
      if (flagEstilistas === false) {
        setDataTemporal({ ...dataTemporal, estilista: dato.nombre, idEstilista: newId });
        setDataVentaEdit({ ...dataVentaEdit, d_estilista: dato.nombre, idEstilista: newId });
      } else {
        setDataTemporal({ ...dataTemporal, d_estilistaAuxilliar: dato.nombre, idestilistaAux: newId });
        setDataVentaEdit({ ...dataVentaEdit, d_estilistaAuxilliar: dato.nombre, idestilistaAux: newId });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Trabajador repetido, favor de elegir otro`,
        confirmButtonColor: "#3085d6", // Cambiar el color del botón OK
      });
    }
  };

  useEffect(() => {
    console.log({ estilistaFiltro }); // Mostrará el valor actualizado de estilistaFiltro
  }, [estilistaFiltro]);

  // const filtroEmail = (datoMedico: string) => {
  //   var resultado = data.filter((elemento: Estilistas) => {
  //     if ((datoMedico === "" || elemento.estilista.toLowerCase().includes(datoMedico.toLowerCase())) && elemento.estilista.length > 0) {
  //       return elemento;
  //     }
  //   });
  //   setEstilistasFiltrado(resultado);
  // };

  useEffect(() => {
    console.log(data);
  }, []);

  const columns: MRT_ColumnDef<Estilistas>[] = [
    {
      accessorKey: "nombre",
      header: "Estilistas",
      filterVariant: "text",
      flex: 1,
    },
    {
      accessorKey: "id",
      header: "acciones",
      Cell: ({ cell }) => (
        <Button size="sm" onClick={() => handle(cell.row.original)}>
          Seleccionar
        </Button>
      ),
      flex: 1,
    },
  ];

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={{
          density: "compact",
          showGlobalFilter: true,
          pagination: {
            pageSize: 5,
            pageIndex: 0,
          },
          sorting: [{ id: "nombre", desc: false }],
        }}
        muiTableBodyRowProps={{
          sx: {
            height: "10px",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            p: "2px 16px",
          },
        }}
      />
    </>
  );
};

export default TableEstilistas;
