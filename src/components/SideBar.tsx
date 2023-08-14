import React, { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row } from "reactstrap";
import { AiFillHome, AiFillSmile } from "react-icons/ai";

const Sidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="navar sidebar-container">
      <Nav vertical>
        <Row>
          <AiFillSmile className={" w-25"} />
          <h5 className="w-50">THE NEW BLACK - ERP</h5>
        </Row>
        <hr className="border-bottom" />
        <NavItem className="rounded-5 bg-light w-75" onClick={toggleDropdown}>
          <div className="dropdown">
            <h6>Dropdown</h6>
            {/* <button id="navbarDropdown">Dropdown</button> */}
            <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`} aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="#">
                Opción 1
              </a>
              <a className="dropdown-item" href="#">
                Opción 2
              </a>
              <a className="dropdown-item" href="#">
                Opción 3
              </a>
            </div>
          </div>
        </NavItem>
        <br />
        <NavItem className="rounded-5 bg-light">
          <Row className="justify-content-around align-items-center  w-100">
            <AiFillHome className=" w-25 " />
            <NavLink className="text-black  w-50 " href="/inicio">
              DashBoard
            </NavLink>
          </Row>
        </NavItem>
        <br />
        <NavItem className="rounded-5 bg-light">
          <Row className="justify-content-around align-items-center  w-100">
            <AiFillHome className=" w-25 " />
            <NavLink className="text-black  w-50 " href="/inicio">
              Inicio
            </NavLink>
          </Row>
        </NavItem>
        <br />
        <hr className="border-bottom" />

        {/* Agrega más elementos de menú según tus necesidades */}
      </Nav>
    </div>
  );
};

export default Sidebar;
