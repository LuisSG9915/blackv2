import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Menu from "./screens/Menu";
import Usuarios from "./screens/Usuarios";
import Perfiles from "./screens/perfiles/Perfiles";
import UsuariosCrear from "./screens/UsuariosCrear";
import UsuariosPrueba from "./screens/UsuariosPrueba";
import InventariosAjustes from "./screens/inventarios/InventariosAjustes";
import CrearInventario from "./screens/inventarios/CrearInventario";
import Proveedores from "./screens/Proveedores";
import ProveedoresCrear from "./screens/ProveedoresCrear";
import NominaTrabajadores from "./screens/NominaTrabajadores";
import NominaTrabajadoresCrear from "./screens/NominaTrabajadoresCrear";
import NominaTrabajadorBaja from "./screens/NominaTrabajadorBaja";
import Productos from "./screens/producto/Productos";
import ProductosCrear from "./screens/producto/ProductosCrear";
import NominaDepartamentos from "./screens/NominaDepartamentos";
import SucursalesCrear from "./screens/sucursales/SucursalesCrear";
import AreaDeptoClases from "./screens/areadeptoclases/AreaDeptoClases";
import AreaDeptoClasesCrear from "./screens/areadeptoclases/AreaDeptoClasesCrear";
import Marcas from "./screens/marcas/Marcas";
import Puestos from "./screens/puesto/Puestos";
import PuestosCrear from "./screens/puesto/PuestosCrear";
import MarcasCrear from "./screens/marcas/MarcasCrear";
import TipoFormasPago from "./screens/tipoPago/TipoFormasPago";
import Home from "./screens/home/Home";
import Ventas from "./screens/ventas/Ventas";
import App from "./App";
import FormasPago from "./screens/FormasPagos";
import ClienteCrear from "./screens/clientes/ClienteCrear";
import Sucursales from "./screens/sucursales/Sucursales";
import Almacenes from "./screens/almacen/Almacenes";
import AlmacenCrear from "./screens/almacen/AlmacenCrear";
import Cias from "./screens/cia/Cias";
import CiasCrear from "./screens/cia/CiasCrear";
import PerfilesModulos from "./screens/perfiles modulos/PerfilesModulos";
import PerfilesModulosCrear from "./screens/perfiles modulos/PerfilesModulosCrear";
import PerfilesCrear from "./screens/perfiles/PerfilesCrear";
import DescPorPuntos from "./screens/DescPorPuntos/DescPorPuntos";
import Descuentos from "./screens/descuentos/Descuentos";
import CrearDescuento from "./screens/descuentos/CrearDescuento";
import KitPaquete from "./screens/kitpaquetes/KitPaquete";
import PaqueteConversiones from "./screens/paqueteconversiones/PaqueteConversiones";
import CategoriaGastos from "./screens/categoria gasto/CategoriaGasto";
import CategoriaSubGastos from "./screens/CategoriaSubGastos/CategoriaSubGastos";
import Clientes from "./screens/cliente/Clientes";
import TipoBajas from "./screens/tiposbajas/TipoBajas";
import PuestoRecursosHumanos from "./screens/puestoRecursosHumanos/PuestoRecursosHumanos";
import NivelEscolar from "./screens/nivelEscolaridad/NivelEscolar";
import DepartamentoRecursos from "./screens/departamentoRecursos/DepartamentoRecursos";
import Horarios from "./screens/horario/Horarios";
import Estatuscolaborador from "./screens/estatusColaborador/Estatuscolaborador";
import VentasP from "./screens/ventas/VentasP";
import CancelacionVentas from "./screens/cancelacionVentas/CancelacionVentas";
import CorteCaja from "./screens/corteCaja/CorteCaja";
import CorteCajaParcial from "./screens/corteCaja/CorteCajaParcial";
import TraspasoSalida from "./screens/traspasos/TraspasoSalida";
import Compras from "./screens/compras/Compras";
import TraspasosEntrada from "./screens/traspasos entrada/TraspasosEntrada";
import MovimientoDiversos from "./screens/movimiento diverso/MovimientoDiverso";
import UnidadMedida from "./screens/unidad_medida/UnidadMedida";
import TipoMovto from "./screens/tipo_movto/TipoMovto";
import Anticipo from "./screens/anticipo/Anticipo";
import ReporteTool from "./screens/ReporteTool/ReporteTool";
import DemoTresTablas from "./screens/ReporteTool/DemoTresTablas";
import ShopifySinc from "./screens/shopify/ShopifySinc";
import ClientesShopify from "./screens/clienteshopify/ClientesShopify";
import Metas from "./screens/metas/Metas";
import BluetoothPrint from "./screens/BluetoothPrint";
import BloqueosColaborador from "./screens/bloqueo colaborador/BloqueosColaborador";
import HorariosSuc from "./screens/horariosucursal/HorariosSuc";
import Webluetooth from "./screens/Webluetooth";
import CatBloqueoColaboradores from "./screens/catbloqueosColaboradores/CatBloqueoColaboradores";
import ReporteCifra from "./screens/cifraColaborador/ReporteCifra";
import ReporteArbol from "./screens/ReporteArbol/ReporteArbol";
import { Provider } from "react-redux";
import Example2 from "./screens/EXAMPLE/Example2";
import { store } from "./screens/EXAMPLE/app/store";
import { QueryClient, QueryClientProvider } from "react-query";
import CifraSucursal from "./screens/cifrasuc/CifraSucursal";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    // element: <App />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/menu",
    element: <Menu />,
  },

  {
    path: "/usuarios",
    element: <Usuarios />,
  },
  {
    path: "/UsuariosPrueba",
    element: <UsuariosPrueba />,
  },
  {
    path: "/UsuariosCrear",
    element: <UsuariosCrear />,
  },
  {
    path: "/InventariosAjustes",
    element: <InventariosAjustes />,
  },
  {
    path: "/Sucursales",
    element: <Sucursales />,
  },
  {
    path: "/SucursalesCrear",
    element: <SucursalesCrear />,
  },
  {
    path: "/CrearInventario",
    element: <CrearInventario />,
  },
  {
    path: "/Proveedores",
    element: <Proveedores />,
  },
  {
    path: "/ProveedoresCrear",
    element: <ProveedoresCrear />,
  },
  {
    path: "/NominaTrabajadores",
    element: <NominaTrabajadores />,
  },
  {
    path: "/NominaTrabajadoresCrear",
    element: <NominaTrabajadoresCrear />,
  },
  {
    path: "/NominaTrabajadorBaja",
    element: <NominaTrabajadorBaja />,
  },
  {
    path: "/Productos",
    element: <Productos />,
  },
  {
    path: "/ProductosCrear",
    element: <ProductosCrear />,
  },
  {
    path: "/NominaDepartamentos",
    element: <NominaDepartamentos />,
  },
  {
    path: "/Perfiles",
    element: <Perfiles />,
  },
  {
    path: "/AreaDeptoClases",
    element: <AreaDeptoClases />,
  },
  {
    path: "/AreaDeptoClasesCrear",
    element: <AreaDeptoClasesCrear />,
  },
  {
    path: "/Marcas",
    element: <Marcas />,
  },
  {
    path: "/MarcasCrear",
    element: <MarcasCrear />,
  },
  {
    path: "/Puestos",
    element: <Puestos />,
  },
  {
    path: "/PuestosCrear",
    element: <PuestosCrear />,
  },
  {
    path: "/TipoFormasPago",
    element: <TipoFormasPago />,
  },
  {
    path: "/Ventas",
    element: <Ventas />,
  },
  {
    path: "/FormasPago",
    element: <FormasPago />,
  },
  {
    path: "/Clientes",
    element: <Clientes />,
  },
  {
    path: "/ClientesShopify",
    element: <ClientesShopify />,
  },
  {
    path: "/ClienteCrear",
    element: <ClienteCrear />,
  },
  {
    path: "/Almacenes",
    element: <Almacenes />,
  },
  {
    path: "/AlmacenCrear",
    element: <AlmacenCrear />,
  },
  {
    path: "/Cias",
    element: <Cias />,
  },
  {
    path: "/CiasCrear",
    element: <CiasCrear />,
  },
  {
    path: "/PerfilesModulos",
    element: <PerfilesModulos />,
  },
  {
    path: "/PerfilesModulosCrear",
    element: <PerfilesModulosCrear />,
  },
  {
    path: "/PerfilesCrear",
    element: <PerfilesCrear />,
  },
  {
    path: "/DescPorPuntos",
    element: <DescPorPuntos />,
  },
  {
    path: "/Descuentos",
    element: <Descuentos />,
  },
  {
    path: "/CrearDescuento",
    element: <CrearDescuento />,
  },
  {
    path: "/KitPaquete",
    element: <KitPaquete />,
  },
  {
    path: "/PaqueteConversiones",
    element: <PaqueteConversiones />,
  },
  {
    path: "/CategoriaGastos",
    element: <CategoriaGastos />,
  },
  {
    path: "/CategoriaSubGastos",
    element: <CategoriaSubGastos />,
  },
  {
    path: "/TipoBajas",
    element: <TipoBajas />,
  },
  {
    path: "/PuestoRecursosHumanos",
    element: <PuestoRecursosHumanos />,
  },
  {
    path: "/NivelEscolar",
    element: <NivelEscolar />,
  },
  {
    path: "/DepartamentoRecursos",
    element: <DepartamentoRecursos />,
  },
  {
    path: "/Horarios",
    element: <Horarios />,
  },
  {
    path: "/Estatuscolaborador",
    element: <Estatuscolaborador />,
  },
  {
    path: "/VentasP",
    element: <VentasP />,
  },
  {
    path: "/CancelacionVentas",
    element: <CancelacionVentas />,
  },
  {
    path: "/CorteCaja",
    element: <CorteCaja />,
  },
  {
    path: "/CorteCajaParcial",
    element: <CorteCajaParcial />,
  },
  {
    path: "/TraspasoSalida",
    element: <TraspasoSalida />,
  },
  {
    path: "/Compras",
    element: <Compras />,
  },
  {
    path: "/TraspasosEntrada",
    element: <TraspasosEntrada />,
  },
  {
    path: "/MovimientoDiversos",
    element: <MovimientoDiversos />,
  },
  {
    path: "/UnidadMedida",
    element: <UnidadMedida />,
  },
  {
    path: "/TipoMovto",
    element: <TipoMovto />,
  },
  {
    path: "/Anticipo",
    element: <Anticipo />,
  },
  {
    path: "/ReporteTool",
    element: <ReporteTool />,
  },
  {
    path: "/DemoTresTablas",
    element: <DemoTresTablas />,
  },
  {
    path: "/ShopifySinc",
    element: <ShopifySinc />,
  },
  {
    path: "/Metas",
    element: <Metas />,
  },
  {
    path: "/CifraSucursal",
    element: <CifraSucursal />,
  },
  {
    path: "/BluetoothPrint",
    element: <BluetoothPrint />,
  },
  {
    path: "/BloqueosColaborador",
    element: <BloqueosColaborador />,
  },
  {
    path: "/HorariosSuc",
    element: <HorariosSuc />,
  },
  {
    path: "/webBluetooth",
    element: <Webluetooth />,
  },
  {
    path: "/CatBloqueoColaboradores",
    element: <CatBloqueoColaboradores />,
  },

  {
    path: "/ReporteCifra",
    element: <ReporteCifra />,
  },
  {
    path: "/ReporteArbol",
    element: <ReporteArbol />,
  },
  {
    path: "/Example2",
    element: <Example2 />,
  },
]);
const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient} >
    <RouterProvider router={router} />
  </QueryClientProvider>,
  document.getElementById("root")
);
