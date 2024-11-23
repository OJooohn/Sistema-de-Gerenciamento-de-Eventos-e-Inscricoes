import { useEffect, useState } from "react";
import './MeusEventos.css'
import { Evento } from "../../../interfaces/Evento";
import { Usuario } from "../../../interfaces/Usuario";
import { Link, useNavigate } from "react-router-dom";
import Global from "../../../Global";

function MeusEventos() {
    const navigate = useNavigate();
    
    const token = localStorage.getItem('usuario');
    const [usuarioId, setUsuarioId] = useState<number>();

    // pegar ID do usuário logado
    useEffect(() => {
        fetch(`http://localhost:5136/sistema/usuario/buscar/${token}`)
        .then(response => {
            if (!response.ok) {
                console.log(Global.usuario);
                throw new Error("Erro ao obter usuário");
            }
            return response.json();
    
        })
        .then(data => {
            setUsuarioId(data.id);
        })
        .catch(error => {
            console.error("Erro:", error);
        })
    
        if (!token) {
          alert('Você precisa estar logado para acessar essa página');
          navigate('/');
        }
    }, [token, navigate]);

    // Pegar eventos do usuário
    const [eventos, setEventos] = useState<Evento[]>([]);

    const fetchEventos = () => {
        if (!usuarioId) {
            return;
        }
        fetch(`http://localhost:5136/sistema/evento/meus-eventos/${usuarioId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao obter evento");
                }
                return response.json();
            })
            .then(data => {
                setEventos(data);
            })
            .catch(error => {
                console.error("Erro:", error);
            });
    };

    // Pegar eventos do proprietario
    useEffect(() => {
        fetchEventos();
    }, [usuarioId])

    const handleCancelarEvento = (eventoId: number) => {
        if(!window.confirm('Deseja realmente cancelar o evento?')) {
            return;
        }
        fetch(`http://localhost:5136/sistema/evento/excluir/${eventoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token de autorização, se necessário
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao cancelar evento");
                }
                return response.json();
            })
            .then( () => {
                alert('Evento cancelado com sucesso');
                fetchEventos();
            })
            .catch(error => {
                console.error("Erro:", error);
            })

    }

    return (
        <div className="MeusEventos">
            <div className="meusEventos-card">
                <div className="meusEventos-card-title">
                    <h1>Meus Eventos</h1>
                </div>

                <div className="eventos-card">
                    {eventos.map(evento => (
                        <div className="evento-card-wrapper">
                            <div className="evento-card-shadow">
                                <div className="evento-card" key={evento.id}>
                                    <h2>{evento.nome}</h2>
                                    <div className="descricao-evento">
                                        <h3>Descrição</h3>
                                        <p>{evento.descricao}</p>
                                    </div>

                                    <div className="data-evento">
                                        <h3>Data</h3>
                                        <p>{new Date(evento.dataEvento).toLocaleString()}</p>
                                    </div>

                                    <div className="vagas-evento">
                                        <h3>Vagas Máximo</h3>
                                        <p>{evento.vagasMaximo}</p>
                                    </div>
                                    <div className="vagas-evento">
                                        <h3>Vagas Restantes</h3>
                                        <p>{evento.vagasRestantes}</p>
                                    </div>

                                    <div className="double-btn">
                                        <button className="btn-cancelar-evento" onClick={() => evento.id && handleCancelarEvento(evento.id)}>CANCELAR EVENTO</button>
                                        <Link to={`/evento/editar/${evento.id}`}>   
                                            <button className="btn-editar-evento">EDITAR EVENTO</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))}
                
                </div>
               
            </div>
        </div>
    );
}

export default MeusEventos;