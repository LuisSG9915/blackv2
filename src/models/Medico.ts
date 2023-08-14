export interface Props {
  url: string;
}
export interface Medico {
  id:number;
  nombre?: string;
  email?: string;
  idClinica?: number;
  telefono?: string | null; 
  mostrarTel?: boolean | null;
  direccionClinica?: null;
  nombreClinica?: null;
  telefonoClinica?: null;
}
