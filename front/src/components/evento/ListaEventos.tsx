import { Inscricao } from '../../models/Inscricao';
import { Evento } from '../../models/Evento';
import { useEffect, useState } from 'react';
import './ListaEventos.css';
import axios from 'axios';

function ListaEventos() {

    const usuarioID = JSON.parse(localStorage.getItem('usuario') || '{}').id;

    const [eventos, setEventos] = useState<Evento[]>([]);
    const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

    const fetchInscricoes = async () => {
        
        axios.get(`http://localhost:5136/sistema/usuario/listar-inscricoes/${usuarioID}`)
            .then((response) => {
                if(response.status === 200)
                    setInscricoes(response.data);
            })
            .catch(() => {});
        
    }

    const fetchEventos = async () => {
        axios.get('http://localhost:5136/sistema/evento/listar')
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
        fetchInscricoes();
    }, [inscricoes]);


    async function handleInscricaoEvento(eventoId: number) {
        const inscricao : Inscricao = {
            eventoId: eventoId,
            usuarioId: usuarioID
        }
        
        axios.post('http://localhost:5136/sistema/evento/inscrever', inscricao, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async (response) => {
                if(response.status === 200) {
                    alert('Inscrição realizada com sucesso!');
                    await fetchInscricoes();
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
                <div className='eventos-card'>
                    {eventos.map((evento) => {
                        const isInscrito = inscricoes.some(inscricao => inscricao.eventoId === evento.id);
                        return (
                            <div className='evento-card' key={evento.id}>
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
                                    <h3>Proprietário :</h3>
                                    <p>{evento.proprietario?.nome}</p>
                                </div>

                                <div className='evento-sub'>
                                {evento.vagasRestantes! <= 0 ? (
                                    <button disabled className='full-event'>Evento Lotado</button>
                                ) : (
                                    isInscrito ? (
                                        <button disabled className='subscribed-event'>Inscrito</button>
                                    ) : (
                                        <button className='subscribe-button' onClick={() => handleInscricaoEvento(evento.id!)}>Inscrever-se</button>
                                    )
                                )}
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ListaEventos;