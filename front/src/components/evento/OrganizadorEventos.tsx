import { useEffect, useState } from "react";
import { Evento } from "../../models/Evento";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function OrganizadorEventos () {

    const navigate = useNavigate();

    const usuarioID = JSON.parse(localStorage.getItem('usuario') || '{}').id;
    const [eventos, setEventos] = useState<Evento[]>([]);

    const fetchEventos = () => {
        axios.get(`http://localhost:5136/sistema/evento/meus-eventos/${usuarioID}`)
            .then((response) => {
                if(response.status === 200)
                    setEventos(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchEventos();
    }, [usuarioID]);

    function handleDeletarEvento(eventoID: number) {
        axios.delete(`http://localhost:5136/sistema/evento/excluir/${eventoID}`)
            .then((response) => {
                if (response.status === 200) {
                    alert('Evento deletado com sucesso!');
                    fetchEventos();
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className="card">
            <div className="lista-eventos-card">
                <h1>Eventos</h1>
                <hr></hr>

                <div className="eventos-card">
                    {eventos.map((evento) => {
                        return (
                            <div key={evento.id} className="evento-card">
                                <h2>{evento.nome}</h2>
                                <div className='info-evento'>
                                    <h3>Descrição :</h3>
                                    <p>{evento.descricao}</p>
                                </div>

                                <div className='info-evento'>
                                    <h3>Data e Hora :</h3>
                                    <p>{new Intl.DateTimeFormat(navigator.language, {
                                        dateStyle: 'short',
                                        timeStyle: 'short',
                                    }).format(new Date(evento.dataEvento))}</p>
                                </div>

                                <div className='info-evento'>
                                    <h3>Vagas restantes :</h3>
                                    <p>{evento.vagasRestantes}</p>
                                </div>

                                <div className="manage-event">
                                    <div className='info-evento'>
                                        <Link to={`/sistema/evento/editar/${evento.id}`} className="edit-button">Editar</Link>
                                    </div>

                                    <div className='info-evento'>
                                        <button className="delete-event"
                                        onClick={() => {
                                            if(window.confirm('Deseja mesmo deletar este evento?')) {
                                                handleDeletarEvento(evento.id!);
                                            }
                                        }}>
                                        Deletar
                                        </button>
                                    </div>
                                </div>


                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default OrganizadorEventos;