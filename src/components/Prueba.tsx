import React from "react";

function Prueba() {
  return (
    <div id="wrapper">
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">The New Black</div>
        </a>

        <hr className="sidebar-divider my-0" />

        <li className="nav-item active">
          <a className="nav-link" href="/">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span> Actualizar</span>
          </a>
        </li>

        <hr className="sidebar-divider" />

        <div className="sidebar-heading">Opciones</div>

        <li className="nav-item">
          <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
            <i className="fas fa-fw fa-folder"></i>
            <span>Inventario</span>
          </a>
          <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Opciones:</h6>
              <a className="collapse-item" href="buttons.html">
                Inventario 1
              </a>
              <a className="collapse-item" href="cards.html">
                Inventario 2
              </a>
            </div>
          </div>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapse3" aria-expanded="true" aria-controls="collapse3">
            <i className="fas fa-clipboard-list"></i>
            <span>Catálogos</span>
          </a>
          <div id="collapse3" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Opciones:</h6>
              <a className="collapse-item" href="buttons.html">
                Catálogo 1
              </a>
              <a className="collapse-item" href="cards.html">
                Catálogo 2
              </a>
            </div>
          </div>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">
            <i className="fas fa-dollar-sign"></i>
            <span>Ventas</span>
          </a>
          <div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Monitoreo de ventas:</h6>
              <a className="collapse-item" href="utilities-color.html">
                Ventas 1
              </a>
              <a className="collapse-item" href="utilities-border.html">
                Ventas 2
              </a>
              <a className="collapse-item" href="utilities-animation.html">
                Ventas 3
              </a>
            </div>
          </div>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities3" aria-expanded="true" aria-controls="collapseUtilities3">
            <i className="fas fa-calendar"></i>
            <span>Citas</span>
          </a>
          <div id="collapseUtilities3" className="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Agenda de citas:</h6>
              <a className="collapse-item" href="utilities-color.html">
                Cita 1
              </a>
              <a className="collapse-item" href="utilities-border.html">
                Cita 2
              </a>
              <a className="collapse-item" href="utilities-animation.html">
                Cita 3
              </a>
            </div>
          </div>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages1" aria-expanded="true" aria-controls="collapsePages1">
            <i className="fas fa-clipboard-list"></i>
            <span>Reportes</span>
          </a>
          <div id="collapsePages1" className="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Opciones:</h6>
              <a className="collapse-item" href="login.html">
                Reporte 1
              </a>
            </div>

            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true" aria-controls="collapsePages">
                <i className="fas fa-fw fa-cog"></i>
                <span>Configuración</span>
              </a>
              <div id="collapsePages" className="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Inicio de sesión:</h6>
                  <a className="collapse-item" href="login.html">
                    Login
                  </a>
                </div>
              </div>
            </li>

            <hr className="sidebar-divider d-none d-md-block" />

            <div className="text-center d-none d-md-inline">
              <button className="rounded-circle border-0" id="sidebarToggle"></button>
            </div>

            <div className="sidebar-card d-none d-lg-flex">
              <img className="sidebar-card-illustration mb-2" src="img/undraw_rocket.svg" alt="..." />
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Prueba;
