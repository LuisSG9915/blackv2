export interface Movimiento {
  cia: number;
  sucursal: number;
  folio: number | string;
  fecha: string;
  clave_prod: number;
  tipo_movto: number;
  cantidad_entrada: number;
  cantidad_salida: number;
  costo: number;
  precio: number;
  usuario: number;
  almacen: number;
  observacion: string;
  d_producto?: string;
  id?: number;
  d_existencia?: number;
}
