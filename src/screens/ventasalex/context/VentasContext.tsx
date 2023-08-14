import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { Venta } from "../../../models/Venta";
import { CompraProveedor } from "../../../models/CompraProveedor";

interface VentasContextProps {
  data: Venta;
  setData: Dispatch<SetStateAction<Venta>>;
  selectedID: number;
  setselectedID: React.Dispatch<React.SetStateAction<number>>;
  dataVentasProcesos: Venta[];
  setDataVentasProcesos: React.Dispatch<React.SetStateAction<Venta[]>>;
  dataCompras: CompraProveedor;
  setDataCompras: React.Dispatch<React.SetStateAction<CompraProveedor>>;
}

const VentasContext = createContext<VentasContextProps | undefined>(undefined);

interface VentasProviderProps {
  children: ReactNode;
}

const VentasProvider: React.FC<VentasProviderProps> = ({ children }) => {
  const [data, setData] = useState<Venta>({
    id: 0,
    Sucursal: 0,
    Fecha: "",
    Caja: 1,
    No_venta: 1,
    Clave_prod: 1,
    Cant_producto: 1,
    Precio: 0,
    Precio_base: 0,
    Cve_cliente: 0,
    Tasa_iva: 0.16,
    ieps: 0,
    Observacion: "",
    Descuento: 0,
    Clave_Descuento: 0,
    Usuario: 0,
    Credito: false,
    Corte: 1,
    Corte_parcial: 1,
    Costo: 1,
    cancelada: false,
    idEstilista: 1,
    folio_estilista: 1,
    hora: 8,
    tiempo: 1,
    terminado: false,
    validadoServicio: false,
    Cia: 0,
    cliente: "",
    d_estilista: "",
    d_producto: "",
    d_existencia: "",
    estilista: "",
    producto: "",
  });
  const [dataCompras, setDataCompras] = useState<CompraProveedor>({
    id: 0,
    id_compra: 0,
    fecha: "",
    cia: 0,
    idSucursal: 0,
    idProveedor: 0,
    clave_prod: 0,
    cantidad: 0,
    bonificaciones: 0,
    costounitario: 0,
    costoCompra: 0,
    Usuario: 0,
    folioDocumento: "",
    finalizado: false,
    d_proveedor: "",
    fechaDocumento: "",
  });

  const [selectedID, setselectedID] = useState(0);

  const [dataVentasProcesos, setDataVentasProcesos] = useState<Venta[]>([]);

  return (
    <VentasContext.Provider
      value={{ data, setData, dataCompras, setDataCompras, selectedID, setselectedID, dataVentasProcesos, setDataVentasProcesos }}
    >
      {children}
    </VentasContext.Provider>
  );
};

const useGentlemanContext = (): VentasContextProps => {
  const context = useContext(VentasContext);

  if (context === undefined) {
    throw new Error("GentlemanContext must be used within a GentlemanProvider");
  }

  return context;
};

export { VentasContext, VentasProvider, useGentlemanContext };
