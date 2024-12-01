import { useEffect, useState } from 'react';
import './ListaEventos.css';
import { Evento } from '../../models/Evento';
import axios from 'axios';
import { Inscricao } from '../../models/Inscricao';

function InscricaoEventos() {

    const usuarioID = JSON.parse(localStorage.getItem('usuario') || '{}').id;

    const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

    const fetchInscricoes = () => {
        axios.get(`http://localhost:5136/sistema/usuario/listar-inscricoes/${usuarioID}`)
            .then((response) => {
                if(response.status === 200)
                    setInscricoes(response.data);
            })
            .catch(() => {});
    }

    useEffect(() => {
        fetchInscricoes();
    }, [inscricoes]);

    function handleCancelarInscricao(eventoID: number) {

        const inscricao : Inscricao = {
            eventoId: eventoID,
            usuarioId: usuarioID
        }

        axios.delete('http://localhost:5136/sistema/evento/cancelar-inscricao/', {
                    data: inscricao,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            .then(() => {
                fetchInscricoes();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className='card'>
            <div className="lista-eventos-card">
                <h1>Inscrição de Eventos</h1>
                <hr></hr>

                <div className='eventos-card'>
                {inscricoes.map((inscricao) => {
                        return (
                            <div className='evento-card' key={inscricao.evento?.id}>
                                <h2>{inscricao.evento?.nome}</h2>
                                <div className='info-evento'>
                                    <h3>Descrição :</h3>
                                    <p>{inscricao.evento?.descricao}</p>
                                </div>

                                <div className='info-evento'>
                                    <h3>Data e Hora :</h3>
                                    <p>{new Intl.DateTimeFormat(navigator.language, {
                                        dateStyle: 'short',
                                        timeStyle: 'short',
                                    }).format(new Date(inscricao.evento?.dataEvento!))}</p>
                                </div>

                                <div className='info-evento'>
                                    <h3>Vagas restantes :</h3>
                                    <p>{inscricao.evento?.vagasRestantes}</p>
                                </div>

                                <div className='info-evento'>
                                    <h3>Proprietário :</h3>
                                    <p>{inscricao.evento?.proprietario?.nome}</p>
                                </div>

                                <div className='evento-sub'>
                                <button className='cancel-button'
                                    onClick={() => {
                                        if (window.confirm("Tem certeza que deseja cancelar a inscrição?")) {
                                        handleCancelarInscricao(inscricao.evento?.id!);
                                        }
                                    }}>
                                    Cancelar Inscrição
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default InscricaoEventos;