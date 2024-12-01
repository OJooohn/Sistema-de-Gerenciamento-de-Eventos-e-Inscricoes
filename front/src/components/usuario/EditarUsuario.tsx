import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import '../global/StyleForms.css';
import axios from 'axios';
import { Usuario } from '../../models/Usuario';

function EditarUsuario() {

    const navigate = useNavigate();

    const [mensagem, setMensagem] = useState('');

    const [usuario, setUsuario] = useState<Usuario>();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const [senhaDigitada, setSenhaDigitada] = useState('');

    const usuarioID = JSON.parse(localStorage.getItem('usuario')?.toString() || '{}').id;

    useEffect(() => {
        axios.get(`http://localhost:5136/sistema/usuario/completo/buscarID/${usuarioID}`)
        .then(response => {
            setUsuario(response.data);
            setNome(response.data.nome);
            setEmail(response.data.email);
        })
        .catch((error) => {
            console.error(error);
            setMensagem('Erro ao buscar usuário');
        })
    }, [usuarioID]);

    async function handleEditarUsuario(e : React.FormEvent) {
        e.preventDefault();

        if (senhaDigitada !== usuario?.senha) {
            console.log(senhaDigitada);
            console.log(usuario?.senha);
            setMensagem('Senha incorreta');
            return;
        }

        const usuarioEditado : Usuario = {
            nome : nome,
            email : email,
            senha : senhaDigitada
        }

        axios.put(`http://localhost:5136/sistema/usuario/atualizar/` + usuarioID, usuarioEditado, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setMensagem('Usuário editado com sucesso');
                    navigate('/sistema/usuario/login');
                    return;
                }
            })
            .catch((error) => {
                console.error(error);
                setMensagem(error.response?.data?.mensagem || 'Erro ao editar evento');
            })
    };

    return (
        <div className='card'>
            <div className='form-card'>
                <h1>Editar Usuario</h1>
                <hr></hr>
                <form onSubmit={handleEditarUsuario}>
                    {mensagem && (
                        <div className="message-box">
                            <p>{mensagem}</p>
                            <button onClick={() => setMensagem('')}>{"\u00D7"}</button>
                        </div>
                    )}

                    <label htmlFor="nome">Nome :</label>
                    <input value={nome} type="text" id="nome" name="nome" required placeholder='Digite seu nome' onChange={(e) => setNome(e.target.value)}></input>

                    <label htmlFor="email">Email :</label>
                    <input value={email} type="email" name="email" id="email" required placeholder='Digite seu e-mail' autoComplete='username' onChange={(e) => setEmail(e.target.value)}/>

                    <label htmlFor="senha">Confirmar senha :</label>
                    <input type="password" name="senha" id="senha" required placeholder='Confime sua senha' autoComplete='current-password' onChange={(e) => setSenhaDigitada(e.target.value)}/>

                    <div className="form-buttons">
                        <button className="cancel-btn" type="button" onClick={() => navigate('/sistema/usuario/perfil')}>Cancelar</button>
                        <button className="submit-btn" type="submit">Editar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditarUsuario;