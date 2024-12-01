import { Link } from 'react-router-dom';
import './DashboardPage.css';
import { useEffect, useState } from 'react';
import { Usuario } from '../../models/Usuario';
import axios from 'axios';
import { Inscricao } from '../../models/Inscricao';

function DashboardPage() {

    const usuarioID = JSON.parse(localStorage.getItem('usuario') || '{}').id;
    const [usuario, setUsuario] = useState<Usuario>();

    const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

    const fetchInscricoes = async () => {
        axios.get(`http://localhost:5136/sistema/usuario/listar-inscricoes/${usuarioID}`)
            .then((response) => {
                if(response.status === 200)
                    setInscricoes(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchUsuario = async () => {
        axios.get(`http://localhost:5136/sistema/usuario/basico/buscarID/${usuarioID}`)
            .then((response) => {
                if(response.status === 200)
                    setUsuario(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchInscricoes();
        fetchUsuario();
    }, [usuarioID]);

    return(
        <div className='card'>
            <div className='dashboard-card'>
                <h1>Dashboard</h1>
                <hr></hr>
                <p>Bem-vindo(a) ao nosso site! Aproveite para explorar os eventos dísponíveis clicando no botão de <strong style={{color: '#3eb9a4', fontWeight: '300'}}>EVENTOS</strong>, se interessar por algum, inscreva-se nele e aproveite. 
                    Se você for algum organizador, além de poder criar seu próprio evento, também pode participar de outros eventos!</p>
                
                <hr></hr>
                <div className='dashboard-buttons'>
                    <Link to='/sistema/eventos/listar'>Eventos</Link>
                    {inscricoes.length > 0 && (
                        <Link to="/sistema/eventos/minhas-inscricoes">Minhas Inscrições</Link>
                    )}
                    {usuario?.perfil === 'Organizador' && (
                        <>
                            <Link to='/sistema/evento/criar'>Criar Eventos</Link>
                            <Link to='/sistema/eventos/meus-eventos'>Meus Eventos</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;