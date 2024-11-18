import React from "react";
import "./NavBar.css";

function NavBar() {
    return (
      <div className="NavBar">
        <div className="left-side">
            <img src="./logo.png"/>
            <h1>Univent</h1>
            <input type="text" />
        </div>
        <div className="right-side">
            <ul>
                <li><button className="btn-simples">CRIE SEU EVENTO</button></li>
                <li><button className="btn-simples">ACESSE SUA CONTA</button></li>
                <li><button className="btn-irado">CADASTRE-SE</button></li>
            </ul>
        </div>
      </div>
    );
  }
  
  export default NavBar;
  