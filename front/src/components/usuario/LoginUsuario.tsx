import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import './StyleForms.css'

function LoginUsuario() {

    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');

    const [mensagem, setMensagem] = useState<string>('');

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:5136/sistema/usuario/buscar/${email}`);

            if (response.data.senha !== senha) {
                setMensagem('Senha incorreta');
                return;
            }

            // Store as an object with an 'id' property
            localStorage.setItem('usuario', JSON.stringify({ id: response.data.id }));
            // console.log(localStorage.getItem('usuario'));
            navigate('/sistema/dashboard');
        } catch (error) {
            console.error(error);
            setMensagem('Usuário não encontrado');
        }
    }

    return (
        <div className="card">
            <div className="form-card">
                <h1>Login</h1>
                <hr></hr>
                <form onSubmit={handleLogin}>
                    {mensagem && (
                        <div className="message-box">
                            <p>{mensagem}</p>
                            <button onClick={() => setMensagem('')}>{"\u00D7"}</button>
                        </div>
                    )}


                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required 
                        onChange={(e) => setEmail(e.target.value)} 
                        autoComplete="username">
                    </input>

                    <label htmlFor="senha">Senha:</label>
                    <input type="password" id="senha" name="senha" required 
                        onChange={(e) => setSenha(e.target.value)} 
                        autoComplete="current-password">
                    </input>

                    <p className="sign-up">Não tem uma conta? <Link to="/sistema/usuario/cadastrar">Cadastre-se</Link></p>
                    <button className="submit-btn" type="submit">Login</button>
                </form>
            </div>
        </div>
    );

}

export default LoginUsuario;