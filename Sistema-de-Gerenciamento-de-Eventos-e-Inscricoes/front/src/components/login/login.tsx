import { useEffect, useState } from "react";
import { Usuario } from "../../interfaces/Usuario";
import Global from "../../Global";
import { useNavigate } from "react-router-dom";
import NavBar from "../nav-bar/NavBar";
import "./login.css";

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const navigate = useNavigate();

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

    function handleSubmit(e: any) {
        e.preventDefault();

        const usuario = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);

        if (!usuario) {
            alert('E-mail ou senha inválidos');
            return;
        }
        
        localStorage.setItem('usuario', usuario.email);
        navigate('/perfil');
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
