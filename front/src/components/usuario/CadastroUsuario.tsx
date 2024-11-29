import { Usuario } from "../../models/Usuario";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import './StyleForms.css'

function CadastroUsuario() {

    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const [perfil, setPerfil] = useState('');

    const [mensagem, setMensagem] = useState('');

    async function handleCadastro(e : React.FormEvent) {
        e.preventDefault();

        if (senha != confirmarSenha) {
            setMensagem('As senhas não conferem');
            return;
        }

        const usuario : Usuario = {
            nome: nome,
            email: email,
            senha: senha,
            perfil: perfil
        }
        
        try {
            const response = await axios.post('http://localhost:5136/sistema/usuario/registrar', usuario, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // console.log(response.data);
            setMensagem('Usuário cadastrado com sucesso');
            
            // alert('Usuário cadastrado com sucesso');

            navigate('/sistema/usuario/login');
        } catch (error) {
            console.error(error);
            setMensagem('Erro ao cadastrar usuário');
        }
    }

    return (
        <div className="card">
            <div className="form-card">
                <h1>Cadastro de Usuário</h1>
                <hr></hr>
                <form onSubmit={handleCadastro}>

                    {mensagem && (
                        <div className="message-box">
                            <p>{mensagem}</p>
                            <button onClick={() => setMensagem('')}>{"\u00D7"}</button>
                        </div>
                    )}

                    <label htmlFor="nome">Nome :</label>
                    <input type="text" id="nome" name="nome" required placeholder="Digite seu nome" onChange={(e) => setNome(e.target.value)}></input>

                    <label htmlFor="email">Email :</label>
                    <input type="email" name="email" id="email" placeholder="Digite seu e-mail" required onChange={(e) => setEmail(e.target.value)}/>

                    <label htmlFor="senha">Senha :</label>
                    <input type="password" name="senha" id="senha" placeholder="Crie uma senha" required onChange={(e) => setSenha(e.target.value)}/>

                    <label htmlFor="confirmarSenha">Confirmar Senha :</label>
                    <input type="password" name="confirmarSenha" id="confirmarSenha" placeholder="Digite sua senha" required onChange={(e) => setConfirmarSenha(e.target.value)}/>

                    <label htmlFor="perfil">Perfil :</label>
                    <select required value={perfil} onChange={(e) => setPerfil(e.target.value)}>
                        <option value="" disabled selected>Selecione um Perfil</option>
                        <option value="Participante">Participante</option>
                        <option value="Organizador">Organizador</option>
                    </select>

                    <div className="form-buttons">
                        <button className="cancel-btn" type="button" onClick={() => navigate('/login')}>Cancelar</button>
                        <button className="submit-btn" type="submit">Cadastrar</button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default CadastroUsuario;