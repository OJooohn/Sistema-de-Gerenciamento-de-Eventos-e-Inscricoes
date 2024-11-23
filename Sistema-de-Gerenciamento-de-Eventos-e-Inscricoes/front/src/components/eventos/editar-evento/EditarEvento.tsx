import { useNavigate, useParams } from "react-router-dom";
import { Evento } from "../../../interfaces/Evento";
import { useEffect, useState } from "react";
import './EditarEvento.css'

function EditarEvento() {
    
    const navigate = useNavigate();

    // Pegar informacoes do evento
    const { id } = useParams<{ id : string }>();
    const [evento, setEvento] = useState<Evento>();

    const [nomeEvento, setNomeEvento] = useState<string>('');
    const [descricaoEvento, setDescricaoEvento] = useState<string>('');
    const [dataEvento, setDataEvento] = useState<string>('');
    const [horaEvento, setHoraEvento] = useState<string>('');
    const [vagasMaximo, setVagasMaximo] = useState<number>(0);

    // Buscar evento e preencher campos com os dados atuais do evento
    useEffect( () => {
        fetch(`http://localhost:5136/sistema/evento/buscar/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao obter evento");
            }
            return response.json();
        })
        .then(data => {
            setEvento(data);
            setNomeEvento(data.nome);
            setDescricaoEvento(data.descricao);
            setVagasMaximo(data.vagasMaximo);
            setDataEvento(data.dataEvento.split('T')[0]);
            setHoraEvento(data.dataEvento.split('T')[1].slice(0, 5));
        })
        .catch(error => {
            console.error("Erro:", error);
        })
    }, [id]);

    // Editar evento
    function handleEditarEvento(e : any) {
        e.preventDefault();

        // Formatar data e hora -> evitar BadRequest
        const dataHoraEvento = `${dataEvento}T${horaEvento}:00`;

        const novoEvento: Evento = {
            nome: nomeEvento,
            descricao: descricaoEvento,
            dataEvento: dataHoraEvento,
            vagasMaximo: Number(vagasMaximo),
            proprietarioId: evento?.proprietarioId || 0,
        }

        fetch(`http://localhost:5136/sistema/evento/alterar/${id}`, 
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoEvento),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao editar evento");
                }
                return response.json();
            })
            .then(data => {
                alert('Evento editado com sucesso');
                navigate('/evento/meus-eventos');
            })
            .catch(error => {
                console.error("Erro:", error);
            });
    }

    return (
        <div className="EditarEvento">
            <div className="card-EditarEvento">
                <div className="EditarEvento-title">
                    <h1>Editar Evento</h1>
                </div>

                <form onSubmit={handleEditarEvento}>
                    <label>
                        Nome do Evento:
                        <input
                            value={nomeEvento}
                            onChange={(e) => setNomeEvento(e.target.value)}
                            type="text"
                            required
                        />
                    </label>
                    <label>
                        Descricao do Evento:
                        <input
                            value={descricaoEvento}
                            onChange={(e) => setDescricaoEvento(e.target.value)}
                            type="text"
                            required
                        />
                    </label>
                    <label>
                        Vagas:
                        <input
                            value={vagasMaximo}
                            onChange={(e) => setVagasMaximo(Number(e.target.value))}
                            type="number"
                            required
                        />
                    </label>
                    <label>
                        Data:
                        <input
                            value={dataEvento}
                            onChange={(e) => setDataEvento(e.target.value)}
                            type="date"
                            required
                        />
                    </label>
                    <label>
                        Hora do Evento:
                        <input
                            value={horaEvento}
                            onChange={(e) => setHoraEvento(e.target.value)}
                            type="time"
                            required
                        />
                    </label>
                    <button type="submit">SALVAR</button>
                </form>
            </div>

        </div>
    );
}

export default EditarEvento;