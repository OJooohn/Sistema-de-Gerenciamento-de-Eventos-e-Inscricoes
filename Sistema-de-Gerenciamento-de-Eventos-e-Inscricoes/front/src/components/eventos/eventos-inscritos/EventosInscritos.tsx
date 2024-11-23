import { Inscricao } from "../../../interfaces/Inscricao";
import { Usuario } from "../../../interfaces/Usuario";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Global from "../../../Global";
import './EventosInscritos.css';

function EventosInscritos() {
    const navigate = useNavigate();
        
    const token = localStorage.getItem('usuario');
    const [usuario, setUsuario] = useState<Usuario>();
    
    // Pegar informações do usuário
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

    // Pegar inscrições do usuário
    const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
    const fetchInscricoes = async () => {
        try {
            if(!usuario?.id) {
                return;
            }
            const response = await fetch(`http://localhost:5136/sistema/usuario/listar-inscricoes/${usuario?.id}`);
            if(response.status === 404) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Nenhum evento inscrito');
            }
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
        } catch (error) {
            console.error('Erro:', error);
        }
    };
    

    return (
        <div className="EventosInscritos">
            <div className="card-EventosInscritos">
                <div className="card-EventosInscritos-title">
                    <h1>Eventos Inscritos</h1>
                </div>

                <div className="inscricoes-card">
                    {inscricoes.map((inscricao: Inscricao) => (
                        <div className="inscricao-card-wrapper" key={inscricao.id}>
                            <div className="inscricao-card-shadow">
                                <div className="inscricao-card">
                                    
                                    <h2>{typeof inscricao.evento !== 'string' ? inscricao.evento.nome : ''}</h2>
                                    <div className="descricao-evento">
                                        <h3>Descrição</h3>
                                        <p>{typeof inscricao.evento !== 'string' ? inscricao.evento.descricao : ''}</p>
                                    </div>

                                    <div className="data-evento">
                                        <h3>Data</h3>
                                        <p>{new Date(typeof inscricao.evento !== 'string' ? inscricao.evento.nome : '').toLocaleString()}</p>
                                    </div>

                                    <div className="vagas-evento">
                                        <h3>Vagas Restantes</h3>
                                        <p>{typeof inscricao.evento !== 'string' ? inscricao.evento.vagasRestantes : ''}</p>
                                    </div>
                                    {inscricao.id && inscricoes.some(i => i.id === inscricao.id) ? (
                                        <div className="double-button-event">
                                            <button className="inscrito-btn" disabled>INSCRITO</button>
                                            <button className="cancelar-btn" onClick={() => typeof inscricao.evento !== 'string' && inscricao.evento.id && handleCancelarInscricao(inscricao.evento.id)}>CANCELAR INSCRIÇÃO</button>
                                        </div>
                                    ) : (
                                        null
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

export default EventosInscritos;