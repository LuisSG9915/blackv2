import Swal from "sweetalert2";
// import { jezaApi } from "../../../api/jezaApi";
import { CompraProveedor } from "../../../models/CompraProveedor";
import { UserResponse } from "../../../models/Home";
import JezaApiService from "../../../api/jezaApi2";
interface Props {
  dataUsuarios2: UserResponse[];
  dataCompras: CompraProveedor;
  setDataCompras: (value: React.SetStateAction<CompraProveedor>) => void;
  fetchCompras: () => Promise<void>;
}

export const postCompra = async ({ dataUsuarios2, dataCompras, setDataCompras, fetchCompras }: Props) => {
  const { jezaApi } = JezaApiService();
  if (!dataCompras.idProveedor || !dataCompras.clave_prod || dataCompras.cantidadFactura <= 0 || dataCompras.costoCompra <= 0) {
    // alert("Por favor, complete los campos obligatorios.");
    Swal.fire("", "Por favor, complete los campos obligatorios.", "info");
    return;
  }

  jezaApi
    .post("/Compra", null, {
      params: {
        id_compra: 0,
        fecha: new Date(),
        cia: dataUsuarios2[0]?.idCia,
        idSucursal: dataUsuarios2[0]?.sucursal,
        idProveedor: dataCompras.idProveedor,
        clave_prod: dataCompras.clave_prod,
        cantidad: dataCompras.cantidad,
        cantidadFactura: dataCompras.cantidadFactura,
        cantidadMalEstado: dataCompras.cantidadMalEstado,
        bonificaciones: dataCompras.bonificaciones,
        costounitario: dataCompras.costoUnitario,
        costoCompra: dataCompras.costoCompra,
        Usuario: dataUsuarios2[0]?.id,
        folioDocumento: dataCompras.folioDocumento,
        finalizado: false,
      },
    })
    .then(() => {
      Swal.fire("", "Compra guardada!", "success");
      fetchCompras();
    })
    .catch((error) => {
      Swal.fire("", "Error", error);
    });
  setDataCompras({
    ...dataCompras,
    costoUnitario: 0,
    id: 0,
    id_compra: 0,
    cia: 0,
    idSucursal: 0,
    clave_prod: 0,
    cantidad: 0,
    bonificaciones: 0,
    costounitario: 0,
    costoCompra: 0,
    Usuario: 0,
    finalizado: false,
    d_proveedor: "",
    d_producto: "",
    d_unidadMedida: "",
    d_unidadTraspaso: 0,
    cantidadFactura: 0,
    cantidadMalEstado: 0,
  });
};
