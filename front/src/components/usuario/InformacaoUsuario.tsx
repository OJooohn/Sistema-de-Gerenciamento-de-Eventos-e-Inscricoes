import { useEffect, useRef, useState } from "react";
import { Usuario } from "../../models/Usuario";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './InformacaoUsuario.css';

function InformacaoUsuario () {

    const hasRun = useRef(false);

    const navigate = useNavigate();

    const usuarioID = JSON.parse(localStorage.getItem('usuario')?.toString() || '{}').id;
    const [usuario, setUsuario] = useState<Usuario>();

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        if (!usuarioID) {
            alert('Usuário não logado');
            navigate('/sistema/usuario/login');
            return;
        } 

        axios.get(`http://localhost:5136/sistema/usuario/basico/buscarID/` + usuarioID)
            .then((response) => {
                if(response.status == 200) 
                    setUsuario(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
    }, [usuario]);

    function handleDeletarConta() {
        axios.delete(`http://localhost:5136/sistema/usuario/deletar/${usuarioID}`)
            .then((response) => {
                if(response.status == 200) {
                    localStorage.removeItem('usuario');
                    navigate('/sistema/usuario/login');
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }

    return (
        <div className="card">
            <div className="info-card">
                <h1>Informação do Usuário</h1>
                <hr></hr>
                <div className="user-info-card">
                    {usuario && (
                        <>
                            <div className="user-info">
                                <h3>Nome :</h3>
                                <p>{usuario.nome}</p>
                            </div>
                            <div className="user-info">
                                <h3>Email :</h3>
                                <p>{usuario.email}</p>
                            </div>
                            <div className="user-info">
                                <h3>Perfil :</h3>
                                <p>{usuario.perfil}</p>
                            </div>
                        </>
                    )}
                </div>
                <hr></hr>
                <div className="perfil-buttons">
                    <button className="delete-btn"
                    onClick={
                        () => {
                            if(window.confirm('Deseja realmente deletar sua conta?')) {
                                handleDeletarConta();
                            }
                        }
                    }>
                    Deletar
                    </button>
                    <button className="edit-btn" onClick={() => navigate('/sistema/usuario/editar')}>Editar Perfil</button> 
                </div>
            </div>
        </div>
    );

}

export default InformacaoUsuario;