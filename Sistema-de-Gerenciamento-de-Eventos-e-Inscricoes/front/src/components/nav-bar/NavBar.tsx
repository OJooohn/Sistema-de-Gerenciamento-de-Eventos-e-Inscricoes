import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import logo from "./logo.png";

function NavBar() {

  return (
    <>
      <div className="NavBar">
        <div className="left-side">
          <Link to="/" className="abisurdu"><img src={logo} alt="Logo" /></Link>
          <Link to="/" className="abisurdu"><h1>Univent</h1></Link>
          <input type="text" placeholder="Pesquisar..." />
        </div>
        <div className="right-side">
          <ul>
            <li><Link to="#"><button className="btn-simples">CRIE SEU EVENTO</button></Link></li>
            <li><Link to="#"><button className="btn-simples">ACESSE SUA CONTA</button></Link></li>
            <li><Link to="/signup"><button className="btn-irado">CADASTRE-SE</button></Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default NavBar;
