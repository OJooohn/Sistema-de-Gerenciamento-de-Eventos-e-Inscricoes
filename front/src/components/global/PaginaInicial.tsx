import { FaCuttlefish, FaDatabase, FaReact } from 'react-icons/fa';
import './PaginaInicial.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Usuario } from '../../models/Usuario';

function PaginaInicial() {

    const navigate = useNavigate();

    const isLogged = Boolean(JSON.parse(localStorage.getItem('usuario') || '{}').id);

    const usuarioID = JSON.parse(localStorage.getItem('usuario') || '{}').id;
    const [usuario, setUsuario] = useState<Usuario>();

    const beneficios = [
        "Gestão eficiente de eventos",
        "Facilidade no gerenciamento de inscrições",
        "Interface amigável e responsiva",
        "Relatórios detalhados e análises de dados",
        "Segurança e confiabilidade"
    ];

    useEffect(() => {
        if(!usuarioID) return;

        axios.get(`http://localhost:5136/sistema/usuario/basico/buscarID/${usuarioID}`)
            .then((response) => {
                if(response.status === 200)
                    setUsuario(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [usuarioID]);

    function handleCriarEventoPage() {
        if(isLogged) {
            if(usuario?.perfil === 'Participante') {
                alert('Apenas organizadores podem criar eventos');
                return;
            }

            navigate('/sistema/evento/criar');
        } else {
            alert('Faça login para criar um evento');
            navigate('/sistema/usuario/login');
        }
    }

    return (
        <div className="pagina-inicial">
            <div className='center-content'>
                <div className='title-home'>
                    <h1>Sistema de Gerenciamento de Eventos e Inscrições</h1>
                    <hr></hr>
                    <p>Olá, seja bem-vindo(a) ao nosso site! Sinta-se à vontade para explorar e descobrir como nosso sistema pode facilitar a gestão dos seus eventos.</p>
                </div>

                <div className='home-cards'>
                    <section className="sobre-projeto">
                        <h2>Sobre o Projeto</h2>
                        <hr></hr>
                        <div className='center-div'>
                            <p>
                                Nosso sistema foi desenvolvido para simplificar o processo de criação, gerenciamento e monitoramento de eventos, bem como o gerenciamento de inscrições de participantes. Com uma interface intuitiva e funcionalidades robustas, você pode focar no sucesso dos seus eventos sem se preocupar com a complexidade da gestão.
                            </p>
                        </div>
                    </section>

                    <section className='integrantes'>
                        <h2>Integrantes do Projeto</h2>
                        <hr></hr>
                        <div className='center-div'>
                            <ul>
                                <li>Eduardo Cornehl Wozniak</li>
                                <li>John Claude Cameron Chappell</li>
                                <li>Pedro Miguel Radwanski</li>
                            </ul>
                        </div>
                    </section>

                    <section className="tecnologias-utilizadas">
                        <h2>Tecnologias Utilizadas</h2>
                        <hr></hr>
                        <div className='center-div'>
                            <ul>
                                <li><FaCuttlefish />.NET</li>
                                <li><FaDatabase />SQLite</li>
                                <li><FaReact />React</li>
                            </ul>
                        </div>
                    </section>

                    <section className="beneficios">
                        <h2>Benefícios do Sistema</h2>
                        <hr></hr>
                        <div className='center-div'>
                            <ul>
                                {beneficios.map((beneficio, index) => (
                                    <li key={index}>{beneficio}</li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section className='criar-evento-home'>
                        <h2>Transforme Suas Visões em Eventos Inesquecíveis</h2>
                        <div className='separator'>
                            <div className='left-side-home'>
                                <p>
                                    Seja o arquiteto de experiências únicas. Nossa plataforma oferece todas as ferramentas necessárias para que você possa criar,
                                    gerenciar e promover eventos de alto impacto com facilidade e eficiência. Para começar, clique no botão ao lado.
                                </p>
                            </div>
                            <div className='vertical-bar'></div>
                            <div className='right-side-home'>
                                <button onClick={handleCriarEventoPage}>Criar Evento</button>
                            </div>
                        </div>
                    </section>
            </div>
            </div>
        </div>
    );
}

export default PaginaInicial;