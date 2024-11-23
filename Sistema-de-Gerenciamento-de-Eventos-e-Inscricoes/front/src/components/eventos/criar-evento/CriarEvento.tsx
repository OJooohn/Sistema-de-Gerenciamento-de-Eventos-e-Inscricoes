import { Usuario } from "../../../interfaces/Usuario";
import { Evento } from "../../../interfaces/Evento";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './CriarEvento.css';

function CriarEvento() {
    
    const navigate = useNavigate();
    
    // Pegar informações do usuário logado
    const token = localStorage.getItem('usuario');
    const [usuario, setUsuario] = useState<Usuario>();

    useEffect(() => {
        fetch(`http://localhost:5136/sistema/usuario/buscar/${token}`)
        .then(response => {
            if (!response.ok) {
                // console.log(Global.usuario);
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
    }, [token]);

    // Criar evento
    const [nomeEvento, setNomeEvento] = useState<string>('');
    const [descricaoEvento, setDescricaoEvento] = useState<string>('');

    const [dataEvento, setDataEvento] = useState<string>('');
    const [horaEvento, setHoraEvento] = useState<string>('');
    const dataHoraEvento = `${dataEvento}T${horaEvento}:00`;

    const [vagasMaximo, setVagasMaximo] = useState<number>(0);

    function handleCriarEvento(e : any) {
        e.preventDefault();

        const novoEvento: Evento = {
            nome: nomeEvento,
            descricao: descricaoEvento,
            dataEvento: dataHoraEvento,
            vagasMaximo: Number(vagasMaximo),
            proprietarioId: usuario?.id || 0,
        }

        fetch('http://localhost:5136/sistema/evento/criar', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoEvento),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro ao criar evento');
                }
                return response.json();
            })
            .then(() => {
                alert('Evento criado com sucesso!');
                navigate('/');
            })
    }

    return (
        <div className="criar-evento">
            <div className="card-criar-evento">
                <div className="criar-evento-title">
                    <h1>CRIAR EVENTO</h1>
                </div>
                <form onSubmit={handleCriarEvento}>
                    <label>
                        Nome do Evento:
                        <input
                            onChange={(e) => setNomeEvento(e.target.value)}
                            type="text"
                            required
                        />
                    </label>
                    <label>
                        Descricao do Evento:
                        <input
                            onChange={(e) => setDescricaoEvento(e.target.value)}
                            type="text"
                            required/>
                    </label>
                    <label>
                        Vagas:
                        <input
                            onChange={(e) => setVagasMaximo(Number(e.target.value))}
                            type="number"
                            required
                        />
                    </label>
                    <label>
                        Data:
                        <input
                            onChange={(e) => setDataEvento(e.target.value)}
                            type="date"
                            required
                        />
                    </label>
                    <label>
                        Hora do Evento:
                        <input
                        type="time"
                        onChange={(e) => setHoraEvento(e.target.value)}
                        required
                        />
                    </label>
                    <button type="submit">CRIAR</button>
                </form>
            </div>
        </div>
    );

}

export default CriarEvento;