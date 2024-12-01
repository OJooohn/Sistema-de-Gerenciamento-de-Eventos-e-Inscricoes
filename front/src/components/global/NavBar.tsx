import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './NavBar.css';

function NavBar() {
    const navigate = useNavigate();

    const isLogged = Boolean(JSON.parse(localStorage.getItem('usuario') || '{}').id);
  
    function handleLogout(e: any) {
        e.preventDefault();
        localStorage.setItem('usuario', JSON.stringify({ id: null }));
        navigate('/');
    }

    return(
        <div className="nav-bar">
            <div className="left-side">
                <Link to="/">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" />
                </Link>
                <Link to="/" className="logo-text">
                    <h1>Univent</h1>
                </Link>
            </div>
            <div className="right-side">
                <ul>
                    {!isLogged ? (
                        <>
                            <li>
                                <Link className="btn btn-secondary" to="/sistema/usuario/cadastrar">
                                    Cadastrar
                                </Link>
                            </li>
                            <li>
                                <Link className="btn btn-primary" to="/sistema/usuario/login">
                                    Login
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link className="btn btn-secondary" to="/sistema/dashboard">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <button className="btn btn-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                            <li>
                                <Link className="btn btn-primary" to="/sistema/usuario/perfil">
                                    Perfil
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