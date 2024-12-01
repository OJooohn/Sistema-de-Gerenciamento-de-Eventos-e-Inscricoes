import { useEffect, useState } from "react";
import { Evento } from "../../models/Evento";
import axios from "axios";
import { Link } from "react-router-dom";

function OrganizadorEventos () {

    const usuarioID = JSON.parse(localStorage.getItem('usuario') || '{}').id;
    const [eventos, setEventos] = useState<Evento[]>([]);

    useEffect(() => {

        axios.get(`http://localhost:5136/sistema/evento/meus-eventos/${usuarioID}`)
            .then((response) => {
                if(response.status === 200)
                    setEventos(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [usuarioID]);

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

                                <div className='info-evento'>
                                    <Link to={`/sistema/evento/editar/${evento.id}`} className="edit-button">Editar</Link>
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