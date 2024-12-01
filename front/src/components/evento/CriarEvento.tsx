import { Evento } from '../../models/Evento';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import '../global/StyleForms.css';
import axios from 'axios';
import { Usuario } from '../../models/Usuario';

function CriarEvento() {
    const usuarioID = JSON.parse(localStorage.getItem('usuario')?.toString() || '{}').id;
    const [usuario, setUsuario] = useState<Usuario>();

    const navigate = useNavigate();

    const [mensagem, setMensagem] = useState('');

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [vagasMaximo, setVagasMaximo] = useState(0);

    // Calcula a data e hora atual no formato 'YYYY-MM-DDTHH:mm'
    const minDateTime = new Date().toISOString().slice(0, 16);

    useEffect(() => {
        if (!usuarioID) {
            navigate('/sistema/usuario/login');
            return;
        }

        axios.get(`http://localhost:5136/sistema/usuario/basico/buscarID/${usuarioID}`)
            .then((response) => {
                if (response.status === 200) {
                    if(response.data.perfil != 'Organizador') {
                        navigate('/sistema/dashboard');
                        return;
                    }

                    setUsuario(response.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    })

    function handleCriarEvento(e : React.FormEvent) {
        e.preventDefault();

        const evento : Evento = {
            nome : nome,
            descricao : descricao,
            dataEvento : dataHora + ':00',
            vagasMaximo : vagasMaximo,
            proprietarioId : usuarioID
        }

        axios.post('http://localhost:5136/sistema/evento/criar', evento, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            }
        })
            .then((response) => {
                if(response.status === 201) {
                    setMensagem('Evento criado com sucesso');
                    navigate('/sistema/dashboard');
                    return;
                }
            })
            .catch((error) => {
                console.error(error);
                setMensagem(error.response?.data?.mensagem || 'Erro ao editar evento');
            });
    }

    return (
        <div className="card">
            <div className="form-card">
                <h1>Criar Evento</h1>
                <hr></hr>

                <form onSubmit={handleCriarEvento}>
                    {mensagem && (
                        <div className="message-box">
                            <p>{mensagem}</p>
                            <button onClick={() => setMensagem('')}>{"\u00D7"}</button>
                        </div>
                    )}

                    <label htmlFor="nome">Nome :</label>
                    <input type="text" id="nome" name="nome" required 
                        placeholder="Digite o nome do evento" 
                        onChange={(e) => setNome(e.target.value)}>
                    </input>

                    <label htmlFor="descrição">Descrição :</label>
                    <input type="text" id="descrição" name="descrição" required
                        placeholder="Digite a descrição do evento"
                        onChange={(e) => setDescricao(e.target.value)}>
                    </input>

                    <label htmlFor="vagasMaximo">Vagas Totais:</label>
                    <input type='number' id='vagasMaximo' name='vagasMaximo' required
                        placeholder='Digite o número máximo de vagas'
                        min={1}
                        onChange={(e) => setVagasMaximo(Number(e.target.value))}>
                    </input>

                    <label htmlFor="dataHora">Data e Hora :</label>
                    <input type='datetime-local' id='dataHora' name='dataHora' required 
                        placeholder='Digite a data e hora' min={minDateTime} 
                        onChange={(e) => setDataHora(e.target.value)}>
                    </input>

                    <div className="form-buttons">
                        <button className="cancel-btn" type="button" onClick={() => navigate('/sistema/dashboard')}>Cancelar</button>
                        <button className="submit-btn" type="submit">Criar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CriarEvento;