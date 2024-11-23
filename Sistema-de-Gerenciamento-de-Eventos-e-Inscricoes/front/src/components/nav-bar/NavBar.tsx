import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import logo from "./logo.png";

function NavBar() {
  const [reloadKey, setReloadKey] = useState(0); // Estado para forçar re-renderização

  const isLoggedIn = localStorage.getItem("usuario") !== null;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setReloadKey((prevKey) => prevKey + 1); // Atualiza a chave para forçar re-renderização
    navigate("/");
    window.location.reload(); // Força uma recarga completa da página
  };

  const handleReload = () => {
    setReloadKey((prevKey) => prevKey + 1); // Atualiza a chave para forçar re-renderização
  }

  return (
    <div className="NavBar" key={reloadKey}>
      <div className="left-side">
        <Link to="/" className="abisurdu" onClick={handleReload}>
          <img src={logo} alt="Logo" />
        </Link>
        <Link to="/" className="abisurdu" onClick={handleReload}>
          <h1>Univent</h1>
        </Link>
        <input type="text" placeholder="Pesquisar..." />
      </div>
      <div className="right-side">
        <ul>
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/usuario/login">
                  <button className="btn-simples" onClick={handleReload}>ACESSE SUA CONTA</button>
                </Link>
              </li>
              <li>
                <Link to="/usuario/signup">
                  <button className="btn-irado" onClick={handleReload}>CADASTRE-SE</button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <button className="btn-simples" onClick={handleLogout}>SAIR</button>
              </li>
              <li>
                <Link to="/usuario/perfil">
                  <button className="btn-simples" onClick={handleReload}>PERFIL</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default NavBar;