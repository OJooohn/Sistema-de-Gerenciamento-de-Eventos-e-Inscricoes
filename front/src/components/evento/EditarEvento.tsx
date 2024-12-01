import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Evento } from "../../models/Evento";
import '../global/StyleForms.css';

function EditarEvento() {
    const navigate = useNavigate();

    const [mensagem, setMensagem] = useState('');

    const usuarioID = JSON.parse(localStorage.getItem('usuario')?.toString() || '{}').id;
    const eventoID = useParams().id;

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [vagasMaximo, setVagasMaximo] = useState(0);

    const minDateTime = new Date().toISOString().slice(0, 16);

    useEffect(() => {
        axios.get(`http://localhost:5136/sistema/evento/buscar/` + eventoID)
            .then((response) => {
                if (response.status === 200) {
                    setNome(response.data.nome);
                    setDescricao(response.data.descricao);
                    setDataHora(response.data.dataEvento);
                    setVagasMaximo(response.data.vagasMaximo);
                }
            })
            .catch((error) => {
                console.error(error);
                setMensagem('Erro ao buscar evento');
            });
    }, [eventoID]);

    function handleEditarEvento(e : React.FormEvent) {
        e.preventDefault();

        const eventoEditado : Evento = {
            nome : nome,
            descricao : descricao,
            dataEvento : dataHora,
            vagasMaximo : vagasMaximo,
            proprietarioId : usuarioID
        }

        axios.put(`http://localhost:5136/sistema/evento/alterar/${eventoID}`, eventoEditado, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    navigate('/sistema/eventos/meus-eventos');
                }
            })
            .catch(error => {
                console.error(error);
                setMensagem(error.response?.data?.mensagem || 'Erro ao editar evento');
            });
    }

    return (
        <div className="card">
            <div className="form-card">
                <h1>Editar Evento</h1>
                <hr></hr>

                <form onSubmit={handleEditarEvento}>
                    {mensagem && (
                        <div className="message-box">
                            <p>{mensagem}</p>
                            <button onClick={() => setMensagem('')}>{"\u00D7"}</button>
                        </div>
                    )}


                    <label htmlFor="nome">Nome :</label>
                    <input type="text" id="nome" name="nome"
                        value={nome}
                        required
                        placeholder="Digite o nome do evento"
                        onChange={(e) => setNome(e.target.value)}>
                    </input>

                    <label htmlFor="descrição">Descrição :</label>
                    <input type="text" id="descrição" name="descrição" required
                        value={descricao}
                        placeholder="Digite a descrição do evento"
                        onChange={(e) => setDescricao(e.target.value)}>
                    </input>

                    <label htmlFor="vagasMaximo">Vagas Totais:</label>
                    <input type='number' id='vagasMaximo' name='vagasMaximo' required
                        value={vagasMaximo}
                        placeholder='Digite o número máximo de vagas'
                        min={1}
                        onChange={(e) => setVagasMaximo(Number(e.target.value))}>
                    </input>

                    <label htmlFor="dataHora">Data e Hora :</label>
                    <input type='datetime-local' id='dataHora' name='dataHora' required 
                        value={dataHora}
                        placeholder='Digite a data e hora' min={minDateTime} 
                        onChange={(e) => setDataHora(e.target.value)}>
                    </input>

                    <div className="form-buttons">
                        <button className="cancel-btn" type="button" onClick={() => navigate('/sistema/eventos/meus-eventos')}>Cancelar</button>
                        <button className="submit-btn" type="submit">Editar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarEvento;