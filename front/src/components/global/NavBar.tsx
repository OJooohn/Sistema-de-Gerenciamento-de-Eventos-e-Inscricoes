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
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo"></img>
                </Link>
                <Link to="/"><h1>Univent</h1></Link>
            </div>
            <div className="right-side">
                <ul>
                    {!isLogged ? (
                    <>
                        <li>
                            <Link className="btn btn-irado" to="/sistema/usuario/cadastrar">Cadastrar</Link>
                        </li>
                        <li>
                            <Link className="btn btn-simples" to="/sistema/usuario/login">Login</Link>
                        </li>
                    </>
                    ) : (
                    <>
                        <li>
                            <button className="btn btn-simples" onClick={handleLogout}>Logout</button>
                        </li>
                        <li>
                            <Link className="btn btn-simples" to="/sistema/usuario/perfil">Perfil</Link>
                        </li>
                    </>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default NavBar;