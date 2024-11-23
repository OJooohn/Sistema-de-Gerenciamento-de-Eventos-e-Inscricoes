import { Usuario } from "../../../interfaces/Usuario";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./login.css";

function Login() {
    const navigate = useNavigate();

    // Pegar informações do usuário logado
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        fetch(`http://localhost:5136/sistema/usuario/listar`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao obter usuário");
            }
            return response.json();

        })
        .then(data => {
            setUsuarios(data);
        })
        .catch(error => {
            console.error("Erro:", error);
        })
    })
    
    // Realizar login
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    function handleLogin(e: any) {
        e.preventDefault();

        const usuario = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);

        if (!usuario) {
            alert('E-mail ou senha inválidos');
            return;
        }
        
        localStorage.setItem('usuario', usuario.email);
        navigate('/');
    }

    return (
        <div className="login">
            <div className="card-login">
                
                <div className="card-login-title">
                    <h1>Login</h1>
                </div>

                <div className="form-login-card">
                    <form onSubmit={handleLogin}>
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
                        <div className="login-button">
                            <button type="submit">ENTRAR</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Login;
