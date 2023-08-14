import React, { useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Collapse, NavbarToggler, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarText } from "reactstrap";

const SidebarHorizontal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [restriccion, setRestriccion] = useState(1);
  const navigate = useNavigate();
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Navbar className="navar" expand={"md"} color="rgba(225,224,253,255)">
        <NavbarBrand href="/"> The New Black</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar justified={true}>
            {/* cbserver_sql@ad */}
            {/* <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Inventario
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => navigate("/InvCompras")}>Compras</DropdownItem>
                <DropdownItem>Transacciones</DropdownItem>
                <DropdownItem onClick={() => navigate("/InventariosAjustes")}>Ajustes</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}

            {/* <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Ventas
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Ventas</DropdownItem>
                <DropdownItem>Dev s/vtas</DropdownItem>
                <DropdownItem>Agenda</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Citas
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Visor</DropdownItem>
                <DropdownItem>Configuracion</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Catálogos
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Admvos</DropdownItem>
                <DropdownItem>RRHH</DropdownItem>
                <DropdownItem>Configuración</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Reportes
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Ventas</DropdownItem>
                <DropdownItem>Citas</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}

            {/* <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Configuración
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => navigate("/usuarios")}>User</DropdownItem>
                <DropdownItem>Perf</DropdownItem>
                <DropdownItem>Bitacoras</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}

            {restriccion ? (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Realizados
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => navigate("/usuarios")}>Usuarios</DropdownItem>
                  <DropdownItem onClick={() => navigate("/InventariosAjustes")}>Inventario No</DropdownItem>
                  <DropdownItem onClick={() => navigate("/Sucursales")}>Sucursales</DropdownItem>
                  <DropdownItem onClick={() => navigate("/Proveedores")}>Proveedores</DropdownItem>
                  <DropdownItem onClick={() => navigate("/NominaTrabajadores")}>NominaTrabajadores</DropdownItem>
                  <DropdownItem onClick={() => navigate("/Productos")}>Productos</DropdownItem>
                  <DropdownItem onClick={() => navigate("/Perfiles")}>Perfiles</DropdownItem>
                  <DropdownItem onClick={() => navigate("/AreaDeptoClases")}>AreaDeptoClases</DropdownItem>
                  <DropdownItem onClick={() => navigate("/Marcas")}>Marcas</DropdownItem>
                  <DropdownItem onClick={() => navigate("/Puestos")}>Puestos</DropdownItem>
                  <DropdownItem onClick={() => navigate("/Ventas")}>Ventas</DropdownItem>
                  {/* <DropdownItem onClick={() => navigate("/FormasPago")}>FormasPago</DropdownItem> */}
                  <DropdownItem onClick={() => navigate("/Cliente")}>Cliente</DropdownItem>
                  <DropdownItem onClick={() => navigate("/TipoFormasPago")}>TipoFormasPagoMain</DropdownItem>
                  <DropdownItem onClick={() => navigate("/Almacenes")}>Almacenes</DropdownItem>
                  <DropdownItem onClick={() => navigate("/Cias")}>Cias</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            ) : null}

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Entrega 5
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => navigate("/usuarios")}>Usuarios</DropdownItem>
                <DropdownItem onClick={() => navigate("/Sucursales")}>Sucursales</DropdownItem>
                <DropdownItem onClick={() => navigate("/Perfiles")}>Perfiles</DropdownItem>
                <DropdownItem onClick={() => navigate("/Almacenes")}>Almacenes</DropdownItem>
                <DropdownItem onClick={() => navigate("/Cias")}>Empresas</DropdownItem>
                <DropdownItem onClick={() => navigate("/PerfilesModulos")}>Seguridad</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Entrega 6
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => navigate("/DescPorPuntos")}>DescPorPuntos</DropdownItem>
                <DropdownItem onClick={() => navigate("/Descuentos")}>Descuentos</DropdownItem>
                <DropdownItem onClick={() => navigate("/Marcas")}>Marcas</DropdownItem>
                <DropdownItem onClick={() => navigate("/AreaDeptoClases")}>AreaDeptoClases</DropdownItem>
                <DropdownItem onClick={() => navigate("/TipoFormasPago")}>TipoFormasPagoMain</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Entrega 7
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => navigate("/Productos")}>Productos</DropdownItem>
                <DropdownItem onClick={() => navigate("/PaqueteConversiones")}>PaqueteConversiones</DropdownItem>
                <DropdownItem onClick={() => navigate("/KitPaquete")}>KitPaquete</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Entrega 8
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => navigate("/Proveedores")}>Proveedores</DropdownItem>
                <DropdownItem onClick={() => navigate("/CategoriaGastos")}>CategoriaGastos</DropdownItem>
                <DropdownItem onClick={() => navigate("/CategoriaSubGastos")}>CategoriaSubGastos</DropdownItem>
                <DropdownItem onClick={() => navigate("/Clientes")}>Clientes</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Entrega 9
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => navigate("/NominaTrabajadores")}>NominaTrabajadores</DropdownItem>
                <DropdownItem onClick={() => navigate("/TipoBajas")}>TipoBajas</DropdownItem>
                <DropdownItem onClick={() => navigate("/PuestoRecursosHumanos")}>PuestoRecursosHumanos</DropdownItem>
                <DropdownItem onClick={() => navigate("/NivelEscolar")}>NivelEscolar</DropdownItem>
                <DropdownItem onClick={() => navigate("/DepartamentoRecursos")}>DepartamentoRecursos</DropdownItem>
                <DropdownItem onClick={() => navigate("/Horarios")}>Horarios</DropdownItem>
                <DropdownItem onClick={() => navigate("/Estatuscolaborador")}>Estatuscolaborador</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default SidebarHorizontal;
