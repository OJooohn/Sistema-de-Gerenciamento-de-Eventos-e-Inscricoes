import { useEffect, useRef, useState } from "react";
import { Usuario } from "../../models/Usuario";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './InformacaoUsuario.css';

function InformacaoUsuario () {

    const hasRun = useRef(false);

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario>();

    const [mensagem, setMensagem] = useState<string>();

    async function handleUsuario() {
        try {
            const usuarioID = JSON.parse(localStorage.getItem('usuario')?.toString() || '{}').id;
            const response = await axios.get(`http://localhost:5136/sistema/usuario/basico/buscarID/` + usuarioID);
            
            //console.log(response.data);

            if(response.status == 200) {
                setUsuario(response.data);
                return;
            }

            setMensagem('Usuário não encontrado');
            
        } catch (error) {
            console.error(error);
            setMensagem('Erro ao buscar usuário');
        }
    }

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const usuario = JSON.parse(localStorage.getItem('usuario')?.toString() || '{}');
        if (usuario.id === null) {
            alert('Usuário não logado');
            navigate('/sistema/usuario/login');
            return;
        } 
        
        handleUsuario();
        
    }, []);

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
                <button className="edit-btn" onClick={() => navigate('/sistema/usuario/editar')}>Editar Perfil</button>
            </div>
        </div>
    );

}

export default InformacaoUsuario;