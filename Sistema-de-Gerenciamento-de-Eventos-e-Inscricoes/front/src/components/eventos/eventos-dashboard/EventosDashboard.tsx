import { Inscricao } from "../../../interfaces/Inscricao";
import { Usuario } from "../../../interfaces/Usuario";
import { Evento } from "../../../interfaces/Evento";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Global from "../../../Global";
import "./EventosDashboard.css";

function EventosDashboard() {

    const navigate = useNavigate();
        
    const token = localStorage.getItem('usuario');
    const [usuario, setUsuario] = useState<Usuario>();
    
    // pegar informações do usuário
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
            setUsuario(data);
        })
        .catch(error => {
            console.error("Erro:", error);
        })
    
        if (!token) {
          alert('Você precisa estar logado para acessar essa página');
          navigate('/');
        }
    }, [token, navigate]);

    // Pegar eventos
    const [eventos, setEventos] = useState<Evento[]>([]);

    const fetchEventos = () => {
        fetch(`http://localhost:5136/sistema/evento/listar`)
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
        })
    };

    // Pegar inscrições do usuario para mostrar botão de inscrição ou cancelamento
    const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
    const fetchInscricoes = async () => {
        try {
            if(!usuario?.id) {
                return;
            }
            const response = await fetch(`http://localhost:5136/sistema/usuario/listar-inscricoes/${usuario?.id}`);
            if (!response.ok) {
                throw new Error("Erro ao obter eventos");
            }
            const data = await response.json();
            setInscricoes(data);
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    useEffect(() => {
        fetchInscricoes();
    }, [usuario]);

    useEffect(() => {
        fetchEventos();
    }, []);

    // Inscrever-se em um evento
    const handleInscreverEvento = (eventoId: number) => {
        if (!usuario?.id) {
            alert('Você precisa estar logado para se inscrever em um evento');
            return;
        }

        const inscricao = {
            usuarioId: usuario.id,
            eventoId: eventoId
        };

        fetch('http://localhost:5136/sistema/evento/inscrever', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inscricao),
        })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Erro ao se inscrever no evento');
            }
            return response.json();
        })
        .then(() => {
            alert('Inscrição realizada com sucesso!');
            fetchInscricoes();
            fetchEventos();
        })
        .catch(error => {
            alert(error.message);
        });
    };

    const handleCancelarInscricao = async (eventoId: number) => {
        if (!usuario?.id) {
            alert('Você precisa estar logado para se inscrever em um evento');
            return;
        }
    
        const inscricao = {
            usuarioId: usuario.id,
            eventoId: eventoId
        };
    
        try {
            const response = await fetch('http://localhost:5136/sistema/evento/cancelar-inscricao', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inscricao),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao cancelar inscrição no evento');
            }
    
            const result = await response.json();
            console.log("Cancelamento bem-sucedido:", result);
            alert('Inscrição cancelada com sucesso!');
            // Atualiza o estado local removendo a inscrição cancelada
            setInscricoes(prevInscricoes => prevInscricoes.filter(inscricao => inscricao.eventoId !== eventoId));
            fetchEventos();
        } catch (error) {
            console.error('Erro:', error);
        }
    };
    

    return(
        <div className="InscreverEvento">
            <div className="card-inscrever-evento">
                <div className="card-inscrever-evento-title">
                    <h1>Inscrever-se em um evento</h1>
                </div>
                <div className="eventos-card">
                    {eventos.map(evento => (
                        <div className="evento-card-wrapper" key={evento.id}>
                            <div className="evento-card-shadow">
                                <div className="evento-card">
                                    
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
                                        <h3>Vagas Restantes</h3>
                                        <p>{evento.vagasRestantes}</p>
                                    </div>
                                    
                                    <div className="organizador-evento">
                                        <h3>Organizador</h3>
                                        <p>{typeof evento.proprietario === 'object' ? evento.proprietario?.nome : evento.proprietario}</p> 
                                    </div>
                                    {evento.id && inscricoes.some(inscricao => inscricao.eventoId === evento.id) ? (
                                        <div className="double-button-event">
                                            <button className="inscrito-btn" disabled>INSCRITO</button>
                                            <button className="cancelar-btn" onClick={() => evento.id && handleCancelarInscricao(evento.id)}>CANCELAR INSCRIÇÃO</button>
                                        </div>
                                    ) : (
                                        <div className="single-button-event">
                                            <button className="inscrever-btn" onClick={() => evento.id && handleInscreverEvento(evento.id)}>INSCREVER-SE</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default EventosDashboard;