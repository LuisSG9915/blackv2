export interface CompraProveedor {
  id: number;
  id_compra: number;
  fecha: string;
  cia: number;
  idSucursal: number;
  idProveedor: number;
  clave_prod: number;
  cantidad: number;
  bonificaciones: number;
  costounitario: number;
  costoCompra: number;
  Usuario: number;
  folioDocumento: string;
  finalizado: boolean;
  cantidadFactura: number;
  cantidadMalEstado: number;
  descripcion?: string;
  costoUnitario?: any;
  d_proveedor: string;
  d_producto?: string;
  d_unidadMedida?: string;
  d_unidadTraspaso?: number;
  fechaDocumento?: string;
}
