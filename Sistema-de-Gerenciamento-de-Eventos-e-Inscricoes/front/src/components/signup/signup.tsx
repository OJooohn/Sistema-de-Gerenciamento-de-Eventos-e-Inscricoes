import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [nome, setNome] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [confirmarSenha, setConfirmarSenha] = useState<string>('');
    const [perfil, setPerfil] = useState<string>('');

    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (senha !== confirmarSenha) {
            alert('As senhas não conferem');
            return;
        }

        const novoUsuario = {
            nome,
            email,
            senha,
            perfil,
        };

        fetch('http://localhost:5136/sistema/usuario/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoUsuario),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro ao registrar usuário');
                }
                return response.json();
            })
            .then(() => {
                setNome('');
                setEmail('');
                setSenha('');
                setConfirmarSenha('');
                setPerfil('');
                alert('Usuário registrado com sucesso!');
                
                navigate('/login');
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }

    return (
        <div className="signup">
            <h1>Cadastrar Novo Usuário</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome:
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </label>
                <label>
                    E-mail:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Senha:
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Confirmar Senha:
                    <input
                        type="password"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Perfil:
                    <select
                        value={perfil}
                        onChange={(e) => setPerfil(e.target.value)}
                        required
                    >
                        <option value="">Selecione o perfil</option>
                        <option value="Organizador">Organizador</option>
                        <option value="Participante">Participante</option>
                    </select>
                </label>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default Signup;
