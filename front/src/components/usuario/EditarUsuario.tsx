import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './StyleForms.css';
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
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`http://localhost:5136/sistema/usuario/completo/buscarID/${usuarioID}`);

                if (response.status == 200) {
                    setUsuario(response.data);
                    setNome(response.data.nome);
                    setEmail(response.data.email);
                    return;
                }

                setMensagem('Usuário não encontrado');
            } catch (error) {
                console.error(error);
                setMensagem('Erro ao buscar usuário');
            }
        };

        fetchUsuario();
    }, []);

    async function handleEditarUsuario(e : React.FormEvent) {
        e.preventDefault();

        if (senhaDigitada != usuario?.senha) {
            console.log(senhaDigitada);
            console.log(usuario?.senha);
            setMensagem('Senha incorreta');
            return;
        }

        try {
            const usuario : Usuario = {
                nome : nome,
                email : email,
                senha : senhaDigitada
            }

            console.log(usuario);

            const response = await axios.put(`http://localhost:5136/sistema/usuario/atualizar/` + usuarioID, usuario, {method : 'PUT'});

            if (response.status == 200) {
                setMensagem('Usuário editado com sucesso');
                navigate('/login');
                return;
            }

            setMensagem('Erro ao editar usuário');
        } catch (error) {
            console.error(error);
            setMensagem('Erro ao editar usuário');
        }
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
                        <button className="cancel-btn" type="button" onClick={() => navigate('/login')}>Cancelar</button>
                        <button className="submit-btn" type="submit">EDITAR</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditarUsuario;